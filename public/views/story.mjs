// 歷程: how Orbit grew. Where it began (Orbit Color), the apps' birthdays,
// the big changes with their real dates, why, and before/after pictures,
// then a feel of how the work goes: the loop, a calendar of every day's
// updates and the hours they happen (data/stats.json, counted from git),
// three real days, and the complaints that became rules.
import { h, t, ico, appImg, fmtDay, fmtDayYear, num, reveal, zoom, en } from '../shell.mjs';
import { ORIGIN, TOOLS, DECISIONS, SETUP, CHANGES, BIRTHS, LOOP, DAYS, RULES } from '../lib/history.mjs';
import { APPS } from '../lib/apps.mjs';
import { NODES } from '../lib/tree.mjs';

const shot = f => `./shots/${f}.webp`;
const BRAND = Object.fromEntries(APPS.map(a => [a.id, a.brand]));
const pic = (f, alt, cls = '') => h('button', { class: `sc-pic ${cls}`.trim(), type: 'button', 'aria-label': `${alt}（${t(['放大', 'enlarge'])}）`, onclick: () => zoom(shot(f), alt) }, [h('img', { src: shot(f), alt, loading: 'lazy', decoding: 'async' })]);

function origin() {
  return h('section', { class: 'sc-origin sc-rise' }, [
    h('div', { class: 'sc-origin-text' }, [
      h('p', { class: 'sc-over', text: t(['起點', 'Where it began']) }),
      h('h2', { class: 'sc-h2', text: t(ORIGIN.title) }),
      ...ORIGIN.body.map(p => h('p', { text: t(p) }))
    ]),
    h(
      'ol',
      { class: 'sc-evo', 'aria-label': t(['課表 App 的演變', 'How the timetable app changed']) },
      ORIGIN.steps.map(([f, name, cap], k) =>
        h('li', { style: `--d:${k * 110}ms` }, [pic(f, name), h('strong', { text: name }), h('small', { text: t(cap) })])
      )
    ),
    h('p', { class: 'sc-note', text: t(['前三張是 Jay 上 GitHub 之前自己留下的版本；每一張都放進同一份假的課表重新畫出來。', 'The first three are copies Jay kept from before GitHub; each is drawn again with the same made-up timetable.']) })
  ]);
}

// ChatGPT → GitHub + Copilot → Claude: Jay's account, with what git shows.
function tools(stats) {
  const proof = {
    github: stats ? t([`在 GitHub 上的第一個多星期，每一次更新都是 Jay 自己上傳的。GitHub 的紀錄裡有 ${num(stats.copilot)} 次更新有 Copilot 參與。`, `For the first week or so on GitHub every update was Jay’s own upload. Git shows Copilot co-writing ${num(stats.copilot)} updates.`]) : '',
    claude: stats?.firstClaude ? t([`第一次有 Claude 參與的更新在 ${fmtDay(stats.firstClaude)}；到現在 ${num(stats.commits)} 次更新裡，至少 ${num(stats.claude)} 次有 Claude。`, `The first update Claude co-wrote was on ${fmtDay(stats.firstClaude)}; of ${num(stats.commits)} updates since, at least ${num(stats.claude)} were written with Claude.`]) : ''
  };
  return h('section', { class: 'sc-block sc-rise' }, [
    h('h2', { class: 'sc-h2', text: t(['用過的工具', 'The tools along the way']) }),
    h(
      'ol',
      { class: 'sc-tools' },
      TOOLS.map((x, k) =>
        h('li', { style: `--d:${k * 140}ms` }, [
          h('span', { class: 'sc-badge' }, [ico(x.icon)]),
          h('div', {}, [h('p', { class: 'sc-over', text: t(x.when) }), h('strong', { text: x.name }), h('p', { text: t(x.line) }), proof[x.id] ? h('p', { class: 'sc-proof' }, [ico('check'), proof[x.id]]) : null])
        ])
      )
    ),
    h('p', { class: 'sc-note', text: t(['前兩段是 Jay 自己的回憶；打勾的句子是從 GitHub 紀錄數出來的。', 'The story is Jay’s own memory; the ticked lines are counted from the GitHub history.']) })
  ]);
}

// Jay's calls: the direction, the standards and the judgement.
function decisions() {
  return h('section', { class: 'sc-block' }, [
    h('h2', { class: 'sc-h2 sc-rise', text: t(['Jay 做的決定', 'Jay’s decisions']) }),
    h('p', { class: 'sc-lede-s sc-rise', text: t(['程式大多是 Claude 打的，但做什麼、做到多好、什麼不做，都是 Jay 決定的。這些判斷讓 Orbit 在兩個月裡長得這麼快。', 'Claude typed most of the code, but what to build, how good it must be and what to leave out were Jay’s calls. These judgements are why Orbit grew so fast in two months.']) }),
    h(
      'ol',
      { class: 'sc-decisions' },
      DECISIONS.map(d =>
        h('li', { class: 'sc-card sc-decision sc-rise' }, [
          h('span', { class: 'sc-badge' }, [ico(d.icon)]),
          h('div', {}, [h('p', { class: 'sc-over', text: fmtDayYear(d.date) }), h('h3', { text: t(d.title) }), h('p', { text: t(d.d) })])
        ])
      )
    ),
    h('h3', { class: 'sc-h3 sc-rise', text: t(['他怎麼安排工作', 'How he runs the work']) }),
    h(
      'div',
      { class: 'sc-days' },
      SETUP.map(([icon, title, line]) => h('div', { class: 'sc-card sc-day sc-rise' }, [h('span', { class: 'sc-badge' }, [ico(icon)]), h('h4', { text: t(title) }), h('p', { text: t(line) })]))
    )
  ]);
}

function births(stats) {
  const first = Date.parse(`${BIRTHS[0].date}T12:00:00+08:00`);
  const last = Date.parse(`${(stats?.at || '2026-10-27').slice(0, 10)}T12:00:00+08:00`);
  const span = Math.max(1, last - first);
  const line = h('div', { class: 'sc-births-line' });
  BIRTHS.forEach((b, k) => {
    const x = ((Date.parse(`${b.date}T12:00:00+08:00`) - first) / span) * 100;
    const node = NODES.get(b.id).node;
    const m = h('a', { class: `sc-birth ${k % 2 ? 'low' : 'high'}`, href: `#apps/${b.id}`, style: `--x:${x}%; --d:${k * 90}ms` }, [appImg(BRAND[b.id], 36), h('span', { class: 'sc-birth-l' }, [h('strong', { text: t(node.title).replace('Orbit ', '') }), h('small', { text: fmtDay(b.date) })])]);
    line.append(m);
  });
  const list = h(
    'ol',
    { class: 'sc-births-list' },
    BIRTHS.map(b => {
      const node = NODES.get(b.id).node;
      return h('li', {}, [
        h('a', { href: `#apps/${b.id}` }, [
          appImg(BRAND[b.id], 36),
          h('span', {}, [h('strong', { text: t(node.title) }), h('small', { text: b.was ? `${fmtDay(b.date)} · ${t(['原名', 'first called'])} ${b.was}` : fmtDay(b.date) })])
        ])
      ]);
    })
  );
  return h('section', { class: 'sc-block sc-rise' }, [
    h('h2', { class: 'sc-h2', text: t(['九個 App 的生日', 'The nine apps’ birthdays']) }),
    h('p', { class: 'sc-lede-s', text: t(['第一個 App 早就在用了；其他八個都在之後兩個月裡做出來。', 'The first app was already in use; the other eight came in the two months after.']) }),
    h('div', { class: 'sc-births' }, [line]),
    list
  ]);
}

function changes() {
  return h('section', { class: 'sc-block' }, [
    h('h2', { class: 'sc-h2 sc-rise', text: t(['大改變', 'The big changes']) }),
    h('p', { class: 'sc-lede-s sc-rise', text: t(['不是每天的流水帳，只挑真正改變方向的時刻。每一個都是：遇到什麼問題、怎麼想、結果怎樣。', 'Not a daily log: only the moments that changed direction. Each one is a problem, an idea and a result.']) }),
    h(
      'ol',
      { class: 'sc-timeline' },
      CHANGES.map(c =>
        h('li', { class: 'sc-change sc-rise' }, [
          h('span', { class: 'sc-tl-dot', 'aria-hidden': 'true' }, [ico(c.icon)]),
          h('div', { class: 'sc-card sc-change-card' }, [
            h('p', { class: 'sc-over' }, [fmtDayYear(c.date), ...(c.apps || []).map(a => appImg(BRAND[a], 18, 'sc-inline-app'))]),
            h('h3', { text: t(c.title) }),
            h('dl', { class: 'sc-pid' }, [h('dt', {}, [ico('target'), t(['問題', 'Problem'])]), h('dd', { text: t(c.p) }), h('dt', {}, [ico('spark'), t(['想法', 'Idea'])]), h('dd', { text: t(c.i) }), h('dt', {}, [ico('check'), t(['結果', 'Result'])]), h('dd', { text: t(c.r) })]),
            c.ba ? h('figure', { class: 'sc-ba' }, [pic(c.ba, `${t(c.title)}：${t(['之前和之後', 'before and after'])}`), h('figcaption', { text: t(['之前 → 之後（點一下放大）', 'Before → after (tap to enlarge)']) })]) : null,
            c.node && NODES.has(c.node) ? h('a', { class: 'sc-more', href: `#how/${c.node}` }, [t(['在架構圖裡看', 'See it in the structure']), ico('chevron')]) : null
          ])
        ])
      )
    )
  ]);
}

// Every day from the first commit to the last count, a square each, Monday
// at the top, the colour by that day's updates (quartiles of the busy days).
function heatmap(stats) {
  const days = stats.days || {};
  const start = new Date(`${stats.first}T12:00:00+08:00`);
  const end = new Date(`${stats.at.slice(0, 10)}T12:00:00+08:00`);
  const counts = Object.values(days).filter(Boolean).sort((a, b) => a - b);
  const q = k => counts[Math.floor((counts.length - 1) * k)] || 1;
  const cuts = [q(0.25), q(0.5), q(0.75)];
  const level = n => (!n ? 0 : n <= cuts[0] ? 1 : n <= cuts[1] ? 2 : n <= cuts[2] ? 3 : 4);
  const grid = h('div', { class: 'sc-heat', role: 'img' });
  const lead = (start.getUTCDay() + 6) % 7;
  for (let k = 0; k < lead; k++) grid.append(h('span', { class: 'sc-cell blank' }));
  let busiest = ['', 0];
  let active = 0;
  let k = 0;
  for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86_400_000), k++) {
    const key = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' });
    const n = days[key] || 0;
    if (n) active++;
    if (n > busiest[1]) busiest = [key, n];
    grid.append(h('span', { class: `sc-cell l${level(n)}`, title: `${fmtDay(key)}：${num(n)}`, style: `--d:${Math.min(k * 6, 900)}ms` }));
  }
  const total = k;
  grid.setAttribute('aria-label', t([`${total} 天裡有 ${active} 天有更新`, `Updates on ${active} of ${total} days`]));
  const legend = h('div', { class: 'sc-legend' }, [t(['少', 'Fewer']), ...[0, 1, 2, 3, 4].map(l => h('span', { class: `sc-cell l${l}` })), t(['多', 'More'])]);
  return h('div', { class: 'sc-card sc-rise' }, [
    h('h3', { class: 'sc-h3', text: t(['每一天', 'Every day']) }),
    h('div', { class: 'sc-heatbox' }, [h('div', { class: 'sc-weekdays', 'aria-hidden': 'true' }, (en ? ['M', '', 'W', '', 'F', '', 'S'] : ['一', '', '三', '', '五', '', '日']).map(x => h('span', { text: x }))), grid]),
    legend,
    h('p', { class: 'sc-note', text: t([`一格一天，顏色越深那天更新越多。${total} 天裡有 ${active} 天有更新；最忙的是 ${fmtDay(busiest[0])}，${num(busiest[1])} 次。`, `One square a day, darker for more updates. Updates on ${active} of ${total} days; the busiest was ${fmtDay(busiest[0])}, with ${num(busiest[1])}.`]) })
  ]);
}

function hours(stats) {
  const hs = stats.hours || [];
  const max = Math.max(1, ...hs);
  const peak = hs.indexOf(max);
  return h('div', { class: 'sc-card sc-rise' }, [
    h('h3', { class: 'sc-h3', text: t(['一天裡的什麼時候', 'What time of day']) }),
    h(
      'div',
      { class: 'sc-hours', role: 'img', 'aria-label': t(['每個小時的更新次數', 'Updates by hour of day']) },
      hs.map((n, hr) => h('span', { class: `sc-hour${hr === peak ? ' peak' : ''}`, title: `${hr}:00 · ${num(n)}`, style: `--v:${(n / max).toFixed(3)}; --d:${hr * 25}ms` }))
    ),
    h('div', { class: 'sc-hours-axis', 'aria-hidden': 'true' }, ['0', '6', '12', '18', '24'].map(x => h('span', { text: x }))),
    h('p', { class: 'sc-note', text: t([`台北時間。最多的是 ${peak} 點那一小時。白天和晚上是 Jay 在用、在挑；半夜的多半是 Claude 在 Jay 睡覺時照著交代繼續做。`, `Taipei time; the busiest hour starts at ${peak}:00. Days and evenings are Jay using and picking at the apps; most of the small hours are Claude carrying on with what he asked while he sleeps.`]) })
  ]);
}

function howIWork(stats) {
  return h('section', { class: 'sc-block' }, [
    h('h2', { class: 'sc-h2 sc-rise', text: t(['Jay 怎麼工作', 'How Jay works']) }),
    h('p', { class: 'sc-lede-s sc-rise', text: t(['每天差不多是同一個循環：用、挑毛病、修好、上線，再用。', 'Most days are the same loop: use it, pick at it, fix it, ship it, use it again.']) }),
    h(
      'ol',
      { class: 'sc-loop sc-rise' },
      LOOP.map(([icon, title, line], k) => h('li', { style: `--d:${k * 120}ms` }, [h('span', { class: 'sc-badge' }, [ico(icon)]), h('strong', { text: t(title) }), h('small', { text: t(line) })]))
    ),
    stats?.days ? h('div', { class: 'sc-two' }, [heatmap(stats), hours(stats)]) : null,
    h('h3', { class: 'sc-h3 sc-rise', text: t(['三個真實的日子', 'Three real days']) }),
    h(
      'div',
      { class: 'sc-days' },
      DAYS.map(d => h('div', { class: 'sc-card sc-day sc-rise' }, [h('span', { class: 'sc-badge' }, [ico(d.icon)]), h('p', { class: 'sc-over', text: fmtDayYear(d.date) }), h('h4', { text: t(d.title) }), h('p', { text: t(d.line) })]))
    ),
    h('h3', { class: 'sc-h3 sc-rise', text: t(['抱怨變成全家族的規矩', 'Complaints that became family rules']) }),
    h('p', { class: 'sc-lede-s sc-rise', text: t(['Jay 每抱怨一次，就寫成一條九個 App 都要遵守、而且會被自動檢查的規矩。', 'Each time Jay complained, it became a rule all nine apps follow, checked automatically.']) }),
    h(
      'ul',
      { class: 'sc-rules' },
      RULES.map(([icon, text]) => h('li', { class: 'sc-rise' }, [ico(icon), h('span', { text: t(text) })]))
    )
  ]);
}

export function renderStory(panel, stats) {
  panel.replaceChildren(origin(), tools(stats), decisions(), births(stats), changes(), howIWork(stats));
  reveal(panel);
}
