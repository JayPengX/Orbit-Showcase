// The showcase's content holds together: every id is unique, every link,
// story step and app points at something real, every picture is
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
import { BIRTHS } from '../public/lib/births.mjs';
import { SHOW } from '../public/lib/tree-show.mjs';

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

test('births: real dates, oldest first, real apps', () => {
  const dates = BIRTHS.map(x => x.date);
  assert.ok(dates.every(d => /^2026-\d\d-\d\d$/.test(d)));
  assert.deepEqual(dates, [...dates].sort(), 'oldest first');
  for (const b of BIRTHS) assert.ok(APPS.some(a => a.id === b.id), b.id);
});

test('tree cards: every picture on a real node, both languages, icons drawn', () => {
  const said = x => typeof x === 'string' ? x.trim() : pair(x);
  for (const [id, s] of Object.entries(SHOW)) {
    assert.ok(NODES.has(id), `picture for missing node ${id}`);
    for (const [icon, label] of [...(s.flow || []), ...(s.tags || [])]) assert.ok(icons[icon] && said(label), `${id}: ${icon}`);
    for (const [v, label] of s.nums || []) assert.ok(said(v) && pair(label), `${id} number`);
    for (const [a, b] of s.pairs || []) assert.ok(pair(a) && pair(b), `${id} pair`);
    for (const r of s.rules || []) assert.ok(pair(r), `${id} rule`);
    assert.ok((s.nums || []).length <= 3, `${id}: three numbers at most`);
  }
  for (const [id, { node }] of NODES) if (!node.kids?.length) assert.ok(SHOW[id], `${id}: a leaf card needs a picture`);
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

// Jay 2026-10-27: betting is his personal thing and stays out of the showcase
// (and out of his homepage, public/home/).
test('nothing about betting anywhere in the showcase', () => {
  const BANNED = /longshot|sportsbook|betting|\bbets?\b|\bodds\b|lottery|polymarket|kambi|draftkings|運彩|彩券|樂透|刮刮樂|賠率|盤口|下注|投注|博弈/i;
  const files = ['public/app.mjs', 'public/shell.mjs', 'public/index.html', 'public/home/index.html', 'public/demo/Orbit-Core/kit/help.mjs', ...['public/lib', 'public/views'].flatMap(d => readdirSync(new URL(`../${d}/`, import.meta.url)).map(f => `${d}/${f}`))];
  for (const f of files) {
    const text = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(text, BANNED, f);
  }
});

test('every demo is a frozen copy behind the sandbox, with a tour that says both languages', async () => {
  const { DEMOS, TOURS } = await import('../public/lib/demos.mjs');
  for (const [id, d] of Object.entries(DEMOS)) {
    const html = readFileSync(new URL(`../public/demo/${d.repo}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.indexOf(`../_demo/${id}.js`) > 0 && html.indexOf('../_demo/shim.js') > html.indexOf(`../_demo/${id}.js`), `${id}: the sandbox comes first`);
    assert.ok(html.indexOf('../_demo/shim.js') < html.search(/<script(?![^>]*_demo)/), `${id}: before any of the app's scripts`);
    assert.ok(existsSync(new URL(`../public/demo/_demo/${id}.js`, import.meta.url)), `${id}: its recorded answers`);
    assert.ok(!existsSync(new URL(`../public/demo/${d.repo}/sw.js`, import.meta.url)), `${id}: no service worker of its own`);
    for (const s of TOURS[id] || []) assert.ok(s.say?.length === 2 && s.say.every(Boolean), `${id}: ${s.tap}`);
  }
});
