// The showcase's numbers, counted from the repos themselves (never typed in):
// each repo's commits, the ones Claude co-wrote, its first and last day, its
// lines of code and its test cases, the first day Claude co-wrote one and how
// many GitHub Copilot co-wrote, and the family's commits by day and by
// hour of the day, plus the churn: code lines written and later taken out
// again, and the updates that were undone outright (reverts). Run by the deploy (daily too) with the repos beside this one:
//   node scripts/stats.mjs [folder holding the repos] > public/data/stats.json
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// The family, in the order the showcase lists it; `app` is the brand id.
export const REPOS = [
  { repo: 'Orbit-Core', app: null },
  { repo: 'Orbit-Sports', app: 'match' },
  { repo: 'Orbit-Transit', app: 'transit' },
  { repo: 'Orbit-Weather', app: 'weather' },
  { repo: 'Orbit-Class', app: 'orbit' },
  { repo: 'Orbit-Words', app: 'vocab' },
  { repo: 'Orbit-Beats', app: 'beats' },
  { repo: 'Orbit-Law', app: 'law' },
  { repo: 'Orbit-Securities', app: 'stock' },
  { repo: 'Orbit-Money', app: 'money' },
  { repo: 'Orbit-Showcase', app: null }
];

// Code is what people wrote: scripts, styles and pages. Not counted: data,
// vendored libraries and the tables a script generates.
const CODE = /\.(mjs|js|css|html|py|cs)$/;
const NOT_CODE = /(^|\/)(vendor|node_modules|data|dist|samples)\/|\.min\.|(^|\/)(brands|tvlogos|tvround|twnames|metro-drawings|stock-hk-lots|stock-jp-lists|weather-stations)\.m?js$/;
const TEST_FILE = /(^|\/)tests?\/.*\.m?js$/;
const TEST_CASE = /^\s*(?:test|it)(?:\.\w+)?\(/gm;

const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 });

export function countRepo(dir) {
  const files = git(dir, 'ls-files').split('\n').filter(Boolean);
  let lines = 0;
  let tests = 0;
  for (const f of files) {
    const path = join(dir, f);
    if (!existsSync(path)) continue;
    if (CODE.test(f) && !NOT_CODE.test(f)) lines += readFileSync(path, 'utf8').split('\n').length;
    if (TEST_FILE.test(f)) tests += (readFileSync(path, 'utf8').match(TEST_CASE) || []).length;
  }
  let log = '';
  try {
    log = git(dir, 'log', '--format=%ad%x09%B%x00', '--date=format-local:%Y-%m-%d %H');
  } catch {} // (a repo with no commits yet)
  log = log.split('\0').map(s => s.trim()).filter(Boolean);
  const days = {};
  const hours = Array(24).fill(0);
  let claude = 0;
  let copilot = 0;
  let firstClaude = null;
  for (const entry of log) {
    const [day, hour] = entry.split('\t')[0].split(' ');
    days[day] = (days[day] || 0) + 1;
    hours[+hour]++;
    if (/co-authored-by:\s*claude/i.test(entry)) {
      claude++;
      if (!firstClaude || day < firstClaude) firstClaude = day;
    }
    if (/co-authored-by:\s*copilot/i.test(entry)) copilot++;
  }
  // Churn: every code line ever added and removed, and the reverts.
  let added = 0;
  let removed = 0;
  let reverts = 0;
  try {
    for (const row of git(dir, 'log', '--numstat', '--format=').split('\n')) {
      const [a, d, f] = row.split('\t');
      if (!f || a === '-' || !CODE.test(f) || NOT_CODE.test(f)) continue;
      added += +a;
      removed += +d;
    }
    reverts = git(dir, 'log', '--format=%s').split('\n').filter(s => /^revert\b/i.test(s)).length;
  } catch {}
  const sorted = Object.keys(days).sort();
  return { commits: log.length, claude, added, removed, reverts, first: sorted[0] || null, last: sorted.at(-1) || null, lines, tests, days, hours, copilot, firstClaude };
}

export function collect(root) {
  const repos = [];
  const days = {};
  const hours = Array(24).fill(0);
  for (const r of REPOS) {
    const dir = join(root, r.repo);
    if (!existsSync(join(dir, '.git'))) throw new Error(`${r.repo} is missing from ${root}`);
    const c = countRepo(dir);
    for (const [d, n] of Object.entries(c.days)) days[d] = (days[d] || 0) + n;
    c.hours.forEach((n, h) => { hours[h] += n; });
    delete c.days;
    delete c.hours;
    repos.push({ ...r, ...c });
  }
  const sum = k => repos.reduce((a, r) => a + r[k], 0);
  const first = repos.map(r => r.first).filter(Boolean).sort()[0];
  return {
    at: new Date().toISOString(),
    apps: repos.filter(r => r.app).length,
    commits: sum('commits'),
    claude: sum('claude'),
    copilot: sum('copilot'),
    firstClaude: repos.map(r => r.firstClaude).filter(Boolean).sort()[0] || null,
    lines: sum('lines'),
    added: sum('added'),
    removed: sum('removed'),
    reverts: sum('reverts'),
    tests: sum('tests'),
    first,
    days: Object.fromEntries(Object.entries(days).sort()),
    hours,
    repos
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = resolve(process.argv[2] || new URL('../..', import.meta.url).pathname);
  process.stdout.write(`${JSON.stringify(collect(root), null, 1)}\n`);
}
