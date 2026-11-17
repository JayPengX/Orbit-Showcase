// The App tab: each app's screens, the README's own six posters (shots/<app>/N.webp,
// made by Orbit-Core tools/store-shots.mjs: real data, made-up accounts, light and
// dark mixed, Chinese and English the same screen), what it is in one line, the
// question it answers (a | in its Chinese: where a narrow phone may break the line, as
// after its own commas, so it never breaks mid-word), its tree branch, and `then`: the app on its first day beside
// today, both whole, side by side (Jay 11-17: a slider showing half of two different
// screens was a bad picture). `day1` is its first day's code run again (shots/<app>/day1:
// served as it was, on that run's real data, in the language it spoke),
// `now` today's screen doing the same job, in the same theme, on the same phone: the
// first poster's bare screen (<app>/screen), or one shot for the pair (<app>/now: Weather
// at the same place and Securities on the same account, at the same moment; Money in
// light, as its first day was); `was` and `is` say what each shows. `brand` is the kit's BRANDS id, `repo` matches
// scripts/stats.mjs. In the family's order (Orbit-Core kit/brand.mjs APP_ORDER): the
// everyday apps first, Securities last.
export const APPS = [
  {
    id: 'sports', brand: 'match', repo: 'Orbit-Sports', zh: true,
    q: ['今晚有什麼|比賽值得看？在哪一台？', 'Which games tonight are worth it, and on which channel?'],
    shots: [
      ['sports/1', ['你的比賽，一打開就看到', 'Your games, the moment you open it']],
      ['sports/2', ['台灣轉播的 15 項賽事，全在這', 'All 15 competitions on TV in Taiwan'], 'computer'],
      ['sports/3', ['每場比賽在哪一台播，一次看', 'Every game, and the channel it’s on']],
      ['sports/4', ['打完的比賽，比分和誰最亮眼', 'A finished game: the score and who stood out']],
      ['sports/5', ['比賽一結束，積分榜馬上更新', 'The table updates the moment a game ends'], 'tablet'],
      ['sports/6', ['每位球員的數據，一頁看完', 'Every player’s numbers on one page']]
    ],
    then: { day1: 'sports/day1', was: ['Match Find：一個網頁，只挑一場比賽', 'Match Find: one page picking one game'], now: 'sports/screen', is: ['你追的比賽、在哪一台播，一打開就看到', 'Your games and their channels, the moment you open it'] }
  },
  {
    id: 'transit', brand: 'transit', repo: 'Orbit-Transit', zh: true,
    q: ['怎麼去最實際？公車還要等多久？', 'What’s the practical way there, and how long for the bus?'],
    shots: [
      ['transit/1', ['捷運、公車、YouBike，一次排好', 'Metro, bus and YouBike in one plan']],
      ['transit/2', ['每個車站的下一班，即時', 'Every station’s next train, live'], 'computer'],
      ['transit/3', ['兩站之間，每一班車', 'Every train between two stations']],
      ['transit/4', ['公車還要等幾分鐘', 'Minutes until your bus']],
      ['transit/5', ['全台捷運，照真的路線畫', 'Every metro, drawn true to its lines'], 'tablet'],
      ['transit/6', ['YouBike 車位，即時', 'YouBike docks, live']]
    ],
    then: { day1: 'transit/day1', was: ['一張地圖，標出附近的 YouBike、公車站和車站', 'A map of the YouBikes, bus stops and stations nearby'], now: 'transit/screen', is: ['捷運、公車、YouBike，一次排好', 'Metro, bus and YouBike in one plan'] }
  },
  {
    id: 'weather', brand: 'weather', repo: 'Orbit-Weather', zh: true,
    q: ['今天要不要帶傘？', 'Do I need an umbrella today?'],
    shots: [
      ['weather/1', ['你所在的鄉鎮，天氣一眼看完', 'Your township’s weather, in one look']],
      ['weather/2', ['幾個來源合成，比只看一家準', 'Several sources blended, closer than any one'], 'computer'],
      ['weather/3', ['穿什麼、帶不帶傘，直接說', 'What to wear, umbrella or not']],
      ['weather/4', ['未來十天，哪天會下雨', 'Which of the next ten days it rains']],
      ['weather/5', ['每小時的溫度和雨，一眼看懂', 'Every hour’s temperature and rain, at a glance'], 'tablet'],
      ['weather/6', ['空氣品質，每小時都看得到', 'Air quality, hour by hour']]
    ],
    then: { day1: 'weather/day1', was: ['你所在地方的預報，提醒排成一串小標籤', 'The forecast where you are, its tips a row of tags'], now: 'weather/now', is: ['同一個地方、同一刻：重點一張卡看完，下面每小時', 'Same place, same moment: the gist on one card, then each hour'] }
  },
  {
    id: 'class', brand: 'orbit', repo: 'Orbit-Class', zh: true,
    q: ['現在上什麼課？下一節去哪？', 'Which class is it now, and what’s next?'],
    shots: [
      ['class/1', ['現在上什麼、還剩幾分鐘', 'What’s on now, and how long is left']],
      ['class/2', ['整週課表，單雙週都對', 'Your whole week, odd and even weeks'], 'computer'],
      ['class/3', ['點一科，下次幾點上、一週幾節', 'Tap a class: when it’s next, how many a week']],
      ['class/4', ['調課，幾秒完成', 'Swap a class in seconds']],
      ['class/5', ['專心讀書，跟著一班真的飛機', 'Study along with a real flight in the sky'], 'tablet'],
      ['class/6', ['待辦和作業，跟課表放一起', 'To-dos and homework, beside your timetable']]
    ],
    then: { day1: 'class/day1', was: ['上 GitHub 那天的 Orbit Color：一個 4,102 行的網頁檔，那時已經用了好幾個月', 'Orbit Color the day it reached GitHub: one 4,102-line page, already months in use'], now: 'class/screen', is: ['現在上什麼、還剩幾分鐘、下一節是什麼', 'What’s on, how long is left, and what’s next'] }
  },
  {
    id: 'money', brand: 'money', repo: 'Orbit-Money', zh: true,
    q: ['這個月的錢|花到哪裡去了？', 'Where did this month’s money go?'],
    shots: [
      ['money/1', ['一整個月，花多少一眼看', 'Your month, at a glance']],
      ['money/2', ['錢花到哪裡，一圈看懂', 'Where the money went'], 'computer'],
      ['money/3', ['幾秒記一筆，分類自動猜好', 'Log in seconds, category guessed']],
      ['money/4', ['銀行、信用卡、悠遊卡，全都管', 'Banks, cards and EasyCard, all in one']],
      ['money/5', ['一整年，每個月比一比', 'The whole year, month by month'], 'tablet'],
      ['money/6', ['問你的帳，答案畫成圖', 'Ask your books, see the answer']]
    ],
    then: { day1: 'money/day1', was: ['一本金色的月曆帳本，還沒有一筆帳', 'A gold calendar book, not one entry yet'], now: 'money/now', is: ['這個月還能花多少、每天能花多少，一眼看', 'What’s left this month, and per day, at a glance'] }
  },
  {
    id: 'news', brand: 'news', repo: 'Orbit-News', zh: true,
    q: ['同一件事，各家媒體怎麼報？', 'How does each side tell the same story?'],
    shots: [
      ['news/1', ['每則新聞，各家怎麼報一次看', 'Every story, as every outlet tells it']],
      ['news/2', ['同一件事，偏綠、中間、偏藍怎麼下標', 'One story, each side’s headline'], 'computer'],
      ['news/3', ['各家的影音新聞，一頁看', 'Every outlet’s video news, in one place']],
      ['news/4', ['搜尋任何公司、人物，所有媒體一起找', 'Search any company or person, across every outlet']],
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
    then: { day1: 'words/day1', was: ['高中英文參考詞彙表 Level 4–6，自己選範圍練習', 'The high-school word list, Levels 4–6: pick a range and practise'], now: 'words/screen', is: ['今天該背哪些字，一打開就知道', 'Today’s words, the moment you open it'] }
  },
  {
    id: 'beats', brand: 'beats', repo: 'Orbit-Beats', zh: true,
    q: ['來點好聽、不會重複的音樂', 'Something good to hear that never repeats'],
    shots: [
      ['beats/1', ['手機現做的音樂，首首不重複', 'Endless music, made on your phone']],
      ['beats/2', ['49 種曲風，說想聽什麼就換', '49 styles: say what you want to hear'], 'computer'],
      ['beats/3', ['在樂器室，做你自己的節拍', 'Make your own beats in the studio']],
      ['beats/4', ['16 個打擊墊，隨手即興', '16 pads to jam on']],
      ['beats/5', ['喜歡就收藏，首首都有封面', 'Keep favorites, each with its own cover'], 'tablet'],
      ['beats/6', ['每首歌都能玩節奏遊戲', 'A rhythm game for any song']]
    ],
    then: { day1: 'beats/day1', was: ['Passion Beats：用一段錄音切成的節拍做歌', 'Passion Beats: songs from a recording cut into beats'], now: 'beats/screen', is: ['手機現做的音樂，首首不重複', 'Endless music, made on your phone'] }
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
    then: { day1: 'law/day1', was: ['一個法規閱讀器，1,351 部法律', 'A law reader, 1,351 laws'], now: 'law/screen', is: ['有法律問題用白話問，答案附上條文', 'Ask in plain words; every answer cites the law'] }
  },
  {
    id: 'securities', brand: 'stock', repo: 'Orbit-Securities', zh: true,
    q: ['在不花真錢的情況下，學會台灣的股市規則', 'Learn Taiwan’s market rules without spending real money'],
    shots: [
      ['securities/1', ['不花真錢，照真的行情投資', 'Real markets, no real money']],
      ['securities/2', ['真實報價與 K 線', 'Real prices, real charts'], 'computer'],
      ['securities/3', ['全世界的市場，一個帳戶買', 'Every market, one account']],
      ['securities/4', ['市價、限價、停損，像真的券商', 'Market, limit and stop orders']],
      ['securities/5', ['換匯照銀行牌價', 'Exchange at the bank’s rates'], 'tablet'],
      ['securities/6', ['今天誰漲誰跌，一頁看完', 'Today’s movers, on one page']]
    ],
    then: { day1: 'securities/day1', was: ['Stock Study：總資產和它的走勢', 'Stock Study: your net worth and its line'], now: 'securities/now', is: ['同一個帳戶、同一刻：持股和關注的股票，即時漲跌', 'Same account, same moment: holdings and watchlist, live'] }
  }
];

// A line cut into the phrases it may break between: at a |, and after its own
// commas and question marks (the mark stays with the words before it).
// (Without a look-behind in the pattern: Safari before 16.4 can't read one,
// and a page module it can't read leaves the whole page blank, 11-18.)
export const phrases = s => s.split('|').flatMap(p => p.match(/[^，、？；：]*[，、？；：]|[^，、？；：]+$/g) || [p]);
