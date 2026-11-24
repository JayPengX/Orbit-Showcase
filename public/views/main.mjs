// The showcase's one page, for a busy reader who knows nothing about code
// (a professor with minutes; Jay 2026-11-18: the redo the showcase report
// planned), read top to bottom, each part one point and one thing to do:
//   #home    the claim: ten apps a student made with an AI, every decision
//            proven; its numbers from git; the ten apps' screens in turn
//   #apps    the ten apps as equals: each one's question and its special part; 試玩 runs the real app
//   #decide  Jay at the helm: the team he runs, eight areas he decides (his words →
//            what they became; the data lock done for real), the tools he made beyond Orbit
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

// ---- 2. Jay at the helm: what he decides, across the whole project ----
// Jay 11-24: the old four narrow decisions "make me feel useless". Now: the team
// he runs (one coordinator, a dozen AI threads), then eight areas he owns, each
// his own words (docs/RULEBOOK.md; in Chinese, translated) and what they became
// (a tree card's facts, lib/tree*.mjs, tree-show.mjs); then the tools he made
// outside Orbit, every fact from that tool's own repo.
const CALLS = [
  {
    area: ['產品', 'Product'],
    icon: 'grid',
    card: 'team-jay',
    title: ['每個 App 要什麼，他定', 'He defines every product'],
    said: ['「一個 App 的連結也要在 Orbit 裡打開那個 App，不要再有單獨的 App。」', '“The link of an individual app should still open that app in Orbit… make standalone app no more.”'],
    became: ['十個 App 收進一個 Orbit 圖示：切換不重新載入，路上的公車行程一直都在。', 'Ten apps in one Orbit icon: switching never reloads, and a bus trip under way stays with you.'],
    art: () => rules(SHOW['team-jay'].rules)
  },
  {
    area: ['品質', 'Quality'],
    icon: 'check',
    card: 'team-jay',
    title: ['穩定，靠刪減不靠加', 'Steady by cutting, not adding'],
    said: ['截止前不再加功能，先把現有的做穩。', 'Before the deadline, no more features: make what’s there steady.'],
    became: ['4,018 個項目一項一項測過，找出 419 個問題全部修好；還不夠穩的功能整個拿掉。', '4,018 items tested one by one, 419 problems found and all fixed; features not yet steady were taken out whole.']
  },
  {
    area: ['證據', 'Evidence'],
    icon: 'target',
    card: 'law-ai',
    title: ['先證明，再決定', 'Proof first, then the call'],
    said: ['不信直覺，也不信資料說的：自己去試。', 'Not a hunch, not what the data claims: he tries it himself.'],
    became: ['五個 AI 遮住名字盲測十個法律問題，選出最好的；親自搭公車，發現即時預估準、紙本時刻表差很多，路線就照即時的排。', 'Five AIs, names hidden, blind-tested on ten legal questions; he rode the bus, found the live estimate right and the timetable far off, so trips follow the live one.']
  },
  {
    area: ['錢', 'Cost'],
    icon: 'coin',
    card: 'cheap',
    title: ['用多少，花多少', 'Spend only what’s used'],
    said: ['「只在我用的時候花，但要夠快。」', '“Only spend it as I use it but kept fast enough.”'],
    became: ['雲端從每月約 NT$390 降到 NT$0，只付網域；AI 只在你按了才做，沒人看的不花錢。', 'The cloud went from ~NT$390 a month to NT$0, the domain aside; AI runs only when you tap, so nothing is spent on what nobody opens.']
  },
  {
    area: ['誠實', 'Honesty'],
    icon: 'shield',
    card: 'ai',
    title: ['寧可不給，也不給錯的', 'Nothing, rather than wrong'],
    said: ['數字要對，不然就別出現。', 'A number is right, or it isn’t shown.'],
    became: ['AI 算的每個數字程式再算一次，對不上就不給；記帳從不自己生出帳目；新聞的預測市場比對 5 筆錯 1 筆，就整個拿掉。', 'Code works out every number AI gives again and drops it if it doesn’t match; Money never invents an entry; News’ prediction markets matched about 1 in 5 wrong, so they went.']
  },
  {
    area: ['體驗', 'Feel'],
    icon: 'phone',
    card: null,
    title: ['好用到感覺不到', 'So easy you don’t notice'],
    said: ['「說明太多了，一句話就夠，或者一句都不用。」', '“It explains it too much, when all it needs is one sentence or none.”'],
    became: ['說明減到一句話或不寫；捲動的回彈交給手機原生的；AI 是一顆安靜的按鈕，「感覺不到 AI 功能存在」。', 'Explanations cut to one line, or none; scrolling bounces the phone’s own way; AI is a quiet button: “should not even feel AI features existed.”']
  },
  {
    area: ['規則與公平', 'Rules and fairness'],
    icon: 'flag',
    card: 'pass-count',
    title: ['不違法，也不鼓勵鑽漏洞', 'Within the law, no loopholes'],
    said: ['「收集資料要讓使用者同意條款，在哪裡都不違法」；也不能「不小心鼓勵大家開分身帳號」。', '“Collect data … have users sign a policy … so we don’t break laws anywhere”, and never “accidentally encourage duplicating accounts.”'],
    became: ['只收匿名的使用次數，第一次打開就說明，一鍵關掉；沒有廣告和第三方追蹤；一人一個帳號，沒有任何地方引導你開第二個。', 'Only anonymous usage counts, explained on the first open and off in one tap; no ads, no third-party trackers; one account a person, and nothing nudges toward a second.']
  },
  {
    area: ['隱私', 'Privacy'],
    icon: 'lock',
    card: 'pass-vault',
    title: ['連我們的雲端都讀不到', 'Not even our cloud can read it'],
    said: ['「不要讓我們的雲端讀得到內容」，而且「除非通行碼真的丟了，資料不能有任何方式不見」。', '“Prevent from our cloud be able to read the detail”, and “no way to lose data unless the pass is actually lost.”'],
    became: ['帳本和課表先在你的手機上鎖好才上傳；連 Jay 的管理頁也只看到一個鎖。', 'Books and timetables are locked on your phone before they leave; even Jay’s admin page sees only a lock.'],
    art: () => lockDemo()
  }
];

// The decisions with their own day, for the timeline in 成長 (#made).
const DATED = [
  ['2026-11-03', ['親自搭公車驗證路線', 'Rode the bus to check the trips'], 'bus'],
  ['2026-11-11', ['用盲測選 AI', 'A blind test picked the AI'], 'target'],
  ['2026-11-15', ['資料先在手機上鎖', 'Data locked on the phone'], 'lock']
];

function call(c) {
  return h('article', { class: c.art ? 'sc-dec has-art' : 'sc-dec', 'data-card': c.card }, [
    h('header', { class: 'sc-dec-head' }, [h('span', { class: 'sc-dec-i' }, [ico(c.icon)]), h('small', { class: 'sc-dec-area', text: t(c.area) })]),
    h('h3', { class: 'sc-dec-q', text: t(c.title) }),
    h('blockquote', { class: 'sc-dec-said' }, [h('p', { text: t(c.said) })]),
    h('p', { class: 'sc-dec-became' }, [ico('check'), h('span', { text: t(c.became) })]),
    c.art ? c.art() : null,
    c.card ? howLink(c.card) : null
  ]);
}

// The team he runs: his words go to one coordinator, who splits them across
// AI work threads that ship once their tests pass (tree team, team-lanes).
function crew(stats) {
  const figs = [
    stats?.rules ? [num(stats.rules), ['條他定下的規則，每條都有日期', 'rules he set, each dated']] : null,
    ['13', ['個 AI 工作串同時在跑（10-23）', 'AI work threads at once (10-23)']],
    stats?.tests ? [num(stats.tests), ['個自動檢查守住他的標準', 'automatic checks hold his bar']] : null
  ].filter(Boolean);
  return h('div', { class: 'sc-crew' }, [
    h('ol', { class: 'sc-crew-flow' }, (SHOW.team?.flow || []).map(([icon, say]) => h('li', {}, [ico(icon), h('span', { text: t(say) })]))),
    h('div', { class: 'sc-crew-figs' }, figs.map(([v, label]) => h('p', {}, [h('strong', { text: v }), h('span', { text: t(label) })])))
  ]);
}

// Tools Jay made outside Orbit, the same way (each repo's own README).
const TOOLS = [
  {
    name: ['116 申請入學選系工具', 'Apply-116: picking university departments'],
    icon: 'school',
    tag: ['網頁，手機電腦都能用', 'A web page, phone or computer'],
    p: ['申請大學時，要自己拿級分去對照上千個校系去年的篩選門檻。', 'Applying to university means checking your scores against last year’s cut-offs at thousands of departments, by hand.'],
    i: ['輸入學測級分，逐關對照 64 校 2,240 個校系的 115 年門檻，判斷落點、排六個志願、列出二階要準備什麼。115 年的篩選結果官方只有圖片，2,398 列每一格都判讀兩次互相核對。', 'Type in your exam scores: it checks each screening stage against last year’s cut-offs for 2,240 departments at 64 universities, rates your chances, orders your six picks and lists what each second stage needs. Last year’s results were published only as images, so each of the 2,398 rows was read twice and cross-checked.'],
    r: ['一個 HTML 檔，不用網路；成績只存在你的瀏覽器。', 'One HTML file, works offline; your scores stay in your browser.'],
    go: [
      ['https://jaypengx.github.io/Apply-116/', ['打開工具', 'Open it']],
      ['https://github.com/JayPengX/Apply-116', ['GitHub', 'GitHub']]
    ]
  },
  {
    name: ['Folder-Link：搬資料夾，留下連結', 'Folder-Link: move a folder, leave a link'],
    icon: 'wrench',
    tag: ['Windows 10/11 小工具', 'A Windows 10/11 tool'],
    p: ['資料夾一搬走，指向舊位置的捷徑、設定和程式就全壞了。', 'Move a folder and every shortcut, setting and program pointing at the old place breaks.'],
    i: ['把資料夾裡的東西搬到新位置，在原處留一個連結，什麼都不會發現它搬過；不用打指令，一個檔案、不用安裝，中英文介面。', 'It moves a folder’s contents somewhere new and leaves a link at the old path, so nothing notices; no commands to type, one file, no installer, in Chinese or English.'],
    r: ['在真的 Windows 上自動測試；附檢查碼可以驗證下載。', 'Tested automatically on real Windows; checksums to verify the download.'],
    go: [['https://github.com/JayPengX/Folder-Link', ['GitHub', 'GitHub']]]
  },
  {
    name: ['Per-User-Display：每個人自己的解析度', 'Per-User-Display: a resolution per person'],
    icon: 'user',
    tag: ['Windows 小工具', 'A Windows tool'],
    p: ['家裡共用一台電腦，Windows 只記一種解析度，最後改的人說了算。', 'One shared family PC: Windows keeps one resolution for everyone, so whoever changed it last wins.'],
    i: ['每個帳號有自己的解析度和更新率：登入或切換回自己的帳號時自動換好，不用管理員權限。', 'Each account gets its own resolution and refresh rate, set the moment you sign in or switch back; no admin rights needed.'],
    r: ['只用螢幕自己列出的模式，先讓顯示卡測過才切換；不支援就不動。', 'Only modes the screen itself lists, tested by the graphics driver first; if yours isn’t offered, it leaves the screen alone.'],
    go: [['https://github.com/JayPengX/Per-User-Display', ['GitHub', 'GitHub']]]
  }
];

const tool = x =>
  h('article', { class: 'sc-tool' }, [
    h('header', { class: 'sc-tool-head' }, [h('span', { class: 'sc-dec-i' }, [ico(x.icon)]), h('span', {}, [h('h4', { text: t(x.name) }), h('small', { text: t(x.tag) })])]),
    h('p', { class: 'sc-tool-p', text: t(x.p) }),
    h('p', { text: t(x.i) }),
    h('p', { class: 'sc-tool-r' }, [ico('check'), h('span', { text: t(x.r) })]),
    h('div', { class: 'sc-tool-go' }, x.go.map(([href, label]) => h('a', { class: 'sc-howgo', href, target: '_blank', rel: 'noopener' }, [t(label), ico('chevron')])))
  ]);

function decide(stats) {
  return h('section', { class: 'sc-sec', id: 'decide' }, [
    head(['Jay 掌舵：|方向都是|他定的', 'Jay at the helm: every direction is his'], ['Claude 寫程式。要解決什麼問題、做到多好、什麼不做、錢怎麼花、資料怎麼保護，是 Jay 決定，最後也是他在自己的手機上檢查。', 'Claude writes the code. Which problems to solve, how good is good enough, what to leave out, how money is spent and data kept: Jay decides, then checks it on his own phone.']),
    crew(stats),
    h('div', { class: 'sc-decs' }, CALLS.map(call)),
    h('h3', { class: 'sc-subhead', text: t(['Orbit 以外，他也做工具', 'Beyond Orbit, more tools he made']) }),
    h('p', { class: 'sc-tools-sub', text: t(['同樣的做法：從身邊真的問題出發，帶著 AI 做到能用。', 'The same way: a real problem close to home, built with an AI until it works.']) }),
    h('div', { class: 'sc-tools' }, TOOLS.map(tool))
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
    ...DATED.map(([day, say, icon]) => [day, null, say, icon, true])
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
  box.replaceChildren(top(stats), apps(), decide(stats), proof(), made(stats), foot());
}
