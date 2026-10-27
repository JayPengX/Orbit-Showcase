// What every view shares: the language, [zh, en] pairs, icons, dates and
// numbers, the app icons from the kit's brand, the address (#tab/what), and
// the small animations (things rising into view, numbers counting up).
import { lang } from '#kit/lang.mjs';
import { appIcon, familyMark } from '#kit/brand.mjs';
import { h, icons } from '#kit/ui.mjs';

export { h };
export const en = lang === 'en';
export const t = pair => (Array.isArray(pair) ? pair[en ? 1 : 0] : pair || '');
export const reduced = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
export const wide = () => globalThis.matchMedia?.('(min-width: 900px)').matches;

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
export const link = (tab, what, children, cls = '') => h('a', { href: `#${tab}${what ? `/${what}` : ''}`, class: cls }, children);

// Things rise into view as they're scrolled to (once each).
let io = null;
export function reveal(root) {
  const items = root.querySelectorAll('.sc-rise:not(.in)');
  if (reduced() || typeof IntersectionObserver === 'undefined') return items.forEach(n => n.classList.add('in'));
  io ||= new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach(n => io.observe(n));
}

// A number that counts up to its value the first time it's seen.
export function countUp(el, to, { ms = 1400, fmt = num } = {}) {
  el.textContent = fmt(to);
  if (reduced() || typeof IntersectionObserver === 'undefined') return;
  el.textContent = fmt(0);
  const seen = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    seen.disconnect();
    const start = performance.now();
    const step = now => {
      const k = Math.min(1, (now - start) / ms);
      el.textContent = fmt(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  seen.observe(el);
}

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

// A card that shows its head and opens to the rest on a tap.
export const fold = (cls, head, body) =>
  h('details', { class: `sc-card sc-fold ${cls}`.trim() }, [h('summary', {}, [...head, h('span', { class: 'sc-fold-mark', 'aria-hidden': 'true' }, [ico('chevron')])]), h('div', { class: 'sc-fold-body' }, body)]);
