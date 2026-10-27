// Each demo: the app (preview.mjs's name), its repo, the clock it is
// frozen at, where the phone is, and the steps walked while recording:
// `tour` (the guided tour the showcase shows, in public/lib/demos.mjs) and
// `explore` (more of the app, so taps off the tour still have answers), and
// `payload`, a script that writes the made-up saved data it opens on; `skip`,
// big folders left out but for what the recording read, and `keep`, files from
// them it needs anyway; `built`, files the app's deploy makes, from its live
// site; `css`, rules put into the copy; `ua`, the phone's name for an app
// that asks for it; `stores`, what the app finds saved on the phone; `wall`,
// an app on the phone's own clock hands (shown Taiwan's time anywhere).
// A step: { tap: selector } | { hash: '#…' } | { type: [selector, text] } | { back: true }, with an optional wait (ms).
import { TOURS } from '../../public/lib/demos.mjs';
import { timetable } from './class-timetable.mjs';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1';
const steps = id => (TOURS[id] || []).map(s => ({ tap: s.tap, hash: s.hash, wait: s.wait }));

export const DEMOS = {
  weather: { app: 'weather', repo: 'Orbit-Weather', clock: '2026-10-02T19:30:00+08:00', geo: [25.034, 121.565], tour: steps('weather'), explore: [
    { tap: '#tab-now' }, { tap: '.q-panel[data-open="uv"]' }, { tap: '.q-close' }, { tap: '.q-panel[data-open="air"]' }, { tap: '.q-close' },
    { tap: '.wx-day[data-day="2026-10-05"]' }, { tap: '.q-close' }, { tap: '.wx-hr >> nth=3' }, { tap: '.q-close' },
    { tap: '#tab-week' }, { tap: '#tab-places' }, { tap: '#tab-now' }
  ] },
  money: { app: 'money', repo: 'Orbit-Money', clock: '2026-10-27T20:30:00+08:00', geo: [25.034, 121.565], payload: 'scripts/demo/money-books.mjs', tour: steps('money'), explore: [
    { tap: '#tab-more' }, { tap: '#tab-cal' }, { tap: '.mn-step[aria-label="上個月"]' }, { tap: '.mn-step[aria-label="下個月"]' }, { tap: '.mn-row' }
  ] },
  words: { app: 'words', repo: 'Orbit-Words', clock: '2026-10-27T20:30:00+08:00', geo: [25.034, 121.565], skip: ['data'], keep: ['fare', 'hit', 'how', 'military'].map(w => `data/audio/${w}.mp3`), tour: steps('words'), explore: [{ tap: '#tab-review' }, { tap: '#tab-today' }, { tap: '.wotd' }] },
  sports: { app: 'sports', repo: 'Orbit-Sports', clock: 'now', geo: [25.034, 121.565], tour: steps('sports'), explore: [], settle: 9000,
    built: { 'nba-elta.json': 'https://jaypengx.github.io/Orbit-Sports/nba-elta.json' },
    // No betting anywhere in the showcase (Jay): the win chance cards come from betting prices, so they stay hidden.
    css: '.q-card:has(.wp){display:none!important}' },
  securities: { app: 'securities', repo: 'Orbit-Securities', clock: 'now', geo: [25.034, 121.565], tour: steps('securities'), explore: [{ tap: '.q-tab[data-tab="markets"]' }, { tap: '.q-tab[data-tab="fx"]' }, { tap: '.q-tab[data-tab="home"]' }, { tap: '[data-symbol="^TWII"]' }], settle: 9000 },
  class: { app: 'orbit', repo: 'Orbit-Class', dist: 'dist', ua: IPHONE, wall: true, clock: '2026-10-28T09:20:00+08:00', geo: [25.034, 121.565], stores: [['classFocusData', JSON.stringify(timetable)]], tour: steps('class'), explore: [] },
  transit: { app: 'transit', repo: 'Orbit-Transit', clock: 'now', geo: [24.8016, 120.9716], tour: steps('transit'), explore: [], settle: 9000 }
};
