// The showcase's one page, for a busy reader who knows nothing about code
// (Jay 2026-11-17: "show actual good points that make sense to a professor
// who don't have much time"), read top to bottom:
//   #home    what Orbit is: one sentence, its numbers counted from git, three real screens
//   #apps    the ten apps: each one's question and its cleverest part; 試玩 runs the real app
//   #wow     four things that set it apart: your data locked on your phone,
//            many sources made one answer, say it or snap it and the app does
//            it (AI inside the apps, code checking it), ten apps helping each other
//   #solved  problems solved, before → after, each number measured
//   #made    how it was made: Jay's calls, who does what, the loop, the
//            numbers; then the whole system (#system) and 問 Orbit
// Each app's page and the whole system are one tap deeper; every figure is
// one the code, its history or a tree card states (none made up).
import { h, t, ico, appImg, num, shotUrl, appTitle, daysBetween, twToday, fmtDay, fmtDayYear, en } from '../shell.mjs';
import { APPS } from '../lib/apps.mjs';
import { hasDemo, openDemo } from './demo.mjs';
import { openCard, TOP, hue, shortName } from './how.mjs';
import { SHOW } from '../lib/tree-show.mjs';
import { heatmap, hours, churn } from './numbers.mjs';
import { askOrbit } from './ask.mjs';

// The page's chapters, as the bar along the top (the side bar on a
// computer) names them. (The whole system closes 怎麼做的, inside it.)
// (short: the name on a phone under 360 wide, where four English names don't fit one row)
export const CHAPTERS = [
  { id: 'apps', icon: 'grid', label: ['App', 'Apps'] },
  { id: 'wow', icon: 'spark', label: ['亮點', 'Highlights'], short: ['亮點', 'Ideas'] },
  { id: 'solved', icon: 'target', label: ['成果', 'Results'] },
  { id: 'made', icon: 'pencil', label: ['怎麼做的', 'How it’s made'], short: ['怎麼做的', 'Making'] }
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
// A line that breaks after its own commas (with keep-all in the CSS), never
// mid-word (「今晚有什 / 麼比賽」 at 320 in Safari).
const phrased = s => (en ? [s] : s.split(/(?<=[，、？；：])(?=.)/).map(p => h('span', { class: 'sc-ph', text: p })));
// 「怎麼做到的 ›」 under a block that opens a tree card.
const howLink = id => h('button', { class: 'sc-howgo', type: 'button', onclick: () => openCard(id) }, [t(['怎麼做到的', 'How it works']), ico('chevron')]);

// ---- The top: what it is, in one look ----
// Three real screens fanned out (each app's first screenshot, in the page's
// language; light and dark mixed), the middle one in front.
const FAN = ['sports', 'weather', 'beats'];
function fan() {
  return h(
    'div',
    { class: 'sc-fan' },
    FAN.map((id, i) => {
      const a = appOf(id);
      return h('a', { class: `sc-fan-p sc-fan-${i}`, href: `#apps/${id}`, 'aria-label': appTitle(a) }, [
        h('img', { src: shotUrl(`${a.shots[0][0].split('/')[0]}/screen`, Boolean(a.zh)), alt: '', width: 375, height: 812, decoding: 'async', fetchpriority: i === 1 ? 'high' : 'auto' })
      ]);
    })
  );
}

function top(stats) {
  const days = stats ? daysBetween(stats.first, twToday(Date.parse(stats.at))) + 1 : null;
  const figs = stats
    ? [
        // (The apps are the list's, as the headline counts them: stats.json was 9 before News.)
        [Math.max(stats.apps, APPS.length), ['個 App', 'apps']],
        [days, ['天', 'days']],
        stats.sources ? [stats.sources, ['個資料來源', 'data sources']] : [stats.tests, ['個自動檢查', 'automatic checks']],
        [stats.commits, ['次更新', 'updates']]
      ]
    : [];
  return h('section', { class: 'sc-intro', id: 'home' }, [
    h('div', { class: 'sc-intro-text' }, [
      h('p', { class: 'sc-kicker', text: t(['Orbit 作品展示', 'The Orbit project']) }),
      h('h1', { class: 'sc-headline' }, [line(['十個|每天在用的 App，', 'Ten apps used every day, ']), line(['一位高中生|帶著 AI| 做出來。', 'made by a high-school student directing an AI.'])]),
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
        h('span', { class: 'sc-hint', text: t(['或往下滑，幾分鐘看完', 'or scroll on: a few minutes, all of it']) })
      ])
    ]),
    fan()
  ]);
}

// ---- 1. The ten apps: each one's question and its cleverest part ----
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
    head(['十個 App，|各回答一個問題', 'Ten apps, one question each'], ['點一個看它的畫面和巧思；按「試玩」就用真的 App。', 'Tap one for its screens and clever parts; “Try” runs the real app.']),
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

// ---- 2. Four things that set it apart ----
// Each: what it means for you in one line, a small picture of how, a few
// numbers, and the tree card with the whole story.

// Steps joined by arrows (a tree card's flow, lib/tree-show.mjs).
const flow = steps =>
  h(
    'ol',
    { class: 'sc-pflow' },
    steps.map(([icon, say]) => h('li', {}, [h('span', { class: 'sc-pflow-i' }, [ico(icon)]), h('span', { class: 'sc-pflow-t', text: t(say) })]))
  );
const nums = list =>
  h(
    'div',
    { class: 'sc-pnums' },
    list.filter(([v]) => v != null).map(([v, label]) => h('div', {}, [h('strong', { text: typeof v === 'number' ? num(v) : t(v) }), h('small', { text: t(label) })]))
  );

// Many sources, one answer: each app's sources merged, a tap on a row opens its card.
const MERGES = [
  { app: 'transit', card: 'transit-data', from: [['各縣市公車', 'City buses'], ['台鐵', 'TRA'], ['高鐵', 'HSR'], ['捷運', 'Metro'], ['YouBike', 'YouBike']], to: ['一趟路線', 'One trip'] },
  { app: 'weather', card: 'weather-blend', from: [['氣象署', 'CWA'], ['Google', 'Google'], ['環境部', 'MOENV'], ['測站實測', 'Stations']], to: ['一個預報', 'One forecast'] },
  { app: 'law', card: 'law-three', from: [['法規', 'Laws'], ['判決', 'Rulings'], ['立法院', 'Legislature'], ['地方議會', 'Councils']], to: ['互相連結', 'All linked'] },
  { app: 'news', card: 'news-sides', from: [['118 家媒體', '118 outlets']], to: ['同一件事放一起', 'One story, every side'] }
];
const merges = () =>
  h(
    'div',
    { class: 'sc-merge' },
    MERGES.map(m => {
      const a = appOf(m.app);
      return h('button', { class: 'sc-merge-row', type: 'button', onclick: () => openCard(m.card), 'aria-label': `${appTitle(a)}: ${m.from.map(t).join('、')} → ${t(m.to)}` }, [
        appImg(a.brand, 26),
        h('span', { class: 'sc-merge-in' }, m.from.map(f => h('span', { class: 'sc-src', text: t(f) }))),
        h('span', { class: 'sc-merge-to' }, [ico('chevron'), h('strong', { text: t(m.to) })])
      ]);
    })
  );

// Say it or snap it: four of the ways in, each from a real feature (FEATURES.md).
const ASKS = [
  { app: 'law', card: 'law-ai', icon: 'chat', verb: ['問一句', 'Ask'], say: ['「房東扣光押金合理嗎？」', '“Can my landlord keep my deposit?”'], got: ['回答附上條文和判決，每個引用都由程式查過', 'An answer citing the articles and rulings, every citation checked by code'] },
  { app: 'transit', card: 'transit-ai', icon: 'chat', verb: ['說一句', 'Say'], say: ['「明天八點前到台大醫院」', '“To NTU Hospital by 8 tomorrow”'], got: ['路線排好，幾點出門也算好', 'The trip planned, and when to leave'] },
  { app: 'money', card: 'money-photo', icon: 'camera', verb: ['拍一張', 'Snap'], say: ['收據、發票、App 截圖', 'A receipt, an invoice, a screenshot'], got: ['變成一筆帳，金額和分類都填好', 'One entry, amount and category filled in'] },
  { app: 'securities', card: 'sec-ai', icon: 'book', verb: ['講白話', 'Explain'], say: ['公司的重大訊息', 'A company’s filing'], got: ['一句白話，加上它根據的數字', 'One plain line, and the figures it rests on'] }
];
const asks = () =>
  h(
    'div',
    { class: 'sc-dos' },
    ASKS.map(x => {
      const a = appOf(x.app);
      return h('button', { class: 'sc-do', type: 'button', onclick: () => openCard(x.card) }, [
        h('span', { class: 'sc-do-verb' }, [ico(x.icon), t(x.verb), h('span', { class: 'sc-do-app' }, [appImg(a.brand, 18), appName(a)])]),
        h('span', { class: 'sc-do-say', text: t(x.say) }),
        h('span', { class: 'sc-do-got' }, [ico('chevron'), h('span', { text: t(x.got) })])
      ]);
    })
  );

// Ten apps helping each other: what one app knows, another uses (each a
// line of the apps' FEATURES.md, through the family's notebook, kit family.mjs).
const TOGETHER = [
  [['weather', 'transit'], ['快下雨時，路線改搭公車或捷運，不叫你騎 YouBike 淋雨', 'Rain due? The trip takes the bus or metro, not a wet YouBike ride']],
  [['class', 'transit'], ['第一節課前，一點就排好怎麼去學校', 'Before first class, one tap plans the way to school']],
  [['class', 'words'], ['下課時，背 5 個今天該複習的單字', 'At a break, five words due today']],
  [['sports', 'transit'], ['去看中職：怎麼去球場、比賽時段會不會下雨', 'Off to a ballgame: how to get there, rain during it']],
  [['transit', 'money'], ['下車後，這趟車資一點就記進帳本', 'After a ride, its fare is one tap into your books']],
  [['securities', 'news'], ['你持有的股票上了新聞，新聞先告訴你', 'Your stocks in the news, shown to you first']]
];
const together = () =>
  h(
    'ul',
    { class: 'sc-tog' },
    TOGETHER.map(([ids, say]) =>
      h('li', {}, [
        h('span', { class: 'sc-tog-apps', 'aria-label': ids.map(id => appTitle(appOf(id))).join(' → ') }, ids.flatMap((id, i) => [i ? ico('chevron', 'sc-tog-arrow') : null, appImg(appOf(id).brand, 28)])),
        h('span', { class: 'sc-tog-say', text: t(say) })
      ])
    )
  );

function pillar({ id, color, icon, title, say, art, list, card, more }) {
  return h('article', { class: `sc-pillar sc-pillar-${id}`, style: `--p-c:${color}` }, [
    h('header', { class: 'sc-pillar-head' }, [h('span', { class: 'sc-pillar-i' }, [ico(icon)]), h('h3', {}, [line(title)])]),
    h('p', { class: 'sc-pillar-say', text: t(say) }),
    art,
    list ? nums(list) : null,
    more || null,
    card ? howLink(card) : null
  ]);
}

function wow(stats) {
  return h('section', { class: 'sc-sec', id: 'wow' }, [
    head(['四個|讓它不一樣的地方', 'Four things that set it apart'], ['每一個都在十個 App 裡真的在跑。', 'Each one is running in the apps today.']),
    h('div', { class: 'sc-pillars' }, [
      pillar({
        id: 'vault',
        color: 'var(--q-green)',
        icon: 'lock',
        title: ['你的資料，|先在手機上鎖好|才上傳', 'Your data is locked on your phone before it leaves'],
        say: [
          '課表、帳本、單字進度……在你的手機上，用你的通行碼做出的鑰匙加密，才同步到雲端。我們的資料庫、備份和管理頁看到的，都只是一個鎖。',
          'Your timetable, your books, your word progress: encrypted on your phone with a key made from your pass, then synced. Our database, its backups and the admin page see only a lock.'
        ],
        art: flow(SHOW['pass-vault'].flow),
        list: [
          ['9', ['個 App 的資料上鎖', 'apps’ data locked']],
          ['600,000', ['次運算做出你的鑰匙', 'rounds to make your key']],
          ['0', ['個廣告和第三方追蹤', 'ads or third-party trackers']]
        ],
        card: 'pass-vault'
      }),
      pillar({
        id: 'merge',
        color: 'var(--q-cyan)',
        icon: 'grid',
        title: ['很多來源，|合成一個答案', 'Many sources, one answer'],
        say: [
          '政府開放資料、業者自己的網站、國際的資料，各自格式都不一樣。Orbit 把它們讀進來、對齊、合併，你只看到一個清楚的答案。點一列看怎麼做到。',
          'Open government data, operators’ own sites and global feeds, each in its own shape: Orbit reads them, lines them up and merges them, so you see one clear answer. Tap a row to see how.'
        ],
        art: merges(),
        list: [
          [stats?.sources ?? null, ['個資料來源', 'data sources']],
          [stats?.outlets ?? null, ['家新聞媒體', 'news outlets']],
          ['22 + 204', ['個縣市議會和鄉鎮代表會', 'county and township councils']]
        ]
      }),
      pillar({
        id: 'ai',
        color: 'var(--q-purple)',
        icon: 'ai',
        title: ['說一句、拍一張，|App 就去做', 'Say it or snap it, and the app does it'],
        say: [
          'AI 不是一個聊天框，而是放進每個 App 的動作裡：程式先讀懂能讀的，其餘交給 AI；算出來的數字和引用都由程式再檢查一次，送出前一定先給你看。',
          'The AI isn’t a chat box; it is built into what each app does. Code reads what it can and the AI the rest; every figure and citation is checked again by code, and nothing is done before you see it.'
        ],
        art: asks(),
        list: [
          ['9', ['個 App 用得到', 'apps use it']],
          ['3', ['家 AI 互相備援', 'AI makers backing each other up']]
        ],
        more: h('p', {
          class: 'sc-pillar-more',
          text: t([
            '還有：「用 5 萬買台積電零股」幫你填好下單單、拍課表照片匯入課表、用新學的單字聊天、用說的做一段節奏、問你追蹤的球隊、問「這個月吃飯花多少」畫成圖。',
            'And more: “buy NT$50,000 of TSMC in odd lots” fills the order ticket, a photo of a timetable becomes yours, a chat that uses your new words, a beat made from a sentence, questions about your teams, “how much did I spend on food?” drawn as a chart.'
          ])
        }),
        card: 'ai'
      }),
      pillar({
        id: 'family',
        color: 'var(--q-orange)',
        icon: 'share',
        title: ['十個 App| 互相幫忙', 'Ten apps that help each other'],
        say: [
          '一個帳號、一個 Orbit 就裝下全部十個。一個 App 知道的事，另一個拿來用：',
          'One account, and one Orbit holding all ten. What one app knows, another puts to use:'
        ],
        art: together(),
        card: 'ai-family'
      })
    ])
  ]);
}

// ---- 3. Problems solved, before → after ----
// Each a number measured before and after the change, as its tree card
// states it (lib/tree-show.mjs); the ones Jay raised himself carry his day.
const SOLVED = [
  { card: 'transit-fast', app: 'transit', what: ['在台北規劃一趟路', 'Planning a trip in Taipei'], was: ['7–10 秒', '7–10 s'], now: ['1–2 秒', '1–2 s'] },
  { card: 'sports-push', app: 'sports', what: ['比賽結束到手機收到結果', 'Final whistle to the result on your phone'], was: ['15 分鐘以上', '15+ min'], now: ['約 2 分鐘', '~2 min'], jay: '2026-10-22' },
  { card: 'weather-blend', app: 'weather', what: ['6 小時以後的溫度預報，平均誤差', 'Temperature forecast 6+ hours ahead, average error'], was: '0.86°', now: '0.59°' },
  { card: 'law-ai', app: 'law', what: ['問法律，等到回答開始出現', 'Ask the law: until the answer starts'], was: ['10–12 秒', '10–12 s'], now: ['3–4 秒', '3–4 s'], jay: '2026-10-30' },
  { card: 'fast-lift', app: 'weather', what: ['打開天氣，到看見預報', 'Opening Weather to the forecast'], was: ['1.6 秒', '1.6 s'], now: ['0.09 秒', '0.09 s'] },
  { card: 'fast', app: null, what: ['在慢網路上把九個 App 各用一輪', 'Nine apps used once each, on a slow network'], was: '24.8 MB', now: '15.2 MB', jay: '2026-11-05' },
  { card: 'law-links', app: 'law', what: ['法條裡的約 28,000 個「第幾條」', 'The ~28,000 article numbers inside the laws'], was: ['只是文字', 'Plain text'], now: ['約 99%', '~99%'], tail: ['點了就到那一條', 'open the very article'] },
  { card: 'cheap', app: null, what: ['主機和交通資料，每個月的費用', 'Hosting and transit data, a month'], was: ['約 NT$390', '~NT$390'], now: 'NT$0', jay: '2026-11-06' }
];

function solved() {
  return h('section', { class: 'sc-sec', id: 'solved' }, [
    head(['解決的問題，|前後對比', 'Problems solved, before and after'], ['每個數字都是改之前和改之後量的；有些是 Jay 自己在手機上發現的。點一列看怎麼做到。', 'Each number was measured before and after the change; some problems Jay found on his own phone. Tap a row to see how.']),
    h(
      'div',
      { class: 'sc-solved' },
      SOLVED.map(s => {
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
      })
    )
  ]);
}

// ---- 4. How it was made ----
// Jay's calls first (what a person decided, not what code did), then the
// two parts side by side, one problem's trip from spotted to fixed, the
// numbers, and the whole system to end.
const CALLS = [
  { card: 'law-ai', icon: 'target', day: '2026-11-11', title: ['用盲測選 AI', 'A blind test picked the AI'], say: ['五個 AI 回答十個真實的法律問題，Jay 不知道哪個是哪個，選出最好的一個來回答「問法律」。', 'Five AIs answered ten real legal questions; not knowing which was which, Jay picked the best one to answer Ask the law.'] },
  { card: 'transit-calls', icon: 'bus', day: '2026-11-03', title: ['親自搭公車驗證', 'Rode the bus to check'], say: ['Jay 搭 5608 公車實測：即時預估很準，紙本時刻表卻差很多。照真實的通勤判斷，不照資料說的。', 'Jay rode bus 5608 to test it: the live estimate was right, the printed timetable far off. Real commutes decide, not what the data claims.'] },
  { card: 'pass-vault', icon: 'lock', day: '2026-11-15', title: ['連我們自己都讀不到', 'Not even we can read it'], say: ['Jay 要每個人的資料，連自己的資料庫都看不到內容：所以先在手機上加密才同步。', 'Jay wanted no one’s data readable even in our own database, so it is encrypted on the phone before it syncs.'] },
  { card: 'news-sides', icon: 'flag', day: '2026-11-10', title: ['立場只看研究', 'Leans from research only'], say: ['每家媒體偏哪一邊，不由我們、也不由 AI 判斷，一律引用已發表的研究和評等。', 'Where an outlet leans is judged neither by us nor by an AI: always from published research and ratings.'] },
  { card: 'sec-rules', icon: 'bank', day: null, title: ['跟真的台灣一樣', 'As real as Taiwan'], say: ['模擬投資照台灣券商的真規則，連開戶資格、當沖、零股和交割都照做；颱風假在每個 App 都算放假。', 'Practice investing follows a real Taiwan broker’s rules, down to account papers, day trading, odd lots and settlement; a typhoon day off counts in every app.'] },
  { card: 'team-jay', icon: 'check', day: null, title: ['停下來，全部測一遍', 'Stop, and test everything'], say: ['截止前，Jay 讓 4,018 個項目一項一項測過（419 個問題修好），然後停止加新功能，把還不夠穩的整個拿掉。', 'Before the deadline Jay had 4,018 items tested one by one (419 problems fixed), then stopped new features and removed whole ones not yet steady.'] }
];

function calls() {
  return h(
    'div',
    { class: 'sc-calls' },
    CALLS.map(c =>
      h('button', { class: 'sc-call', type: 'button', onclick: () => openCard(c.card) }, [
        h('span', { class: 'sc-call-head' }, [h('span', { class: 'sc-call-i' }, [ico(c.icon)]), h('strong', { text: t(c.title) }), c.day ? h('small', { text: fmtDay(c.day) }) : null]),
        h('span', { class: 'sc-call-say', text: t(c.say) })
      ])
    )
  );
}

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

// One problem, from Jay's phone to everyone's (the tree's team-loop, in four steps).
const LOOP = [
  ['user', ['Jay 發現問題', 'Jay spots a problem'], ['在自己的 iPhone 上', 'on his own iPhone']],
  ['camera', ['截圖給 Claude', 'Sends Claude a screenshot'], ['說哪裡不對', 'says what’s wrong']],
  ['check', ['找原因、修好、測試', 'Cause found, fixed, tested'], ['自動檢查全過', 'every check passes']],
  ['send', ['幾分鐘後上線', 'Live minutes later'], ['每支手機自己更新', 'every phone updates itself']]
];

// The whole system, at a glance: its ten parts as tiles (each opens that
// part of the tree), the journey of one tap across them, and 問 Orbit.
function system() {
  const cloud = SHOW.cloud?.flow || [];
  return h('div', { class: 'sc-system', id: 'system' }, [
    h('h3', { class: 'sc-subhead', text: t(['整個系統，十塊拼起來', 'The whole system, in ten parts']) }),
    h(
      'div',
      { class: 'sc-sys' },
      TOP.map(b =>
        h('a', { class: 'sc-sys-b', href: `#how/${b.id}`, style: `--c:${hue(b.id)}` }, [
          h('span', { class: 'sc-sys-i' }, [ico(b.icon)]),
          h('span', { class: 'sc-sys-t' }, [h('strong', { text: shortName(b) }), h('small', { text: t(b.line) })])
        ])
      )
    ),
    h('a', { class: 'sc-journey', href: '#how/map' }, [
      h('span', { class: 'sc-journey-t' }, [h('strong', { text: t(['按一下，背後發生什麼事', 'What happens behind one tap']) }), h('small', { text: t(['打開 Orbit、每個 App 各一個例子，一步一步走過整個系統', 'Opening Orbit and a story for every app, step by step across the system']) })]),
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
    head(['怎麼做出來的', 'How it was made'], ['Jay 不寫程式：他決定做什麼、驗證、做取捨，也是最挑剔的使用者；寫程式的是 Claude。', 'Jay doesn’t write code: he decides, verifies and makes the calls, and is the pickiest user; Claude writes the code.']),
    h('h3', { class: 'sc-subhead first', text: t(['Jay 做的決定', 'Jay’s calls']) }),
    calls(),
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
        stats?.rules ? [stats.rules, ['條他定下的規則', 'rules he has set']] : null
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
    h('h3', { class: 'sc-subhead', text: t(['一個問題，從發現到修好', 'One problem, from spotted to fixed']) }),
    h(
      'ol',
      { class: 'sc-cycle', style: `--n:${LOOP.length}` },
      LOOP.map(([icon, say, sub], i) => h('li', { style: `--i:${i}` }, [h('span', { class: 'sc-cycle-dot' }, [ico(icon)]), h('span', { class: 'sc-cycle-t' }, [h('strong', { text: t(say) }), h('small', { text: t(sub) })])]))
    ),
    stats?.days
      ? h('div', { class: 'sc-made-nums', id: 'numbers' }, [
          h('h3', { class: 'sc-subhead', text: t(['從程式碼數出來的', 'Counted from the code']) }),
          h('div', { class: 'sc-made-cards' }, [heatmap(stats), hours(stats)]),
          churn(stats)
        ])
      : null,
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
  box.replaceChildren(top(stats), apps(), wow(stats), solved(), made(stats), foot());
}
