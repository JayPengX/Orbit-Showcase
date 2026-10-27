// 總覽: the whole story on the first screen, for a reader who gives it 30
// seconds: what Orbit is, the headline numbers (data/stats.json, recounted
// daily by the deploy) and every app with a demo one tap from trying it; the
// planet with the nine apps circling it beside. The rest is one tap deeper.
import { h, t, ico, appImg, countUp, fmtDayYear, daysBetween, twToday, num, link, reveal, fold, en } from '../shell.mjs';
import { APPS } from '../lib/apps.mjs';
import { NODES } from '../lib/tree.mjs';
import { hasDemo, openDemo } from './demo.mjs';

const BRAND_OF = Object.fromEntries(APPS.map(a => [a.id, a.brand]));
// Names short enough for one row of icons on the smallest phone.
const SHORT = { sports: ['運動', 'Sports'], transit: ['交通', 'Transit'], weather: ['天氣', 'Weather'], class: ['課表', 'Class'], words: ['單字', 'Words'], securities: ['股票', 'Stocks'], money: ['記帳', 'Money'], law: ['法律', 'Law'], beats: ['音樂', 'Beats'] };

function hero(stats) {
  const sky = h('div', { class: 'sc-sky', 'aria-hidden': 'true' });
  const rings = [APPS.slice(0, 4), APPS.slice(4, 9)];
  rings.forEach((apps, r) => {
    const ring = h('div', { class: `sc-ring sc-ring-${r + 1}` });
    apps.forEach((a, i) => {
      const spot = h('div', { class: 'sc-moon' }, [appImg(a.brand, r ? 44 : 40)]);
      spot.style.setProperty('--a', `${(360 / apps.length) * i + r * 20}deg`);
      ring.append(spot);
    });
    sky.append(ring);
  });
  sky.append(h('div', { class: 'sc-planet' }, [appImg(null, 112)]));
  const days = stats ? daysBetween(stats.first, twToday(Date.parse(stats.at))) + 1 : null;
  const big = stats
    ? [
        [stats.apps, ['個 App', 'apps']],
        [days, ['天', 'days']],
        [stats.commits, ['次更新', 'updates']],
        [stats.tests, ['個自動檢查', 'checks']]
      ]
    : [];
  const title = a => t(NODES.get(a.id).node.title);
  return h('section', { class: 'sc-hero' }, [
    sky,
    h('div', { class: 'sc-hero-text' }, [
      h('p', { class: 'sc-over', text: t(['自主學習作品', 'A self-directed learning project']) }),
      h('h1', { class: 'sc-title', text: 'Orbit' }),
      h('p', { class: 'sc-lede', text: t(['九個每天用得到的 App。高中生 Jay 決定做什麼、要做到多好；AI 助手 Claude 負責寫程式。', 'Nine everyday apps. Jay, a high-school student, decides what to build and how good it must be; an AI assistant, Claude, writes the code.']) }),
      big.length
        ? h(
            'div',
            { class: 'sc-herostats', title: en ? `Counted from git, on GitHub since ${fmtDayYear(stats.first)}` : `從 git 數出來；${fmtDayYear(stats.first)} 上 GitHub` },
            big.map(([value, label]) => {
              const v = h('strong');
              countUp(v, value);
              return h('div', {}, [v, h('span', { text: t(label) })]);
            })
          )
        : null,
      h('div', { class: 'sc-try-row' }, [
        h('p', { class: 'sc-try-t' }, [ico('play'), t(['點一個 App，直接試玩', 'Tap an app to try it'])]),
        h(
          'div',
          { class: 'sc-try-apps' },
          APPS.filter(a => hasDemo(a.id)).map(a =>
            h('button', { type: 'button', class: 'sc-try-app', 'aria-label': `${t(['試玩', 'Try'])} ${title(a)}`, onclick: () => openDemo(a, title(a)) }, [appImg(a.brand, 44), h('span', { text: t(SHORT[a.id]) })])
          )
        )
      ]),
      h('div', { class: 'sc-ctas' }, [
        link('apps', '', [ico('grid'), t(['看全部 App', 'All the apps'])], 'sc-btn'),
        link('how', '', [ico('list'), t(['看它怎麼運作', 'How it works'])], 'sc-btn')
      ])
    ])
  ]);
}

function numbers(stats) {
  if (!stats) return null;
  const more = [
    ['pencil', stats.lines, ['行程式碼', 'lines of code']],
    stats.rules ? ['check', stats.rules, ['條 Jay 定下的規則', 'rules Jay has set']] : null
  ].filter(Boolean);
  const at = new Date(stats.at).toLocaleString(en ? 'en-GB' : 'zh-TW', { timeZone: 'Asia/Taipei', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return h('section', { class: 'sc-block sc-numbers' }, [
    fold('sc-rise', [h('span', { class: 'sc-fold-t' }, [h('strong', { text: t(['更多數字', 'More numbers']) })])], [
      h('div', { class: 'sc-morenums' }, more.map(([icon, value, label]) => h('div', {}, [ico(icon), h('strong', { text: num(value) }), h('span', { text: t(label) })]))),
      h('p', { class: 'sc-note', text: t([`每天從程式碼自動重數（${at}）。`, `Recounted from the code every day (${at}).`]) })
    ])
  ]);
}

function grid() {
  return h('section', { class: 'sc-block' }, [
    h('h2', { class: 'sc-h2 sc-rise', text: t(['九個 App，點一個看看', 'Nine apps: tap one']) }),
    h(
      'div',
      { class: 'sc-appgrid' },
      APPS.map(a => {
        const node = NODES.get(a.id)?.node;
        return h('a', { class: 'sc-apptile sc-rise', href: `#apps/${a.id}` }, [appImg(a.brand, 60), h('strong', { text: t(node.title).replace(/^Orbit /, '') })]);
      })
    )
  ]);
}

export function renderHome(panel, stats) {
  panel.replaceChildren(hero(stats), numbers(stats) || '', grid());
  reveal(panel);
}
export { BRAND_OF };
