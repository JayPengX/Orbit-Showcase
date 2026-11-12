// The demo player's tour: a ring only where a tap reaches.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const demo = readFileSync(new URL('../public/views/demo.mjs', import.meta.url), 'utf8');

test('a tour target under the app\'s own floating bar is brought to the middle, so the tap reaches it', () => {
  assert.match(demo, /function hidden\(el, r\) \{\n\s*const top = frame\.contentDocument\.elementFromPoint\(/);
  assert.match(demo, /\|\| hidden\(el, r\)\) el\.scrollIntoView\(\{ block: 'center', inline: 'center'/);
});
test('a tour target off the side of a scrolling row, or pushed off screen while the app lays out, is brought back till the reader touches the app', () => {
  assert.match(demo, /if \(cx < 0 \|\| cx > win\.innerWidth \|\| cy < 0 \|\| cy > win\.innerHeight/);
  assert.match(demo, /if \(!touched && now - brought > 700\)/);
  assert.match(demo, /\['pointerdown', 'wheel', 'touchstart', 'keydown'\]/);
});
test('a loading placeholder (.q-skel) is never a tour step\'s target: no ring on it, and a tap on it doesn\'t move the tour on', () => {
  assert.match(demo, /const real = el => !el\.closest\('\.q-skel'\);/);
  assert.match(demo, /\.find\(x => x\.getClientRects\(\)\.length && real\(x\)\)/);
  assert.match(demo, /if \(s\?\.tap && !moving && hit && !real\(hit\)\) return;/);
});
