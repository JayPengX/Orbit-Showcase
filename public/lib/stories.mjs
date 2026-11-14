// The map: the whole system in five rows (the phone, GitHub, Cloudflare,
// cloud storage, the outside world), and everyday stories walked across it
// one step at a time: opening Orbit, one for every app, and Jay's fix. Every
// step names the map spot it happens at and, where there is one, the tree
// node that explains it. `short` names a story on its button; `app` is its
// app's brand (null: Orbit's own mark, `icon` with neither).

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
    { id: 'ai', icon: 'ai', label: ['AI（Claude、GPT、Gemini）', 'AI (Claude, GPT, Gemini)'], tree: 'ai' }
  ] }
];

export const STORIES = [
  {
    id: 'open', app: null, icon: 'grid',
    title: ['打開 Orbit，在 App 之間切換', 'Opening Orbit and switching apps'],
    short: ['打開', 'Open'],
    steps: [
      ['phone', ['你點了主畫面上的 Orbit。', 'You tap Orbit on your home screen.']],
      ['sw', ['手機先拿出存好的檔案，馬上畫出 Orbit 的首頁，不等網路。', 'The phone draws Orbit’s home from files it kept, without waiting for the network.']],
      ['app', ['同時看看有沒有新版；有的話只下載改過的檔案。', 'Meanwhile it checks for a new version, fetching only files that changed.']],
      ['gate', ['雲端確認你的 Pass 一次，十個 App 都算登入了。', 'The cloud checks your Pass once, and all ten apps are signed in.']],
      ['phone', ['你點 Sports，它在上方變成一個分頁。', 'You tap Sports and it opens as a tab at the top.']],
      ['proxy', ['進行中的比分，2 秒內有人問過就大家共用。', 'A live score someone asked for under 2 seconds ago is shared.']],
      ['r2', ['今天的賽程早就做成資料包，放在雲端倉庫。', 'Today’s schedule is already a ready-made pack in storage.']],
      ['src', ['只有真的沒人有的，才去問 ESPN。', 'Only what nobody has yet is asked of ESPN.']],
      ['phone', ['你切到天氣再切回來：Sports 還在原本的畫面和位置，不重新載入、不閃白。', 'You switch to Weather and back: Sports is just where you left it, no reload, no white flash.']]
    ]
  },
  {
    id: 'rain', app: 'weather', icon: 'cloud',
    title: ['快下雨了，交通自己改路線', 'Rain is coming, and Transit replans'],
    short: ['下雨', 'Rain'],
    steps: [
      ['phone', ['你打開 Weather，看你所在的鄉鎮。', 'You open Weather for your township.']],
      ['proxy', ['代理去讀氣象署和 Google 的預報；同一個地方剛有人讀過，就直接共用。', 'The proxy reads CWA’s and Google’s forecasts; a place someone just read is shared.']],
      ['src', ['中央氣象署、Google Weather 和其他國際模型。', 'CWA, Google Weather and other global models.']],
      ['phone', ['Weather 在手機上的家族筆記寫下「五點後竹東下雨」，不會傳到雲端。', 'Weather notes “rain in Zhudong after 5” in the family notebook on the phone; it never goes to the cloud.']],
      ['phone', ['你在 Transit 查回家的路，它讀到這一筆，把騎 YouBike 換成搭公車。', 'You plan the way home in Transit; it reads that note and swaps the YouBike ride for a bus.']]
    ]
  },
  {
    id: 'bus', app: 'transit', icon: 'bus',
    title: ['App 關著也提醒你公車快到了', 'A bus alert with the app closed'],
    short: ['公車', 'Bus'],
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
    id: 'flight', app: 'orbit', icon: 'clock',
    title: ['在 Class 開一趟專注飛行', 'A focus flight in Class'],
    short: ['專注', 'Focus'],
    steps: [
      ['phone', ['你選 50 分鐘，開始讀書。', 'You pick 50 minutes and start studying.']],
      ['proxy', ['雲端從 15 個機場附近收集現在天上的客機。', 'The cloud gathers airliners in the air around 15 airports.']],
      ['src', ['真實的飛機位置和航線，來自公開的航班追蹤資料。', 'Real positions and routes, from open flight-tracking data.']],
      ['phone', ['手機挑一班大約 50 分鐘後降落的，畫它在衛星地圖上飛。', 'The phone picks one landing in about 50 minutes and draws it flying over a satellite map.']],
      ['phone', ['你切到別的 App，Class 的分頁寫著「進行中」，一點就回到飛機。', 'Switch to another app and Class’s tab says Live; one tap brings the plane back.']],
      ['phone', ['時間到，飛機落地，手機通知你。', 'Time’s up: the plane lands and the phone tells you.']]
    ]
  },
  {
    id: 'photo', app: 'money', icon: 'camera',
    title: ['拍一張收據就記好一筆帳', 'One photo, one entry in Money'],
    short: ['拍照', 'Photo'],
    steps: [
      ['phone', ['你拍了一張收據；如果是電子發票，手機自己讀 QR code，不用 AI。', 'You photograph a receipt; an e-invoice’s QR code is read on the phone itself, no AI.']],
      ['gate', ['其他的照片，先確認 Pass 和今天還能用幾次。', 'For anything else, your Pass and today’s allowance are checked first.']],
      ['ai', ['AI 讀出金額、日期、店名和品項，分類只能從你自己的清單裡選。', 'AI reads the amount, day, store and items; the category can only come from your own list.']],
      ['proxy', ['回來之前先檢查：日期是真的、金額是整數。', 'Before it comes back it’s checked: a real day, a whole amount.']],
      ['phone', ['你看到一筆填好的帳，看一眼再存；一樣的帳記過了，它會問要不要合併。', 'You see a filled-in entry to check before saving; if it’s already logged, it asks to merge.']],
      ['d1', ['帳本跟著你的 Pass 存在資料庫，換手機也在。', 'The books are saved with your Pass, there on any phone.']]
    ]
  },
  {
    id: 'news', app: 'news', icon: 'news',
    title: ['打開一則新聞，看各方怎麼說', 'Opening a story in News'],
    short: ['新聞', 'News'],
    steps: [
      ['cron', ['每 10 分鐘，排程輪流讀各家媒體的新聞。', 'Every 10 minutes a schedule reads the outlets’ feeds in turn.']],
      ['src', ['118 家新聞媒體自己的標題、連結和摘要。', 'The 118 outlets’ own headlines, links and summaries.']],
      ['r2', ['程式把同一件事的報導放在一起、分好主題，寫成一個檔案，不用 AI。', 'Code groups reports of the same event and sorts them by topic into one file, no AI.']],
      ['phone', ['你打開 News 讀這個檔，點開一則。', 'You open News, which reads that file, and tap a story.']],
      ['d1', ['如果有人看過這則，各方怎麼說已經做好，直接給你。', 'If someone already opened it, each side’s angle is ready and comes straight to you.']],
      ['ai', ['你是第一個？這時才請 AI 只從各家的標題寫出差別；等的時候先畫出答案的形狀。', 'First to open it? Only now is AI asked to write the difference from the outlets’ own headlines, its shape showing while you wait.']],
      ['d1', ['做好就留給之後的每個人，多一個人看不多花錢。', 'It’s kept for everyone after, so one more reader costs nothing.']]
    ]
  },
  {
    id: 'words', app: 'vocab', icon: 'book',
    title: ['沒有網路也能背單字', 'Learning words with no signal'],
    short: ['單字', 'Words'],
    steps: [
      ['phone', ['你在沒有訊號的地方打開 Words。', 'You open Words somewhere with no signal.']],
      ['sw', ['整個 App 和整本字典都存在手機裡，照樣打開。', 'The whole app and the whole dictionary are kept on the phone, so it opens anyway.']],
      ['phone', ['它算出你哪些字快忘了，在那之前考你，還故意考最容易搞混的。', 'It works out which words you’re about to forget and asks just before, with the likeliest mix-ups.']],
      ['phone', ['進度先存在手機上。', 'Your progress is saved on the phone first.']],
      ['d1', ['回到有網路的地方，先跟雲端那份合併再存，另一台裝置背的也不會不見。', 'Back online, it merges with the cloud copy before saving, so what another device learned survives.']]
    ]
  },
  {
    id: 'beats', app: 'beats', icon: 'play',
    title: ['Beats 在你的手機上作一首歌', 'Beats writes a song on your phone'],
    short: ['音樂', 'Music'],
    steps: [
      ['phone', ['你按下播放。', 'You press play.']],
      ['phone', ['手機在背景作曲和混音，畫面不卡。', 'The phone composes and mixes in the background, and the screen never stalls.']],
      ['app', ['只下載這首歌用到的真實樂器錄音，解碼一次就重複使用。', 'Only the real instrument recordings this song plays are fetched, decoded once and reused.']],
      ['phone', ['歌在手機上播，聲音從不離開手機；鎖屏也照樣播。', 'The song plays on the phone, its sound never leaving it, even locked.']],
      ['d1', ['喜歡的歌只存成約 300 bytes 的配方，跟著你的 Pass。', 'A song you keep is saved as a recipe of about 300 bytes, with your Pass.']]
    ]
  },
  {
    id: 'ask', app: 'law', icon: 'shield',
    title: ['問 Orbit Law 一個問題', 'Asking Orbit Law a question'],
    short: ['法律', 'Law'],
    steps: [
      ['phone', ['你問：「房東不還押金怎麼辦？」AI 只在你按下送出才會跑。', 'You ask: “My landlord won’t return my deposit.” The AI runs only when you tap send.']],
      ['gate', ['確認 Pass；每人每天最多 30 次，費用不會失控。', 'Your Pass is checked; 30 questions a day each keeps costs in hand.']],
      ['kv', ['一樣的問題、一樣版本的法律，答過就直接用。', 'The same question on the same version of the law reuses its answer.']],
      ['app', ['從 Orbit Law 自己的資料找出最多 14 條相關條文，加上類似的判決、條文交給主管機關定的辦法、議員和代表的質詢。', 'Up to 14 relevant articles are found in Orbit Law’s own data, with similar rulings, the regulations an article leaves details to, and councillors’ questions.']],
      ['relay', ['經過台灣的中繼站去問 AI。', 'The question goes through the Taiwan relay to the AI.']],
      ['ai', ['Claude 只能用找到的資料回答，還要判斷誰可能有理；它忙的時候，換另一家同等級的 AI 回答。', 'Claude may answer only from what was found, and must judge who is likely right; when it’s busy, an AI of its class from another maker answers.']],
      ['proxy', ['每一個引用都被檢查過才送回來。', 'Every citation is checked before the answer comes back.']],
      ['phone', ['答案一邊寫一邊出現，畫成結論、重點和條文卡片，每一點都能點開原文。', 'The answer streams in, drawn as a verdict, points and article cards, every point opening its source.']]
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
    id: 'fix', icon: 'camera',
    title: ['Jay 發現一個問題', 'Jay spots a problem'],
    short: ['修問題', 'A fix'],
    steps: [
      ['phone', ['Jay 在 iPhone 上截圖：「這個名字被切掉了」。', 'Jay screenshots it on his iPhone: “this name is cut off”.']],
      ['repo', ['Claude 找出真正的原因、修改程式，並在 iPhone 的 Safari 引擎上截圖確認。', 'Claude finds the real cause, changes the code and checks a screenshot in iPhone’s Safari engine.']],
      ['repo', ['上千個自動檢查全部通過，才可以往下走。', 'Thousands of automatic checks must all pass first.']],
      ['kit', ['如果改的是共用零件，零件先上線，十個 App 一起變好。', 'If it was a shared part, the part goes live first and ten apps improve together.']],
      ['app', ['自動壓縮、每個檔案蓋上指紋、發布。', 'Files are minified, fingerprinted and published by themselves.']],
      ['phone', ['Jay 下次打開，只下載改過的那幾 KB。', 'Next time Jay opens it, only the few changed kilobytes download.']]
    ]
  }
];
