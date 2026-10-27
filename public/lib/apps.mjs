// The App tab: each app's real screens (taken in its demo, Law and Beats with
// tools/preview.mjs; made-up data,
// never anyone's own; light and dark mixed; `now`, the light one the day-one
// picture is compared with), what it is in one line, the question it
// answers, its tree branch, and how it looked on its first day where that
// first version still runs. `brand` is the kit's BRANDS id, `repo` matches
// scripts/stats.mjs.
export const APPS = [
  {
    id: 'sports', brand: 'match', repo: 'Orbit-Sports',
    q: ['今晚有什麼比賽值得看？在哪一台？', 'Which games tonight are worth it, and on which channel?'],
    shots: [
      ['sports-1', ['今晚看哪場，打開就知道', 'Tonight’s game, the moment you open it']],
      ['sports-2', ['每場比分，依聯賽排好', 'Every score, by league']],
      ['sports-3', ['哪一台在播，幾點開始', 'Which channel, what time']]
    ]
  },
  {
    id: 'transit', brand: 'transit', repo: 'Orbit-Transit',
    q: ['怎麼去最實際？公車還要等多久？', 'What’s the practical way there, and how long for the bus?'],
    shots: [
      ['transit-1', ['附近的站和 YouBike，都在地圖上', 'Stops and bikes nearby, on the map']],
      ['transit-2', ['下一班車，幾分鐘到', 'The next bus, minutes away']],
      ['transit-3', ['捷運路網，照真的路線畫', 'Metro maps, true to the lines']]
    ]
  },
  {
    id: 'weather', brand: 'weather', repo: 'Orbit-Weather',
    q: ['今天要不要帶傘？', 'Do I need an umbrella today?'],
    shots: [
      ['weather-1', ['現在和接下來 24 小時', 'Now and the next 24 hours']],
      ['weather-2', ['降雨、紫外線、十天預報', 'Rain, UV and ten days ahead']],
      ['weather-3', ['點一天，看整天的變化', 'Tap a day, see it hour by hour']]
    ],
    now: 'weather-2',
    then: ['then-weather', ['第一天：一個簡單的預報頁（這張截圖的位置是伺服器所在地）', 'Day one: a simple forecast page (placed where the screenshot server is)']]
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class',
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class-1', ['這節還剩幾分鐘', 'Minutes left in this class']],
      ['class-2', ['單雙週，課表自己換', 'Odd and even weeks, handled']],
      ['class-3', ['調課、倒數、統計', 'Swaps, countdowns, counts']]
    ],
    now: 'class-2',
    then: ['then-class', ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use']]
  },
  {
    id: 'words', brand: 'vocab', repo: 'Orbit-Words',
    q: ['今天該背哪些字，才記得住？', 'Which words today, so they stick?'],
    shots: [
      ['words-1', ['四選一，答對就記住', 'Pick it right, keep it']],
      ['words-2', ['6,000 多個字，點了就念', 'Over 6,000 words, read aloud']]
    ],
    now: 'words-2',
    then: ['then-words', ['第一天：高中英文參考詞彙表 Level 4–6', 'Day one: the high-school word list, Levels 4–6']]
  },
  {
    id: 'beats', brand: 'beats', repo: 'Orbit-Beats',
    q: ['來點好聽、不會重複的音樂', 'Something good to hear that never repeats'],
    shots: [
      ['beats-1', ['不停的電台，每首都是新的', 'Endless radio, every song new']],
      ['beats-2', ['即興、節奏遊戲、做歌', 'Jam, play, make songs']],
      ['beats-3', ['選個風格，跟著彈', 'Pick a style, play along']],
      ['beats-4', ['自己排鼓和旋律', 'Lay out your own drums and tune']]
    ],
    then: ['then-beats', ['第一天叫 Passion Beats：用錄音切成的節拍做歌', 'Day one was Passion Beats: songs from a recording cut into beats']]
  },
  {
    id: 'law', brand: 'law', repo: 'Orbit-Law',
    q: ['我遇到的事，法律怎麼說？', 'What does the law say about what happened to me?'],
    shots: [
      ['law-1', ['遇到問題，用白話問', 'Ask in plain words']],
      ['law-2', ['條文旁邊就是判決', 'Each article beside its rulings']],
      ['law-3', ['從憲法法庭到各級法院', 'From the top court down']],
      ['law-4', ['法案走到哪一步', 'How far each bill has gone']]
    ]
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities',
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities-1', ['每檔股票的 K 線', 'Every stock, every candle']],
      ['securities-2', ['台股、美股、基金、債券', 'Shares, funds, bonds and more']],
      ['securities-3', ['換匯照銀行真的規則', 'Exchange by real bank rules']]
    ],
    now: 'securities-2',
    then: ['then-securities', ['第一天叫 Stock Study：開一個模擬帳戶', 'Day one was Stock Study: open a practice account']]
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money',
    q: ['這個月的錢花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money-1', ['每天花多少，一眼看到', 'Every day’s spending at a glance']],
      ['money-2', ['所有帳戶和卡片，一起算', 'Every account and card, together']],
      ['money-3', ['預算還剩多少', 'What’s left in the budget']],
      ['money-4', ['發票掃一下就記好', 'Scan an invoice, done']]
    ]
  }
];
