// Orbit in numbers, all counted from git by the deploy (data/stats.json):
// every day's updates, the hours they happen, and how much code was written
// and rewritten. The main page's 怎麼做的 shows them (views/main.mjs).
import { h, t, fmtDay, num, en } from '../shell.mjs';

// Every day from the first commit to the last count, a square each, Monday
// at the top, the colour by that day's updates (quartiles of the busy days).
export function heatmap(stats) {
  const days = stats.days || {};
  const start = new Date(`${stats.first}T12:00:00+08:00`);
  const end = new Date(`${stats.at.slice(0, 10)}T12:00:00+08:00`);
  const counts = Object.values(days)
    .filter(Boolean)
    .sort((a, b) => a - b);
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
  return h('div', { class: 'sc-card' }, [
    h('h3', { class: 'sc-h3', text: t(['每一天', 'Every day']) }),
    h('div', { class: 'sc-heatbox' }, [
      h(
        'div',
        { class: 'sc-weekdays', 'aria-hidden': 'true' },
        (en ? ['M', '', 'W', '', 'F', '', 'S'] : ['一', '', '三', '', '五', '', '日']).map(x => h('span', { text: x }))
      ),
      grid
    ]),
    legend,
    h('p', {
      class: 'sc-note',
      text: t([
        `一格一天，顏色越深那天更新越多。${total} 天裡有 ${active} 天有更新；最忙的是 ${fmtDay(busiest[0])}，${num(busiest[1])} 次。`,
        `One square a day, darker for more updates. Updates on ${active} of ${total} days; the busiest was ${fmtDay(busiest[0])}, with ${num(busiest[1])}.`
      ])
    })
  ]);
}

export function hours(stats) {
  const hs = stats.hours || [];
  const max = Math.max(1, ...hs);
  const peak = hs.indexOf(max);
  return h('div', { class: 'sc-card' }, [
    h('h3', { class: 'sc-h3', text: t(['一天裡的什麼時候', 'What time of day']) }),
    h(
      'div',
      { class: 'sc-hours', role: 'img', 'aria-label': t(['每個小時的更新次數', 'Updates by hour of day']) },
      hs.map((n, hr) => h('span', { class: `sc-hour${hr === peak ? ' peak' : ''}`, title: `${hr}:00 · ${num(n)}`, style: `--v:${(n / max).toFixed(3)}; --d:${hr * 25}ms` }))
    ),
    h(
      'div',
      { class: 'sc-hours-axis', 'aria-hidden': 'true' },
      ['0', '6', '12', '18', '24'].map(x => h('span', { text: x }))
    ),
    h('p', {
      class: 'sc-note',
      text: t([
        `台北時間。最多的是 ${peak} 點那一小時。白天和晚上是 Jay 在用、在挑；半夜的多半是 Claude 在 Jay 睡覺時照著交代繼續做。`,
        `Taipei time; the busiest hour starts at ${peak}:00. Days and evenings are Jay using and picking at the apps; most of the small hours are Claude carrying on with what he asked while he sleeps.`
      ])
    })
  ]);
}

// How much was written, and how much of it later came out (counted from git).
export function churn(stats) {
  if (!stats?.added) return null;
  const share = stats.removed / stats.added;
  return h('div', { class: 'sc-card sc-churn' }, [
    h('h3', { class: 'sc-h3', text: t(['寫了又改', 'Written, then rewritten']) }),
    h('div', { class: 'sc-churn-nums' }, [
      h('div', {}, [h('strong', { text: num(stats.added) }), h('small', { text: t(['行程式寫過', 'lines of code written']) })]),
      h('div', {}, [h('strong', { text: num(stats.removed) }), h('small', { text: t(['行後來刪掉或改寫', 'later removed or rewritten']) })]),
      h('div', {}, [h('strong', { text: num(stats.reverts) }), h('small', { text: t(['次更新整個撤回', 'updates undone outright']) })])
    ]),
    h(
      'div',
      {
        class: 'sc-churn-bar',
        style: `--k:${Math.round(share * 1000) / 10}%`,
        role: 'img',
        'aria-label': t([`每 10 行約有 ${Math.round(share * 10)} 行後來被拿掉`, `About ${Math.round(share * 10)} in every 10 lines were later taken out`])
      },
      [h('span')]
    )
  ]);
}
