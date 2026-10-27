// The apps that run for real inside the showcase (frozen copies under
// demo/, scripts/demo/), and each one's guided tour: a step points at what
// to tap in the app (`tap`, a selector inside it) and says why, in plain
// words. The recording walks the same steps, so every tap has its answers.
export const DEMOS = {
  weather: { repo: 'Orbit-Weather' },
  money: { repo: 'Orbit-Money' }
};

export const TOURS = {
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
