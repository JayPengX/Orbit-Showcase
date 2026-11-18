// A link to where the page already is still answers (the address doesn't change, so
// nothing told the page): on a phone, in 整個系統, a search hit tapped again after its
// card was closed did nothing, and a card's chip to the part read last time landed on
// the tree with no card (11-18).
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

test('a link to the address the page already has runs the route; a link to the open part opens its card again', () => {
  const app = readFileSync(new URL('../public/app.mjs', import.meta.url), 'utf8');
  const how = readFileSync(new URL('../public/views/how.mjs', import.meta.url), 'utf8');
  assert.match(app, /if \(href === location\.hash && current !== 'main'\) \(e\.preventDefault\(\), route\(\)\);/);
  assert.match(app, /renderHow\(VIEWS\.how, r\.what, viaLink\);/);
  assert.match(how, /if \(id && id === picked && from === 'tree' && !viaLink\) return;/);
});

// The page itself, on a phone: the showcase at /Orbit-Showcase/, the kit beside it.
const TYPES = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png' };
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

test('on a phone: a search hit tapped twice opens its card twice; a chip to the part read before opens its card', async t => {
  if (!chromium || !existsSync(chromium.executablePath()) || !existsSync(join(root, '.kit', 'ui.mjs'))) return t.skip('no Chromium or no kit here');
  const { srv, url } = await serve();
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-TW', hasTouch: true, isMobile: true, reducedMotion: 'reduce' })).newPage();
    await page.route(u => !u.href.startsWith(url.slice(0, url.indexOf('/Orbit-Showcase/'))), r => r.abort());
    const card = () => page.evaluate(() => Boolean(document.querySelector('dialog[open] .sc-detail-in')));
    const shut = async () => (await page.keyboard.press('Escape'), await page.waitForFunction(() => !document.querySelector('dialog[open] .sc-detail-in')));
    await page.goto(`${url}#how`);
    await page.waitForSelector('.sc-ov-head');
    await page.fill('.sc-search', '颱風');
    await page.click('.sc-hit');
    await page.waitForSelector('dialog[open] .sc-detail-in');
    await shut();
    await page.click('.sc-hit');
    await page.waitForSelector('dialog[open] .sc-detail-in', { timeout: 4000 }).catch(() => {});
    assert.equal(await card(), true, 'the same search hit, tapped again');
    await shut();
    // From the page: a card's chip to another part, back, the same chip again.
    const viaChip = async () => {
      await page.goto(`${url}#decide`);
      await page.waitForSelector('.sc-dec[data-card="pass-vault"] .sc-howgo');
      await page.click('.sc-dec[data-card="pass-vault"] .sc-howgo');
      await page.waitForSelector('dialog[open] .sc-chip');
      await page.evaluate(() => document.querySelector('dialog[open] .sc-chip').click());
      await page.waitForFunction(() => document.documentElement.dataset.view === 'how');
      await page.waitForSelector('dialog[open] .sc-detail-in', { timeout: 4000 }).catch(() => {});
      return card();
    };
    assert.equal(await viaChip(), true, 'a chip opens its part');
    await shut();
    await page.click('.sc-sub-back');
    await page.waitForFunction(() => document.documentElement.dataset.view === 'main');
    assert.equal(await viaChip(), true, 'the same chip, a second time');
  } finally {
    await browser.close();
    srv.close();
  }
});
