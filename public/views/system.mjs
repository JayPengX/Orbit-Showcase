// 架構 › 系統圖: one app's real system, drawn in layers from the phone down
// to where the data comes from (lib/arch.mjs). Every block is a real file,
// route, store or job, with one plain line; the lines are the requests and
// writes between them. A tap lights a block's own lines (the rest step back)
// and opens what it does, what it talks to, and the moves made there:
// problem → what was built → result, with the numbers. Beside it on a
// computer, in a sheet on a phone (a bar along the foot first).
//   #how/sys-<app>
import { sheet } from '#kit/ui.mjs';
import { h, t, ico, appImg, go, reduced, wide, fold } from '../shell.mjs';
import { GROUPS, LAYERS, PARTS, SYSTEMS, SHARED_MOVES } from '../lib/arch.mjs';
import { NODES } from '../lib/tree.mjs';
import { APPS } from '../lib/apps.mjs';

const SVG = 'http://www.w3.org/2000/svg';
const FIRST = ['phone-pwa', 'kit-orbit'];

let app = null;
let sel = null;
let box = null; // the whole view
let board = null; // the diagram (blocks and lines)
let lines = null;
let detail = null;
let bar = null;
let openSheet = null;
let sized = null;

const appName = id => t(NODES.get(id).node.title).replace(/^Orbit /, '');
const movesOf = id => {
  const sys = SYSTEMS[id];
  return [...sys.moves, ...SHARED_MOVES.filter(m => sys.parts.includes(m.at))];
};
const partEl = id => board?.querySelector(`.sc-part[data-id="${id}"]`);

function partBtn(id, i, moved) {
  const p = PARTS[id];
  return h('button', { class: `sc-part${p.shared ? ' shared' : ''}`, type: 'button', 'data-id': id, style: `--i:${i}`, onclick: () => pickPart(id) }, [
    h('code', { class: 'sc-part-n', text: p.name }),
    h('span', { class: 'sc-part-s', text: t(p.say) }),
    p.shared || moved
      ? h('span', { class: 'sc-part-tags' }, [
          p.shared ? h('span', { class: 'sc-part-tag', text: t(['共用', 'Shared']) }) : null,
          moved ? h('span', { class: 'sc-part-tag move' }, [ico('flame'), t([`${moved} 招`, moved > 1 ? `${moved} moves` : '1 move'])]) : null
        ])
      : null
  ]);
}

function diagram(id) {
  const sys = SYSTEMS[id];
  const moved = new Map();
  for (const m of movesOf(id)) moved.set(m.at, (moved.get(m.at) || 0) + 1);
  lines = document.createElementNS(SVG, 'svg');
  lines.setAttribute('class', 'sc-sys-lines');
  lines.setAttribute('aria-hidden', 'true');
  let i = 0;
  const groups = GROUPS.map(g => {
    const layers = g.layers
      .map(l => {
        const all = sys.parts.filter(p => PARTS[p].layer === l);
        const ids = [...FIRST.filter(p => all.includes(p)), ...all.filter(p => !FIRST.includes(p))];
        if (!ids.length) return null;
        return h('div', { class: `sc-sys-layer l-${l}` }, [
          h('div', { class: 'sc-sys-lname' }, [h('strong', { text: t(LAYERS[l].name) }), h('small', { text: t(LAYERS[l].say) })]),
          h('div', { class: 'sc-sys-parts' }, ids.map(p => partBtn(p, i++, moved.get(p))))
        ]);
      })
      .filter(Boolean);
    return layers.length ? h('section', { class: `sc-sys-group g-${g.id}` }, [h('header', { class: 'sc-sys-gname' }, [h('strong', { text: t(g.name) }), h('span', { text: g.tag })]), ...layers]) : null;
  });
  board = h('div', { class: 'sc-sys', role: 'group', 'aria-label': t([`${appName(id)} 的系統圖`, `${appName(id)}'s system`]) }, [lines, ...groups]);
  return board;
}

// Each line from one block to another: down the page when the other sits
// lower, up when higher, sideways when they share a row. Drawn again when
// anything moves.
function draw(first) {
  if (!board?.isConnected) return;
  const at = board.getBoundingClientRect();
  lines.setAttribute('width', at.width);
  lines.setAttribute('height', at.height);
  lines.setAttribute('viewBox', `0 0 ${at.width} ${at.height}`);
  const seen = new Set();
  const paths = [];
  for (const [from, to] of SYSTEMS[app].flows) {
    const key = `${from}>${to}`;
    if (seen.has(key) || from === to) continue;
    seen.add(key);
    const a = partEl(from)?.getBoundingClientRect();
    const b = partEl(to)?.getBoundingClientRect();
    if (!a || !b) continue;
    const ax = a.left + a.width / 2 - at.left;
    const bx = b.left + b.width / 2 - at.left;
    let d;
    if (b.top >= a.bottom - 4) {
      const y1 = a.bottom - at.top, y2 = b.top - at.top, k = Math.max(24, (y2 - y1) / 2);
      d = `M${ax},${y1} C${ax},${y1 + k} ${bx},${y2 - k} ${bx},${y2}`;
    } else if (b.bottom <= a.top + 4) {
      const y1 = a.top - at.top, y2 = b.bottom - at.top, k = Math.max(24, (y1 - y2) / 2);
      d = `M${ax},${y1} C${ax},${y1 - k} ${bx},${y2 + k} ${bx},${y2}`;
    } else {
      const right = b.left > a.left;
      const x1 = (right ? a.right : a.left) - at.left, x2 = (right ? b.left : b.right) - at.left;
      const y1 = a.top + a.height / 2 - at.top, y2 = b.top + b.height / 2 - at.top;
      const k = Math.max(18, Math.abs(x2 - x1) / 2) * (right ? 1 : -1);
      d = `M${x1},${y1} C${x1 + k},${y1} ${x2 - k},${y2} ${x2},${y2}`;
    }
    paths.push({ from, to, d });
  }
  const have = new Map([...lines.querySelectorAll('path')].map(p => [p.dataset.key, p]));
  for (const { from, to, d } of paths) {
    const key = `${from}>${to}`;
    let p = have.get(key);
    if (!p) {
      p = document.createElementNS(SVG, 'path');
      p.dataset.key = key;
      p.dataset.from = from;
      p.dataset.to = to;
      lines.append(p);
    }
    have.delete(key);
    p.setAttribute('d', d);
  }
  for (const p of have.values()) p.remove();
  if (first && !reduced()) {
    // The lines draw themselves in, after the blocks have landed.
    lines.querySelectorAll('path').forEach((p, n) => {
      const len = p.getTotalLength();
      p.animate([{ strokeDasharray: `${len}`, strokeDashoffset: `${len}` }, { strokeDasharray: `${len}`, strokeDashoffset: '0' }], { duration: 700, delay: 350 + n * 25, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    });
  }
  light();
}

// The picked block's lines lit and moving the way the data goes; the rest stepped back.
function light() {
  if (!board) return;
  board.classList.toggle('has-sel', Boolean(sel));
  const near = new Set(sel ? [sel] : []);
  lines.querySelectorAll('path').forEach(p => {
    const on = sel && (p.dataset.from === sel || p.dataset.to === sel);
    p.classList.toggle('on', Boolean(on));
    if (on) near.add(p.dataset.from).add(p.dataset.to);
  });
  board.querySelectorAll('.sc-part').forEach(b => {
    b.classList.toggle('sel', b.dataset.id === sel);
    b.classList.toggle('near', near.has(b.dataset.id));
    b.setAttribute('aria-pressed', String(b.dataset.id === sel));
  });
}

function link(id, label, dir) {
  return h('li', {}, [
    h('button', { class: 'sc-sys-link', type: 'button', onclick: () => pickPart(id, true) }, [
      h('span', { class: 'sc-sys-dir', text: dir }),
      h('span', {}, [h('code', { text: PARTS[id].name }), h('small', { text: t(label) })])
    ])
  ]);
}

function moveView(m, open) {
  const row = (k, label, text) => h('div', { class: `sc-move-row ${k}` }, [h('strong', { text: t(label) }), h('p', { text: t(text) })]);
  const body = [row('p', ['問題', 'Problem'], m.problem), row('b', ['做法', 'What we built'], m.built), row('r', ['結果', 'Result'], m.result), m.numbers ? h('p', { class: 'sc-move-num' }, [ico('chart'), m.numbers]) : null];
  if (open) return h('div', { class: 'sc-card sc-move in' }, [h('h4', { class: 'sc-move-t' }, [ico('flame'), t(m.title)]), ...body]);
  return fold('sc-move', [h('span', { class: 'sc-move-i' }, [ico('flame')]), h('span', { class: 'sc-row-text' }, [h('strong', { text: t(m.title) }), h('small', { text: t(m.result) })])], [
    ...body,
    h('button', { class: 'sc-more sc-move-go', type: 'button', onclick: () => pickPart(m.at, true) }, [t(['在圖上看它在哪', 'Show it on the diagram']), ico('chevron')])
  ]);
}

function partView(id) {
  const p = PARTS[id];
  const flows = SYSTEMS[app].flows;
  const outs = flows.filter(f => f[0] === id && f[1] !== id);
  const ins = flows.filter(f => f[1] === id && f[0] !== id);
  const moves = movesOf(app).filter(m => m.at === id);
  return h('div', { class: 'sc-sys-part' }, [
    h('p', { class: 'sc-sys-where', text: t(LAYERS[p.layer].name) }),
    h('h3', {}, [h('code', { text: p.name })]),
    h('p', { class: 'sc-sys-say', text: t(p.say) }),
    p.shared ? h('p', { class: 'sc-sys-note' }, [ico('grid'), t(['九個 App 共用這一塊，寫一次、全家一起用。', 'All nine apps share this piece: written once, used by the whole family.'])]) : null,
    outs.length ? h('h4', { text: t(['它去找', 'It reaches']) }) : null,
    outs.length ? h('ul', { class: 'sc-sys-links' }, outs.map(f => link(f[1], f[2], '→'))) : null,
    ins.length ? h('h4', { text: t(['找它的', 'Reached by']) }) : null,
    ins.length ? h('ul', { class: 'sc-sys-links' }, ins.map(f => link(f[0], f[2], '←'))) : null,
    ...moves.map(m => moveView(m, true))
  ]);
}

function intro() {
  const sys = SYSTEMS[app];
  return h('div', { class: 'sc-sys-part' }, [
    h('p', { class: 'sc-sys-where', text: t(['怎麼看這張圖', 'Reading the diagram']) }),
    h('h3', { text: t([`${appName(app)}：${sys.parts.length} 塊、${sys.flows.length} 條路`, `${appName(app)}: ${sys.parts.length} parts, ${sys.flows.length} paths`]) }),
    h('p', { class: 'sc-sys-say', text: t(['從上往下：手機上的 App，經過代理伺服器這座橋，到後端的儲存和排程，最後是資料真正的來源。每一塊都是真的檔案、路徑或資料庫名稱。點一塊，它的線會亮起來。', 'Top to bottom: the app on the phone, across the proxy (the bridge), to the storage and jobs behind it, and where the data really comes from. Every block is a real file, route or store. Tap one and its lines light up.']) }),
    h('p', { class: 'sc-sys-note' }, [ico('flame'), t(['有火焰的是花了功夫的地方：下面「做得好的地方」講問題、做法和數字。', 'A flame marks a place that took real work: “Moves” below gives the problem, the fix and the numbers.'])])
  ]);
}

function barFor(id) {
  if (!bar) return;
  if (!id) return bar.replaceChildren();
  const p = PARTS[id];
  bar.replaceChildren(
    h('button', { class: 'sc-pickbar-in', type: 'button', onclick: () => showSheet(id) }, [
      h('span', { class: 'sc-dot', style: '--c:var(--sc-ac)' }, [ico(p.layer === 'sources' ? 'map' : p.layer === 'jobs' ? 'clock' : p.layer === 'storage' ? 'grid' : p.layer === 'worker' ? 'exchange' : 'home')]),
      h('span', { class: 'sc-row-text' }, [h('strong', { text: p.name }), h('small', { text: t(p.say) })]),
      h('span', { class: 'sc-pickbar-go' }, [t(['說明', 'Read']), ico('chevron')])
    ])
  );
}

function showSheet(id) {
  closeSheet();
  const s = sheet({ title: '', body: [partView(id)], cls: 'sc-nodesheet', closeLabel: t(['關閉', 'Close']), onClose: () => openSheet === s && (openSheet = null) });
  openSheet = s;
}
function closeSheet() {
  const s = openSheet;
  openSheet = null;
  s?.close();
}

function pickPart(id, show) {
  sel = sel === id && !show ? null : id;
  light();
  if (wide()) detail.replaceChildren(sel ? partView(sel) : intro());
  else barFor(sel);
  if (show) {
    closeSheet();
    const el = partEl(id);
    el?.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
  }
}

function build(id) {
  app = id;
  sel = null;
  const moves = movesOf(id);
  const picker = h(
    'div',
    { class: 'sc-sys-apps', role: 'tablist', 'aria-label': t(['選一個 App', 'Pick an app']) },
    APPS.map(a => h('button', { class: `sc-sys-app${a.id === id ? ' on' : ''}`, type: 'button', role: 'tab', 'aria-selected': String(a.id === id), onclick: () => go('how', `sys-${a.id}`) }, [appImg(a.brand, 26), h('span', { text: appName(a.id) })]))
  );
  detail = h('aside', { class: 'sc-detail sc-sys-detail', 'aria-live': 'polite' }, [intro()]);
  bar = h('div', { class: 'sc-pickbar' });
  box = h('div', { class: 'sc-syswrap' }, [
    h('div', { class: 'sc-syscol' }, [
      picker,
      h('p', { class: 'sc-lede-s', text: t(['使用者端（App）→ 伺服器（Proxy）→ 後端 → 外部資料。點任何一塊，看它做什麼、連到哪裡。', 'User side (the app) → server (the proxy) → backend → outside sources. Tap any block to see what it does and what it talks to.']) }),
      diagram(id),
      bar,
      h('h2', { class: 'sc-h2 sc-sys-movesh', text: t(['做得好的地方', 'Moves']) }),
      h('p', { class: 'sc-lede-s', text: t(['每一招都是先撞到問題才做的。數字來自程式碼的註解和當時的 commit。', 'Each one came from hitting a real problem. The numbers come from the code’s comments and the commits that made them.']) }),
      h('div', { class: 'sc-moves' }, moves.map(m => moveView(m)))
    ]),
    detail
  ]);
  const at = box.querySelector('.sc-sys-app.on');
  requestAnimationFrame(() => at?.scrollIntoView({ inline: 'center', block: 'nearest' }));
  return box;
}

export function renderSystem(slot, what) {
  const id = SYSTEMS[what] ? what : 'sports';
  if (app === id && box?.isConnected) return;
  closeSheet();
  slot.replaceChildren(build(id));
  sized?.disconnect();
  sized = new ResizeObserver(() => draw(false));
  sized.observe(board);
  document.fonts?.ready.then(() => draw(false));
  requestAnimationFrame(() => draw(true));
}

export function leaveSystem() {
  closeSheet();
}
