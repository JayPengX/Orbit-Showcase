// The showcase's one page, for a busy reader who knows nothing about code
// (a professor with minutes; Jay 2026-11-18: the redo the showcase report
// planned), read top to bottom, each part one point and one thing to do:
//   #home    the claim: ten apps a student made with an AI, every decision
//            proven; its numbers from git; the ten apps' screens in turn
//   #apps    the ten apps as equals: each one's question and its special part; 試玩 runs the real app
//   #decide  how Jay decides: four decisions, each question → what he tried →
//            the evidence → the call; the data lock done for real in the page
//   #proof   it got better: before → after, measured; the trip-planning wait felt
//   #made    how it grew: from the first update to today (from git), the
//            mistakes that became rules, who does what; then the system and 問 Orbit
// Each app's page and the whole system are one tap deeper; every figure is
// one the code, its history or a tree card states (none made up).
import { moreToggle } from '#kit/ui.mjs';
import { h, t, ico, appImg, num, shotUrl, appTitle, daysBetween, twToday, fmtDay, fmtDayYear, en, reduced } from '../shell.mjs';
import { APPS, phrases } from '../lib/apps.mjs';
import { hasDemo, openDemo } from './demo.mjs';
import { openCard } from './how.mjs';
import { SHOW } from '../lib/tree-show.mjs';
import { heatmap } from './numbers.mjs';
import { askOrbit } from './ask.mjs';

// The page's chapters, as the bar along the top (the side bar on a
// computer) names them. (The whole system closes 成長, inside it.)
// (short: the name on a phone under 360 wide, where four English names don't fit one row)
export const CHAPTERS = [
  { id: 'apps', icon: 'grid', label: ['App', 'Apps'] },
  { id: 'decide', icon: 'target', label: ['決定', 'Decisions'], short: ['決定', 'Calls'] },
  { id: 'proof', icon: 'chart', label: ['成果', 'Results'] },
  { id: 'made', icon: 'pencil', label: ['成長', 'How it grew'], short: ['成長', 'Growth'] }
];

const appName = a => appTitle(a).replace(/^Orbit /, '');
const appOf = id => APPS.find(a => a.id === id);
export const tryApp = a => openDemo(a, appTitle(a));

// A chapter's head: its title and one plain line under it.
// (A title breaks only between its |-marked phrases, as the headline does: at 320 「十個 App，各 / 回答一個問題」 split mid-phrase.)
const head = (title, sub) => h('header', { class: 'sc-sechead' }, [h('h2', {}, [line(title)]), sub ? h('p', { text: t(sub) }) : null]);

// A headline line; in Chinese it breaks only between its phrases (| marks
// them; '| ' keeps a space there).
const line = pair => {
  const s = t(pair);
  if (!s.includes('|')) return h('span', {}, [s]);
  return h('span', {}, s.split('|').flatMap((p, i) => [i && p.startsWith(' ') ? ' ' : null, h('span', { class: 'sc-ph', text: p.trim() })]));
};
// A line that breaks only between its phrases: after its own commas and
// question marks, and at a | (「今晚有什麼|比賽值得看？」), never mid-word
// (「今晚有什 / 麼比賽」 at 320 in Safari) nor leaving a mark alone on a line
// (「，」 at 320, 11-17: keep-all made a long phrase break at its last character).
// (lib/apps.mjs phrases.)
const phrased = s => (en ? [s] : phrases(s).map(p => h('span', { class: 'sc-ph', text: p })));
// 「怎麼做到的 ›」 under a block that opens a tree card.
const howLink = id => h('button', { class: 'sc-howgo', type: 'button', onclick: () => openCard(id) }, [t(['怎麼做到的', 'How it works']), ico('chevron')]);

// A short checklist (a tree card's rules).
const rules = list => h('ul', { class: 'sc-dec-rules' }, list.map(r => h('li', {}, [ico('check'), h('span', { text: t(r) })])));

// ---- The top: the claim, in one look ----
// Three real screens fanned out, the middle one in front; every few seconds
// the next app's turn, so all ten get the first screen (only while the fan is
// on screen and the page is seen; held still for reduced motion).
let fanStop = () => {};
const screenOf = a => shotUrl(`${a.shots[0][0].split('/')[0]}/screen`, Boolean(a.zh));
function fan() {
  fanStop();
  const box = h('div', { class: 'sc-fan' });
  const slots = [0, 1, 2].map(i => {
    const img = h('img', { alt: '', width: 375, height: 812, decoding: 'async', fetchpriority: i === 1 ? 'high' : 'auto' });
    const a = h('a', { class: `sc-fan-p sc-fan-${i}` }, [img]);
    box.append(a);
    return { a, img };
  });
  let k = 0;
  const show = () =>
    slots.forEach(({ a, img }, i) => {
      const app = APPS[(k + i) % APPS.length];
      img.src = screenOf(app);
      a.href = `#apps/${app.id}`;
      a.setAttribute('aria-label', appTitle(app));
    });
  show();
  let timer = 0;
  let seen = false;
  const step = () => {
    k = (k + 1) % APPS.length;
    // (the next screen read before the swap, so the fan never shows a blank phone)
    const next = new Image();
    next.src = screenOf(APPS[(k + 2) % APPS.length]);
    box.classList.add('swap');
    setTimeout(() => {
      show();
      box.classList.remove('swap');
    }, 260);
  };
  const run = () => {
    clearInterval(timer);
    timer = 0;
    if (seen && !reduced() && document.visibilityState === 'visible') timer = setInterval(step, 3600);
  };
  const io = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([e]) => ((seen = e.isIntersecting), run())) : null;
  io?.observe(box);
  document.addEventListener('visibilitychange', run);
  fanStop = () => {
    clearInterval(timer);
    io?.disconnect();
    document.removeEventListener('visibilitychange', run);
  };
  return box;
}

function top(stats) {
  const days = stats ? daysBetween(stats.first, twToday(Date.parse(stats.at))) + 1 : null;
  const figs = stats
    ? [
        // (The apps are the list's, as the headline counts them: stats.json was 9 before News.)
        [Math.max(stats.apps, APPS.length), ['個 App', 'apps']],
        [days, ['天', 'days']],
        [stats.sources, ['個資料來源', 'data sources']],
        [stats.tests, ['個自動檢查', 'automatic checks']]
      ].filter(([v]) => v != null)
    : [];
  return h('section', { class: 'sc-intro', id: 'home' }, [
    h('div', { class: 'sc-intro-text' }, [
      h('p', { class: 'sc-kicker', text: t(['Orbit 作品展示', 'The Orbit project']) }),
      h('h1', { class: 'sc-headline' }, [line(['十個|每天在用的 App，', 'Ten apps used every day, ']), line(['一位高中生|帶著 AI| 做出來。', 'made by a high-school student directing an AI.'])]),
      h('p', { class: 'sc-claim' }, [line(['每個決定|都先量過，|改完再證明|它變好了。', 'Every decision measured, changed, and proven better.'])]),
      h('p', {
        class: 'sc-intro-lede',
        text: t([
          '給台灣生活用：運動、交通、天氣、課表、記帳、新聞、單字、音樂、法律和模擬投資，一個帳號全部串起來。Jay 決定做什麼、要做到多好，每天在自己的 iPhone 上試；寫程式的是 AI（Claude）。',
          'For daily life in Taiwan: sports, transit, weather, school, money, news, words, music, law and practice investing, one account across all of them. Jay decides what to build and how good it must be, and tries it on his own iPhone every day; an AI, Claude, writes the code.'
        ])
      }),
      figs.length
        ? h(
            'div',
            { class: 'sc-figs', title: en ? `Counted from git every day; on GitHub since ${fmtDayYear(stats.first)}` : `每天從 git 重數；${fmtDayYear(stats.first)} 上 GitHub` },
            figs.map(([v, label]) => h('div', { class: 'sc-fig' }, [h('strong', { text: num(v) }), h('span', { text: t(label) })]))
          )
        : null,
      h('div', { class: 'sc-intro-go' }, [
        h('a', { class: 'sc-cta', href: '#apps', 'data-jump': 'apps' }, [ico('play'), t(['試玩一個 App', 'Try an app'])]),
        h('span', { class: 'sc-hint', text: t(['或往下滑，五分鐘看完', 'or scroll on: five minutes, all of it']) })
      ])
    ]),
    fan()
  ]);
}

// ---- 1. The ten apps, as equals: each one's question and its special part ----
// The part is one the app's tree card states (lib/tree-apps.mjs, tree-show.mjs).
const BEST = {
  sports: ['每一種中斷都有倒數：中場、暫停、局間。', 'A countdown for every break: half-time, timeouts, innings.'],
  transit: ['走路趕不上公車，就叫你騎 YouBike 到前面幾站追上。', 'Too late on foot? It has you ride a YouBike ahead to catch the bus.'],
  weather: ['用過去 68 個颱風，算出放颱風假的機率。', 'Learnt from 68 past typhoons: the chance of a typhoon day off.'],
  class: ['專心讀書時跟著一架天上真的飛機，降落就是時間到。', 'Study along with a real plane in the sky; it lands when time’s up.'],
  words: ['記憶模型算出你快忘記的時候，那時才考你。', 'A memory model asks each word just as you’re about to forget it.'],
  beats: ['每首歌都是當下新寫的，也是一關節奏遊戲。', 'Every song is freshly written, and a rhythm-game level too.'],
  law: ['從立法院到全台 204 個鄉鎮代表會，都查得到。', 'From the legislature down to all 204 township councils.'],
  securities: ['9 種商品，照真實報價和真的券商規則買賣。', '9 kinds of investment, at real prices by a real broker’s rules.'],
  money: ['一張照片就是一筆帳：收據、發票、截圖都讀得懂。', 'One photo is one entry: receipts, invoices, screenshots.'],
  news: ['118 家媒體，同一件事放一起，看各家怎麼報。', '118 outlets, each story grouped, every side shown.']
};

function apps() {
  return h('section', { class: 'sc-sec', id: 'apps' }, [
    head(['十個 App，|各有一個|別人沒有的地方', 'Ten apps, each with something no other has'], ['每一個都是真的 App，用真的資料；按「試玩」馬上用。', 'Each one is a real app on real data; “Try” runs it at once.']),
    h(
      'ul',
      { class: 'sc-applist' },
      APPS.map(a =>
        h('li', { class: 'sc-app', 'data-brand': a.brand }, [
          h('a', { class: 'sc-app-main', href: `#apps/${a.id}` }, [
            appImg(a.brand, 48),
            h('span', { class: 'sc-app-text' }, [
              h('small', {}, [appName(a), ico('chevron', 'sc-app-chev')]),
              h('strong', {}, phrased(t(a.q))),
              BEST[a.id] ? h('span', { class: 'sc-app-best', text: t(BEST[a.id]) }) : null
            ])
          ]),
          hasDemo(a.id)
            ? h('button', { class: 'sc-trypill', type: 'button', 'aria-label': `${t(['試玩', 'Try'])} ${appTitle(a)}`, onclick: () => tryApp(a) }, [
                ico('play'),
                h('span', { class: 'sc-trypill-t', text: t(['試玩', 'Try']) })
              ])
            : null
        ])
      )
    )
  ]);
}

// ---- 2. How Jay decides: four decisions, each in the same four steps ----
// The question, what he tried, what it showed, the call; each opens the tree
// card it comes from. (The two with a picture last: on a wide page each takes a
// whole row, its picture beside its steps.) Every word is that card's (lib/tree*.mjs, tree-show.mjs).
const DECISIONS = [
  {
    card: 'law-ai',
    icon: 'target',
    day: '2026-11-11',
    title: ['用盲測選 AI', 'A blind test picked the AI'],
    q: ['哪個 AI 最會回答法律問題？', 'Which AI answers legal questions best?'],
    tried: ['五個 AI 回答同樣十個真實的法律問題，名字全部遮起來。', 'Five AIs answered the same ten real legal questions, every name hidden.'],
    saw: ['Jay 一題一題比，不知道哪個答案是哪個 AI 寫的。', 'Jay compared them one by one, not knowing which AI wrote which.'],
    call: ['選出最好的一個來回答「問法律」，每個引用都再由程式查過。', 'The best one answers Ask the law, and code checks every citation it makes.']
  },
  {
    card: 'team-jay',
    icon: 'check',
    day: null,
    title: ['停下來，全部測一遍', 'Stop, and test everything'],
    q: ['截止前，該多加功能，還是求穩？', 'Before the deadline: more features, or steadier ones?'],
    tried: ['Jay 讓 4,018 個項目一項一項測過。', 'Jay had 4,018 items tested, one by one.'],
    saw: ['找出 419 個問題，全部修好。', '419 problems found, every one fixed.'],
    call: ['停止加新功能，把還不夠穩的整個拿掉。', 'No new features; whole ones not yet steady were taken out.']
  },
  {
    card: 'transit-calls',
    icon: 'bus',
    day: '2026-11-03',
    title: ['親自搭公車驗證', 'Rode the bus to check'],
    q: ['路線該照時刻表，還是照即時預估？', 'Plan by the timetable, or by the live estimate?'],
    tried: ['Jay 親自搭公車，把兩個時間跟真的公車比。', 'Jay rode the bus and held both times up against the real bus.'],
    saw: ['即時預估很準，紙本時刻表卻差很多。', 'The live estimate was right; the printed timetable was far off.'],
    call: ['照真實的通勤判斷，不照資料說的。', 'Real commutes decide, not what the data claims.'],
    art: () => rules(SHOW['transit-calls'].rules)
  },
  {
    card: 'pass-vault',
    icon: 'lock',
    day: '2026-11-15',
    title: ['連我們的資料庫都讀不到', 'Not even our database can read it'],
    q: ['誰應該讀得到你的帳本和課表？', 'Who should be able to read your books and timetable?'],
    tried: ['存在雲端的資料，管理的人、看得到資料庫或備份的人都讀得到。', 'Data kept in the cloud can be read by whoever runs it, or anyone who sees the database or a backup.'],
    saw: ['所以問題不在誰可信，而在雲端根本不該看得懂。', 'So the question isn’t who to trust: the cloud shouldn’t be able to read it at all.'],
    call: ['先在你的手機上鎖好才上傳；連 Jay 的管理頁也只看到一個鎖。', 'Locked on your phone before it leaves; even Jay’s admin page sees only a lock.'],
    art: () => lockDemo()
  }
];

const STEPS = [
  ['tried', ['試了什麼', 'Tried']],
  ['saw', ['看到什麼', 'Found']],
  ['call', ['決定', 'The call']]
];

function decision(d) {
  return h('article', { class: d.art ? 'sc-dec has-art' : 'sc-dec', 'data-card': d.card }, [
    h('header', { class: 'sc-dec-head' }, [h('span', { class: 'sc-dec-i' }, [ico(d.icon)]), h('h3', { text: t(d.title) }), d.day ? h('small', { text: fmtDay(d.day) }) : null]),
    h('p', { class: 'sc-dec-q', text: t(d.q) }),
    h(
      'ol',
      { class: 'sc-dec-steps' },
      STEPS.map(([k, label]) => h('li', { class: `sc-dec-${k}` }, [h('small', { text: t(label) }), h('span', { text: t(d[k]) })]))
    ),
    d.art ? d.art() : null,
    howLink(d.card)
  ]);
}

function decide() {
  return h('section', { class: 'sc-sec', id: 'decide' }, [
    head(['Jay 怎麼|做決定', 'How Jay decides'], ['Jay 不寫程式；他提問題、親自試、看證據，再做取捨。', 'Jay doesn’t write code: he asks the question, tries it himself, looks at the evidence, then makes the call.']),
    h('div', { class: 'sc-decs' }, DECISIONS.map(decision))
  ]);
}

// The data lock, done for real in this page: what you type is locked the way
// Orbit locks an account's data (a key made from a pass with PBKDF2-SHA256 at
// 600,000 rounds, then AES-256-GCM: kit vault.mjs), and the page shows what the
// cloud would keep. Here the pass is a sample one; nothing leaves the page.
const SAMPLE_PASS = 'orbit-showcase-sample';
async function lock(text) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', enc.encode(SAMPLE_PASS), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600_000 }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text)));
  return btoa(String.fromCharCode(...salt, ...iv, ...sealed));
}

function lockDemo() {
  if (!globalThis.crypto?.subtle) return null;
  const field = h('input', { class: 'q-field sc-lock-in', type: 'text', maxlength: 80, value: t(['午餐 NT$120，跟小明分', 'Lunch NT$120, split with Ming']), 'aria-label': t(['要上鎖的內容', 'What to lock']), autocomplete: 'off', enterkeyhint: 'done' });
  const out = h('code', { class: 'sc-lock-out', 'aria-live': 'polite' });
  const btn = h('button', { class: 'q-btn sc-lock-go', type: 'button' }, [ico('lock'), t(['鎖起來', 'Lock it'])]);
  let n = 0;
  const go = async () => {
    const mine = ++n;
    const text = field.value.trim();
    if (!text) return;
    btn.disabled = true;
    out.classList.add('busy');
    out.textContent = t(['做鑰匙中：600,000 次運算…', 'Making the key: 600,000 rounds…']);
    try {
      const sealed = await lock(text);
      if (mine === n) out.textContent = sealed;
    } catch {
      if (mine === n) out.textContent = t(['這個瀏覽器做不到，請換一個試試。', 'This browser can’t do it; try another.']);
    }
    if (mine === n) {
      out.classList.remove('busy');
      btn.disabled = false;
    }
  };
  btn.addEventListener('click', go);
  field.addEventListener('keydown', e => e.key === 'Enter' && (e.preventDefault(), go()));
  return h('div', { class: 'sc-lock' }, [
    h('p', { class: 'sc-lock-label', text: t(['自己試：打一句，看雲端存到的是什麼', 'Try it: type a line and see what the cloud would keep']) }),
    h('div', { class: 'sc-lock-row' }, [field, btn]),
    out,
    h('p', { class: 'sc-lock-note', text: t(['在這個頁面上用跟 Orbit 一樣的方法鎖住（範例通行碼），什麼都沒有送出。', 'Locked right here the way Orbit locks your data (a sample pass); nothing is sent.']) })
  ]);
}

// ---- 3. It got better: before → after, measured ----
// Each a number measured before and after the change, as its tree card
// states it (lib/tree-show.mjs); the ones Jay raised himself carry his day.
const SOLVED = [
  { card: 'transit-fast', app: 'transit', what: ['在台北規劃一趟路', 'Planning a trip in Taipei'], was: ['7–10 秒', '7–10 s'], now: ['1–2 秒', '1–2 s'] },
  { card: 'sports-push', app: 'sports', what: ['比賽結束到手機收到結果', 'Final whistle to the result on your phone'], was: ['15 分鐘以上', '15+ min'], now: ['約 2 分鐘', '~2 min'], jay: '2026-10-22' },
  { card: 'weather-blend', app: 'weather', what: ['6 小時以後的溫度預報，平均誤差', 'Temperature forecast 6+ hours ahead, average error'], was: '0.86°', now: '0.59°' },
  { card: 'cheap', app: null, what: ['主機和交通資料，每個月的費用', 'Hosting and transit data, a month'], was: ['約 NT$390', '~NT$390'], now: 'NT$0', jay: '2026-11-06' },
  { card: 'law-ai', app: 'law', what: ['問法律，等到回答開始出現', 'Ask the law: until the answer starts'], was: ['10–12 秒', '10–12 s'], now: ['3–4 秒', '3–4 s'], jay: '2026-10-30' },
  { card: 'fast-lift', app: 'weather', what: ['打開天氣，到看見預報', 'Opening Weather to the forecast'], was: ['1.6 秒', '1.6 s'], now: ['0.09 秒', '0.09 s'] },
  { card: 'fast', app: null, what: ['在慢網路上把九個 App 各用一輪', 'Nine apps used once each, on a slow network'], was: '24.8 MB', now: '15.2 MB', jay: '2026-11-05' }
];
// (The first is the race; four rows lead, two more behind 「更多」: even rows in two columns.)
const LEAD = 5;

const fix = s => {
  const a = s.app ? appOf(s.app) : null;
  return h('button', { class: 'sc-fix', type: 'button', onclick: () => openCard(s.card) }, [
    h('span', { class: 'sc-fix-what' }, [appImg(a?.brand || null, 24), h('span', { text: t(s.what) })]),
    h('span', { class: 'sc-fix-nums' }, [
      h('s', { class: 'sc-fix-was', text: t(s.was) }),
      h('span', { class: 'sc-fix-arrow', 'aria-label': t(['變成', 'to']) }, [ico('chevron')]),
      h('strong', { class: 'sc-fix-now', text: t(s.now) }),
      s.tail ? h('small', { class: 'sc-fix-tail', text: t(s.tail) }) : null
    ]),
    s.jay ? h('span', { class: 'sc-fix-jay' }, [ico('user'), t([`Jay 提出 · ${fmtDay(s.jay)}`, `Raised by Jay · ${fmtDay(s.jay)}`])]) : null
  ]);
};

// The trip-planning wait, felt: two bars filling side by side, each over its
// measured time (the middle of each range: 8.5 s before, 1.5 s now).
const RACE = [
  ['was', ['以前', 'Before'], 8.5, ['7–10 秒', '7–10 s']],
  ['now', ['現在', 'Now'], 1.5, ['1–2 秒', '1–2 s']]
];
function race() {
  const rows = RACE.map(([k, label, secs, said]) => {
    const bar = h('span', { class: 'sc-race-bar' }, [h('span', { class: 'sc-race-fill', style: `--s:${secs}s` })]);
    const end = h('span', { class: 'sc-race-end', text: t(said) });
    const row = h('div', { class: `sc-race-row ${k}` }, [h('span', { class: 'sc-race-label', text: t(label) }), bar, end]);
    return { row, secs };
  });
  const box = h('div', { class: 'sc-race' });
  let timers = [];
  const play = () => {
    timers.forEach(clearTimeout);
    box.classList.remove('go');
    rows.forEach(r => r.row.classList.remove('done'));
    void box.offsetWidth; // (back to empty before they fill again)
    box.classList.add('go');
    timers = rows.map(r => setTimeout(() => r.row.classList.add('done'), reduced() ? 0 : r.secs * 1000));
  };
  const btn = h('button', { class: 'q-btn sc-race-go', type: 'button', onclick: play }, [ico('play'), t(['感受一下等待', 'Feel the wait'])]);
  box.append(
    h('div', { class: 'sc-race-head' }, [h('span', {}, [appImg(appOf('transit').brand, 24), h('strong', { text: t(['在台北規劃一趟路', 'Planning a trip in Taipei']) })]), btn]),
    ...rows.map(r => r.row),
    h('p', { class: 'sc-race-note', text: t(['照量到的時間播放（取中間值）。', 'Played at the measured times (the middle of each range).']) }),
    howLink('transit-fast')
  );
  return box;
}

function proof() {
  const rest = h('div', { class: 'sc-solved', hidden: true }, SOLVED.slice(LEAD).map(fix));
  return h('section', { class: 'sc-sec', id: 'proof' }, [
    head(['真的變好了：|前後對比', 'It really got better: before and after'], ['每個數字都是改之前和改之後量的；有些是 Jay 自己在手機上發現的。點一列看怎麼做到。', 'Each number was measured before and after the change; some problems Jay found on his own phone. Tap a row to see how.']),
    race(),
    h('div', { class: 'sc-solved' }, SOLVED.slice(1, LEAD).map(fix)),
    rest,
    moreToggle({ more: t([`再看 ${SOLVED.length - LEAD} 個`, `${SOLVED.length - LEAD} more`]), less: t(['收起', 'Show less']), onToggle: open => (rest.hidden = !open) })
  ]);
}

// ---- 4. How it grew: from the first update to today ----
// The milestones, every date from git (each repo's first update, Claude's
// first) or a decision's own day; then the mistakes that became rules, and
// who does what.
function milestones(stats) {
  const byBrand = new Map(APPS.map(a => [a.brand, a]));
  const rows = [
    stats.firstClaude && [stats.firstClaude, null, ['Claude 開始寫程式', 'Claude starts writing the code'], 'spark'],
    ...(stats.repos || [])
      .filter(r => r.first && byBrand.has(r.app))
      .map(r => {
        const n = appName(byBrand.get(r.app));
        const its = n.endsWith('s') ? `${n}’` : `${n}’s`; // (Words’ first day, not Words’s)
        return [r.first, byBrand.get(r.app), r.first === stats.first ? [`Orbit 從 ${n} 開始`, `Orbit begins, with ${n}`] : [`${n} 的第一天`, `${its} first day`]];
      }),
    ...(stats.repos || []).filter(r => r.repo === 'Orbit-Core' && r.first).map(r => [r.first, null, ['十個 App 共用的零件庫', 'The parts all ten apps share'], 'grid']),
    ...DECISIONS.filter(d => d.day).map(d => [d.day, null, d.title, d.icon, true])
  ]
    .filter(Boolean)
    .sort((a, b) => a[0].localeCompare(b[0]));
  return h(
    'ol',
    { class: 'sc-tl' },
    rows.map(([day, app, say, icon, call]) =>
      h('li', { class: call ? 'sc-tl-call' : null }, [
        h('time', { datetime: day, text: fmtDay(day) }),
        h('span', { class: 'sc-tl-mark' }, [app ? appImg(app.brand, 22) : ico(icon)]),
        h('span', { class: 'sc-tl-say', text: t(say) })
      ])
    )
  );
}

// The mistakes that became rules (the tree's team-lessons, four of its eight).
const LESSONS = [
  [['一次從舊副本推上去，清空了 21,927 筆最高法院裁判', 'A push from an old copy wiped 21,927 top-court rulings'], ['每次推之前一定先同步最新版本', 'Always sync right before pushing']],
  [['只照手機做，平板和電腦上只剩中間一條窄窄的畫面', 'Made for phones only, a tablet showed a narrow strip'], ['每種螢幕都排好，上線前檢查', 'Every screen laid out, checked before each push']],
  [['讀取失敗被當成沒資料', 'A failed read was taken as no data'], ['失敗不是空的', 'A failure is never “nothing”']],
  [['一個共同的詞就把不相干的新聞湊在一起', 'One shared word lumped unrelated stories together'], ['至少兩個詞才算同一件事', 'Two words at least make one story']]
];
const lessons = () =>
  h(
    'ul',
    { class: 'sc-lessons' },
    LESSONS.map(([was, rule]) => h('li', {}, [h('span', { class: 'sc-lesson-was', text: t(was) }), h('span', { class: 'sc-lesson-rule' }, [ico('check'), h('strong', { text: t(rule) })])]))
  );

function role(who, mark, does, fig) {
  return h('div', { class: `sc-role sc-role-${who.toLowerCase()}` }, [
    h('div', { class: 'sc-role-head' }, [mark, h('span', {}, [h('strong', { text: who }), h('small', { text: t(who === 'Jay' ? ['決定、把關', 'Decides, checks'] : ['動手做', 'Builds']) })])]),
    fig ? h('p', { class: 'sc-role-fig' }, [h('strong', { text: num(fig[0]) }), h('span', { text: t(fig[1]) })]) : null,
    h(
      'ul',
      { class: 'sc-role-does' },
      does.map(d => h('li', {}, [ico('check'), h('span', { text: t(d) })]))
    )
  ]);
}

// The way into the whole system and 問 Orbit, where the page ends.
function system() {
  const cloud = SHOW.cloud?.flow || [];
  return h('div', { class: 'sc-system', id: 'system' }, [
    h('h3', { class: 'sc-subhead', text: t(['想看更深？', 'Want to go deeper?']) }),
    h('a', { class: 'sc-journey', href: '#how/map' }, [
      h('span', { class: 'sc-journey-t' }, [h('strong', { text: t(['按一下，背後發生什麼事', 'What happens behind one tap']) }), h('small', { text: t(['整個系統，一步一步走過：打開 Orbit、每個 App 各一個例子', 'The whole system step by step: opening Orbit, and a story for every app']) })]),
      h(
        'span',
        { class: 'sc-journey-flow', 'aria-hidden': 'true' },
        cloud.flatMap(([icon], i) => [i ? h('span', { class: 'sc-journey-arrow' }) : null, h('span', { class: 'sc-journey-i' }, [ico(icon)])])
      ),
      ico('chevron', 'sc-journey-chev')
    ]),
    askOrbit()
  ]);
}

function made(stats) {
  return h('section', { class: 'sc-sec', id: 'made' }, [
    head(['從第一天|到今天', 'From day one to today'], ['每個日期都從 git 讀出來；每次犯錯，都變成一條所有 App 一起守的規則。', 'Every date is read from git; every mistake became a rule all ten apps keep.']),
    stats?.repos ? milestones(stats) : null,
    h('h3', { class: 'sc-subhead', text: t(['犯過的錯，變成規則', 'Mistakes that became rules']) }),
    lessons(),
    stats?.rules ? h('p', { class: 'sc-lessons-sum' }, [h('strong', { text: num(stats.rules) }), h('span', { text: t(['條 Jay 定下、寫下來的規則，每一條都有日期', 'rules Jay has set and written down, each one dated']) })]) : null,
    h('h3', { class: 'sc-subhead', text: t(['誰做什麼', 'Who does what']) }),
    h('div', { class: 'sc-roles' }, [
      role(
        'Jay',
        h('span', { class: 'sc-role-mark jay' }, [ico('user')]),
        [
          ['決定要做什麼', 'Decides what to build'],
          ['定標準、做取捨', 'Sets the bar, makes the calls'],
          ['每天在 iPhone 上試、挑毛病', 'Tries it on his iPhone daily, finds faults']
        ],
        stats?.tests ? [stats.tests, ['個自動檢查，守住他的標準', 'automatic checks hold his bar']] : null
      ),
      role(
        'Claude',
        h('span', { class: 'sc-role-mark claude' }, [ico('spark')]),
        [
          ['寫程式', 'Writes the code'],
          ['測試，看截圖自己檢查', 'Tests it, checks the screens'],
          ['推上去，自動上線', 'Pushes it live']
        ],
        stats?.claude ? [stats.claude, [`次更新是它寫的（共 ${num(stats.commits)} 次）`, `of the ${num(stats.commits)} updates are its work`]] : null
      )
    ]),
    stats?.days ? h('div', { class: 'sc-made-nums', id: 'numbers' }, [heatmap(stats)]) : null,
    system()
  ]);
}

function foot() {
  return h('footer', { class: 'sc-foot' }, [
    h('p', {}, [appImg(null, 24), h('span', { text: t(['Orbit，Jay 和 Claude 一起做。', 'Orbit, made by Jay with Claude.']) })]),
    h('p', {
      class: 'sc-foot-small',
      text: t([
        '截圖和試玩用的是範例資料或公開資料，不是任何人真正的資料。數字每天從程式碼自動重數；前後對比是改之前和改之後量的。',
        'Screens and demos use sample or public data, never anyone’s own. The numbers are recounted from the code every day; each before and after was measured around its change.'
      ])
    })
  ]);
}

export function renderMain(box, stats) {
  box.replaceChildren(top(stats), apps(), decide(), proof(), made(stats), foot());
}
