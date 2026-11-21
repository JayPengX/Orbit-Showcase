// Every demo again from each app's main, run by the deploy (deploy.yml): each
// recorded afresh (record.mjs --strict) and, if its walk went through, built
// (build.mjs) from today's code; a demo whose recording failed keeps the copy
// the site serves now (or, failing that, the one committed here), and every demo keeps its copy when the deploy runs outside
// 08:00–22:00 in Taiwan: at night buses, games and markets are asleep, and
// before 08:00 Taiwan's day isn't yet the world's (UTC's), so a recording
// would ask for other days when played on a phone set to another zone. Nothing to catch up by hand:
// the showcase's demos are the apps as they are on the day it deploys.
// What each demo was recorded from (its app's main, and the kit) goes in
// _demo/heads.json beside them: the deploy's hourly look (stale.mjs) records
// again only once an app or the kit has moved on (Jay 11-21: "make sure demo
// catch up the newest version").
//   node scripts/demo/refresh.mjs --repos dir [id…]
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { DEMOS } from './apps.mjs';

const args = process.argv.slice(2);
const r = args.indexOf('--repos');
if (r < 0) throw new Error('usage: node scripts/demo/refresh.mjs --repos dir [id…]');
const repos = resolve(args.splice(r, 2)[1]);
const ids = args.length ? args : Object.keys(DEMOS);
const here = new URL('./', import.meta.url).pathname;
const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Taipei', hour: 'numeric', hourCycle: 'h23' }).format(new Date()));

const night = hour < 8 || hour >= 22;
// Each app's .kit, as its own npm test makes it (record.mjs's helpers import it).
for (const id of ids) {
  const link = join(repos, DEMOS[id].repo, '.kit');
  if (existsSync(join(repos, DEMOS[id].repo)) && !existsSync(link)) symlinkSync('../Orbit-Core/kit', link);
}
// A demo whose recording failed keeps the copy the site serves now (its files
// listed by the deploy that built it, build.mjs), not git's, which no deploy updates.
const LIVE = 'https://jaypengx.com/showcase/demo/';
async function keepLive(id, dir = DEMOS[id]?.repo) {
  try {
    const list = await fetch(`${LIVE}_demo/${id}.files.json`, { signal: AbortSignal.timeout(20_000) });
    if (!list.ok) return false;
    const files = await list.json();
    const got = await Promise.all(
      files.map(async f => {
        const r = await fetch(LIVE + f, { signal: AbortSignal.timeout(30_000) });
        if (!r.ok) throw new Error(`${f}: ${r.status}`);
        return [f, Buffer.from(await r.arrayBuffer())];
      })
    );
    const site = new URL('../../public/demo/', import.meta.url).pathname;
    rmSync(join(site, dir), { recursive: true, force: true });
    for (const [f, body] of got) (mkdirSync(dirname(join(site, f)), { recursive: true }), writeFileSync(join(site, f), body));
    writeFileSync(join(site, '_demo', `${id}.files.json`), `${JSON.stringify(files)}\n`);
    return true;
  } catch (e) {
    console.log(`${id}: the live copy couldn't be read (${e.message}); the committed copy stays`);
    return false;
  }
}

// What the live demos were recorded from, and what this run's are.
const site = new URL('../../public/demo/', import.meta.url).pathname;
async function liveHeads() {
  try {
    const r = await fetch(`${LIVE}_demo/heads.json`, { signal: AbortSignal.timeout(20_000) });
    return r.ok ? await r.json() : {};
  } catch {
    return {};
  }
}
const head = (repo, path) => {
  try {
    return execFileSync('git', ['-C', join(repos, repo), 'log', '-1', '--format=%H', ...(path ? ['--', path] : [])], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};
const writeHeads = h => (mkdirSync(join(site, '_demo'), { recursive: true }), writeFileSync(join(site, '_demo', 'heads.json'), `${JSON.stringify(h, null, 1)}\n`));

// At night nothing is recorded: every demo stays as the site serves it (git's copy only if that can't be read).
if (night) {
  console.log(`the demos' kit: ${(await keepLive('kit', 'Orbit-Core')) ? 'the live one stays' : 'the committed one stays'}`);
  const was = await liveHeads();
  for (const id of ids) {
    const kept = await keepLive(id);
    console.log(`${id}: outside 08:00–22:00 in Taiwan, ${kept ? 'the live copy stays' : 'the committed copy stays'}`);
    if (!kept) delete was[id];
  }
  writeHeads(was);
  process.exit(0);
}
const fresh = [];
const heads = await liveHeads();
for (const id of ids) {
  // (twice at most: an outside source can be slow once)
  let ok = false;
  for (let i = 0; i < 2 && !ok; i++) ok = spawnSync(process.execPath, [`${here}record.mjs`, id, '--repos', repos, '--strict'], { stdio: 'inherit', timeout: 300_000 }).status === 0;
  if (ok) fresh.push(id);
  else {
    const kept = await keepLive(id);
    console.log(`::warning::${id}: its recording failed; ${kept ? 'the live copy stays' : 'the committed copy stays'}`);
    // (git's copy is from no known day: tried again within the hour)
    if (!kept) delete heads[id];
  }
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
for (const id of fresh) heads[id] = head(DEMOS[id].repo);
if (fresh.length) heads.kit = head('Orbit-Core', 'kit');
writeHeads(heads);
console.log(`fresh: ${fresh.join(', ') || 'none'}`);
