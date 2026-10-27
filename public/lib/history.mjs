// The 歷程 tab: the big changes (not a daily log), each with its real date
// from git, why it happened in plain words, and a before/after picture where
// one exists; the apps' birthdays; a few days that show how the work goes;
// and the complaints that became rules for every app. The day-by-day feel
// itself (the heatmap and the hours) comes from data/stats.json.

// How it began. Dates and the 4,102 lines are from Orbit-Class's first commit.
export const ORIGIN = {
  date: '2026-08-26',
  title: ['一切從一個課表開始', 'It all began with a timetable'],
  // Jay 2026-10-27: named Orbit Color for the colour feature it was getting
  // then; he began using GitHub late, so 26 Aug is its arrival there, not its start.
  body: [
    ['Orbit 的第一個 App 一開始不叫 Orbit Class。它是 Jay 自己做的課表網頁，在上 GitHub 之前就已經做了、天天在用好幾個月。那時它正要加上換顏色的功能，所以 Jay 叫它 Orbit Color。', 'Orbit’s first app wasn’t called Orbit Class at first. It was Jay’s own timetable page, built and used every day for months before it ever reached GitHub. It was about to get a new colour feature at the time, so Jay called it Orbit Color.'],
    ['Jay 很晚才開始用 GitHub：8 月 26 日才把它上傳上去，整個 App 塞在一個 4,102 行的檔案裡。當天晚上就試著讓它讀課表照片（OCR）：第一次失敗，提交紀錄寫著「OCR first try failed, retreat」；凌晨三點多換成用 AI 讀，成功了。', 'Jay came to GitHub late: he uploaded it on 26 August, the whole app packed into one 4,102-line file. That evening he tried to make it read a photo of the timetable (OCR): the first try failed, the commit says “OCR first try failed, retreat”, and at about 3 a.m. an AI reader did the job.'],
    ['9 月 11 日它改名叫 Orbit Class。其他八個 App 全都是之後這兩個月才做的。', 'On 11 September it was renamed Orbit Class. All eight other apps were made in the two months after.']
  ],
  // Before GitHub: Jay's own saved copies (no dates), each drawn with the
  // same made-up timetable; then Orbit Color as uploaded, and today.
  steps: [
    ['pre-v335', '課表 V3.35', ['還叫「課表」：這節課、下一節、下課倒數，深色卡片', 'Still called 課表 (“timetable”): this class, the next, a countdown, dark cards']],
    ['pre-v4', 'Orbit v4', ['第一次叫 Orbit，上面多了學測倒數', 'First called Orbit, with a countdown to the college entrance exam']],
    ['pre-v5', 'Orbit v5', ['試了一個淺色、像「學習總覽」的版面', 'Tried a light, “study overview” layout']],
    ['then-class', 'Orbit Color', ['上 GitHub 那天：玻璃質感，正準備加上換顏色的功能', 'The day it reached GitHub: glassy, about to get its colour feature']],
    ['class-1', 'Orbit Class', ['現在：Orbit 家族的一員', 'Now: one of the Orbit family']]
  ]
};

// The tools, in Jay's own account (Jay 2026-10-27); the numbers on the
// last two come from git (data/stats.json: firstClaude, claude, copilot).
export const TOOLS = [
  { id: 'chatgpt', icon: 'send', name: 'ChatGPT', when: ['上 GitHub 之前', 'Before GitHub'],
    line: ['一開始 Jay 只在 ChatGPT 的對話框裡寫程式，再把結果貼進一個 HTML 檔。上面那些早期版本都是這樣做出來的。', 'At first Jay coded only by chatting with ChatGPT and pasting the result into one HTML file. The early versions above were all made that way.'] },
  { id: 'github', icon: 'pencil', name: 'GitHub + Copilot', when: ['8 月 26 日起', 'From 26 August'],
    line: ['搬到 GitHub，Jay 記得大概是因為 GitHub Copilot。', 'Moved to GitHub, as Jay remembers it probably for GitHub Copilot.'] },
  { id: 'claude', icon: 'spark', name: 'Claude', when: ['之後', 'Then'],
    line: ['Jay 買了 Claude Pro。從那之後，大部分的程式都是 Claude 照 Jay 的決定寫的。', 'Jay bought Claude Pro. Since then most of the code has been written by Claude, following Jay’s decisions.'] }
];

// Jay's own calls: the direction, the standards and the judgement; the AI
// does the typing. Dates are when he said it (project notes and his
// messages); `d` is what changed because of it.
export const DECISIONS = [
  { date: '2026-09-28', icon: 'backpack', title: ['兩個 App 用到的，就放進共用零件', 'Anything two apps use goes in the shared kit'],
    d: ['不複製、不各做各的：改一次，全部 App 一起變好。後來每個新 App 都快很多。', 'No copies, no one-offs: one fix improves every app, and each new app came much faster.'] },
  { date: '2026-10-18', icon: 'send', title: ['不用每次問我，測過就上線', 'Don’t ask each time: if the checks pass, ship it'],
    d: ['Jay 不當每一步的關卡，而是在自己的 iPhone 上用、看結果再挑。一天可以改好幾十個地方。', 'Jay isn’t a gate on every step; he judges the result on his own iPhone, so dozens of fixes can land in a day.'] },
  { date: '2026-10-19', icon: 'star', title: ['「疊上去很怪」：整個重做', '“Adding on top is weird”: rebuild it'],
    d: ['第一次統一設計只是在舊畫面上加東西，Jay 一看就退回，要求每個畫面照最好的那個 App 重做。', 'The first unified look only added onto old screens; Jay sent it back and had every screen rebuilt to match the best app.'] },
  { date: '2026-10-20', icon: 'check', title: ['一個品質，像一家人', 'One quality, like one family'],
    d: ['他把看到的每個小毛病變成全家族的規矩，再變成自動檢查。', 'He turned each flaw he saw into a family rule, then into an automatic check.'] },
  { date: '2026-10-21', icon: 'flame', title: ['資料來源慢，就自己算', 'If a feed is slow, work it out ourselves'],
    d: ['不因為 ESPN 還沒更新就藏起資料；比分、排名都自己從即時結果算，一發生就顯示。', 'Never hide data because ESPN is behind; scores and tables are worked out from live results the moment they happen.'] },
  { date: '2026-10-21', icon: 'user', title: ['絕對不幫使用者猜資料', 'Never guess a user’s data'],
    d: ['App 不知道的就問，不自己填；尤其是錢。', 'What an app doesn’t know, it asks; it never fills it in, least of all money.'] },
  { date: '2026-10-22', icon: 'walk', title: ['導航寫成一張標準表，不要一條一條補', 'Navigation as one written standard, not patch after patch'],
    d: ['公車、火車、走路、YouBike 每種情況地圖怎麼動，寫在同一張表、同一個地方。', 'How the map behaves for every bus, train, walk and YouBike leg is written in one table, in one place.'] },
  { date: '2026-10-23', icon: 'user', title: ['只做手機', 'Phones only'],
    d: ['大螢幕版面一直壞，他決定乾脆不做，省下的力氣全部放在手機上。', 'Big-screen layouts kept breaking, so he dropped them and put all that effort into the phone.'] },
  { date: '2026-10-23', icon: 'shield', title: ['跟真的一模一樣，再麻煩也要', 'As real as the real thing, however annoying'],
    d: ['券商有的開戶資格、限制、手續，App 裡也要有，用起來才學得到東西。', 'The account papers, limits and steps a real broker has belong in the app too, so using it actually teaches something.'] },
  { date: '2026-10-27', icon: 'wallet', title: ['記帳從乾淨的帳開始', 'Start the books clean'],
    d: ['匯入舊記帳 App 的功能做好了，Jay 還是選擇不搬，從 11 月 1 日起重新記，讓每一筆都對得起來。', 'An import from his old money app was built, yet Jay chose to leave it and start afresh from 1 November, so every entry adds up.'] }
];

// How the work itself is run (Jay's setup, not a date).
export const SETUP = [
  ['user', ['一個總指揮，加上好幾條同時進行的線', 'One coordinator and several threads at once'], ['Jay 跟一個「總指揮」講話，它把工作分給好幾條同時進行的線，每條線各負責一件事。', 'Jay talks to one coordinator, which hands work to several threads running at once, each owning one job.']],
  ['camera', ['全部自己在 iPhone 上試', 'Everything tested on his own iPhone'], ['不看程式碼，看實際用起來的樣子；每個抱怨都附截圖。', 'Not the code but how it feels to use; every complaint comes with a screenshot.']],
  ['spark', ['AI 只在你按了才跑', 'AI only runs when you tap'], ['App 裡的 AI 不會自己跑，費用和控制權都在使用者手上。', 'The apps’ AI never runs by itself, so cost and control stay with the person.']]
];

// The big changes, oldest first. `apps` are tree branch ids; `node` opens
// the matching branch of the structure tree; `ba` is a before/after picture.
export const CHANGES = [
  {
    date: '2026-09-04', icon: 'check', node: 'ship-tests', apps: ['class'],
    title: ['第一次有「自動檢查」', 'The first automatic checks'],
    p: ['每改一個地方，就可能弄壞另一個地方，而且要等到用的時候才發現。', 'Every change could quietly break something else, found only when using it.'],
    i: ['讓電腦在每次更新前自己跑一遍檢查，沒過就不准上線。', 'Have the computer run checks before every update; anything failing can’t go live.'],
    r: ['這個習慣後來變成全家族的規矩，現在有上千個檢查。', 'It became a family rule; there are now thousands of checks.']
  },
  {
    date: '2026-09-19', icon: 'cloud', node: 'cloud', apps: [],
    title: ['請一個雲端小幫手', 'A helper in the cloud'],
    p: ['App 直接去問各種資料來源，常被擋、很慢，而且密碼（金鑰）會露出來。', 'Apps asking data sources directly got blocked, were slow, and exposed their keys.'],
    i: ['把「跑腿」交給一個放在雲端的小程式：它幫每個 App 拿資料、藏好金鑰、把答案存起來共用。', 'Hand the errands to one small program in the cloud: it fetches for every app, hides the keys and shares answers.'],
    r: ['之後每一個新 App 都直接用它，不用從頭來。', 'Every later app used it from day one.']
  },
  {
    date: '2026-09-28', icon: 'key', node: 'pass', apps: [],
    title: ['變成一個家族：一張通行證、一盒零件', 'One family: one pass, one box of parts'],
    p: ['App 一多，每個都要各自登入、各自長一個樣子，改一個地方要改好幾次。', 'With more apps, each signed in on its own and looked its own way; one fix meant several.'],
    i: ['做一張所有 App 共用的通行證，和一盒所有 App 共用的零件（按鈕、視窗、載入畫面）。家族先叫 Quadra（四方），後來改名 Orbit。', 'One pass for every app, and one box of shared parts (buttons, sheets, the loading screen). The family was first called Quadra (四方), later Orbit.'],
    r: ['一組碼登入全部；改一個零件，所有 App 一起變好。', 'One code signs in everywhere; fix a part and every app improves.']
  },
  {
    date: '2026-10-05', icon: 'list', node: 'team-memory', apps: [],
    title: ['把規矩寫成一頁', 'The rules on one page'],
    p: ['Jay 說過的要求散在幾百則訊息裡，新的對話常常不知道。', 'Jay’s asks were scattered over hundreds of messages; a new session often didn’t know them.'],
    i: ['寫一頁「真相」：Jay 怎麼工作、什麼最重要。每個 App 的說明都先叫你讀它。', 'Write one page of truth: how Jay works and what matters most. Every app’s notes point there first.'],
    r: ['同一個錯不用講第二次。', 'The same mistake doesn’t need saying twice.']
  },
  {
    date: '2026-10-13', icon: 'backpack', node: 'store', apps: [],
    title: ['資料搬進雲端倉庫', 'Data moves into a cloud store'],
    p: ['公車路線、法規這些大資料放在網頁主機上，越來越大、越來越慢。', 'Big data like bus routes and laws lived with the web pages and kept growing slower.'],
    i: ['搬進 Cloudflare 的雲端倉庫（R2），離台灣近，而且只在內容真的變了才重新寫。', 'Move it into Cloudflare’s store (R2), close to Taiwan, rewritten only when it really changes.'],
    r: ['每個 App 讀同一份，手機只下載變了的部分。', 'Every app reads one copy; phones fetch only what changed.']
  },
  {
    date: '2026-10-14', icon: 'spark', node: 'kit-look', apps: [],
    title: ['所有 App 換上同一套設計', 'One design for every app'],
    p: ['九個 App 各自發展，按鈕、顏色、字的大小都不一樣，看起來不像一家人。', 'Grown apart, the apps had different buttons, colours and type; they didn’t look related.'],
    i: ['照 iPhone 最新的設計語言做一套共用的顏色、字、玻璃質感和動畫，每個 App 只保留自己的主色。', 'One shared set of colours, type, glass and motion after the newest iPhone look; each app keeps only its own colour.'],
    r: ['打開任何一個都知道是 Orbit。', 'Open any of them and you know it’s Orbit.']
  },
  {
    date: '2026-10-20', icon: 'target', node: 'ship-tools', apps: [],
    title: ['一個專抓醜東西的檢查員', 'An inspector for ugly details'],
    p: ['Jay 在 iPhone 上一直看到同樣的問題：字被切掉、名字斷行、鍵盤把畫面推走、載入畫面掀開時還在跳。', 'Jay kept seeing the same things on his iPhone: cut numbers, names wrapping, the keyboard pushing the screen, the loading screen lifting onto a page still jumping.'],
    i: ['把每一個抱怨寫成檢查，每次更新都在 iPhone 用的 Safari 引擎上自動看過每一頁。', 'Turn each complaint into a check that looks at every page in Safari’s engine on every update.'],
    r: ['同樣的醜東西不會再回來；同一天也讓 App 在慢網路上快很多。', 'The same ugliness can’t come back; the same day made apps much faster on slow connections.']
  },
  {
    date: '2026-10-21', icon: 'shield', node: 'team-lessons', apps: ['law'],
    title: ['一次差點失去兩萬多筆判決', 'Nearly losing 21,927 rulings'],
    p: ['有一次從一份舊的副本推更新上去，把 21,927 筆最高法院判決和其他人的進度一起蓋掉了。', 'Once an update pushed from an old copy wrote over 21,927 top-court rulings and others’ work.'],
    i: ['救回來之後定下規矩：每次推之前一定先拿最新版本合在一起。後來還加了每晚備份和 30 天內任何版本都能找回。', 'After recovering it, a rule: always sync with the newest version right before pushing. Nightly backups and 30 days of versions came later.'],
    r: ['從此每一次推更新之前都先同步。', 'Since then every push syncs first.']
  },
  {
    date: '2026-10-22', icon: 'cloud', node: 'weather-typhoon', apps: ['weather'], ba: 'ba-rain',
    title: ['颱風來了：放不放假？', 'A typhoon: is tomorrow off?'],
    p: ['颱風天大家都在猜明天要不要上班上課，各縣市又在不同時間宣布。', 'On typhoon days everyone guesses whether tomorrow is off, and counties announce at different times.'],
    i: ['用 2019 到 2026 年 68 個颱風真正的停班停課決定，配上氣象署的路徑預報，算出每個縣市放假的機率；一宣布就直接用官方答案。同一天天氣圖表也重畫，更好讀。', 'Fit 68 storms’ real day-off decisions (2019–2026) to CWA’s track forecast for a chance in every county; once announced, the official word. The same day the weather charts were redrawn to read better.'],
    r: ['宣布放假後，每個 App 都把那天當假日：課表不排課、股市照收盤。', 'Once a day off is announced every app treats it as a holiday: no classes, markets closed.']
  },
  {
    date: '2026-10-23', icon: 'spark', node: 'kit', apps: [],
    title: ['正式改名 Orbit', 'Officially Orbit'],
    p: ['原本的家族名 Quadra（四方）是四個 App 時取的，現在已經九個了。', 'The old family name Quadra (四方, “four sides”) came from when there were four apps; now there were nine.'],
    i: ['全家族改名 Orbit：App、通行證、網址、零件一起改。那兩天也把每個 App 的日期選擇統一成一個，浮在畫面上的按鈕改成貼底的一條。', 'Rename the whole family Orbit: apps, pass, addresses and parts. Around the same time every app got one date picker, and floating buttons became one bar along the bottom.'],
    r: ['一個名字、一套操作。', 'One name, one way of doing things.']
  },
  {
    date: '2026-10-23', icon: 'user', node: 'kit-look', apps: [], ba: 'ba-ipad',
    title: ['只做手機', 'Phones only'],
    p: ['iPad 和電腦的版面一直壞：按鈕蓋住內容、卡片排不整齊，修一個又壞一個。', 'iPad and computer layouts kept breaking, buttons covering content and cards out of line; fixing one broke another.'],
    i: ['Jay 決定：這些 App 是給手機用的，只做手機的版面；在大螢幕上就是中間一條手機寬的欄位。', 'Jay decided these are phone apps: one phone layout only, shown as a phone-wide column on bigger screens.'],
    r: ['少做一件事，剩下的每件事都做得更好。（這個展示頁是唯一的例外，因為老師多半用電腦看。）', 'Doing one thing less made everything else better. (This showcase is the one exception: teachers mostly use laptops.)']
  },
  {
    date: '2026-10-23', icon: 'star', node: 'kit-brand', apps: [], ba: 'ba-icons',
    title: ['更大膽的圖示和分享卡', 'Bolder icons and share cards'],
    p: ['分享連結時跳出的卡片字太小、太擠，在聊天裡根本看不清楚。', 'The card shown when sharing a link had small, crowded text, unreadable in a chat.'],
    i: ['每個 App 一個自己的顏色和一個大大的白色符號；分享卡只放圖示、名字和一句話。', 'Each app gets its own colour and a big white symbol; a share card holds only the icon, the name and one line.'],
    r: ['在聊天室裡一眼就認得出是哪個 App。', 'Recognisable at a glance in any chat.']
  },
  {
    date: '2026-10-27', icon: 'shield', node: 'pass-safe', apps: [],
    title: ['資料絕對不會不見', 'Data that can’t be lost'],
    p: ['記帳 App 要放的是真正的錢，資料一壞就麻煩了。', 'The money app holds real money; losing data there would really hurt.'],
    i: ['每次覆蓋前先存舊版本、每晚整個備份到雲端倉庫、資料庫本身也能回到 30 天內任何一分鐘。', 'Keep the old version before every overwrite, back everything up nightly, and let the database go back to any minute in 30 days.'],
    r: ['做新 App 之前先把安全網鋪好。', 'The safety net went in before the new app did.']
  }
];

// Each app's first day, from git (scripts/stats.mjs gives the same `first`).
// `was` is the name it started under, when it had another.
export const BIRTHS = [
  { id: 'class', date: '2026-08-26', was: 'Orbit Color' },
  { id: 'words', date: '2026-09-10' },
  { id: 'sports', date: '2026-09-18', was: 'Match Find' },
  { id: 'securities', date: '2026-09-26', was: 'Stock Study' },
  { id: 'weather', date: '2026-10-02' },
  { id: 'transit', date: '2026-10-03' },
  { id: 'beats', date: '2026-10-12', was: 'Passion Beats' },
  { id: 'law', date: '2026-10-18' },
  { id: 'money', date: '2026-10-27' }
];

// How a day of work goes: the loop, then a few real days.
export const LOOP = [
  ['user', ['在 iPhone 上用', 'Use it on the iPhone'], ['Jay 把 App 加到主畫面，像一般 App 一樣每天用。', 'Jay keeps the apps on his home screen and uses them daily.']],
  ['camera', ['看到不對就截圖', 'Screenshot what’s off'], ['字被切掉、數字不對、太慢，截圖加一句話傳出去。', 'A cut word, a wrong number, too slow: a screenshot and one line.']],
  ['spark', ['Claude 找原因、修好', 'Claude finds the cause and fixes it'], ['先找真正的原因，再修；修完自己在 Safari 引擎上看過。', 'Find the real cause first, fix it, then look at it in Safari’s engine.']],
  ['check', ['自動檢查', 'Automatic checks'], ['上千個檢查都過了才能上線。', 'Thousands of checks must pass first.']],
  ['send', ['自己上線', 'Live by itself'], ['推上去就自動發布，下次打開 App 就是新的。', 'A push publishes itself; the next open has the fix.']]
];

export const DAYS = [
  {
    date: '2026-08-26', icon: 'school',
    title: ['上 GitHub 的第一天', 'First day on GitHub'],
    line: ['下午四點多上傳 Orbit Color；晚上讀照片失敗、退回；凌晨三點多改用 AI，成功。', 'Orbit Color uploaded just before 5 p.m.; photo reading failed that evening and was rolled back; by 3 a.m. AI had solved it.']
  },
  {
    date: '2026-10-18', icon: 'flame',
    title: ['最忙的一天', 'The busiest day'],
    line: ['Orbit Law 誕生、法院判決每晚自動補進來、問法律可以存對話；整個家族一天有 403 次更新。', 'Orbit Law was born, court rulings started filling in nightly, Ask Law kept chats; 403 updates across the family in one day.']
  },
  {
    date: '2026-10-22', icon: 'cloud',
    title: ['颱風天', 'Typhoon day'],
    line: ['颱風真的來了：當天做出放假機率、各縣市的宣布即時更新，隔天每個 App 都認得颱風假。', 'A real typhoon came: day-off chances built that day, county announcements followed live, and by the next day every app knew a typhoon day off.']
  }
];

// Complaints that became rules for every app (from the family's rules page).
export const RULES = [
  ['clock', ['載入畫面要等內容都好了才掀開', 'The loading screen lifts only when the page is ready']],
  ['camera', ['真的隊徽和大頭照，不要用字母方塊', 'Real logos and faces, never letter tiles']],
  ['moon', ['深色模式不能有刺眼的白色', 'Nothing glaring white in dark mode']],
  ['pencil', ['鍵盤不能把畫面推走', 'The keyboard never pushes the screen away']],
  ['bars', ['名字太長要縮小，不要醜醜地斷行', 'Long names shrink, never wrap badly']],
  ['wind', ['慢的時候不要怪網路', 'Never blame the network for being slow']],
  ['user', ['絕對不編造使用者的資料', 'Never make up anyone’s data']],
  ['flag', ['球隊用中文，球員用英文原名', 'Teams in Chinese, players in their own names']],
  ['bike', ['規劃路線一定把 YouBike 當備案', 'Every trip plan keeps YouBike as a fallback']],
  ['cloud', ['颱風假在每個 App 都算放假', 'A typhoon day off counts as a holiday in every app']]
];
