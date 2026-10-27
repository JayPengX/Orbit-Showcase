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
// - the phone is where it was recorded;
// - every call outside the site is answered from the recording (nothing
//   goes out live), and pictures from outside come from the copies kept.
(() => {
  const D = window.__DEMO;
  if (!D) return;
  const noop = () => {};

  // ---- The clock ----
  const RealDate = Date;
  const shift = D.at - RealDate.now();
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
  const clean = u => {
    const url = new URL(u, location.href);
    url.searchParams.delete('t');
    url.searchParams.delete('_');
    return url.href;
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
