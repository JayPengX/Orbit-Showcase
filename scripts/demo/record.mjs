// Records one app for its demo: serves it signed in with made-up answers
// (Shared-Proxy/tools/preview.mjs --serve), opens it on a phone-sized page
// at a fixed clock, walks the steps in scripts/demo/apps.mjs, and keeps
// every answer the page got. build.mjs turns the record into the frozen copy
// under public/demo/. Run with the family's repos beside each other:
//   node scripts/demo/record.mjs <app> [--repos dir] [--shots dir]
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { DEMOS } from './apps.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i < 0 ? fallback : args.splice(i, 2)[1];
};
const repos = resolve(opt('repos', new URL('../../..', import.meta.url).pathname));
const shots = opt('shots', '');
const id = args[0];
const demo = DEMOS[id];
if (!demo) throw new Error(`no demo called ${id}: ${Object.keys(DEMOS).join(', ')}`);

const require = createRequire(import.meta.url);
const playwright = (() => {
  try {
    return require('playwright');
  } catch {
    return require('/opt/node22/lib/node_modules/playwright');
  }
})();

// The app's saved data to open on: written by the demo's own script (made up, never real).
let payload = '';
if (demo.payload) {
  payload = join(mkdtempSync(join(tmpdir(), 'demo-')), 'payload.txt');
  writeFileSync(payload, execFileSync(process.execPath, [new URL(`../../${demo.payload}`, import.meta.url).pathname, repos, demo.clock]));
}
const port = 8300 + Object.keys(DEMOS).indexOf(id);
const serveArgs = [join(repos, 'Shared-Proxy/tools/preview.mjs'), demo.app, '--serve', '--port', String(port), '--root', repos, ...(payload ? ['--payload', payload] : []), ...(demo.serve || [])];
const server = spawn(process.execPath, serveArgs, { stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((ok, no) => {
  server.stdout.on('data', d => /serving/.test(String(d)) && ok());
  server.on('exit', c => no(new Error(`preview exited ${c}`)));
});

const browser = await playwright.chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'zh-TW',
  timezoneId: 'Asia/Taipei',
  geolocation: { latitude: demo.geo[0], longitude: demo.geo[1], accuracy: 20 },
  permissions: ['geolocation'],
  serviceWorkers: 'block'
});
const page = await context.newPage();
// 'now': frozen at the moment of recording, for apps that read live feeds (their answers are today's).
const at = demo.clock === 'now' ? Date.now() : Date.parse(demo.clock);
await page.clock.install({ time: at });
// The same luck as the demo's sandbox (shim.js), so what the app picks by
// chance while recording is what it picks in the showcase.
await page.addInitScript(() => {
  let seed = 20261027;
  Math.random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
});
const got = [];
const misses = [];
page.on('response', async r => {
  const req = r.request();
  let body = null;
  try {
    body = await r.body();
  } catch {}
  if (body === null) return;
  got.push({ url: req.url(), method: req.method(), post: req.postData() || '', status: r.status(), type: r.headers()['content-type'] || '', body: body.toString('base64') });
});
page.on('requestfailed', req => misses.push(req.url()));
page.on('pageerror', e => console.log('page error:', e.message));

const base = `http://localhost:${port}/${demo.repo}/`;
await page.goto(base + (demo.hash || ''));
await page.waitForTimeout(demo.settle || 4000);
let n = 0;
const snap = async label => shots && (mkdirSync(shots, { recursive: true }), await page.screenshot({ path: join(shots, `${id}-${String(n++).padStart(2, '0')}-${label}.png`) }));
await snap('open');
for (const step of [...(demo.tour || []), ...(demo.explore || [])]) {
  try {
    if (step.hash) await page.evaluate(h => (location.hash = h), step.hash);
    if (step.tap) await page.locator(step.tap).locator('visible=true').first().click({ timeout: 5000 });
    if (step.type) await page.locator(step.type[0]).first().fill(step.type[1]);
    if (step.back) await page.goBack();
    await page.waitForTimeout(step.wait || 1500);
    await snap(String(step.tap || step.hash || step.type?.[0] || 'back').replace(/[^\w-]+/g, '_').slice(0, 40));
  } catch (e) {
    console.log('step failed:', JSON.stringify(step), e.message.split('\n')[0]);
  }
}
await browser.close();
server.kill();

const out = join(repos, '.demo-records');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, `${id}.json`), JSON.stringify({ id, base, at, got, misses }));
console.log(`${id}: ${got.length} answers, ${misses.length} failed${misses.length ? `: ${misses.slice(0, 5).join(' ')}` : ''}`);
