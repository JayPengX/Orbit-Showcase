// What every view shares: the language, [zh, en] pairs, icons, dates and
// numbers, the app icons from the kit's brand, the apps' names and
// screenshots, a card’s problem → idea → result, and
// a picture shown big.
import { lang } from '#kit/lang.mjs';
import { appIcon, familyMark } from '#kit/brand.mjs';
import { h, icons } from '#kit/ui.mjs';
import { NODES } from './lib/tree.mjs';

export { h };
export const en = lang === 'en';
export const t = pair => (Array.isArray(pair) ? pair[en ? 1 : 0] : pair || '');
export const reduced = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// The page's wide arrangements (showcase.css @container page, 560 px of
// page and up: a phone on its side, a tablet, a computer).
export const wide = () => {
  const page = globalThis.document?.querySelector('.page');
  if (!page) return false;
  const cs = getComputedStyle(page);
  return page.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) >= 560;
};
// The demo in a phone frame, its tour beside it (a tablet or a computer);
// otherwise the app fills the screen as itself.
export const framed = () => globalThis.matchMedia?.('(min-width: 760px) and (min-height: 601px)').matches;

// A kit icon (an unknown name falls back to the spark).
export const ico = (name, cls = '') => h('span', { class: `sc-ico ${cls}`.trim(), 'aria-hidden': 'true', html: icons[name] || icons.spark });

// An app's icon (a brand id) or, without one, the family's mark, as an
// <img> so their gradients never clash on one page.
const svgUrl = svg => `data:image/svg+xml,${encodeURIComponent(svg)}`;
const ICONS = new Map();
export const iconUrl = brand => {
  const key = brand || 'family';
  if (!ICONS.has(key)) ICONS.set(key, svgUrl(brand ? appIcon(brand) : familyMark()));
  return ICONS.get(key);
};
export const appImg = (brand, size = 44, cls = '') => h('img', { class: `sc-appicon ${cls}`.trim(), src: iconUrl(brand), width: size, height: size, alt: '', decoding: 'async' });

// An app's name from the tree (Orbit Weather).
export const appTitle = a => t(NODES.get(a.id).node.title);

// A screenshot (shots/<app>/N): the set taken with the app in Chinese
// (N.zh.webp) on the Chinese page, the English one otherwise; a day-one
// picture (then-…) has one set.
export const shotUrl = (f, zh = true) => `./shots/${f}${zh && !en && !f.startsWith('then-') ? '.zh' : ''}.webp`;

// Problem → idea → result, a tree card's three plain lines.
export function pir(node) {
  return [
    ['target', ['問題', 'Problem'], node.p],
    ['spark', ['想法', 'Idea'], node.i],
    ['check', ['結果', 'Result'], node.r]
  ]
    .filter(([, , x]) => x)
    .map(([icon, label, x]) => h('div', { class: 'sc-pir-row' }, [h('span', { class: 'sc-pir-k' }, [ico(icon), t(label)]), h('p', { text: t(x) })]));
}

// Dates are Taipei's days ('YYYY-MM-DD').
const day = d => new Date(`${d}T12:00:00+08:00`);
export const fmtDay = d => (en ? day(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Taipei' }) : `${+d.slice(5, 7)} 月 ${+d.slice(8, 10)} 日`);
export const fmtDayYear = d => (en ? day(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Taipei' }) : `${d.slice(0, 4)} 年 ${fmtDay(d)}`);
export const daysBetween = (a, b) => Math.round((day(b) - day(a)) / 86_400_000);
export const twToday = (at = Date.now()) => new Date(at).toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' });
export const num = n => Number(n).toLocaleString(en ? 'en-US' : 'zh-TW');

// The address: #tab or #tab/what. go() moves it; the app listens.
export const go = (tab, what = '') => {
  const next = `#${tab}${what ? `/${what}` : ''}`;
  if (location.hash !== next) location.hash = next;
};

// A picture shown big: a centred layer over the page, closed by a tap,
// Escape or its ✕.
export function zoom(src, alt = '') {
  const shut = () => {
    document.removeEventListener('keydown', key);
    box.classList.add('out');
    setTimeout(() => box.remove(), reduced() ? 0 : 200);
  };
  const key = e => e.key === 'Escape' && shut();
  const box = h('div', { class: 'sc-zoom', role: 'dialog', 'aria-modal': 'true', 'aria-label': alt || t(['圖片', 'Picture']), onclick: shut }, [
    h('img', { src, alt }),
    h('button', { class: 'q-close sc-zoom-x', type: 'button', 'aria-label': t(['關閉', 'Close']), text: '✕' })
  ]);
  document.addEventListener('keydown', key);
  document.body.append(box);
  box.querySelector('button').focus({ preventScroll: true });
}
