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
      ['sports/1', ['F1 每一站完整結果', 'F1, race by race']],
      ['sports/2', ['開賽前就有先發名單', 'Line-ups before tip-off']],
      ['sports/3', ['誰比較有機會贏', 'Who is likely to win']],
      ['sports/4', ['每場比賽完整數據', 'Every stat, every game']],
      ['sports/5', ['台灣電視轉播一次看', 'What’s on TV in Taiwan']],
      ['sports/6', ['F1 車手積分榜', 'The championship race']]
    ]
  },
  {
    id: 'transit', brand: 'transit', repo: 'Orbit-Transit', zh: true,
    q: ['怎麼去最實際？公車還要等多久？', 'What’s the practical way there, and how long for the bus?'],
    shots: [
      ['transit/1', ['最好的路線排在最前', 'The best trips, ranked']],
      ['transit/2', ['每一段都畫在地圖上', 'Every step on the map']],
      ['transit/3', ['附近即將發車', 'What leaves near you']],
      ['transit/4', ['整座城市即時動態', 'The city, live']],
      ['transit/5', ['捷運班次一眼看懂', 'Metro times at a glance']],
      ['transit/6', ['短程也幫你算好', 'Short hops too']]
    ]
  },
  {
    id: 'weather', brand: 'weather', repo: 'Orbit-Weather', zh: true,
    q: ['今天要不要帶傘？', 'Do I need an umbrella today?'],
    shots: [
      ['weather/1', ['今天天氣一眼看完', 'Today, in one look']],
      ['weather/2', ['未來十天降雨', 'Rain, ten days ahead']],
      ['weather/3', ['重要細節一次看', 'Every detail that matters']],
      ['weather/4', ['附近空氣品質', 'The air around you']],
      ['weather/5', ['一週預報', 'The week ahead']],
      ['weather/6', ['明天的貼心建議', 'Advice for tomorrow']]
    ],
    now: 'weather/1',
    then: ['then-weather', ['第一天：一個簡單的預報頁（這張截圖的位置是伺服器所在地）', 'Day one: a simple forecast page (placed where the screenshot server is)']]
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class', zh: true,
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class/1', ['匯入你的課表', 'Bring in your timetable']],
      ['class/2', ['拍下課表，AI 幫你讀', 'Snap it, AI reads it']],
      ['class/3', ['單雙週課表', 'Odd and even weeks']],
      ['class/4', ['現在、下一節與剩餘時間', 'Now, next, and time left']],
      ['class/5', ['調課幾秒完成', 'Swap a class in seconds']],
      ['class/6', ['大考倒數', 'Count down to the big exam']]
    ],
    now: 'class/3',
    then: ['then-class', ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use']]
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money', zh: true,
    q: ['這個月的錢花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money/1', ['一整個月的收支', 'Your month on a calendar']],
      ['money/2', ['發票自動對獎', 'Invoices checked for prizes']],
      ['money/3', ['發票品項一清二楚', 'Every item on the receipt']],
      ['money/4', ['統計與預算', 'Stats and budgets']],
      ['money/5', ['悠遊卡自動加值', 'EasyCard tops itself up']],
      ['money/6', ['幾秒就記一筆', 'Log spending in seconds']]
    ]
  },
  {
    id: 'words', brand: 'vocab', repo: 'Orbit-Words', zh: true,
    q: ['今天該背哪些字，才記得住？', 'Which words today, so they stick?'],
    shots: [
      ['words/1', ['容易混淆的選項', 'Tricky choices that teach']],
      ['words/2', ['每個單字都有解說', 'Every word, explained']],
      ['words/3', ['在對的時間複習', 'Review at the right time']],
      ['words/4', ['看見自己進步', 'Watch yourself improve']],
      ['words/5', ['等級與記憶', 'Levels and memory']],
      ['words/6', ['今天的單字', 'Today’s words']]
    ],
    now: 'words/1',
    then: ['then-words', ['第一天：高中英文參考詞彙表 Level 4–6', 'Day one: the high-school word list, Levels 4–6']]
  },
  {
    id: 'beats', brand: 'beats', repo: 'Orbit-Beats', zh: true,
    q: ['來點好聽、不會重複的音樂', 'Something good to hear that never repeats'],
    shots: [
      ['beats/1', ['每首歌都能玩節奏遊戲', 'A rhythm game for any song']],
      ['beats/2', ['各種心情的音樂', 'Music for any mood']],
      ['beats/3', ['用打擊墊即興', 'Jam on the pads']],
      ['beats/4', ['在樂器室做節拍', 'Make beats in the studio']],
      ['beats/5', ['每天新的精選', 'Fresh picks every day']],
      ['beats/6', ['用你的方式創作', 'Create your way']]
    ],
    now: 'beats/4',
    then: ['then-beats', ['第一天叫 Passion Beats：用錄音切成的節拍做歌', 'Day one was Passion Beats: songs from a recording cut into beats']]
  },
  {
    id: 'law', brand: 'law', repo: 'Orbit-Law', zh: true,
    q: ['我遇到的事，法律怎麼說？', 'What does the law say about what happened to me?'],
    shots: [
      ['law/1', ['用白話問法律', 'Ask the law in plain words']],
      ['law/2', ['每一條條文都能點', 'Every article, every link']],
      ['law/3', ['判決隨手查', 'Court rulings, searchable']],
      ['law/4', ['法案走到哪一步', 'Bills, stage by stage']],
      ['law/5', ['每個政黨怎麼投票', 'How every party voted']],
      ['law/6', ['重要大法官解釋', 'Landmark interpretations']]
    ]
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities', zh: true,
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities/1', ['真實台股規則、手續費與稅', 'Real TWSE rules, fees and tax']],
      ['securities/2', ['真實報價與 K 線', 'Real prices, real charts']],
      ['securities/3', ['你的績效對上大盤', 'You against the market']],
      ['securities/4', ['投資組合總覽', 'Your whole portfolio']],
      ['securities/5', ['台股、美股、基金一次看', 'Taiwan, US, funds and more']],
      ['securities/6', ['用銀行匯率換匯', 'Exchange at bank rates']]
    ],
    now: 'securities/2',
    then: ['then-securities', ['第一天叫 Stock Study：開一個模擬帳戶', 'Day one was Stock Study: open a practice account']]
  }
];
