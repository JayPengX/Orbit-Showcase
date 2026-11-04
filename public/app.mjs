// Orbit Showcase: Orbit explained for anyone with a few minutes, open to all
// (no Orbit Pass, no home-screen step: teachers open it on a laptop or a
// phone). One page read top to bottom (views/main.mjs): what Orbit is, the
// nine apps, six things people don't expect, how it was made. Each app has
// its own page (screens, the real app to try, its clever parts), and the
// whole system its own (the tree and the journeys), each one tap deeper.
// The frame: a bar along the top naming the page's chapters (on a phone its
// first row scrolls away and the chapters stay), and on a computer a side
// bar instead; on an app's page or the system's, the bar says where back is.
//   #home #apps #wow #made   the page, at that chapter (#numbers, #story: the numbers in #made)
//   #apps/<app>              an app's page
//   #how[/<node> | /map[-<story>]]  the whole system
import * as kitUI from '#kit/ui.mjs';
import { watchUpdates, keepOffline } from '#kit/orbit.mjs';
import { h, t, ico, appImg, appTitle, en, reduced } from './shell.mjs';
import { APPS } from './lib/apps.mjs';
import { renderMain, CHAPTERS, tryApp } from './views/main.mjs';
import { renderApp } from './views/apps.mjs';
import { renderHow, leaveHow, closeCard } from './views/how.mjs';
import { hasDemo } from './views/demo.mjs';

window.__fxStarted = true;
document.documentElement.lang = en ? 'en' : 'zh-Hant';

const $ = id => document.getElementById(id);

// The real numbers, recounted by the deploy every day.
const statsReady = fetch('./data/stats.json', { cache: 'no-cache' })
  .then(r => (r.ok ? r.json() : null))
  .catch(() => null);
let stats = null;

// ---- The frame ----
const otherLang = () => {
  try {
    localStorage.setItem('orbit.lang', en ? 'zh' : 'en');
  } catch {}
  location.reload();
};
const langBtn = () => h('button', { class: 'sc-lang', type: 'button', onclick: otherLang, 'aria-label': en ? '切換成中文' : 'Switch to English' }, [en ? '中文' : 'EN']);
// The showcase's link and its QR code (the kit's share sheet: colours, shapes, PNG or SVG to print).
const share = async () => {
  const [{ shareSheet }, { SITE, DOMAIN }, { familyMark }] = await Promise.all([import('#kit/share.mjs'), import('#kit/domain.mjs'), import('#kit/brand.mjs')]);
  shareSheet({ url: `${SITE}${DOMAIN ? '/showcase/' : '/Orbit-Showcase/'}`, title: 'Orbit Showcase', icon: familyMark(), lang: en ? 'en' : 'zh' });
};
const shareBtn = () => h('button', { class: 'sc-share', type: 'button', onclick: share, 'aria-label': t(['分享', 'Share']) }, [ico('share')]);
const brand = () => h('a', { class: 'sc-brand', href: '#home', 'data-jump': 'home' }, [appImg(null, 30), h('span', {}, [h('strong', { text: 'Orbit' }), h('small', { text: 'Showcase' })])]);

// The chapters, as links (the bar's and the side bar's).
const chapterLinks = cls => CHAPTERS.map(c => h('a', { class: cls, href: `#${c.id}`, 'data-jump': c.id, 'data-chapter': c.id }, [ico(c.icon), h('span', { text: t(c.label) })]));

// The bar along the top: its brand row, then the chapters (or, on an app's
// page and the system's, the way back and what's here).
const nav = h('nav', { class: 'sc-bar-nav', 'aria-label': t(['章節', 'Chapters']) }, chapterLinks('sc-chap'));
const sub = h('div', { class: 'sc-bar-sub', hidden: true });
$('bar').replaceChildren(brand(), h('div', { class: 'sc-bar-acts' }, [shareBtn(), langBtn()]), nav, sub);

// A computer's side bar: the chapters, the nine apps under App, the whole system.
const sideApps = h(
  'div',
  { class: 'sc-side-apps' },
  APPS.map(a => h('a', { href: `#apps/${a.id}`, 'data-app': a.id }, [appImg(a.brand, 22), h('span', { text: appTitle(a).replace(/^Orbit /, '') })]))
);
const [chApps, ...chRest] = chapterLinks('sc-side-chap');
const side = h('aside', { class: 'sc-side', 'aria-label': t(['導覽', 'Navigation']) }, [
  brand(),
  h('nav', { class: 'sc-side-nav' }, [
    chApps,
    sideApps,
    ...chRest,
    h('a', { class: 'sc-side-chap sc-side-how', href: '#how', 'data-view': 'how' }, [ico('list'), h('span', { text: t(['整個系統', 'The whole system']) })])
  ]),
  h('div', { class: 'sc-side-foot' }, [
    h('div', { class: 'sc-side-btns' }, [langBtn(), shareBtn()]),
    // (two set lines, so neither breaks on its own)
    h('p', {}, [h('span', { text: t(['Jay 的自主學習作品', 'Jay’s self-directed learning']) }), h('span', { text: t(['和 Claude 一起做', 'project, made with Claude']) })])
  ])
]);
document.body.prepend(side);

// The bar's second row on an app's page or the system's.
function subBar(view, app) {
  const back =
    view === 'app'
      ? h('a', { class: 'sc-sub-back', href: '#apps', 'data-jump': 'apps' }, [ico('chevron'), h('span', { text: t(['九個 App', 'Nine apps']) })])
      : h('a', { class: 'sc-sub-back', href: '#made', 'data-jump': 'made' }, [ico('chevron'), h('span', { text: t(['首頁', 'Start']) })]);
  const here =
    view === 'app'
      ? h('span', { class: 'sc-sub-here' }, [appImg(app.brand, 24), h('strong', { text: appTitle(app).replace(/^Orbit /, '') })])
      : h('span', { class: 'sc-sub-here' }, [h('strong', { text: t(['整個系統', 'The whole system']) })]);
  const act = view === 'app' && hasDemo(app.id) ? h('button', { class: 'sc-trypill', type: 'button', onclick: () => tryApp(app) }, [ico('play'), h('span', { text: t(['試玩', 'Try']) })]) : h('span');
  sub.replaceChildren(back, here, act);
}

// ---- Where the page is: the chapter on screen lit in both bars ----
let lit = null;
function light(id) {
  if (id === lit) return;
  lit = id;
  document.querySelectorAll('[data-chapter]').forEach(a => {
    a.classList.toggle('on', a.dataset.chapter === id);
    if (a.dataset.chapter === id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
}
let spy = null;
function watchChapters() {
  if (typeof IntersectionObserver === 'undefined') return;
  const seen = new Map();
  spy = new IntersectionObserver(
    entries => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting);
      if (current !== 'main') return;
      light(CHAPTERS.map(c => c.id).find(id => seen.get(id)) || null);
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );
  for (const c of CHAPTERS) spy.observe($(c.id));
}

// ---- Routing ----
const VIEWS = { main: $('view-main'), app: $('view-app'), how: $('view-how') };
let current = null;
let mainY = 0;
let jumping = null; // the address a link just asked for (vs. the browser's back and forward)
let drawnApp = null;

function parse() {
  const [a, ...rest] = location.hash.replace(/^#/, '').split('/');
  const what = decodeURIComponent(rest.join('/'));
  if (a === 'apps' && what) return { view: 'app', what };
  if (a === 'how') return { view: 'how', what };
  if (a === 'numbers' || a === 'story') return { view: 'main', at: 'numbers' };
  return { view: 'main', at: CHAPTERS.some(c => c.id === a) ? a : '' };
}

// A chapter (or the numbers inside one) brought to the top, under the bar.
function jump(at, smooth) {
  const el = at && at !== 'home' ? $(at) : null;
  if (!el) return window.scrollTo({ top: 0, behavior: smooth && !reduced() ? 'smooth' : 'instant' });
  el.scrollIntoView({ block: 'start', behavior: smooth && !reduced() ? 'smooth' : 'instant' });
}

function route(first = false) {
  const r = parse();
  const viaLink = jumping !== null && jumping === location.hash;
  jumping = null;
  const was = current;
  closeCard();
  if (was === 'main' && r.view !== 'main') mainY = scrollY;
  if (was === 'how' && r.view !== 'how') leaveHow();
  current = r.view;
  for (const [k, box] of Object.entries(VIEWS)) box.hidden = k !== r.view;
  document.documentElement.dataset.view = r.view;
  nav.hidden = r.view !== 'main';
  sub.hidden = r.view === 'main';
  side.querySelector('.sc-side-how').classList.toggle('on', r.view === 'how');
  sideApps.querySelectorAll('[data-app]').forEach(a => a.classList.toggle('on', r.view === 'app' && a.dataset.app === r.what));

  if (r.view === 'main') {
    document.title = 'Orbit Showcase';
    if (first || viaLink || was === 'main') requestAnimationFrame(() => jump(r.at, !first && was === 'main'));
    else requestAnimationFrame(() => window.scrollTo({ top: mainY, behavior: 'instant' }));
    return;
  }
  light(r.view === 'app' ? 'apps' : null);
  if (r.view === 'app') {
    if (drawnApp !== r.what || was !== 'app') drawnApp = renderApp(VIEWS.app, stats, r.what).id;
    const app = APPS.find(a => a.id === drawnApp);
    document.title = `${appTitle(app)} · Orbit Showcase`;
    subBar('app', app);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  document.title = `${t(['整個系統', 'The whole system'])} · Orbit Showcase`;
  subBar('how');
  if (was !== 'how') window.scrollTo({ top: 0, behavior: 'instant' });
  renderHow(VIEWS.how, r.what);
}

// A link to a chapter on the page already open scrolls there (the address
// follows quietly); any other link is noted, so the route can tell it from
// the browser's back and forward.
document.addEventListener(
  'click',
  e => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href');
    const at = a.dataset.jump;
    if (at && current === 'main') {
      e.preventDefault();
      history.replaceState(null, '', at === 'home' ? location.pathname + location.search : href);
      jump(at, true);
      return;
    }
    jumping = href;
  },
  true
);

kitUI.ready(
  statsReady.then(s => {
    stats = s;
    renderMain(VIEWS.main, stats);
    watchChapters();
    route(true);
    window.addEventListener('hashchange', () => route());
  }),
  { max: 3000 }
);

const VERSION = document.querySelector('meta[name="build-version"]')?.content || 'dev';
watchUpdates({ current: VERSION, key: 'orbitShowcase', cachePrefix: 'orbit-showcase-' });
keepOffline();
