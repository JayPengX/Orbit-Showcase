// The map: the whole system in five rows (the phone, GitHub, Cloudflare,
// cloud storage, the outside world), and five everyday stories walked
// across it one step at a time. Every step names the map spot it happens at
// and, where there is one, the tree node that explains it. `short` names a
// story on its button (all five sit in one row, even on a phone).

export const ROWS = [
  { id: 'phone', label: ['你的手機', 'Your phone'], nodes: [
    { id: 'phone', icon: 'user', label: ['App', 'The app'] },
    { id: 'sw', icon: 'backpack', label: ['手機裡存好的檔案', 'Files kept on the phone'], tree: 'fast-sw' }
  ] },
  { id: 'gh', label: ['GitHub', 'GitHub'], nodes: [
    { id: 'repo', icon: 'pencil', label: ['程式碼', 'The code'], tree: 'ship-tests' },
    { id: 'app', icon: 'grid', label: ['App 網站', 'App sites'], tree: 'ship-pages' },
    { id: 'kit', icon: 'backpack', label: ['共用零件', 'Shared parts'], tree: 'kit' }
  ] },
  { id: 'cf', label: ['Cloudflare 雲端', 'Cloudflare'], nodes: [
    { id: 'gate', icon: 'lock', label: ['守門', 'Gate'], tree: 'cloud-gate' },
    { id: 'proxy', icon: 'swap', label: ['資料代理', 'Data proxy'], tree: 'cloud-proxy' },
    { id: 'cron', icon: 'clock', label: ['排程', 'Schedules'], tree: 'cloud-cron' },
    { id: 'push', icon: 'bell', label: ['通知', 'Notices'], tree: 'cloud-push' },
    { id: 'relay', icon: 'send', label: ['台灣 AI 中繼', 'Taiwan AI relay'], tree: 'cloud-relay' }
  ] },
  { id: 'store', label: ['雲端儲存', 'Cloud storage'], nodes: [
    { id: 'd1', icon: 'list', label: ['資料庫', 'Database'], tree: 'store-d1' },
    { id: 'r2', icon: 'backpack', label: ['雲端倉庫', 'Storage'], tree: 'store-r2' },
    { id: 'kv', icon: 'grid', label: ['快速抽屜', 'Quick drawers'], tree: 'store-kv' }
  ] },
  { id: 'world', label: ['外面的世界', 'The outside world'], nodes: [
    { id: 'src', icon: 'tv', label: ['資料來源', 'Data sources'], tree: 'store-layers' },
    { id: 'ai', icon: 'spark', label: ['Gemini AI', 'Gemini AI'], tree: 'law-ai' }
  ] }
];

export const STORIES = [
  {
    id: 'open', app: 'match', icon: 'ball',
    title: ['打開 Orbit Sports', 'Opening Orbit Sports'],
    short: ['打開', 'Open'],
    steps: [
      ['phone', ['你點了主畫面上的 Sports。', 'You tap Sports on your home screen.']],
      ['sw', ['手機先拿出存好的檔案，馬上開始畫，不等網路。', 'The phone starts drawing from files it kept, without waiting for the network.']],
      ['app', ['同時看看有沒有新版；有的話只下載改過的檔案。', 'Meanwhile it checks for a new version, fetching only files that changed.']],
      ['gate', ['雲端先確認你的 Pass：是家族的 App 在問。', 'The cloud checks your Pass: a family app is asking.']],
      ['proxy', ['代理看看是不是剛剛有人問過一樣的：進行中的比分，2 秒內的答案大家共用。', 'The proxy checks whether someone just asked the same: a live score under 2 seconds old is shared.']],
      ['r2', ['今天的賽程早就做成資料包，放在雲端倉庫。', 'Today’s schedule is already a ready-made pack in storage.']],
      ['src', ['只有真的沒人有的，才去問 ESPN。', 'Only what nobody has yet is asked of ESPN.']],
      ['phone', ['畫面和圖片都好了，載入畫面才掀開。', 'Once the page and its pictures are ready, the loading screen lifts.']]
    ]
  },
  {
    id: 'ask', app: 'law', icon: 'shield',
    title: ['問 Orbit Law 一個問題', 'Asking Orbit Law a question'],
    short: ['問 AI', 'Ask AI'],
    steps: [
      ['phone', ['你問：「房東不還押金怎麼辦？」AI 只在你按下送出才會跑。', 'You ask: “My landlord won’t return my deposit.” The AI runs only when you tap send.']],
      ['gate', ['確認 Pass；每人每天最多 30 次，費用不會失控。', 'Your Pass is checked; 30 questions a day each keeps costs in hand.']],
      ['kv', ['一樣的問題、一樣版本的法律，答過就直接用。', 'The same question on the same version of the law reuses its answer.']],
      ['app', ['從 Orbit Law 自己的資料找出最多 14 條相關條文，加上類似的判決。', 'Up to 14 relevant articles are found in Orbit Law’s own data, with similar rulings.']],
      ['relay', ['經過台灣的中繼站去問 AI（AI 不接受香港機房的請求）。', 'The question goes through the Taiwan relay (the AI refuses Hong Kong’s data centre).']],
      ['ai', ['AI 只能用找到的資料回答，還要判斷誰可能有理。', 'The AI may answer only from what was found, and must judge who is likely right.']],
      ['proxy', ['每一個引用都被檢查過才送回來。', 'Every citation is checked before the answer comes back.']],
      ['phone', ['答案的每一點都能點開原文。', 'Every point of the answer opens its source.']]
    ]
  },
  {
    id: 'order', app: 'stock', icon: 'chart',
    title: ['掛一張股票的單', 'Placing a share order'],
    short: ['下單', 'Order'],
    steps: [
      ['phone', ['你在 Securities 掛了一張限價買單，然後關掉 App。', 'You place a limit buy order in Securities and close the app.']],
      ['proxy', ['雲端第一次看到這張單，就記下它的條件和時間；之後手機不能改，也不能假裝更早下單。', 'The first time the cloud sees the order it notes its terms and time; the phone can’t change it or pretend it was placed earlier.']],
      ['d1', ['這些記錄存在資料庫裡。', 'That record is kept in the database.']],
      ['phone', ['隔天你打開 App，它問雲端：「我的單成交了嗎？」', 'Next day you open the app and it asks the cloud: “did my order fill?”']],
      ['src', ['雲端拿掛單之後的真實價格（5 分鐘 K 線）。', 'The cloud fetches the real prices since the order (5-minute bars).']],
      ['proxy', ['找第一根碰到你價格的 K 線，照真實的交易規則成交。', 'It finds the first bar that reached your price and fills by the real trading rules.']],
      ['phone', ['帳戶照雲端的決定更新，所以什麼時候打開結果都一樣。', 'The account follows the cloud’s decision, so it doesn’t matter when you open it.']]
    ]
  },
  {
    id: 'bus', app: 'transit', icon: 'bus',
    title: ['App 關著也提醒你公車快到了', 'A bus alert with the app closed'],
    short: ['公車提醒', 'Bus alert'],
    steps: [
      ['phone', ['你在 Transit 設定「公車快到時提醒我」，然後鎖上手機。', 'In Transit you ask to be told when the bus is near, then lock the phone.']],
      ['push', ['這個提醒交給雲端記著。', 'The cloud keeps that reminder.']],
      ['cron', ['每兩分鐘，排程醒來一次。', 'Every two minutes a schedule wakes up.']],
      ['src', ['問交通部的資料，公車現在在哪裡。', 'It asks the transport ministry’s data where the bus is now.']],
      ['push', ['先確認公車真的快到了，才加密送出。', 'It confirms the bus really is near, then sends the notice encrypted.']],
      ['phone', ['鎖著的手機跳出通知。', 'The locked phone shows the notice.']]
    ]
  },
  {
    id: 'fix', app: null, icon: 'camera',
    title: ['Jay 發現一個問題', 'Jay spots a problem'],
    short: ['修問題', 'A fix'],
    steps: [
      ['phone', ['Jay 在 iPhone 上截圖：「這個名字被切掉了」。', 'Jay screenshots it on his iPhone: “this name is cut off”.']],
      ['repo', ['Claude 找出真正的原因、修改程式，並在 iPhone 的 Safari 引擎上截圖確認。', 'Claude finds the real cause, changes the code and checks a screenshot in iPhone’s Safari engine.']],
      ['repo', ['上千個自動檢查全部通過，才可以往下走。', 'Thousands of automatic checks must all pass first.']],
      ['kit', ['如果改的是共用零件，零件先上線，九個 App 一起變好。', 'If it was a shared part, the part goes live first and nine apps improve together.']],
      ['app', ['自動壓縮、每個檔案蓋上指紋、發布。', 'Files are minified, fingerprinted and published by themselves.']],
      ['phone', ['Jay 下次打開，只下載改過的那幾 KB。', 'Next time Jay opens it, only the few changed kilobytes download.']]
    ]
  }
];
