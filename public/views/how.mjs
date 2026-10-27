// 架構: the system diagram (views/system.mjs), the structure tree and the
// map. The tree is the whole system in plain words, short at the top, deeper
// as it opens; a node opens its
// problem → idea → result, its related nodes, and the technical names behind
// a fold. Beside it on a computer, in a sheet on a phone. The map walks five
// everyday stories across the system's five rows, a dot travelling between
// the places each step happens.
//   #how, #how/sys-<app>  the system diagram
//   #how/tree       the tree
//   #how/<node id>  the tree, that node open
//   #how/map[-<story>]  the map
import { segmented, sheet, tile } from '#kit/ui.mjs';
import { h, t, ico, appImg, go, reduced, wide, en } from '../shell.mjs';
import { ROOT, NODES, pathTo } from '../lib/tree.mjs';
import { ROWS, STORIES } from '../lib/stories.mjs';
import { pir } from './apps.mjs';
import { renderSystem, leaveSystem } from './system.mjs';

const BRAND = { sports: 'match', transit: 'transit', weather: 'weather', class: 'orbit', words: 'vocab', beats: 'beats', law: 'law', securities: 'stock', money: 'money' };

// ---- The tree ----
// A real tree: Orbit at the root, each branch joined to its parent by a
// curved line. Opening a branch closes its open siblings, so one path stays
// in view; nodes glide to their new places and the lines follow them (both
// drawn every frame, the same in WebKit and Chromium).
const open = new Set();
let treeBox = null; // the box that scrolls sideways
let canvas = null; // the nodes and the lines
let lines = null;
let detailBox = null;
let pickBar = null;
let picked = null;
let openSheet = null;
const shown = new Map(); // id → { el, path, x, y, o, sx, sy, so, tx, ty, to, gone }
let anim = 0;
const PAD = 14;

// Each top branch its own colour, carried down to everything under it.
const HUE = { apps: 'var(--q-orange)', kit: 'var(--q-indigo)', pass: 'var(--q-brown)', cloud: 'var(--q-cyan)', store: 'var(--q-green)', fast: 'var(--q-red)', cheap: 'var(--q-yellow)', ship: 'var(--q-blue)', team: 'var(--q-pink)' };
const hue = id => HUE[pathTo(id)[1]?.id] || 'var(--sc-ac)';
const mark = node => (BRAND[node.id] ? appImg(BRAND[node.id], 30, 'sc-node-app') : h('span', { class: 'sc-dot', style: `--c:${hue(node.id)}` }, [ico(node.icon)]));
// Column step, card width and the height each row of leaves takes.
const dims = () => (wide() ? { col: 248, w: 212, slot: 64 } : { col: 160, w: 140, slot: 62 });

function nodeEl(id) {
  const node = NODES.get(id).node;
  const n = node.kids?.length || 0;
  const icon = id === ROOT.id ? appImg(null, 28) : BRAND[id] ? appImg(BRAND[id], 26) : h('span', { class: 'sc-tn-i' }, [ico(node.icon)]);
  return h('button', { class: `sc-tn${id === ROOT.id ? ' root' : ''}${n ? ' has-kids' : ''}`, type: 'button', 'data-id': id, style: `--c:${hue(id)}`, 'aria-expanded': n ? 'false' : null, onclick: () => tap(id) }, [
    icon,
    h('span', { class: 'sc-tn-t', text: id === ROOT.id ? t(node.title) : t(node.title).replace(/^Orbit /, '') }),
    n && id !== ROOT.id ? h('span', { class: 'sc-tn-n', 'aria-label': t([`${n} 項`, `${n} inside`]), text: String(n) }) : null
  ]);
}

// Where every visible node sits: leaves one row each, a parent at the
// middle of its children, one column per level.
function layout() {
  const d = dims();
  const pos = new Map();
  let row = 0;
  (function place(node, depth) {
    const kids = node === ROOT || open.has(node.id) ? node.kids || [] : [];
    let y;
    if (kids.length) {
      const ys = kids.map(k => place(k, depth + 1));
      y = (ys[0] + ys.at(-1)) / 2;
    } else y = row++ * d.slot;
    pos.set(node.id, { x: depth * d.col, y });
    return y;
  })(ROOT, 0);
  return { pos, rows: row, d };
}

const ease = k => 1 - Math.pow(1 - k, 3);
let last = null;
function render() {
  const { pos, rows, d } = (last = layout());
  for (const [id, p] of pos) {
    let e = shown.get(id);
    if (!e) {
      const from = shown.get(NODES.get(id).parent) || { x: p.x, y: p.y };
      e = { el: nodeEl(id), path: document.createElementNS('http://www.w3.org/2000/svg', 'path'), x: from.x, y: from.y, o: 0 };
      e.path.style.stroke = hue(id);
      if (id !== ROOT.id) lines.append(e.path);
      canvas.append(e.el);
      shown.set(id, e);
    }
    Object.assign(e, { tx: p.x, ty: p.y, to: 1, gone: false });
    e.el.classList.toggle('open', open.has(id));
    e.el.classList.toggle('on', id === picked);
    if (e.el.hasAttribute('aria-expanded')) e.el.setAttribute('aria-expanded', String(open.has(id)));
  }
  for (const [id, e] of shown) {
    if (pos.has(id)) continue;
    let up = NODES.get(id).parent;
    while (up && !pos.has(up)) up = NODES.get(up).parent;
    const p = pos.get(up) || { x: 0, y: 0 };
    Object.assign(e, { tx: p.x, ty: p.y, to: 0, gone: true });
  }
  const width = Math.max(...[...pos.values()].map(p => p.x)) + d.w + PAD * 2;
  const height = rows * d.slot + PAD * 2;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${Math.max(height, parseFloat(canvas.style.height) || 0)}px`;
  lines.setAttribute('width', String(width));
  for (const e of shown.values()) Object.assign(e, { sx: e.x, sy: e.y, so: e.o });
  cancelAnimationFrame(anim);
  const t0 = performance.now();
  const dur = reduced() ? 0 : 460;
  const frame = now => {
    const k = dur ? ease(Math.min(1, (now - t0) / dur)) : 1;
    for (const e of shown.values()) {
      e.x = e.sx + (e.tx - e.sx) * k;
      e.y = e.sy + (e.ty - e.sy) * k;
      e.o = e.so + (e.to - e.so) * k;
    }
    draw(d);
    if (k < 1) anim = requestAnimationFrame(frame);
    else {
      for (const [id, e] of shown) if (e.gone) (e.el.remove(), e.path.remove(), shown.delete(id));
      canvas.style.height = `${height}px`;
      lines.setAttribute('height', String(height));
    }
  };
  lines.setAttribute('height', canvas.style.height);
  anim = requestAnimationFrame(frame);
}

function draw(d) {
  for (const [id, e] of shown) {
    const top = PAD + e.y + d.slot / 2;
    e.el.style.transform = `translate(${PAD + e.x}px, ${top}px) translateY(-50%) scale(${0.7 + 0.3 * e.o})`;
    e.el.style.opacity = String(e.o);
    const par = shown.get(NODES.get(id).parent);
    if (!par) continue;
    const x1 = PAD + par.x + d.w;
    const y1 = PAD + par.y + d.slot / 2;
    const x2 = PAD + e.x;
    const mid = (x1 + x2) / 2;
    e.path.setAttribute('d', `M${x1} ${y1}C${mid} ${y1} ${mid} ${top} ${x2} ${top}`);
    e.path.style.opacity = String(e.o);
  }
}

// Open a node and the path to it; its open siblings close.
function shut(id) {
  open.delete(id);
  for (const k of NODES.get(id).node.kids || []) shut(k.id);
}
function openTo(id) {
  for (const p of pathTo(id).slice(1)) {
    if (!p.kids?.length) continue;
    for (const sib of NODES.get(NODES.get(p.id).parent).node.kids) if (sib.id !== p.id && open.has(sib.id)) shut(sib.id);
    open.add(p.id);
  }
}

function tap(id) {
  const node = NODES.get(id).node;
  if (id === ROOT.id) [...open].forEach(x => open.delete(x));
  else if (node.kids?.length) {
    if (open.has(id) && picked === id) shut(id);
    else openTo(id);
  } else openTo(NODES.get(id).parent);
  select(id);
  history.replaceState(null, '', id === ROOT.id ? '#how/tree' : `#how/${id}`);
  if (!wide() && !node.kids?.length) showSheet(id);
}

function select(id) {
  picked = id;
  render();
  if (wide()) detailBox.replaceChildren(nodeView(id));
  else barFor(id);
  focus(id);
}

// Bring the picked node, and its children when open, into view.
function focus(id) {
  const { pos, d } = last;
  const p = pos.get(id);
  if (!p || !treeBox.clientWidth) return;
  const kids = open.has(id) ? NODES.get(id).node.kids || [] : [];
  const span = kids.length ? d.col + d.w : d.w;
  const left = PAD + p.x - Math.max(8, (treeBox.clientWidth - span) / 2);
  treeBox.scrollTo({ left: Math.max(0, left), behavior: reduced() ? 'auto' : 'smooth' });
  const ys = kids.length ? kids.map(k => pos.get(k.id).y) : [p.y];
  const box = treeBox.getBoundingClientRect();
  const top = box.top + PAD + Math.min(...ys);
  const bottom = box.top + PAD + Math.max(...ys) + d.slot;
  const room = innerHeight - (wide() ? 0 : 150);
  if (top < 70 || bottom > room) {
    const want = scrollY + top - Math.max(80, (room - (bottom - top)) / 2);
    window.scrollTo({ top: Math.max(0, want), behavior: reduced() ? 'auto' : 'smooth' });
  }
}

// On a phone: the picked node in a bar along the foot, its full card one tap away.
function barFor(id) {
  const node = NODES.get(id).node;
  pickBar.replaceChildren(
    h('button', { class: 'sc-pickbar-in', type: 'button', onclick: () => showSheet(id) }, [
      id === ROOT.id ? appImg(null, 34) : mark(node),
      h('span', { class: 'sc-row-text' }, [h('strong', { text: t(node.title) }), h('small', { text: t(node.line) })]),
      h('span', { class: 'sc-pickbar-go' }, [t(['說明', 'Read']), ico('chevron')])
    ])
  );
}

function showSheet(id) {
  if (openSheet) {
    const was = openSheet;
    openSheet = null;
    was.close();
  }
  const s = sheet({
    title: '',
    body: [nodeView(id)],
    cls: 'sc-nodesheet',
    closeLabel: t(['關閉', 'Close']),
    onClose: () => {
      if (openSheet === s) openSheet = null;
    }
  });
  openSheet = s;
}

// A mouse can drag the tree sideways, like a map.
function dragPan(box) {
  let from = null;
  box.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.target.closest('button')) return;
    from = { x: e.clientX, y: e.clientY, l: box.scrollLeft, t: scrollY };
    box.classList.add('dragging');
  });
  addEventListener('pointermove', e => {
    if (!from) return;
    box.scrollLeft = from.l - (e.clientX - from.x);
    window.scrollTo(0, from.t - (e.clientY - from.y));
  });
  addEventListener('pointerup', () => {
    from = null;
    box.classList.remove('dragging');
  });
}

function nodeView(id) {
  const at = NODES.get(id);
  const node = at.node;
  const path = pathTo(id);
  const crumbs = h(
    'nav',
    { class: 'sc-crumbs', 'aria-label': t(['位置', 'Where']) },
    path.slice(0, -1).map(p => h('a', { href: `#how/${p.id}` }, [t(p.title)]))
  );
  const chipsOf = ids =>
    h(
      'div',
      { class: 'sc-chips' },
      ids
        .map(x => (typeof x === 'string' ? NODES.get(x)?.node : x))
        .filter(Boolean)
        .map(k => h('a', { class: 'sc-chip', href: `#how/${k.id}` }, [ico(k.icon), t(k.title)]))
    );
  const back = (node.links || []).filter(x => NODES.has(x));
  const pointing = [...NODES.values()].filter(v => (v.node.links || []).includes(id)).map(v => v.node.id);
  const related = [...new Set([...back, ...pointing])];
  return h('div', { class: 'sc-detail-in' }, [
    path.length > 1 ? crumbs : null,
    h('header', { class: 'sc-detail-head' }, [BRAND[node.id] ? appImg(BRAND[node.id], 52) : node.id === 'orbit' ? appImg(null, 52) : tile(ico(node.icon), hue(node.id), ''), h('div', {}, [h('h2', { text: t(node.title) }), h('p', { text: t(node.line) })])]),
    node.p || node.i || node.r ? h('div', { class: 'sc-pir' }, pir(node)) : null,
    node.tech
      ? h('details', { class: 'sc-tech' }, [h('summary', {}, [ico('pencil'), t(['技術細節（給好奇的人）', 'Technical details (for the curious)'])]), h('p', { text: t(node.tech) })])
      : null,
    node.kids?.length ? h('div', { class: 'sc-sub' }, [h('h3', { class: 'sc-h3', text: t(['裡面還有', 'Inside']) }), chipsOf(node.kids)]) : null,
    related.length ? h('div', { class: 'sc-sub' }, [h('h3', { class: 'sc-h3', text: t(['相關', 'Related']) }), chipsOf(related)]) : null
  ]);
}

function search(q) {
  const out = treeBox.parentElement.querySelector('.sc-found');
  const words = q.trim().toLowerCase();
  treeBox.hidden = Boolean(words);
  if (!words) return out.replaceChildren();
  const hits = [...NODES.values()].filter(({ node }) => [node.title, node.line, node.p, node.i, node.r, node.tech].some(x => x && x.join(' ').toLowerCase().includes(words)));
  out.replaceChildren(
    hits.length
      ? h(
          'ul',
          {},
          hits.slice(0, 60).map(({ node }) =>
            h('li', {}, [
              h('a', { href: `#how/${node.id}`, class: 'sc-hit' }, [
                mark(node),
                h('span', { class: 'sc-row-text' }, [h('strong', { text: t(node.title) }), h('small', { text: pathTo(node.id).slice(1, -1).map(p => t(p.title)).join(' › ') || t(node.line) })])
              ])
            ])
          )
        )
      : h('p', { class: 'sc-note', text: t(['找不到。換個說法試試看？', 'Nothing found. Try other words?']) })
  );
}

function buildTree() {
  lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lines.setAttribute('class', 'sc-tlines');
  lines.setAttribute('aria-hidden', 'true');
  canvas = h('div', { class: 'sc-tcanvas' }, [lines]);
  treeBox = h('div', { class: 'sc-tree', role: 'group', 'aria-label': t(['Orbit 的樹狀圖', 'Orbit as a tree']) }, [canvas]);
  dragPan(treeBox);
  detailBox = h('aside', { class: 'sc-detail', 'aria-live': 'polite' });
  pickBar = h('div', { class: 'sc-pickbar' });
  const field = h('input', { type: 'search', class: 'sc-search', placeholder: t(['搜尋：例如「颱風」「備份」「YouBike」', 'Search: “typhoon”, “backup”, “YouBike”…']), 'aria-label': t(['搜尋架構', 'Search the structure']) });
  field.addEventListener('input', () => search(field.value));
  let size = wide();
  addEventListener('resize', () => {
    if (wide() === size || !canvas.isConnected) return;
    size = wide();
    select(picked || ROOT.id);
  });
  return h('div', { class: 'sc-treewrap' }, [
    h('div', { class: 'sc-treecol' }, [
      h('p', { class: 'sc-lede-s', text: t(['整個 Orbit 畫成一棵樹：從左邊的根開始，點一個分支就長出下一層，越往右越細。每一項都寫著遇到什麼問題、怎麼想、結果怎樣。', 'All of Orbit as one tree: start at the root on the left, tap a branch and the next level grows out of it, more detail the further right. Each part says the problem, the idea and the result.']) }),
      h('label', { class: 'sc-searchbox' }, [ico('search'), field]),
      h('div', { class: 'sc-found' }),
      treeBox,
      pickBar
    ]),
    detailBox
  ]);
}

// From the address (#how/<node>): open the path to it; a phone shows its card.
function pick(id, fromLink) {
  if (!NODES.has(id)) id = ROOT.id;
  if (id !== ROOT.id) openTo(NODES.get(id).node.kids?.length ? id : NODES.get(id).parent);
  if (wide()) openSheet?.close();
  select(id);
  if (!wide() && fromLink && id !== ROOT.id) showSheet(id);
}

// ---- The map ----
let mapState = null;

function mapView(storyId) {
  const story = STORIES.find(s => s.id === storyId) || STORIES[0];
  const nodes = new Map();
  const grid = h(
    'div',
    { class: 'sc-map' },
    ROWS.map(row =>
      h('div', { class: `sc-maprow sc-maprow-${row.id}` }, [
        h('span', { class: 'sc-maprow-l', text: t(row.label) }),
        h(
          'div',
          { class: 'sc-maprow-n' },
          row.nodes.map(n => {
            const b = h('button', { class: 'sc-mapnode', type: 'button', 'data-node': n.id, title: t(['在樹狀圖裡看', 'See it in the tree']), onclick: () => n.tree && go('how', n.tree) }, [ico(n.icon), h('span', { text: t(n.label) })]);
            nodes.set(n.id, b);
            return b;
          })
        )
      ])
    )
  );
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'sc-mapsvg');
  svg.setAttribute('aria-hidden', 'true');
  grid.append(svg);
  const say = h('p', { class: 'sc-step-text', 'aria-live': 'polite' });
  const nth = h('span', { class: 'sc-step-n' });
  const bar = h('span', { class: 'sc-step-bar' });
  const playBtn = h('button', { class: 'sc-btn sc-btn-main', type: 'button', onclick: () => (playing ? stop() : play()) });
  const prev = h('button', { class: 'sc-btn sc-icon', type: 'button', 'aria-label': t(['上一步', 'Back']), onclick: () => (stop(), step(i - 1)) }, [ico('chevron')]);
  const next = h('button', { class: 'sc-btn sc-icon', type: 'button', 'aria-label': t(['下一步', 'Next']), onclick: () => (stop(), step(i + 1)) }, [ico('chevron')]);
  const pickers = h(
    'div',
    { class: 'sc-stories' },
    STORIES.map(s => h('a', { href: `#how/map-${s.id}`, class: `sc-story${s === story ? ' on' : ''}` }, [s.app ? appImg(s.app, 28) : tile(ico(s.icon), '', 'sm'), h('span', { text: t(s.title) })]))
  );
  const card = h('div', { class: 'sc-stepcard' }, [h('div', { class: 'sc-step-top' }, [nth, h('span', { class: 'sc-step-track' }, [bar])]), say, h('div', { class: 'sc-step-btns' }, [prev, playBtn, next])]);

  let i = -1;
  let playing = false;
  let timer = 0;
  let anim = 0;
  const centre = id => {
    const b = nodes.get(id);
    const box = grid.getBoundingClientRect();
    const r = b.getBoundingClientRect();
    return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2];
  };
  const curve = (a, b) => {
    const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const bend = a[0] === b[0] && a[1] === b[1] ? 0 : 0.25;
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    return [mx - dy * bend, my + dx * bend];
  };
  const NS = 'http://www.w3.org/2000/svg';
  const draw = (animateLast = false) => {
    cancelAnimationFrame(anim);
    const box = grid.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.replaceChildren();
    const spots = story.steps.slice(0, i + 1).map(([id]) => centre(id));
    for (let k = 1; k < spots.length; k++) {
      const [a, b] = [spots[k - 1], spots[k]];
      if (a[0] === b[0] && a[1] === b[1]) continue;
      const c = curve(a, b);
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`);
      p.setAttribute('class', k === spots.length - 1 ? 'sc-trail now' : 'sc-trail');
      svg.append(p);
      if (k === spots.length - 1 && animateLast && !reduced() && p.getTotalLength) {
        const L = p.getTotalLength();
        p.style.strokeDasharray = `${L}`;
        p.style.strokeDashoffset = `${L}`;
        p.getBoundingClientRect();
        p.style.transition = 'stroke-dashoffset 700ms cubic-bezier(0.32, 0.72, 0, 1)';
        p.style.strokeDashoffset = '0';
      }
    }
    if (!spots.length) return;
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('r', '7');
    dot.setAttribute('class', 'sc-dot');
    svg.append(dot);
    const end = spots.at(-1);
    const from = spots.length > 1 ? spots.at(-2) : end;
    if (!animateLast || reduced() || from === end) {
      dot.setAttribute('cx', end[0]);
      dot.setAttribute('cy', end[1]);
      return;
    }
    const c = curve(from, end);
    const t0 = performance.now();
    const move = now => {
      const k = Math.min(1, (now - t0) / 700);
      const e = 1 - (1 - k) ** 3;
      const x = (1 - e) ** 2 * from[0] + 2 * (1 - e) * e * c[0] + e ** 2 * end[0];
      const y = (1 - e) ** 2 * from[1] + 2 * (1 - e) * e * c[1] + e ** 2 * end[1];
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      if (k < 1) anim = requestAnimationFrame(move);
    };
    anim = requestAnimationFrame(move);
  };
  const step = k => {
    k = Math.max(0, Math.min(story.steps.length - 1, k));
    i = k;
    const [id, text] = story.steps[k];
    nodes.forEach((b, nid) => {
      b.classList.toggle('on', nid === id);
      b.classList.toggle('been', story.steps.slice(0, k).some(([x]) => x === nid));
    });
    say.textContent = t(text);
    nth.textContent = en ? `Step ${k + 1} of ${story.steps.length}` : `第 ${k + 1} 步，共 ${story.steps.length} 步`;
    bar.style.width = `${((k + 1) / story.steps.length) * 100}%`;
    prev.disabled = k === 0;
    next.disabled = k === story.steps.length - 1;
    draw(true);
    if (!wide()) {
      const r = nodes.get(id).getBoundingClientRect();
      const cardTop = card.getBoundingClientRect().top;
      const off = r.bottom > cardTop - 12 ? r.bottom - cardTop + 24 : r.top < 70 ? r.top - 90 : 0;
      if (off) window.scrollBy({ top: off, behavior: reduced() ? 'auto' : 'smooth' });
    }
  };
  const label = () => playBtn.replaceChildren(ico(playing ? 'x' : 'play'), playing ? t(['停', 'Stop']) : i >= story.steps.length - 1 ? t(['再看一次', 'Again']) : t(['播放', 'Play']));
  const play = () => {
    if (i >= story.steps.length - 1) step(0);
    playing = true;
    label();
    clearInterval(timer);
    timer = setInterval(() => {
      if (!grid.isConnected) return stop();
      if (i >= story.steps.length - 1) return stop();
      step(i + 1);
    }, 2600);
  };
  const stop = () => {
    playing = false;
    clearInterval(timer);
    label();
  };
  const view = h('div', { class: 'sc-mapwrap' }, [
    h('p', { class: 'sc-lede-s', text: t(['你在手機上按一下，背後發生了什麼事？選一個故事，看它一步一步走過整個系統。點地圖上的任何一格，可以打開它的說明。', 'What happens behind a single tap? Pick a story and watch it walk through the whole system, step by step. Tap any spot on the map to read about it.']) }),
    pickers,
    h('div', { class: 'sc-mapbody' }, [grid, card])
  ]);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => i >= 0 && draw(false)).observe(grid);
  mapState?.stop();
  mapState = { stop, start: () => (step(0), reduced() ? label() : play()) };
  return view;
}

// ---- The tab ----
let built = null;
let seg = null;
let mode = '';
let sysApp = null;

export function renderHow(panel, what = '') {
  const view = !what || what.startsWith('sys') ? 'sys' : what.startsWith('map') ? 'map' : 'tree';
  if (!built) {
    seg = segmented(
      [
        { id: 'sys', label: t(['系統圖', 'System']) },
        { id: 'tree', label: t(['樹狀圖', 'Tree']) },
        { id: 'map', label: t(['旅程', 'Journeys']) }
      ],
      { value: view, onChange: id => go('how', id === 'map' ? 'map' : id === 'sys' ? `sys-${sysApp || 'sports'}` : picked && picked !== ROOT.id ? picked : 'tree') }
    );
    built = { sys: h('div', { class: 'sc-sysslot' }), tree: buildTree(), map: h('div', { class: 'sc-mapslot' }) };
    panel.replaceChildren(h('div', { class: 'sc-how' }, [h('div', { class: 'sc-segbox' }, [seg]), built.sys, built.tree, built.map]));
  }
  seg.set(view);
  for (const k of ['sys', 'tree', 'map']) built[k].hidden = k !== view;
  if (view !== 'map') mapState?.stop();
  if (view !== 'tree') openSheet?.close();
  if (view !== 'sys') leaveSystem();
  const from = mode;
  if (view === 'sys') {
    sysApp = what.slice(4) || sysApp || 'sports';
    mode = 'sys';
    renderSystem(built.sys, sysApp);
    return;
  }
  if (view === 'map') {
    const storyId = what.slice(4) || STORIES[0].id;
    if (mode !== `map-${storyId}`) {
      built.map.replaceChildren(mapView(storyId));
      requestAnimationFrame(() => requestAnimationFrame(() => mapState.start()));
    }
    mode = `map-${storyId}`;
    return;
  }
  mode = 'tree';
  const id = what === 'tree' ? '' : what;
  if (id && id === picked && from === 'tree') return;
  requestAnimationFrame(() => pick(id || ROOT.id, Boolean(id)));
}

// Leaving the tab: a phone's open sheet closes, the map stops.
export function leaveHow() {
  mapState?.stop();
  leaveSystem();
  if (openSheet) {
    const s = openSheet;
    openSheet = null;
    s.close();
  }
}
