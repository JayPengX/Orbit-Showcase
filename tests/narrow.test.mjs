// At 320: a phone demo's label beside 即時 and ↻ is never cut with …, the
// homepage's Orbit card keeps its line and its ten icons inside (2026-11-12:
// 「試玩 · 範例資料，什麼都…」), and 成果's numbers stay in their cards.
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
    const fit = await page.evaluate(() => { const sub = document.querySelector('.f-sub'), row = document.querySelector('.f-apps'), card = document.querySelector('.feature'); return { lines: Math.round(sub.getBoundingClientRect().height / parseFloat(getComputedStyle(sub).lineHeight)), over: row.scrollWidth > card.clientWidth - 40 + 1 }; });
    assert.equal(fit.lines, 1, "Orbit's line on one line");
    assert.equal(fit.over, false, "every app's icon fits on Orbit's card");
    // 整個系統's branch rail: the family mark and every branch on one row (eleven of them now).
    await page.setViewportSize({ width: 320, height: 700 });
    await page.setContent(`<style>${css}</style><main class="page" style="padding:0 16px"><nav class="sc-rail">${'<button class="sc-rail-b">●</button>'.repeat(11)}</nav></main>`);
    assert.equal(await page.evaluate(() => new Set([...document.querySelectorAll('.sc-rail-b')].map(b => Math.round(b.getBoundingClientRect().top))).size), 1, 'the rail on one row');
    // Stuck while the rows scroll, it sits under the bar's row that stays, not behind it (11-12).
    for (const w of [390, 700]) {
      await page.setViewportSize({ width: w, height: 700 });
      await page.setContent(`<style>${css}</style><header class="sc-bar"><div class="sc-bar-brand" style="height:var(--sc-bar-row)">Orbit</div><div class="sc-bar-sub">整個系統</div></header><main class="page"><nav class="sc-rail">${'<button class="sc-rail-b">●</button>'.repeat(11)}</nav><div style="height:3000px"></div></main>`);
      await page.evaluate(() => scrollTo(0, 1500));
      const r = await page.evaluate(() => ({ bar: document.querySelector('.sc-bar').getBoundingClientRect().bottom, rail: document.querySelector('.sc-rail-b').getBoundingClientRect().top }));
      assert.ok(r.rail >= r.bar, `${w}: the rail's buttons at ${r.rail}, the bar ends at ${r.bar}`);
    }
    // Ten apps in rows of three on a wide page: the tenth takes its row whole.
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.setContent(`<style>${css}</style><main class="page"><ul class="sc-applist">${'<li class="sc-app"><a class="sc-app-main"><span class="sc-app-text"><strong>q</strong></span></a><button class="sc-trypill">試玩</button></li>'.repeat(10)}</ul></main>`);
    const widths = await page.evaluate(() => [...document.querySelectorAll('.sc-app')].map(e => Math.round(e.getBoundingClientRect().width)));
    assert.ok(widths[9] > widths[0] * 2.5, `the last ${widths[9]} beside the others ${widths[0]}`);
    // 成果's rows at 320: the new number and its words stay inside the card (「~99% one tap away」 ran out, 11-17).
    await page.setViewportSize({ width: 320, height: 700 });
    await page.setContent(`<style>${css}</style><main class="page" style="padding:0 16px"><div class="sc-solved"><button class="sc-fix"><span class="sc-fix-nums"><s class="sc-fix-was">Plain text</s><span class="sc-fix-arrow">›</span><strong class="sc-fix-now">~99%</strong><small class="sc-fix-tail">open the very article</small></span></button><button class="sc-fix"><span class="sc-fix-nums"><s class="sc-fix-was">15 分鐘以上</s><span class="sc-fix-arrow">›</span><strong class="sc-fix-now">約 2 分鐘</strong></span></button></div></main>`);
    const out = await page.evaluate(() => [...document.querySelectorAll('.sc-fix')].filter(b => [...b.querySelectorAll('*')].some(e => e.getBoundingClientRect().right > b.getBoundingClientRect().right + 1)).length);
    assert.equal(out, 0, 'a problem row runs out of its card at 320');
  } finally {
    await browser.close();
  }
});
