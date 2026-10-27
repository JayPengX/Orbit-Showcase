// The apps that run for real inside the showcase (frozen copies under
// demo/, scripts/demo/), and each one's guided tour: a step points at what
// to tap in the app (`tap`, a selector inside it) and says why, in plain
// words. The recording walks the same steps, so every tap has its answers.
// `real`: its data is the real feeds' at the moment it was recorded, not made up.
export const DEMOS = {
  weather: { repo: 'Orbit-Weather' },
  money: { repo: 'Orbit-Money' },
  words: { repo: 'Orbit-Words' },
  sports: { repo: 'Orbit-Sports', real: true }
};

export const TOURS = {
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
