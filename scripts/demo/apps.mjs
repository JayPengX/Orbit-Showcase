// Each demo: the app (preview.mjs's name), its repo, the clock it is
// frozen at, where the phone is, and the steps walked while recording:
// `tour` (the guided tour the showcase shows, in public/lib/demos.mjs) and
// `explore` (more of the app, so taps off the tour still have answers).
// A step: { tap: selector } | { hash: '#…' } | { type: [selector, text] } | { back: true }, with an optional wait (ms).
import { TOURS } from '../../public/lib/demos.mjs';

const steps = id => (TOURS[id] || []).map(s => ({ tap: s.tap, hash: s.hash, wait: s.wait }));

export const DEMOS = {
  weather: { app: 'weather', repo: 'Orbit-Weather', clock: '2026-10-02T19:30:00+08:00', geo: [25.034, 121.565], tour: steps('weather'), explore: [
    { tap: '#tab-now' }, { tap: '.q-panel[data-open="uv"]' }, { tap: '.q-close' }, { tap: '.q-panel[data-open="air"]' }, { tap: '.q-close' },
    { tap: '.wx-day[data-day="2026-10-05"]' }, { tap: '.q-close' }, { tap: '.wx-hr >> nth=3' }, { tap: '.q-close' },
    { tap: '#tab-week' }, { tap: '#tab-places' }, { tap: '#tab-now' }
  ] }
};
