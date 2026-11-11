// ---- 問 Orbit (the AI plan): a reader asks how Orbit was made ----
// Code first: the structure tree's cards that share the question's words
// (lib/ask.mjs). Then one AI call (`showcase-ask`, the showcase's own pass,
// as the demos take theirs) says the answer from those cards in a line and
// names the ones to open; drawn by the kit as every Orbit AI answer is. No
// pass, the day's answers spent, offline: the cards code picked, as they are.
import { aiBar, aiAnswer, aiAnswerWait } from '#kit/ai.mjs';
import { h, t, ico, en } from '../shell.mjs';
import { cardsFor } from '../lib/ask.mjs';
import { NODES } from '../lib/tree.mjs';
import { openCard } from './how.mjs';

const API = 'https://api.jaypengx.com';
const SAMPLES = [
  ['怎麼做到不花錢？', 'How does it stay free?'],
  ['Jay 自己寫程式嗎？', 'Does Jay write the code?'],
  ['公車時間從哪裡來？', 'Where do the bus times come from?']
];

let pass = null;
async function passNow() {
  if (pass && pass.e - Date.now() > 60_000) return pass.qt;
  const r = await fetch(`${API}/showcase/pass`, { method: 'POST' });
  if (!r.ok) throw new Error('pass');
  pass = await r.json();
  return pass.qt;
}
async function askAi(q, cards) {
  const qt = await passNow();
  const r = await fetch(`${API}/ai?qt=${encodeURIComponent(qt)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feature: 'showcase-ask', input: { q, cards: cards.map(({ id, title, text }) => ({ id, title, text })), lang: en ? 'en' : 'zh' } })
  });
  const j = await r.json().catch(() => null);
  return r.ok && j?.out ? j.out : null;
}

const rowOf = id => {
  const n = NODES.get(id)?.node;
  return n ? { lead: ico(n.icon || 'spark'), label: t(n.title), sub: t(n.line), onTap: () => openCard(id) } : null;
};

export function askOrbit() {
  const out = h('div', { class: 'sc-ask-out', 'aria-live': 'polite' });
  let asked = 0;
  async function ask(q) {
    const n = ++asked;
    bar.busy(true);
    const cards = cardsFor(q, { en });
    out.replaceChildren(aiAnswerWait({ rows: Math.min(3, Math.max(1, cards.length)), pics: true, text: t(['翻一下 Orbit 的說明…', 'Looking through Orbit’s story…']) }));
    let ans = null;
    if (cards.length) {
      try {
        ans = await askAi(q, cards);
      } catch {}
    }
    if (n !== asked) return;
    bar.busy(false);
    const ids = ans?.ids?.length ? ans.ids : ans ? [] : cards.slice(0, 3).map(c => c.id);
    const rows = ids.map(rowOf).filter(Boolean);
    const line = ans?.line || (rows.length ? t(['這幾張卡片可能有答案：', 'These cards may answer it:']) : t(['Orbit 的說明裡沒有提到這個。', 'Orbit’s story doesn’t cover that.']));
    out.replaceChildren(aiAnswer({ line, sections: [{ rows }] }));
  }
  const bar = aiBar({ placeholder: t(['問 Orbit：怎麼做到不花錢？', 'Ask Orbit: how does it stay free?']), label: t(['問 Orbit', 'Ask Orbit']), max: 200, onSend: ask });
  const chips = h(
    'div',
    { class: 'sc-ask-chips' },
    SAMPLES.map(s =>
      h('button', {
        type: 'button',
        class: 'q-chip q-press',
        text: t(s),
        onclick: () => {
          bar.input.value = t(s);
          bar.input.dispatchEvent(new Event('input'));
          ask(t(s));
        }
      })
    )
  );
  return h('div', { class: 'sc-ask' }, [h('h3', { class: 'sc-subhead', text: t(['問 Orbit', 'Ask Orbit']) }), bar, chips, out]);
}
