// 問 Orbit on the showcase (views/ask.mjs): the structure tree's cards that
// share a question's words, picked by code (no AI): CJK pairs of characters
// and English words, a card's title counting double. The AI (`showcase-ask`)
// answers only from the cards picked here; without it, these are the answer.
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
  for (const w of s.match(/[a-z][a-z0-9]+/g) || []) out.add(w.replace(/(ies|es|s)$/, w.endsWith('ies') ? 'y' : ''));
  for (const w of [...out]) if (STOP.has(w)) out.delete(w);
  return out;
}

// A card as the AI reads it: { id, title, text } (problem, idea, result; no technical names).
export function cardOf(id, en = false) {
  const n = NODES.get(id)?.node;
  if (!n) return null;
  const parts = [n.line, n.p, n.i, n.r].map(x => pick(x, en)).filter(Boolean);
  return { id, title: pick(n.title, en), text: parts.join(' ') };
}

// The cards for a question, best first: [{ id, title, text, score }].
export function cardsFor(q, { en = false, most = 6 } = {}) {
  const want = wordsOf(q);
  if (!want.size) return [];
  const out = [];
  for (const [id, { depth }] of NODES) {
    if (!depth) continue;
    const c = cardOf(id, en) || cardOf(id, !en);
    const other = cardOf(id, !en);
    const title = wordsOf(c.title);
    const body = wordsOf(`${c.text} ${other?.title || ''} ${other?.text || ''}`);
    let score = 0;
    for (const w of want) score += title.has(w) ? 2 : body.has(w) ? 1 : 0;
    if (score > 0) out.push({ ...c, score: score / Math.sqrt(1 + body.size / 60) });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, most);
}
