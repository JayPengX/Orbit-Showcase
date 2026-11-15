// What 問 Orbit knows besides the structure tree (Jay 11-15: "it should know
// the project deeply, deeper than myself"): every feature each repo's
// FEATURES.md lists, every rule Jay set (Orbit-Core docs/RULEBOOK.md and each
// repo's MAP.md "Rules", dated, his words quoted), and the numbers from git
// (stats.json). Read from the repos themselves, never typed in; the deploy
// writes it beside stats.json, daily too. The page reads it only when someone
// asks (views/ask.mjs), and code picks the cards a question needs
// (lib/ask.mjs); the AI answers from those alone.
//   node scripts/know.mjs [folder holding the repos] [stats.json] > public/data/know.json
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { REPOS } from './stats.mjs';

const NAME = { 'Orbit-Core': 'Orbit (shared)', 'Orbit-Showcase': 'Showcase' };
const nameOf = repo => NAME[repo] || repo.replace('Orbit-', '');
const MAX = 700;
// A line as a reader takes it: no code marks, no file lists after " — ".
export const plainLine = s =>
  String(s || '')
    .replace(/\s+—\s+(`[^`]*`[,:\s]*)+.*$/s, '')
    .replace(/\s+\((?:`[^`]*`[,;\s]*)+\)/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX);

// Each "- " bullet of a markdown part (its continuation lines joined), under `## head`.
export function bullets(md, head = null) {
  let text = md;
  if (head) {
    const at = md.search(new RegExp(`^##\\s+${head}\\b`, 'm'));
    if (at < 0) return [];
    const rest = md.slice(at).split('\n').slice(1).join('\n');
    const end = rest.search(/^##\s/m);
    text = end < 0 ? rest : rest.slice(0, end);
  }
  const out = [];
  for (const line of text.split('\n')) {
    if (/^- /.test(line)) out.push(line.slice(2));
    else if (out.length && /^\s+\S/.test(line)) out[out.length - 1] += ` ${line.trim()}`;
    else if (!line.trim() && out.length) out.push(null);
  }
  return out.filter(Boolean);
}

export function knowOf(dir, stats = null) {
  const cards = [];
  const add = (id, kind, app, title, text) => text && cards.push({ id, kind, app, title, text: plainLine(text) });
  for (const { repo } of REPOS) {
    const at = join(dir, repo);
    if (!existsSync(at)) continue;
    const read = f => (existsSync(join(at, f)) ? readFileSync(join(at, f), 'utf8') : '');
    const name = nameOf(repo);
    bullets(read('FEATURES.md')).forEach((b, i) => add(`f:${repo}:${i}`, 'feature', name, `${name} feature`, b));
    // (The rules: Orbit-Core's family book before its "Replaced" part, each repo's own.)
    const book = repo === 'Orbit-Core' ? read('docs/RULEBOOK.md').split(/^##\s+Replaced/m)[0] : '';
    const rules = [...bullets(book).filter(b => /^\d{2}-\d{2}\b/.test(b)), ...bullets(read('MAP.md'), 'Rules').filter(b => /^\d{2}-\d{2}\b/.test(b))];
    rules.forEach((b, i) => add(`r:${repo}:${i}`, 'rule', name, `${name} rule, 2026-${b.slice(0, 5)}`, b));
  }
  if (stats) {
    const days = Object.keys(stats.days || {}).length;
    const busiest = Object.entries(stats.days || {}).sort((a, b) => b[1] - a[1])[0];
    const repos = (stats.repos || []).map(r => `${nameOf(r.repo)} ${r.commits} commits${r.first ? ` since ${r.first}` : ''}`).join('; ');
    add(
      'facts',
      'facts',
      'Orbit',
      'Orbit in numbers (counted from git)',
      `As of ${String(stats.at || '').slice(0, 10)}: ${stats.commits} commits (${stats.claude} co-written by Claude) on ${days} days since ${stats.first}; the busiest day ${busiest?.[0]} with ${busiest?.[1]} commits; ${stats.lines} lines of code, ${stats.added} written and ${stats.removed} taken out again, ${stats.reverts} updates undone; ${stats.tests} tests; ${stats.rules} rules Jay set. ${repos}`
    );
  }
  return { at: new Date().toISOString(), cards };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = resolve(process.argv[2] || '..');
  const statsFile = process.argv[3] || new URL('../public/data/stats.json', import.meta.url).pathname;
  const stats = existsSync(statsFile) ? JSON.parse(readFileSync(statsFile, 'utf8')) : null;
  process.stdout.write(`${JSON.stringify(knowOf(dir, stats))}\n`);
}
