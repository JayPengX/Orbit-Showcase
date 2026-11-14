// ---- 問 Orbit (the AI plan): a reader asks how Orbit was made ----
// Everywhere on the page (Jay 2026-11-14: "a feature that is everywhere you
// scroll"): a pill along the bottom names a question about what's on screen
// (setAskContext: the chapter, an app's page, a card of the tree); a tap opens
// the conversation in a sheet, those questions ready to tap. The 整個系統
// chapter ends on the same box, inline.
// Code first: the structure tree's cards that share the question's words
// (lib/ask.mjs), the cards of what's on screen first. Then one AI call
// (`showcase-ask`, the showcase's own pass, as the demos take theirs) says the
// answer from those cards in a line and names the ones to open; drawn by the
// kit as every Orbit AI answer is. Lean (the AI spend rule, 11-14): nothing is
// asked until the reader sends; an answer once given is kept on the device and
// never asked again; no pass, the day's answers spent, offline: the cards code
// picked, as they are.
import { aiBar, aiAnswer, aiAnswerWait } from '#kit/ai.mjs';
import { sheet } from '#kit/ui.mjs';
import { h, t, ico, en } from '../shell.mjs';
import { cardsFor, cardOf } from '../lib/ask.mjs';
import { NODES } from '../lib/tree.mjs';
import { openCard } from './how.mjs';

const API = 'https://api.jaypengx.com';

// What a reader is likely to wonder, by what's on screen.
const CONTEXTS = {
  home: { ids: ['orbit', 'team'], qs: [['Orbit 是什麼？', 'What is Orbit?'], ['Jay 自己寫程式嗎？', 'Does Jay write the code?'], ['怎麼做到不花錢？', 'How does it stay free?']] },
  apps: { ids: ['apps', 'kit', 'pass'], qs: [['十個 App 怎麼共用一張通行證？', 'How do ten apps share one pass?'], ['資料從哪裡來？', 'Where does the data come from?'], ['為什麼打開很快？', 'Why does it open so fast?']] },
  wow: { ids: ['weather-typhoon', 'cheap', 'sports-push'], qs: [['颱風假的機率怎麼算？', 'How is the typhoon day-off chance worked out?'], ['怎麼做到不花錢？', 'How does it stay free?'], ['比賽結果怎麼這麼快就通知？', 'How do results arrive so fast?']] },
  made: { ids: ['team'], qs: [['Jay 自己寫程式嗎？', 'Does Jay write the code?'], ['一個問題怎麼從發現到修好？', 'How does a problem get fixed?'], ['半夜的更新是誰做的？', 'Who makes the late-night updates?']] },
  system: { ids: ['cloud', 'store', 'ship'], qs: [['資料放在哪裡？', 'Where is the data kept?'], ['改好之後怎麼到手機？', 'How does a fix reach the phone?'], ['公車時間從哪裡來？', 'Where do the bus times come from?']] }
};
let ctx = CONTEXTS.home;

// An app's page, a card of the tree: questions about that one thing.
export function askContextFor(kind, id) {
  if (CONTEXTS[kind]) return CONTEXTS[kind];
  const node = NODES.get(id)?.node;
  if (!node) return CONTEXTS.home;
  const name = t(node.title);
  if (kind === 'app')
    return {
      ids: [id, ...(node.kids || []).slice(0, 2).map(k => k.id)],
      qs: [
        [`${name} 最聰明的地方是什麼？`, `What’s cleverest about ${name}?`],
        [`${name} 的資料從哪裡來？`, `Where does ${name} get its data?`],
        [`${name} 用到 AI 嗎？`, `Does ${name} use AI?`]
      ]
    };
  return { ids: [id], qs: [[`「${name}」是怎麼做到的？`, `How does “${name}” work?`], ['為什麼要這樣做？', 'Why do it this way?']] };
}
export function setAskContext(c) {
  ctx = c || CONTEXTS.home;
  dock?.update();
}

// ---- The answer: code's cards, then one AI line (kept once given) ----
let pass = null;
async function passNow() {
  if (pass && pass.e - Date.now() > 60_000) return pass.qt;
  const r = await fetch(`${API}/showcase/pass`, { method: 'POST' });
  if (!r.ok) throw new Error('pass');
  pass = await r.json();
  return pass.qt;
}
const KEPT = 'orbitShowcase.asked';
const keyOf = (q, cards) => `${en ? 'en' : 'zh'}|${q.trim().toLowerCase()}|${cards.map(c => c.id).join(',')}`;
function kept(k) {
  try {
    return JSON.parse(localStorage.getItem(KEPT) || '{}')[k] || null;
  } catch {
    return null;
  }
}
function keep(k, v) {
  try {
    const all = JSON.parse(localStorage.getItem(KEPT) || '{}');
    all[k] = v;
    const ks = Object.keys(all);
    for (const old of ks.slice(0, Math.max(0, ks.length - 40))) delete all[old];
    localStorage.setItem(KEPT, JSON.stringify(all));
  } catch {}
}
async function askAi(q, cards) {
  const k = keyOf(q, cards);
  const had = kept(k);
  if (had) return had;
  const qt = await passNow();
  const r = await fetch(`${API}/ai?qt=${encodeURIComponent(qt)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feature: 'showcase-ask', input: { q, cards: cards.map(({ id, title, text }) => ({ id, title, text })), lang: en ? 'en' : 'zh' } })
  });
  const j = await r.json().catch(() => null);
  const out = r.ok && j?.out ? j.out : null;
  if (out) keep(k, out);
  return out;
}
// The cards for a question: the ones sharing its words, those of what's on
// screen next when they share any, six at most.
export function cardsAbout(q, ids = []) {
  const found = cardsFor(q, { en });
  const seen = new Set(found.map(c => c.id));
  const near = ids.filter(id => !seen.has(id)).map(id => cardOf(id, en)).filter(Boolean);
  return (found.length ? [...found.slice(0, 4), ...near] : near).slice(0, 6);
}

const rowOf = id => {
  const n = NODES.get(id)?.node;
  return n ? { lead: ico(n.icon || 'spark'), label: t(n.title), sub: t(n.line), onTap: () => (closeAsk(), openCard(id)) } : null;
};

// One question and its answer, as the conversation shows it.
function exchange(q, ids) {
  const out = h('div', { class: 'sc-ask-a', 'aria-live': 'polite' });
  const box = h('div', { class: 'sc-ask-x' }, [h('p', { class: 'sc-ask-q', text: q }), out]);
  const cards = cardsAbout(q, ids);
  out.replaceChildren(aiAnswerWait({ rows: Math.min(3, Math.max(1, cards.length)), pics: true, text: t(['翻一下 Orbit 的說明…', 'Looking through Orbit’s story…']) }));
  const done = (async () => {
    let ans = null;
    if (cards.length) {
      try {
        ans = await askAi(q, cards);
      } catch {}
    }
    const picked = ans?.ids?.length ? ans.ids : ans ? [] : cards.slice(0, 3).map(c => c.id);
    const rows = picked.map(rowOf).filter(Boolean);
    const line = ans?.line || (rows.length ? t(['這幾張卡片可能有答案：', 'These cards may answer it:']) : t(['Orbit 的說明裡沒有提到這個。換個說法試試？', 'Orbit’s story doesn’t cover that. Try other words?']));
    out.replaceChildren(aiAnswer({ line, sections: [{ rows }] }));
  })();
  return { box, done };
}

// ---- The conversation, in a sheet ----
const thread = [];
let open = null;
function closeAsk() {
  open?.close();
}
export function openAsk(q = '') {
  if (open) open.close();
  const list = h('div', { class: 'sc-ask-thread' }, thread.map(x => x.box));
  const chips = h('div', { class: 'sc-ask-chips' });
  const drawChips = () =>
    chips.replaceChildren(
      ...ctx.qs
        .map(t)
        .filter(s => !thread.some(x => x.q === s))
        .map(s => h('button', { type: 'button', class: 'q-chip q-press', text: s, onclick: () => send(s) }))
    );
  const hello = h('div', { class: 'sc-ask-hello' }, [
    h('p', { text: t(['問任何關於 Orbit 怎麼做出來的事。答案只從 Orbit 自己的說明裡找，附上可以點開的卡片。', 'Ask anything about how Orbit was made. Answers come only from Orbit’s own story, with cards to open.']) })
  ]);
  const bar = aiBar({ placeholder: t(['問 Orbit…', 'Ask Orbit…']), label: t(['問 Orbit', 'Ask Orbit']), max: 200, onSend: s => send(s) });
  async function send(s) {
    const x = exchange(s, ctx.ids);
    thread.push({ q: s, box: x.box });
    list.append(x.box);
    hello.hidden = true;
    bar.clear();
    bar.busy(true);
    drawChips();
    requestAnimationFrame(() => x.box.scrollIntoView({ block: 'start', behavior: 'smooth' }));
    await x.done;
    bar.busy(false);
  }
  hello.hidden = thread.length > 0;
  drawChips();
  open = sheet({
    title: t(['問 Orbit', 'Ask Orbit']),
    lead: h('span', { class: 'sc-ask-mark', 'aria-hidden': 'true' }, [ico('ai')]),
    body: [h('div', { class: 'sc-ask-body' }, [hello, list, chips])],
    foot: h('div', { class: 'q-sheet-foot sc-ask-foot' }, [bar]),
    cls: 'sc-asksheet',
    detent: 'large',
    closeLabel: t(['關閉', 'Close']),
    onClose: () => {
      open = null;
      dock?.update();
    }
  });
  dock?.update();
  if (q) send(q);
  else if (matchMedia('(hover: hover)').matches) setTimeout(() => bar.input.focus(), 300);
}

// ---- The pill along the bottom ----
let dock = null;
export function askDock() {
  if (dock) return dock;
  const say = h('span', { class: 'sc-dock-q' });
  const el = h('button', { class: 'sc-dock', type: 'button', onclick: () => openAsk() }, [
    h('span', { class: 'sc-dock-mark', 'aria-hidden': 'true' }, [ico('ai')]),
    h('span', { class: 'sc-dock-t' }, [h('strong', { text: t(['問 Orbit', 'Ask Orbit']) }), say]),
    h('span', { class: 'sc-dock-go', 'aria-hidden': 'true' }, [ico('send')])
  ]);
  let away = 0; // reasons it steps aside: the top's own buttons, the inline box, an open sheet
  let turn = 0;
  let timer = 0;
  const show = () => el.classList.toggle('away', Boolean(away) || Boolean(open));
  dock = {
    el,
    hide(on, why) {
      away = on ? away | why : away & ~why;
      show();
    },
    update() {
      const qs = ctx.qs.map(t);
      turn = 0;
      say.textContent = qs[0] || '';
      clearInterval(timer);
      // (the questions take turns while it sits there: each one a reason to tap)
      if (qs.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches)
        timer = setInterval(() => {
          turn = (turn + 1) % qs.length;
          say.animate?.([{ opacity: 1 }, { opacity: 0 }], { duration: 180 }).finished?.then(() => {
            say.textContent = qs[turn];
            say.animate?.([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 220 });
          });
        }, 4200);
      show();
    }
  };
  document.body.append(el);
  dock.update();
  return dock;
}
export const AWAY = { top: 1, inline: 2, view: 4 };

// ---- The box inline, where the page ends ----
export function askOrbit() {
  const bar = aiBar({ placeholder: t(['問 Orbit：怎麼做到不花錢？', 'Ask Orbit: how does it stay free?']), label: t(['問 Orbit', 'Ask Orbit']), max: 200, onSend: q => (bar.clear(), openAsk(q)) });
  const chips = h(
    'div',
    { class: 'sc-ask-chips' },
    CONTEXTS.home.qs.concat(CONTEXTS.system.qs.slice(0, 2)).map(s => h('button', { type: 'button', class: 'q-chip q-press', text: t(s), onclick: () => openAsk(t(s)) }))
  );
  const box = h('div', { class: 'sc-ask', id: 'ask' }, [
    h('div', { class: 'sc-ask-head' }, [h('span', { class: 'sc-ask-mark', 'aria-hidden': 'true' }, [ico('ai')]), h('span', {}, [h('strong', { text: t(['還想知道什麼？問 Orbit', 'Anything else? Ask Orbit']) }), h('small', { text: t(['答案只從 Orbit 自己的說明裡找', 'Answers come only from Orbit’s own story']) })])]),
    bar,
    chips
  ]);
  if (typeof IntersectionObserver !== 'undefined') new IntersectionObserver(([e]) => dock?.hide(e.isIntersecting, AWAY.inline)).observe(box);
  return box;
}
