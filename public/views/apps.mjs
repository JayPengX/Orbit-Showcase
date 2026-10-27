// App: each app's real screens as an app store shows them (swipe), the
// question it answers, its age and updates from data/stats.json, its first
// day beside today where that first version still runs (a slider between
// them), and the parts of the structure tree that explain it.
import { h, t, ico, appImg, num, fmtDayYear, daysBetween, twToday, link, reveal, reduced, zoom, en } from '../shell.mjs';
import { BRANDS } from '#kit/brand.mjs';
import { APPS } from '../lib/apps.mjs';
import { NODES } from '../lib/tree.mjs';
import { hasDemo, openDemo } from './demo.mjs';

// An app's screens in the reader's language: a set taken with the app in
// Chinese (`zh: true`, files N.zh.webp) on the Chinese page, English otherwise.
let zhSet = false;
const shot = f => `./shots/${f}${zhSet && !en && !f.startsWith('then-') ? '.zh' : ''}.webp`;

// The screens the way an app store shows them: each on the app's own
// colour under a one-line headline, a row you swipe (the next one peeks in),
// light and dark mixed as the app looks either way.
function ads(app) {
  zhSet = !!app.zh;
  const [hi, mid, lo] = BRANDS[app.brand].paint;
  const row = h('div', { class: 'sc-ads', tabindex: '0', 'aria-label': t(['截圖', 'Screens']) });
  app.shots.forEach(([f, c], i) =>
    row.append(
      h('figure', { class: 'sc-ad' }, [
        h('figcaption', { text: t(c) }),
        h('div', { class: 'sc-ad-screen' }, [h('img', { src: shot(f), alt: t(c), loading: i > 1 ? 'lazy' : 'eager', decoding: 'async', width: 375, height: 812 })])
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
    h('div', { class: 'sc-adrow' }, [row, arrow(-1, ['上一張', 'Previous']), arrow(1, ['下一張', 'Next'])]),
    hasDemo(app.id) ? h('button', { class: 'sc-try', type: 'button', onclick: () => openDemo(app, t(NODES.get(app.id).node.title)) }, [ico('play'), t(['試玩真的 App', 'Try the real app'])]) : null
  ]);
}

// Day one and today, one over the other, a handle between them.
function thenNow(app) {
  if (!app.then) return null;
  const [f, c] = app.then;
  const now = app.now || app.shots[0][0];
  const box = h('div', { class: 'sc-compare', style: '--k:50%' }, [
    h('img', { class: 'sc-cmp-now', src: shot(now), alt: t(['現在', 'Now']), loading: 'lazy', decoding: 'async' }),
    h('div', { class: 'sc-cmp-then' }, [h('img', { src: shot(f), alt: t(c), loading: 'lazy', decoding: 'async' })]),
    h('span', { class: 'sc-cmp-tag sc-cmp-tag-l', text: t(['第一天', 'Day one']) }),
    h('span', { class: 'sc-cmp-tag sc-cmp-tag-r', text: t(['現在', 'Now']) }),
    h('span', { class: 'sc-cmp-line', 'aria-hidden': 'true' }, [h('span', { class: 'sc-cmp-knob' }, [ico('swap')])])
  ]);
  const range = h('input', { type: 'range', min: '0', max: '100', value: '50', class: 'sc-cmp-range', 'aria-label': t(['拖動比較第一天和現在', 'Drag to compare day one and now']) });
  range.addEventListener('input', () => box.style.setProperty('--k', `${range.value}%`));
  box.append(range);
  return h('section', { class: 'sc-block sc-rise' }, [h('h3', { class: 'sc-h3', text: t(['第一天 vs. 現在', 'Day one vs. now']) }), box, h('p', { class: 'sc-note', text: t(c) })]);
}

function facts(app, stats) {
  const r = stats?.repos?.find(x => x.repo === app.repo);
  if (!r) return null;
  const days = daysBetween(r.first, twToday(Date.parse(stats.at))) + 1;
  return h('div', { class: 'sc-facts' }, [
    h('span', {}, [ico('calendar'), en ? `Since ${fmtDayYear(r.first)}` : `${fmtDayYear(r.first)} 開始`]),
    h('span', {}, [ico('clock'), en ? `${num(days)} day${days === 1 ? '' : 's'}` : `${num(days)} 天`]),
    h('span', {}, [ico('send'), en ? `${num(r.commits)} updates` : `${num(r.commits)} 次更新`]),
    r.tests ? h('span', {}, [ico('check'), en ? `${num(r.tests)} checks` : `${num(r.tests)} 個自動檢查`]) : null
  ]);
}

function inside(app) {
  const node = NODES.get(app.id).node;
  return h('section', { class: 'sc-block sc-rise' }, [
    h('h3', { class: 'sc-h3', text: t(['它怎麼運作', 'How it works']) }),
    h(
      'div',
      { class: 'sc-chips' },
      (node.kids || []).map(k => link('how', k.id, [ico(k.icon), t(k.title)], 'sc-chip'))
    ),
    link('how', app.id, [t(['在樹狀圖裡打開', 'Open it in the tree']), ico('chevron')], 'sc-more')
  ]);
}

function detail(app, stats) {
  const node = NODES.get(app.id).node;
  return h('article', { class: 'sc-appdetail', 'data-brand': app.brand }, [
    h('header', { class: 'sc-apphead' }, [
      appImg(app.brand, 64),
      h('div', {}, [h('h2', { text: t(node.title) }), h('p', { text: t(node.line) })])
    ]),
    ads(app),
    h('div', { class: 'sc-appbody' }, [
      h('div', { class: 'sc-appside' }, [
        h('div', { class: 'sc-q' }, [h('small', { text: t(['它回答的問題', 'The question it answers']) }), h('p', { text: `「${t(app.q)}」` })]),
        node.p ? h('div', { class: 'sc-pir' }, pir(node)) : null,
        facts(app, stats),
        inside(app)
      ])
    ]),
    thenNow(app),
    h('p', { class: 'sc-note', text: t(['截圖用的都是假資料，不是任何人真正的資料。', 'Every screenshot uses made-up data, never anyone’s real data.']) })
  ]);
}

// Problem → idea → result, the tree's three plain lines.
export function pir(node) {
  return [
    ['target', ['問題', 'Problem'], node.p],
    ['spark', ['想法', 'Idea'], node.i],
    ['check', ['結果', 'Result'], node.r]
  ]
    .filter(([, , x]) => x)
    .map(([icon, label, x]) => h('div', { class: 'sc-pir-row' }, [h('span', { class: 'sc-pir-k' }, [ico(icon), t(label)]), h('p', { text: t(x) })]));
}

let last = null;
export function renderApps(panel, stats, id) {
  const app = APPS.find(a => a.id === id) || APPS.find(a => a.id === last) || APPS[0];
  last = app.id;
  const picker = h(
    'nav',
    { class: 'sc-picker', 'aria-label': t(['選一個 App', 'Pick an app']) },
    APPS.map(a => {
      const node = NODES.get(a.id).node;
      return h('a', { href: `#apps/${a.id}`, class: a === app ? 'on' : '', 'aria-current': a === app ? 'true' : null }, [appImg(a.brand, 40), h('span', { text: t(node.title).replace('Orbit ', '') })]);
    })
  );
  panel.replaceChildren(h('div', { class: 'sc-apps' }, [picker, detail(app, stats)]));
  const on = picker.querySelector('.on');
  if (on) requestAnimationFrame(() => (picker.scrollLeft = on.offsetLeft - (picker.clientWidth - on.offsetWidth) / 2));
  reveal(panel);
  panel.querySelectorAll('.sc-compare img, .sc-ad img').forEach(img => img.addEventListener('dblclick', () => zoom(img.src, img.alt)));
}
