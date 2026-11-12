// At 320: a phone demo's label beside 即時 and ↻ is never cut with …, and
// the homepage's Orbit line never splits 法律 (2026-11-12: 「試玩 · 範例資料，什麼都…」;
// 「法 / 律」 across two lines).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';

let chromium = null;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {}
const demo = readFileSync(new URL('../public/views/demo.mjs', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/showcase.css', import.meta.url), 'utf8');
const home = readFileSync(new URL('../public/home/index.html', import.meta.url), 'utf8');

// Every short label a phone's slim head shows (L(long, short): the short pair).
const shorts = [...demo.matchAll(/L\(\[[^\]]*\],\s*\[\s*'([^']*)'\s*,\s*'([^']*)'\s*\]\)/g)].flatMap(m => [m[1], m[2]]);

test('the phone demo labels: all short ones found', () => assert.ok(shorts.length >= 10, String(shorts.length)));

test('at 320 the phone demo label fits beside 即時 and ↻', async t => {
  if (!chromium || !existsSync(chromium.executablePath())) return t.skip('no Chromium here');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 700 } });
    const head = s => `<header class="sc-player-head slim"><button class="sc-player-x"><span class="sc-ico"></span></button><div class="sc-player-name"><strong>Orbit Securities</strong><small>${s}</small></div><button class="sc-player-live"><span class="sc-live-dot"></span>即時</button><button class="sc-player-x"><span class="sc-ico"></span></button></header>`;
    await page.setContent(`<style>${css}</style><div class="sc-player full">${shorts.map(head).join('')}</div>`);
    const cut = await page.evaluate(() => [...document.querySelectorAll('.sc-player-name small')].filter(s => s.scrollWidth > s.clientWidth + 1).map(s => s.textContent));
    assert.deepEqual(cut, []);
    await page.setContent(home.replace(/<script[\s\S]*?<\/script>/g, ''));
    const split = await page.evaluate(() => { const nb = document.querySelector('.nb'); return nb.getClientRects().length; });
    assert.equal(split, 1, '法律⋯⋯ on one line');
    // 整個系統's branch rail: the family mark and every branch on one row (eleven of them now).
    await page.setViewportSize({ width: 320, height: 700 });
    await page.setContent(`<style>${css}</style><main class="page" style="padding:0 16px"><nav class="sc-rail">${'<button class="sc-rail-b">●</button>'.repeat(11)}</nav></main>`);
    assert.equal(await page.evaluate(() => new Set([...document.querySelectorAll('.sc-rail-b')].map(b => Math.round(b.getBoundingClientRect().top))).size), 1, 'the rail on one row');
    // Ten apps in rows of three on a wide page: the tenth takes its row whole.
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.setContent(`<style>${css}</style><main class="page"><ul class="sc-applist">${'<li class="sc-app"><a class="sc-app-main"><span class="sc-app-text"><strong>q</strong></span></a><button class="sc-trypill">試玩</button></li>'.repeat(10)}</ul></main>`);
    const widths = await page.evaluate(() => [...document.querySelectorAll('.sc-app')].map(e => Math.round(e.getBoundingClientRect().width)));
    assert.ok(widths[9] > widths[0] * 2.5, `the last ${widths[9]} beside the others ${widths[0]}`);
    // 亮點's card foot: on a narrow page the app's own name (「Orbit / Weather」 ran to two lines at 320).
    for (const [w, shown] of [[320, false], [700, true]]) {
      await page.setViewportSize({ width: w, height: 700 });
      await page.setContent(`<style>${css}</style><main class="page"><span class="sc-wow-from"><span class="sc-wow-name"><span class="sc-wow-orbit">Orbit </span>Weather</span></span></main>`);
      assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.sc-wow-orbit')).display !== 'none'), shown, `${w}: Orbit shown ${!shown}`);
    }
  } finally {
    await browser.close();
  }
});
