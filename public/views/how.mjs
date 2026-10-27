// 架構: the structure tree and the map. The tree is the whole system in
// plain words, short at the top, deeper as it opens; a node opens a card: a
// small picture first (steps, big numbers, before → after: lib/tree-show.mjs),
// then problem → idea → result, what's inside, related nodes, and the
// technical names behind a fold. Beside it on a computer, in a sheet on a
// phone. The map walks five everyday stories across the system's five rows,
// a dot travelling between the places each step happens.
//   #how, #how/tree  the tree
//   #how/<node id>   the tree, that node open (an old #how/sys-<app> opens the app)
//   #how/map[-<story>]  the map
import { segmented, sheet, tile } from '#kit/ui.mjs';
import { h, t, ico, appImg, go, reduced, wide, en } from '../shell.mjs';
import { ROOT, NODES, pathTo } from '../lib/tree.mjs';
import { ROWS, STORIES } from '../lib/stories.mjs';
import { pir } from './apps.mjs';
import { SHOW } from '../lib/tree-show.mjs';

const BRAND = { sports: 'match', transit: 'transit', weather: 'weather', class: 'orbit', words: 'vocab', beats: 'beats', law: 'law', securities: 'stock', money: 'money' };

// ---- The tree ----
// The whole tree at a glance: Orbit's nine branches in a grid, each naming
// what's inside it, every part one tap away (on a phone the nine as tiles).
// A tap opens that branch in place: a strip of all nine along the top with
// the previous and next beside its name, then its parts as rows that open to
// show their own parts. The picked part's card sits beside them on a
// computer and comes up in a sheet on a phone.
const TOP = ROOT.kids;
let branch = null; // the open branch's id; null shows the overview
const open = new Set(); // rows opened inside the branch
let picked = null;
let host = null;
let detailBox = null;
let openSheet = null;

// Each top branch its own colour, carried down to everything under it.
const HUE = { apps: 'var(--q-orange)', kit: 'var(--q-indigo)', pass: 'var(--q-brown)', cloud: 'var(--q-cyan)', store: 'var(--q-green)', fast: 'var(--q-red)', cheap: 'var(--q-yellow)', ship: 'var(--q-blue)', team: 'var(--q-pink)' };
const hue = id => HUE[pathTo(id)[1]?.id] || 'var(--sc-ac)';
const mark = node => (BRAND[node.id] ? appImg(BRAND[node.id], 30, 'sc-node-app') : h('span', { class: 'sc-dot', style: `--c:${hue(node.id)}` }, [ico(node.icon)]));
const icon = (node, size = 30) => (BRAND[node.id] ? appImg(BRAND[node.id], size) : h('span', { class: 'sc-tn-i' }, [ico(node.icon)]));

// Shorter names for the overview and the strip of branches, so each sits
// on one line; the rows and the card keep the full title.
const SHORT = {
  apps: ['九個 App', 'Nine apps'],
  kit: ['共用零件', 'Shared parts'],
  pass: ['一張通行證', 'One pass'],
  cloud: ['雲端小幫手', 'Cloud helper'],
  store: ['資料放哪裡', 'Storage'],
  team: ['怎麼做出來', 'Making it'],
  'sports-own': ['自己算得更準', 'Better than the feed'],
  'transit-own': ['自己算得更準', 'Better than the feed'],
  'sports-final': ['照規則判完賽', 'Over by the rules'],
  'sports-home-league': ['補上國內聯賽', 'Home league added'],
  'sports-push': ['兩分鐘內通知', 'Results in 2 min'],
  'sports-picks': ['今晚看哪場', 'Tonight’s plan'],
  'sports-breaks': ['中斷倒數', 'Break countdowns'],
  'sports-kept': ['打完永久保存', 'Finished, kept'],
  'sports-direct': ['改由手機讀', 'Read by the phone'],
  'sports-live': ['比分怎麼來', 'How scores arrive'],
  'transit-nav': ['導航自動前進', 'Navigation moves on'],
  'transit-bike': ['YouBike 有車', 'YouBike, always'],
  'transit-caps': ['Google 上限', 'Google’s cap'],
  'weather-blend': ['多來源混合', 'Sources blended'],
  'weather-soon': ['快下雨才說', 'Rain soon, only'],
  'weather-squares': ['同區共用答案', 'Shared squares'],
  'weather-county': ['颱風一縣一算', 'Once a county'],
  'class-ai': ['拍照匯入', 'Photo import'],
  'law-build': ['每天自己建', 'Built every day'],
  'money-carrier': ['載具發票', 'Carrier invoices'],
  'kit-brand': ['程式畫的圖示', 'Icons by code'],
  'kit-dayoff': ['假日和颱風假', 'Days off'],
  'kit-shared-logic': ['手機雲端同程式', 'One code, two places'],
  'pass-session': ['一處在用', 'One live place'],
  'cloud-routes': ['各 App 的路線', 'Each app’s routes'],
  'cloud-push': ['關著也通知', 'Notices, app closed'],
  'cloud-relay': ['台灣 AI 中繼', 'Taiwan AI relay'],
  'store-layers': ['讀取的七層', 'Seven layers'],
  'store-kv': ['小抽屜 KV', 'Quick drawers'],
  fast: ['打開很快', 'Opens fast'],
  'fast-first': ['先用手上的', 'Open on what’s there'],
  'fast-lift': ['好了才顯示', 'Lifts when ready'],
  cheap: ['省錢不超額', 'Under limits'],
  'cheap-share': ['共用答案', 'Shared answers'],
  'cheap-caps': ['付費都有上限', 'Caps on paid'],
  'cheap-speeds': ['Jay 定速度', 'Jay sets speeds'],
  'cheap-plan': ['5 美元方案', 'The $5 plan'],
  ship: ['怎麼上線', 'How it ships'],
  'ship-tests': ['測默默的錯', 'Silent-bug tests'],
  'ship-tools': ['Claude 看畫面', 'Claude sees it'],
  'team-memory': ['記憶和規則', 'Memory and rules']
};
const shortName = node => t(SHORT[node.id] || node.title).replace(/^Orbit /, '');

function overview() {
  return h(
    'div',
    { class: 'sc-ov' },
    TOP.map(b =>
      h('section', { class: 'sc-ov-b', style: `--c:${hue(b.id)}` }, [
        h('button', { class: 'sc-ov-head', type: 'button', onclick: () => tap(b.id) }, [icon(b), h('span', { class: 'sc-ov-t', text: shortName(b) }), h('span', { class: 'sc-ov-n', 'aria-label': t([`${b.kids.length} 項`, `${b.kids.length} inside`]), text: String(b.kids.length) })]),
        h(
          'div',
          { class: 'sc-ov-kids' },
          b.kids.map(k => h('button', { class: 'sc-ov-k', type: 'button', onclick: () => tap(k.id) }, [BRAND[k.id] ? appImg(BRAND[k.id], 18) : null, shortName(k)]))
        )
      ])
    )
  );
}

function branchView(id) {
  const b = NODES.get(id).node;
  const i = TOP.indexOf(b);
  const near = d => TOP[(i + d + TOP.length) % TOP.length];
  const step = d =>
    h('button', { class: `sc-bstep ${d < 0 ? 'back' : 'next'}`, type: 'button', 'aria-label': `${t(d < 0 ? ['上一個', 'Previous'] : ['下一個', 'Next'])}：${shortName(near(d))}`, onclick: () => tap(near(d).id) }, [ico('chevron')]);
  const rows = kids =>
    kids.map(k => {
      const n = k.kids?.length || 0;
      const on = open.has(k.id);
      return h('div', { class: 'sc-bnode', style: `--c:${hue(k.id)}` }, [
        h('div', { class: `sc-brow${k.id === picked ? ' on' : ''}` }, [
          h('button', { class: 'sc-brow-main', type: 'button', 'data-id': k.id, 'aria-expanded': n ? String(on) : null, onclick: () => tap(k.id) }, [
            icon(k),
            h('span', { class: 'sc-row-text' }, [h('strong', { text: t(k.title) }), h('small', { text: t(k.line) })]),
            n ? h('span', { class: 'sc-brow-n' }, [String(n), ico('chevron')]) : null
          ]),
        ]),
        // (a phone reads an opened part from the first line under it)
        n && on
          ? h('div', { class: 'sc-bkids' }, [
              wide() ? null : h('button', { class: 'sc-bread', type: 'button', onclick: () => showSheet(k.id) }, [ico('book'), h('span', { text: t(['讀這一項的說明', 'Read about it']) }), ico('chevron')]),
              ...rows(k.kids)
            ])
          : null
      ]);
    });
  return h('div', { class: 'sc-branch', style: `--c:${hue(id)}` }, [
    h('nav', { class: 'sc-rail', 'aria-label': t(['全部分支', 'All branches']) }, [
      h('button', { class: 'sc-rail-b all', type: 'button', title: t(['全部分支', 'All branches']), 'aria-label': t(['全部分支', 'All branches']), onclick: () => tap(ROOT.id) }, [appImg(null, 24)]),
      ...TOP.map(x => h('button', { class: `sc-rail-b${x === b ? ' on' : ''}`, type: 'button', style: `--c:${hue(x.id)}`, title: shortName(x), 'aria-label': shortName(x), 'aria-current': x === b ? 'true' : null, onclick: () => tap(x.id) }, [ico(x.icon)]))
    ]),
    h('header', { class: `sc-bhead${picked === id ? ' on' : ''}` }, [
      step(-1),
      h('button', { class: 'sc-bhead-mid', type: 'button', onclick: () => (wide() ? tap(id) : showSheet(id)) }, [h('small', { text: `${i + 1} / ${TOP.length}` }), h('strong', { text: shortName(b) })]),
      step(1),
      h('p', { class: 'sc-bhead-line', text: t(b.line) })
    ]),
    h('div', { class: 'sc-blist' }, rows(b.kids))
  ]);
}

function shut(id) {
  open.delete(id);
  for (const k of NODES.get(id).node.kids || []) shut(k.id);
}

// A tap: the root goes back to the overview; a branch opens; a part with
// parts of its own opens or closes them; a phone reads a part in a sheet.
function tap(id, fromLink = false) {
  if (!NODES.has(id)) id = ROOT.id;
  const path = pathTo(id);
  const top = path[1]?.id || null;
  if (top !== branch) open.clear();
  branch = top;
  const node = NODES.get(id).node;
  for (const p of path.slice(2, -1)) open.add(p.id);
  if (path.length > 2 && node.kids?.length && !fromLink) {
    if (open.has(id) && (picked === id || !wide())) shut(id);
    else open.add(id);
  } else if (path.length > 2 && node.kids?.length) open.add(id);
  const was = picked;
  picked = id;
  render(top !== null && was !== null && pathTo(was)[1]?.id !== top);
  history.replaceState(null, '', id === ROOT.id ? '#how/tree' : `#how/${id}`);
  if (!wide() && path.length > 2 && (!node.kids?.length || fromLink)) showSheet(id);
}

function render(moved = false) {
  host.replaceChildren(branch ? branchView(branch) : overview());
  host.closest('.sc-treewrap').classList.toggle('branch', Boolean(branch));
  // (the card leaves out what's inside when the rows beside it already show it)
  if (wide() && branch) detailBox.replaceChildren(nodeView(picked, !(picked === branch || open.has(picked))));
  if (moved) host.firstChild.classList.add('moved');
  // the picked row in view; a new branch from its top
  const row = host.querySelector(`.sc-brow-main[data-id="${CSS.escape(picked)}"]`);
  const box = (row || host).getBoundingClientRect();
  if (box.top < 70 || (row && box.bottom > innerHeight - (wide() ? 24 : 110))) {
    window.scrollTo({ top: Math.max(0, scrollY + box.top - (row ? innerHeight / 3 : 90)), behavior: reduced() ? 'auto' : 'smooth' });
  }
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

function nodeView(id, inside = true) {
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
    showView(id),
    node.p || node.i || node.r ? h('div', { class: 'sc-pir' }, pir(node)) : null,
    node.tech
      ? h('details', { class: 'sc-tech' }, [h('summary', {}, [ico('pencil'), t(['技術細節（給好奇的人）', 'Technical details (for the curious)'])]), h('p', { text: t(node.tech) })])
      : null,
    inside && node.kids?.length
      ? h('div', { class: 'sc-sub' }, [
          h('h3', { class: 'sc-h3', text: t(['裡面有', 'Inside']) }),
          h(
            'div',
            { class: 'sc-inside' },
            node.kids.map(k => h('a', { class: 'sc-inside-k', href: `#how/${k.id}`, style: `--c:${hue(k.id)}` }, [BRAND[k.id] ? appImg(BRAND[k.id], 34) : h('span', { class: 'sc-tn-i' }, [ico(k.icon)]), h('span', { class: 'sc-row-text' }, [h('strong', { text: t(k.title) }), h('small', { text: t(k.line) })])]))
          )
        ])
      : null,
    related.length ? h('div', { class: 'sc-sub' }, [h('h3', { class: 'sc-h3', text: t(['相關', 'Related']) }), chipsOf(related)]) : null
  ]);
}

// The card's picture (lib/tree-show.mjs): steps, numbers, before → after,
// named things, a short checklist.
const said = x => (Array.isArray(x) ? t(x) : x);
function showView(id) {
  const s = SHOW[id];
  if (!s) return null;
  const c = hue(id);
  const out = [];
  if (s.flow) {
    // Across in one row only while every name fits its column on a 320 px
    // phone without wrapping (a Chinese character is 1, a Latin letter about
    // half); otherwise the steps go down the card, a full line each.
    const room = { 1: 20, 2: 10, 3: 6.5, 4: 4.8 }[s.flow.length] || 0;
    const width = x => [...x].reduce((w, c) => w + (/[\u2e80-\uffff]/.test(c) ? 1 : 0.55), 0);
    const down = s.flow.some(([, label]) => said(label).split(/[：:]\s*/).some(part => width(part) > room));
    out.push(
      h(
        'ol',
        { class: `sc-flow${down ? ' down' : ''}`, style: `--n:${s.flow.length}` },
        s.flow.map(([icon, label], i) => {
          // "口袋：記憶體": the name, and under it what it is
          const [name, what] = said(label).split(/[：:]\s*(.*)/s);
          return h('li', { class: 'sc-flow-s', style: `--i:${i}` }, [h('span', { class: 'sc-flow-i' }, [ico(icon)]), h('span', { class: 'sc-flow-t' }, [name, what ? h('small', { text: what }) : null])]);
        })
      )
    );
  }
  if (s.nums) out.push(h('div', { class: 'sc-shownums', style: `--n:${s.nums.length}` }, s.nums.map(([v, label]) => h('div', { class: 'sc-shownum' }, [h('strong', { text: said(v) }), h('span', { text: said(label) })]))));
  if (s.pairs) out.push(h('div', { class: 'sc-pairs' }, s.pairs.map(([a, b]) => h('div', { class: 'sc-pair' }, [h('span', { class: 'sc-pair-a' }, [ico('x'), said(a)]), h('span', { class: 'sc-pair-b' }, [ico('check'), said(b)])]))));
  if (s.tags) out.push(h('div', { class: 'sc-tags' }, s.tags.map(([icon, label]) => h('span', { class: 'sc-tag' }, [ico(icon), said(label)]))));
  if (s.rules) out.push(h('ul', { class: 'sc-rules' }, s.rules.map(r => h('li', {}, [ico('check'), said(r)]))));
  return h('div', { class: 'sc-show', style: `--c:${c}` }, out);
}

function search(q) {
  const out = host.parentElement.querySelector('.sc-found');
  const words = q.trim().toLowerCase();
  host.hidden = Boolean(words);
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
  host = h('div', { class: 'sc-treebox' });
  detailBox = h('aside', { class: 'sc-detail', 'aria-live': 'polite' });
  const field = h('input', { type: 'search', class: 'sc-search', placeholder: t(['搜尋：颱風、備份、YouBike', 'Search: typhoon, backup…']), 'aria-label': t(['搜尋架構', 'Search the structure']) });
  field.addEventListener('input', () => search(field.value));
  let size = wide();
  addEventListener('resize', () => {
    if (wide() === size || !host.isConnected) return;
    size = wide();
    render();
  });
  // ← and → on a keyboard step between branches.
  addEventListener('keydown', e => {
    if (!branch || !host.isConnected || host.closest('[hidden]') || e.target.closest?.('input, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = TOP.findIndex(x => x.id === branch);
    tap(TOP[(i + (e.key === 'ArrowLeft' ? -1 : 1) + TOP.length) % TOP.length].id);
  });
  return h('div', { class: 'sc-treewrap' }, [
    h('div', { class: 'sc-treecol' }, [
      h('p', { class: 'sc-lede-s', text: t(['點一塊打開，用箭頭換下一塊。', 'Tap a part to open it; arrows move on.']) }),
      h('label', { class: 'sc-searchbox' }, [ico('search'), field]),
      h('div', { class: 'sc-found' }),
      host
    ]),
    detailBox
  ]);
}

// From the address (#how/<node>): open the branch and the rows to it; a phone shows its card.
function pick(id, fromLink) {
  if (wide()) openSheet?.close();
  tap(NODES.has(id) ? id : ROOT.id, fromLink);
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
    STORIES.map(s => h('a', { href: `#how/map-${s.id}`, class: `sc-story${s === story ? ' on' : ''}`, title: t(s.title), 'aria-current': s === story ? 'true' : null }, [s.app ? appImg(s.app, 28) : tile(ico(s.icon), '', 'sm'), h('span', { text: t(s.short) })]))
  );
  const card = h('div', { class: 'sc-stepcard' }, [h('strong', { class: 'sc-step-title', text: t(story.title) }), h('div', { class: 'sc-step-top' }, [nth, h('span', { class: 'sc-step-track' }, [bar])]), say, h('div', { class: 'sc-step-btns' }, [prev, playBtn, next])]);

  let i = -1;
  let playing = false;
  let timer = 0;
  let anim = 0;
  // The dot rests tucked under a spot's bottom edge, and the trail runs
  // beneath the spots, so neither ever covers a word.
  const centre = id => {
    const b = nodes.get(id);
    const box = grid.getBoundingClientRect();
    const r = b.getBoundingClientRect();
    return [r.left - box.left + r.width / 2, r.bottom - box.top];
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

export function renderHow(panel, what = '') {
  if (what.startsWith('sys')) what = what.slice(4);
  const view = what.startsWith('map') ? 'map' : 'tree';
  if (!built) {
    seg = segmented(
      [
        { id: 'tree', label: t(['樹狀圖', 'Tree']) },
        { id: 'map', label: t(['旅程', 'Journeys']) }
      ],
      { value: view, onChange: id => go('how', id === 'map' ? 'map' : picked && picked !== ROOT.id ? picked : 'tree') }
    );
    built = { tree: buildTree(), map: h('div', { class: 'sc-mapslot' }) };
    panel.replaceChildren(h('div', { class: 'sc-how' }, [h('div', { class: 'sc-segbox' }, [seg]), built.tree, built.map]));
  }
  seg.set(view);
  for (const k of ['tree', 'map']) built[k].hidden = k !== view;
  if (view !== 'map') mapState?.stop();
  if (view !== 'tree') openSheet?.close();
  const from = mode;
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
  if (openSheet) {
    const s = openSheet;
    openSheet = null;
    s.close();
  }
}
