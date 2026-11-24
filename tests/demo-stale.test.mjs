// The demos catch up by themselves (Jay 11-21: "make sure demo catch up the newest
// version"): the deploy looks every hour and records again only when an app's main
// or the kit is newer than what the live demos were recorded from.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stale } from '../scripts/demo/stale.mjs';
import { DEMOS } from '../scripts/demo/apps.mjs';

const heads = Object.fromEntries([...Object.keys(DEMOS).map(id => [id, `${id}-sha`]), ['kit', 'kit-sha']]);
const mainOf = repo => `${Object.entries(DEMOS).find(([, d]) => d.repo === repo)[0]}-sha`;

test('nothing newer: no recording; an app or the kit newer, or the list unreadable: recorded again', async () => {
  assert.deepEqual(await stale({ live: heads, mainOf, kitNow: 'kit-sha' }), { go: false, why: [] });
  const app = await stale({ live: heads, mainOf: r => (r === 'Orbit-Money' ? 'money-new' : mainOf(r)), kitNow: 'kit-sha' });
  assert.equal(app.go, true);
  assert.match(app.why.join(), /money/);
  assert.equal((await stale({ live: heads, mainOf, kitNow: 'kit-new' })).go, true);
  assert.equal((await stale({ live: { ...heads, sports: undefined }, mainOf, kitNow: 'kit-sha' })).go, true, 'a demo kept from git is recorded again');
  assert.equal((await stale({ live: heads, mainOf: () => { throw new Error('down'); }, kitNow: 'kit-sha' })).go, true, 'an app that can’t be read: recorded, never left behind');
});

test('the deploy looks when started with look=true (the proxy Worker, hourly in Taiwan’s day), and the demos say what they were recorded from', () => {
  const wf = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(wf, /workflow_dispatch:\n\s+inputs:\n\s+look:/);
  assert.doesNotMatch(wf, /'23 0-13/, 'GitHub’s own hourly timer ran 2 or 3 of 14 a day: not relied on');
  assert.match(wf, /run: node scripts\/demo\/stale\.mjs/);
  assert.match(wf, /go: \$\{\{ steps\.wait\.outputs\.go == 'true' && \(inputs\.look != 'true' \|\| steps\.look\.outputs\.go == 'true'\) \}\}/);
  const refresh = readFileSync(new URL('../scripts/demo/refresh.mjs', import.meta.url), 'utf8');
  assert.match(refresh, /for \(const id of fresh\) heads\[id\] = head\(DEMOS\[id\]\.repo\);/);
  assert.match(refresh, /if \(fresh\.length\) heads\.kit = head\('Orbit-Core', 'kit'\);/);
});

// A look that finds nothing newer deploys nothing: a push waiting behind it never steps aside for it.
test('a deploy steps aside only for a newer push or schedule, never for a started look', () => {
  const wf = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(wf, /started: \(\.event == \\"workflow_dispatch\\"\)/);
  assert.match(wf, /select\(\.n > \$GITHUB_RUN_NUMBER and \(\.started \| not\)\)/);
});
