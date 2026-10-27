// The apps that run for real inside the showcase (frozen copies under
// demo/, scripts/demo/), and each one's guided tour: a step points at what
// to tap in the app (`tap`, a selector inside it) and says why, in plain
// words. The recording walks the same steps, so every tap has its answers.
// `real`: its data is the real feeds' at the moment it was recorded, not made up.
export const DEMOS = {
  weather: { repo: 'Orbit-Weather' },
  money: { repo: 'Orbit-Money' },
  words: { repo: 'Orbit-Words' },
  sports: { repo: 'Orbit-Sports', real: true },
  securities: { repo: 'Orbit-Securities', real: true },
  class: { repo: 'Orbit-Class' },
  transit: { repo: 'Orbit-Transit' }
};

export const TOURS = {
  transit: [
    { say: ['地圖上是附近的 YouBike：每個站還有幾台可借，閃電是電輔車。', 'The map shows the YouBike stations nearby: bikes to borrow at each, the bolt for e-bikes.'] },
    { tap: '.q-tab[data-tab="go"]', say: ['點「交通」：附近的公車、火車和 YouBike 排在一起。', 'Tap “Transit”: the buses, trains and YouBike nearby, side by side.'] },
    { tap: '.ot-strip-main', say: ['點一路公車，看它現在開到哪、幾分鐘後到。', 'Tap a bus route to see where it is now and when it arrives.'] },
    { tap: '.q-close', say: ['每一站幾分鐘到、車子在哪裡，都在這條線上。看完按 × 關掉。', 'Every stop’s minutes and where the buses are, along one line. Close it with the ×.'] },
    { tap: '.q-tab[data-tab="times"]', say: ['「查時刻」：火車、高鐵和公車的時刻表，不用打開別的 App。', '“Times”: train, high-speed rail and bus timetables, without opening another app.'] }
  ],
  class: [
    { say: ['上課時，最上面就是現在這節：哪一科、哪位老師、在哪間教室，還有幾分鐘下課。數字每秒都在倒數。', 'In class, the top shows the period now: the subject, the teacher, the room and the minutes left, counting down every second.'] },
    { tap: '.q-chip.day[data-day="2026-10-29"]', say: ['點「明天」，看明天要上什麼。', 'Tap “Tomorrow” to see tomorrow’s classes.'] },
    { tap: '.q-tab[data-tab="week"]', say: ['「課表」分頁：整週的課，一眼看完。', 'The Timetable tab: the whole week at a glance.'] },
    { tap: '.q-tab[data-tab="tools"]', say: ['「工具」分頁：改課表、考試倒數，還有拍一張照片就讓 AI 填好課表。', 'The Tools tab: edit the timetable, exam countdowns, and a photo that AI turns into a timetable.'] }
  ],
  securities: [
    { tap: '.q-stock', say: ['這幾檔是今天台股漲跌最多的，價格是錄下那一刻的真實行情。點第一檔。', 'Today’s biggest Taiwan movers, at real prices from the moment this was recorded. Tap the first.'] },
    { tap: '[data-action="chart-style"][data-v="candle"]', say: ['切成 K 線圖，看每天的開盤、最高、最低和收盤。', 'Switch to candles: each day’s open, high, low and close.'] },
    { tap: '.q-btn.trade.buy', say: ['按「買進」。用的是 App 裡的練習資金，不是真錢。', 'Press Buy. It uses the app’s practice money, not real money.'] },
    { tap: '[data-action="qty"][data-qty="100"]', say: ['台股可以買零股，選 100 股。', 'Taiwan shares can be bought in odd lots: pick 100 shares.'] },
    { tap: '[data-action="otype"][data-otype="limit"]', say: ['零股跟真的一樣只能掛限價：點「限價」，價格會先幫你填好。', 'Odd lots take limit orders only, as on a real exchange: tap Limit, and the price is filled in for you.'] },
    { tap: '[data-action="place"]', say: ['按「送出買單」。手續費和稅都已經算進總額。', 'Press Send. Fees and tax are already in the total.'] },
    { tap: '.q-ask-actions .q-btn.primary', say: ['再確認一次就送出。規則跟真的券商一樣：休市時，委託會等開盤再成交。', 'Confirm, and it goes in. The rules are a real broker’s: when the market is closed, the order waits for the open.'] },
    { tap: '.q-close', say: ['買單送出了。按 × 關掉這一檔。', 'The order is in. Close this stock with the ×.'] },
    { tap: '.q-tab[data-tab="portfolio"]', say: ['「資產」分頁：持股、現金和整體的損益；剛才的買單先圈存了錢，等成交。', 'The Portfolio tab: holdings, cash and overall gain or loss; the order’s money is held until it fills.'] },
    { tap: '.q-tab[data-tab="history"]', say: ['「紀錄」分頁：錢的進出和每一張委託，剛才那張在「委託」裡。', 'The History tab: money in and out, and every order; the one you just placed is under Orders.'] }
  ],
  sports: [
    { tap: '.sport-card', say: ['先選你看的運動，例如足球。', 'First pick a sport you watch, say football.'] },
    { tap: '.sp-done', say: ['按「完成」。首頁馬上變成你的觀賽計畫。', 'Press Done: home turns into your watching plan.'] },
    { tap: '.hero-game', say: ['最上面是下一場值得看的比賽，連哪一台在播都寫好了。點它。', 'At the top: the next game worth watching, with the channel showing it. Tap it.'] },
    { tap: '.q-close', say: ['比賽頁有兩隊的近況和對戰紀錄。看完按 × 關起來。', 'The game page has both teams’ form and their past meetings. Close it with the ×.'] },
    { tap: '#tab-live', say: ['「轉播」分頁：台灣哪一台、幾點播哪一場，全部排好。', 'The Channels tab: which Taiwanese channel shows which game, and when.'] },
    { tap: '#tab-matches', say: ['「賽事」分頁：每個聯賽的賽程、比分和排名。', 'The Games tab: every league’s fixtures, scores and table.'] }
  ],
  words: [
    { tap: '.q-hc-btn', say: ['每天的目標是 20 個字。按「開始 10 個字」。', 'The daily goal is 20 words. Press “Start 10 words”.'] },
    { tap: '.choice', say: ['選你覺得對的中文意思。答錯也沒關係，App 會記下來，之後再考你。', 'Pick the meaning you think is right. A wrong answer is fine: the app notes it and asks again later.'] },
    { tap: '.q-btn.primary', say: ['按「下一題」。每個字什麼時候再出現，由記憶模型決定。', 'Press Next. When each word comes back is decided by a memory model.'] },
    { tap: '.choice', say: ['再答一題。', 'One more.'] },
    { tap: '.q-close', say: ['先結束這一輪，按左上角的 ×。', 'End the round with the × at the top left.'] },
    { tap: '#tab-list', say: ['「單字」分頁：6,169 個字，每個都有發音、例句和等級。', 'The Words tab: 6,169 words, each with its sound, an example and its level.'] },
    { tap: '#tab-progress', say: ['「進度」分頁：記住了多少、每天練了多少。', 'The Progress tab: how many you know, and how much you practise each day.'] }
  ],
  money: [
    { tap: '.mn-day[data-day="2026-10-16"]', say: ['月曆上每一天花了多少，一眼就看到。點 16 號，看那天記了哪幾筆。', 'The calendar shows what each day cost. Tap the 16th to see what was spent that day.'] },
    { tap: '.q-tab-action', say: ['右下角的 + 是記一筆。點它。', 'The + at the bottom right adds a new entry. Tap it.'] },
    { tap: '.mn-cat[data-cat="drink"]', say: ['先選分類，例如「飲料」。', 'Pick a category, say “Drinks”.'] },
    { tap: '.mn-key[aria-label="6"]', say: ['用下面的數字鍵輸入金額，先按 6。', 'Type the amount on the keypad: press 6.'] },
    { tap: '.mn-key[aria-label="5"]', say: ['再按 5，就是 65 元。', 'Then 5, for NT$65.'] },
    { tap: '.mn-key.save', say: ['按「儲存」。月曆和今天的總數馬上跟著變。', 'Press Save: the calendar and today’s total change at once.'] },
    { tap: '#tab-stats', say: ['「統計」分頁：這個月的錢花到哪裡，用分類畫成圖。', 'The Stats tab: where this month’s money went, by category.'] },
    { tap: '#tab-accts', say: ['「帳戶」分頁：現金、銀行、悠遊卡、信用卡，各有多少一目了然。', 'The Accounts tab: cash, bank, transit card and credit card, each balance at a glance.'] }
  ],
  weather: [
    { tap: '.wx-hero', say: ['先點最上面的天氣卡：今天每個時段的溫度、降雨和風，一次看完。', 'Tap the weather card at the top: today hour by hour, temperature, rain and wind.'] },
    { tap: '.q-close', say: ['看完按右上角的 × 關起來。', 'Close it with the × at the top right.'] },
    { tap: '.q-panel[data-open="rain"]', say: ['往下有降雨卡，點開看接下來幾小時會不會下雨。', 'Further down is the rain card: tap it to see whether rain is coming.'] },
    { tap: '[data-range="rain:10d"]', say: ['切到「10 天」，看整個十天的降雨機率。', 'Switch to “10 days” for the rain chance across ten days.'] },
    { tap: '.q-close', say: ['再關起來。', 'Close it again.'] },
    { tap: '#tab-week', say: ['底下的「預報」分頁：十天的高低溫排成一張圖。', 'The Forecast tab: ten days of highs and lows in one picture.'] },
    { tap: '#tab-places', say: ['「地點」分頁可以存好幾個地方，像學校和家，一眼比較。', 'The Places tab keeps several places, like school and home, side by side.'] }
  ]
};
