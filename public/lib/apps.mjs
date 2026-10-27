// The App tab: each app's screens, the same six as its README (made-up data,
// never anyone's own; light and dark mixed; about half sell the app's main
// idea, half show its general look; framing only, never an edited screen),
// `now`, the light one the day-one picture is compared with, what it is in
// one line, the question it answers, its tree branch, and how it looked on its
// first day where that first version still runs. `brand` is the kit's BRANDS
// id, `repo` matches scripts/stats.mjs.
export const APPS = [
  {
    id: 'sports', brand: 'match', repo: 'Orbit-Sports', zh: true,
    q: ['今晚有什麼比賽值得看？在哪一台？', 'Which games tonight are worth it, and on which channel?'],
    shots: [
      ['sports/1', ['每場比賽，完整呈現', 'Every game, in full']],
      ['sports/2', ['數據一目了然', 'Box scores and stats']],
      ['sports/3', ['聯盟排行即時更新', 'League leaders, live']],
      ['sports/4', ['各聯盟積分榜', 'Standings for every league']],
      ['sports/5', ['先看你追的球隊', 'Your teams come first']],
      ['sports/6', ['季後賽對戰圖', 'The whole playoff bracket']]
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
      ['weather/6', ['今天的貼心提醒', 'Advice for your day']]
    ],
    now: 'weather/1',
    then: ['then-weather', ['第一天：一個簡單的預報頁（這張截圖的位置是伺服器所在地）', 'Day one: a simple forecast page (placed where the screenshot server is)']]
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class', zh: true,
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class/1', ['現在、下一節與倒數', 'Now, next, and how long']],
      ['class/2', ['整週課表', 'Your whole week']],
      ['class/3', ['每一節課點開就有', 'Every class, one tap']],
      ['class/4', ['大考倒數', 'Count down to the big exam']],
      ['class/5', ['調課幾秒完成', 'Swap a class in seconds']],
      ['class/6', ['上課實用小工具', 'Handy tools for school']]
    ],
    now: 'class/1',
    then: ['then-class', ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use']]
  },
  {
    id: 'words', brand: 'vocab', repo: 'Orbit-Words', zh: true,
    q: ['今天該背哪些字，才記得住？', 'Which words today, so they stick?'],
    shots: [
      ['words/1', ['每天一小輪', 'A quick round a day']],
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
      ['beats/1', ['用你的節拍做出新歌', 'New songs from your beats']],
      ['beats/2', ['選個心情就播放', 'Pick a mood and play']],
      ['beats/3', ['調出你要的聲音', 'Shape every sound']],
      ['beats/4', ['一起即興', 'Jam along']],
      ['beats/5', ['自己創作', 'Make your own']],
      ['beats/6', ['整天播不停', 'Keeps playing all day']]
    ],
    now: 'beats/1',
    then: ['then-beats', ['第一天叫 Passion Beats：用錄音切成的節拍做歌', 'Day one was Passion Beats: songs from a recording cut into beats']]
  },
  {
    id: 'law', brand: 'law', repo: 'Orbit-Law', zh: true,
    q: ['我遇到的事，法律怎麼說？', 'What does the law say about what happened to me?'],
    shots: [
      ['law/1', ['台灣法律一次看懂', 'Taiwan’s law, made clear']],
      ['law/2', ['每一條條文都能點', 'Every article, every link']],
      ['law/3', ['判決隨手查', 'Court rulings, searchable']],
      ['law/4', ['法案走到哪一步', 'Bills, stage by stage']],
      ['law/5', ['所有法規一處找', 'Every law in one place']],
      ['law/6', ['重要大法官解釋', 'Landmark interpretations']]
    ]
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities', zh: true,
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities/1', ['真實報價，模擬交易', 'Real prices, play money']],
      ['securities/2', ['個股資訊完整', 'Every stock, in depth']],
      ['securities/3', ['市場動態一目了然', 'Markets at a glance']],
      ['securities/4', ['投資組合總覽', 'Your whole portfolio']],
      ['securities/5', ['全球市場', 'Markets worldwide']],
      ['securities/6', ['換匯也能練習', 'Exchange currencies']]
    ],
    now: 'securities/2',
    then: ['then-securities', ['第一天叫 Stock Study：開一個模擬帳戶', 'Day one was Stock Study: open a practice account']]
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money', zh: true,
    q: ['這個月的錢花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money/1', ['一整個月的收支', 'Your month on a calendar']],
      ['money/2', ['幾秒就記一筆', 'Log spending in seconds']],
      ['money/3', ['所有帳戶一起看', 'Every account together']],
      ['money/4', ['錢花去哪裡', 'Where the money goes']],
      ['money/5', ['分類統計', 'Spending by category']],
      ['money/6', ['發票整理好', 'Invoices, sorted']]
    ]
  }
];
