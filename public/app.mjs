// Orbit Showcase: Orbit explained for anyone, open to all (no Orbit Pass,
// no home-screen step: teachers open it on a laptop). Four tabs: 總覽 (the
// family and its real numbers), App (each app's screens), 架構 (the
// structure tree and the journey map) and 歷程 (how it grew). Phones get the
// kit's tab bar; a computer gets a side bar and a wide layout, the one
// exception to the family's phones-only rule.
//   #home  #apps/<app>  #how[/<node> | /map[-<story>]]  #story
import * as kitUI from '#kit/ui.mjs';
import { tabBar, watchUpdates, keepOffline } from '#kit/orbit.mjs';
import { h, t, ico, appImg, en, go } from './shell.mjs';
import { renderHome } from './views/home.mjs';
import { renderApps } from './views/apps.mjs';
import { renderHow, leaveHow } from './views/how.mjs';
import { renderStory } from './views/story.mjs';

window.__fxStarted = true;
document.documentElement.lang = en ? 'en' : 'zh-Hant';

const $ = id => document.getElementById(id);
// (icon: the tab bar's set, kit orbit.mjs ICONS; side: ui.mjs icons where they differ)
const TABS = [
  { id: 'home', icon: 'home', label: t(['總覽', 'Overview']) },
  { id: 'apps', icon: 'grid', label: t(['App', 'Apps']) },
  { id: 'how', icon: 'eye', side: 'list', label: t(['架構', 'Inside']) },
  { id: 'story', icon: 'history', label: t(['歷程', 'Story']) }
];
const TITLES = { home: 'Orbit Showcase', apps: t(['App', 'Apps']), how: t(['架構', 'Inside']), story: t(['歷程', 'Story']) };

// The real numbers, recounted by the deploy every day.
const statsReady = fetch('./data/stats.json', { cache: 'no-cache' })
  .then(r => (r.ok ? r.json() : null))
  .catch(() => null);
let stats = null;

// ---- The frame: the phone's tab bar, the computer's side bar ----
const bar = tabBar({ tabs: TABS, onSelect: id => go(id), hash: () => null, label: t(['分頁', 'Tabs']) });

const otherLang = () => {
  try {
    localStorage.setItem('orbit.lang', en ? 'zh' : 'en');
  } catch {}
  location.reload();
};
const langBtn = () => h('button', { class: 'sc-lang', type: 'button', onclick: otherLang, 'aria-label': en ? '切換成中文' : 'Switch to English' }, [en ? '中文' : 'EN']);
$('top-actions').replaceChildren(langBtn());

const side = h('aside', { class: 'sc-side', 'aria-label': t(['導覽', 'Navigation']) }, [
  h('a', { class: 'sc-side-brand', href: '#home' }, [appImg(null, 40), h('span', {}, [h('strong', { text: 'Orbit' }), h('small', { text: 'Showcase' })])]),
  h(
    'nav',
    { class: 'sc-side-nav' },
    TABS.map(tab => h('a', { href: `#${tab.id}`, 'data-tab': tab.id }, [ico(tab.side || tab.icon), tab.label]))
  ),
  h('div', { class: 'sc-side-foot' }, [
    langBtn(),
    h('p', { text: t(['Jay 的自主學習作品，和 Claude 一起做。', 'Jay’s self-directed learning project, made with Claude.']) })
  ])
]);
document.body.prepend(side);

// ---- Routing ----
const drawn = {};
let current = null;
function route() {
  const [tab0, ...rest] = location.hash.replace(/^#/, '').split('/');
  const tab = TABS.some(x => x.id === tab0) ? tab0 : 'home';
  const what = decodeURIComponent(rest.join('/'));
  const changed = tab !== current;
  if (changed && current === 'how') leaveHow();
  current = tab;
  bar.select(tab);
  side.querySelectorAll('[data-tab]').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  if (changed) {
    document.title = tab === 'home' ? 'Orbit Showcase' : `${TITLES[tab]} · Orbit Showcase`;
    $('title').textContent = TITLES[tab];
    window.scrollTo(0, 0);
  }
  const panel = $(`panel-${tab}`);
  if (tab === 'home' && !drawn.home) renderHome(panel, stats);
  if (tab === 'apps' && (changed || what || !drawn.apps)) renderApps(panel, stats, what);
  if (tab === 'how') renderHow(panel, what);
  if (tab === 'story' && !drawn.story) renderStory(panel, stats);
  drawn[tab] = true;
  if (tab !== 'home' && !panel.querySelector(':scope > .sc-pagetitle')) panel.prepend(h('h1', { class: 'sc-pagetitle', text: TITLES[tab] }));
}

kitUI.ready(
  statsReady.then(s => {
    stats = s;
    route();
    window.addEventListener('hashchange', route);
  }),
  { max: 3000 }
);

const VERSION = document.querySelector('meta[name="build-version"]')?.content || 'dev';
watchUpdates({ current: VERSION, key: 'orbitShowcase', cachePrefix: 'orbit-showcase-' });
keepOffline();
