// The App tab: each app's screens, the same six as its README (made-up data,
// never anyone's own; light and dark mixed; about half sell the app's main
// idea, half show its general look; framing only, never an edited screen),
// `now`, the light one the day-one picture is compared with, what it is in
// one line, the question it answers, its tree branch, and how it looked on its
// first day where that first version still runs. `brand` is the kit's BRANDS
// id, `repo` matches scripts/stats.mjs. In the family's order (Orbit-Core
// kit/brand.mjs APP_ORDER): the everyday apps first, Securities last.
export const APPS = [
  {
    id: 'sports', brand: 'match', repo: 'Orbit-Sports', zh: true,
    q: ['今晚有什麼比賽值得看？在哪一台？', 'Which games tonight are worth it, and on which channel?'],
    shots: [
      ['sports/1', ['你的比賽，一打開就看到', 'Your games, the moment you open it']],
      ['sports/2', ['正在轉播的比賽，一鍵觀看', 'What’s on now, one tap to watch']],
      ['sports/3', ['勝率走勢與關鍵時刻', 'How the game swung, and when']],
      ['sports/4', ['F1 每一站，倒數到起跑', 'Every F1 weekend, counted down']],
      ['sports/5', ['積分榜與爭冠形勢', 'The table and the title race']],
      ['sports/6', ['每位球員的完整生涯', 'Every player’s whole career']]
    ]
  },
  {
    id: 'transit', brand: 'transit', repo: 'Orbit-Transit', zh: true,
    q: ['怎麼去最實際？公車還要等多久？', 'What’s the practical way there, and how long for the bus?'],
    shots: [
      ['transit/1', ['路線畫在 Google 地圖上', 'Your trip on Google Maps']],
      ['transit/2', ['最快的走法，一眼看懂', 'The fastest way, at a glance']],
      ['transit/3', ['兩站之間每一班車', 'Every train between two stations']],
      ['transit/4', ['公車還要等多久', 'How long until the bus']],
      ['transit/5', ['YouBike 即時車位', 'YouBike docks, live']],
      ['transit/6', ['車站即時班次', 'Live trains at the station']]
    ]
  },
  {
    id: 'weather', brand: 'weather', repo: 'Orbit-Weather', zh: true,
    q: ['今天要不要帶傘？', 'Do I need an umbrella today?'],
    shots: [
      ['weather/1', ['今天天氣一眼看完', 'Today, in one look']],
      ['weather/2', ['未來十天降雨', 'Rain, ten days ahead']],
      ['weather/3', ['一天的每小時', 'Every hour of the day']],
      ['weather/4', ['附近空氣品質', 'The air around you']],
      ['weather/5', ['今日數據與貼心建議', 'Today’s numbers, and advice']],
      ['weather/6', ['你的每個地點', 'Every place you keep']]
    ],
    now: 'weather/1',
    then: ['then-weather', ['第一天：一個簡單的預報頁（這張截圖的位置是伺服器所在地）', 'Day one: a simple forecast page (placed where the screenshot server is)']]
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class', zh: true,
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class/1', ['現在、下一節與剩餘時間', 'Now, next, and time left']],
      ['class/2', ['整週課表一眼看', 'Your whole week']],
      ['class/3', ['每一節課的細節', 'Every class, in detail']],
      ['class/4', ['調課幾秒完成', 'Swap a class in seconds']],
      ['class/5', ['跟著真的飛機專注', 'Focus on a real flight']],
      ['class/6', ['拍下課表，AI 幫你讀', 'Snap it, AI reads it']]
    ],
    now: 'class/1',
    then: ['then-class', ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use']]
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money', zh: true,
    q: ['這個月的錢花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money/1', ['一整個月的收支', 'Your month on a calendar']],
      ['money/2', ['幾秒就記一筆', 'Log spending in seconds']],
      ['money/3', ['錢花到哪裡，一圈看懂', 'Where the money went']],
      ['money/4', ['每個帳戶與悠遊卡', 'Every account, EasyCard too']],
      ['money/5', ['十二大類，一眼分好', 'Twelve broad categories']],
      ['money/6', ['越用越懂你的習慣', 'It learns your habits']]
    ]
  },
  {
    id: 'news', brand: 'news', repo: 'Orbit-News', zh: true,
    q: ['同一件事，各家媒體怎麼報？', 'How does each side tell the same story?'],
    shots: [
      ['news/1', ['今天的頭條，各家怎麼報', 'Today’s top stories, every side']],
      ['news/2', ['同一則新聞，每一邊的標題', 'One story, each side’s headlines']],
      ['news/3', ['台灣新聞，依重要程度排', 'Taiwan’s news, by importance']],
      ['news/4', ['國際新聞，左中右一眼看', 'World news, left to right']],
      ['news/5', ['只有一邊在報的新聞', 'Stories only one side carries']],
      ['news/6', ['每家媒體的立場與來源', 'Every outlet’s place, and why']]
    ]
  },
  {
    id: 'words', brand: 'vocab', repo: 'Orbit-Words', zh: true,
    q: ['今天該背哪些字，才記得住？', 'Which words today, so they stick?'],
    shots: [
      ['words/1', ['今日目標與連續天數', 'Today’s goal and streak']],
      ['words/2', ['答完馬上知道為什麼', 'Know why, right away']],
      ['words/3', ['每個單字都有解說', 'Every word, explained']],
      ['words/4', ['多種練習模式', 'Many ways to practise']],
      ['words/5', ['拼字比賽模擬考', 'A mock spelling contest']],
      ['words/6', ['看見自己進步', 'Watch yourself improve']]
    ],
    now: 'words/1',
    then: ['then-words', ['第一天：高中英文參考詞彙表 Level 4–6', 'Day one: the high-school word list, Levels 4–6']]
  },
  {
    id: 'beats', brand: 'beats', repo: 'Orbit-Beats', zh: true,
    q: ['來點好聽、不會重複的音樂', 'Something good to hear that never repeats'],
    shots: [
      ['beats/1', ['為你做的音樂', 'Music made for you']],
      ['beats/2', ['各種心情與電台', 'Moods and stations']],
      ['beats/3', ['用你的方式創作', 'Create your way']],
      ['beats/4', ['在樂器室做節拍', 'Make beats in the studio']],
      ['beats/5', ['用打擊墊即興', 'Jam on the pads']],
      ['beats/6', ['每首歌都能玩節奏遊戲', 'A rhythm game for any song']]
    ],
    now: 'beats/3',
    then: ['then-beats', ['第一天叫 Passion Beats：用錄音切成的節拍做歌', 'Day one was Passion Beats: songs from a recording cut into beats']]
  },
  {
    id: 'law', brand: 'law', repo: 'Orbit-Law', zh: true,
    q: ['我遇到的事，法律怎麼說？', 'What does the law say about what happened to me?'],
    shots: [
      ['law/1', ['用白話問法律', 'Ask the law in plain words']],
      ['law/2', ['每一條條文都能點', 'Every article, every link']],
      ['law/3', ['判決隨手查', 'Court rulings, searchable']],
      ['law/4', ['法案改了什麼', 'What a bill changes']],
      ['law/5', ['每個政黨怎麼投票', 'How every party voted']],
      ['law/6', ['每一位立委', 'Every legislator']]
    ]
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities', zh: true,
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities/1', ['投資組合總覽', 'Your whole portfolio']],
      ['securities/2', ['真實報價與 K 線', 'Real prices, real charts']],
      ['securities/3', ['真實台股規則、手續費與稅', 'Real TWSE rules, fees and tax']],
      ['securities/4', ['台股、美股、基金一次看', 'Taiwan, US, funds and more']],
      ['securities/5', ['你的交易紀錄', 'Every trade you made']],
      ['securities/6', ['用銀行匯率換匯', 'Exchange at bank rates']]
    ],
    now: 'securities/1',
    then: ['then-securities', ['第一天叫 Stock Study：開一個模擬帳戶', 'Day one was Stock Study: open a practice account']]
  }
];
