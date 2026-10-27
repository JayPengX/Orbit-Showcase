// 架構: the structure tree and the map. The tree is the whole system in
// plain words, short at the top, deeper as it opens; a node opens its
// problem → idea → result, its related nodes, and the technical names behind
// a fold. Beside it on a computer, in a sheet on a phone. The map walks five
// everyday stories across the system's five rows, a dot travelling between
// the places each step happens.
//   #how            the tree
//   #how/<node id>  the tree, that node open
//   #how/map[-<story>]  the map
import { segmented, sheet, tile } from '#kit/ui.mjs';
import { h, t, ico, appImg, go, reduced, wide, en } from '../shell.mjs';
import { ROOT, NODES, pathTo } from '../lib/tree.mjs';
import { ROWS, STORIES } from '../lib/stories.mjs';
import { pir } from './apps.mjs';

const BRAND = { sports: 'match', transit: 'transit', weather: 'weather', class: 'orbit', words: 'vocab', beats: 'beats', law: 'law', securities: 'stock', money: 'money' };
const count = node => (node.kids || []).reduce((n, k) => n + 1 + count(k), 0);

// ---- The tree ----
const open = new Set();
let treeBox = null;
let detailBox = null;
let picked = null;
let openSheet = null;

// Each top branch its own colour, carried down to everything under it.
const HUE = { apps: 'var(--q-orange)', kit: 'var(--q-indigo)', pass: 'var(--q-brown)', cloud: 'var(--q-cyan)', store: 'var(--q-green)', fast: 'var(--q-red)', cheap: 'var(--q-yellow)', ship: 'var(--q-blue)', team: 'var(--q-pink)' };
const hue = id => HUE[pathTo(id)[1]?.id] || '';
const mark = node => (BRAND[node.id] ? appImg(BRAND[node.id], 30, 'sc-node-app') : tile(ico(node.icon), hue(node.id), 'sm'));

function branch(node, depth) {
  const kids = node.kids || [];
  const li = h('li', { class: `sc-node${kids.length ? ' has-kids' : ''}`, 'data-id': node.id, 'data-depth': String(depth) });
  const toggle = kids.length
    ? h('button', { class: 'sc-toggle', type: 'button', 'aria-expanded': 'false', 'aria-label': t(['展開', 'Expand']), onclick: () => flip(node.id) }, [ico('chevron')])
    : h('span', { class: 'sc-toggle sc-leaf', 'aria-hidden': 'true' });
  const main = h('button', { class: 'sc-row-main', type: 'button', onclick: () => go('how', node.id) }, [
    mark(node),
    h('span', { class: 'sc-row-text' }, [h('strong', { text: t(node.title) }), h('small', { text: t(node.line) })]),
    kids.length ? h('span', { class: 'sc-row-n', text: String(count(node)) }) : null
  ]);
  li.append(h('div', { class: 'sc-row' }, [toggle, main]));
  if (kids.length) li.append(h('div', { class: 'sc-kids', inert: '' }, [h('ul', {}, kids.map(k => branch(k, depth + 1)))]));
  return li;
}

function flip(id, on = !open.has(id)) {
  if (on) open.add(id);
  else open.delete(id);
  const li = treeBox?.querySelector(`[data-id="${id}"]`);
  if (!li) return;
  li.classList.toggle('open', on);
  li.querySelector(':scope > .sc-row > .sc-toggle')?.setAttribute('aria-expanded', String(on));
  const kids = li.querySelector(':scope > .sc-kids');
  if (kids) kids.inert = !on;
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
  treeBox = h('ul', { class: 'sc-tree' }, (ROOT.kids || []).map(k => branch(k, 0)));
  detailBox = h('aside', { class: 'sc-detail', 'aria-live': 'polite' });
  const field = h('input', { type: 'search', class: 'sc-search', placeholder: t(['搜尋：例如「颱風」「備份」「YouBike」', 'Search: “typhoon”, “backup”, “YouBike”…']), 'aria-label': t(['搜尋架構', 'Search the structure']) });
  field.addEventListener('input', () => search(field.value));
  return h('div', { class: 'sc-treewrap' }, [
    h('div', { class: 'sc-treecol' }, [
      h('p', { class: 'sc-lede-s', text: t(['整個 Orbit 拆成一棵樹：最上面很簡單，點開越來越細。每一項都寫著遇到什麼問題、怎麼想、結果怎樣。', 'All of Orbit as one tree: simple at the top, more detail as you open it. Each part says the problem, the idea and the result.']) }),
      h('label', { class: 'sc-searchbox' }, [ico('search'), field]),
      h('div', { class: 'sc-found' }),
      treeBox
    ]),
    detailBox
  ]);
}

function pick(id) {
  if (!NODES.has(id)) id = ROOT.id;
  picked = id;
  for (const p of pathTo(id).slice(1, -1)) flip(p.id, true);
  treeBox.querySelectorAll('.sc-row.on').forEach(r => r.classList.remove('on'));
  const row = treeBox.querySelector(`[data-id="${id}"] > .sc-row`);
  row?.classList.add('on');
  if (wide()) {
    if (openSheet) openSheet.close();
    detailBox.replaceChildren(nodeView(id));
    if (row && id !== ROOT.id) {
      const r = row.getBoundingClientRect();
      if (r.top < 80 || r.bottom > innerHeight) row.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    }
    return;
  }
  if (id === ROOT.id) return openSheet?.close();
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
      if (location.hash === `#how/${id}`) history.replaceState(null, '', '#how');
    }
  });
  openSheet = s;
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
let mode = 'tree';

export function renderHow(panel, what = '') {
  const wantMap = what.startsWith('map');
  if (!built) {
    seg = segmented(
      [
        { id: 'tree', label: t(['樹狀圖', 'Tree']) },
        { id: 'map', label: t(['旅程地圖', 'Journey map']) }
      ],
      { value: wantMap ? 'map' : 'tree', onChange: id => go('how', id === 'map' ? 'map' : picked && picked !== ROOT.id ? picked : '') }
    );
    built = { tree: buildTree(), map: h('div', { class: 'sc-mapslot' }) };
    panel.replaceChildren(h('div', { class: 'sc-how' }, [h('div', { class: 'sc-segbox' }, [seg]), built.tree, built.map]));
  }
  seg.set(wantMap ? 'map' : 'tree');
  built.tree.hidden = wantMap;
  built.map.hidden = !wantMap;
  if (wantMap) {
    openSheet?.close();
    const storyId = what.slice(4) || STORIES[0].id;
    if (mode !== `map-${storyId}`) {
      built.map.replaceChildren(mapView(storyId));
      requestAnimationFrame(() => requestAnimationFrame(() => mapState.start()));
    }
    mode = `map-${storyId}`;
    return;
  }
  mapState?.stop();
  mode = 'tree';
  pick(what || ROOT.id);
}

// Leaving the tab: a phone's open sheet closes, the map stops.
export function leaveHow() {
  mapState?.stop();
  if (openSheet) {
    const s = openSheet;
    openSheet = null;
    s.close();
  }
}
