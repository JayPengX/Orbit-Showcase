// The showcase's content holds together: every id is unique, every link,
// story step, change and app points at something real, every picture is
// on disk, every icon is one the kit draws, and the counts file has the
// shape the pages read. Plus Jay's rule (2026-10-27): nothing about betting.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { icons } from '#kit/ui.mjs';
import { ICONS } from '#kit/orbit.mjs';
import { ROOT, NODES } from '../public/lib/tree.mjs';
import { APPS } from '../public/lib/apps.mjs';
import { ROWS, STORIES } from '../public/lib/stories.mjs';
import { ORIGIN, TOOLS, DECISIONS, SETUP, PATTERNS, PROMPTS, LEARNED, SETBACKS, CHANGES, BIRTHS, LOOP, DAYS, RULES } from '../public/lib/history.mjs';

const shot = f => new URL(`../public/shots/${f}.webp`, import.meta.url);
const pair = x => Array.isArray(x) && x.length === 2 && x.every(s => typeof s === 'string' && s.trim());

test('tree: ids unique, links real, every text in both languages, icons drawn', () => {
  const seen = new Set();
  (function walk(n) {
    assert.ok(!seen.has(n.id), `duplicate id ${n.id}`);
    seen.add(n.id);
    assert.ok(pair(n.title) && pair(n.line), `${n.id}: title and line in zh and en`);
    for (const k of ['p', 'i', 'r', 'tech']) if (n[k]) assert.ok(pair(n[k]), `${n.id}.${k}`);
    for (const l of n.links || []) assert.ok(NODES.has(l), `${n.id} links to missing ${l}`);
    assert.ok(icons[n.icon], `${n.id}: icon ${n.icon}`);
    (n.kids || []).forEach(walk);
  })(ROOT);
  assert.equal(seen.size, NODES.size);
});

test('apps: a tree branch, screenshots on disk, captions in both languages', () => {
  assert.equal(APPS.length, 9);
  for (const a of APPS) {
    assert.ok(NODES.has(a.id), a.id);
    assert.ok(pair(a.q), `${a.id}.q`);
    for (const [f, c] of [...a.shots, ...(a.then ? [a.then] : [])]) {
      assert.ok(existsSync(shot(f)), `${f}.webp`);
      assert.ok(pair(c), `${f} caption`);
    }
  }
});

test('map: every step at a spot on the map, every spot opens a tree node', () => {
  const spots = new Set(ROWS.flatMap(r => r.nodes.map(n => (n.tree && assert.ok(NODES.has(n.tree), n.tree), assert.ok(icons[n.icon], n.icon), n.id))));
  for (const s of STORIES) {
    assert.ok(pair(s.title));
    for (const [at, text] of s.steps) {
      assert.ok(spots.has(at), `${s.id}: ${at}`);
      assert.ok(pair(text));
    }
  }
});

test('history: dates in order, nodes real, pictures on disk', () => {
  const day = /^2026-\d\d-\d\d$/;
  for (const [f] of ORIGIN.steps) assert.ok(existsSync(shot(f)), f);
  for (const list of [CHANGES, BIRTHS, DECISIONS]) {
    const dates = list.map(x => x.date);
    assert.ok(dates.every(d => day.test(d)));
    assert.deepEqual(dates, [...dates].sort(), 'oldest first');
  }
  for (const c of CHANGES) {
    assert.ok(pair(c.title) && pair(c.p) && pair(c.i) && pair(c.r), c.date);
    if (c.node) assert.ok(NODES.has(c.node), c.node);
    if (c.ba) assert.ok(existsSync(shot(c.ba)), c.ba);
    for (const a of c.apps) assert.ok(NODES.has(a), a);
  }
  for (const b of BIRTHS) assert.ok(APPS.some(a => a.id === b.id), b.id);
  for (const x of [...TOOLS.map(t => t.icon), ...DECISIONS.map(d => d.icon), ...CHANGES.map(c => c.icon), ...DAYS.map(d => d.icon), ...LOOP.map(l => l[0]), ...SETUP.map(s => s[0]), ...RULES.map(r => r[0])]) assert.ok(icons[x], `icon ${x}`);
});

test('how Jay asks and where it went wrong: real dates, a habit each, both languages', () => {
  const tags = new Set(PATTERNS.map(p => p.id));
  for (const p of PATTERNS) assert.ok(pair(p.title) && pair(p.line) && icons[p.icon], p.id);
  for (const x of PROMPTS) {
    assert.match(x.date, /^2026-\d\d-\d\d$/);
    assert.ok(tags.has(x.tag), x.tag);
    assert.ok(pair(x.asked) && pair(x.gist) && pair(x.then) && !('said' in x), x.date);
    if (x.app) assert.ok(APPS.some(a => a.id === x.app), x.app);
  }
  for (const p of PATTERNS) assert.ok(PROMPTS.some(x => x.tag === p.id), `a message for ${p.id}`);
  assert.ok(LEARNED.every(pair));
  const dates = SETBACKS.map(x => x.date);
  assert.deepEqual(dates, [...dates].sort(), 'oldest first');
  for (const x of SETBACKS) assert.ok(pair(x.title) && pair(x.wrong) && pair(x.push) && pair(x.rule) && icons[x.icon], x.date);
});

test('the tab bar draws its icons', () => {
  const app = readFileSync(new URL('../public/app.mjs', import.meta.url), 'utf8');
  const tabs = [...app.matchAll(/\{ id: '\w+', icon: '(\w+)'/g)].map(m => m[1]);
  assert.equal(tabs.length, 4);
  for (const i of tabs) assert.ok(ICONS[i], `tab icon ${i}`);
});

test('stats.json has what the pages read', () => {
  const s = JSON.parse(readFileSync(new URL('../public/data/stats.json', import.meta.url), 'utf8'));
  for (const k of ['apps', 'commits', 'claude', 'copilot', 'lines', 'tests', 'added', 'removed', 'reverts']) assert.ok(Number.isInteger(s[k]) && s[k] >= 0, k);
  assert.ok(s.claude <= s.commits);
  assert.ok(s.removed <= s.added);
  assert.match(s.first, /^\d{4}-\d\d-\d\d$/);
  assert.equal(s.hours.length, 24);
  assert.ok(Object.keys(s.days).length > 0);
  assert.ok(s.repos.every(r => typeof r.repo === 'string'));
});

// Jay 2026-10-27: betting is his personal thing and stays out of the showcase.
test('nothing about betting anywhere in the showcase', () => {
  const BANNED = /longshot|sportsbook|betting|\bbets?\b|\bodds\b|lottery|polymarket|kambi|draftkings|運彩|彩券|樂透|刮刮樂|賠率|盤口|下注|投注|博弈/i;
  const files = ['public/app.mjs', 'public/shell.mjs', 'public/index.html', ...['public/lib', 'public/views'].flatMap(d => readdirSync(new URL(`../${d}/`, import.meta.url)).map(f => `${d}/${f}`))];
  for (const f of files) {
    const text = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(text, BANNED, f);
  }
});
