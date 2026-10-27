// The App tab: each app's real screens (taken with tools/preview.mjs on
// made-up data, never anyone's own), what it is in one line, the question it
// answers, its tree branch, and how it looked on its first day where that
// first version still runs. `brand` is the kit's BRANDS id, `repo` matches
// scripts/stats.mjs.
export const APPS = [
  {
    id: 'sports', brand: 'match', repo: 'Orbit-Sports',
    q: ['今晚有什麼比賽值得看？在哪一台？', 'Which games tonight are worth it, and on which channel?'],
    shots: [
      ['sports-1', ['首頁就是今晚的觀賽計畫：下一場、你追的比賽', 'Home is tonight’s plan: the next game and the ones you follow']],
      ['sports-2', ['每一天的全部賽事，依聯賽分好', 'Every game of the day, by league']],
      ['sports-3', ['哪一台在播、什麼時候開始', 'What’s on which channel, and when']]
    ],
    then: ['then-sports', ['第一天叫 Match Find：只幫你挑一場最值得看的比賽', 'Day one was Match Find: it picked the one game worth your evening']]
  },
  {
    id: 'transit', brand: 'transit', repo: 'Orbit-Transit',
    q: ['怎麼去最實際？公車還要等多久？', 'What’s the practical way there, and how long for the bus?'],
    shots: [
      ['transit-1', ['地圖上就是附近的公車站和 YouBike 剩幾台', 'Nearby stops and YouBike counts right on the map']],
      ['transit-2', ['查時刻：台鐵、高鐵，一天的班次', 'Timetables for trains and high-speed rail']],
      ['transit-3', ['捷運路網圖，照真實路線畫', 'Metro maps drawn from the real lines']]
    ]
  },
  {
    id: 'weather', brand: 'weather', repo: 'Orbit-Weather',
    q: ['今天要不要帶傘？', 'Do I need an umbrella today?'],
    shots: [
      ['weather-1', ['一個答案：現在、接下來 24 小時', 'One answer: now and the next 24 hours']],
      ['weather-2', ['降雨、紫外線、空氣，十天預報', 'Rain, UV, air and ten days ahead']],
      ['weather-3', ['常去的地點和每天早上的天氣提醒', 'Saved places and a morning weather note']]
    ],
    then: ['then-weather', ['第一天：一個簡單的預報頁（這張截圖的位置是伺服器所在地）', 'Day one: a simple forecast page (placed where the screenshot server is)']]
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class',
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class-1', ['這節課還剩幾分鐘、下一節是什麼', 'Minutes left in this class and what’s next']],
      ['class-2', ['單雙週不同的課表', 'A timetable that changes on odd and even weeks']],
      ['class-3', ['調課、倒數、統計都在工具裡', 'Swaps, countdowns and counts in Tools']]
    ],
    then: ['then-class', ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use']]
  },
  {
    id: 'words', brand: 'vocab', repo: 'Orbit-Words',
    q: ['今天該背哪些字，才記得住？', 'Which words today, so they stick?'],
    shots: [
      ['words-1', ['今天的目標、連續天數', 'Today’s goal and your streak']],
      ['words-2', ['每個字的發音、詞性和意思', 'Each word’s sound, part of speech and meaning']]
    ],
    then: ['then-words', ['第一天：高中英文參考詞彙表 Level 4–6', 'Day one: the high-school word list, Levels 4–6']]
  },
  {
    id: 'beats', brand: 'beats', repo: 'Orbit-Beats',
    q: ['來點好聽、不會重複的音樂', 'Something good to hear that never repeats'],
    shots: [
      ['beats-1', ['永不停的電台，每首都是當場做的', 'An endless radio, each song made on the spot']],
      ['beats-2', ['創作：即興、節奏遊戲、樂器、做歌', 'Make: jam, rhythm game, instruments, songs']],
      ['beats-3', ['即興：選風格，跟著彈', 'Jam: pick a style and play along']],
      ['beats-4', ['樂器：自己排鼓和旋律', 'Instruments: lay out your own drums and tune']]
    ],
    then: ['then-beats', ['第一天叫 Passion Beats：用錄音切成的節拍做歌', 'Day one was Passion Beats: songs from a recording cut into beats']]
  },
  {
    id: 'law', brand: 'law', repo: 'Orbit-Law',
    q: ['我遇到的事，法律怎麼說？', 'What does the law say about what happened to me?'],
    shots: [
      ['law-1', ['問法律、依生活情境找法規', 'Ask a question, or find laws by life situation']],
      ['law-2', ['讀條文，旁邊就是相關判決', 'Read an article with its rulings beside it']],
      ['law-3', ['憲法法庭和各級法院的裁判', 'Rulings from the Constitutional Court down']],
      ['law-4', ['立法院正在走的法案，走到哪一步', 'Bills in the legislature and how far each has gone']]
    ]
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities',
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities-1', ['全球行情和你的持股', 'World markets and your holdings']],
      ['securities-2', ['台股、美股、基金、債券、外匯…', 'Shares, funds, bonds, currencies and more']],
      ['securities-3', ['換匯照真實匯率和銀行規則', 'Currency exchange at real rates and bank rules']]
    ],
    then: ['then-securities', ['第一天叫 Stock Study：開一個模擬帳戶', 'Day one was Stock Study: open a practice account']]
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money',
    q: ['這個月的錢花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money-1', ['月曆上每天花多少，一眼看到', 'Each day’s spending on a calendar']],
      ['money-2', ['所有帳戶和卡片', 'Every account and card']],
      ['money-3', ['預算和每天的支出', 'Budgets and daily spending']],
      ['money-4', ['掃紙本發票、匯入雲端發票', 'Scan paper invoices or bring in e-invoices']]
    ]
  }
];
