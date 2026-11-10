// One app's page (#apps/<app>): what it is and the question it answers,
// 試玩 (the real app, running here) first, then its screens as an app store
// shows them (swipe), its story in three lines (problem → idea → result),
// its clever parts (each opens its card: the tree's leaves under the app,
// the first few shown, the rest behind the kit's quiet more bar), its age
// and updates from data/stats.json, its first day beside today where that
// first version still runs (a slider between them), and the next app.
import { h, t, ico, appImg, num, fmtDayYear, daysBetween, twToday, reduced, zoom, shotUrl, appTitle, pir, en } from '../shell.mjs';
import * as kitUI from '#kit/ui.mjs';
import { BRANDS } from '#kit/brand.mjs';
import { APPS } from '../lib/apps.mjs';
import { NODES } from '../lib/tree.mjs';
import { hasDemo } from './demo.mjs';
import { openCard } from './how.mjs';
import { tryApp } from './main.mjs';

const shot = (app, f) => shotUrl(f, Boolean(app.zh));

// The screens the way an app store shows them: each on the app's own
// colour under a one-line headline, a row you swipe (the next one peeks in),
// light and dark mixed as the app looks either way.
function ads(app) {
  const [hi, mid, lo] = BRANDS[app.brand].paint;
  const row = h('div', { class: 'sc-ads', tabindex: '0', 'aria-label': t(['截圖', 'Screens']) });
  app.shots.forEach(([f, c], i) =>
    row.append(
      h('figure', { class: 'sc-ad' }, [
        h('figcaption', { text: t(c) }),
        h('div', { class: 'sc-ad-screen' }, [h('img', { src: shot(app, f), alt: t(c), loading: i > 1 ? 'lazy' : 'eager', decoding: 'async', width: 375, height: 812 })])
      ])
    )
  );
  const step = dir => row.scrollBy({ left: dir * (row.firstChild.offsetWidth + 12), behavior: reduced() ? 'auto' : 'smooth' });
  const arrow = (dir, label) => h('button', { class: `sc-arrow sc-arrow-${dir > 0 ? 'r' : 'l'}`, type: 'button', 'aria-label': t(label), onclick: () => step(dir) }, [ico('chevron')]);
  // Each arrow only while there is more on its side.
  const ends = () => {
    const box = row.parentNode;
    if (!box) return;
    box.classList.toggle('at-start', row.scrollLeft < 4);
    box.classList.toggle('at-end', row.scrollLeft + row.clientWidth > row.scrollWidth - 4);
  };
  requestAnimationFrame(ends);
  row.addEventListener('scroll', ends, { passive: true });
  addEventListener('resize', ends, { passive: true });
  return h('div', { class: 'sc-adbox', style: `--ad-hi:${hi};--ad-mid:${mid};--ad-lo:${lo}` }, [
    h('div', { class: 'sc-adrow' }, [row, arrow(-1, ['上一張', 'Previous']), arrow(1, ['下一張', 'Next'])])
  ]);
}

// Day one and today, one over the other, a handle between them.
function thenNow(app) {
  if (!app.then) return null;
  const [f, c] = app.then;
  const now = app.now || app.shots[0][0];
  const box = h('div', { class: 'sc-compare', style: '--k:50%' }, [
    h('img', { class: 'sc-cmp-now', src: shot(app, now), alt: t(['現在', 'Now']), loading: 'lazy', decoding: 'async' }),
    h('div', { class: 'sc-cmp-then' }, [h('img', { src: shot(app, f), alt: t(c), loading: 'lazy', decoding: 'async' })]),
    h('span', { class: 'sc-cmp-tag sc-cmp-tag-l', text: t(['第一天', 'Day one']) }),
    h('span', { class: 'sc-cmp-tag sc-cmp-tag-r', text: t(['現在', 'Now']) }),
    h('span', { class: 'sc-cmp-line', 'aria-hidden': 'true' }, [h('span', { class: 'sc-cmp-knob' }, [ico('swap')])])
  ]);
  const range = h('input', { type: 'range', min: '0', max: '100', value: '50', class: 'sc-cmp-range', 'aria-label': t(['拖動比較第一天和現在', 'Drag to compare day one and now']) });
  range.addEventListener('input', () => box.style.setProperty('--k', `${range.value}%`));
  box.append(range);
  return h('section', { class: 'sc-part sc-then' }, [h('h3', { class: 'sc-subhead', text: t(['第一天和現在', 'Day one and now']) }), box, h('p', { class: 'sc-note', text: t(c) })]);
}

function facts(app, stats) {
  const r = stats?.repos?.find(x => x.repo === app.repo);
  if (!r) return null;
  const days = daysBetween(r.first, twToday(Date.parse(stats.at))) + 1;
  return h('p', { class: 'sc-appfacts' }, [
    h('span', {}, [ico('calendar'), en ? `On GitHub since ${fmtDayYear(r.first)}` : `${fmtDayYear(r.first)} 上 GitHub`]),
    h('span', {}, [ico('clock'), en ? `${num(days)} day${days === 1 ? '' : 's'}` : `${num(days)} 天`]),
    h('span', {}, [ico('send'), en ? `${num(r.commits)} updates` : `${num(r.commits)} 次更新`]),
    r.tests ? h('span', {}, [ico('check'), en ? `${num(r.tests)} automatic checks` : `${num(r.tests)} 個自動檢查`]) : null
  ]);
}

// The app's clever parts: the leaves under its branch, in the tree's order
// (a group's own parts in its place), each a row that opens its card.
const SHOWN = 5;
function clever(app) {
  const leaves = [];
  (function walk(n) {
    for (const k of n.kids || []) k.kids?.length ? walk(k) : leaves.push(k);
  })(NODES.get(app.id).node);
  if (!leaves.length) return null;
  const row = k =>
    h('li', {}, [
      h('button', { class: 'sc-part-row', type: 'button', onclick: () => openCard(k.id) }, [
        h('span', { class: 'sc-glyph' }, [ico(k.icon)]),
        h('span', { class: 'sc-row-text' }, [h('strong', { text: t(k.title) }), h('small', { text: t(k.line) })]),
        ico('chevron', 'sc-row-chev')
      ])
    ]);
  const list = h('ul', { class: 'sc-parts' }, leaves.slice(0, SHOWN).map(row));
  const rest = leaves.slice(SHOWN);
  const more = rest.length
    ? kitUI.moreToggle({
        more: t([`再看 ${rest.length} 項`, `${rest.length} more`]),
        less: t(['收起', 'Show less']),
        onToggle: open => {
          if (open) list.append(...rest.map(row));
          else for (const li of [...list.children].slice(SHOWN)) li.remove();
        }
      })
    : null;
  return h('section', { class: 'sc-part' }, [h('h3', { class: 'sc-subhead', text: t(['它的巧思', 'What’s clever about it']) }), list, more]);
}

function nextApp(app) {
  const i = APPS.indexOf(app);
  const next = APPS[(i + 1) % APPS.length];
  return h('a', { class: 'sc-nextapp', href: `#apps/${next.id}` }, [
    h('small', { text: t(['下一個 App', 'Next app']) }),
    h('span', {}, [appImg(next.brand, 32), h('strong', { text: appTitle(next) }), ico('chevron')])
  ]);
}

let last = null;
export const currentApp = () => APPS.find(a => a.id === last) || APPS[0];

export function renderApp(box, stats, id) {
  const app = APPS.find(a => a.id === id) || currentApp();
  last = app.id;
  const node = NODES.get(app.id).node;
  const demo = hasDemo(app.id);
  box.replaceChildren(
    h('article', { class: 'sc-apppage', 'data-brand': app.brand }, [
      h('a', { class: 'sc-back', href: '#apps' }, [ico('chevron'), t(['十個 App', 'Ten apps'])]),
      h('header', { class: 'sc-ahead' }, [
        appImg(app.brand, 64),
        h('div', {}, [h('h1', { text: appTitle(app) }), h('p', { class: 'sc-appq', text: `「${t(app.q)}」` }), h('p', { class: 'sc-appline', text: t(node.line) })]),
        demo
          ? h('div', { class: 'sc-apptry' }, [
              h('button', { class: 'sc-cta', type: 'button', onclick: () => tryApp(app) }, [ico('play'), t(['試玩真的 App', 'Try the real app'])]),
              h('small', { text: t(['在這裡直接執行，什麼都不會存', 'Runs right here; nothing is kept']) })
            ])
          : null
      ]),
      ads(app),
      h('div', { class: 'sc-abody' }, [
        h('section', { class: 'sc-part' }, [h('h3', { class: 'sc-subhead', text: t(['為什麼做它', 'Why it exists']) }), h('div', { class: 'sc-pir' }, pir(node)), facts(app, stats)]),
        clever(app)
      ]),
      thenNow(app),
      h('p', { class: 'sc-note', text: t(['截圖用的是範例資料，不是任何人真正的資料。', 'Every screenshot uses sample data, never anyone’s own.']) }),
      nextApp(app)
    ])
  );
  box.querySelectorAll('.sc-compare img, .sc-ad img').forEach(img => img.addEventListener('dblclick', () => zoom(img.src, img.alt)));
  return app;
}
