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
      ['sports/2', ['台灣轉播的 15 項賽事，全在這', 'All 15 competitions on TV in Taiwan'], 'computer'],
      ['sports/3', ['每場比賽在哪一台播，一次看', 'Every game, and the channel it’s on']],
      ['sports/4', ['勝率走勢與關鍵時刻', 'How the game swung, and when']],
      ['sports/5', ['積分榜與爭冠形勢', 'The table and the title race'], 'tablet'],
      ['sports/6', ['每位球員的數據，一頁看完', 'Every player’s numbers on one page']]
    ],
    now: 'sports/1',
    then: ['then-sports', ['第一天叫 Match Find：一個網頁，推薦今天最值得看的一場', 'Day one was Match Find: one page recommending the game worth watching']]
  },
  {
    id: 'transit', brand: 'transit', repo: 'Orbit-Transit', zh: true,
    q: ['怎麼去最實際？公車還要等多久？', 'What’s the practical way there, and how long for the bus?'],
    shots: [
      ['transit/1', ['火車、公車、YouBike，一次排好', 'Train, bus and YouBike in one plan']],
      ['transit/2', ['每個車站的下一班，即時', 'Every station’s next train, live']],
      ['transit/3', ['兩站之間，每一班車', 'Every train between two stations']],
      ['transit/4', ['公車還要等幾分鐘', 'Minutes until your bus']],
      ['transit/5', ['YouBike 車位，即時', 'YouBike docks, live']],
      ['transit/6', ['全台捷運，照真的路線畫', 'Every metro, drawn true to its lines']]
    ],
    now: 'transit/1',
    then: ['then-transit', ['第一天：一張地圖，標出附近的 YouBike、公車站和火車站', 'Day one: a map of the YouBikes, bus stops and stations nearby']]
  },
  {
    id: 'weather', brand: 'weather', repo: 'Orbit-Weather', zh: true,
    q: ['今天要不要帶傘？', 'Do I need an umbrella today?'],
    shots: [
      ['weather/1', ['你所在的鄉鎮，天氣一眼看完', 'Your township’s weather, in one look']],
      ['weather/2', ['在電腦上，一整天一頁看完', 'On a computer, the whole day on one page'], 'computer'],
      ['weather/3', ['穿什麼、帶不帶傘，直接說', 'What to wear, umbrella or not']],
      ['weather/4', ['未來十天，哪天會下雨', 'Which of the next ten days it rains']],
      ['weather/5', ['每小時的溫度與降雨', 'Every hour’s temperature and rain'], 'tablet'],
      ['weather/6', ['空氣品質，每小時都看得到', 'Air quality, hour by hour']]
    ],
    now: 'weather/1',
    then: ['then-weather', ['第一天：一個簡單的預報頁（這張截圖的位置是伺服器所在地）', 'Day one: a simple forecast page (placed where the screenshot server is)']]
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class', zh: true,
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class/1', ['現在上什麼、還剩幾分鐘', 'What’s on now, and how long is left']],
      ['class/2', ['整週課表，單雙週都對', 'Your whole week, odd and even weeks'], 'computer'],
      ['class/3', ['考前讀書計畫，照範圍排好', 'A study plan for every exam']],
      ['class/4', ['調課，幾秒完成', 'Swap a class in seconds']],
      ['class/5', ['跟著一班真的飛機專注', 'Focus along a real flight'], 'tablet'],
      ['class/6', ['待辦和作業，跟課表放一起', 'To-dos and homework, beside your timetable']]
    ],
    now: 'class/1',
    then: ['then-class', ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use']]
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money', zh: true,
    q: ['這個月的錢花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money/1', ['一整個月，花多少一眼看', 'Your month, at a glance']],
      ['money/2', ['錢花到哪裡，一圈看懂', 'Where the money went'], 'computer'],
      ['money/3', ['幾秒記一筆，分類自動猜好', 'Log in seconds, category guessed']],
      ['money/4', ['銀行、信用卡、悠遊卡，全都管', 'Banks, cards and EasyCard, all in one']],
      ['money/5', ['一整年，每個月比一比', 'The whole year, month by month'], 'tablet'],
      ['money/6', ['問你的帳，答案畫成圖', 'Ask your books, see the answer']]
    ],
    now: 'money/1',
    then: ['then-money', ['第一天：一本金色的月曆帳本，還沒有一筆帳', 'Day one: a gold calendar book, not one entry yet']]
  },
  {
    id: 'news', brand: 'news', repo: 'Orbit-News', zh: true,
    q: ['同一件事，各家媒體怎麼報？', 'How does each side tell the same story?'],
    shots: [
      ['news/1', ['每則新聞，各家怎麼報一次看', 'Every story, as every outlet tells it']],
      ['news/2', ['同一件事，偏綠、中間、偏藍怎麼下標', 'One story, each side’s headline'], 'computer'],
      ['news/3', ['各家的影音新聞，一頁看', 'Every outlet’s video news, in one place']],
      ['news/4', ['國際大事，台灣媒體怎麼報', 'World news, and how Taiwan reports it']],
      ['news/5', ['118 家媒體，立場都有出處', '118 outlets, each place sourced'], 'tablet'],
      ['news/6', ['14 個主題，照重要程度排', '14 topics, ranked by importance']]
    ]
  },
  {
    id: 'words', brand: 'vocab', repo: 'Orbit-Words', zh: true,
    q: ['今天該背哪些字，才記得住？', 'Which words today, so they stick?'],
    shots: [
      ['words/1', ['今天該背的字，一打開就知道', 'Today’s words, the moment you open it']],
      ['words/2', ['6,169 個大考單字，真人發音', '6,169 exam words, each in a real voice'], 'computer'],
      ['words/3', ['新字一張一張背，真人唸給你聽', 'New words one card at a time, read aloud']],
      ['words/4', ['句子填空，在句子裡記字', 'Fill in sentences: words in context']],
      ['words/5', ['8 種練習方式，記得更牢', '8 ways to practise'], 'tablet'],
      ['words/6', ['搞混過的字，下次直接提醒你', 'Your mix-ups, shown to you next time']]
    ],
    now: 'words/1',
    then: ['then-words', ['第一天：高中英文參考詞彙表 Level 4–6', 'Day one: the high-school word list, Levels 4–6']]
  },
  {
    id: 'beats', brand: 'beats', repo: 'Orbit-Beats', zh: true,
    q: ['來點好聽、不會重複的音樂', 'Something good to hear that never repeats'],
    shots: [
      ['beats/1', ['手機現做的音樂，首首不重複', 'Endless music, made on your phone']],
      ['beats/2', ['在樂器室做節拍', 'Make beats in the studio'], 'computer'],
      ['beats/3', ['49 種曲風，說想聽什麼就換', '49 styles: say what you want to hear']],
      ['beats/4', ['16 個打擊墊，隨手即興', '16 pads to jam on']],
      ['beats/5', ['喜歡就收藏，首首都有封面', 'Keep favorites, each with its own cover'], 'tablet'],
      ['beats/6', ['每首歌都能玩節奏遊戲', 'A rhythm game for any song']]
    ],
    now: 'beats/1',
    then: ['then-beats', ['第一天叫 Passion Beats：用錄音切成的節拍做歌', 'Day one was Passion Beats: songs from a recording cut into beats']]
  },
  {
    id: 'law', brand: 'law', repo: 'Orbit-Law', zh: true,
    q: ['我遇到的事，法律怎麼說？', 'What does the law say about what happened to me?'],
    shots: [
      ['law/1', ['法律、判決、法案，一個 App 全包', 'Laws, rulings and bills, all in one app']],
      ['law/2', ['每部法律，連到修法、判決和釋憲', 'Every law linked to its bills and rulings'], 'computer'],
      ['law/3', ['4.7 萬則判決，憲法法庭到各級法院', '47,000 rulings, from the top court down']],
      ['law/4', ['白話問，答案附上條文', 'Ask in plain words, every point cited']],
      ['law/5', ['立法院近 8 千案，走到哪一步', 'Nearly 8,000 bills, each one’s stage'], 'tablet'],
      ['law/6', ['22 縣市議會和代表會，影音都在', 'Every council, down to the townships']]
    ],
    now: 'law/1',
    then: ['then-law', ['第一天：一個法規閱讀器，1,351 部法律', 'Day one: a law reader, 1,351 laws']]
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities', zh: true,
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities/1', ['你的總資產，一眼看', 'Everything you own, at a glance']],
      ['securities/2', ['真實報價與 K 線', 'Real prices, real charts'], 'computer'],
      ['securities/3', ['全世界的市場，一個帳戶買', 'Every market, one account']],
      ['securities/4', ['市價、限價、停損，像真的券商', 'Market, limit and stop orders']],
      ['securities/5', ['換匯照銀行牌價', 'Exchange at the bank’s rates'], 'tablet'],
      ['securities/6', ['今天誰漲誰跌，一頁看完', 'Today’s movers, on one page']]
    ],
    now: 'securities/1',
    then: ['then-securities', ['第一天叫 Stock Study：開一個模擬帳戶', 'Day one was Stock Study: open a practice account']]
  }
];
