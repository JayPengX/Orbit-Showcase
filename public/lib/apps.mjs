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
      ['sports/2', ['問你的球隊，AI 從真資料回答', 'Ask about your teams, answered from real data']],
      ['sports/3', ['賽後三句話，球員和球隊一眼認', 'Three lines after the game, faces and logos']],
      ['sports/4', ['F1 勝負關鍵，AI 讀完整場', 'What decided the F1 race']],
      ['sports/5', ['正在轉播的比賽，一鍵觀看', 'What’s on now, one tap to watch']],
      ['sports/6', ['勝率走勢與關鍵時刻', 'How the game swung, and when']],
      ['sports/7', ['F1 每一站，倒數到起跑', 'Every F1 weekend, counted down']],
      ['sports/8', ['積分榜與爭冠形勢', 'The table and the title race']],
      ['sports/9', ['每位球員的完整生涯', 'Every player’s whole career']]
    ]
  },
  {
    id: 'transit', brand: 'transit', repo: 'Orbit-Transit', zh: true,
    q: ['怎麼去最實際？公車還要等多久？', 'What’s the practical way there, and how long for the bus?'],
    shots: [
      ['transit/1', ['路線畫在 Google 地圖上', 'Your trip on Google Maps']],
      ['transit/2', ['用說的查路線', 'Just say where you’re going']],
      ['transit/3', ['最快的走法，一眼看懂', 'The fastest way, at a glance']],
      ['transit/4', ['兩站之間每一班車', 'Every train between two stations']],
      ['transit/5', ['公車還要等多久', 'How long until the bus']],
      ['transit/6', ['YouBike 即時車位', 'YouBike docks, live']],
      ['transit/7', ['車站即時班次', 'Live trains at the station']],
      ['transit/8', ['捷運路網，照真的路線畫', 'Metro maps, true to the lines']],
      ['transit/9', ['高鐵訂位一路帶到底', 'High-speed rail, booked through']]
    ]
  },
  {
    id: 'weather', brand: 'weather', repo: 'Orbit-Weather', zh: true,
    q: ['今天要不要帶傘？', 'Do I need an umbrella today?'],
    shots: [
      ['weather/1', ['今天天氣一眼看完', 'Today, in one look']],
      ['weather/2', ['用問的：明天會下雨嗎？', 'Just ask: will it rain tomorrow? (in Chinese)']],
      ['weather/3', ['未來十天降雨', 'Rain, ten days ahead']],
      ['weather/4', ['一天的每小時', 'Every hour of the day']],
      ['weather/5', ['附近空氣品質', 'The air around you']],
      ['weather/6', ['今日數據與貼心建議', 'Today’s numbers, and advice']],
      ['weather/7', ['你的每個地點', 'Every place you keep']],
      ['weather/8', ['明天每小時的天氣', 'Tomorrow, hour by hour']],
      ['weather/9', ['首頁照你的習慣排', 'Your home, in your order']]
    ],
    now: 'weather/1',
    then: ['then-weather', ['第一天：一個簡單的預報頁（這張截圖的位置是伺服器所在地）', 'Day one: a simple forecast page (placed where the screenshot server is)']]
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class', zh: true,
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class/1', ['現在、下一節與剩餘時間', 'Now, next, and time left']],
      ['class/2', ['跟著真的飛機專注', 'Focus on a real flight']],
      ['class/3', ['用說的改課表，也能問課表', 'Change or ask your timetable in words']],
      ['class/4', ['整週課表一眼看', 'Your whole week']],
      ['class/5', ['每一節課的細節', 'Every class, in detail']],
      ['class/6', ['調課幾秒完成', 'Swap a class in seconds']],
      ['class/7', ['拍下課表，AI 幫你讀', 'Snap it, AI reads it']],
      ['class/8', ['課表加到手機行事曆', 'Your timetable in your calendar']],
      ['class/9', ['今天的課與倒數', 'Today’s classes and countdowns']]
    ],
    now: 'class/1',
    then: ['then-class', ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use']]
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money', zh: true,
    q: ['這個月的錢花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money/1', ['一整個月的收支', 'Your month on a calendar']],
      ['money/2', ['問你的帳，答案畫成圖', 'Ask your books, see the answer']],
      ['money/3', ['幾秒就記一筆', 'Log spending in seconds']],
      ['money/4', ['錢花到哪裡，一圈看懂', 'Where the money went']],
      ['money/5', ['每個帳戶與悠遊卡', 'Every account, EasyCard too']],
      ['money/6', ['一整年的走勢', 'The whole year']],
      ['money/7', ['早餐、午餐、晚餐分開記', 'Breakfast, lunch and dinner apart']],
      ['money/8', ['十二大類，一眼分好', 'Twelve broad categories']],
      ['money/9', ['越用越懂你的習慣', 'It learns your habits']]
    ]
  },
  {
    id: 'news', brand: 'news', repo: 'Orbit-News', zh: true,
    q: ['同一件事，各家媒體怎麼報？', 'How does each side tell the same story?'],
    shots: [
      ['news/1', ['今天的頭條，各家怎麼報', 'Today’s top stories, every side']],
      ['news/2', ['同一則新聞，每一邊的標題', 'One story, each side’s headlines']],
      ['news/3', ['今天五則，挑給你的', 'Today’s five, picked for you']],
      ['news/4', ['台灣新聞，依重要程度排', 'Taiwan’s news, by importance']],
      ['news/5', ['國際新聞，左中右一眼看', 'World news, left to right']],
      ['news/6', ['只有一邊在報的新聞', 'Stories only one side carries']],
      ['news/7', ['每家媒體的立場與來源', 'Every outlet’s place, and why']],
      ['news/8', ['科技新聞，各方一起看', 'Tech news, every side']],
      ['news/9', ['政治新聞，標出立場', 'Politics, each side marked']]
    ]
  },
  {
    id: 'words', brand: 'vocab', repo: 'Orbit-Words', zh: true,
    q: ['今天該背哪些字，才記得住？', 'Which words today, so they stick?'],
    shots: [
      ['words/1', ['今日目標與連續天數', 'Today’s goal and streak']],
      ['words/2', ['用新字跟 AI 聊天', 'Chat with AI using new words']],
      ['words/3', ['答完馬上知道為什麼', 'Know why, right away']],
      ['words/4', ['每個單字都有解說', 'Every word, explained']],
      ['words/5', ['多種練習模式', 'Many ways to practise']],
      ['words/6', ['用例句練習', 'Practise in sentences']],
      ['words/7', ['拼字比賽模擬考', 'A mock spelling contest']],
      ['words/8', ['單字卡複習', 'Flash cards']],
      ['words/9', ['看見自己進步', 'Watch yourself improve']]
    ],
    now: 'words/1',
    then: ['then-words', ['第一天：高中英文參考詞彙表 Level 4–6', 'Day one: the high-school word list, Levels 4–6']]
  },
  {
    id: 'beats', brand: 'beats', repo: 'Orbit-Beats', zh: true,
    q: ['來點好聽、不會重複的音樂', 'Something good to hear that never repeats'],
    shots: [
      ['beats/1', ['為你做的音樂', 'Music made for you']],
      ['beats/2', ['說想聽什麼，就換成那種歌', 'Say what you want to hear']],
      ['beats/3', ['各種心情與電台', 'Moods and stations']],
      ['beats/4', ['用你的方式創作', 'Create your way']],
      ['beats/5', ['在樂器室做節拍', 'Make beats in the studio']],
      ['beats/6', ['用打擊墊即興', 'Jam on the pads']],
      ['beats/7', ['每首歌都能玩節奏遊戲', 'A rhythm game for any song']],
      ['beats/8', ['正在播放', 'Now playing']],
      ['beats/9', ['收藏你喜歡的歌', 'Keep the songs you like']]
    ],
    now: 'beats/3',
    then: ['then-beats', ['第一天叫 Passion Beats：用錄音切成的節拍做歌', 'Day one was Passion Beats: songs from a recording cut into beats']]
  },
  {
    id: 'law', brand: 'law', repo: 'Orbit-Law', zh: true,
    q: ['我遇到的事，法律怎麼說？', 'What does the law say about what happened to me?'],
    shots: [
      ['law/1', ['用白話問法律，每句都附條文', 'Ask in plain words, every point cited']],
      ['law/2', ['22 個縣市議會都在這', 'All 22 city and county councils']],
      ['law/3', ['連鄉鎮市民代表會都有', 'Down to every township council']],
      ['law/4', ['代表會的決議、質詢與錄音', 'A township’s votes, questions and recordings']],
      ['law/5', ['每個議會哪天開會，錄影都在', 'Every council’s sittings, day by day']],
      ['law/6', ['每一條條文都能點', 'Every article, every link']],
      ['law/7', ['法案改了什麼', 'What a bill changes']],
      ['law/8', ['每個政黨怎麼投票', 'How every party voted']],
      ['law/9', ['判決隨手查', 'Court rulings, searchable']]
    ]
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities', zh: true,
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities/1', ['投資組合總覽', 'Your whole portfolio']],
      ['securities/2', ['用說的下單，單子幫你填好', 'Say the order, the ticket fills itself']],
      ['securities/3', ['真實報價與 K 線', 'Real prices, real charts']],
      ['securities/4', ['真實台股規則、手續費與稅', 'Real TWSE rules, fees and tax']],
      ['securities/5', ['台股、美股、基金一次看', 'Taiwan, US, funds and more']],
      ['securities/6', ['你的交易紀錄', 'Every trade you made']],
      ['securities/7', ['交易統計與勝率', 'Your trading, in numbers']],
      ['securities/8', ['配息、定期定額與提醒', 'Dividends, plans and alerts']],
      ['securities/9', ['用銀行匯率換匯', 'Exchange at bank rates']]
    ],
    now: 'securities/1',
    then: ['then-securities', ['第一天叫 Stock Study：開一個模擬帳戶', 'Day one was Stock Study: open a practice account']]
  }
];
