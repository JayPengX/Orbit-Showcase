// The demo player: an app running for real (its frozen copy in demo/, with
// made-up or recorded data and nothing live) and its guided tour.
// On a phone the app fills the screen as itself, under a slim bar (離開, 重來,
// 導覽), and the tour is a small card that keeps out of the way of what it
// points at; it can be skipped or hidden, and the app can be tapped freely
// at any time. On a computer the app sits in a phone frame with the tour
// beside it. A step rings what to tap inside the app and moves on when it's
// tapped (or with 下一步). The browser's back closes the demo once the app
// has nothing left to go back to.
import { h, t, ico, appImg, en, reduced, wide } from '../shell.mjs';
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
  const full = !wide();
  let frame = null;
  let at = -1;
  let ring = null;
  let watch = 0;
  let unhook = null;
  let hidden = false;

  const stage = h('div', { class: 'sc-player-stage' });
  const screen = h('div', { class: 'sc-player-screen' });
  if (full) stage.append(screen);
  else stage.append(h('div', { class: 'sc-player-phone' }, [screen]));
  const n = h('span', { class: 'sc-player-n' });
  const say = h('p', { class: 'sc-player-say', 'aria-live': 'polite' });
  const back = h('button', { class: 'sc-btn sc-icon sc-player-back', type: 'button', 'aria-label': t(['上一步', 'Back']), onclick: () => step(at - 1) }, [ico('chevron')]);
  const next = h('button', { class: 'sc-btn sc-btn-main', type: 'button' }); // (its onclick is set by each step)
  const skip = h('button', { class: 'sc-btn sc-player-skip', type: 'button', onclick: () => step(tour.length) }, [t(['跳過導覽', 'Skip the tour'])]);
  const hide = h('button', { class: 'sc-player-hide', type: 'button', 'aria-label': t(['收起導覽', 'Hide the tour']), onclick: () => show(false) }, [ico('x')]);
  const card = h('div', { class: 'sc-player-card' }, [
    h('div', { class: 'sc-player-top' }, [n, full ? hide : null]),
    say,
    h('div', { class: 'sc-player-btns' }, [full ? skip : back, next])
  ]);
  const tourBtn = h('button', { class: 'sc-btn sc-player-tour', type: 'button', 'aria-label': t(['導覽', 'Tour']), onclick: () => (at >= tour.length || at < 0 ? load() : show(true)) }, [ico('spark'), h('span', { text: t(['導覽', 'Tour']) })]);

  const close = () => {
    cancelAnimationFrame(watch);
    unhook?.();
    box.classList.remove('in');
    document.documentElement.classList.remove('sc-playing');
    setTimeout(() => box.remove(), reduced() ? 0 : 220);
    sized.disconnect();
    removeEventListener('keydown', key);
    removeEventListener('popstate', popped);
    // the entry the demo added stays as an ordinary one: back from here is a no-op
    if (history.state?.scDemo) history.replaceState(null, '', location.href);
    open = null;
  };
  const key = e => e.key === 'Escape' && close();
  // The phone's back gesture: the app goes back inside itself first; once
  // there is nothing left, back leaves the demo.
  const popped = () => open && close();
  const restart = h('button', { class: 'sc-btn', type: 'button', 'aria-label': t(['重來', 'Restart']), onclick: () => load() }, [ico('history'), h('span', { class: 'sc-player-again', text: t(['重來', 'Restart']) })]);
  const leave = h('button', { class: 'sc-btn sc-player-leave', type: 'button', onclick: close }, [ico('x'), h('span', { text: t(['離開', 'Exit']) })]);
  const head = full
    ? h('header', { class: 'sc-player-head slim' }, [leave, h('div', {}, [h('strong', { text: title }), h('small', { text: t(demo.real ? ['試玩：錄下那一刻的真實資料', 'Demo: real data, as recorded'] : ['試玩：假的資料，什麼都不會存', 'Demo: made-up data, nothing kept']) })]), restart, tour.length ? tourBtn : null])
    : h('header', { class: 'sc-player-head' }, [
        appImg(app.brand, 34),
        h('div', {}, [h('strong', { text: title }), h('small', { text: t(demo.real ? ['真的 App，錄下那一刻的真實資料', 'The real app, real data from when it was recorded'] : ['真的 App，假的資料，什麼都不會存', 'The real app, made-up data, nothing kept']) })]),
        restart,
        h('button', { class: 'sc-btn sc-icon', type: 'button', 'aria-label': t(['關閉', 'Close']), onclick: close }, [ico('x')])
      ]);
  const freeCard = h('div', { class: 'sc-player-card' }, [h('p', { class: 'sc-player-say', text: t(['自由點點看：每個分頁、每個按鈕都是真的 App。', 'Tap around: every tab and button is the real app.']) })]);
  const box = h('div', { class: `sc-player${full ? ' full' : ''}`, role: 'dialog', 'aria-modal': 'true', 'aria-label': t(['試玩', 'Try it']) }, [
    head,
    h('div', { class: 'sc-player-body' }, full ? [stage] : [stage, tour.length ? card : freeCard])
  ]);
  if (full && tour.length) stage.append(card);

  // A computer: the app at a phone's size, scaled to the room there is.
  // A phone: the app at the screen's own size.
  function fit() {
    if (!frame) return;
    const room = stage.getBoundingClientRect();
    if (full) {
      Object.assign(screen.style, { width: `${room.width}px`, height: `${room.height}px` });
      Object.assign(frame.style, { width: `${room.width}px`, height: `${room.height}px`, transform: 'none' });
      return;
    }
    // less the phone's 6 px rim on each side
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
      show(true);
      step(tour.length ? 0 : -1);
    });
  }

  function show(on) {
    hidden = !on;
    card.hidden = full && hidden;
    tourBtn.classList.toggle('on', !hidden && at >= 0 && at < tour.length);
    if (hidden && ring) ring.hidden = true;
    if (!hidden) track();
  }

  // On a phone the card sits at the top or the bottom, away from the target.
  function place(r) {
    if (!full) return;
    const room = stage.getBoundingClientRect();
    const low = !r || r.top + r.height / 2 > room.height / 2;
    card.classList.toggle('up', Boolean(r) && low);
  }

  // The ring around the step's target, inside the app, kept on it while it moves.
  function track() {
    cancelAnimationFrame(watch);
    const s = tour[at];
    const doc = frame?.contentDocument;
    if (!doc || !s?.tap || hidden) {
      place(null);
      return ring && (ring.hidden = true);
    }
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
        place(r);
      } else {
        ring.hidden = true;
        place(null);
      }
      watch = requestAnimationFrame(loop);
    };
    loop();
  }

  function step(i) {
    at = Math.max(-1, Math.min(i, tour.length));
    back.disabled = at <= 0;
    if (at >= tour.length || at < 0) {
      n.textContent = tour.length ? t(['導覽結束', 'Tour done']) : '';
      say.textContent = t(['接下來自由點點看：每個分頁、每個按鈕都是真的 App。', 'Now tap around freely: every tab and button is the real app.']);
      next.replaceChildren(full ? t(['好', 'OK']) : t(['再看一次導覽', 'Tour again']));
      next.onclick = () => (full ? show(false) : load());
      skip.hidden = true;
      cancelAnimationFrame(watch);
      if (ring) ring.hidden = true;
      place(null);
      tourBtn.classList.remove('on');
      return;
    }
    const s = tour[at];
    skip.hidden = false;
    n.textContent = t([`導覽 ${at + 1} / ${tour.length}`, `Tour ${at + 1} / ${tour.length}`]);
    say.textContent = t(s.say);
    next.replaceChildren(t(s.tap ? ['跳過這步', 'Skip step'] : ['下一步', 'Next']), ico('chevron'));
    next.onclick = () => step(at + 1);
    tourBtn.classList.toggle('on', !hidden);
    track();
  }

  document.body.append(box);
  document.documentElement.classList.add('sc-playing');
  requestAnimationFrame(() => box.classList.add('in'));
  const sized = new ResizeObserver(fit);
  sized.observe(stage);
  addEventListener('keydown', key);
  history.pushState({ scDemo: true }, '', location.href);
  addEventListener('popstate', popped);
  load();
  open = { close };
}
