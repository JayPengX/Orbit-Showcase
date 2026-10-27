// The apps that run for real inside the showcase (frozen copies under
// demo/, scripts/demo/), and each one's guided tour: a step points at what
// to tap in the app (`tap`, a selector inside it) and says why, in plain
// words; `type`, words typed into the box once it's tapped. The recording
// walks the same steps, so every tap has its answers.
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
    { say: ['這是你附近：黃點是 YouBike 站。', 'Around you: the yellow dots are YouBike stations.'] },
    { tap: '.q-tab[data-tab="go"]', say: ['看附近的車', 'See what’s nearby'] },
    { tap: '.ot-strip-main', say: ['點一路公車', 'Tap a bus'] },
    { tap: '.q-close', say: ['每站幾分鐘到，都在這裡', 'Minutes to every stop'] },
    { tap: '.q-tab[data-tab="times"]', say: ['火車和公車時刻表', 'Train and bus times'] }
  ],
  class: [
    { say: ['最上面是現在這節課，倒數到下課。', 'The class on now, counting down to the bell.'] },
    { tap: '.q-chip.day[data-day="2026-10-29"]', say: ['看明天的課', 'See tomorrow'] },
    { tap: '.q-tab[data-tab="week"]', say: ['整週課表', 'The whole week'] },
    { tap: '.q-tab[data-tab="tools"]', say: ['改課表、考試倒數', 'Edit it, count down to exams'] }
  ],
  securities: [
    { tap: '.q-stock', say: ['點今天漲最多的這檔', 'Tap today’s top gainer'] },
    { tap: '[data-action="chart-style"][data-v="candle"]', say: ['換成 K 線', 'Switch to candles'] },
    { tap: '.q-btn.trade.buy', say: ['買進（練習資金）', 'Buy, with practice money'] },
    { tap: '[data-action="qty"][data-qty="100"]', say: ['買 100 股零股', '100 shares, an odd lot'] },
    { tap: '[data-action="otype"][data-otype="limit"]', say: ['零股只能掛限價', 'Odd lots are limit orders'] },
    { tap: '[data-action="place"]', say: ['手續費和稅已算好，送出', 'Fees and tax included: send'] },
    { tap: '.q-ask-actions .q-btn.primary', say: ['確認', 'Confirm'] },
    { tap: '.q-close', say: ['關掉這一檔', 'Close this stock'] },
    { tap: '.q-tab[data-tab="portfolio"]', say: ['看你的資產', 'Your holdings'] },
    { tap: '.q-tab[data-tab="history"]', say: ['剛才的委託在這裡', 'Your order is here'] }
  ],
  sports: [
    { say: ['今天在台灣看得到的比賽：足球、棒球、籃球放在一起。', 'Today’s games you can watch in Taiwan: football, baseball and basketball together.'] },
    { tap: '.event-row:has(source[srcset*="teamlogos/mlb"])', wait: 5000, say: ['點世界大賽這場', 'Tap the World Series game'] },
    { tap: '.match-tabs .q-chip:nth-child(2)', say: ['兩隊數據，一眼比較', 'Both teams’ stats, side by side'] },
    { tap: '.match-tabs .q-chip:nth-child(6)', wait: 5000, say: ['整個季後賽的對戰圖', 'The whole playoff bracket'] },
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
    { tap: '.q-hc-btn', say: ['開始今天的字', 'Start today’s words'] },
    { tap: '.choice', say: ['選一個意思，錯了也沒關係', 'Pick a meaning; wrong is fine'] },
    { tap: '.q-btn.primary', say: ['下一題', 'Next'] },
    { tap: '.choice', say: ['再一題', 'One more'] },
    { tap: '.q-close', say: ['先結束這一輪', 'End the round'] },
    { tap: '#tab-list', say: ['6,169 個字都在這', 'All 6,169 words'] },
    { tap: '#tab-progress', say: ['你記住了多少', 'How many you know'] }
  ],
  money: [
    { tap: '.mn-day[data-day="2026-10-16"]', say: ['點一天，看那天花了什麼', 'Tap a day to see what was spent'] },
    { tap: '.q-tab-action', say: ['記一筆', 'Add an entry'] },
    { tap: '.mn-cat[data-cat="drink"]', say: ['選「飲料」', 'Pick Drinks'] },
    { tap: '.mn-key[aria-label="6"]', say: ['輸入 6', 'Type 6'] },
    { tap: '.mn-key[aria-label="5"]', say: ['再按 5', 'Then 5'] },
    { tap: '.mn-key.save', say: ['儲存', 'Save'] },
    { tap: '#tab-stats', say: ['錢花到哪裡', 'Where the money went'] },
    { tap: '#tab-accts', say: ['每個帳戶的餘額', 'Every account’s balance'] }
  ],
  weather: [
    { tap: '.wx-hero', say: ['點開今天每小時的天氣', 'Open today hour by hour'] },
    { tap: '.q-close', say: ['關掉', 'Close it'] },
    { tap: '.q-panel[data-open="rain"]', say: ['會不會下雨？', 'Will it rain?'] },
    { tap: '[data-range="rain:10d"]', say: ['看十天', 'Ten days'] },
    { tap: '.q-close', say: ['關掉', 'Close it'] },
    { tap: '#tab-week', say: ['十天預報', 'Ten-day forecast'] },
    { tap: '#tab-places', say: ['存好幾個地方', 'Keep several places'] }
  ]
};
