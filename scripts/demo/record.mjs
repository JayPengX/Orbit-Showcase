// Records one app for its demo: serves it signed in with made-up answers
// (Shared-Proxy/tools/preview.mjs --serve), opens it on a phone-sized page
// at a fixed clock, walks the steps in scripts/demo/apps.mjs, and keeps
// every answer the page got. build.mjs turns the record into the frozen copy
// under public/demo/. Run with the family's repos beside each other:
//   node scripts/demo/record.mjs <app> [--repos dir] [--shots dir]
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
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

const port = 8300 + Object.keys(DEMOS).indexOf(id);
const serveArgs = [join(repos, 'Shared-Proxy/tools/preview.mjs'), demo.app, '--serve', '--port', String(port), '--root', repos, ...(demo.payload ? ['--payload', resolve(demo.payload)] : []), ...(demo.serve || [])];
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
const at = Date.parse(demo.clock);
await page.clock.install({ time: at });
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
    if (step.tap) await page.locator(step.tap).first().click({ timeout: 5000 });
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
