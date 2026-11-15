// 問 Orbit on the showcase (views/ask.mjs): the cards a question needs,
// picked by code (no AI): the structure tree's (its plain words and its 技術細節)
// and what scripts/know.mjs read from the repos (every feature, every dated
// rule of Jay's, the numbers from git: data/know.json), matched by CJK pairs
// of characters and English words, rare words counting more and a title
// double. The AI (`showcase-ask`) answers only from the cards picked here;
// without it, the tree's among them are the answer.
import { NODES } from './tree.mjs';

const pick = (pair, en) => (Array.isArray(pair) ? pair[en ? 1 : 0] : pair || '');
// A text's words: each pair of Chinese characters, each English word of 2+ letters.
const STOP = new Set(['is', 'it', 'to', 'of', 'in', 'on', 'do', 'an', 'or', 'be', 'by', 'at', 'so', 'my', 'me', 'we', 'he', 'the', 'and', 'how', 'what', 'why', 'does', 'did', 'for', 'you', 'are', 'was', 'with', 'can', 'orbit', '怎麼', '什麼', '為什', '麼要', '如何', '可以', '是不', '不是', '一個', '這個', '那個', '有沒', '沒有']);
export function wordsOf(text) {
  const s = String(text || '').toLowerCase();
  const out = new Set();
  for (const run of s.match(/[一-鿿]+/g) || []) {
    if (run.length === 1) out.add(run);
    for (let i = 0; i < run.length - 1; i++) out.add(run.slice(i, i + 2));
  }
  for (const w of [...out]) if (STOP.has(w)) out.delete(w);
  for (const w of s.match(/[a-z][a-z0-9]+/g) || []) if (!STOP.has(w)) out.add(stem(w));
  return out;
}
// One form for a word and its plural, the same on both sides (it cut every
// -es, so times/phones/games never met time/phone/game, 11-12): stories → story,
// buses/classes/matches → bus/class/match, then a last -s and -e go (times,
// time → tim; class, bus, status keep theirs).
function stem(w) {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (/(ss|sh|ch|x|z|us)es$/.test(w)) return w.slice(0, -2);
  if (/[^su]s$/.test(w)) w = w.slice(0, -1);
  return w.length > 2 && w.endsWith('e') ? w.slice(0, -1) : w;
}

// A card as the AI reads it: { id, title, text } (problem, idea, result, then
// how it's built: the AI words that plainly, views/ask.mjs).
export function cardOf(id, en = false) {
  const n = NODES.get(id)?.node;
  if (!n) return null;
  const parts = [n.line, n.p, n.i, n.r].map(x => pick(x, en)).filter(Boolean);
  const tech = pick(n.tech, en);
  return { id, title: pick(n.title, en), text: `${parts.join(' ')}${tech ? ` (How: ${tech})` : ''}` };
}

// The cards for a question, best first: [{ id, title, text, score }].
// `more`: know.json's cards ({ id, kind, app, title, text }). A word in many
// cards says little (log of how rare it is), a title's counts double, a long
// card a little less.
export function cardsFor(q, { en = false, most = 6, more = [] } = {}) {
  const want = wordsOf(q);
  if (!want.size) return [];
  const all = [];
  for (const [id, { depth }] of NODES) {
    if (!depth) continue;
    const c = cardOf(id, en) || cardOf(id, !en);
    const other = cardOf(id, !en);
    all.push({ ...c, tree: true, head: wordsOf(c.title), body: wordsOf(`${c.text} ${other?.title || ''} ${other?.text || ''}`) });
  }
  for (const k of more) if (k?.id && k.text) all.push({ id: k.id, title: k.title, text: k.text, head: wordsOf(`${k.app} ${k.title}`), body: wordsOf(k.text) });
  const df = new Map();
  for (const c of all) for (const w of new Set([...c.head, ...c.body])) if (want.has(w)) df.set(w, (df.get(w) || 0) + 1);
  const out = [];
  for (const c of all) {
    let score = 0;
    for (const w of want) {
      const idf = Math.log(1 + all.length / (df.get(w) || 1));
      score += c.head.has(w) ? 2 * idf : c.body.has(w) ? idf : 0;
    }
    if (score > 0) out.push({ id: c.id, title: c.title, text: c.text, tree: Boolean(c.tree), score: score / Math.sqrt(1 + c.body.size / 60) });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, most);
}
