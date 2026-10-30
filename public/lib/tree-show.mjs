// What each tree card shows before any words: a small picture of the idea.
// Blocks, each optional, drawn in this order by views/how.mjs:
//   flow  [[icon, [zh, en]], …]   steps joined by arrows (more than four
//                                 run down the card instead of across)
//   nums  [[value, [zh, en]], …]  a few big numbers, each with its label
//   pairs [[[zh, en], [zh, en]], …] before → after
//   tags  [[icon, [zh, en]], …]   a cloud of named things
//   rules [[zh, en], …]           a short checklist
// A value is a string or a [zh, en] pair. Every number is one the code or
// its history states (tree.mjs and tree-apps.mjs say where); none is made up.

const S = {
  // ---- The root and the big branches ----
  orbit: {
    nums: [['9', ['個 App', 'apps']], ['1', ['張通行證', 'pass']], ['US$5', ['一個月', 'a month']]]
  },
  apps: {
    flow: [['backpack', ['一盒零件', 'One kit']], ['key', ['一張通行證', 'One pass']], ['grid', ['九個 App', 'Nine apps']]]
  },
  kit: {
    flow: [['pencil', ['改一次', 'Fix once']], ['backpack', ['零件盒', 'The kit']], ['grid', ['9 個 App 一起變', 'Nine apps change']]]
  },
  pass: {
    flow: [['key', ['一組碼', 'One code']], ['check', ['登入一次', 'Sign in once']], ['grid', ['9 個 App', 'Nine apps']]],
    nums: [['10', ['個字的通行碼', 'characters in a pass']]]
  },
  cloud: {
    flow: [['user', ['你的 App', 'Your app']], ['cloud', ['雲端小幫手', 'The helper']], ['map', ['ESPN、交通部…', 'ESPN, TDX…']]]
  },
  store: {
    flow: [['flame', ['口袋：記憶體', 'Pocket: memory']], ['user', ['書包：手機', 'Backpack: the phone']], ['backpack', ['倉庫：雲端', 'Store: the cloud']], ['book', ['圖書館：來源', 'Library: the source']]]
  },
  fast: {
    pairs: [[['以前在 3G 上要 20–70 秒', 'Once 20–70 s on 3G'], ['現在 Jay 的 4G 上也很快', 'Quick on Jay’s 4G now']]],
    nums: [['12 Mbps', ['Jay 的 4G', 'Jay’s 4G']], ['300–470', ['毫秒延遲', 'ms of delay']]]
  },
  cheap: {
    nums: [['US$5', ['整個家族一個月', 'the whole family, a month']], ['NT$0', ['App 本身放在 GitHub Pages', 'the apps on GitHub Pages']]]
  },
  ship: {
    flow: [['pencil', ['修好', 'Fixed']], ['check', ['測試', 'Tested']], ['send', ['推上去', 'Pushed']], ['user', ['到你手機', 'On your phone']]]
  },
  team: {
    flow: [['user', ['Jay 決定', 'Jay decides']], ['grid', ['協調者分工', 'The coordinator splits']], ['list', ['Claude 寫程式', 'Claude writes']], ['send', ['自動上線', 'It ships']]]
  },

  // ---- Sports ----
  sports: {
    flow: [['user', ['App', 'App']], ['cloud', ['雲端代理', 'The proxy']], ['backpack', ['雲端倉庫', 'Storage']], ['ball', ['ESPN 等', 'ESPN etc.']]],
    nums: [['168 → 24', ['比賽中首頁每分鐘讀取', 'home reads a minute, live']], [['2.8 → 1.6 秒', '2.8 → 1.6 s'], ['重新打開', 'a reopen']]]
  },
  'sports-limits': {
    nums: [['3.08 → 0.14 MB', ['MLB 傷兵名單修剪後', 'MLB injury list, trimmed']], ['312 → 24', ['轉播頁每分鐘讀取', 'TV page reads a minute']]]
  },
  'sports-data': {
    tags: [['ball', 'ESPN'], ['ball', 'MLB'], ['ball', ['中華職棒', 'CPBL']], ['list', 'TheSportsDB'], ['flag', ['F1 即時計時', 'F1 live timing']], ['flag', 'Jolpica'], ['ball', 'FotMob'], ['tv', ['愛爾達', 'ELTA']], ['tv', 'NBA.com'], ['tv', 'Apple TV'], ['play', 'YouTube'], ['user', 'RotoWire']]
  },
  'sports-calls': {
    rules: [['只放台灣看得到的聯賽', 'Only leagues Taiwan can watch'], ['球隊用中文，球員用英文原名', 'Teams in Chinese, players by their own names'], ['不放新聞，也不放 AI', 'No news, no AI'], ['延期的比賽點了不開', 'A postponed game doesn’t open'], ['過去的比賽只顯示那一刻', 'A past game shows only its moment']]
  },
  'sports-table': {
    pairs: [[['ESPN：打完一陣子才更新', 'ESPN: updates a while later'], ['Orbit：終場就更新', 'Orbit: at the final whistle']]]
  },
  'sports-push': {
    nums: [[['約 2 分鐘', '~2 min'], ['終場後收到通知', 'after the end, the notice']], [['15 分鐘以上', '15+ min'], ['以前', 'before']]]
  },
  'sports-picks': {
    nums: [[['30 分鐘', '30 min'], ['不同運動相差這麼多才不算撞', 'apart, two sports don’t clash']], [['0–5 點', '0–5 a.m.'], ['不推薦', 'never picked']]]
  },
  'sports-breaks': {
    nums: [['2:45', ['NBA 每節前兩次暫停', 'the NBA’s first two timeouts']]]
  },
  'sports-f1-kept': {
    nums: [[':06 :26 :46', ['每小時存三次', 'saved three times an hour']]]
  },
  'sports-trims': {
    pairs: [[['MLB 傷兵名單 3.08 MB', 'MLB injury list 3.08 MB'], ['只留需要的 0.14 MB', 'just what’s needed, 0.14 MB']]]
  },
  'sports-live': {
    flow: [['ball', ['ESPN', 'ESPN']], ['cloud', ['代理留 2 秒', 'Proxy keeps 2 s']], ['user', ['只改變了的數字', 'Only changed numbers']]]
  },

  // ---- Transit ----
  transit: {
    flow: [['user', ['App', 'App']], ['cloud', ['雲端代理', 'The proxy']], ['backpack', ['共用快取', 'Shared cache']], ['bus', ['TDX、Google', 'TDX, Google']]],
    nums: [[['40 公尺', '40 m'], ['一格共用步行路線', 'grid for shared walks']], [['每 2 分鐘', 'Every 2 min'], ['先把 YouBike 抓好', 'YouBike fetched ahead']]]
  },
  'transit-limits': {
    nums: [['4', ['TDX 每秒最多次數', 'TDX calls a second, at most']], [['6 小時', '6 h'], ['時刻表共用', 'timetables shared']]]
  },
  'transit-data': {
    tags: [['bus', ['TDX 公車', 'TDX buses']], ['train', ['台鐵、高鐵、捷運', 'Rail, HSR, metro']], ['bike', 'YouBike'], ['map', 'Google Maps'], ['map', ['國土測繪中心地圖', 'NLSC maps']], ['map', 'OpenStreetMap']]
  },
  'transit-calls': {
    flow: [['pin', ['竹東南', 'Zhudong South']], ['bus', ['5608 公車', 'Bus 5608']], ['bike', ['YouBike 20 分', 'YouBike 20 min']], ['flag', ['成功九街', 'Chenggong 9th St']]],
    rules: [['永遠有一個推薦', 'Always one pick'], ['不規劃計程車', 'No taxis'], ['不跟自己的火車賽跑', 'Never race your own train'], ['手指動過地圖就不再拉回', 'A map you moved stays put']]
  },
  'transit-fast': {
    pairs: [[['台北 7 到 10 秒', 'Taipei: 7 to 10 s'], ['1 到 2 秒', '1 to 2 s']]]
  },
  'transit-tdx': {
    nums: [['240', ['TDX 每分鐘上限', 'TDX calls a minute, at most']], ['4', ['每秒', 'a second']]]
  },

  // ---- Weather ----
  weather: {
    flow: [['user', ['App', 'App']], ['cloud', ['雲端混合', 'Blended in the cloud']], ['grid', ['5 公里一格', '5 km squares']], ['sun', ['氣象署、Google…', 'CWA, Google…']]],
    nums: [[['93 毫秒', '93 ms'], ['載入畫面消失（原本 1,626）', 'loading screen gone (was 1,626)']], [['0.84 → 0.55 秒', '0.84 → 0.55 s'], ['重新打開', 'a reopen']]]
  },
  'weather-limits': {
    nums: [['0.05°', ['約 5 公里一格，大家共用', 'about 5 km, shared']], [['15 分鐘', '15 min'], ['一格答案保存', 'a square’s answer kept']]]
  },
  'weather-data': {
    tags: [['sun', 'Google Weather'], ['cloud', ['中央氣象署', 'CWA']], ['wind', ['環境部空氣品質', 'MOENV air quality']], ['bell', ['災防警報', 'NCDR alerts']], ['calendar', ['停班停課', 'Days off (DGPA)']], ['rain', 'MET Norway'], ['rain', 'Open-Meteo']]
  },
  'weather-calls': {
    rules: [['同一個小時只有一個數字', 'One hour, one number'], ['舊預報過 6 小時就藏起來', 'A forecast over 6 h old is hidden'], ['天氣圖自己畫，不用 emoji', 'Our own weather drawings, no emoji'], ['不寫來源名稱', 'No source names'], ['颱風假算假日', 'A typhoon day off is a holiday']]
  },
  'weather-typhoon': {
    nums: [['68', ['個颱風（2019–2026）學出來的', 'storms learned from (2019–2026)']], ['22', ['縣市，每 3 分鐘一起算', 'counties, every 3 min']], ['1–99%', ['每個縣市的機率', 'a county’s chance']]]
  },
  'weather-county': {
    pairs: [[['每個人各算一次', 'Each person works it out'], ['一個縣市只算一次', 'Once a county']]]
  },

  // ---- Class ----
  class: {
    flow: [['clock', ['每秒看時鐘', 'Reads the clock']], ['list', ['課表規則', 'The rules']], ['school', ['現在、下一節', 'Now and next']]],
    nums: [['300', ['AI 每天全站上限', 'AI asks a day, all users']], ['6', ['一次最多張照片', 'photos at once']]]
  },
  'class-calls': {
    nums: [['2026-08-26', ['第一個上 GitHub 的 App', 'the first app on GitHub']], [['8 碼', '8'], ['分享碼，24 小時有效', 'characters in a share key, 24 h']]],
    rules: [['AI 匯入不能改單雙週', 'An AI import never changes odd/even weeks'], ['離線也打得開', 'Opens offline']]
  },
  'class-ai': {
    flow: [['camera', ['拍課表', 'Snap the timetable']], ['cloud', ['AI 讀出來', 'AI reads it']], ['check', ['看差異再存', 'Check the changes']]]
  },

  // ---- Words ----
  words: {
    nums: [['6,169', ['個字，每字一個錄音', 'words, a recording each']], ['20', ['每天最需要的字', 'words a day, the ones you need']]]
  },
  'words-memory': {
    nums: [[['10 天', '10 days'], ['記得這麼穩才算會', 'of steady memory = known']]]
  },

  // ---- Beats ----
  beats: {
    flow: [['spark', ['背景作曲', 'Composed behind']], ['play', ['一條音訊串流', 'One audio stream']], ['lock', ['鎖螢幕也播', 'Plays when locked']]],
    nums: [['97%', ['速度判斷正確', 'tempo right']], [['±45 毫秒', '±45 ms'], ['節奏遊戲判定', 'rhythm game window']]]
  },
  'beats-real': {
    nums: [['1/10', ['存成 AAC，約 WAV 大小', 'stored as AAC, of a WAV']]]
  },

  // ---- Law ----
  law: {
    flow: [['clock', ['每天 03:30 建資料', 'Built daily 03:30']], ['book', ['放成靜態檔', 'Kept as plain files']], ['user', ['手機秒開、離線可讀', 'Opens at once, offline too']]],
    nums: [[['約 60 MB', '~60 MB'], ['每天建好的資料', 'built every day']], [['約 28,000', '~28,000'], ['個條號連結', 'article links']]]
  },
  'law-data': {
    tags: [['book', ['全國法規資料庫', 'Laws & Regulations DB']], ['list', ['立法院（g0v）', 'Legislative Yuan (g0v)']], ['shield', ['司法院裁判書', 'Court rulings']], ['star', ['憲法法庭', 'Constitutional Court']], ['map', ['20 個縣市的地方法規', '20 counties’ local rules']], ['coin', ['主計總處預算', 'Budgets']], ['user', ['立委照片', 'Lawmakers’ photos']]],
    nums: [['1–813', ['號釋字全收', 'every interpretation']], ['20/22', ['縣市地方法規', 'counties’ local rules']]]
  },
  'law-build': {
    flow: [['clock', ['00:05–06:00 夜間補判決', 'Rulings filled 00:05–06:00']], ['list', ['03:30 建全部資料', 'All built 03:30']], ['book', ['GitHub Pages', 'GitHub Pages']]],
    nums: [[['3 年', '3 years'], ['各級法院判決', 'of court rulings']], ['NT$0', ['讀多少都免費', 'to read, however much']]]
  },
  'law-links': {
    nums: [[['約 28,000', '~28,000'], ['個引用', 'citations']], [['約 99%', '~99%'], ['連到真實條文', 'reach the real article']]]
  },
  'law-live': {
    nums: [[['90 秒', '90 s'], ['看一次哪場在直播', 'between live checks']]]
  },
  'law-ai': {
    nums: [['30', ['每人每天能問的次數', 'asks a person a day']], ['14', ['每次最多引用的條文', 'articles at most a chat']]]
  },

  // ---- Securities ----
  securities: {
    flow: [['user', ['App 下單', 'Order in the app']], ['cloud', ['伺服器判定成交', 'Server fills it']], ['chart', ['照真的報價', 'At real prices']]],
    nums: [[['170 → 7 毫秒', '170 → 7 ms'], ['畫資產曲線（425 筆）', 'drawing the value chart (425 events)']], [['NT$10,000', 'NT$10,000'], ['每週一的薪水', 'every Monday']]]
  },
  'sec-data': {
    tags: [['chart', 'Yahoo Finance'], ['bank', ['證交所', 'TWSE']], ['bank', ['櫃買中心', 'TPEx']], ['exchange', ['期交所', 'TAIFEX']], ['wallet', ['投信投顧公會', 'SITCA']], ['coin', ['台灣銀行利率', 'Bank of Taiwan rates']]],
    nums: [['11/16', ['固定在台灣時 Yahoo 擋掉的次數', 'Yahoo refusals when pinned to Taiwan']]]
  },
  'sec-calls': {
    rules: [['不寫「模擬」「練習」', 'Never says “simulated”'], ['中文漲紅、英文漲綠', 'Up is red in Chinese, green in English'], ['錢只在這個 App 顯示', 'Money shows only here'], ['每週一發 NT$10,000', 'NT$10,000 every Monday'], ['首頁不顯示餘額', 'No balance on the home page']]
  },

  // ---- Money ----
  money: {
    flow: [['camera', ['掃發票', 'Scan a receipt']], ['wallet', ['手機上的帳本', 'Books on the phone']], ['swap', ['逐筆合併到 Pass', 'Merged entry by entry']]],
    nums: [[['120 天', '120 days'], ['刪掉的紀錄也記得', 'a deletion is remembered']], [['≤ 1 MB', '≤ 1 MB'], ['整本帳', 'the whole book']]]
  },
  'money-calls': {
    tags: [['wallet', ['現金', 'Cash']], ['bank', ['銀行', 'Bank']], ['ticket', ['信用卡', 'Credit card']], ['bus', ['儲值卡', 'Stored-value card']], ['exchange', ['電子支付', 'E-payment']]],
    rules: [['從不自己生出帳目、餘額或分類', 'Never invents entries, balances or categories'], ['條碼在深色模式也黑白', 'The barcode stays black and white in dark mode']]
  },

  // ---- The shared parts ----
  'kit-brand': {
    nums: [['96', ['種小行星頭像（16 色 × 6）', 'planet avatars (16 colours × 6)']]]
  },
  'kit-boot': {
    flow: [['swap', '0'], ['clock', ['4 秒', '4 s']], ['clock', ['12 秒', '12 s']], ['clock', ['30 秒', '30 s']], ['clock', ['60 秒', '60 s']]],
    nums: [['5', ['次重試，才說出了什麼事', 'tries before it says what’s wrong']]]
  },
  'kit-rec': {
    flow: [['user', ['Jay 看到問題', 'Jay sees it']], ['history', ['一鍵複製紀錄', 'Copies the log']], ['check', ['修真正的原因', 'The real cause fixed']]]
  },

  // ---- The pass ----
  'pass-code': {
    nums: [[['60 天', '60 days'], ['手機上的更新票', 'the phone’s refresh ticket']], ['0', ['伺服器存的通行碼', 'passes the server keeps']]]
  },
  'pass-safe': {
    nums: [[['2 天', '2 days'], ['每個舊版本都留', 'every old version kept']], [['30 天', '30 days'], ['每天一份', 'one a day']], [['14 晚', '14 nights'], ['整包備份', 'whole backups']]]
  },
  'pass-economy': {
    nums: [['NT$200,000', ['開戶', 'to open']], ['NT$10,000', ['每週一', 'every Monday']]]
  },

  // ---- The cloud ----
  'cloud-gate': {
    nums: [['600', ['每分鐘的次數上限', 'reads a minute, at most']], [['6 小時', '6 h'], ['過期票的寬限', 'grace on an old ticket']]]
  },
  'cloud-proxy': {
    nums: [[['2 秒', '2 s'], ['進行中的比分', 'live scores']], [['30 秒', '30 s'], ['報價', 'quotes']], [['24 小時', '24 h'], ['結束的比賽', 'a finished game']]]
  },
  'cloud-routes': {
    tags: [['key', ['/eco 通行證', '/eco the pass']], ['chart', ['/stock 成交', '/stock fills']], ['bell', ['/push 通知', '/push notices']], ['sun', '/weather'], ['bus', '/transit'], ['ball', '/sports-proxy'], ['camera', ['/gemini 課表 AI', '/gemini timetable AI']], ['book', ['/law-ask 法律', '/law-ask law']], ['wallet', ['/money-mail 發票', '/money-mail receipts']], ['backpack', ['/data 倉庫', '/data storage']]]
  },
  'cloud-push': {
    tags: [['school', ['課前提醒', 'Before class']], ['bus', ['公車到站', 'Bus arriving']], ['ball', ['比賽結果', 'Results']], ['chart', ['股價提醒', 'Price alerts']]]
  },
  'cloud-relay': {
    flow: [['camera', ['AI、台灣網站', 'AI, Taiwan sites']], ['flag', ['台灣機房', 'A Taiwan data centre']]],
    nums: [['11/16', ['全固定在台灣時 Yahoo 擋掉', 'Yahoo refusals if all pinned']], ['0/8', ['不固定時', 'unpinned']]]
  },
  'cloud-cron': {
    nums: [['2', ['個排程，偶數分鐘和奇數分鐘', 'schedules, even and odd minutes']]]
  },
  'cloud-guard': {
    flow: [['bell', ['50% 通知', '50% tell Jay']], ['clock', ['60% 放慢', '60% slow']], ['bell', ['75% 通知', '75% tell']], ['x', ['90% 停', '90% stop']]],
    nums: [[['5 分鐘', '5 min'], ['看一次帳單', 'between bill checks']]]
  },

  // ---- Where data lives ----
  'store-layers': {
    flow: [['flame', ['記憶體', 'Memory']], ['user', ['手機快取', 'Phone cache']], ['x', ['剛失敗的先別問', 'Just failed? wait']], ['backpack', ['做好的資料包', 'Ready packs']], ['cloud', ['台灣附近的快取', 'Edge cache']], ['check', ['永久保存的', 'Kept for good']], ['map', ['原始來源', 'The source']]]
  },
  'store-fail': {
    pairs: [[['讀不到 = 沒有，存成空的', 'Unread = nothing, saved empty'], ['讀不到就不存，先用手上的', 'Unread is never saved']]]
  },
  'store-phone': {
    flow: [['flame', ['記憶體', 'Memory']], ['backpack', ['快取', 'Cache Storage']], ['list', ['設定和最近的資料', 'Settings, recent data']], ['play', ['Beats 的歌', 'Beats’ songs']]]
  },
  'store-d1': {
    tags: [['wallet', ['錢包', 'The wallet']], ['grid', ['每個 App 的資料', 'Each app’s data']], ['history', ['舊版本', 'Old versions']]],
    nums: [[['30 天', '30 days'], ['任何一分鐘都回得去', 'any minute can come back']]]
  },
  'store-r2': {
    tags: [['ball', ['球季和比賽日', 'Seasons and game days']], ['tv', ['轉播精華', 'Watch links']], ['user', ['球員照片', 'Player photos']], ['bus', ['公車資料包', 'Bus packs']], ['check', ['打完的比賽', 'Finished games']], ['shield', ['每晚備份', 'Nightly backups']]]
  },
  'store-kv': {
    nums: [[['15 分鐘', '15 min'], ['天氣一格', 'a weather square']], [['3 分鐘', '3 min'], ['颱風機率', 'typhoon chances']]]
  },
  'store-pages': {
    nums: [[['約 60 MB', '~60 MB'], ['法律資料', 'of law data']], ['6,169', ['個單字錄音', 'word recordings']], ['NT$0', ['讀多少都免費', 'however much is read']]]
  },

  // ---- Why it's quick ----
  'fast-hash': {
    pairs: [[['每次更新整個重新下載', 'Everything again each update'], ['只下載有改的幾 KB', 'Only the changed few KB']]],
    nums: [['12', ['碼指紋，每個檔案一個', 'characters of fingerprint per file']]]
  },
  'fast-first': {
    nums: [[['0.8 秒', '0.8 s'], ['最多等版本檢查', 'at most for the version check']]]
  },
  'fast-grace': {
    nums: [[['6 小時', '6 h'], ['讀取票的寬限', 'grace on a read ticket']]]
  },
  'fast-lift': {
    nums: [[['93 毫秒', '93 ms'], ['Weather 載入畫面消失（原 1,626）', 'Weather’s loading screen gone (was 1,626)']]]
  },
  'fast-morph': {
    pairs: [[['每次整頁重畫', 'A full redraw each time'], ['只改變了的數字', 'Only changed numbers']]],
    nums: [[['100–180 毫秒', '100–180 ms'], ['Money 每次切換省下', 'saved a switch in Money']]]
  },
  'fast-worker': {
    flow: [['spark', ['背景作曲', 'Composed behind']], ['play', ['先做好 2 首', 'Two songs ahead']], ['check', ['畫面不卡', 'No stalls']]]
  },
  'fast-test': {
    flow: [['play', ['第一次打開', 'First open']], ['swap', ['重新打開', 'Reopen']], ['clock', ['一小時後', 'An hour later']]],
    nums: [['12 Mbps', ['共用頻寬', 'shared link']], ['2', ['次來回，新網站', 'round trips, a new site']]]
  },

  // ---- Staying under limits ----
  'cheap-demand': {
    pairs: [[['沒人打開也一直抓', 'Fetching while nobody looks'], ['有人問才做', 'Built when someone asks']]]
  },
  'cheap-share': {
    nums: [[['5 公里', '5 km'], ['天氣一格共用', 'weather squares shared']], [['10 秒', '10 s'], ['交通結果共用', 'transit answers shared']], [['1 份', '1'], ['颱風機率一個縣市', 'typhoon chance a county']]]
  },
  'cheap-caps': {
    nums: [['300', ['課表 AI 每天', 'timetable AI a day']], ['30', ['每人每天問法律', 'law asks a person a day']], ['500', ['Google 天氣每天', 'Google Weather a day']]]
  },
  'cheap-static': {
    tags: [['grid', ['九個 App', 'Nine apps']], ['backpack', ['共用零件', 'The kit']], ['book', ['法律的全部資料', 'All of Law’s data']]],
    nums: [['NT$0', ['讀多少都免費', 'however much is read']]]
  },
  'cheap-guard': {
    flow: [['clock', ['60% 放慢', '60% slow']], ['x', ['90% 停到下個週期', '90% off till next period']]]
  },
  'cheap-speeds': {
    flow: [['user', ['人變多', 'More people']], ['clock', ['一起放慢', 'All slow a little']], ['check', ['空間夠就恢復', 'Back when there’s room']]]
  },
  'cheap-plan': {
    nums: [[['約 2.1 萬', '~21,000'], ['每天的請求', 'requests a day']], [['約 14 毫秒', '~14 ms'], ['每個請求的計算', 'computing a request']], [['10 毫秒', '10 ms'], ['免費方案上限', 'the free plan’s cap']]]
  },

  // ---- Shipping ----
  'ship-pages': {
    flow: [['check', ['測試', 'Test']], ['backpack', ['壓縮、蓋指紋', 'Minify, fingerprint']], ['send', ['上線', 'Publish']]]
  },
  'ship-workers': {
    flow: [['send', ['推上 GitHub', 'Push to GitHub']], ['swap', ['自動部署', 'Deploys itself']], ['cloud', ['Cloudflare', 'Cloudflare']]],
    rules: [['金鑰只放在秘密設定，從不放進程式碼', 'Keys live only in secret settings, never in code']]
  },
  'ship-order': {
    flow: [['backpack', ['先推零件', 'The kit first']], ['clock', ['等它上線', 'Wait till live']], ['grid', ['再推 App', 'Then the apps']]]
  },
  'ship-tests': {
    tags: [['coin', ['錢', 'Money']], ['swap', ['資料合併', 'Merges']], ['trophy', ['排名', 'Rankings']], ['map', ['行程規劃', 'Trip plans']], ['check', ['結算', 'Settling']]],
    pairs: [[['版面和文字', 'Layout and words'], ['用截圖看', 'checked by screenshot']]]
  },
  'ship-update': {
    flow: [['play', ['打開', 'Open']], ['search', ['比對版本', 'Compare versions']], ['swap', ['有新版就重載一次', 'Reload once if newer']]]
  },
  'ship-tools': {
    nums: [['50', ['次完整關卡（2026-10-20）', 'full gate runs (2026-10-20)']], ['0', ['個問題', 'problems']]]
  },

  // ---- How it was made ----
  'team-jay': {
    flow: [['user', ['在 iPhone 上試', 'Tries it on his iPhone']], ['camera', ['截圖給 Claude', 'Sends a screenshot']], ['flag', ['做決定', 'Decides']], ['list', ['變成全家族的規則', 'A rule for every app']]],
    rules: [['只放台灣看得到的比賽', 'Only games Taiwan can watch'], ['券商規則跟真的一樣', 'Broker rules as real as the real thing'], ['只做手機', 'Phones only'], ['颱風假在每個 App 都是假日', 'A typhoon day off is a holiday everywhere']]
  },
  'team-coordinator': {
    flow: [['user', ['Jay 說一句', 'Jay says it']], ['grid', ['協調者拆開', 'The coordinator splits it']], ['list', ['交給工作串', 'Hands it to a thread']], ['clock', ['每小時檢查', 'Checks hourly']]]
  },
  'team-lanes': {
    nums: [['13', ['個工作串同時在跑（2026-10-23）', 'threads at once (2026-10-23)']]],
    rules: [['一串一個目標', 'One goal a thread'], ['測試過就上線', 'Ships once tests pass'], ['不互相等', 'Never waits on another']]
  },
  'team-memory': {
    flow: [['list', ['新的工作串', 'A new thread']], ['book', ['先讀記憶和規則書', 'Reads memory and rules']], ['check', ['不用再問 Jay', 'No need to ask Jay']]],
    nums: [['1', ['頁的規則書', 'page of rules']]]
  },
  'team-loop': {
    flow: [['user', ['Jay 發現問題', 'Jay spots it']], ['camera', ['截圖或紀錄', 'Screenshot or log']], ['grid', ['交給對的工作串', 'To the right thread']], ['search', ['找出真正原因', 'The real cause']], ['check', ['修好、測試、截圖', 'Fixed, tested, seen']], ['send', ['自動上線', 'Ships']]]
  },
  'team-lessons': {
    pairs: [
      [['從舊副本推上去，清空 21,927 筆裁判', 'A push from an old copy wiped 21,927 rulings'], ['推之前一定先同步', 'Always sync before a push']],
      [['iPad 和電腦版面一直壞', 'iPad and desktop layouts kept breaking'], ['只做手機', 'Phones only']],
      [['ESPN 的排名太慢', 'ESPN’s tables lagged'], ['自己算', 'Count them ourselves']],
      [['新零件讓舊手機掛掉', 'A new part broke older phones'], ['新零件一律有後備', 'Every new part has a fallback']],
      [['讀取失敗被當成沒資料', 'A failed read taken as no data'], ['失敗不是空的', 'A failure isn’t empty']]
    ]
  },
  // ---- More pictures for the app branches ----
  'sports-final': {
    flow: [['ball', ['九局下', 'Bottom of the 9th']], ['flag', ['主隊領先', 'Home side ahead']], ['check', ['就是結束了', 'It’s over']]]
  },
  'sports-soccer': {
    pairs: [[['85 分鐘 1 比 1，還寫 77%', '1–1 at 85 min, still 77%'], ['晚段平手偏向和局', 'A late draw leans to a draw']]]
  },
  'sports-chance': {
    flow: [['chart', ['外界預估', 'Wider estimates']], ['ball', ['沒有才用 ESPN', 'ESPN only if none']], ['target', ['足球加自己的', 'Soccer: our own too']]]
  },
  'sports-lineups': {
    flow: [['user', ['RotoWire 預計先發', 'RotoWire’s lineups']], ['history', ['上一場的先發', 'Last game’s five']], ['list', ['球隊深度表', 'The depth chart']]]
  },
  'sports-home-league': {
    pairs: [[['Lech 只出現在歐霸', 'Lech only in the Europa League'], ['補上波蘭聯賽排名', 'Its Polish table added']]]
  },
  'sports-f1': {
    tags: [['map', ['賽道圖上的車', 'Cars on the map']], ['clock', ['圈速', 'Lap times']], ['target', ['輪胎', 'Tyres']], ['chart', ['勝率', 'Win chance']], ['flag', ['賽事指揮翻成中文', 'Race control in Chinese']]]
  },
  'sports-today': {
    pairs: [[['每個聯賽各問一次', 'One ask per league'], ['一天的比分一次給', 'A day’s scores in one']]]
  },
  'sports-kept': {
    flow: [['ball', ['比賽打完', 'Game over']], ['backpack', ['存進倉庫', 'Saved to storage']], ['check', ['以後秒開', 'Opens at once after']]]
  },
  'sports-direct': {
    flow: [['x', ['雲端被擋', 'The cloud is refused']], ['user', ['改由手機讀', 'The phone reads it']], ['check', ['賽程照樣在', 'The schedule stays']]]
  },
  'transit-rank': {
    flow: [['user', ['Jay 真實的通勤', 'Jay’s real trips']], ['list', ['存成判決', 'Saved as verdicts']], ['check', ['排錯測試不過', 'A wrong order fails']]]
  },
  'transit-rail': {
    flow: [['train', ['所有班次', 'Every train']], ['search', ['一次掃過', 'One scan']], ['flag', ['最快的組合', 'The fastest mix']]]
  },
  'transit-stopped': {
    flow: [['bus', ['路上有幾台車', 'Buses on the road']], ['bell', ['營運公告', 'Service notices']], ['x', ['避開停駛的', 'Skip what’s stopped']]]
  },
  'transit-metro': {
    pairs: [[['每支手機自己排版', 'Each phone lays it out'], ['事先算好，路網變了才重算', 'Laid out ahead, redone on change']]]
  },
  'transit-nav': {
    flow: [['walk', ['走路', 'Walk']], ['bus', ['上車', 'Board']], ['bell', ['前一站提醒', 'Alert a stop before']], ['flag', ['到了', 'Arrive']]]
  },
  'transit-bike': {
    flow: [['bike', ['先看有沒有車', 'Bikes there?']], ['map', ['過溪走最近的橋', 'Nearest bridge']], ['check', ['可靠的備案', 'A sure fallback']]]
  },
  'transit-packs': {
    flow: [['clock', ['每週一次', 'Once a week']], ['backpack', ['每個縣市一包', 'A pack per city']], ['pin', ['手機算附近站牌', 'Stops found on the phone']]]
  },
  'transit-caps': {
    flow: [['map', ['Google 地圖', 'Google Maps']], ['x', ['超過月上限', 'Over the month’s cap']], ['map', ['換成國土測繪中心地圖', 'Switch to NLSC maps']]]
  },
  'weather-blend': {
    flow: [['sun', ['Google', 'Google']], ['cloud', ['氣象署', 'CWA']], ['rain', ['MET Norway…', 'MET Norway…']], ['check', ['一個數字', 'One number']]]
  },
  'weather-soon': {
    pairs: [[['每次都說「可能下雨」', '“Might rain” all the time'], ['兩小時內要下才說', 'Only when it’s within two hours']]]
  },
  'weather-plan': {
    flow: [['school', ['早上在學校', 'Morning at school']], ['bus', ['下午出門', 'Afternoon out']], ['pin', ['晚上回家', 'Evening home']]]
  },
  'weather-squares': {
    pairs: [[['每個人各問 Google', 'Each person asks Google'], ['同一格大家共用', 'One square, shared']]]
  },
  'class-clock': {
    flow: [['clock', ['現在幾點', 'The time']], ['list', ['課表', 'The timetable']], ['school', ['這節、下一節、放學', 'Now, next, home']]]
  },
  'class-weeks': {
    flow: [['calendar', ['開學那週', 'Week one']], ['swap', ['自己數單雙週', 'Count odd/even']], ['check', ['隔週的課永遠對', 'Every-other-week right']]]
  },
  'class-swap': {
    pairs: [[['調課後有的地方沒改到', 'A swap missed some screens'], ['一個規則，所有畫面都用它', 'One rule every screen reads']]]
  },
  'words-hard': {
    tags: [['target', ['易混字', 'Look-alikes']], ['list', ['相近的意思', 'Close meanings']], ['pencil', ['離線做好的提示', 'Hints made offline']]]
  },
  'words-dict': {
    pairs: [[['mean：低劣的', 'mean: “inferior”'], ['mean：意思是', 'mean: “to signify”']]]
  },
  'words-offline': {
    flow: [['backpack', ['全部存在手機', 'All on the phone']], ['swap', ['回到網路就合併', 'Merged when back']], ['check', ['兩台不互蓋', 'Neither overwrites']]]
  },
  'beats-radio': {
    flow: [['spark', ['做下一首', 'Make the next song']], ['play', ['接在同一條串流', 'Join one stream']], ['lock', ['鎖螢幕繼續播', 'Plays when locked']]]
  },
  'beats-ears': {
    pairs: [[['約 -10 LUFS', 'About -10 LUFS'], ['約 -12.7 LUFS，音量差不到 0.8', 'About -12.7, under 0.8 apart']]]
  },
  'beats-hear': {
    nums: [['97%', ['速度完全正確', 'tempo exactly right']], ['97.5%', ['角色判斷正確', 'parts right']], ['100', ['組測試', 'test songs']]]
  },
  'beats-game': {
    nums: [['4', ['種難度', 'levels']], [['±45 毫秒', '±45 ms'], ['判定', 'timing window']], ['16', ['首歌都測過', 'songs tested']]]
  },
  'law-three': {
    flow: [['book', ['法律', 'A law']], ['shield', ['判它的判決', 'Its rulings']], ['list', ['正在修它的法案', 'Bills changing it']]]
  },
  'law-stages': {
    flow: [['pencil', ['提案', 'Proposed']], ['user', ['等委員會審', 'In committee']], ['swap', ['政黨協商中', 'Party talks']], ['check', ['三讀', 'Passed']]]
  },
  'sec-ledger': {
    flow: [['list', ['每一筆都記下', 'Every entry kept']], ['coin', ['餘額由流水帳算', 'Balance from the ledger']], ['check', ['不會憑空變多', 'Never from nowhere']]]
  },
  'sec-fill': {
    flow: [['user', ['掛單', 'Place an order']], ['cloud', ['伺服器看報價', 'Server watches prices']], ['check', ['App 關著也成交', 'Fills with the app closed']]]
  },
  'sec-rules': {
    tags: [['chart', ['台股', 'Taiwan shares']], ['chart', ['美股', 'US shares']], ['exchange', ['期貨', 'Futures']], ['exchange', ['選擇權', 'Options']], ['wallet', ['基金', 'Funds']], ['bank', ['債券', 'Bonds']], ['coin', ['外匯、黃金', 'FX, gold']]]
  },
  'money-guess': {
    flow: [['spark', ['猜好分類和付款', 'Category and card guessed']], ['coin', ['點常用金額', 'Tap a usual amount']], ['check', ['儲存', 'Save']]]
  },
  'money-merge': {
    pairs: [[['兩台手機，後存的蓋掉先存的', 'Two phones, the later save wins'], ['一筆一筆合併', 'Merged entry by entry']]]
  },
  'money-invoice': {
    flow: [['camera', ['掃 QR Code', 'Scan the QR']], ['ticket', ['讀出品項和金額', 'Items and amount']], ['check', ['一筆完整的帳', 'A complete entry']]]
  },
  'money-carrier': {
    flow: [['list', ['匯出發票 CSV', 'Export the CSV']], ['pencil', ['選檔匯入', 'Pick the file']], ['wallet', ['一次記好，不重複', 'All in, none doubled']]]
  },
  'kit-look': {
    tags: [['spark', ['顏色', 'Colour']], ['pencil', ['字級', 'Type']], ['grid', ['圓角', 'Corners']], ['moon', ['深色模式', 'Dark mode']], ['play', ['彈簧動畫', 'Springs']]]
  },
  'kit-ui': {
    tags: [['grid', ['底部分頁列', 'Tab bar']], ['list', ['滑上來的視窗', 'Sheets']], ['calendar', ['日期列', 'Day strip']], ['swap', ['分段按鈕', 'Segmented control']]]
  },
  'kit-dayoff': {
    tags: [['school', ['上課看學校的縣市', 'Classes: the school’s county']], ['work', ['上班看工作地點', 'Work: the workplace']], ['chart', ['股市看臺北市', 'Market: Taipei']]]
  },
  'kit-shared-logic': {
    flow: [['pencil', ['寫一次', 'Written once']], ['user', ['手機跑', 'Phone runs it']], ['cloud', ['雲端也跑', 'Cloud runs it']], ['check', ['答案一樣', 'Same answer']]]
  },
  'pass-session': {
    flow: [['user', ['手機 A 打開', 'Phone A opens']], ['user', ['手機 B 打開', 'Phone B opens']], ['clock', ['A 暫停', 'A pauses']]]
  },
  'pass-sync': {
    flow: [['search', ['先讀雲端那份', 'Read the cloud copy']], ['swap', ['合併', 'Merge']], ['check', ['再存', 'Then save']]]
  },
  'fast-sw': {
    pairs: [[['捷運地下打不開', 'Won’t open underground'], ['離線也打得開', 'Opens offline']]]
  }
};

export const SHOW = S;
