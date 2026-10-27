// The demo player: an app running for real (its frozen copy in demo/, with
// made-up data and nothing live) on a phone, and its guided tour beside it.
// A step rings what to tap inside the app and moves on when it's tapped (or
// with 下一步). 重來 starts the app over; nothing it does is kept.
import { h, t, ico, appImg, en, reduced } from '../shell.mjs';
import { DEMOS, TOURS } from '../lib/demos.mjs';

const W = 390;
const H = 844;
let open = null;

export const hasDemo = id => Boolean(DEMOS[id]);

export function openDemo(app, title) {
  open?.close();
  const demo = DEMOS[app.id];
  const tour = TOURS[app.id] || [];
  const src = `./demo/${demo.repo}/?lang=${en ? 'en' : 'zh'}`;
  let frame = null;
  let at = -1;
  let ring = null;
  let watch = 0;
  let unhook = null;

  const stage = h('div', { class: 'sc-player-stage' });
  const screen = h('div', { class: 'sc-player-screen' });
  const phone = h('div', { class: 'sc-player-phone' }, [screen]);
  stage.append(phone);
  const n = h('span', { class: 'sc-player-n' });
  const say = h('p', { class: 'sc-player-say', 'aria-live': 'polite' });
  const back = h('button', { class: 'sc-btn sc-icon', type: 'button', 'aria-label': t(['上一步', 'Back']), onclick: () => step(at - 1) }, [ico('chevron')]);
  const next = h('button', { class: 'sc-btn sc-btn-main', type: 'button', onclick: () => step(at + 1) });
  const card = h('div', { class: 'sc-player-card' }, [n, say, h('div', { class: 'sc-player-btns' }, [back, next])]);
  const close = () => {
    cancelAnimationFrame(watch);
    unhook?.();
    box.classList.remove('in');
    document.documentElement.classList.remove('sc-playing');
    setTimeout(() => box.remove(), reduced() ? 0 : 220);
    sized.disconnect();
    removeEventListener('keydown', key);
    open = null;
  };
  const key = e => e.key === 'Escape' && close();
  const box = h('div', { class: 'sc-player', role: 'dialog', 'aria-modal': 'true', 'aria-label': t(['試玩', 'Try it']) }, [
    h('header', { class: 'sc-player-head' }, [
      appImg(app.brand, 34),
      h('div', {}, [h('strong', { text: title }), h('small', { text: t(['真的 App，假的資料，什麼都不會存', 'The real app, made-up data, nothing kept']) })]),
      h('button', { class: 'sc-btn', type: 'button', 'aria-label': t(['重來', 'Restart']), onclick: () => load() }, [ico('refresh'), h('span', { class: 'sc-player-again', text: t(['重來', 'Restart']) })]),
      h('button', { class: 'sc-btn sc-icon', type: 'button', 'aria-label': t(['關閉', 'Close']), onclick: close }, [ico('x')])
    ]),
    h('div', { class: 'sc-player-body' }, [stage, tour.length ? card : h('div', { class: 'sc-player-card' }, [h('p', { class: 'sc-player-say', text: t(['自由點點看：每個分頁、每個按鈕都是真的 App。', 'Tap around: every tab and button is the real app.']) })])])
  ]);

  // The app at a phone's size, scaled to the room there is.
  function fit() {
    if (!frame) return;
    // less the phone's 6 px rim on each side
    const room = stage.getBoundingClientRect();
    const k = Math.min((room.width - 12) / W, (room.height - 12) / H, 1.15);
    screen.style.width = `${W * k}px`;
    screen.style.height = `${H * k}px`;
    frame.style.transform = `scale(${k})`;
  }

  function load() {
    unhook?.();
    frame = h('iframe', { class: 'sc-player-frame', src, title, width: String(W), height: String(H), loading: 'eager' });
    screen.replaceChildren(frame);
    fit();
    frame.addEventListener('load', () => {
      const doc = frame.contentDocument;
      if (!doc) return;
      // A tap on the step's target moves the tour on.
      const onTap = e => {
        const s = tour[at];
        if (s?.tap && e.target.closest?.(s.tap)) setTimeout(() => step(at + 1), s.after || 700);
      };
      doc.addEventListener('click', onTap, true);
      unhook = () => doc.removeEventListener('click', onTap, true);
      ring = null;
      step(tour.length ? 0 : -1);
    });
  }

  // The ring around the step's target, inside the app, kept on it while it moves.
  function track() {
    cancelAnimationFrame(watch);
    const s = tour[at];
    const doc = frame?.contentDocument;
    if (!doc || !s?.tap) return ring && (ring.hidden = true);
    if (!ring || !ring.isConnected) {
      ring = doc.createElement('div');
      ring.setAttribute('style', 'position:fixed;z-index:2147483647;pointer-events:none;border-radius:16px;box-shadow:0 0 0 3px #5e5ce6,0 0 0 9px rgba(94,92,230,.28);transition:width .25s ease,height .25s ease;');
      ring.animate?.([{ opacity: 1 }, { opacity: 0.45 }, { opacity: 1 }], { duration: 1400, iterations: Infinity });
      doc.body.append(ring);
    }
    const loop = () => {
      const el = [...doc.querySelectorAll(s.tap)].find(x => x.getClientRects().length);
      if (el) {
        // A sheet sits in the top layer, over anything in the page: the ring goes in with it.
        const home = el.closest('dialog[open], [popover]') || doc.body;
        if (ring.parentNode !== home) home.append(ring);
        const r = el.getBoundingClientRect();
        // Where the ring lands depends on what holds it (a sliding sheet moves
        // its own origin): measured, then put right on the target.
        ring.hidden = false;
        const o = ring.getBoundingClientRect();
        const x = parseFloat(ring.style.left) || 0;
        const y = parseFloat(ring.style.top) || 0;
        Object.assign(ring.style, { left: `${x + r.left - 4 - o.left}px`, top: `${y + r.top - 4 - o.top}px`, width: `${r.width + 8}px`, height: `${r.height + 8}px` });
        if (r.bottom < 0 || r.top > frame.contentWindow.innerHeight) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } else ring.hidden = true;
      watch = requestAnimationFrame(loop);
    };
    loop();
  }

  function step(i) {
    at = Math.max(-1, Math.min(i, tour.length));
    back.disabled = at <= 0;
    if (at >= tour.length || at < 0) {
      n.textContent = tour.length ? t(['導覽結束', 'Tour done']) : '';
      say.textContent = t(['接下來自由點點看：每個分頁、每個按鈕都是真的 App。按「重來」可以從頭開始。', 'Now tap around freely: every tab and button is the real app. Restart begins again.']);
      next.replaceChildren(t(['再看一次導覽', 'Tour again']));
      next.onclick = () => load();
      cancelAnimationFrame(watch);
      if (ring) ring.hidden = true;
      return;
    }
    const s = tour[at];
    n.textContent = t([`第 ${at + 1} 步，共 ${tour.length} 步`, `Step ${at + 1} of ${tour.length}`]);
    say.textContent = t(s.say);
    next.replaceChildren(t(s.tap ? ['跳過', 'Skip'] : ['下一步', 'Next']), ico('chevron'));
    next.onclick = () => step(at + 1);
    track();
  }

  document.body.append(box);
  document.documentElement.classList.add('sc-playing');
  requestAnimationFrame(() => box.classList.add('in'));
  const sized = new ResizeObserver(fit);
  sized.observe(stage);
  addEventListener('keydown', key);
  load();
  open = { close };
}
