// The demo player: an app running for real (its frozen copy in demo/, with
// made-up or recorded data and nothing live) and its guided tour.
// On a phone the app fills the screen as itself, under a slim, quiet bar
// (close, the app's name, start over), and the tour is a small coach mark:
// a bubble that points at what to tap, in the app's own colour, gone the
// moment it's tapped. 略過 ends it; the app can be tapped freely at any time.
// On a computer the app sits in a phone frame with the tour beside it.
// The browser's back closes the demo once the app has nothing left to go
// back to.
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
  let accent = '';
  let fade = 0;

  const stage = h('div', { class: 'sc-player-stage' });
  const screen = h('div', { class: 'sc-player-screen' });
  if (full) stage.append(screen);
  else stage.append(h('div', { class: 'sc-player-phone' }, [screen]));

  // A phone: the coach mark. A computer: the card beside the phone.
  const say = h('p', { class: full ? 'sc-coach-say' : 'sc-player-say', 'aria-live': 'polite' });
  const n = h('span', { class: full ? 'sc-coach-n' : 'sc-player-n' });
  const skip = h('button', { class: 'sc-coach-skip', type: 'button', onclick: () => finish() }, [t(['略過', 'Skip'])]);
  const next = h('button', { class: full ? 'sc-coach-next' : 'sc-btn sc-btn-main', type: 'button' }); // (its onclick is set by each step)
  const back = h('button', { class: 'sc-btn sc-icon sc-player-back', type: 'button', 'aria-label': t(['上一步', 'Back']), onclick: () => step(at - 1) }, [ico('chevron')]);
  // (each holds the same pieces, so only the one in use is made)
  const coach = full ? h('div', { class: 'sc-coach', hidden: true }, [say, h('div', { class: 'sc-coach-foot' }, [n, h('span', { class: 'sc-coach-acts' }, [skip, next])]), h('span', { class: 'sc-coach-tip', 'aria-hidden': 'true' })]) : h('div', { hidden: true });
  const card = full ? null : h('div', { class: 'sc-player-card' }, [n, say, h('div', { class: 'sc-player-btns' }, [back, next])]);

  const close = () => {
    cancelAnimationFrame(watch);
    clearTimeout(fade);
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
  const label = t(demo.real ? ['試玩 · 錄下那一刻的真實資料', 'Demo · real data, as recorded'] : ['試玩 · 範例資料，什麼都不會存', 'Demo · sample data, nothing kept']);
  const head = full
    ? h('header', { class: 'sc-player-head slim' }, [
        h('button', { class: 'sc-player-x', type: 'button', 'aria-label': t(['結束試玩', 'Close the demo']), onclick: close }, [ico('x')]),
        h('div', { class: 'sc-player-name' }, [h('strong', { text: title }), h('small', { text: label })]),
        h('button', { class: 'sc-player-x', type: 'button', 'aria-label': t(['從頭開始', 'Start over']), onclick: () => load() }, [ico('history')])
      ])
    : h('header', { class: 'sc-player-head' }, [
        appImg(app.brand, 34),
        h('div', {}, [h('strong', { text: title }), h('small', { text: label })]),
        h('button', { class: 'sc-btn', type: 'button', 'aria-label': t(['重來', 'Restart']), onclick: () => load() }, [ico('history'), h('span', { class: 'sc-player-again', text: t(['重來', 'Restart']) })]),
        h('button', { class: 'sc-btn sc-icon', type: 'button', 'aria-label': t(['關閉', 'Close']), onclick: close }, [ico('x')])
      ]);
  const freeCard = h('div', { class: 'sc-player-card' }, [h('p', { class: 'sc-player-say', text: t(['自由點點看：每個分頁、每個按鈕都是真的 App。', 'Tap around: every tab and button is the real app.']) })]);
  const box = h('div', { class: `sc-player${full ? ' full' : ''}`, role: 'dialog', 'aria-modal': 'true', 'aria-label': t(['試玩', 'Try it']) }, [
    head,
    h('div', { class: 'sc-player-body' }, full ? [stage] : [stage, tour.length ? card : freeCard])
  ]);
  if (full) stage.append(coach);

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
    clearTimeout(fade);
    coach.hidden = true;
    frame = h('iframe', { class: 'sc-player-frame', src, title, width: String(W), height: String(H), loading: 'eager' });
    screen.replaceChildren(frame);
    fit();
    frame.addEventListener('load', () => {
      const doc = frame.contentDocument;
      if (!doc) return;
      // A tap on the step's target moves the tour on.
      const onTap = e => {
        const s = tour[at];
        if (s?.tap && e.target.closest?.(s.tap)) {
          coach.hidden = true;
          if (ring) ring.hidden = true;
          cancelAnimationFrame(watch);
          setTimeout(() => step(at + 1), s.after || 700);
        }
      };
      doc.addEventListener('click', onTap, true);
      unhook = () => doc.removeEventListener('click', onTap, true);
      ring = null;
      // the app's own colour, once its page has its styles
      setTimeout(() => {
        accent = getComputedStyle(doc.body).getPropertyValue('--q-accent').trim() || getComputedStyle(doc.documentElement).getPropertyValue('--q-accent').trim();
        if (accent) box.style.setProperty('--app', accent);
        step(tour.length ? 0 : -1);
      }, 400);
    });
  }

  // The bubble beside the target, its tip pointing at it; above the target
  // when it's low on the screen, below when it's high; no target, it sits low.
  function place(r) {
    if (!full) return;
    const room = stage.getBoundingClientRect();
    const bw = coach.offsetWidth;
    const bh = coach.offsetHeight;
    const gap = 14;
    if (!r) {
      coach.classList.remove('up', 'down');
      Object.assign(coach.style, { left: `${(room.width - bw) / 2}px`, top: `${room.height - bh - 96}px` });
      return;
    }
    const cx = r.left + r.width / 2;
    const above = r.top + r.height / 2 > room.height / 2;
    let top = above ? r.top - 4 - gap - bh : r.bottom + 4 + gap;
    top = Math.max(8, Math.min(room.height - bh - 8, top));
    const left = Math.max(12, Math.min(room.width - bw - 12, cx - bw / 2));
    coach.classList.toggle('up', above);
    coach.classList.toggle('down', !above);
    Object.assign(coach.style, { left: `${left}px`, top: `${top}px` });
    coach.style.setProperty('--tip', `${Math.max(18, Math.min(bw - 18, cx - left))}px`);
  }

  // The ring around the step's target, inside the app, kept on it while it moves.
  function track() {
    cancelAnimationFrame(watch);
    const s = tour[at];
    const doc = frame?.contentDocument;
    if (!doc) return;
    if (!s?.tap) {
      if (ring) ring.hidden = true;
      return place(null);
    }
    const c = accent || '#5e5ce6';
    if (!ring || !ring.isConnected) {
      ring = doc.createElement('div');
      ring.className = 'sc-demo-ring';
      ring.setAttribute('style', `position:fixed;z-index:2147483647;pointer-events:none;border-radius:14px;box-shadow:0 0 0 2.5px ${c},0 0 0 8px color-mix(in srgb, ${c} 22%, transparent);transition:width .25s ease,height .25s ease;`);
      ring.animate?.([{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }], { duration: 1600, iterations: Infinity });
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
        if (full) {
          coach.hidden = false;
          place(r);
        }
      } else {
        ring.hidden = true;
        if (full) coach.hidden = true;
      }
      watch = requestAnimationFrame(loop);
    };
    loop();
  }

  // The tour's end: a phone says so for a moment and gets out of the way.
  function finish() {
    at = tour.length;
    cancelAnimationFrame(watch);
    if (ring) ring.hidden = true;
    if (!full) return step(tour.length);
    say.textContent = t(['好了，自由點點看。', 'That’s it. Tap around.']);
    n.textContent = '';
    skip.hidden = true;
    next.hidden = true;
    coach.hidden = false;
    coach.classList.add('done');
    place(null);
    clearTimeout(fade);
    fade = setTimeout(() => (coach.hidden = true), 2200);
  }

  function step(i) {
    at = Math.max(-1, Math.min(i, tour.length));
    back.disabled = at <= 0;
    coach.classList.remove('done');
    if (at >= tour.length || at < 0) {
      if (full) return tour.length && at >= 0 ? finish() : (coach.hidden = true);
      n.textContent = tour.length ? t(['導覽結束', 'Tour done']) : '';
      say.textContent = t(['接下來自由點點看：每個分頁、每個按鈕都是真的 App。', 'Now tap around freely: every tab and button is the real app.']);
      next.replaceChildren(t(['再看一次導覽', 'Tour again']));
      next.onclick = () => load();
      cancelAnimationFrame(watch);
      if (ring) ring.hidden = true;
      return;
    }
    const s = tour[at];
    n.textContent = full ? `${at + 1}/${tour.length}` : t([`第 ${at + 1} 步，共 ${tour.length} 步`, `Step ${at + 1} of ${tour.length}`]);
    say.textContent = t(s.say);
    skip.hidden = false;
    if (full) {
      // a step with something to tap moves on by that tap; one without, by 下一步
      next.hidden = Boolean(s.tap);
      next.replaceChildren(t(['下一步', 'Next']));
      coach.hidden = Boolean(s.tap);
    } else next.replaceChildren(t(s.tap ? ['跳過', 'Skip'] : ['下一步', 'Next']), ico('chevron'));
    next.onclick = () => step(at + 1);
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
