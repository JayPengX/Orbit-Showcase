// The apps that run for real inside the showcase (frozen copies under
// demo/, scripts/demo/), and each one's guided tour: a step points at what
// to tap in the app (`tap`, a selector inside it) and says why, in plain
// words; `type`, words typed into the box once it's tapped. The recording
// walks the same steps, so every tap has its answers.
// `real`: its data is the real feeds' at the moment it was recorded, not made up.
// `live`: it can also run on today's data (the player's 即時; a showcase pass, Orbit-Core showcase.js).
export const DEMOS = {
  weather: { repo: 'Orbit-Weather', live: true },
  money: { repo: 'Orbit-Money' },
  words: { repo: 'Orbit-Words' },
  sports: { repo: 'Orbit-Sports', real: true, live: true },
  securities: { repo: 'Orbit-Securities', real: true },
  class: { repo: 'Orbit-Class' },
  beats: { repo: 'Orbit-Beats' },
  law: { repo: 'Orbit-Law', real: true },
  transit: { repo: 'Orbit-Transit', real: true, live: true },
  news: { repo: 'Orbit-News', real: true }
};

export const TOURS = {
  news: [
    { say: ['118 家媒體的新聞，同一件事放在一起。', '118 outlets’ news, with each event in one place.'] },
    { tap: '.nw-card', say: ['點一則，看各家怎麼報同一件事', 'Tap one: how each outlet tells the same event'] },
    { tap: 'dialog[open] .q-close', say: ['看完關掉', 'Close it'] },
    { tap: '#tab-tw', say: ['台灣新聞，照主題分好', 'Taiwan’s news, sorted by topic'] },
    { tap: '#tab-intl', say: ['國際新聞，看台灣媒體怎麼報', 'World news, as Taiwan’s outlets tell it'] },
    { tap: '#tab-outlets', say: ['每家媒體偏哪邊，都有研究出處', 'Where each outlet leans, with the research behind it'] },
    { tap: '.nw-chip', say: ['點一家，看它為什麼在那裡', 'Tap one to see why it sits there'] }
  ],
  law: [
    { say: ['法律、判決、立法院和地方議會，全部互相連結，用白話看懂。', 'Laws, rulings, the legislature and local councils, all linked, in plain words.'] },
    { tap: '.nv-topic', wait: 2500, say: ['依生活的事找：勞動', 'Find by what it’s about: work'] },
    { tap: '.lw-quick-q:nth-child(3)', wait: 3500, say: ['問一個常見問題：特休有幾天？', 'A common question: how many days of leave?'] },
    { tap: '.lw-find-card', wait: 3500, say: ['直接找到答案在哪一條', 'Straight to the article that answers it'] },
    { tap: '#a-38 .lw-rul', wait: 3500, say: ['這一條，法院怎麼判', 'How courts have ruled on it'] },
    { tap: 'dialog[open] .q-close', say: ['看完關掉', 'Close it'] },
    { tap: '#a-38 .lw-pending', wait: 3500, say: ['立法院正在提的修法，也連在這一條', 'Changes proposed in the legislature, linked right here'] },
    { tap: 'dialog[open] .q-close', say: ['關掉', 'Close'] },
    { tap: '#tab-bills', wait: 4000, say: ['立法院的每個法案，走到哪一步', 'Every bill in the legislature, and how far it’s got'] },
    { tap: '.lw-scope [data-id="local"]', wait: 4000, say: ['地方：22 個縣市議會和 204 個鄉鎮代表會', 'Local: 22 county councils and 204 township councils'] }
  ],
  beats: [
    { say: ['每一首歌都是手機當場做出來的，不會重複，也不用下載。', 'Every song is made on the phone as it plays: never repeated, nothing downloaded.'] },
    { tap: '.bt-now .bt-play', wait: 4000, say: ['播放今天的第一首', 'Play today’s first song'] },
    { tap: '.bt-now .bt-ctl .bt-btn:last-child', wait: 3000, say: ['換下一首：又是全新的一首', 'Skip: another brand-new song'] },
    { tap: '.bt-st[data-station="hype"]', wait: 3000, say: ['選一個電台，曲風跟著換', 'Pick a station; the style changes with it'] },
    { tap: '#tab-create', say: ['自己來做音樂', 'Make your own'] },
    { tap: '.cr-jam-open', wait: 2500, say: ['16 個打擊墊即興', 'Jam on 16 pads'] },
    { tap: '.jam-play', wait: 3000, say: ['按開始，節奏跑起來', 'Start: the beat runs'] },
    { tap: '.jam-tiles button:nth-of-type(4)', wait: 2500, say: ['加上旋律', 'Add a melody'] },
    { tap: '.jam-tiles button:nth-of-type(6)', wait: 2500, say: ['換一種貝斯', 'Swap the bass'] },
    { tap: '#subnav-back', say: ['回去', 'Back'] },
    { tap: '.cr-ways .q-ritem:nth-child(3)', wait: 3000, say: ['節奏遊戲：每首歌都是一關', 'The rhythm game: every song is a level'] },
    { tap: '.gm-list > :first-child', wait: 2500, say: ['選一首', 'Pick a song'] },
    { tap: '.gm-level', wait: 16000, say: ['從簡單開始，跟著節拍點', 'Start easy: tap on the beat'] }
  ],
  transit: [
    { say: ['公車、台鐵、高鐵、捷運和 YouBike，排成一趟路線。地圖上的黃點是 YouBike 站。', 'Buses, trains, high-speed rail, metro and YouBike, planned as one trip. The yellow dots are YouBike stations.'] },
    { tap: '#q', type: '台北101', after: 1800, wait: 8000, say: ['搜尋要去的地方', 'Search for a place'] },
    { tap: '.ot-res', wait: 3000, say: ['選台北 101', 'Pick Taipei 101'] },
    { tap: '[data-card="go"]', after: 2500, wait: 12000, say: ['規劃怎麼去：每種交通一起比', 'Plan it: every way to go, compared'] },
    { tap: '.ot-plan[data-plan="0"]', wait: 5000, say: ['最好的走法排第一，下一班車也列好', 'The best way first, with the next departures'] },
    { tap: '#tab-times', wait: 3000, say: ['查時刻', 'Timetables'] },
    { tap: '[data-view="bus"]', wait: 7000, say: ['附近每一站的公車', 'Buses at every stop nearby'] },
    { tap: '.ot-bus-no', wait: 5000, say: ['點一路公車', 'Tap a bus'] },
    { tap: '.q-close', say: ['每站幾分鐘到，都在這裡', 'Minutes to every stop'] }
  ],
  class: [
    { say: ['最上面是現在這節課，倒數到下課。', 'The class on now, counting down to the bell.'] },
    { tap: '.q-chip.day[data-day="2026-10-29"]', say: ['看明天的課', 'See tomorrow'] },
    { tap: '.q-tab[data-tab="week"]', say: ['整週課表', 'The whole week'] },
    { tap: '.q-tab[data-tab="tools"]', say: ['改課表、考試倒數', 'Edit it, count down to exams'] }
  ],
  securities: [
    { say: ['模擬投資：真的報價、真的台灣券商規則，用的是練習資金。', 'Practice investing: real prices and Taiwan’s real broker rules, on practice money.'] },
    { tap: '[data-action="mover-group"][data-v="tw"]', say: ['看台股今天的漲跌', 'Today’s Taiwan movers'] },
    { tap: '.sc-movers .sc-row', say: ['點漲最多的這檔', 'Tap the top gainer'] },
    { tap: '[data-action="chart-style"][data-v="candle"]', say: ['換成 K 線', 'Switch to candles'] },
    { tap: '.q-btn.trade.buy', say: ['買進（練習資金）', 'Buy, with practice money'] },
    { tap: '[data-action="qty"][data-qty="1"]', say: ['先買 1 股零股', 'Just 1 share, an odd lot'] },
    { tap: '[data-action="otype"][data-otype="limit"]', say: ['零股只能掛限價', 'Odd lots are limit orders'] },
    { tap: '[data-action="place"]', say: ['手續費和稅已算好，送出', 'Fees and tax included: send'] },
    { tap: '.q-ask-actions .q-btn.primary', say: ['確認', 'Confirm'] },
    { tap: '.q-close', say: ['關掉這一檔', 'Close this stock'] },
    { tap: '.q-tab[data-tab="history"]', say: ['剛才的委託在這裡，開盤就成交', 'Your order is here; it fills when the market opens'] }
  ],
  sports: [
    { say: ['第一次打開，先選你看的運動。', 'First time in: pick the sports you watch.'] },
    { tap: '.sport-grid > :nth-child(1)', say: ['先選最常看的運動', 'First the sport you watch most'] },
    { tap: '.sport-grid > :nth-child(2)', say: ['再選一個：數字就是先後', 'Then another: the number is the order'] },
    { tap: '.sport-grid > :nth-child(3)', say: ['想看的都選上', 'Pick every one you watch'] },
    { tap: '.sp-done', wait: 6000, say: ['今天在台灣看得到的比賽，放在一起', 'Today’s games you can watch in Taiwan, together'] },
    { tap: 'button.event-row:not(.wide)', wait: 5000, say: ['點一場推薦的比賽', 'Tap a top pick'] },
    { tap: '.match-tabs .q-seg button:last-child', wait: 3000, say: ['兩隊在聯賽排第幾', 'Where both sides stand in the league'] },
    { tap: '.q-close', say: ['看完關掉', 'Close it'] },
    { tap: '#tab-matches', wait: 5000, say: ['每個聯賽的賽程和排名', 'Every league’s games and table'] },
    { tap: '[data-league="f1"]', wait: 5000, say: ['F1：每一站、每一節', 'F1: every race, every session'] },
    { tap: '.race-part button:nth-child(2)', say: ['看已經比完的', 'See the finished ones'] },
    { tap: '.wk-card', wait: 10000, say: ['冠軍、每一節、完整成績', 'Winner, sessions, full results'] },
    { tap: '.lb-views .q-chip:nth-child(2)', wait: 4000, say: ['每位車手怎麼換胎', 'Each driver’s tyres'] },
    { tap: '.lb-views .q-chip:nth-child(3)', wait: 4000, say: ['每一圈跑多快', 'Every lap’s time'] },
    { tap: '.q-close', say: ['關掉', 'Close it'] },
    { tap: '#tab-live', wait: 5000, say: ['哪一台、幾點、播哪場', 'Which channel shows what, when'] }
  ],
  words: [
    { say: ['6,169 個大考單字：記憶模型算出你快忘記的時候，那時才考你。', '6,169 exam words: a memory model asks each one just before you’d forget it.'] },
    { tap: '.q-hc-btn', say: ['開始今天的字', 'Start today’s words'] },
    { tap: '.choice', say: ['選一個意思，錯了也沒關係', 'Pick a meaning; wrong is fine'] },
    { tap: '.q-btn.primary', say: ['下一題', 'Next'] },
    { tap: '.choice', say: ['再一題', 'One more'] },
    { tap: '.q-close', say: ['先結束這一輪', 'End the round'] },
    { tap: '#tab-list', say: ['6,169 個字都在這', 'All 6,169 words'] },
    { tap: '#tab-progress', say: ['你記住了多少', 'How many you know'] }
  ],
  money: [
    { say: ['示範用的帳本，資料都是假的：看記一筆有多快。', 'Sample books with made-up data: see how quick an entry is.'] },
    { tap: '.mn-day[data-day="2026-10-26"]', say: ['點一天，看那天花了什麼', 'Tap a day to see what was spent'] },
    { tap: '.q-tab-action', say: ['記一筆', 'Add an entry'] },
    { tap: '.mn-cat[data-cat="food"]', say: ['選「餐飲」', 'Pick Food'] },
    { tap: '.mn-subchip[data-sub="food:drink"]', say: ['細項選「飲料點心」', 'Then Drinks & snacks'] },
    { tap: '.mn-amount-in', type: '65', say: ['輸入金額', 'Type the amount'] },
    { tap: '.q-sheet-foot .q-btn.primary', say: ['儲存', 'Save'] },
    { tap: '#tab-stats', say: ['錢花到哪裡', 'Where the money went'] },
    { tap: '#tab-accts', say: ['每個帳戶的餘額', 'Every account’s balance'] }
  ],
  weather: [
    { say: ['氣象署、Google 和環境部的資料，合成一個預報，準到你的鄉鎮。', 'The weather bureau’s, Google’s and the environment ministry’s data, blended into one forecast for your township.'] },
    { tap: '.ot-hero', say: ['點開今天每小時的天氣', 'Open today hour by hour'] },
    { tap: 'dialog[open] .q-close', say: ['關掉', 'Close it'] },
    { tap: '.ot-g[data-metric="rain"]', say: ['會不會下雨？', 'Will it rain?'] },
    { tap: '[data-range="rain:10d"]', say: ['十天內哪天會下雨', 'Which of the next ten days it rains'] },
    { tap: 'dialog[open] .q-close', say: ['關掉', 'Close it'] },
    { tap: '#tab-places', say: ['存好家和學校，預報跟著你一天走', 'Save home and school; the forecast follows your day'] }
  ]
};
