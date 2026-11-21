// The demo player's tour: a ring only where a tap reaches.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const demo = readFileSync(new URL('../public/views/demo.mjs', import.meta.url), 'utf8');

test('a tour target under the app\'s own floating bar is brought to the middle, so the tap reaches it', () => {
  assert.match(demo, /function hidden\(el, r\) \{\n\s*const top = frame\.contentDocument\.elementFromPoint\(/);
  // (its middle just past the screen's edge, half of it showing, counts too: 11-19)
  assert.match(demo, /return !top \|\| \(top !== el && !el\.contains\(top\) && !top\.contains\(el\)\);/);
  assert.match(demo, /\|\| hidden\(el, r\)\) el\.scrollIntoView\(\{ block: 'center', inline: 'center'/);
});
test('a tour target off the side of a scrolling row, pushed off screen while the app lays out, or scrolled under a bar by the reader, is brought back once their hands are still', () => {
  assert.match(demo, /if \(cx < 0 \|\| cx > win\.innerWidth \|\| cy < 0 \|\| cy > win\.innerHeight/);
  assert.match(demo, /if \(now - touched > QUIET_MS && now - brought > 700\)/);
  assert.match(demo, /const rolls = \(\) => performance\.now\(\) - hand < 3000 && performance\.now\(\) - brought > 1000 && \(touched = performance\.now\(\)\);/);
  assert.match(demo, /\['pointerdown', 'wheel', 'touchstart', 'keydown'\]/);
});
test('a loading placeholder (.q-skel) is never a tour step\'s target: no ring on it, and a tap on it doesn\'t move the tour on', () => {
  assert.match(demo, /const real = el => !el\.closest\('\.q-skel'\);/);
  assert.match(demo, /\.find\(x => x\.getClientRects\(\)\.length && real\(x\)\)/);
  assert.match(demo, /if \(s\?\.tap && !moving && hit && !real\(hit\)\) return;/);
});

// Jay 2026-11-19: no tour stuck, none needing two taps, no way out by mistake.
test('a tour is never stuck and never broken by a stray tap: held back between a tap and the next step too; its sheet closed another way moves it on; a target long gone shows 下一步', () => {
  assert.match(demo, /if \(at < 0 \|\| at >= tour\.length\) return;\n\s+const s = tour\[at\];\n\s+if \(s\?\.tap && e\.target\.closest\?\.\(s\.tap\)\) return;/);
  assert.match(demo, /const closed = seen && \/\^\(dialog\\\[open\\\] \)\?\\\.q-close\$\/\.test\(s\.tap\) && !doc\.querySelector\('dialog\[open\]'\);/);
  assert.match(demo, /if \(closed && now - missing > 1200\) return step\(at \+ 1\);/);
  assert.match(demo, /if \(full && now - missing > LOST_MS && coach\.hidden\) \{\n\s+coach\.hidden = false;\n\s+next\.hidden = false;/);
  // (a drag's moves held back too: heard alone, an app's drag code dropped the next tap's click)
  for (const ev of ['pointermove', 'touchmove', 'mousemove']) assert.match(demo, new RegExp(`const GATED = \\[[^\\]]*'${ev}'`));
});

// Jay 11-20: "you want me to click 台股 but it's already there", and 略過 read as skipping a step ended it all.
test('a tour step whose target is already chosen is passed over; the end button says 結束', () => {
  assert.match(demo, /if \(el && !seen && !moving && ahead && el\.closest\('\[aria-selected="true"\], \[aria-pressed="true"\], \[aria-current\]:not\(\[aria-current="false"\]\)'\)\) return \(passed\+\+, step\(at \+ 1\)\);/);
  assert.match(demo, /\[t\(\['結束', 'End'\]\)\]/);
  assert.doesNotMatch(demo, /'略過'/);
});
