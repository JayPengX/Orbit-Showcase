// Orbit in numbers, counted from git by the deploy (data/stats.json): every
// day's updates, as squares. The main page's 成長 shows it (views/main.mjs).
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
    h('p', { class: 'sc-numfig' }, [h('strong', { text: `${active}/${total}` }), h('span', { text: t(['天有更新', 'days with updates']) })]),
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
