// App: each app's real screens in a phone frame (swipe or the arrows), the
// question it answers, its age and updates from data/stats.json, its first
// day beside today where that first version still runs (a slider between
// them), and the parts of the structure tree that explain it.
import { h, t, ico, appImg, num, fmtDayYear, daysBetween, twToday, link, reveal, reduced, zoom, en } from '../shell.mjs';
import { APPS } from '../lib/apps.mjs';
import { NODES } from '../lib/tree.mjs';
import { hasDemo, openDemo } from './demo.mjs';

const shot = f => `./shots/${f}.webp`;

function phone(app) {
  const track = h('div', { class: 'sc-shots', tabindex: '0', 'aria-label': t(['截圖', 'Screens']) });
  const cap = h('p', { class: 'sc-cap', 'aria-live': 'polite' });
  const dots = h('div', { class: 'sc-dots' });
  app.shots.forEach(([f, c], i) => {
    track.append(h('figure', { class: 'sc-shot' }, [h('img', { src: shot(f), alt: t(c), loading: i ? 'lazy' : 'eager', decoding: 'async', width: 375, height: 844 })]));
    dots.append(h('button', { type: 'button', 'aria-label': `${i + 1}`, onclick: () => to(i) }));
  });
  let at = 0;
  const show = i => {
    at = i;
    cap.textContent = t(app.shots[i][1]);
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j === i));
  };
  const to = i => {
    const n = app.shots.length;
    i = (i + n) % n;
    track.scrollTo({ left: track.clientWidth * i, behavior: reduced() ? 'auto' : 'smooth' });
    show(i);
  };
  let tick = 0;
  track.addEventListener(
    'scroll',
    () => {
      cancelAnimationFrame(tick);
      tick = requestAnimationFrame(() => {
        const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        if (i !== at) show(i);
      });
    },
    { passive: true }
  );
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') to(at + 1);
    if (e.key === 'ArrowLeft') to(at - 1);
  });
  show(0);
  const arrow = (dir, icon, label) => h('button', { class: `sc-arrow sc-arrow-${dir}`, type: 'button', 'aria-label': t(label), onclick: () => to(at + (dir === 'l' ? -1 : 1)) }, [ico(icon)]);
  return h('div', { class: 'sc-phonebox' }, [
    h('div', { class: 'sc-phone' }, [
      h('div', { class: 'sc-notch' }),
      track,
      app.shots.length > 1 ? arrow('l', 'chevron', ['上一張', 'Previous']) : null,
      app.shots.length > 1 ? arrow('r', 'chevron', ['下一張', 'Next']) : null,
      hasDemo(app.id) ? h('button', { class: 'sc-try', type: 'button', onclick: () => openDemo(app, t(NODES.get(app.id).node.title)) }, [ico('play'), t(['試玩真的 App', 'Try the real app'])]) : null
    ]),
    app.shots.length > 1 ? dots : null,
    cap
  ]);
}

// Day one and today, one over the other, a handle between them.
function thenNow(app) {
  if (!app.then) return null;
  const [f, c] = app.then;
  const now = app.shots[0][0];
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
    h('span', {}, [ico('clock'), en ? `${num(days)} days` : `${num(days)} 天`]),
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
    link('how', `sys-${app.id}`, [t(['看它背後的系統', 'See the system behind it']), ico('chevron')], 'sc-more'),
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
    h('div', { class: 'sc-appbody' }, [
      phone(app),
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
  panel.querySelectorAll('.sc-compare img, .sc-shot img').forEach(img => img.addEventListener('dblclick', () => zoom(img.src, img.alt)));
}
