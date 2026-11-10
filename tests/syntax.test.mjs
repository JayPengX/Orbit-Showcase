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
    if (statSync(p).isDirectory()) return f === 'vendor' ? [] : files(p);
    return /\.m?js$/.test(f) ? [p] : [];
  });
}

test('every page module parses', () => {
  const bad = files('public').filter((f) => spawnSync(process.execPath, ['--check', f]).status !== 0);
  assert.deepEqual(bad, []);
});
