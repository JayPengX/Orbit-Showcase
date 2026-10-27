// The real system behind each app, layer by layer: what runs on the phone,
// what GitHub Pages serves, what the Worker (the bridge) does with every
// request, where things are kept, what runs on a clock when nobody is
// looking, and where the data comes from. Every name is the real file,
// route or binding; every number in a move comes from the code's comments
// or the commit that made it. Drawn by views/system.mjs.
//   PARTS    id → { layer, name (the real name), say: [zh, en], shared }
//   SYSTEMS  app → { parts, flows: [from, to, [zh, en]], moves }
//   a move   { at (the part it lives in), title, problem, built, result, numbers }

export const GROUPS = [
  { id: 'user', name: ['使用者端', 'User side'], tag: 'App', layers: ['phone', 'pages'] },
  { id: 'server', name: ['伺服器', 'Server'], tag: 'Proxy', layers: ['worker'] },
  { id: 'back', name: ['後端', 'Backend'], tag: 'Storage + jobs', layers: ['storage', 'jobs'] },
  { id: 'out', name: ['外部資料', 'Outside'], tag: 'Sources', layers: ['sources'] }
];

export const LAYERS = {
  phone: { name: ['手機上的 App', 'The app on the phone'], say: ['畫面、自家運算和本機副本，都在手機上跑', 'Screens, its own maths and local copies, all on the phone'] },
  pages: { name: ['GitHub Pages + 共用工具包', 'GitHub Pages + shared kit'], say: ['免費放 App 的檔案；九個 App 共用同一份工具包', 'Free hosting for the app files; one kit shared by all nine'] },
  worker: { name: ['代理伺服器 orbit-workers-proxy', 'The proxy, orbit-workers-proxy'], say: ['每個請求都過這座橋：查通行證、轉送、縮小、快取', 'Every request crosses this bridge: Pass check, forward, trim, cache'] },
  storage: { name: ['儲存與快取', 'Storage and caches'], say: ['KV 放小狀態，D1 是資料庫，R2 放檔案，邊緣快取擋重複讀取', 'KV for small state, D1 the database, R2 for files, the edge cache for repeat reads'] },
  jobs: { name: ['排程與自家運算', 'Clocks and our own work'], say: ['沒人打開時也在跑：每分鐘的排程、預先算好的資料、帳單煞車', 'Runs while nobody is looking: every-minute crons, data built ahead, the bill brake'] },
  sources: { name: ['外部資料來源', 'Where the data comes from'], say: ['政府和公司公開的資料', 'Public data from government and companies'] }
};

export const PARTS = {
  "phone-pwa": {"layer":"phone","name":"Home-screen PWA (index.html + manifest)","say":["安裝在主畫面的 App","The app the person installs and opens from the home screen."],"shared":true},
  "kit-orbit": {"layer":"phone","name":"kit/orbit.mjs (proxyJson, packJson, session)","say":["共用核心：登入、快取讀取、通知、離線規則","One shared core: session, cached reads, notices, offline rules."],"shared":true},
  "phone-cache": {"layer":"phone","name":"memory → Cache Storage → localStorage","say":["三層本機副本，App 開啟即有畫面","Three local copies, newest first, so the app opens at once."],"shared":true},
  "kit-sw": {"layer":"phone","name":"kit/sw.js + sw-images.js (service worker)","say":["保存 App 檔案讓它離線也能開，並檢查檔案雜湊","Keeps the app's files so it opens offline; checks each file's hash."],"shared":true},
  "pages-app": {"layer":"pages","name":"GitHub Pages jaypengx.github.io/<Repo>/","say":["託管 App 的靜態檔案，每次推送自動部署","Hosts the app's static files; every push to main deploys."],"shared":true},
  "pages-kit": {"layer":"pages","name":"Shared-Proxy kit/ on Pages (?v=<hash>)","say":["共用程式碼只有一份，依內容雜湊下載","One copy of the shared code, fetched by content hash."],"shared":true},
  "w-gate": {"layer":"worker","name":"worker.js router + Orbit Pass gate (qt=)","say":["把請求分派到各檔案，每條路徑都要通行證","Routes each request to its file; every route needs a Pass session."],"shared":true},
  "w-eco": {"layer":"worker","name":"/eco (eco.js, orbit-token.js)","say":["Orbit Pass：登入、短期憑證、各 App 的存檔","The Orbit Pass: sign-in, short-lived tokens, per-app saved data."],"shared":true},
  "w-push": {"layer":"worker","name":"/push (push.js)","say":["收下排定的通知，App 關閉時也能推送","Takes scheduled notices and sends them while the app is closed."],"shared":true},
  "w-config": {"layer":"worker","name":"/config","say":["把擁有者設定的更新速度提供給各 App","Serves the owner's live refresh speeds to every app."],"shared":true},
  "w-data": {"layer":"worker","name":"/data/<path> (data.js)","say":["公開讀取預先做好的資料檔","Public read of the family's prebuilt data files."],"shared":true},
  "st-d1": {"layer":"storage","name":"D1 STORE (orbit-store)","say":["資料庫：每個通行證的 App 存檔與歷史版本","Database holding each Pass's saved app data, with version history."],"shared":true},
  "st-kv": {"layer":"storage","name":"KV RATE_LIMIT_KV","say":["排程與請求都要讀到的小型共用狀態","Small shared state that cron jobs and requests must both see."],"shared":true},
  "st-r2": {"layer":"storage","name":"R2 orbit-data (binding DATA)","say":["物件儲存：賽季、資料包、夜間備份","Object storage for seasons, packs and nightly backups."],"shared":true},
  "st-edge": {"layer":"storage","name":"Cloudflare edge cache (Taiwan colo)","say":["短期共用快取，多支手機只需讀一次上游","Short-lived shared copies so many phones cost one upstream read."],"shared":true},
  "st-do": {"layer":"storage","name":"Durable Object F1_LOG (class F1Log)","say":["F1 賽事進行中逐圈記錄","Logs every F1 lap while a session runs."],"shared":true},
  "job-cron": {"layer":"jobs","name":"cron */2 + 1-59/2 (worker.js scheduled)","say":["每分鐘喚醒 Worker 處理通知、建置與 F1","Wakes the Worker every minute for notices, builders and F1."],"shared":true},
  "job-build": {"layer":"jobs","name":"builders/run.js → R2","say":["依排程建好資料檔，內容有變才寫入","Builds the family's data files on a schedule and writes only changes."],"shared":true},
  "job-guard": {"layer":"jobs","name":"quota-guard (guard-worker.js, GuardClock alarm 5 min)","say":["監看費用，達方案 90% 先放慢再停機","Watches the bill; slows then stops the proxy at 90% of the plan."],"shared":true},
  "job-gemini": {"layer":"jobs","name":"gemini-relay (service binding GEMINI_RELAY)","say":["固定在台灣的 Worker，代為呼叫 Gemini","A Worker pinned to Taiwan that calls Gemini for the proxy."],"shared":true},
  "src-webpush": {"layer":"sources","name":"Browser push services (Web Push, RFC 8291)","say":["把通知送到手機的 service worker","Delivers notices to the phone's service worker."],"shared":true},
  "sp-app": {"layer":"phone","name":"public/app.js, sheets.js, lib/espn.mjs","say":["分頁、比賽頁面與所有資料讀取","The tabs, match sheets and every read through getJson."],"shared":false},
  "sp-calc": {"layer":"phone","name":"lib/title.mjs liveTable, overByRule, soccerwp.mjs, picks.mjs","say":["自家運算：即時排名、比賽結束判定、足球勝率、今天值得看的比賽","Own maths: live standings, game-over rule, soccer win chance, the day’s games worth watching."],"shared":false},
  "sp-f1": {"layer":"phone","name":"lib/f1.mjs, racecontrol.mjs, carpace.mjs","say":["F1 即時看板運算：圈速、差距、賽道位置、賽事管制中文化","F1 live board maths: laps, gaps, track positions, race control in Chinese."],"shared":false},
  "sp-proxy": {"layer":"worker","name":"/sports-proxy (sports.js)","say":["白名單轉送上游資料，精簡並可批次（一次 24 筆）","Allow-listed pass-through of upstream feeds, trimmed, batched (24 reads)."],"shared":false},
  "sp-src-espn": {"layer":"sources","name":"site.api.espn.com, sports.core.api.espn.com","say":["比分、賽程、排名、技術統計、逐球紀錄","Scores, schedules, standings, box scores, play-by-play."],"shared":false},
  "sp-src-f1": {"layer":"sources","name":"livetiming.formula1.com, api.openf1.org, api.jolpi.ca","say":["F1 即時計時、賽事資料與賽季成績","F1 live timing, session tables and season results."],"shared":false},
  "sp-src-asia": {"layer":"sources","name":"npb.jp, koreabaseball.com, cpbl.com.tw (via asia-baseball.orbit)","say":["日韓台職棒直接讀各聯盟官網","Japan, Korea and Taiwan baseball read from their own sites."],"shared":false},
  "sp-src-tv": {"layer":"sources","name":"ELTA (piceltaott-elta.cdn.hinet.net, eltaott.tv), YouTube, FotMob, RotoWire, statsapi.mlb.com","say":["轉播、精華、足球榜單、先發名單、MLB 細節","Where to watch, highlights, soccer leaders, lineups, MLB detail."],"shared":false},
  "tr-app": {"layer":"phone","name":"app.mjs + lib/tab-*.mjs","say":["四個分頁：地圖、交通、查時刻、我的","The four tabs: map, 交通, 查時刻, 我的."],"shared":false},
  "tr-plan": {"layer":"phone","name":"lib/planner.mjs, plan.mjs rank, rail.mjs, metro*.mjs","say":["自家路線規劃：排序方案、台鐵高鐵與捷運路由、公車即時校時","Own trip planner: ranks ways, own train and metro routers, bus re-timing."],"shared":false},
  "tr-nav": {"layer":"phone","name":"lib/nav.mjs, navlive.mjs, rental.mjs, alerts.mjs","say":["沿途導航、YouBike 計時、到站提醒","Turn-by-turn on the trip, YouBike timer, bus arrival alerts."],"shared":false},
  "tr-local": {"layer":"phone","name":"ot.trips.v2, ot.nav.v1 (localStorage), Cache Storage","say":["已規劃行程與導航進度（關閉後可續）","Planned trips and navigation resumed after the app closes."],"shared":false},
  "tr-w": {"layer":"worker","name":"/transit/* (transit.js)","say":["TDX 白名單代理、搜尋、地點、路線、步行、行駛中公車","TDX allow-list proxy, search, place, route, walk, running buses."],"shared":false},
  "tr-bike": {"layer":"jobs","name":"warmBikes (transit.js, every 2 min)","say":["替近 30 分鐘有人查的城市預熱 YouBike","Keeps YouBike data warm for cities asked in the last 30 min."],"shared":false},
  "tr-src-tdx": {"layer":"sources","name":"tdx.transportdata.tw","say":["公車、鐵路、捷運、YouBike 即時與時刻資料","Bus, rail, metro, YouBike live and timetable data."],"shared":false},
  "tr-src-g": {"layer":"sources","name":"places / routes.googleapis.com, maps JS","say":["地點搜尋、步行路線、大眾運輸規劃、地圖","Place search, walking routes, transit plans, map tiles."],"shared":false},
  "tr-src-osm": {"layer":"sources","name":"nominatim.openstreetmap.org, routing.openstreetmap.de, api.nlsc.gov.tw","say":["超過 Google 月上限後的免費備援","Free fallbacks past the Google month cap."],"shared":false},
  "we-app": {"layer":"phone","name":"app.mjs + lib/cards.mjs","say":["三個分頁：今天、預報、地點；先顯示上次預報","Three tabs: 今天, 預報, 地點; opens on last forecast at once."],"shared":false},
  "we-plan": {"layer":"phone","name":"lib/soon.mjs, plan.mjs, pins.mjs","say":["即將下雨提示、依地點釘選的逐時行程預報","Rain-soon line, 我的行程 per-hour forecast by pinned place."],"shared":false},
  "we-w": {"layer":"worker","name":"/weather, /weather/where, /weather/places (weather.js)","say":["每約 1 公里格點的混合預報、鄉鎮、地點清單","One blended forecast per ~1 km cell, the township, the place list."],"shared":false},
  "we-ty": {"layer":"worker","name":"typhoon.js dayOff (in /weather)","say":["颱風警報期間的各縣市停班停課或預估機率","County 停班停課 answer or fitted chance while a typhoon warning is out."],"shared":false},
  "we-skill": {"layer":"jobs","name":"weather-skill.js weatherCron (hourly, :10)","say":["比對各來源與實測值，每日調整混合權重","Scores each source vs. station readings; moves blend weights daily."],"shared":false},
  "we-src-g": {"layer":"sources","name":"weather.googleapis.com, airquality.googleapis.com","say":["Google 預報與空氣品質（每日 450 次上限）","Google forecast and air quality (450 calls/day cap)."],"shared":false},
  "we-src-cwa": {"layer":"sources","name":"opendata.cwa.gov.tw (CWA_KEY)","say":["中央氣象署預報、測站觀測、雨量、颱風路徑","CWA forecast, station observations, rain gauges, typhoon track."],"shared":false},
  "we-src-moenv": {"layer":"sources","name":"data.moenv.gov.tw (MOENV_KEY)","say":["環境部空氣品質","Air-quality readings."],"shared":false},
  "we-src-ty": {"layer":"sources","name":"alerts.ncdr.nat.gov.tw, dgpa.gov.tw, MET Norway, Open-Meteo","say":["颱風警報、人事行政總處公告、縣市所在地雨量預報","Typhoon warning feed, official day-off page, rain forecasts at county seats."],"shared":false},
  "we-src-nlsc": {"layer":"sources","name":"api.nlsc.gov.tw","say":["由座標查鄉鎮市區","Looks up the township for a position."],"shared":false},
  "cl-app": {"layer":"phone","name":"src/dashboard.js (per-second loop), schedule.js","say":["每秒依時鐘重算整個狀態","Recomputes the whole state from the clock every second."],"shared":false},
  "cl-calc": {"layer":"phone","name":"src/schedule-calc.js, swap.js, dates.js","say":["單雙週、調課、假日：所有畫面共用同一規則","Odd/even weeks, 調課 swaps, holidays: one rule for every view."],"shared":false},
  "cl-ai": {"layer":"phone","name":"src/gemini-ocr.js, editor-nl-edit.js","say":["送出照片或一句話，先顯示差異再確認","Sends photos or one sentence; shows a diff to confirm."],"shared":false},
  "cl-local": {"layer":"phone","name":"localStorage classFocusData","say":["保存的課表，離線可開","The kept timetable; opens offline."],"shared":false},
  "cl-pages": {"layer":"pages","name":"Vite build → dist/ on GitHub Pages (static.yml)","say":["Vite 打包，版本取自 git commit","Orbit-Class built by Vite, version from the git commit."],"shared":false},
  "cl-gem": {"layer":"worker","name":"POST /gemini, /nl-edit (worker.js)","say":["提示詞與格式固定在伺服器，前端只送檔案或指令","Fixed prompts and schemas; client sends only files or an instruction."],"shared":false},
  "cl-src": {"layer":"sources","name":"generativelanguage.googleapis.com (gemini-3.7-flash, 3.5-flash-lite)","say":["辨識課表照片、把一句話轉成修改","Reads timetable photos and turns sentences into edits."],"shared":false},
  "wo-app": {"layer":"phone","name":"app.js, shell.js, views/","say":["今天、複習、單字、進度分頁與單字頁","Tabs 今天, 複習, 單字, 進度 and the word sheet."],"shared":false},
  "wo-mem": {"layer":"phone","name":"lib/words.mjs (FSRS-5), practice.mjs","say":["記憶模型、出題、誘答選項、點數與連續天數","Memory model, question choice, wrong options, points and streak."],"shared":false},
  "wo-sync": {"layer":"phone","name":"lib/copy.mjs + kit/pass-sync.mjs","say":["寫入前先與通行證的副本合併進度","Merges progress with the Pass's copy before any write."],"shared":false},
  "wo-local": {"layer":"phone","name":"localStorage progress, Cache Storage audio","say":["每次變更即存檔，可完全離線","Progress saved at every change; works fully offline."],"shared":false},
  "wo-pages": {"layer":"pages","name":"public/data/words.json (6,169), hints.json, audio/ on Pages","say":["大考中心字表、提示與每字錄音","The 大考中心 word list, hints and one recording per word."],"shared":false},
  "wo-src": {"layer":"sources","name":"Microsoft Jenny voice (offline script)","say":["錄音事先離線產生","Recordings made once offline by Shared-Proxy tools/word-audio.py."],"shared":false},
  "be-app": {"layer":"phone","name":"app.js + lib/*view.mjs","say":["聽、做歌、樂器、即興、資料庫","Tabs 聽, 做歌, 樂器, 即興, 資料庫."],"shared":false},
  "be-eng": {"layer":"phone","name":"public/engine.mjs, lib/radio.mjs, synth.mjs","say":["作曲引擎：節奏、和弦、旋律以樂句生成並混音","Song engine: grooves, chords, melodies written as phrases and mixed."],"shared":false},
  "be-wk": {"layer":"phone","name":"lib/maker.worker.mjs (Web Worker)","say":["在背景 Worker 預先做好兩首歌","Makes songs two ahead off the page so it never stalls."],"shared":false},
  "be-tape": {"layer":"phone","name":"lib/tape.mjs, player.mjs","say":["把歌接成連續音訊流，支援鎖定畫面控制","Joins songs on one endless audio stream, lock-screen controls."],"shared":false},
  "be-idb": {"layer":"phone","name":"IndexedDB (library, named kits), localStorage","say":["收藏歌曲與套組存在手機，聲音不上傳","Kept songs and kits stay on the phone; no sound is uploaded."],"shared":false},
  "be-samples": {"layer":"pages","name":"public/samples/ (MusyngKite soundfont, CC0 drums)","say":["錄音樂器，播到才下載","Recorded instruments fetched only when a song plays."],"shared":false},
  "la-app": {"layer":"phone","name":"app.mjs + lib/*.mjs","say":["首頁、法規、裁判、立法、我的，所有條文引用皆可點","Tabs 首頁, 法規, 裁判, 立法, 我的 with every reference a link."],"shared":false},
  "la-find": {"layer":"phone","name":"lib/refs.mjs, search.mjs, fulltext.mjs, bills.mjs","say":["自家引用連結規則、全文檢索、法案進度整併","Own link rules, bigram full-text search, bill stage folding."],"shared":false},
  "la-local": {"layer":"phone","name":"localStorage follows, bookmarks, chats","say":["追蹤、書籤、對話存在手機","Follows and AI chats stay on the phone."],"shared":false},
  "la-sw": {"layer":"phone","name":"public/sw.js (data: kept copy first, refreshed behind)","say":["開過的內容可離線閱讀","Reading works offline once opened."],"shared":false},
  "la-pages": {"layer":"pages","name":"Pages: public/data/ built at deploy (pages.yml, daily 03:30 Taiwan)","say":["法規、裁判、法案、行政規則，每日建置的靜態檔","Laws, rulings, bills, agencies as static files built each day."],"shared":false},
  "la-ask": {"layer":"worker","name":"/law-ask, /law-chat (law.js, law-chat.js, law-ground.js)","say":["以 Orbit Law 自家資料為依據的 Gemini 回答，逐點驗證引用","Gemini answers grounded in Orbit Law's own files; every cite checked."],"shared":false},
  "la-page": {"layer":"worker","name":"/law-page?u= (law-page.js)","say":["在 App 內讀政府網頁/判決，僅限 gov.tw","Reads a government page or judgment inside the app; gov.tw only."],"shared":false},
  "la-ci": {"layer":"jobs","name":"GitHub Actions: pages.yml, rulings.yml (nightly), live.yml (90 s)","say":["建置腳本抓取來源產生資料檔；開會時更新直播清單","Build scripts pull sources into data files; live feed rewritten while sitting."],"shared":false},
  "la-src-moj": {"layer":"sources","name":"law.moj.gov.tw bulk JSON (Ch/En)","say":["全國法規資料庫","All laws and regulations."],"shared":false},
  "la-src-ly": {"layer":"sources","name":"v2.ly.govapi.tw (g0v), ivod.ly.gov.tw","say":["立法院議案、會議、表決、直播","Bills, meetings, votes, live video list."],"shared":false},
  "la-src-court": {"layer":"sources","name":"Judicial Yuan archives, Constitutional Court, join.gov.tw, agency sites, data.gov.tw","say":["司法院、憲法法庭、公共政策網路參與平臺、各部會、政府資料開放平臺","Rulings, 釋字/憲判字, notices, ministry rules, budgets."],"shared":false},
  "la-src-gem": {"layer":"sources","name":"generativelanguage.googleapis.com","say":["產生依據明確的回答","Writes grounded answers."],"shared":false},
  "se-app": {"layer":"phone","name":"app.js + public/lib/*.mjs","say":["首頁、市場、資產、資金、紀錄與下單","Tabs 首頁, 市場, 資產, 資金, 紀錄 and the order ticket."],"shared":false},
  "se-led": {"layer":"phone","name":"lib/account.mjs (kit stock-account.mjs)","say":["帳戶是不可改動的事件記錄，現金與持股由重播得出","The account is an immutable log; cash and holdings come from replaying it."],"shared":false},
  "se-rules": {"layer":"phone","name":"kit stock-markets/credit/access/savings/bonds.mjs","say":["真實券商規則：手續費、稅、單位、融資融券、交易資格","Real broker rules: fees, taxes, lots, margin, eligibility."],"shared":false},
  "se-local": {"layer":"phone","name":"Cache Storage + localStorage; gzip saves (codec.mjs)","say":["報價與帳戶本機保存；離線不交易","Quotes and the account kept locally; never trades offline."],"shared":false},
  "se-data": {"layer":"pages","name":"public/data/listings-*.json, logos/, flags/","say":["精選清單與各市場掛牌清單","Curated lists and everything each market lists."],"shared":false},
  "se-fill": {"layer":"worker","name":"/stock (stock-fill.js, stock-check.js)","say":["以代理自己的報價成交；重播帳戶限制新增資金","Fills orders at the proxy's own quote; replays the account to cap new money."],"shared":false},
  "se-proxy": {"layer":"worker","name":"/sports-proxy as quote door (Yahoo tiers)","say":["報價、圖表、搜尋經共用資料代理","Prices, charts, search read through the shared data proxy."],"shared":false},
  "se-src-y": {"layer":"sources","name":"query1/query2.finance.yahoo.com","say":["報價、5 分K、圖表、股利、分割、搜尋","Quotes, 5-min bars, charts, dividends, splits, search."],"shared":false},
  "se-src-tw": {"layer":"sources","name":"twse.com.tw, mis.twse.com.tw, openapi.taifex.com.tw, SITCA, cnyes funds","say":["新股申購、權證、期貨結算價、基金淨值","New-issue list, warrants, futures settlements, fund NAVs."],"shared":false},
  "mo-app": {"layer":"phone","name":"app.mjs, views/, shell.mjs","say":["月曆、帳戶、統計、發票；＋隨處新增記帳","Tabs 月曆, 帳戶, 統計, 發票; + adds an entry anywhere."],"shared":false},
  "mo-books": {"layer":"phone","name":"lib/books.mjs (pure, tested)","say":["帳戶、記帳、預算、固定收支；逐筆合併","Accounts, entries, budgets, repeats; merges record by record."],"shared":false},
  "mo-inv": {"layer":"phone","name":"lib/invoice.mjs, views/scan.mjs, kit carrier-csv.mjs","say":["讀發票 QR、載具 CSV、對獎","Reads invoice QR codes, 載具 CSV, checks the draw."],"shared":false},
  "mo-local": {"layer":"phone","name":"localStorage (device copy of the books)","say":["帳本存手機並同步到通行證","Books kept on the phone and synced to the Pass."],"shared":false},
  "mo-inv-w": {"layer":"worker","name":"https://invoice.orbit/win.json, seller.json (invoice.js, via /sports-proxy)","say":["最新開獎號碼與統編對應店名","Latest draws and company names behind 統編."],"shared":false},
  "mo-mail": {"layer":"worker","name":"/money-mail + email handler (money-mail.js)","say":["載具 CSV 寄到通行證專屬信箱，逐個通行證收件","Mail-in 載具 CSV to the Pass's own address; box per Pass."],"shared":false},
  "mo-src-etax": {"layer":"sources","name":"invoice.etax.nat.gov.tw/invoice.xml","say":["財政部最近六期中獎號碼","財政部 winning numbers (last 6 draws)."],"shared":false},
  "mo-src-gcis": {"layer":"sources","name":"data.gcis.nat.gov.tw","say":["經濟部商業司公司登記","經濟部 company register for seller names."],"shared":false},
  "mo-src-mail": {"layer":"sources","name":"Email Routing catch-all on MAIL_DOMAIN","say":["接收轉寄的電子發票平台 CSV","Receives forwarded 電子發票平台 CSV mails."],"shared":false}
};

// Moves every app shares, shown on whichever of their parts an app uses.
export const SHARED_MOVES = [
  {"at":"job-guard","title":["雲端帳單硬性煞車","Hard stop on the cloud bill"],"problem":["忙碌的月份可能讓 Cloudflare 費用超出 5 美元方案。","A busy month could push the Cloudflare bill past the $5 plan."],"built":["quota-guard 每 5 分鐘讀用量、推算整月，60% 起降速(pace.js)，90% 讓代理下線。","quota-guard reads usage every 5 minutes, projects the month, paces from 60% (pace.js) and takes the proxy off at 90%."],"result":["費用不會失控，系統先放慢再停止。","The family cannot run up a bill; apps slow down first, then stop."],"numbers":"check every 5 min; slow from 60%; stop at 90%; notices at 50/75/90%"},
  {"at":"kit-sw","title":["以內容命名檔案","Files addressed by their content"],"problem":["每次更新都要重載整個 App 與共用包，CDN 還可能用舊檔回應新網址。","Every push made phones re-download the whole app and kit, and a CDN could serve an old file under a new address."],"built":["每個檔案壓縮並用自己的雜湊命名(?v=<hash>)；service worker 只保存內容吻合的檔案。","Each script and stylesheet is minified and given its own hash (?v=<hash>); the service worker keeps a file only if it matches its address."],"result":["手機只下載有變的檔案，也不會留下不吻合的舊檔。","A phone downloads only the files that changed, and never keeps a mismatched file."],"numbers":"12-hex content hash per file (kit/hash.mjs)"},
  {"at":"st-d1","title":["可還原的存檔","Saves that can be rolled back"],"problem":["錯誤或過期的存檔可能蓋掉資料。","A bad or stale save could overwrite someone's data."],"built":["Worker 以版本檢查合併，拒絕把 JSON 變成別的格式，並在 D1 保留被取代的版本，每晚備份到 R2。","The Worker merges under a version check, refuses saves that change JSON into something else, keeps replaced versions in D1 history, and copies the store to R2 every night."],"result":["任何版本都能還原，不會悄悄遺失。","Any version can be restored; nothing is lost silently."],"numbers":"history whole 2 days then daily 30; nightly R2 backup 04:30 (14 nights + a year of firsts); D1 Time Travel 30 days"},
  {"at":"job-build","title":["重資料預先排程建好","Heavy data built ahead on a cron"],"problem":["手機若每次都向上游抓大量資料會很慢。","Phones would otherwise fetch and parse huge upstream pages every time."],"built":["builders/run.js 讓各建置器依資料變動頻率執行，內容有變才寫檔。","builders/run.js runs each builder only as often as its data changes and writes a file only when it changed (builders/store.js)."],"result":["手機只讀 R2 上一個小檔案。","Phones read one small prebuilt file from R2."],"numbers":"sports daily 16:00 UTC, watch hourly, winprob daily 23:00, buses weekly"},
  {"at":"w-gate","title":["請求大小上限","Request size limits"],"problem":["超大的 POST 可能讓執行環境當掉。","A huge POST could crash an isolate."],"built":["各路徑只讀取到規定大小的請求內容。","Request bodies are read only up to a per-route size."],"result":["過大的請求被拒絕而非造成當機。","An oversized post is refused, not crashed on."],"numbers":"8 MB a save, 19 MB a photo import, 2 MB a ticket scan, 1 MB an order or notice list"},
  {"at":"job-cron","title":["兩個排程涵蓋每一分鐘","Two crons cover every minute"],"problem":["新註冊的排程曾經登記卻從未執行。","Newly registered cron triggers were registered and never ran (2026-10-13)."],"built":["只用既有兩個排程，新工作加進去而不新增觸發器。","Two existing crons (*/2 and 1-59/2) are used; new work is added to them, not to new triggers."],"result":["F1 圈速每分鐘執行，其餘在偶數分鐘。","F1 laps run every minute, everything else on even minutes."],"numbers":"*/2 + 1-59/2"}
];

export const SYSTEMS = {
  sports: {
    parts: ["sp-app","sp-calc","sp-f1","phone-cache","kit-sw","pages-app","pages-kit","w-gate","sp-proxy","w-data","w-push","st-edge","st-r2","st-kv","st-do","job-cron","job-build","sp-src-espn","sp-src-f1","sp-src-asia","sp-src-tv","phone-pwa","kit-orbit"],
    flows: [
      ["phone-pwa","pages-app",["載入 App 檔案","GET index.html / app files"]],
      ["pages-app","kit-sw",["service worker 依雜湊保存檔案","service worker keeps files by ?v= hash"]],
      ["kit-orbit","pages-kit",["匯入共用工具包","import map #kit/…"]],
      ["sp-app","phone-cache",["先讀本機副本","memory → Cache Storage → fx.day.v4"]],
      ["sp-app","w-gate",["批次讀取（帶通行證）","GET /sports-proxy?batch=1&u=…&qt="]],
      ["sp-app","w-gate",["一次取得一天賽事","GET /sports-today?day=YYYY-MM-DD"]],
      ["sp-app","w-gate",["讀賽季資料包","GET /data/sports/<league>/<year>.json"]],
      ["w-gate","sp-proxy",["分派到 sports.js","route /sports-proxy"]],
      ["w-gate","w-data",["分派到 data.js","route /data"]],
      ["sp-proxy","st-edge",["邊緣快取分級","edge tiers: live 2-10 s, final 24 h, standings 30 min"]],
      ["w-data","st-r2",["讀取 R2 檔案","read R2 object"]],
      ["sp-proxy","st-r2",["已結束的賽事首次讀取即永久保存","keeps finished games/days on first read (mirror/)"]],
      ["sp-proxy","sp-src-espn",["快取未命中才向上游取","fetch on cache miss"]],
      ["sp-proxy","sp-src-f1",["F1 即時資料","f1-live.orbit: now / session / laps / circuit"]],
      ["sp-proxy","sp-src-asia",["亞洲棒球","asia-baseball.orbit"]],
      ["sp-proxy","sp-src-tv",["精簡後轉送","trims: elta, youtube, fotmob, rotowire"]],
      ["sp-proxy","st-do",["賽事週末每分鐘記錄圈速","F1 laps logged each minute of a race weekend"]],
      ["job-cron","job-build",["偶數分鐘排程跑建置","even-minute cron runs builders"]],
      ["job-build","st-r2",["每日/每小時建置寫入 R2","sports daily 16:00, watch hourly, winprob daily 23:00"]],
      ["job-build","sp-proxy",["建置透過代理讀取上游","builders read upstream through the proxy"]],
      ["w-push","st-kv",["通知名單存 KV","push:<account>:<app> subscription + notice list"]],
      ["job-cron","w-push",["每 2 分鐘檢查比賽是否結束並推送","every 2 min: send due, check ESPN final"]],
      ["sp-app","sp-calc",["把剛結束的比賽加進排名","live games + stale table → counted table"]],
      ["sp-app","sp-f1",["F1 資料畫成看板","F1 timing → board"]]
    ],
    moves: [
      {"at":"sp-calc","title":["搶在 ESPN 前算出排名","Standings counted ahead of ESPN"],"problem":["ESPN 的排名在比賽結束後會延遲數分鐘到數小時。","ESPN's table lags finals by minutes to hours."],"built":["liveTable 把官方表還沒算的已結束比賽各加一次，進行中的不算。","liveTable adds finished games the table has not counted, once each, never a game still on."],"result":["終場哨響時排名、奪冠條件與季後賽就是對的。","Tables, title lines and playoffs are right at the final whistle."],"numbers":"one rule for every sport; marked as not settled"},
      {"at":"sp-proxy","title":["裁掉手機用不到的內容","Trim what the phone never reads"],"problem":["上游頁面遠大於畫面所需。","Upstream pages are huge for what a screen shows."],"built":["代理支援 &trim=，只保留 App 讀取的欄位。","The proxy takes &trim= (espn-injuries etc.), keeping only the fields an app reads."],"result":["下載更小、解析更快。","Smaller downloads and faster parsing."],"numbers":"MLB injury list 3.08 MB → 0.14 MB; ESPN year pages 19-26 MB avoided via R2 packs"},
      {"at":"sp-app","title":["進行中只讀正在進行的","Live ticks read only what is live"],"problem":["每 5 秒都重讀整天的頁面。","Every 5 s beat re-read all day pages."],"built":["即時更新只讀正在進行的比賽所在頁面，整天仍每 2 分鐘一次。","A live tick reads only the day pages of games on now, the whole day still every 2 min."],"result":["比賽進行時請求大幅減少。","Far fewer requests while a game is on."],"numbers":"home 168 → 24 reads/min (3.1 MB → 0.28 MB); 轉播 312 → 24"},
      {"at":"st-r2","title":["結束的比賽讀一次就永久保存","Finished games kept after the first read"],"problem":["舊比賽會一再向 ESPN 重讀。","Old games would be fetched from ESPN again and again."],"built":["已確定結束的內容在第一次被讀取時寫入 R2，之後由 R2 回應。","What is over for good is written to R2 the first time anyone reads it and served from there."],"result":["上游只需問一次。","The source is asked once, ever."],"numbers":"game, day or month all over; F1 session 數據 and laps; Jolpica race results after 3 days"},
      {"at":"st-do","title":["比賽進行時記錄 F1 圈速","F1 laps logged while the race runs"],"problem":["F1 官方歸檔在比賽結束後才有圈速，OpenF1 比賽期間會關閉。","F1's archive has laps only after the flag, and OpenF1 shuts while sessions run."],"built":["F1Log Durable Object 在賽事週末每分鐘記錄圈速，f1kept 把完賽資料永久存進 R2。","The F1Log Durable Object logs laps each minute on race weekends; f1kept builds the finished session into R2 for good."],"result":["看板與圈速圖在比賽中與賽後都能用。","The board and lap charts work live and after."],"numbers":"OpenF1 tables 3.5 MB read one table at a time; f1kept :06 :26 :46"},
      {"at":"sp-app","title":["開啟更快","Opens faster"],"problem":["重新開啟 Sports 很慢。","Reopening Sports was slow."],"built":["轉播表先用上次副本再背景更新；首屏模組隨頁面預載；代理把沒比賽的比分板保留到下一場前。","TV lists open on the last copy and refresh behind; first-screen kit modules are preloaded with the page; the proxy keeps a quiet scoreboard until just before its next game."],"result":["重開更快。","Faster reopen."],"numbers":"reopen 2.8 s → 1.6 s; later 2.5 s → 1.0 s in WebKit; batch of 24 league days 2.3 s → 0.43 s"}
    ]
  },
  transit: {
    parts: ["tr-app","tr-plan","tr-nav","tr-local","kit-sw","pages-app","pages-kit","w-gate","tr-w","w-data","w-eco","w-push","st-edge","st-kv","st-r2","st-d1","job-cron","job-build","tr-bike","tr-src-tdx","tr-src-g","tr-src-osm","phone-cache"],
    flows: [
      ["tr-app","phone-cache",["先讀本機行程","reads local trips first"]],
      ["pages-app","kit-sw",["依雜湊保存檔案","files kept by hash"]],
      ["tr-app","w-gate",["讀 TDX 資料","GET /transit/tdx?p=<TDX path>"]],
      ["tr-app","w-gate",["規劃路線","GET /transit/route?from=&to="]],
      ["tr-app","w-gate",["搜尋、地點、步行、行駛中公車","GET /transit/search, /place, /walk, /running"]],
      ["tr-app","w-gate",["讀公車資料包","GET /data/bus/…, shape/…, where.json"]],
      ["w-gate","tr-w",["分派到 transit.js","route /transit"]],
      ["tr-w","st-edge",["TDX 快取分級","TDX_RULES: live 25 s, timetable 6 h, static 1 day"]],
      ["tr-w","st-kv",["TDX 憑證、Google 月用量","TDX token, monthly Google meter, warm list"]],
      ["tr-w","tr-src-tdx",["未命中才取（每秒 4 次）","fetch on cache miss (4/s, 240/min)"]],
      ["tr-w","tr-src-g",["受月上限控管","Places, Routes, map under monthly cap"]],
      ["tr-w","tr-src-osm",["超額改用免費來源","past the cap: OSM search/walks, NLSC map"]],
      ["job-cron","tr-bike",["每個偶數分鐘","every even minute"]],
      ["tr-bike","tr-src-tdx",["更新 YouBike 車位","Bike Availability refresh"]],
      ["job-build","st-r2",["每城市每週建公車資料包","buses.js: bus/…, shape/…, where.json weekly per city"]],
      ["job-build","tr-w",["透過代理取 TDX 時刻與路線形狀","reads TDX schedules/shapes through /transit/tdx"]],
      ["tr-app","tr-plan",["合併 Google 與 TDX 方案並排序","Google + TDX plans → ranked ways"]],
      ["tr-plan","tr-nav",["選定行程進入導航","chosen trip → navigation"]],
      ["tr-app","w-eco",["通行證存檔 t1:","Pass payload t1: (places, trips, pins)"]],
      ["w-eco","st-d1",["帶版本存檔","versioned save"]],
      ["tr-app","w-push",["排定到站提醒","schedule 到站提醒 (check {bus})"]],
      ["job-cron","w-push",["每 2 分鐘檢查公車是否快到站","every 2 min: asks TDX estimate at the stop"]],
      ["w-push","tr-src-tdx",["查該站預估到站時間","bus estimate at the stop"]]
    ],
    moves: [
      {"at":"st-edge","title":["依資料有效時間快取","Cache by how long data stays true"],"problem":["TDX 有速率限制，每支手機都問太浪費。","TDX is rate-limited and billed; every phone asking is wasteful."],"built":["TDX_RULES 為每條白名單路徑設定新鮮與過期時間，過期先回應並於背景更新。","TDX_RULES gives each allowed path a fresh and stale time by tier (live, timetable, static); stale is served at once and refreshed behind."],"result":["多支手機共用一次 TDX 呼叫。","Many phones share one TDX call."],"numbers":"live 25 s, bikes 50 s, timetables 6 h, static 1 day, stale up to 7 days; TDX 4 calls/s"},
      {"at":"job-build","title":["每週公車資料包","Weekly bus packs"],"problem":["路線與站牌資料量大又少變動。","Route and stop lists are large and rarely change."],"built":["builders/buses.js 每城市每週建包，沒變的包不重寫。","builders/buses.js builds bus, shape and where.json packs per city once a week and skips writing a pack that did not change."],"result":["手機用資料包在本機算附近站牌。","Phones compute nearby stops locally from packs."],"numbers":"once a week per city"},
      {"at":"tr-plan","title":["分開詢問 Google 與 TDX 規劃","Google and TDX planners asked apart"],"problem":["TDX 長程規劃要花數秒。","TDX's planner takes seconds on long trips."],"built":["先顯示 Google 與自家鐵路路由的方案，TDX 的到了再加入。","The first plans show with Google's and our own train router; TDX's join when in, else in a second round."],"result":["第一批方案幾乎立即出現。","The first plans appear almost at once."],"numbers":"Google ~0.1 s; TDX seconds on long trips"},
      {"at":"tr-w","title":["以格點重用步行結果","Walk results reused by grid spot"],"problem":["從精確 GPS 位置查步行路線無法重用，飄移還會耗掉 Google 額度。","Walks asked from the exact GPS fix were never found again and drift spent Google's cap."],"built":["改從約 40 公尺的格點查詢，每移動 50 公尺才重取。","Walks are asked from a ~40 m grid spot re-taken every 50 m, so the Worker's month-long walks are found again."],"result":["Google 呼叫變少。","Fewer Google calls."],"numbers":"40 m grid, 50 m re-take (was 20 m from the exact fix); walk cache month-long"},
      {"at":"tr-bike","title":["YouBike 預熱","YouBike kept warm"],"problem":["即時查 YouBike 車位很慢。","Bike availability is slow to fetch on demand."],"built":["warmBikes 在排程中更新近 30 分鐘有人查詢的城市。","warmBikes refreshes every city asked in the last 30 minutes on the cron."],"result":["手機一問就是新資料。","Bike counts are already fresh when a phone asks."],"numbers":"every 2 min; cities asked in the last 30 min"},
      {"at":"tr-app","title":["鎖定時的到站提醒","到站提醒 while the phone is locked"],"problem":["App 關閉就無法盯著公車。","A closed app cannot watch a bus."],"built":["App 把公車檢查交給 Worker，排程每次詢問 TDX 預估。","The app hands the Worker a bus check; the cron asks TDX's estimate every run."],"result":["App 關閉也能收到通知。","Notice arrives with the app closed."],"numbers":"check every 2 min"}
    ]
  },
  weather: {
    parts: ["we-app","we-plan","phone-cache","kit-sw","pages-app","pages-kit","w-gate","we-w","we-ty","w-eco","w-push","st-kv","st-edge","st-d1","job-cron","job-gemini","we-skill","we-src-g","we-src-cwa","we-src-moenv","we-src-ty","we-src-nlsc"],
    flows: [
      ["we-app","phone-cache",["先顯示上次預報","last forecast per cell kept"]],
      ["pages-app","kit-sw",["依雜湊保存檔案","files kept by hash"]],
      ["we-app","w-gate",["取預報","GET /weather?lat=&lon= (0.01° cell)"]],
      ["we-app","w-gate",["查所在鄉鎮","GET /weather/where?lat=&lon="]],
      ["w-gate","we-w",["分派到 weather.js","route /weather"]],
      ["we-w","st-kv",["格點預報存 KV 15 分鐘","weather:cell:<lat>,<lon> 15 min; stale ≤3 h served + refresh"]],
      ["we-w","st-kv",["Google 結果以 5 公里方格共用","weather:g:<5 km square> Google copy shared by cells"]],
      ["we-w","st-edge",["地名 30 天、地點清單 1 天","/where 30 days; /places 1 day"]],
      ["we-w","we-src-g",["每日上限內呼叫","≤ 450 calls/day, current-only between forecasts"]],
      ["we-w","we-src-cwa",["只查最近測站","nearest stations only (weather-stations.js table)"]],
      ["we-w","we-src-moenv",["最近空品站","nearest air site"]],
      ["we-w","we-src-nlsc",["查鄉鎮","point query for township"]],
      ["we-w","we-ty",["僅在有颱風警報時","only when CWA has a typhoon warning"]],
      ["we-ty","we-src-ty",["警報 5 分鐘、縣市結果 3 分鐘","NCDR CAP every 5 min; county answer every 3 min"]],
      ["we-ty","job-gemini",["經台灣中繼讀人事行政總處頁面","DGPA page read via Taiwan relay"]],
      ["job-cron","we-skill",["每小時 :10（未降速時）","min :10 each hour (when not paced)"]],
      ["we-skill","st-kv",["評分與權重存 KV","weather:skill:<cell> 14 days → weather:weights"]],
      ["we-skill","we-src-cwa",["雨量與測站實測","rain gauge + station truth"]],
      ["we-app","we-plan",["地點釘選與預報合成行程","pins + forecasts → 我的行程"]],
      ["we-app","w-eco",["通行證存檔 w1:（釘選地點）","Pass payload w1: (pins) via pass-sync.mjs"]],
      ["w-eco","st-d1",["帶版本存檔","versioned save"]],
      ["w-push","we-w",["晨間簡報與降雨通知檢查","check {weather} brief / rain (weatherCheck)"]],
      ["job-cron","w-push",["每 2 分鐘送出到期通知","every 2 min send due"]]
    ],
    moves: [
      {"at":"st-kv","title":["共用 Google 方格","Shared Google squares"],"problem":["每日 450 次 Google 額度中午就用完。","The 450-a-day Google cap ran out by noon."],"built":["Google 結果依 0.05°（約 5 公里）方格保存，方格內各格點共用；額外呼叫依台灣時段分配。","Google's answers are kept per 0.05° (~5 km) square and shared by every ~1 km cell in it; extras are paced through Taiwan's day."],"result":["額度可撐一整天。","The cap lasts the whole day."],"numbers":"GOOGLE_GRID 0.05°; GOOGLE_DAILY_CALLS 450; 4 calls a refresh, 1 while under 30 min old, 8 more every 6 h"},
      {"at":"we-skill","title":["學習該信任哪個來源","Learning which source to trust"],"problem":["各來源會互相矛盾，也沒有永遠準的。","Sources disagree and none is always right."],"built":["weather-skill.js 用雨量計與測站實測為每小時預報評分，每日調整權重。","weather-skill.js scores each hour's forecast against rain-gauge and station readings and moves blend weights daily."],"result":["混合結果偏向較準的來源，使用者看不到過程。","The blend leans on the better source, unseen by the user."],"numbers":"weights ∝ 1/(score+ε); floor 0.15; step ≤ 0.1/day; starts after 3 days; scores kept 14 days"},
      {"at":"we-w","title":["不在請求中解析全國大檔","Never parse the big national lists"],"problem":["中央氣象署全國清單（約 1 MB）對單次請求太重。","CWA's national lists (~1 MB each) were too heavy for a request."],"built":["測站表事先放進程式碼，只查最近的測站。","The station table is committed (weather-stations.js) and only the nearest stations are asked."],"result":["單次請求只需毫秒。","A request uses milliseconds, not seconds."],"numbers":"~1 MB per list avoided"},
      {"at":"we-ty","title":["颱風停班停課機率","Typhoon day-off chance fitted to history"],"problem":["大家想在公告前知道是否停班停課。","People want to know if the day is off before it is announced."],"built":["typhoon.js 依暴風圈、風雨與鄰縣決定估算機率，公告後改用官方結果。","typhoon.js fits a chance from the storm circle, wind, rain and neighbours' decisions, and switches to the official word once listed."],"result":["每縣市一個答案，境內各地共用。","One answer per county, shared by every place in it."],"numbers":"68 storms 2019-2026; 22 counties every 3 min; NCDR feed every 5 min"},
      {"at":"we-app","title":["先顯示上次預報","Opens on the kept forecast"],"problem":["等待登入與 GPS 讓第一個畫面很慢。","Waiting for sign-in and GPS delayed the first picture."],"built":["載入畫面直接用上次預報結束；先用快速定位，GPS 在背景補強。","The loading screen ends on the last kept forecast; a quick Wi-Fi/cell fix asks first, GPS refines behind it."],"result":["預報立刻顯示。","Forecast shown immediately."],"numbers":"loading screen gone at 93 ms (was 1,626 ms); reopen 0.84 s → 0.55 s; GPS alone held it 8-14 s"}
    ]
  },
  class: {
    parts: ["cl-app","cl-calc","cl-ai","cl-local","kit-sw","cl-pages","pages-kit","w-gate","cl-gem","w-eco","w-push","st-d1","st-kv","job-cron","job-gemini","cl-src"],
    flows: [
      ["cl-app","cl-local",["讀取本機課表","reads kept timetable"]],
      ["cl-pages","kit-sw",["離線保存檔案","files kept offline"]],
      ["cl-app","cl-calc",["時間 → 目前節次與下一節","clock → current period / next"]],
      ["cl-ai","w-gate",["送出照片或指令","POST /gemini (≤ 6 files) / POST /nl-edit"]],
      ["w-gate","cl-gem",["分派","route /gemini, /nl-edit"]],
      ["cl-gem","job-gemini",["經台灣中繼","service binding GEMINI_RELAY"]],
      ["job-gemini","cl-src",["由台灣呼叫 Gemini","generateContent from Taiwan (Gemini refuses Hong Kong)"]],
      ["cl-gem","st-kv",["每日用量計數","daily Gemini limits counted"]],
      ["cl-app","w-eco",["課表存通行證；分享金鑰","Pass payload app orbit (v2 string); share keys 8 chars/24 h"]],
      ["w-eco","st-d1",["帶版本存檔；過期寫入被擱置而非遺失","versioned save; a stale write is set aside, not lost"]],
      ["cl-app","w-push",["排定上課前 5 分鐘通知","schedulePush: notice 5 min before each class"]],
      ["w-push","st-kv",["通知名單存 KV","push:<account>:orbit"]],
      ["job-cron","w-push",["每 2 分鐘送出到期通知","every 2 min send due"]]
    ],
    moves: [
      {"at":"cl-gem","title":["AI 提示詞放伺服器","AI prompts live on the server"],"problem":["公開端點可能被當成通用 AI 使用。","A public endpoint could be used as a general AI."],"built":["Worker 保存固定提示詞、格式與可用模型清單，前端只送檔案或指令。","The Worker holds fixed prompts, schemas and an allowed model list; the client sends only files or an instruction."],"result":["只能做課表相關工作，結果須驗證並以差異呈現。","Only timetable work is possible; result is checked and shown as a diff."],"numbers":"models gemini-3.7-flash, gemini-3.5-flash-lite; up to 6 photos"},
      {"at":"job-gemini","title":["經台灣中繼呼叫 Gemini","Gemini through a Taiwan relay"],"problem":["Gemini 拒絕來自香港的請求。","Gemini refuses Hong Kong, where some callers land."],"built":["固定在台灣的小型 Worker 代為呼叫，代理本身不必固定區域。","A tiny Worker pinned to gcp:asia-east1 makes the call, so the proxy itself needs no pinning (Yahoo refused the pinned proxy)."],"result":["Gemini 與 Yahoo 都能正常使用。","Both Gemini and Yahoo work."],"numbers":"Yahoo refused 11 of 16 reads from the pinned placement vs 0 of 8 without (2026-10-14)"},
      {"at":"cl-app","title":["一切由時鐘推算","Everything from the clock"],"problem":["儲存「目前課程」會過期。","Stored 'current class' state goes stale."],"built":["每秒由時間重算全部狀態，只更新有變的欄位。","Each second the whole state is recomputed from the time; only changed fields are written to the page."],"result":["永遠正確且畫面更新成本低。","Always correct, cheap to draw."],"numbers":"every second"}
    ]
  },
  words: {
    parts: ["wo-app","wo-mem","wo-sync","wo-local","kit-sw","wo-pages","pages-app","pages-kit","w-gate","w-eco","st-d1","w-push","st-kv","job-cron","wo-src"],
    flows: [
      ["wo-app","wo-local",["每次變更即存檔","progress saved on every change"]],
      ["pages-app","wo-pages",["字表、提示、錄音","words.json, hints.json, audio/*"]],
      ["wo-pages","kit-sw",["service worker 保存音檔與字表","audio and list kept by sw.js (prune off for audio)"]],
      ["wo-app","wo-mem",["作答 → 穩定度與到期日","answers → stability, difficulty, due"]],
      ["wo-app","wo-sync",["逐字合併，新者為準","merge newest-wins per row"]],
      ["wo-sync","w-gate",["通行證存檔","Pass payload vocab-progress-sync (z3: + gzip)"]],
      ["w-gate","w-eco",["分派","route /eco"]],
      ["w-eco","st-d1",["帶版本存檔與歷史","versioned save + history"]],
      ["wo-app","w-push",["連續天數通知","20:00 streak notice via schedulePush"]],
      ["w-push","st-kv",["通知名單","push:<account>:vocab"]],
      ["job-cron","w-push",["每 2 分鐘送出到期通知","every 2 min send due"]],
      ["wo-src","wo-pages",["錄音檔隨站發布","committed as audio files"]]
    ],
    moves: [
      {"at":"wo-sync","title":["合併而非覆蓋","Merge, never overwrite"],"problem":["兩台裝置可能互相覆蓋進度。","Two devices could overwrite each other's progress."],"built":["寫入前先與通行證副本逐字合併；讀不到的副本絕不覆蓋。","Progress is merged per word with the Pass copy before any write; an unreadable copy is never written over."],"result":["進度在多裝置與離線下都不遺失。","Progress survives phones and offline use."],"numbers":"return merge skipped under 10 s away"},
      {"at":"wo-mem","title":["記憶模型","Memory model"],"problem":["固定複習時程浪費時間。","Fixed review schedules waste time."],"built":["FSRS-5 為每個字追蹤穩定度與難度，誘答選項取最可能混淆的字。","FSRS-5 tracks stability and difficulty per word; wrong options are the likeliest mix-ups."],"result":["複習時間貼合個人。","Review is timed to each person."],"numbers":"6,169 words; 10 days' stability = mastered"},
      {"at":"wo-pages","title":["事先錄音再當靜態檔","Recorded once, served as files"],"problem":["即時語音需要網路。","Live speech needs a network and a voice."],"built":["每字事先錄音，sw.js 保存字表與音檔。","Every word has a recording made offline; sw.js keeps list and audio."],"result":["可完全離線使用。","Everything works offline."],"numbers":"1 recording per word"}
    ]
  },
  beats: {
    parts: ["be-app","be-eng","be-wk","be-tape","be-idb","kit-sw","pages-app","be-samples","pages-kit","w-gate","w-eco","st-d1"],
    flows: [
      ["be-app","be-eng",["情境與種子 → 歌曲","mood + seed → song"]],
      ["be-eng","be-wk",["交給背景 Worker 製作","maker(url, {prep}) in a Worker"]],
      ["be-app","be-samples",["只下載播放所需樣本","GET samples/mk/… only what a song plays"]],
      ["be-samples","kit-sw",["service worker 保存","files kept by sw.js"]],
      ["be-wk","be-tape",["音訊 → 連續流","rendered audio → stream"]],
      ["be-app","be-idb",["收藏歌曲","♡ keeps a song (AAC, else Opus)"]],
      ["be-app","w-gate",["通行證存檔（設定、套組）","Pass payload { v:1, settings, kits, taste }"]],
      ["w-gate","w-eco",["分派","route /eco"]],
      ["w-eco","st-d1",["帶版本存檔","versioned save"]]
    ],
    moves: [
      {"at":"be-wk","title":["在頁面之外作曲","Songs made off the page"],"problem":["作曲會讓畫面卡住。","Composing a song would freeze the page."],"built":["作曲在 Web Worker 中進行並預先做兩首；即興音墊另有 Worker。","Making runs in a Web Worker, two songs ahead; a separate worker builds the Jam pads."],"result":["畫面不卡頓。","The UI never stalls."],"numbers":"two songs ahead"},
      {"at":"be-tape","title":["連續音訊流","One endless stream"],"problem":["歌曲之間的空隙會中斷聽感。","Song-to-song gaps break the flow."],"built":["tape.mjs 把歌接成單一串流，不支援時退回逐檔播放。","tape.mjs joins songs on one Media Source or WebCodecs stream, falling back to files."],"result":["無縫播放並支援鎖定畫面控制。","Gapless playback, lock-screen controls."],"numbers":"FLAC/AAC/Opus in MP4"},
      {"at":"be-idb","title":["不上傳任何聲音","Nothing uploaded"],"problem":["音訊私密又龐大。","Audio is private and large."],"built":["收藏歌曲壓縮後存於 IndexedDB。","Kept songs are packed small (AAC, else Opus) in IndexedDB."],"result":["音樂不使用任何伺服器路徑。","No Worker route is used for music."],"numbers":"AAC else Opus"}
    ]
  },
  law: {
    parts: ["la-app","la-find","la-local","la-sw","la-pages","pages-kit","w-gate","w-eco","st-d1","st-kv","la-ask","la-page","job-gemini","la-ci","la-src-moj","la-src-ly","la-src-court","la-src-gem","st-edge"],
    flows: [
      ["la-ci","la-src-moj",["每日建置；失敗用上次快取","daily build-data.mjs; keeps last good zip in cache"]],
      ["la-ci","la-src-ly",["只抓有更新的法案；直播清單 90 秒","only bills whose date moved; live.json every 90 s"]],
      ["la-ci","la-src-court",["夜間抓裁判與各機關規則","rulings.yml nightly; build-cons, build-agency, build-local"]],
      ["la-ci","la-pages",["建置後部署","build scripts → public/data/ then deploy"]],
      ["la-pages","la-sw",["資料檔優先使用快取並於背景更新","data/* pageFirst route"]],
      ["la-app","la-find",["查詢與引用 → 連結","query / reference → link"]],
      ["la-app","la-local",["追蹤與書籤","follows, bookmarks, chats"]],
      ["la-app","la-src-ly",["開啟時直接讀對照表與會議","direct: 對照表 on open, /meets, /ivods"]],
      ["la-app","w-gate",["提問（通行證，每日 30–40 次）","POST /law-ask, /law-chat (Pass; 30-40/day)"]],
      ["la-app","w-gate",["讀政府網頁","GET /law-page?u=<gov page>"]],
      ["w-gate","la-ask",["分派","route /law-ask, /law-chat"]],
      ["w-gate","la-page",["分派","route /law-page"]],
      ["la-ask","la-pages",["讀取站上資料作為依據","reads ai/facts.json, ai/news.json, bills/items.json hourly"]],
      ["la-ask","st-kv",["回答依法規版本快取","answers kept by law version; bill 30 d, diff 180 d, chat 30 d"]],
      ["la-ask","st-d1",["每個通行證每日用量","daily Gemini counts per Pass (D1)"]],
      ["la-ask","job-gemini",["經台灣中繼","GEMINI_RELAY"]],
      ["job-gemini","la-src-gem",["呼叫 Gemini","generateContent"]],
      ["la-page","st-edge",["判決快取 30 天","Cloudflare cache: judgments 30 d, else 1 day"]],
      ["job-gemini","la-src-court",["僅限台灣連線的縣市法規頁","county rule pages that serve only Taiwan"]],
      ["la-page","la-src-court",["政府網頁，上限 2MB","gov.tw / edu.tw pages, 2 MB cap"]]
    ],
    moves: [
      {"at":"la-ci","title":["夜間裁判回填","Nightly rulings backfill"],"problem":["司法院只在夜間開放，且資料量龐大。","Judgments can only be read from 司法院 in its nightly window, and are huge."],"built":["rulings.yml 在台灣時間 00:05–06:00 讀取月檔存入快取，再要求部署並在還有月份時自動續跑。","rulings.yml reads monthly archives into a cache store from 00:05 to 06:00 Taiwan time, then asks Pages for a deploy and starts itself again while months remain."],"result":["各級法院三年判決可依條文查詢。","3 years of every court's judgments are searchable by article."],"numbers":"00:05-06:00 Taiwan; 3 years back; store never committed"},
      {"at":"la-ci","title":["部署時建置資料，不進 git","Data built at deploy, never committed"],"problem":["約 60 MB 法規資料會讓版本庫臃腫。","About 60 MB of law data would bloat the repository."],"built":["pages.yml 每日台灣時間 03:30 執行，以上次部署為基底建置；來源失敗時用上次的壓縮檔。","pages.yml runs daily at 03:30 Taiwan time, building each dataset on the last deploy's copy; the last good MOJ zip stands in when the source fails."],"result":["手機讀靜態檔，閱讀不耗伺服器。","Phones read static files; reading costs no server."],"numbers":"~60 MB public/data; daily 03:30; amendments kept 120 days in changes.json"},
      {"at":"la-find","title":["不靠伺服器的搜尋","Search without a server"],"problem":["全文檢索通常需要後端。","Full-text search usually needs a backend."],"built":["部署時建好靜態雙字元分桶，一組字詞一個小檔。","Static bigram buckets built at deploy; a word pair is one small file."],"result":["搜尋可離線進行。","Search works offline."],"numbers":"about 10 KB per word pair"},
      {"at":"la-pages","title":["縮小立委照片","Small headshots"],"problem":["ly.gov.tw 的 270 KB 照片太大。","270 KB JPEGs from ly.gov.tw were heavy."],"built":["build-photos.mjs 轉成依內容命名的 WebP。","build-photos.mjs mirrors them as WebPs named by content."],"result":["清單載入快。","Lists load fast."],"numbers":"270 KB → ~1.2 KB (96 px) / ~2.7 KB (192 px)"},
      {"at":"la-ask","title":["以自家資料為依據的 AI","AI answers grounded in our own files"],"problem":["AI 可能編造法條。","An AI can invent a law."],"built":["Worker 只提供站內找到的條文與數據，每點都要引用並驗證；回答依法規版本快取。","The Worker passes only the articles and figures found in Orbit Law's data, requires every point to cite, and checks the cites; answers are cached by law version."],"result":["每個論點都能點開真實條文。","Each point opens the real article."],"numbers":"14 articles at most per chat; 30 chats/day/Pass; law-ask 40 Gemini calls/day/Pass, 300 in all"},
      {"at":"la-ci","title":["90 秒直播清單","Live feed every 90 seconds"],"problem":["GitHub 排程常延遲或略過。","GitHub's schedule alone is late or skipped."],"built":["live.yml 在開會時段每 90 秒自行接力下一次。","live.yml starts the next run itself every 90 seconds in sitting hours."],"result":["會議顯示真實直播。","Meetings show real live streams."],"numbers":"every 90 s; live.json at least every 10 min"},
      {"at":"la-pages","title":["地方法規規模","Local rules at national scale"],"problem":["各縣市法規分散在不同網站。","City rules sit on many different sites."],"built":["build-local.mjs 讀取各縣市平台，並在部署間保留讀取進度。","build-local.mjs reads every city's platform, carrying list and read state between deploys."],"result":["搜尋涵蓋地方法規全文。","Search covers local rules with full text."],"numbers":"about 10,800 rules for the first six cities"}
    ]
  },
  securities: {
    parts: ["se-app","se-led","se-rules","se-local","kit-sw","pages-app","se-data","pages-kit","w-gate","se-fill","se-proxy","w-eco","w-push","st-edge","st-d1","st-kv","job-cron","se-src-y","se-src-tw"],
    flows: [
      ["se-app","se-local",["報價與帳戶本機保存","quotes + account kept locally"]],
      ["pages-app","se-data",["掛牌清單","listings-*.json"]],
      ["se-app","w-gate",["讀 Yahoo 報價（可見時 45 秒更新）","GET /sports-proxy?url=<yahoo>&app=stock (45 s while visible)"]],
      ["w-gate","se-proxy",["分派","route /sports-proxy"]],
      ["se-proxy","st-edge",["報價 30 秒、歷史 30 分鐘","quotes 30 s, history 30 min, search 1 day"]],
      ["se-proxy","se-src-y",["未命中才取","fetch on cache miss"]],
      ["se-proxy","se-src-tw",["期貨、基金、證交所清單","taifex.orbit, funds.orbit, TWSE lists"]],
      ["se-app","w-gate",["送出委託請代理判定成交","POST /stock {op:'fill', orders, plans}"]],
      ["w-gate","se-fill",["分派","route /stock"]],
      ["se-fill","se-proxy",["用最新報價與 5 分K判定","fresh quote + 5-min bars at the order's terms"]],
      ["se-fill","st-d1",["成交紀錄存 D1","stock-fills/<account> kept with terms and NT$ rate"]],
      ["se-app","se-led",["委託與成交重播成餘額","orders, fills, loans → replayed balances"]],
      ["se-app","w-eco",["通行證存檔與資產快照","Pass payload stock-study-accounts; snap.stock"]],
      ["w-eco","se-fill",["存檔時重播並驗證新增資金","stock-check.js replays account before money counts"]],
      ["w-eco","st-d1",["帶版本存檔","versioned save"]],
      ["se-app","w-push",["價格提醒、成交、融資通知","alert / fill / order / margin / income notices"]],
      ["job-cron","w-push",["每 2 分鐘檢查價格是否到價","every 2 min: Yahoo price check {yahoo, op, price}"]],
      ["w-push","se-src-y",["價格檢查","price check"]]
    ],
    moves: [
      {"at":"se-fill","title":["由代理判定成交","The proxy decides fills"],"problem":["手機端可能挑對自己有利的價格。","A phone could pick a flattering price."],"built":["stock-fill.js 固定委託條件與首次看到的時間，以最新報價與 5 分K成交；stock-check.js 重播帳戶，只承認自己發出的成交。","stock-fill.js fixes terms and first-seen time, then fills from fresh quotes and 5-minute bars; stock-check.js replays the account and counts only fills it issued."],"result":["任何手機都無法憑空增加資金。","No phone can add money."],"numbers":"5-minute bars; quote refresh 45 s visible"},
      {"at":"se-led","title":["規則與伺服器共用","Rules shared with the server"],"problem":["App 與 Worker 可能對費用和現金算法不一致。","App and Worker could disagree on fees and cash."],"built":["帳本與規則放在 kit/stock-*.mjs，兩邊共用。","The ledger and rules are kit/stock-*.mjs, imported by both."],"result":["每條規則只有一份。","One copy of every rule."],"numbers":""},
      {"at":"se-led","title":["資產曲線快 25 倍","Net worth chart 25× faster"],"problem":["資產頁有長時間運算。","The portfolio tab had a long task."],"built":["改用更有效率的算法。","The history is computed more efficiently."],"result":["手機不再卡頓。","No freeze on the phone."],"numbers":"425 events: 170 ms → 7 ms"},
      {"at":"se-proxy","title":["共用 Yahoo 報價","Yahoo quotes shared"],"problem":["每支手機都問 Yahoo 會慢且被擋。","Every phone asking Yahoo would be slow and blocked."],"built":["報價經資料代理分級快取。","Quotes go through the data proxy with tiers."],"result":["一次讀取可服務多支手機。","One read serves many phones."],"numbers":"quotes 30 s; history 30 min; search 1 day"}
    ]
  },
  money: {
    parts: ["mo-app","mo-books","mo-inv","mo-local","kit-sw","pages-app","pages-kit","w-gate","mo-inv-w","mo-mail","w-eco","st-d1","st-edge","job-cron","mo-src-etax","mo-src-gcis","mo-src-mail"],
    flows: [
      ["mo-app","mo-local",["帳本本機保存","books kept locally"]],
      ["mo-app","mo-books",["記帳 → 餘額與預算","entries → balances, budgets"]],
      ["mo-app","w-gate",["取最新開獎","GET /sports-proxy?url=https://invoice.orbit/win.json"]],
      ["w-gate","mo-inv-w",["由資料代理處理","invoice host handled in the data proxy"]],
      ["mo-inv-w","st-edge",["開獎結果快取","draws cached by tier"]],
      ["mo-inv-w","mo-src-etax",["未命中讀 RSS","RSS on miss"]],
      ["mo-inv-w","mo-src-gcis",["每次最多 20 個統編","≤ 20 統編 per ask"]],
      ["mo-app","mo-inv",["掃描/匯入 → 帳目","scan / import → invoice-<number> entries"]],
      ["mo-src-mail","mo-mail",["轉寄信件進入 email handler","forwarded CSV → email handler"]],
      ["mo-mail","st-d1",["信箱資料存 D1","orbit-money-mail/<pass>, box_<box>"]],
      ["mo-app","w-gate",["取信箱發票；確認已入帳","GET /money-mail?op=box; POST ?op=took (20/min)"]],
      ["w-gate","mo-mail",["分派","route /money-mail"]],
      ["mo-app","w-eco",["通行證存檔 m1:","Pass payload m1: + gzip (orbit-money, ≤ 1 MB)"]],
      ["w-eco","st-d1",["帶版本存檔與夜間備份","versioned save + history, nightly R2 backup"]]
    ],
    moves: [
      {"at":"mo-books","title":["逐筆合併","Merge record by record"],"problem":["兩台手機離線編輯會衝突。","Two phones editing offline conflict."],"built":["每筆有時間戳 u，新者為準，刪除以墓碑保留。","Every record has u; newest wins; removals are tombstones kept 120 days."],"result":["不遺失任何記帳。","No lost entries."],"numbers":"tombstones 120 days; books ≤ 1 MB on the Pass"},
      {"at":"mo-mail","title":["發票用電子郵件匯入","Invoices by email"],"problem":["個人拿不到財政部 AppID。","A person cannot get 財政部's AppID."],"built":["Email Routing catch-all 交給 Worker，讀取 CSV 並退回無人擁有的地址。","An Email Routing catch-all feeds the Worker, which reads the CSV for the box's Pass and turns away unknown addresses."],"result":["不需金鑰即可匯入載具發票。","Carrier invoices arrive without a key."],"numbers":"20 asks a minute"},
      {"at":"mo-inv-w","title":["政府頁面經代理讀取","Government pages through the proxy"],"problem":["這些網站沒有 CORS。","Those sites send no CORS headers."],"built":["invoice.js 提供 win.json 與 seller.json。","invoice.js serves win.json and seller.json from 財政部's RSS and 經濟部's register."],"result":["手機拿到乾淨的 JSON。","The phone gets clean JSON."],"numbers":"last six draws; ≤ 20 統編 an ask"},
      {"at":"w-eco","title":["錢包大小控管","Wallet size kept in check"],"problem":["錢包越來越大會越來越重。","A growing wallet would keep getting heavier."],"built":["超過 600 KB 時舊記錄每月合併成一筆，金額不變。","Past 600 KB old entries fold into one a month per app and kind, with sums unchanged."],"result":["存檔保持精簡。","Saves stay small."],"numbers":"600 KB fold; example 9,000 entries → under half; limit 900 KB → 1.8 MB"}
    ]
  }
};
