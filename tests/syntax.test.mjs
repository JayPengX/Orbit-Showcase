// Every module the page loads must parse: a stray comma once failed the deploy's minify
// while the other tests, which never import the views, still passed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    // (the demos' app copies are built from the apps' own repos: only the sandbox is written here)
    if (statSync(p).isDirectory()) return f === 'vendor' || (dir === 'public/demo' && f !== '_demo') ? [] : files(p);
    return /\.m?js$/.test(f) ? [p] : [];
  });
}

test('every page module parses', () => {
  const bad = files('public').filter((f) => spawnSync(process.execPath, ['--check', f]).status !== 0);
  assert.deepEqual(bad, []);
});

// Safari before 16.4 can't read a look-behind in a pattern: one in a page module is a
// SyntaxError there, and the whole page stays blank (an older iPad or Mac; the showcase
// is open to everyone). The kit files the page loads have none either.
test('no page module has a look-behind an older Safari cannot read', async () => {
  const { readFileSync } = await import('node:fs');
  const own = files('public').filter((f) => !f.startsWith('public/demo/'));
  assert.deepEqual(own.filter((f) => /\(\?<[=!]/.test(readFileSync(f, 'utf8'))), []);
  // (the kit, from the modules the page imports, followed through their own imports)
  const seen = new Set();
  const walk = (f) => {
    if (seen.has(f)) return;
    seen.add(f);
    for (const m of readFileSync(`.kit/${f}`, 'utf8').matchAll(/(?:from|import)\s*\(?\s*['"]\.\/([\w.-]+\.mjs)['"]/g)) walk(m[1]);
  };
  for (const f of own) for (const m of readFileSync(f, 'utf8').matchAll(/['"]#kit\/([\w.-]+\.mjs)['"]/g)) walk(m[1]);
  assert.ok(seen.size > 5, `${seen.size} kit files`);
  assert.deepEqual([...seen].filter((f) => /\(\?<[=!]/.test(readFileSync(`.kit/${f}`, 'utf8'))), []);
});

// The split that took the look-behind's place cuts where it did.
test('a line breaks only between its phrases: at a |, after its own commas and question marks', async () => {
  const { APPS, phrases } = await import('../public/lib/apps.mjs');
  assert.deepEqual(phrases('今晚有什麼|比賽值得看？在哪一台？'), ['今晚有什麼', '比賽值得看？', '在哪一台？']);
  assert.deepEqual(phrases('這個月的錢|花到哪裡去了？'), ['這個月的錢', '花到哪裡去了？']);
  assert.deepEqual(phrases('A，，B'), ['A，', '，', 'B']);
  assert.deepEqual(phrases('來點好聽、不會重複的音樂'), ['來點好聽、', '不會重複的音樂']);
  assert.deepEqual(phrases(''), ['']);
  for (const a of APPS) assert.equal(phrases(a.q[0]).join(''), a.q[0].replaceAll('|', ''), a.id);
});
