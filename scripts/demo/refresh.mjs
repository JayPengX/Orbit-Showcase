// Every demo again from each app's main, run by the deploy (deploy.yml): each
// recorded afresh (record.mjs --strict) and, if its walk went through, built
// (build.mjs) from today's code; a demo whose recording failed keeps the copy
// committed here, and so does one that needs daylight (`daytime`: Transit's
// buses and trains) when it's night in Taiwan. Nothing to catch up by hand:
// the showcase's demos are the apps as they are on the day it deploys.
//   node scripts/demo/refresh.mjs --repos dir [id…]
import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { DEMOS } from './apps.mjs';

const args = process.argv.slice(2);
const r = args.indexOf('--repos');
if (r < 0) throw new Error('usage: node scripts/demo/refresh.mjs --repos dir [id…]');
const repos = resolve(args.splice(r, 2)[1]);
const ids = args.length ? args : Object.keys(DEMOS);
const here = new URL('./', import.meta.url).pathname;
const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Taipei', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));

const fresh = [];
for (const id of ids) {
  if (DEMOS[id].daytime && (hour < 7 || hour >= 22)) {
    console.log(`${id}: night in Taiwan, the committed copy stays`);
    continue;
  }
  // (twice at most: an outside source can be slow once)
  let ok = false;
  for (let i = 0; i < 2 && !ok; i++) ok = spawnSync(process.execPath, [`${here}record.mjs`, id, '--repos', repos, '--strict'], { stdio: 'inherit', timeout: 300_000 }).status === 0;
  if (ok) fresh.push(id);
  else console.log(`::warning::${id}: its recording failed; the committed copy stays`);
}
if (fresh.length) {
  const built = spawnSync(process.execPath, [`${here}build.mjs`, ...fresh, '--repos', repos], { stdio: 'inherit', timeout: 900_000 });
  if (built.status !== 0) {
    // (half built is worse than yesterday's: the committed demos, whole)
    const site = new URL('../../public/demo/', import.meta.url).pathname;
    execFileSync('git', ['checkout', '--', site]);
    execFileSync('git', ['clean', '-fdq', '--', site]);
    throw new Error('build.mjs failed: the committed demos stay');
  }
}
console.log(`fresh: ${fresh.join(', ') || 'none'}`);
