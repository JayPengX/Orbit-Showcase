// The demo player's tour: a ring only where a tap reaches.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const demo = readFileSync(new URL('../public/views/demo.mjs', import.meta.url), 'utf8');

test('a tour target under the app\'s own floating bar is brought to the middle, so the tap reaches it', () => {
  assert.match(demo, /function hidden\(el, r\) \{\n\s*const top = frame\.contentDocument\.elementFromPoint\(/);
  assert.match(demo, /if \(!brought && \(r\.bottom < 0 \|\| r\.top > frame\.contentWindow\.innerHeight \|\| hidden\(el, r\)\)\) el\.scrollIntoView/);
});
