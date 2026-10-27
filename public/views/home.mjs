// 總覽: one idea a screen. The planet with the nine apps circling it, the
// headline numbers (data/stats.json, recounted daily by the deploy; the rest
// one tap away), and every app one tap from its demo.
import { h, t, ico, appImg, countUp, fmtDayYear, daysBetween, twToday, num, link, reveal, fold, en } from '../shell.mjs';
import { APPS } from '../lib/apps.mjs';
import { NODES } from '../lib/tree.mjs';

const BRAND_OF = Object.fromEntries(APPS.map(a => [a.id, a.brand]));

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
  return h('section', { class: 'sc-hero' }, [
    sky,
    h('div', { class: 'sc-hero-text' }, [
      h('p', { class: 'sc-over', text: t(['自主學習作品', 'A self-directed learning project']) }),
      h('h1', { class: 'sc-title', text: 'Orbit' }),
      h('p', { class: 'sc-lede', text: t(['九個每天用得到的 App。高中生 Jay 決定做什麼、要做到多好；AI 助手 Claude 負責寫程式。', 'Nine everyday apps. Jay, a high-school student, decides what to build and how good it must be; an AI assistant, Claude, writes the code.']) }),
      stats
        ? h('p', { class: 'sc-since', text: en ? `On GitHub since ${fmtDayYear(stats.first)}: ${num(days)} days.` : `從 ${fmtDayYear(stats.first)} 上 GitHub 到今天，第 ${num(days)} 天。` })
        : null,
      h('div', { class: 'sc-ctas' }, [
        link('apps', '', [ico('grid'), t(['看 App', 'See the apps'])], 'sc-btn sc-btn-main'),
        link('story', '', [ico('history'), t(['它怎麼長大', 'How it grew'])], 'sc-btn')
      ])
    ])
  ]);
}

function numbers(stats) {
  if (!stats) return null;
  const days = daysBetween(stats.first, twToday(Date.parse(stats.at))) + 1;
  const big = [
    [stats.apps, ['個 App', 'apps']],
    [days, ['天', 'days']],
    [stats.commits, ['次更新', 'updates']]
  ];
  const more = [
    ['pencil', stats.lines, ['行程式碼', 'lines of code']],
    ['check', stats.tests, ['個自動檢查', 'automatic checks']],
    ['spark', Math.round((stats.claude / stats.commits) * 100), ['% 的更新有 Claude 參與', '% of updates written with Claude']]
  ];
  const at = new Date(stats.at).toLocaleString(en ? 'en-GB' : 'zh-TW', { timeZone: 'Asia/Taipei', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return h('section', { class: 'sc-block sc-numbers' }, [
    h('h2', { class: 'sc-h2 sc-rise', text: t(['兩個月，三個數字', 'Two months, three numbers']) }),
    h(
      'div',
      { class: 'sc-bignums' },
      big.map(([value, label]) => {
        const v = h('strong');
        countUp(v, value);
        return h('div', { class: 'sc-bignum sc-rise' }, [v, h('span', { text: t(label) })]);
      })
    ),
    fold('sc-rise', [h('span', { class: 'sc-fold-t' }, [h('strong', { text: t(['更多數字', 'More numbers']) })])], [
      h('div', { class: 'sc-morenums' }, more.map(([icon, value, label]) => h('div', {}, [ico(icon), h('strong', { text: num(value) }), h('span', { text: t(label) })]))),
      h('p', { class: 'sc-note', text: t([`全部從程式碼自動數出來，每天重算，不是估的。上次：${at}。天數從 ${fmtDayYear(stats.first)} 上 GitHub 算起。`, `All counted from the code itself, every day, never estimated. Last counted ${at}. Days count from ${fmtDayYear(stats.first)}, when it reached GitHub.`]) })
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
