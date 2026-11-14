// The showcase's one page, for a reader with a few minutes, read top to
// bottom: what Orbit is (one sentence, its numbers counted from git, three
// real screens), the ten apps (each one's question; its page a tap away,
// 試玩 runs the real app at once), six things people don't expect (each opens
// its whole story) and how it was made (Jay's part and Claude's, the loop,
// every day's updates). Each app's page and the whole system are one tap
// deeper; nothing here waits to be scrolled to before it shows.
//   #home  the top   #apps  #wow  #made  the three chapters
import { h, t, ico, appImg, num, shotUrl, appTitle, daysBetween, twToday, fmtDayYear, en } from '../shell.mjs';
import { APPS } from '../lib/apps.mjs';
import { hasDemo, openDemo } from './demo.mjs';
import { openCard, TOP, hue, shortName } from './how.mjs';
import { SHOW } from '../lib/tree-show.mjs';
import { BRANDS } from '#kit/brand.mjs';
import { heatmap, hours, churn } from './numbers.mjs';
import { askOrbit } from './ask.mjs';

// The page's three chapters, as the bar along the top (the side bar on a
// computer) names them.
export const CHAPTERS = [
  { id: 'apps', icon: 'grid', label: ['App', 'Apps'] },
  { id: 'wow', icon: 'spark', label: ['亮點', 'Highlights'] },
  { id: 'made', icon: 'pencil', label: ['怎麼做的', 'How it’s made'] },
  { id: 'system', icon: 'list', label: ['整個系統', 'The system'] }
];

const appName = a => appTitle(a).replace(/^Orbit /, '');
export const tryApp = a => openDemo(a, appTitle(a));

// A chapter's head: its title and one plain line under it.
// (A title breaks only between its |-marked phrases, as the headline does: at 320 「十個 App，各 / 回答一個問題」 split mid-phrase.)
const head = (title, sub) => h('header', { class: 'sc-sechead' }, [h('h2', {}, [line(title)]), sub ? h('p', { text: t(sub) }) : null]);

// ---- The top: what it is, in one look ----
// Three real screens fanned out (each app's first screenshot, in the page's
// language; light and dark mixed), the middle one in front.
const FAN = ['sports', 'weather', 'beats'];
function fan() {
  return h(
    'div',
    { class: 'sc-fan' },
    FAN.map((id, i) => {
      const a = APPS.find(x => x.id === id);
      return h('a', { class: `sc-fan-p sc-fan-${i}`, href: `#apps/${id}`, 'aria-label': appTitle(a) }, [
        h('img', { src: shotUrl(`${a.shots[0][0].split('/')[0]}/screen`, Boolean(a.zh)), alt: '', width: 375, height: 812, decoding: 'async', fetchpriority: i === 1 ? 'high' : 'auto' })
      ]);
    })
  );
}

// A headline line; in Chinese it breaks only between its phrases (| marks
// them; '| ' keeps a space there).
const line = pair => {
  const s = t(pair);
  if (!s.includes('|')) return h('span', {}, [s]);
  return h('span', {}, s.split('|').flatMap((p, i) => [i && p.startsWith(' ') ? ' ' : null, h('span', { class: 'sc-ph', text: p.trim() })]));
};

function top(stats) {
  const days = stats ? daysBetween(stats.first, twToday(Date.parse(stats.at))) + 1 : null;
  const figs = stats
    ? [
        // (The apps are the list's, as the headline counts them: stats.json was 9 before News.)
        [Math.max(stats.apps, APPS.length), ['個 App', 'apps']],
        [days, ['天', 'days']],
        [stats.commits, ['次更新', 'updates']],
        [stats.tests, ['個自動檢查', 'automatic checks']]
      ]
    : [];
  return h('section', { class: 'sc-intro', id: 'home' }, [
    h('div', { class: 'sc-intro-text' }, [
      h('p', { class: 'sc-kicker', text: t(['Orbit 作品展示', 'The Orbit project']) }),
      h('h1', { class: 'sc-headline' }, [line(['十個|每天在用的 App，', 'Ten apps used every day, ']), line(['一位高中生|帶著 AI| 做出來。', 'made by a high-school student directing an AI.'])]),
      h('p', {
        class: 'sc-intro-lede',
        text: t([
          'Jay 決定做什麼、要做到多好，每天在自己的 iPhone 上試；寫程式的是 AI（Claude）。',
          'Jay decides what to build and how good it must be, and tries it on his own iPhone every day; an AI, Claude, writes the code.'
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

// ---- 1. The ten apps: each one's question, its page, its demo ----
// A question breaks after its own commas (with keep-all in the CSS), never
// mid-word (「今晚有什 / 麼比賽」 at 320 in Safari).
const phrased = s => (en ? [s] : s.split(/(?<=[，、？；：])(?=.)/).map(p => h('span', { class: 'sc-ph', text: p })));

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
            h('span', { class: 'sc-app-text' }, [h('small', {}, [appName(a), ico('chevron', 'sc-app-chev')]), h('strong', {}, phrased(t(a.q)))])
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

// ---- 2. Six things people don't expect ----
// Each a figure the tree's own card states (lib/tree-show.mjs, tree.mjs,
// tree-apps.mjs: none made up), in one line; a tap opens its whole story.
// The figure wears its app's colour (the one coloured thing on the card); on
// a wide page the first one is the big card of the six.
const WOW = [
  { id: 'weather-typhoon', app: 'weather', fig: '68', say: ['個颱風，教它算出放颱風假的機率', 'typhoons taught it the chance of a typhoon day off'] },
  { id: 'law-links', app: 'law', fig: ['約 99%', '~99%'], say: ['法條裡約 28,000 個「第幾條」，點了就到那一條', 'of the ~28,000 article numbers in the law open that very article'] },
  { id: 'transit-fast', app: 'transit', fig: ['快 2–5 倍', '2–5× faster'], say: ['規劃路線：台北從 7 到 10 秒，變成 1 到 2 秒', 'to plan a trip: Taipei went from 7–10 s to 1–2 s'] },
  { id: 'sports-push', app: 'sports', fig: ['約 2 分鐘', '~2 min'], say: ['比賽一結束，結果就送到手機，App 關著也一樣', 'after the final whistle, the result is on your phone, app closed or not'] },
  { id: 'news-sides', app: 'news', fig: '118', say: ['家媒體，每一家偏哪邊都附研究出處', 'outlets, each one’s lean backed by a published source'] },
  { id: 'class-flight', app: 'class', fig: ['25–90 分', '25–90 min'], say: ['專心讀書，跟著一架天上真的飛機，降落就是時間到', 'of study, flying with a real plane in the sky; it lands when time’s up'] },
  { id: 'words-memory', app: 'words', fig: '20', say: ['個字一天，挑的都是你快忘記的', 'words a day, each just as you’re about to forget it'] },
  { id: 'money-photo', app: 'money', fig: ['1 張照片', '1 photo'], say: ['就是一筆帳：收據、發票、App 截圖都讀得懂', 'is one entry: receipts, invoices, app screenshots all read'] },
  { id: 'securities', app: 'securities', fig: '9', say: ['種商品，照真實報價和真的券商規則買賣', 'kinds of investment, traded at real prices by a real broker’s rules'] },
  { id: 'beats-game', app: 'beats', fig: ['±45 毫秒', '±45 ms'], say: ['以內才算打中節拍：每首歌都是一關節奏遊戲', 'is how close a tap must land: every song is a rhythm-game level'] },
  { id: 'cheap', app: null, fig: 'NT$0', say: ['一個月：十個 App 背後的整套雲端，只付網域的錢', 'a month: the whole cloud behind all ten apps; only the domain is paid'] }
];
const brandOf = a => BRANDS[a?.brand] || null;
function wow() {
  return h('section', { class: 'sc-sec', id: 'wow' }, [
    head(['你可能沒想到的事', 'Things you might not expect'], ['點一張，看它怎麼做到。', 'Tap one to see how it’s done.']),
    h(
      'div',
      { class: 'sc-wow' },
      WOW.map((w, i) => {
        const a = APPS.find(x => x.id === w.app);
        const b = brandOf(a);
        return h('button', { class: `sc-wowcard${i === 0 ? ' big' : ''}`, type: 'button', style: b ? `--w-c:${b.color};--w-ink:${b.ink};--w-from:${b.from}` : '', onclick: () => openCard(w.id) }, [
          h('span', { class: 'sc-wow-from' }, [appImg(a?.brand || null, 22), h('span', { class: 'sc-wow-name' }, a ? [h('span', { class: 'sc-wow-orbit', text: 'Orbit ' }), appName(a)] : [t(['整個 Orbit', 'All of Orbit'])])]),
          h('strong', { class: 'sc-wow-fig', text: t(w.fig) }),
          h('span', { class: 'sc-wow-say' }, phrased(t(w.say))),
          // (the big card: the rest of its card's numbers, beside the line)
          i === 0 && SHOW[w.id]?.nums?.length > 1
            ? h('span', { class: 'sc-wow-more' }, SHOW[w.id].nums.slice(1).map(([v, l]) => h('span', {}, [h('strong', { text: t(v) }), h('small', { text: t(l) })])))
            : null,
          h('span', { class: 'sc-wow-go' }, [t(['怎麼做到的', 'How it works']), ico('chevron')])
        ]);
      })
    )
  ]);
}

// ---- 3. How it was made ----
// Two people's parts side by side, each with the one number that proves it;
// one problem's trip from Jay's phone back to it; then the numbers, each card
// led by what it says in one figure.
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

function made(stats) {
  return h('section', { class: 'sc-sec', id: 'made' }, [
    head(['怎麼做出來的', 'How it was made'], ['Jay 不寫程式：他是老闆，也是最挑剔的使用者。', 'Jay doesn’t write code: he is the boss and the pickiest user.']),
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
      : null
  ]);
}

// ---- 4. The whole system, at a glance ----
// Its ten parts as tiles (each opens that part of the tree), and the journey
// of one tap across them; the tree and the journeys are a tap deeper (#how).
function system() {
  const cloud = SHOW.cloud?.flow || [];
  return h('section', { class: 'sc-sec', id: 'system' }, [
    head(['整個系統，|十塊拼起來', 'The whole system, in ten parts'], ['每一塊用白話說：點開看問題、想法和結果。', 'Each part in plain words: open one for the problem, the idea, the result.']),
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
      h('span', { class: 'sc-journey-t' }, [h('strong', { text: t(['按一下，背後發生什麼事', 'What happens behind one tap']) }), h('small', { text: t(['五個日常的例子，一步一步走過整個系統', 'Five everyday stories, step by step across the system']) })]),
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

function foot() {
  return h('footer', { class: 'sc-foot' }, [
    h('p', {}, [appImg(null, 24), h('span', { text: t(['Orbit，Jay 和 Claude 一起做。', 'Orbit, made by Jay with Claude.']) })]),
    h('p', {
      class: 'sc-foot-small',
      text: t([
        '截圖和試玩用的是範例資料或公開資料，不是任何人真正的資料。數字每天從程式碼自動重數。',
        'Screens and demos use sample or public data, never anyone’s own. The numbers are recounted from the code every day.'
      ])
    })
  ]);
}

export function renderMain(box, stats) {
  box.replaceChildren(top(stats), apps(), wow(), made(stats), system(), foot());
}
