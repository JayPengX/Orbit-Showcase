// The apps that run for real inside the showcase (frozen copies under
// demo/, scripts/demo/), and each one's guided tour: a step points at what
// to tap in the app (`tap`, a selector inside it) and says why, in plain
// words. The recording walks the same steps, so every tap has its answers.
export const DEMOS = {
  weather: { repo: 'Orbit-Weather' }
};

export const TOURS = {
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
