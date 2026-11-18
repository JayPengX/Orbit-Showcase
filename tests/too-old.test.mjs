// A browser too old for the page is told so (11-18). Every module here is
// reached through the page's import map (#kit/…), which Safari has only had
// since 16.4: before it nothing runs, and the page was blank with no word why.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';

let chromium = null;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {}
const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');

test("the page's shell asks whether the browser has import maps, in a script an old one can read, before its modules", () => {
  const note = html.match(/<script>(!function\(o,t\)\{[\s\S]*?)<\/script>/)?.[1] || '';
  assert.match(note, /HTMLScriptElement\.supports\('importmap'\)/);
  assert.ok(html.indexOf(note) < html.indexOf('<script type="module" src="./app.mjs">'), 'before the modules');
  // (Nothing newer than a browser of 2015 reads: no arrow, const, let, template or ?. in it.)
  assert.doesNotMatch(note, /=>|\bconst\b|\blet\b|`|\?\.|\?\?/);
  assert.match(note, /iOS 16\.4 以上/);
  assert.match(note, /iOS 16\.4 or later/);
});

const TYPES = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const serve = () =>
  new Promise(done => {
    const srv = createServer(async (req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const file = p.startsWith('/Orbit-Showcase/') ? join(root, 'public', normalize(p.slice(16))) : p.startsWith('/Orbit-Core/kit/') ? join(root, '.kit', normalize(p.slice(16))) : '';
      try {
        const body = await readFile(file);
        res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end();
      }
    });
    srv.listen(0, '127.0.0.1', () => done({ srv, url: `http://127.0.0.1:${srv.address().port}/Orbit-Showcase/` }));
  });

test('a browser with no import maps reads why, in its language; one that has them never sees the line', async t => {
  if (!chromium || !existsSync(chromium.executablePath()) || !existsSync(join(root, '.kit', 'ui.mjs'))) return t.skip('no Chromium or no kit here');
  const { srv, url } = await serve();
  const browser = await chromium.launch();
  const open = async (locale, old) => {
    const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, locale })).newPage();
    await page.route(u => !u.href.startsWith(url.slice(0, url.indexOf('/Orbit-Showcase/'))), r => r.abort());
    if (old) {
      // As that Safari: it can't say it has import maps, and no module of the page runs.
      await page.addInitScript(() => (HTMLScriptElement.supports = () => false));
      await page.route(u => u.pathname.endsWith('/app.mjs'), r => r.abort());
    }
    await page.goto(url);
    return page;
  };
  try {
    const zh = await open('zh-TW', true);
    await zh.waitForSelector('#too-old', { timeout: 8000 });
    assert.match(await zh.textContent('#too-old'), /版本太舊.*iOS 16\.4 以上/);
    assert.equal(await zh.evaluate(() => document.getElementById('bar').childElementCount), 0, 'nothing else drew');
    const en = await open('en-US', true);
    await en.waitForSelector('#too-old', { timeout: 8000 });
    assert.match(await en.textContent('#too-old'), /too old to open this page.*iOS 16\.4 or later/);
    const now = await open('zh-TW', false);
    await now.waitForSelector('#bar > *');
    await now.waitForTimeout(3600);
    assert.equal(await now.evaluate(() => Boolean(document.getElementById('too-old'))), false, 'a current browser never sees it');
    // One that can't say so but has them (a Chrome of 2021): the page draws, so no line.
    const mute = await (await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-TW' })).newPage();
    await mute.route(u => !u.href.startsWith(url.slice(0, url.indexOf('/Orbit-Showcase/'))), r => r.abort());
    await mute.addInitScript(() => (HTMLScriptElement.supports = undefined));
    await mute.goto(url);
    await mute.waitForSelector('#bar > *');
    await mute.waitForTimeout(3600);
    assert.equal(await mute.evaluate(() => Boolean(document.getElementById('too-old'))), false, 'the page drew: no line');
  } finally {
    await browser.close();
    srv.close();
  }
});
