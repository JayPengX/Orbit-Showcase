// 整個系統's overview: every branch in its own colour, and no branch left alone on a row.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ROOT } from '../public/lib/tree.mjs';

const how = readFileSync(new URL('../public/views/how.mjs', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/showcase.css', import.meta.url), 'utf8');

test('every branch of the tree has a colour of its own', () => {
  const hue = Object.fromEntries([...how.match(/const HUE = \{([^}]*)\}/)[1].matchAll(/(\w+): '([^']+)'/g)].map(m => [m[1], m[2]]));
  const ids = ROOT.kids.map(k => k.id);
  for (const id of ids) assert.ok(hue[id], `${id} has no colour (it would take the page's accent)`);
  const used = ids.map(id => hue[id]);
  assert.equal(new Set(used).size, used.length, 'two branches share a colour');
});
test('a last branch alone on its row takes the whole row', () => {
  assert.match(css, /\.sc-ov-b:last-child:nth-child\(3n \+ 1\) \{\n\s*grid-column: 1 \/ -1;/);
});
