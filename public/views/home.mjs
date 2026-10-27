// 總覽: the family in one screen. The planet with the nine apps circling it,
// the real numbers (data/stats.json, recounted daily by the deploy), Orbit
// in three sentences, and every app one tap from its demo.
import { h, t, ico, appImg, countUp, fmtDayYear, daysBetween, twToday, num, link, reveal, en } from '../shell.mjs';
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
      h('p', { class: 'sc-lede', text: t(['九個每天用得到的 App，由一位高中生 Jay 和 AI 助手 Claude 一起做出來。', 'Nine everyday apps, made by a high-school student, Jay, together with an AI assistant, Claude.']) }),
      stats
        ? h('p', { class: 'sc-since', text: en ? `On GitHub since ${fmtDayYear(stats.first)}: ${num(days)} days.` : `從 ${fmtDayYear(stats.first)} 上 GitHub 到今天，第 ${num(days)} 天。` })
        : null,
      h('div', { class: 'sc-ctas' }, [
        link('apps', '', [ico('grid'), t(['看 App', 'See the apps'])], 'sc-btn sc-btn-main'),
        link('how', '', [ico('list'), t(['拆開來看', 'Look inside'])], 'sc-btn'),
        link('story', '', [ico('history'), t(['一路走來', 'How it grew'])], 'sc-btn')
      ])
    ])
  ]);
}

function numbers(stats) {
  if (!stats) return null;
  const days = daysBetween(stats.first, twToday(Date.parse(stats.at))) + 1;
  const items = [
    ['grid', stats.apps, ['個 App', 'apps']],
    ['calendar', days, ['天（從上 GitHub 算起）', 'days on GitHub']],
    ['send', stats.commits, ['次更新', 'updates']],
    ['pencil', stats.lines, ['行程式碼', 'lines of code']],
    ['check', stats.tests, ['個自動檢查', 'automatic checks']],
    ['spark', Math.round((stats.claude / stats.commits) * 100), ['% 的更新有 Claude 參與', '% of updates written with Claude']]
  ];
  const grid = h('div', { class: 'sc-nums' });
  for (const [icon, value, label] of items) {
    const v = h('strong', { class: 'sc-num-v' });
    countUp(v, value);
    grid.append(h('div', { class: 'sc-num sc-rise' }, [ico(icon), v, h('span', { class: 'sc-num-l', text: t(label) })]));
  }
  const at = new Date(stats.at).toLocaleString(en ? 'en-GB' : 'zh-TW', { timeZone: 'Asia/Taipei', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return h('section', { class: 'sc-block' }, [
    h('h2', { class: 'sc-h2', text: t(['真實的數字', 'The real numbers']) }),
    grid,
    h('p', { class: 'sc-note', text: t([`每天自動從程式碼重新數一次，不是估的。上次更新：${at}。`, `Recounted from the code itself every day, never estimated. Last counted ${at}.`]) })
  ]);
}

function three() {
  const card = (icon, color, title, body, tab, more) =>
    h('a', { class: 'sc-card sc-three sc-rise', href: `#${tab}`, style: `--c:${color}` }, [h('span', { class: 'sc-badge' }, [ico(icon)]), h('h3', { text: t(title) }), h('p', { text: t(body) }), h('span', { class: 'sc-more' }, [t(more), ico('chevron')])]);
  return h('section', { class: 'sc-block' }, [
    h('h2', { class: 'sc-h2', text: t(['三句話看懂 Orbit', 'Orbit in three sentences']) }),
    h('div', { class: 'sc-threes' }, [
      card('grid', 'var(--q-orange)', ['做了什麼', 'What'], ['九個 App，每個回答一個生活裡的問題：今晚看哪場比賽、怎麼搭車、要不要帶傘、下一節什麼課、背哪些單字、聽什麼音樂、法律怎麼說、怎麼投資、錢花到哪。', 'Nine apps, each answering one everyday question: which game tonight, how to get there, umbrella or not, which class next, which words, what music, what the law says, how investing works, where the money went.'], 'apps', ['看每個 App', 'See each app']),
      card('backpack', 'var(--q-indigo)', ['怎麼做的', 'How'], ['九個 App 共用一盒零件、一張通行證和一個雲端小幫手，所以長得像一家人，改一次大家一起變好，一個月只花 5 美元。', 'The nine share one box of parts, one pass and one helper in the cloud: they look like a family, a fix helps them all, and it costs five US dollars a month.'], 'how', ['拆開來看', 'Look inside']),
      card('user', 'var(--q-green)', ['誰做的', 'Who'], ['Jay 定方向、定標準、做每一個判斷，並在 iPhone 上一直用一直挑毛病；Claude 負責把程式打出來、測試、上線。', 'Jay sets the direction, the standards and every judgement call, and keeps picking at the apps on his iPhone; Claude does the typing, the testing and the shipping.'], 'story', ['看它怎麼長大', 'See how it grew'])
    ])
  ]);
}

function grid() {
  return h('section', { class: 'sc-block' }, [
    h('h2', { class: 'sc-h2', text: t(['九個 App', 'The nine apps']) }),
    h(
      'div',
      { class: 'sc-appgrid' },
      APPS.map(a => {
        const node = NODES.get(a.id)?.node;
        return h('a', { class: 'sc-apptile sc-rise', href: `#apps/${a.id}` }, [appImg(a.brand, 56), h('strong', { text: t(node.title) }), h('span', { text: t(node.line) })]);
      })
    )
  ]);
}

export function renderHome(panel, stats) {
  panel.replaceChildren(hero(stats), numbers(stats) || '', three(), grid());
  reveal(panel);
}
export { BRAND_OF };
