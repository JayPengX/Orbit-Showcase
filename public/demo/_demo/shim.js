// The demo's sandbox, run before anything else in a frozen app copy
// (scripts/demo/build.mjs puts it first in each demo's index.html, after
// the demo's data, window.__DEMO). The app runs as recorded and can't reach
// or change anything outside the demo:
// - its clock starts at the moment it was recorded;
// - local and session storage live in memory only, never in the browser
//   (the real Orbit apps share this address: their sign-in and data are
//   never read or touched), and so do caches; no service worker, no
//   BroadcastChannel (the family's one-session rule never hears it), no
//   notifications;
// - the phone is where it was recorded, and chance plays out the same way
//   each time (Math.random from a fixed seed, as while recording);
// - every call outside the site is answered from the recording (nothing
//   goes out live), and pictures from outside come from the copies kept.
(() => {
  const D = window.__DEMO;
  if (!D) return;
  const noop = () => {};

  // ---- The clock ----
  const RealDate = Date;
  // An app that reads the phone's own clock hands (Class: the bells are
  // local times) sees Taiwan's, wherever the visitor is.
  const away = D.wall ? (new RealDate(D.at).getTimezoneOffset() + 480) * 60_000 : 0;
  const shift = D.at + away - RealDate.now();
  class DemoDate extends RealDate {
    constructor(...a) {
      if (a.length) super(...a);
      else super(RealDate.now() + shift);
    }
    static now() {
      return RealDate.now() + shift;
    }
  }
  window.Date = DemoDate;

  // ---- The same luck every time (record.mjs seeds it the same) ----
  let luck = 20261027;
  Math.random = () => {
    luck = (luck + 0x6d2b79f5) | 0;
    let x = Math.imul(luck ^ (luck >>> 15), 1 | luck);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };

  // ---- Storage in memory ----
  const memory = seed => {
    const m = new Map(seed);
    const s = {
      getItem: k => (m.has(String(k)) ? m.get(String(k)) : null),
      setItem: (k, v) => void m.set(String(k), String(v)),
      removeItem: k => void m.delete(String(k)),
      clear: () => m.clear(),
      key: i => [...m.keys()][i] ?? null,
      get length() {
        return m.size;
      }
    };
    return s;
  };
  let lang = 'zh';
  try {
    lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
  } catch {}
  const seed = [['orbit.refresh', D.token], ['orbit.account', '0123456789abcdef'], ['orbit.lang', lang], ...(D.stores || [])];
  const local = memory(seed);
  const session = memory([]);
  const define = (obj, name, value) => {
    try {
      Object.defineProperty(obj, name, { value, configurable: true, writable: true });
    } catch {}
  };
  define(window, 'localStorage', local);
  define(window, 'sessionStorage', session);
  const store = new Map();
  const cache = name => ({
    match: async req => store.get(`${name}|${typeof req === 'string' ? req : req.url}`)?.clone(),
    put: async (req, res) => void store.set(`${name}|${typeof req === 'string' ? req : req.url}`, res.clone()),
    add: async noopReq => undefined,
    addAll: async () => undefined,
    delete: async req => store.delete(`${name}|${typeof req === 'string' ? req : req.url}`),
    keys: async () => []
  });
  define(window, 'caches', { open: async name => cache(name), match: async () => undefined, has: async () => false, delete: async () => true, keys: async () => [] });

  // ---- No service worker, channel or notifications ----
  const reg = { update: async () => {}, unregister: async () => true, addEventListener: noop, removeEventListener: noop, installing: null, waiting: null, active: null, scope: location.href };
  const sw = { register: async () => reg, getRegistration: async () => undefined, getRegistrations: async () => [], ready: new Promise(noop), controller: null, addEventListener: noop, removeEventListener: noop, startMessages: noop };
  define(Navigator.prototype, 'serviceWorker', sw);
  define(navigator, 'serviceWorker', sw);
  class Channel {
    constructor(name) {
      this.name = name;
      this.onmessage = null;
    }
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  }
  define(window, 'BroadcastChannel', Channel);
  define(window, 'Notification', Object.assign(function Notification() {}, { permission: 'default', requestPermission: async () => 'denied' }));
  define(window, 'PushManager', undefined);

  // ---- On the home screen, where it was recorded ----
  define(Navigator.prototype, 'standalone', true);
  // An app that checks for a phone by its name (Class's phones-only screen) is told it's on one.
  if (D.ua) {
    define(Navigator.prototype, 'userAgent', D.ua);
    define(Navigator.prototype, 'maxTouchPoints', 5);
  }
  const where = () => ({ coords: { latitude: D.geo[0], longitude: D.geo[1], accuracy: 20, altitude: null, altitudeAccuracy: null, heading: null, speed: null }, timestamp: DemoDate.now() });
  define(navigator, 'geolocation', {
    getCurrentPosition: ok => setTimeout(() => ok(where()), 120),
    watchPosition: ok => (setTimeout(() => ok(where()), 120), 1),
    clearWatch: noop
  });
  if (navigator.permissions) {
    const query = navigator.permissions.query.bind(navigator.permissions);
    define(navigator.permissions, 'query', d => (d && (d.name === 'geolocation' || d.name === 'notifications') ? Promise.resolve({ state: d.name === 'geolocation' ? 'granted' : 'prompt', addEventListener: noop, onchange: null }) : query(d)));
  }

  // ---- A phone's screen: touch, no hover (pull to refresh, not a button) ----
  const mm = window.matchMedia.bind(window);
  const phone = { '(pointer: coarse)': true, '(pointer:coarse)': true, '(any-pointer: coarse)': true, '(pointer: fine)': false, '(pointer:fine)': false, '(hover: hover)': false, '(hover:hover)': false, '(display-mode: standalone)': true };
  window.matchMedia = q => {
    const m = mm(q);
    const key = String(q).trim().toLowerCase();
    if (!(key in phone)) return m;
    return { matches: phone[key], media: q, onchange: null, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => false };
  };

  // ---- No Orbit Pass button (no sign-out or pass sheet in a demo) ----
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '.q-account{display:none!important}';
    document.head.append(style);
  });

  // ---- Nothing leaves the demo: outside links and new windows stay shut ----
  window.open = () => null;
  document.addEventListener(
    'click',
    e => {
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      const url = new URL(a.getAttribute('href'), location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith(location.pathname.replace(/[^/]*$/, ''))) e.preventDefault();
    },
    true
  );

  // ---- Every outside call answered from the recording ----
  // Matched as plain text, however many times it was escaped (a recorded
  // address can come back decoded once), without its cache-busting stamp.
  const clean = u => {
    let x = new URL(u, location.href).href;
    for (let i = 0; i < 3; i++) {
      let y = x;
      try {
        y = decodeURIComponent(x);
      } catch {}
      if (y === x) break;
      x = y;
    }
    return x.replace(/([?&])(?:t|_)=\d+(?=&|$)/g, '$1').replace(/[?&]+$/, '').replace(/&&+/g, '&');
  };
  const byKey = new Map();
  const byUrl = new Map();
  for (const [method, url, body, status, type, file] of D.answers) {
    const k = `${method} ${clean(url)}`;
    byKey.set(`${k}\n${body}`, [status, type, file]);
    if (!byUrl.has(k)) byUrl.set(k, [status, type, file]);
  }
  const here = new URL('.', document.currentScript?.src || location.href).href;
  const realFetch = window.fetch.bind(window);
  const answer = async ([status, type, file]) => {
    const res = await realFetch(new URL(file, here).href);
    return new Response(status === 204 || status === 304 ? null : await res.arrayBuffer(), { status, headers: { 'content-type': type } });
  };
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? String(input) : input.url, location.href);
    const method = String(init.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase();
    if (url.origin === location.origin) {
      if (/\/version\.json$/.test(url.pathname)) {
        const kit = /\/Shared-Proxy\/kit\//.test(url.pathname);
        const v = kit ? 'local' : document.querySelector('meta[name="build-version"]')?.content || 'dev';
        return new Response(JSON.stringify({ version: v }), { headers: { 'content-type': 'application/json' } });
      }
      return realFetch(input, init);
    }
    // The proxy's reads, one by one, however the app batches them this time:
    // a batch is answered a line each ({ i, s, b }); one not kept answers 504,
    // and the app asks for it alone, as it does with the real proxy.
    if (/\/sports-proxy$/.test(url.pathname) && method === 'GET') {
      const one = u => (D.items?.[u] ? realFetch(new URL(D.items[u], here).href).then(r => r.text()) : null);
      if (url.searchParams.has('batch')) {
        const lines = await Promise.all(url.searchParams.getAll('u').map(async (u, i) => {
          const b = await one(u);
          return b ? `{"i":${i},"s":200,"b":${b}}` : `{"i":${i},"s":504}`;
        }));
        return new Response(`${lines.join('\n')}\n`, { headers: { 'content-type': 'application/json' } });
      }
      const target = url.searchParams.get('url');
      const trim = url.searchParams.get('trim');
      const b = target && (await one(trim ? `${trim}!${target}` : target));
      if (b) return new Response(b, { headers: { 'content-type': 'application/json' } });
    }
    const body = typeof init.body === 'string' ? init.body : '';
    const k = `${method} ${clean(url.href)}`;
    const hit = byKey.get(`${k}\n${body}`) || byUrl.get(k);
    if (hit) return answer(hit);
    console.warn('[demo] not recorded:', method, url.href);
    return new Response('{}', { status: 503, headers: { 'content-type': 'application/json' } });
  };
  define(navigator, 'sendBeacon', () => true);

  // ---- Outside pictures from the kept copies ----
  const pics = new Map(Object.entries(D.pics || {}));
  const kept = u => {
    if (typeof u !== 'string' || !/^https?:/.test(u)) return u;
    const f = pics.get(u);
    return f ? new URL(f, here).href : u;
  };
  const src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', { configurable: true, get() { return src.get.call(this); }, set(v) { src.set.call(this, kept(v)); } });
  const setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    return setAttr.call(this, name, this instanceof HTMLImageElement && String(name).toLowerCase() === 'src' ? kept(value) : value);
  };
  new MutationObserver(list => {
    for (const m of list) for (const n of m.addedNodes) if (n.nodeType === 1) for (const img of n.tagName === 'IMG' ? [n] : n.querySelectorAll?.('img') || []) { const a = img.getAttribute('src'); const b = kept(a); if (b !== a) setAttr.call(img, 'src', b); }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
