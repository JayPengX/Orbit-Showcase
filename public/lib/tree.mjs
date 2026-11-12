// The structure tree: the whole Orbit system in plain words. The top level
// is short (what you hold, the shared parts, the pass, the cloud helper,
// where data lives, why it's quick, staying under limits, shipping, who made
// it); the detail lives deeper. Each node is { id, icon, title, line, p, i,
// r, tech, links, kids } with [zh, en] texts (see tree-apps.mjs).
import { APP_BRANCHES } from './tree-apps.mjs';

const n = (id, icon, title, line, more = {}) => ({ id, icon, title, line, ...more });

const apps = n('apps', 'grid', ['十個 App', 'Ten apps'], ['你手上真正會用到的東西', 'What you actually hold'], {
  p: ['每天要用的東西散在一堆 App 和網站裡，很多還不是為台灣做的。', 'Everyday things are spread over many apps and sites, many not made for Taiwan.'],
  i: ['十個各回答一個問題的 App：看比賽、搭車、天氣、課表、記帳、新聞、單字、音樂、法律、投資；長得像同一家人。', 'Ten apps, each answering one question: games, trips, weather, classes, money, news, words, music, law, investing, all looking like one family.'],
  r: ['每個都是網頁，加到主畫面就像原生 App。', 'Each is a web page that works like a native app from the home screen.'],
  kids: APP_BRANCHES
});

const ai = n('ai', 'ai', ['Orbit AI', 'Orbit AI'], ['每個 App 都聽得懂你的話，但先讓程式做', 'Every app takes plain words, code first'], {
  p: ['很多 App 加 AI 只是多一個聊天框：答案是一大段字，還常常編造。', 'Many apps bolt on a chat box: answers in paragraphs, often made up.'],
  i: ['程式讀得懂、算得出來的就由程式做；AI 只拿到程式先整理好的一小份事實，寫一句話、挑出要畫哪幾張表。答案一定畫成圖：隊徽、大頭照、分類圖示、長條；等待時先畫出答案的形狀。凡是聰明的地方都標 Orbit AI 的記號。', 'What code can read or add up, code does; AI gets only a small digest of facts that code picked, writes one line and picks which tables to draw. Answers are always drawn: logos, faces, category tiles, bars; while waiting, the answer’s shape shimmers. Every smart thing carries the Orbit AI mark.'],
  r: ['十個 App 都能用說的，答案一眼看懂，數字都是 App 自己讀到的。', 'All ten apps take plain words, answers read at a glance, and every number is one the app itself read.'],
  kids: [
    n('ai-door', 'chat', ['一個 AI 門口', 'One AI door'], ['每個功能有固定的題目和上限', 'Each feature a fixed prompt and a cap'], {
      p: ['如果手機自己送題目給 AI，任何人都能拿我們的 AI 免費用，費用也可能失控。', 'If phones sent their own prompts, anyone could use our AI for free, and the bill could run away.'],
      i: ['手機只說要用哪個功能、送它需要的資料；題目放在雲端，每個答案的格式都被檢查，每個功能每天有上限；資料不夠時，會反問並給選項讓你點。', 'Phones only name a feature and send its inputs; the prompts stay in the cloud, every answer’s shape is checked, and each feature has a daily cap; when something is missing, it asks back with options to tap.'],
      r: ['不會有意外的帳單，每次呼叫花多少錢都在管理頁看得到。', 'No surprise bills, and every call’s cost shows on the admin page.'],
      tech: ['Orbit-Core ai.js、ai-features.js（固定題目、maxIn、上限、反問）；kit ai.mjs（aiCall、aiFlow、aiAnswer、aiAnswerWait、aiMark）；D1 gemini_call 每次呼叫一列；管理頁 AI 錢包。', 'Orbit-Core ai.js, ai-features.js (fixed prompts, maxIn, caps, asking back); kit ai.mjs (aiCall, aiFlow, aiAnswer, aiAnswerWait, aiMark); D1 gemini_call, a row a call; the admin AI wallet.'],
      links: ['cheap-caps']
    }),
    n('ai-ahead', 'history', ['先做好的 AI', 'AI made ahead'], ['大家都會看的，只做一次', 'What everyone reads, made once'], {
      p: ['每個人打開比賽回顧或法條解釋都叫一次 AI，又慢又浪費。', 'Calling AI each time someone opens a game recap or a law’s explanation is slow and wasteful.'],
      i: ['大家都看得到的東西先做好存起來：比賽的三句話、F1 的勝負關鍵、各方怎麼說、單字的例句和記憶法、常用法條的白話解釋、重大訊息的白話。', 'What everyone sees is made once and kept: a game’s three lines, an F1 race’s deciding moments, each side’s angle on a story, word examples and hooks, everyday law articles explained, filings in plain words.'],
      r: ['一打開就有，多一個人看也不多花一毛錢。', 'There the moment you open it, and one more reader costs nothing.'],
      tech: ['Orbit-Core builders/ai.js、recaps.js、f1story.js 寫到 R2；Law 的 data/ai/（多 3,500 條常用法條，用批次 API 一次做好）；filings.js。', 'Orbit-Core builders/ai.js, recaps.js, f1story.js write to R2; Law’s data/ai/ (3,500 more everyday articles, made in one batch); filings.js.']
    }),
    n('ai-backup', 'shield', ['一家忙，換另一家', 'One maker busy, another answers'], ['同等級、不同公司', 'Same class, another maker'], {
      p: ['11-10 免費的 Gemini 排隊超過 20 秒、常常答不出來，問法律三題只答一題。', 'On 11-10 free Gemini queued for over 20 seconds and often failed; Ask the law answered one question in three.'],
      i: ['改用付費的 AI，每個模型都有另一家公司同等級的備援；管理頁顯示是誰回答的。', 'Paid AI instead, each model backed by one of its class from another maker; the admin page shows which answered.'],
      r: ['一家出問題，答案還是會來。', 'When one maker has a bad day, the answer still comes.'],
      tech: ['Claude Sonnet ↔ GPT 同級、小模型 ↔ 小模型、Gemini Flash 只用在照片；ai-other.js 透過台灣的中繼站呼叫；預付額度，用完就停。', 'Claude Sonnet ↔ a GPT of its class, small ↔ small, Gemini Flash only for photos; ai-other.js calls through the Taiwan relay; prepaid credit with a hard stop.'],
      links: ['cloud-relay']
    }),
    n('ai-family', 'share', ['App 之間互相幫忙', 'Apps that help each other'], ['只在你的手機上', 'Only on your phone'], {
      p: ['每個 App 只知道自己：交通不知道會下雨，新聞不知道你持有哪些股票。', 'Each app knew only itself: Transit didn’t know it would rain, News didn’t know what you hold.'],
      i: ['手機上有一本家族筆記：天氣寫下哪裡會下雨，課表寫下接下來的課，股票寫下持有的名稱（不含金額），單字寫下正在背的字。於是交通下雨時改搭車、新聞先放你關心的、Pass 的「今天」一次看完；在 Pass 上「問 Orbit」，它會打開能回答的那個 App 並幫你問。', 'A family notebook on the phone: Weather notes where rain is due, Class the next classes, Securities the names held (never amounts), Words the words being learned. So Transit avoids rain, News leads with what you care about, the Pass’s Today sums up the day; Ask Orbit on the Pass opens the app that can answer and asks there.'],
      r: ['十個 App 像一個，而且這些都不會傳到雲端。', 'Ten apps that feel like one, with none of it sent to the cloud.'],
      tech: ['kit family.mjs（tell、heard）、today.mjs、ask-orbit.mjs（#ask=）。', 'kit family.mjs (tell, heard), today.mjs, ask-orbit.mjs (#ask=).']
    })
  ]
});

const kit = n('kit', 'backpack', ['共用零件', 'Shared parts'], ['像樂高：十個 App 用同一盒積木', 'Like LEGO: ten apps, one box of bricks'], {
  p: ['每個 App 各寫一份按鈕、視窗、日期選擇，改一個地方要改好幾次，而且長得都不一樣。', 'Each app had its own buttons, sheets and date pickers: a copy in every app to fix, and none alike.'],
  i: ['兩個以上 App 會用到的東西都放進同一個「零件盒」，每個 App 打開時直接從那裡拿，不複製。', 'Anything two apps use goes in one kit; every app loads it from there, never copies it.'],
  r: ['改一次，十個 App 同時變好，而且看起來是同一家。', 'Fix it once and ten apps improve together, looking like one family.'],
  tech: ['Orbit-Core/kit/，放在 Cloudflare 上（orbit.jaypengx.com/Orbit-Core/kit/）；每個 App 的網頁用 import map 指向 #kit/…；新功能用 kit.x?.() 呼叫，舊手機沒有也不會整個掛掉。', 'Orbit-Core/kit/ on Cloudflare (orbit.jaypengx.com/Orbit-Core/kit/); each app’s page maps #kit/… with an import map; new exports are called as kit.x?.() so an older kit on a phone never stops the app.'],
  kids: [
    n('kit-look', 'spark', ['Orbit 自己的外觀', 'Orbit’s own look'], ['九個 App 一起重新設計', 'All nine apps redesigned together'], {
      p: ['Jay 覺得介面看起來很普通；第一版的新設計又太像別人家的 App（整頁天空的天氣、兩隊顏色混在一起的卡片），他不要抄。', 'Jay found the screens plain and generic; the first redesign looked too much like other companies’ apps (a sky filling Weather, cards blending two clubs’ colours), and he didn’t want a copy.'],
      i: ['保留原本的深色頁面，卡片統一成石墨色；顏色只放在它代表的東西上（一支球隊、一條公車路線、一個花費分類），主色只用在「正在發生」和主要按鈕。一份樣式管所有字級、間距、圓角和動畫，九個 App 一起換。', 'Keep today’s dark page and make every card graphite; colour goes only on what it names (a team, a bus line, a spending category), and the app’s own colour only on what’s live and the main action. One stylesheet sets every type size, gap, corner and motion, and all nine apps changed together.'],
      r: ['Jay 把九個 App 新舊並排看過，按下「全部上線」。', 'Jay looked at all nine side by side with the old ones and pressed “Ship all nine”.'],
      tech: ['orbit.css 的 Orbit 外觀層（每個 App 的網頁 data-look="native"）、.q-band 顏色帶；規則寫在 Orbit-Core docs/DESIGN.md §11。', 'orbit.css’s Orbit look layer (each app’s page says data-look="native"), the .q-band colour row; the rules in Orbit-Core docs/DESIGN.md §11.']
    }),
    n('kit-help', 'book', ['每個 App 的說明', 'A guide in every app'], ['真的畫面，一頁一頁看', 'Real screens, one by one'], {
      p: ['第一次打開的人不知道每個分頁在做什麼，說明只有一段文字。', 'Someone opening an app for the first time didn’t know what each tab did, and the guide was a paragraph of text.'],
      i: ['每個 App 的說明都有一排 App 圖示可以切換，再一站一站介紹它的分頁和重要畫面，每一站配一張真的截圖（中英文、深色淺色各一張）。', 'Each app’s guide has a row of app marks to switch between, then a tour of its tabs and key screens, each stop with a real screenshot (Chinese and English, light and dark).'],
      r: ['畫面改了，截圖用同一個工具重拍，說明永遠跟 App 一樣。', 'When a screen changes, one tool retakes its pictures, so the guide always matches the app.'],
      tech: ['kit help.mjs 的 TOURS；tools/help-shots.mjs 用真資料拍，存成 WebP，每張用自己的內容雜湊載入。', 'kit help.mjs TOURS; tools/help-shots.mjs shoots on live data and saves WebP, each picture loaded by its own content hash.'],
      links: ['ship-tools']
    }),
    n('kit-steady', 'shield', ['畫面不會跳', 'Nothing jumps'], ['資料更新時，你看的地方不動', 'New data never moves what you read'], {
      p: ['比分或公車時間一更新，整頁就往上或往下跳，正在看的那一行不見了。', 'When a score or bus time refreshed, the page jumped and the line you were reading was gone.'],
      i: ['共用零件記住你正在看的那一行和手指下的按鈕，重畫時把它們留在原位；還沒讀到的部分先用一樣大小的灰色格子佔位。', 'The shared pieces remember the line you’re reading and the button under your finger and keep them in place through a redraw; a part still loading holds its space with grey blocks of the same size.'],
      r: ['一個工具像 iPhone 的 Safari 那樣捲動每一頁，有東西動了測試就不會過。', 'A tool scrolls every page the way an iPhone’s Safari does, and fails if anything moved.'],
      tech: ['kit hold-place.mjs、steady-pics.mjs（圖片重畫不閃）；tools/live-scroll.mjs。', 'kit hold-place.mjs, steady-pics.mjs (pictures never flash on a redraw); tools/live-scroll.mjs.'],
      links: ['ship-tests']
    }),
    n('kit-ui', 'list', ['介面零件', 'Interface pieces'], ['同一種日期選擇、同一種視窗', 'One date picker, one sheet'], {
      p: ['每個 App 的日期選擇都不一樣，Jay 用起來很混亂。', 'Every app picked days differently, which confused Jay.'],
      i: ['底部分頁列、從下往上滑的視窗、分段按鈕、清單、日期列（滑一下換一天）都做成共用零件。', 'The tab bar, sheets, segmented controls, lists and the swipeable day strip are shared pieces.'],
      r: ['學會一個 App，其他的都會用。', 'Learn one app and you know them all.'],
      tech: ['ui.mjs：sheet、segmented、dayBar/dayStrip/daySwipe、rowCard、tile、stats、toast；orbit.mjs：tabBar。', 'ui.mjs: sheet, segmented, dayBar/dayStrip/daySwipe, rowCard, tile, stats, toast; orbit.mjs: tabBar.']
    }),
    n('kit-screens', 'grid', ['每種螢幕都排好', 'Every screen laid out'], ['直的、橫的、平板、電腦', 'Upright, sideways, tablet, computer'], {
      p: ['原本只照手機直拿來做：手機一橫過來，或在平板、電腦上打開，就只是中間一條窄窄的手機畫面。', 'The apps were made for a phone held upright: turned sideways, or opened on a tablet or computer, they were a narrow phone column in the middle.'],
      i: ['共用零件先看螢幕多大：橫拿和電腦上，分頁列變成左邊一條細細的直欄；平板和電腦上，滑出來的視窗變成置中的卡片；頁面夠寬就排成兩到三欄，由左到右讀起來和手機的順序一樣。', 'The shared pieces read the screen first: sideways and on a computer the tab bar becomes a slim rail down the left; on a tablet or computer sheets become cards in the middle; a wide page becomes two or three columns, read in the phone’s order.'],
      r: ['每個 App 在手機、平板、電腦上，直的橫的都好用（Jay 2026-10-31 的要求）。', 'Every app works on a phone, tablet or computer, either way up (Jay’s ask, 2026-10-31).'],
      tech: ['orbit.mjs 的 screenFit()／onScreen()；html 上的 q-tabrail（直欄 60 寬）、q-float、q-wide、q-w3；Orbit-Core docs/DESIGN.md §10。', 'orbit.mjs screenFit()/onScreen(); the html marks q-tabrail (a 60-wide rail), q-float, q-wide, q-w3; Orbit-Core docs/DESIGN.md §10.']
    }),
    n('kit-brand', 'star', ['品牌：從程式畫出來的圖示', 'Brand: icons drawn by code'], ['每個 App 一個顏色、一顆行星', 'Each app a colour and a planet'], {
      p: ['十個圖示、分享卡片、主畫面圖示，手動做會不一致。', 'Ten icons, share cards and home-screen icons drawn by hand drift apart.'],
      i: ['所有名稱、顏色和符號寫在一個檔案裡，圖示和分享卡片都由程式產生：一顆有光環和衛星的行星，上面是 App 的白色符號。', 'Every name, colour and symbol lives in one file; icons and share cards are generated: a planet with its ring and moon, the app’s white symbol on it.'],
      r: ['改一個顏色，全部圖示一起更新。', 'Change one colour and every icon follows.'],
      tech: ['brand.mjs（BRANDS、GLYPHS、appIcon、familyMark）；brand/generate.mjs 產生圖示、分享卡、manifest。頭像是 96 種有表情的小行星（16 色 × 6 種特徵）。', 'brand.mjs (BRANDS, GLYPHS, appIcon, familyMark); brand/generate.mjs writes icons, share cards, manifests. Avatars: 96 little planets with faces (16 colours × 6 features).']
    }),
    n('kit-dayoff', 'calendar', ['台灣的假日和颱風假', 'Taiwan’s days off, typhoons too'], ['每個 App 都知道今天放不放假', 'Every app knows if today is off'], {
      p: ['颱風停班停課時，課表還在提醒上課、股市還在開。', 'On a typhoon day off, Class still rang and Securities still traded.'],
      i: ['國定假日和颱風假放在同一個零件裡，每個 App 依自己需要問：上課看學校的縣市、上班看工作地點、股市看臺北市。', 'Holidays and typhoon days off live in one piece; each app asks what it needs: classes by the school’s county, work by the workplace, the market by Taipei.'],
      r: ['颱風假在每個 App 都像假日一樣。', 'A typhoon day off acts like a holiday in every app.'],
      tech: ['holidays.mjs、dayoff.mjs dayOffOn(date, place, class|work|trade)；雲端 /weather/dayoff 讀人事行政總處公告。', 'holidays.mjs, dayoff.mjs dayOffOn(date, place, class|work|trade); the cloud’s /weather/dayoff reads the DGPA.'],
      links: ['weather-typhoon', 'transit-stopped', 'law-live']
    }),
    n('kit-shared-logic', 'swap', ['手機和雲端用同一段程式', 'One code for phone and cloud'], ['答案永遠一樣', 'The answers always agree'], {
      p: ['手機算一套、伺服器算一套，結果會對不上。', 'If the phone and the server compute separately, they disagree.'],
      i: ['券商規則、比分解析、轉播台判斷這些邏輯寫一次，手機和雲端都跑同一份。', 'Broker rules, the score parser and the broadcast rules are written once and run on both.'],
      r: ['手機上預估的跟伺服器最後做的一模一樣。', 'What the phone previews is exactly what the server does.'],
      tech: ['stock-*.mjs（Securities 和 stock-fill/stock-check）、sports-espn.mjs（App 和 /sports-today）、sports-broadcast/highlights/winprob（App 和 builders）、carrier-csv.mjs（App 和郵件匯入）。', 'stock-*.mjs (Securities and stock-fill/stock-check), sports-espn.mjs (app and /sports-today), sports-broadcast/highlights/winprob (app and builders), carrier-csv.mjs (app and mail-in).'],
      links: ['sec-ledger', 'sports-today']
    }),
    n('kit-boot', 'clock', ['載入畫面和更新', 'Loading screen and updates'], ['每個 App 打開方式都一樣', 'Every app opens the same way'], {
      p: ['更新失敗時 App 說「網路不穩」，其實是更新沒裝完。', 'A failed update was blamed on the network.'],
      i: ['同一個載入畫面：先檢查有沒有新版本，有就重新載入一次；壞掉時分辨是沒網路還是更新沒完成，只重新下載壞掉的檔案。', 'One loading screen checks for a newer version and reloads once; on a failure it tells no network from an unfinished update and re-fetches only the wrong files.'],
      r: ['不會再錯怪網路。', 'The network is never wrongly blamed.'],
      tech: ['boot.js；最多重試 5 次（0/4/12/30/60 秒）；kit sw.js 只保存內容雜湊對得上的檔案。', 'boot.js; up to 5 retries (0/4/12/30/60 s); the kit’s sw.js keeps only files whose bytes match their hash.'],
      links: ['fast-hash', 'ship-update']
    }),
    n('kit-learn', 'spark', ['推薦會學', 'Picks that learn'], ['你跳過的會沉下去', 'What you pass over sinks'], {
      p: ['推薦的比賽或股票一直出現你從來不點的。', 'Picks kept showing games or stocks you never open.'],
      i: ['手機記下每次推薦了什麼、你點了哪個；常被跳過的同類（同一聯盟、球隊、產業、市場）分數變低，常點的變高，30 天後慢慢淡掉。', 'The phone notes what each list of picks showed and what you opened; the kinds you pass over (a league, a team, a sector, a market) score lower, those you open higher, fading over 30 days.'],
      r: ['Sports 的今日推薦和 Securities 的為你推薦越用越懂你，而且資料不離開手機。', 'Sports’ Today’s picks and Securities’ For you get to know you, and nothing leaves the phone.'],
      tech: ['kit feedback.mjs：每個 App 最多記 400 項，分數乘上 0.5 到 1.6，半衰期 30 天。', 'kit feedback.mjs: up to 400 items per app, a score times 0.5 to 1.6, a 30-day half-life.'],
      links: ['sports-picks']
    }),
    n('kit-rec', 'history', ['除錯紀錄', 'The debug log'], ['Jay 一鍵複製給 Claude', 'Jay copies it to Claude in one tap'], {
      p: ['Jay 看到問題，卻說不清楚發生什麼事。', 'Jay sees a problem but can’t say what happened.'],
      i: ['每個 App 都把慢的請求、錯誤記在手機上，Jay 從 Pass 視窗一鍵複製，貼給 Claude。', 'Every app logs slow calls and errors on the phone; Jay copies them from the Pass sheet and pastes them to Claude.'],
      r: ['修的是真正的原因，不是用猜的。', 'Fixes go to the real cause, not a guess.'],
      tech: ['orbit.mjs rec()；伺服器回應帶 Server-Timing，分得出慢在手機還是伺服器。', 'orbit.mjs rec(); Worker answers carry Server-Timing, so slow is placed on the phone or the server.'],
      links: ['team-loop']
    })
  ]
});

const pass = n('pass', 'key', ['一張通行證', 'One pass'], ['Orbit Pass：一組碼，所有 App', 'Orbit Pass: one code, every app'], {
  p: ['十個 App 要十組帳號密碼，資料也分散。', 'Ten apps would mean ten logins and scattered data.'],
  i: ['一組 10 個字的通行碼，由 Jay 發給朋友；登入任何一個 App，其他的也都登入了，資料存在雲端。', 'One 10-character pass that Jay hands out; sign in to one app and the rest follow, data kept in the cloud.'],
  r: ['換手機也什麼都不會少。', 'A new phone loses nothing.'],
  tech: ['Orbit-Core eco.js（/eco）；D1 資料庫 orbit-store。', 'Orbit-Core eco.js (/eco); the D1 database orbit-store.'],
  kids: [
    n('pass-code', 'lock', ['通行碼不會外洩', 'The code never leaks'], ['伺服器只存指紋', 'The server keeps only a fingerprint'], {
      p: ['密碼存在伺服器上，被看到就完了。', 'A stored password is a leak waiting to happen.'],
      i: ['伺服器只存通行碼的「指紋」；手機也不存通行碼，只存一張 60 天的更新票和一張短效的通行票。登出時把手機上的資料清乾淨。', 'The server keeps only the code’s fingerprint; phones keep only a 60-day refresh ticket and a short session ticket. Signing out wipes the device.'],
      r: ['就算資料外洩，也拿不到通行碼。', 'Even a leak doesn’t reveal a pass.'],
      tech: ['SHA-256；orbit-token.js 以 ECO_TOKEN_SECRET 做 HMAC；wipeDevice。沒有註冊，只能由 Jay 發碼。', 'SHA-256; orbit-token.js HMAC under ECO_TOKEN_SECRET; wipeDevice. No sign-up: passes are issued by Jay.']
    }),
    n('pass-session', 'live', ['同一個 App 只有一處在用', 'One live place per app'], ['另一處自動暫停', 'The other one pauses'], {
      p: ['同一個 App 在兩支手機同時改，資料會打架。', 'One app edited on two phones at once fights itself.'],
      i: ['每個 App 最後打開的那一處是「現在」，另一處暫停；不同 App 可以同時開。', 'For each app the last place to open it is live and the other pauses; different apps run side by side.'],
      r: ['不會被另一台手機的舊資料蓋掉。', 'An older copy on another phone never wins.'],
      tech: ['409 ECO_SESSION_MOVED。', '409 ECO_SESSION_MOVED.']
    }),
    n('pass-sync', 'swap', ['存檔前先合併', 'Merge before saving'], ['不會把新的蓋成舊的', 'Never older over newer'], {
      p: ['手機離線時改了東西，回來就把雲端比較新的那份蓋掉。', 'A phone edited offline came back and overwrote the newer cloud copy.'],
      i: ['存檔前先讀雲端那份合併；雲端發現你是在舊版本上改的，會拒絕並要求重新合併。', 'Read and merge the cloud copy before writing; the server refuses a save made on an older copy and asks for a merge.'],
      r: ['兩台裝置的修改都留得住。', 'Both devices’ changes survive.'],
      tech: ['kit pass-sync.mjs；doc-store.js 版本檢查 base → 409 ECO_DATA_CHANGED。', 'The kit’s pass-sync.mjs; doc-store.js version check base → 409 ECO_DATA_CHANGED.']
    }),
    n('pass-safe', 'shield', ['資料三層備份', 'Three layers of backup'], ['資料不會不見也不會壞', 'Data never lost or broken'], {
      p: ['App 越來越依賴雲端，資料一壞就全沒了（尤其記帳的真實金額）。', 'As apps lean on the cloud, one bad save could lose everything, real money included.'],
      i: ['每次覆蓋都先把舊版本存起來（兩天內全留，之後每天一份留 30 天）；每晚整個資料庫壓縮備份到雲端倉庫（留 14 晚和每月一號一年）；資料庫本身還能回到 30 天內任何一分鐘。存檔如果會把資料變成亂碼就直接拒絕。', 'Every overwrite keeps the old version first (all for 2 days, then daily for 30); each night the whole store is zipped to storage (14 nights and a year of month-firsts); the database can also go back to any minute in 30 days. A save that would turn data into garbage is refused.'],
      r: ['Jay 可以在管理頁把任何一個版本放回去。', 'Jay can put back any version from his admin page.'],
      tech: ['D1 history 表；store-backup.js 每晚 04:30 寫到 R2 private/store/；D1 Time Travel；eco.js 拒絕非 JSON。', 'D1 history table; store-backup.js nightly 04:30 to R2 private/store/; D1 Time Travel; eco.js refuses non-JSON.'],
      links: ['store-d1', 'store-r2']
    }),
    n('pass-economy', 'coin', ['模擬金', 'The practice money'], ['只有伺服器能加錢', 'Only the server adds money'], {
      p: ['如果手機能決定給多少錢，改一下就能變有錢。', 'If phones decided payouts, anyone could make themselves rich.'],
      i: ['開戶 NT$200,000、每週一 NT$10,000 薪水、信貸、急難紓困、財富等級，全部由伺服器發；錢只在 Securities 顯示。', 'NT$200,000 to open, NT$10,000 every Monday, loans, relief and wealth levels, all paid by the server; money shows only in Securities.'],
      r: ['除了市場，沒有人能讓帳戶憑空變多。', 'Nothing but the market makes an account richer.'],
      tech: ['eco.js appEntries 只接受 App 的支出；eco: 開頭的記錄只有伺服器能寫；kit loan.mjs。', 'eco.js appEntries accepts only spending from apps; eco: ids are the server’s alone; the kit’s loan.mjs.'],
      links: ['sec-fill']
    })
  ]
});

const cloud = n('cloud', 'cloud', ['雲端小幫手', 'The helper in the cloud'], ['離你最近的伺服器幫 App 跑腿', 'A server near you runs errands for the apps'], {
  p: ['App 自己去問 ESPN、交通部、氣象署，會被擋、會洩漏金鑰，也很慢。', 'Apps asking ESPN, TDX or CWA themselves get blocked, leak keys and are slow.'],
  i: ['一個放在 Cloudflare 全球機房的小程式（Worker）幫所有 App 跑腿：藏好金鑰、合併來源、把答案存起來給大家共用。', 'One small program on Cloudflare’s network (a Worker) runs errands for every app: it hides keys, combines sources and shares answers.'],
  r: ['App 只要問一個地方，答案又快又一致。', 'Apps ask one place and get quick, consistent answers.'],
  tech: ['orbit-workers-proxy（worker.js 分路由，每條路由一個檔案）；不固定機房，在離呼叫者最近的地方跑。', 'orbit-workers-proxy (worker.js routes, a file each); unpinned, it runs near each caller.'],
  kids: [
    n('cloud-gate', 'lock', ['守門', 'The gate'], ['每個請求都要有 Pass', 'Every request needs a Pass'], {
      p: ['任何人都能拿我們的伺服器當免費跳板。', 'Anyone could use our server as a free relay.'],
      i: ['每條路由都要有效的 Pass 通行票，每個 App 每分鐘有次數上限；只有本機測試可以從「開發者門」免通行證讀即時資料。', 'Every route needs a valid Pass session, counted per app per minute; only local tests may read live data through a dev door.'],
      r: ['只有家族的 App 用得到。', 'Only the family’s apps can use it.'],
      tech: ['qt= 通行票；資料代理每分鐘 600 次；Origin: http://localhost:<port> 的開發者門（tools/preview.mjs --live）。讀取用的通行票過期後還有 6 小時寬限。', 'qt= session; 600 a minute on the data proxy; the dev door for Origin: http://localhost:<port> (tools/preview.mjs --live). Read tokens get 6 hours’ grace.'],
      links: ['fast-grace']
    }),
    n('cloud-proxy', 'swap', ['資料代理', 'The data proxy'], ['只讓清單上的網站通過', 'Only listed sites pass'], {
      p: ['手機直接讀別的網站會被瀏覽器擋，也會被來源限流。', 'Browsers block phones reading other sites directly, and sources limit them.'],
      i: ['代理只轉送允許清單上的網站，依資料種類決定存多久：進行中 2 秒、勝率 10 秒、報價 30 秒、排名 30 分鐘、結束的比賽 24 小時；還能一次打包 24 個請求。', 'It passes only allowlisted sites, keeping each kind for its own time: live 2 s, win chances 10 s, quotes 30 s, tables 30 min, a finished game 24 h; up to 24 reads in one batch.'],
      r: ['同時間一千個人打開，來源只被問一次。', 'A thousand people opening at once ask the source once.'],
      tech: ['/sports-proxy?url=&app=&qt=；SPORTS_PROXY_ALLOWED_HOSTS；X-Sports-Proxy-Cache 顯示 HIT/STALE/MISS/KEPT；兩個假網址：asia-baseball.orbit、f1-live.orbit。', '/sports-proxy?url=&app=&qt=; SPORTS_PROXY_ALLOWED_HOSTS; X-Sports-Proxy-Cache says HIT/STALE/MISS/KEPT; two made-up hosts: asia-baseball.orbit, f1-live.orbit.'],
      links: ['sports-trims', 'store-layers']
    }),
    n('cloud-routes', 'map', ['每個 App 的專屬路線', 'Each app’s own routes'], ['天氣、交通、法律、記帳…', 'Weather, transit, law, money…'], {
      tech: ['/eco（Pass）、/stock（成交）、/push（通知）、/weather（天氣混合與颱風）、/transit（TDX、Google）、/sports-proxy 和 /sports-today、/gemini 和 /nl-edit（課表 AI）、/law-ask、/law-chat、/law-gist、/law-page（法律）、/money-read（拍照記帳）、/data（雲端倉庫公開讀取）、/config（Jay 設定的更新速度）。', '/eco (Pass), /stock (fills), /push (notices), /weather (blend and typhoon), /transit (TDX, Google), /sports-proxy and /sports-today, /gemini and /nl-edit (Class AI), /law-ask, /law-chat, /law-gist, /law-page (law), /money-read (photo entries), /data (public storage reads), /config (Jay’s live speeds).'],
      links: ['sports', 'transit', 'weather', 'law', 'money']
    }),
    n('cloud-push', 'bell', ['App 關著也能通知', 'Notices with the app closed'], ['送之前先確認', 'Checked before sending'], {
      p: ['網頁 App 關掉就什麼都不知道了。', 'A closed web app knows nothing.'],
      i: ['App 先把「之後要提醒的事」交給雲端；時間到了雲端先確認（比賽真的結束了嗎、公車真的快到了嗎、價格到了嗎），再加密送到手機。一次性的消息只說一次。', 'Apps hand coming notices to the cloud; when due, it checks first (is the game over, is the bus near, did the price hit) and sends them encrypted. One-off news is told once.'],
      r: ['課前提醒、公車到站、比賽結果、股價提醒都準時。', 'Class reminders, bus alerts, results and price alerts arrive on time.'],
      tech: ['push.js；Web Push（RFC 8291/8292，用 WebCrypto 加密）；每人每個 App 一台裝置；偶數分鐘的排程。', 'push.js; Web Push (RFC 8291/8292, WebCrypto); one device per person per app; the even-minute cron.'],
      links: ['sports-push', 'class-swap']
    }),
    n('cloud-relay', 'send', ['台灣的 AI 中繼站', 'The AI relay in Taiwan'], ['固定在台灣的機房', 'Pinned to a Taiwan data centre'], {
      p: ['Gemini 不接受香港機房的請求，有些縣市法規網站和人事行政總處只接受台灣的連線。可是如果整個代理都固定在台灣，Yahoo 會擋 16 次中的 11 次。', 'Gemini refuses Hong Kong, and some county law sites and the DGPA answer only Taiwan; yet pinning the whole proxy to Taiwan made Yahoo refuse 11 of 16 reads.'],
      i: ['另外做一個只固定在台灣的小中繼站，沒有公開網址，只有代理叫得到它。', 'A separate small relay pinned to Taiwan, with no public address: only the proxy can call it.'],
      r: ['兩邊都能用：AI 和台灣網站走台灣，其他的走最近的機房。', 'Both work: AI and Taiwan-only sites through Taiwan, everything else from the nearest place.'],
      tech: ['gemini-relay.js（wrangler.gemini.toml placement gcp:asia-east1）；service binding GEMINI_RELAY。', 'gemini-relay.js (wrangler.gemini.toml placement gcp:asia-east1); service binding GEMINI_RELAY.'],
      links: ['law-ai', 'class-ai', 'weather-typhoon']
    }),
    n('cloud-cron', 'clock', ['排程工作', 'Scheduled jobs'], ['偶數分鐘和奇數分鐘', 'Even and odd minutes'], {
      p: ['十月新加的排程觸發器從來沒有執行過。', 'New schedule triggers added in October never ran.'],
      i: ['所有排程工作都掛在已經會動的兩個排程上（偶數分鐘、奇數分鐘），或是用會自己叫醒自己的計時器。', 'All scheduled work hangs on the two schedules that already run (even and odd minutes), or on a timer that wakes itself.'],
      r: ['通知、資料整理、F1 存檔、每晚備份都準時跑。', 'Notices, data builds, F1 keeping and the nightly backup run on time.'],
      tech: ['wrangler.toml crons "*/2" 和 "1-59/2"；builders/run.js 依資料變化頻率決定多久跑一次，檔案有變才寫。', 'wrangler.toml crons "*/2" and "1-59/2"; builders/run.js runs each builder as often as its data changes, writing only on change.'],
      links: ['store-r2']
    }),
    n('cloud-guard', 'shield', ['成本警衛', 'The cost guard'], ['每 5 分鐘看一次帳單', 'Reads the bill every 5 minutes'], {
      p: ['雲端用量暴增會收到意外的帳單。', 'A usage spike means a surprise bill.'],
      i: ['另一個小程式每 5 分鐘讀一次用量，照免費方案每天的額度慢慢放慢，真的用到才放慢，不是用預估；Jay 的手機在 50/75/90% 收到通知。', 'Another small program reads usage every 5 minutes and paces things through the free plan’s day, slowing only on real use, never on a forecast; Jay’s phone hears at 50/75/90%.'],
      r: ['在免費方案上不會收任何錢：用多了只會慢一點，不會壞。', 'On the free plan nothing is ever billed: heavy use only slows things a little, nothing breaks.'],
      tech: ['quota-guard（guard.js、Durable Object 鬧鐘）；pace.js；PLAN 列出每種 Cloudflare 產品的額度。', 'quota-guard (guard.js, a Durable Object alarm); pace.js; PLAN lists every Cloudflare product’s allowance.'],
      links: ['cheap-guard']
    })
  ]
});

const store = n('store', 'backpack', ['資料放在哪裡', 'Where data lives'], ['先翻口袋，再翻書包，最後才去圖書館', 'Pocket first, then the backpack, the library last'], {
  p: ['每次都跟來源要資料，又慢又會被限流。', 'Asking the source every time is slow and gets you cut off.'],
  i: ['資料分好幾層放，越近的越快：先看記憶體，再看手機，再看雲端倉庫，最後才問原始來源。', 'Data sits in layers, nearest fastest: memory, then the phone, then cloud storage, the source last.'],
  r: ['大部分時候根本不用等網路。', 'Most of the time there’s no network wait at all.'],
  kids: [
    n('store-layers', 'list', ['一次讀取經過的七層', 'The seven layers of a read'], ['找到就停', 'It stops at the first that answers'], {
      p: ['要決定一筆資料從哪裡拿。', 'Every read must decide where to look.'],
      i: ['依序：① 記憶體 ② 手機的快取（還沒過期就直接用）③ 剛剛失敗過的來源先別再問 ④ 雲端倉庫裡做好的資料包 ⑤ 台灣附近機房的快取 ⑥ 永久保存的「已結束」資料 ⑦ 原始來源。', 'In order: ① memory ② the phone’s cache (used as is while fresh) ③ a source that just failed isn’t asked again yet ④ ready-made packs in cloud storage ⑤ the edge cache near Taiwan ⑥ copies of what’s over for good ⑦ the source.'],
      r: ['同一筆資料，大家都從最近的地方拿。', 'Everyone gets each piece from the nearest place that has it.'],
      tech: ['kit proxyJson / packJson；Cache Storage 依 ttl；failure hold；R2 /data/；edge cache；readKept；upstream。', 'The kit’s proxyJson / packJson; Cache Storage by ttl; the failure hold; R2 /data/; the edge cache; readKept; upstream.'],
      links: ['cloud-proxy', 'sports-kept']
    }),
    n('store-fail', 'shield', ['失敗不是「沒有」', 'A failure isn’t “nothing”'], ['讀不到就不存', 'Never saved when unread'], {
      p: ['讀取失敗被當成「沒有資料」，結果把好好的資料蓋成空的。', 'A failed read treated as “nothing there” saved emptiness over good data.'],
      i: ['讀取失敗就是失敗：顯示手上最新的一份，等一下再問，絕對不存；儲存的資料鍵名帶版本號，意思改了就換版本。', 'A failed read is a failure: show the latest copy, ask again soon, never save it; saved keys carry a version that changes with their meaning.'],
      r: ['網路不穩也不會丟資料。', 'A bad connection never loses data.'],
      tech: ['例：fx.day.v4、ot.trips.v2；pass-sync 讀不到雲端就不寫。', 'e.g. fx.day.v4, ot.trips.v2; pass-sync never writes over a copy it couldn’t read.']
    }),
    n('store-phone', 'user', ['手機上', 'On the phone'], ['打開時先用手上的', 'Open on what it has'], {
      tech: ['記憶體 → Cache Storage（Service Worker 管理的 App 檔案和資料）→ localStorage（設定、最近的資料，鍵名帶版本）→ IndexedDB（Beats 的歌和樂器組）。', 'Memory → Cache Storage (the app’s files and data, run by the Service Worker) → localStorage (settings and recent data, versioned keys) → IndexedDB (Beats’ songs and kits).'],
      links: ['fast-sw']
    }),
    n('store-d1', 'list', ['資料庫（D1）', 'The database (D1)'], ['Pass 和每個 App 的資料', 'The Pass and each app’s data'], {
      tech: ['D1 orbit-store：錢包（entries、snap、settings、inbox）、每個 App 一個集合、history 舊版本表；合併時檢查版本。', 'D1 orbit-store: the wallet (entries, snap, settings, inbox), one collection per app, the history table; merges under a version check.'],
      links: ['pass-safe']
    }),
    n('store-r2', 'backpack', ['雲端倉庫（R2）', 'Cloud storage (R2)'], ['做好的資料包和永久保存的', 'Ready packs and things kept for good'], {
      tech: ['R2 orbit-data：球季和比賽日、轉播精華、勝率、球員照片、公車包和路線形狀、永久保存的比賽和 F1 賽段、每晚備份（private/ 不公開）。一個球季保留到下個球季第一場比賽。', 'R2 orbit-data: seasons and game days, watch links, win chances, photos, bus packs and shapes, games and F1 sessions kept for good, nightly backups (private/ never served). A season stays until the next one’s first game.'],
      links: ['sports-kept', 'transit-packs', 'pass-safe']
    }),
    n('store-kv', 'grid', ['快速小抽屜（KV）', 'Quick drawers (KV)'], ['短時間共用的答案', 'Answers shared for a while'], {
      tech: ['KV RATE_LIMIT_KV：天氣格子 15 分鐘、颱風機率 3 分鐘、AI 答案（依法律版本存）、通知清單、次數限制。', 'KV RATE_LIMIT_KV: weather cells 15 min, typhoon chances 3 min, AI answers (by law version), notice lists, rate counts.'],
      links: ['weather-squares']
    }),
    n('store-pages', 'book', ['靜態網站上的資料', 'Data on the static sites'], ['讀了不用錢', 'Free to read'], {
      tech: ['Cloudflare 上的靜態網站：Orbit Law 每天建好的法規、判決、法案（約 60 MB）；Words 的 6,169 個錄音；Securities 的上市清單。', 'Static sites on Cloudflare: Orbit Law’s daily-built laws, rulings and bills (about 60 MB); Words’ 6,169 recordings; Securities’ listing files.'],
      links: ['law-build', 'cheap-static']
    })
  ]
});

const fast = n('fast', 'flame', ['為什麼打開很快', 'Why it opens fast'], ['在 Jay 的 4G 上測過', 'Tested on Jay’s own 4G'], {
  p: ['以前在 3G 上要 20 到 70 秒才打開，每次更新都整個重新下載。', 'Apps took 20–70 seconds on 3G and re-downloaded everything after each update.'],
  i: ['只下載有改的檔案、先用手機上的資料、不讓任何東西在畫面上跳。', 'Download only what changed, open on what the phone has, and let nothing jump.'],
  r: ['在 Jay 真實的台灣大哥大 4G（12 Mbps、延遲 300–470 毫秒）上也很快。', 'Quick even on Jay’s real Taiwan Mobile 4G (12 Mbps, 300–470 ms latency).'],
  kids: [
    n('fast-hash', 'check', ['只下載有改的檔案', 'Only changed files download'], ['每個檔案有自己的指紋', 'Each file has its own fingerprint'], {
      p: ['每次更新，手機就把整個 App 重新下載一次。', 'Every update re-downloaded the whole app.'],
      i: ['上線前把每個檔案壓縮，並用內容算出指紋放進網址；內容沒變，網址就沒變，手機就不用再下載。', 'Before going live, each file is minified and its content fingerprint goes in its address; unchanged content keeps its address, so phones skip it.'],
      r: ['一次小修改只下載幾 KB。', 'A small change downloads a few KB.'],
      tech: ['kit stamp.mjs、stamp-app.mjs、hash.mjs（esbuild 壓縮、?v=<sha256 前 12 碼>）；kit 的 version.json 列出每個檔案的雜湊。', 'The kit’s stamp.mjs, stamp-app.mjs, hash.mjs (esbuild minify, ?v=<first 12 of sha256>); the kit’s version.json lists every file’s hash.'],
      links: ['ship-pages']
    }),
    n('fast-sw', 'backpack', ['離線也打得開', 'Opens offline'], ['一個 Service Worker 給所有 App', 'One Service Worker for every app'], {
      p: ['網頁沒網路就打不開。', 'A web page won’t open without a network.'],
      i: ['一個共用的背景小幫手把 App 的檔案存在手機上，先用存好的，再在背後更新；指紋對不上的檔案絕對不留。', 'One shared background helper keeps the app’s files on the phone, opens on them and refreshes behind; a file whose bytes don’t match its fingerprint is never kept.'],
      r: ['在捷運地下也打得開；需要即時資料的 App 會蓋上「沒有網路」而不是顯示舊資料。', 'Opens underground; live apps cover themselves offline instead of showing old data as now.'],
      tech: ['kit sw.js；每個 App 的 sw.js 只寫設定 ORBIT_SW 再 importScripts；onlineOnly、keepOffline。', 'The kit’s sw.js; each app’s sw.js is only ORBIT_SW settings plus importScripts; onlineOnly, keepOffline.']
    }),
    n('fast-first', 'clock', ['先用手上的，背後再更新', 'Open on what’s there, refresh behind'], ['不等版本檢查', 'No waiting on the version check'], {
      p: ['App 等確認版本、等登入，畫面一直空白。', 'Apps waited on the version check and sign-in with a blank screen.'],
      i: ['先打開手機上存的內容；版本檢查最多等 0.8 秒；一開始就先跟雲端打招呼建立連線。', 'Open on what the phone kept; wait at most 0.8 s on the version check; open the connection to the cloud at the very start.'],
      r: ['打開就有東西看。', 'Something to see the moment it opens.'],
      tech: ['kit updateChecked（最多 0.8 秒）；boot.js preconnect 到 Worker；kit/preload.mjs modulepreload。', 'The kit’s updateChecked (0.8 s max); boot.js preconnects to the Worker; kit/preload.mjs modulepreload.']
    }),
    n('fast-grace', 'key', ['登入票多寬限一下', 'Grace on the sign-in ticket'], ['重新打開不用等', 'A reopen doesn’t wait'], {
      p: ['通行票過期了，重新打開要先等換票才能讀資料。', 'An expired ticket made a reopen wait for a new one before reading.'],
      i: ['讀資料用的票過期後 6 小時內還能用，換新票在背後做。', 'For reads, a ticket works 6 hours past expiry while a new one is fetched behind.'],
      r: ['少一次來回，在慢網路上差很多。', 'One round trip fewer, which matters on a slow link.'],
      tech: ['orbit-token READ_GRACE_MS；kit s.readToken。', 'orbit-token READ_GRACE_MS; the kit’s s.readToken.']
    }),
    n('fast-lift', 'spark', ['載入畫面準備好才拿掉', 'Loading lifts on a finished page'], ['之後什麼都不會跳出來', 'Nothing pops in after'], {
      p: ['畫面先出現一半，內容再一塊一塊跳進來，很廉價。', 'Half a screen that fills in piece by piece feels cheap.'],
      i: ['載入畫面等第一個畫面的內容和圖片都好了才拿掉（最多等 1.5 秒圖片），之後的更新都在原地淡入。', 'The loading screen lifts once the first screen and its pictures are ready (waiting up to 1.5 s for pictures); later updates fade in place.'],
      r: ['打開就是完整的畫面。', 'It opens onto a finished screen.'],
      tech: ['ui.mjs ready()；orbit.mjs liftOnPictures。', 'ui.mjs ready(); orbit.mjs liftOnPictures.']
    }),
    n('fast-morph', 'live', ['只改變了的數字', 'Only changed numbers move'], ['不重畫整頁', 'No full redraw'], {
      tech: ['Sports 的 morph、Class 的每秒更新、Securities 的報價都只改有變的地方；切換分頁時沒變的分頁不重畫（Money 曾因此省下每次 100–180 毫秒）。', 'Sports’ morph, Class’s per-second tick and Securities’ quotes change only what moved; an unchanged tab isn’t redrawn on return (Money saved 100–180 ms a switch).'],
      links: ['sports-live', 'class-clock']
    }),
    n('fast-worker', 'swap', ['重的工作放到背景', 'Heavy work in the background'], ['畫面不卡', 'The screen never stalls'], {
      tech: ['Beats 在 Web Worker 裡作曲和混音，事先做好兩首；Transit 捷運圖的版面事先在電腦上算好。', 'Beats composes and mixes in Web Workers, two songs ahead; Transit’s metro layouts are worked out ahead on a computer.'],
      links: ['beats-real', 'transit-metro']
    }),
    n('fast-test', 'target', ['用慢網路測試', 'Tested on a slow link'], ['模擬 Jay 的手機網路', 'Modelled on Jay’s phone'], {
      tech: ['測試工具把每個請求放到模擬的連線上（新網站 2 次來回、之後每次 1 次、共用 12 Mbps），測第一次打開、重新打開和一小時後。', 'The test harness routes every request over a modelled link (2 round trips for a new host, 1 after, a shared 12 Mbps) and measures first open, reopen and an hour later.'],
      links: ['ship-tools']
    })
  ]
});

const cheap = n('cheap', 'coin', ['不超過額度、不花錢', 'Staying under limits, spending nothing'], ['只付網域的錢', 'Only the domain is paid'], {
  p: ['很多資料來源有免費額度，超過就要錢或被封鎖。', 'Many sources have free allowances; past them you pay or get blocked.'],
  i: ['不先抓沒人要看的東西、大家共用同一個答案、能永久保存的就保存。', 'Never fetch what nobody opens, share one answer, and keep what can be kept for good.'],
  r: ['從 2026-11-13 起，整個家族跑在 Cloudflare 的免費方案和各個來源的免費額度上，只付網域的錢（AI 例外：Jay 決定 AI 可以付費）。', 'From 2026-11-13 the whole family runs on Cloudflare’s free plan and every source’s free allowance; only the domain is paid (AI aside: Jay decided AI may be paid).'],
  kids: [
    n('cheap-demand', 'clock', ['有人要才做', 'Built only on demand'], ['沒人打開就不跑', 'Nothing runs while nobody looks'], {
      tech: ['不預先抓沒人打開的資料；/sports-today 有人問才建；一天不會變的東西才放在每天整理的倉庫裡，即時的才走代理。', 'Nothing prefetched that nobody opens; /sports-today is built when asked; only what doesn’t change in a day goes in the daily-built storage, live things through the proxy.'],
      links: ['sports-today']
    }),
    n('cheap-share', 'grid', ['大家共用同一個答案', 'Everyone shares one answer'], ['快取', 'Caches'], {
      tech: ['代理的邊緣快取（依資料種類）、天氣 5 公里格子、颱風機率一個縣市一份、TDX 結果 10 秒、AI 答案依法律版本存。', 'The proxy’s edge cache (by kind), 5 km weather squares, one typhoon number per county, TDX answers 10 s, AI answers kept by law version.'],
      links: ['cloud-proxy', 'weather-squares', 'transit-tdx']
    }),
    n('cheap-caps', 'shield', ['每個外部服務都有上限', 'A cap on every outside service'], ['AI、地圖、天氣', 'AI, maps, weather'], {
      tech: ['AI 每條路由每天都有全站上限（例如法律 300、拍照記帳 300）和每人上限（問法律 30）；Google 地圖用到每月免費額度的九成就停；Google 天氣一個月 8,500 次以內；AI 一定要使用者按了才問。', 'AI has a daily cap per route for everyone (Law 300, receipts 300, for example) and per Pass (Ask the law 30); Google Maps stops at 90% of each free month; Google Weather stays under 8,500 a month; AI only ever on a tap.'],
      links: ['law-ai', 'class-ai', 'weather-squares', 'transit-caps']
    }),
    n('cheap-static', 'book', ['能放靜態網站就放', 'Static whenever possible'], ['讀靜態檔案不用錢', 'Static files are free to read'], {
      tech: ['十個 App 本身、共用零件、Orbit Law 的全部資料都是靜態檔案，放在 Cloudflare、Jay 自己的網域底下（2026-11-01 從 GitHub Pages 搬過來，GitHub 只放程式碼），讀多少都不用錢。', 'All ten apps, the kit and every bit of Orbit Law’s data are static files on Cloudflare under Jay’s own domain (moved off GitHub Pages on 2026-11-01; GitHub keeps only the code): free however much they’re read.'],
      links: ['store-pages']
    }),
    n('cheap-guard', 'shield', ['成本警衛會踩煞車', 'The guard brakes'], ['照每天的免費額度放慢', 'Paced by the day’s free amounts'], {
      tech: ['quota-guard 每 5 分鐘讀用量，照 Workers 免費方案每天的額度（請求、CPU、KV、Durable Objects）放慢，不會停；新增 Cloudflare 產品時一定要同時加進它的 PLAN。', 'quota-guard reads usage every 5 minutes and paces by the Workers Free plan’s daily amounts (requests, CPU, KV, Durable Objects), never stopping; a new Cloudflare product goes into its PLAN in the same change.'],
      links: ['cloud-guard']
    }),
    n('cheap-speeds', 'pencil', ['更新速度由 Jay 決定', 'Jay sets the speeds'], ['人變多就一起放慢', 'Slowed together as the family grows'], {
      tech: ['管理頁的開發者設定（brand.mjs DEV）：比分、F1、交通的更新秒數；autoScale 依預估人數一起放慢，空間夠就恢復。', 'The admin page’s developer settings (brand.mjs DEV): seconds for scores, F1, transit; autoScale slows them together as people grow, back when there’s room.']
    }),
    n('cheap-plan', 'coin', ['怎麼塞進免費方案', 'Fitting the free plan'], ['重的工作交給會自己醒來的小幫手', 'Heavy work goes to a helper that wakes itself'], {
      p: ['Jay 把每月 5 美元的方案取消了（2026-11-13 到期），但免費方案每個請求只能算 10 毫秒，有些路線一次要算更久。', 'Jay cancelled the $5 plan (it ends 2026-11-13), but the free plan gives a request only 10 ms of computing, and some routes need longer.'],
      i: ['把重的路線和所有排程工作搬進一個會自己醒來的小幫手（每次可以算 30 秒）；手機自己讀得到的來源就讓手機讀；交通資料改讀業者自己的網站。', 'Move the heavy routes and every scheduled job into a helper that wakes itself (30 s of computing a go); let the phone read whatever it can itself; read transit from the operators’ own sites.'],
      r: ['同樣的 App、同樣快，雲端一毛錢都不用付。', 'The same apps, just as fast, for nothing in the cloud.'],
      tech: ['Orbit-Core runner.js：Runner 是同一個 Worker 的 Durable Object，接手超過 10 毫秒的路線和偶數分鐘排程的工作，用它自己的鬧鐘醒來；guard.js PLAN 換成免費方案的每日額度；KV 每天 1,000 次寫入以內（通知改放 D1）。', 'Orbit-Core runner.js: the Runner, a Durable Object of the same Worker, takes the routes past 10 ms and the even-minute jobs, waking by its own alarm; guard.js PLAN set to the Free plan’s daily amounts; KV under 1,000 writes a day (notices moved to D1).'],
      links: ['transit-tdx']
    })
  ]
});

const ship = n('ship', 'send', ['改好之後怎麼到你手機', 'From a change to your phone'], ['推上去就自動上線', 'Push, and it goes live by itself'], {
  p: ['手動上傳網站容易出錯，也會漏東西。', 'Uploading by hand is error-prone.'],
  i: ['程式一推到主線，GitHub 自動跑測試、壓縮、算指紋、上線；伺服器程式也一樣自動部署。', 'Push to main and GitHub runs the tests, minifies, fingerprints and publishes; the server code deploys the same way.'],
  r: ['從修好到 Jay 手機上看到，通常只要幾分鐘。', 'From fix to Jay’s phone usually takes minutes.'],
  kids: [
    n('ship-pages', 'check', ['自動上線流程', 'The automatic pipeline'], ['測試 → 壓縮 → 上線', 'Test → minify → publish'], {
      tech: ['每個 repo 的 .github/workflows：npm test → scripts/stamp-version.mjs（壓縮、指紋、version.json）→ Orbit-Core 的 deploy/cf-site.mjs 發佈到 Cloudflare。一次只跑一個部署，新的來就讓位，不取消（取消會寄信給 Jay）；永遠建主線最新的版本，不建觸發它的那個舊版本。', 'Each repo’s .github/workflows: npm test → scripts/stamp-version.mjs (minify, fingerprint, version.json) → Orbit-Core’s deploy/cf-site.mjs publishes it to Cloudflare. One deploy at a time, stepping aside for newer ones and never cancelling (a cancel emails Jay); always builds main’s newest tree, not the commit that started it.'],
      links: ['fast-hash']
    }),
    n('ship-workers', 'cloud', ['伺服器自動部署', 'The server deploys itself'], ['Cloudflare Workers', 'Cloudflare Workers'], {
      tech: ['Orbit-Core deploy.yml 部署代理和 AI 中繼站；deploy-guard.yml 部署成本警衛；pages.yml 部署共用零件和家族首頁。金鑰只放在 GitHub 或 Cloudflare 的秘密設定裡，從不放進程式碼。', 'Orbit-Core deploy.yml ships the proxy and the AI relay; deploy-guard.yml the guard; pages.yml the kit and the family page. Secrets live only in GitHub or Cloudflare secrets, never in code.']
    }),
    n('ship-order', 'list', ['先零件，再 App', 'The kit first, then the apps'], ['順序錯了會壞', 'The wrong order breaks things'], {
      tech: ['共用零件的改動先推，等它上線，再推用到新零件的 App；App 用新零件一定要有後備（kit.x?.()）。', 'Kit changes go first and must be live before apps that use them; an app always calls a new kit export with a fallback (kit.x?.()).'],
      links: ['kit']
    }),
    n('ship-tests', 'check', ['測試只測會默默出錯的地方', 'Tests for the silent bugs'], ['錢、資料、排名、結算', 'Money, data, ranking, settling'], {
      tech: ['測試寫給「錯了也不會被看出來」的邏輯：錢、資料合併、排名、行程規劃、結算；版面和文字不寫測試，用截圖看。Transit 用 Jay 的真實行程當判決。', 'Tests are for logic whose bugs are silent: money, merging, ranking, planning, settling; layout and wording are checked by screenshots instead. Transit uses Jay’s real trips as verdicts.'],
      links: ['transit-rank']
    }),
    n('ship-tools', 'camera', ['Claude 看得到手機畫面', 'Claude sees the phone screen'], ['截圖工具和品質關卡', 'A screenshot tool and a quality gate'], {
      p: ['Claude 看不到 Jay 的 iPhone。', 'Claude can’t see Jay’s iPhone.'],
      i: ['一個工具在雲端用 Safari 的引擎打開任何 App、用真實資料、iPhone 的大小截圖，並自動找出換行、被切掉、會橫向捲動的地方；品質關卡在 320 和 390 寬、深淺色下點遍每個按鈕。', 'A tool opens any app with real data at iPhone size in Safari’s engine, screenshots it and flags wraps, cut text and sideways scrolling; the quality gate taps every button at 320 and 390 px, light and dark.'],
      r: ['2026-10-20 所有 App 跑完整關卡：50 次、0 個問題。', '2026-10-20: every app passed the full gate, 50 runs, 0 faults.'],
      tech: ['Orbit-Core tools/preview.mjs（--live、--webkit、--width、--dark）、tools/gate.mjs。', 'Orbit-Core tools/preview.mjs (--live, --webkit, --width, --dark), tools/gate.mjs.'],
      links: ['team-loop']
    }),
    n('ship-update', 'live', ['手機自己換新版', 'Phones update themselves'], ['只重新載入一次', 'One reload'], {
      tech: ['打開時 boot.js 比對網頁的版本和 version.json，有新版就重新載入一次；之後 watchUpdates 保持最新，但絕不在背景（例如 Beats 播歌時）重新載入。', 'On opening boot.js compares the page’s version with version.json and reloads once for a newer one; watchUpdates keeps it current after, but never reloads a hidden page (Beats playing).'],
      links: ['kit-boot']
    })
  ]
});

const team = n('team', 'user', ['怎麼做出來的', 'How it was made'], ['Jay 決定，Claude 寫程式', 'Jay decides, Claude writes the code'], {
  p: ['Jay 不寫程式，卻想做出一整個家族的 App。', 'Jay doesn’t write code, yet wanted a whole family of apps.'],
  i: ['Jay 當「老闆和測試員」：決定要什麼、在 iPhone 上試、把不滿意的地方說出來；好幾個 Claude 分工寫程式、測試、上線。', 'Jay is owner and tester: he decides, tries it on his iPhone and says what’s wrong; several Claude sessions split the coding, testing and shipping.'],
  r: ['不到三個月做出十個 App 和背後的整套系統。', 'Ten apps and the system behind them in under three months.'],
  kids: [
    n('team-jay', 'user', ['Jay 的角色', 'Jay’s part'], ['出題目、做決定、當最挑剔的使用者', 'Sets the goals, decides, the pickiest user'], {
      tech: ['用 iPhone 主畫面 App 測試，傳截圖和除錯紀錄；決定每個產品要什麼（例如只放台灣看得到的比賽、券商規則要跟真的一樣）；把每次抱怨變成全家族的規則。', 'Tests as home-screen apps on his iPhone, sending screenshots and debug logs; decides what each product is (only games Taiwan can watch, broker rules as real as the real thing); turns each complaint into a family-wide rule.'],
      links: ['kit-rec']
    }),
    n('team-coordinator', 'grid', ['協調者', 'The coordinator'], ['一個 Claude 負責分工', 'One Claude splits the work'], {
      tech: ['在專案聊天室裡接 Jay 的話，把它拆成一個個工作串，附上 Jay 的原話；每小時檢查一次各工作串的進度。', 'Takes Jay’s messages in the project chat, splits them into work threads with Jay’s own words attached, and checks every lane hourly.']
    }),
    n('team-lanes', 'list', ['工作串', 'Work threads'], ['一串一個目標，同時十幾串', 'One goal each, a dozen at once'], {
      tech: ['每個工作串是一個 Claude，負責一個目標（例如「颱風天交通」「F1 勝率」）；測試通過就直接上線，不用等 Jay 批准；不會互相等待。2026-10-23 同時有 13 個工作串在跑。', 'Each thread is one Claude with one goal (say, typhoon-day transit or F1 win chance); once tests pass it ships without waiting for approval, and never waits on another lane. On 2026-10-23, 13 ran at once.']
    }),
    n('team-memory', 'backpack', ['共同記憶和規則書', 'Shared memory and a rulebook'], ['新的 Claude 不用再問一次', 'A new Claude needn’t ask again'], {
      tech: ['專案記憶：一個主題一個檔案（例如「颱風假」「只做手機」），新的工作串一開始就讀；規則書 RULEBOOK.md 收齊家族的規則（每條有日期），每個 App 自己的規則寫在它的 MAP.md；額度用完時寫交接文件，讓別人接手。', 'Project memory, one file per subject (typhoon days off, phones only), read by every new thread; one rulebook, RULEBOOK.md, for the family’s rules (each dated), and each app’s own in its MAP.md; handoff notes when quota ran out.']
    }),
    n('team-loop', 'swap', ['一天怎麼過', 'A typical loop'], ['看到問題 → 幾分鐘後修好', 'Spot it → fixed minutes later'], {
      tech: ['Jay 在 iPhone 上發現問題 → 傳截圖或除錯紀錄 → 協調者交給對的工作串 → Claude 找出真正原因、修好、跑測試、截圖檢查 → 推上主線，自動上線 → Jay 重新打開 App 就看到；如果是同一類問題，就寫成規則，所有 App 一起改。', 'Jay spots something on his iPhone → sends a screenshot or the debug log → the coordinator hands it to the right lane → Claude finds the real cause, fixes it, runs the tests and checks screenshots → pushes to main and it goes live → Jay reopens the app and sees it; if it’s a kind of problem, it becomes a rule for every app.'],
      links: ['ship-tools', 'kit-rec']
    }),
    n('team-lessons', 'flag', ['學到的教訓', 'Lessons learned'], ['每個錯誤變成一條規則', 'Every mistake became a rule'], {
      tech: ['① 一次從舊副本推上去，把 21,927 筆最高法院裁判清空 → 每次推之前一定先同步最新版本。② 十月新增的排程從沒執行 → 只用現有的排程。③ iPad 和電腦版面一直壞 → 只做手機。④ ESPN 的排名太慢 → 自己算。⑤ 新零件讓舊手機整個掛掉 → 新零件一律加後備。⑥ 讀取失敗被當成沒資料 → 失敗不是空的。', '① A push from an old copy wiped 21,927 top-court rulings → always sync right before pushing. ② New schedules added in October never ran → use the existing ones. ③ iPad and desktop layouts kept breaking → phones only. ④ ESPN’s tables lagged → count them ourselves. ⑤ A new kit piece crashed older phones → every new piece gets a fallback. ⑥ A failed read was taken as no data → a failure is never “nothing”.'],
      links: ['store-fail', 'sports-table', 'cloud-cron']
    })
  ]
});

export const ROOT = n('orbit', 'spark', ['Orbit', 'Orbit'], ['每天用得到的 App，一個人和 Claude 一起做的', 'Everyday apps, made by one person with Claude'], {
  kids: [apps, ai, kit, pass, cloud, store, fast, cheap, ship, team]
});

// Every node by id, with its parent and depth; the colour of the app it's
// under (for tinting).
export const NODES = new Map();
(function index(node, parent = null, depth = 0, app = null) {
  const a = node.app || app;
  NODES.set(node.id, { node, parent, depth, app: a });
  for (const k of node.kids || []) index(k, node.id, depth + 1, a);
})(ROOT);

export const pathTo = id => {
  const out = [];
  for (let at = NODES.get(id); at; at = at.parent ? NODES.get(at.parent) : null) out.unshift(at.node);
  return out;
};
