// The structure tree's app branches: for each app, what it is, where it
// does better than the raw data it reads (the logic of its own), how it
// stays under the limits of what it reads, what makes it quick, and the
// owner's own calls. Every node is plain words first: the problem, the idea,
// what came of it; the names of things only in `tech` (技術細節).
//
// A node: { id, icon, title, line, p, i, r, tech, links, kids }, each text a
// [zh, en] pair. `links` are other nodes' ids (tree.mjs checks them all).

const n = (id, icon, title, line, more = {}) => ({ id, icon, title, line, ...more });

const sports = n('sports', 'ball', ['Orbit Sports', 'Orbit Sports'], ['在台灣看得到的比賽：比分、賽程、哪一台在播', 'Games you can watch in Taiwan: scores, schedules, which channel'], {
  app: 'match',
  p: ['比賽資訊散在十幾個網站，而且很多比賽台灣根本看不到。', 'Game info is spread over a dozen sites, and many games can’t even be watched in Taiwan.'],
  i: ['只放愛爾達和 Apple TV 有轉播的聯賽，比分、排名、轉播台放在同一個地方，還幫你排好今晚要看哪幾場。', 'Only leagues on ELTA or Apple TV here, with scores, tables and channels in one place, plus a plan for tonight.'],
  r: ['打開就知道現在有什麼好看、在哪一台。', 'Open it and you know what’s worth watching and where.'],
  kids: [
    n('sports-ai', 'ai', ['問比賽、賽後三句話', 'Ask, and three lines after'], ['AI 只說卡片上沒有的', 'AI says only what the card doesn’t'], {
      p: ['比分卡片已經寫了誰贏、誰得最多分，AI 再講一次只是浪費時間。', 'The score card already says who won and who scored most; AI saying it again wastes your time.'],
      i: ['程式先讀出比賽的故事（逆轉、連續得分、哪一節拉開），AI 只用三句話講卡片上沒有的；F1 每場正賽的勝負關鍵，一列一圈，配車手的臉；「問比賽」讓 AI 從 App 讀到的排名、賽程和比分裡挑表回答，數字都是 App 的。', 'Code reads the game’s story first (comebacks, runs, the period that broke it open), and AI writes three lines on what the card doesn’t show; each F1 race’s deciding moments, a row a lap with the driver’s face; “Ask about your teams” lets AI pick from the tables the app read (places, next and last games, today) and every number is the app’s.'],
      r: ['看完比分就懂這場為什麼這樣打，球員是大頭照、球隊有隊徽，點了就打開。', 'After the score you know why it went that way; players as faces and teams with logos, each opening its page.'],
      tech: ['賽後一句話和看點在第一個人打開時才做（Orbit-Core ai-open.js），之後大家共用；/ai 的 sports-ask；kit aiAnswer 把答案畫成列。', 'The why-it-ended line and the preview are made when the first person opens the game (Orbit-Core ai-open.js), then shared; /ai’s sports-ask; kit aiAnswer draws answers as rows.'],
      links: ['ai']
    }),
    n('sports-own', 'spark', ['比原始資料更快、更準', 'Better than the raw feed'], ['我們自己算的部分', 'What we work out ourselves'], {
      kids: [
        n('sports-table', 'trophy', ['排名自己算', 'Tables counted ourselves'], ['比賽一結束，排名就變', 'The table moves the moment a game ends'], {
          p: ['ESPN 的排名表要等好一陣子才更新，比賽打完了排名還是舊的。', 'ESPN’s tables update a while after a game, so they show the old order.'],
          i: ['拿已經結束的比賽比分，自己重算排名，還算出最快哪一天能封王、還差什麼。', 'Count the table ourselves from finished results, and work out the soonest a title can be won and what it takes.'],
          r: ['比賽一結束排名馬上更新，像「再贏 3 場封王」這種話一行就說清楚。', 'Tables update at the final whistle, and “3 more wins clinches it” fits on one line.'],
          tech: ['lib/title.mjs 的 liveTable、liveRacing、freshStandings：只算已完賽的比賽；棒球、籃球用魔術數字；F1 用剩餘分數。', 'lib/title.mjs liveTable, liveRacing, freshStandings: finals only; magic numbers for baseball and basketball; points left for F1.'],
          links: ['sports-final', 'store-layers']
        }),
        n('sports-final', 'check', ['比賽結束看規則，不等 ESPN', 'Over by the rules, not by ESPN'], ['九局下主隊領先就是結束了', 'Home side ahead in the bottom of the 9th means it’s over'], {
          p: ['來源有時比賽打完了還寫「進行中」。', 'A feed sometimes still says a game is on after it ended.'],
          i: ['照每種運動的規則判斷比賽是否結束（例如棒球九局下主隊領先、籃球第四節時間到）。', 'Decide by each sport’s rules whether a game is over (home side ahead in the bottom of the 9th, the clock out in the 4th).'],
          r: ['完賽標示和賽果通知都不用等來源改狀態。', 'The final tag and the result notice don’t wait for the feed.'],
          tech: ['kit 的 overByRule；推播檢查在規則說快結束時提早詢問。', 'The kit’s overByRule; the push check asks early when the rules say the end is near.'],
          links: ['sports-push']
        }),
        n('sports-soccer', 'target', ['足球勝率模型', 'Our own soccer win chance'], ['每一場足球都有即時勝率', 'Every soccer game gets a live win chance'], {
          p: ['冷門盃賽根本沒有任何勝率可看；有的勝率又會卡住：比賽 85 分鐘 1 比 1，還顯示一隊 77%。', 'Small cup games had no win chance at all, and some figures froze: 1–1 at 85 minutes still showed one side at 77%.'],
          i: ['自己算：每隊剩下時間還會進幾球，用比分、比賽分鐘數和紅牌推算；賽前的外界預估只用來決定兩隊強弱。', 'Work it out ourselves: how many goals each side may still score in the time left, from the score, the minute and red cards; the pre-game estimate only sets how strong each side is.'],
          r: ['每一場都有勝率走勢圖，晚段平手會合理地偏向和局。', 'Every game has a win-chance chart, and a late level game leans to a draw as it should.'],
          tech: ['lib/soccerwp.mjs：剩餘時間的進球數用卜瓦松分布（Poisson），速率來自賽前的外界預估。', 'lib/soccerwp.mjs: goals left as a Poisson count, the rate from the pre-game estimate.']
        }),
        n('sports-chance', 'chart', ['勝率不只聽一家', 'A win chance from more than one voice'], ['跟外界看法一致', 'Agrees with the wider world'], {
          p: ['ESPN 自己的模型在開季沒幾場時，會跟大家的看法唱反調（76人 59%，其實大家看好活塞）。', 'ESPN’s own model early in the season can disagree with everyone else (76ers 59% while the Pistons were the clear favourite).'],
          i: ['先用外界的市場預估，沒有才用 ESPN 的模型；足球再加上我們自己的模型。', 'Use market estimates first, ESPN’s model only when there are none, and our own model for soccer.'],
          r: ['看到的熱門隊伍跟真實世界一致。', 'The favourite you see is the real world’s favourite.'],
          tech: ['espn.mjs parseSummary 的 predict；sheets.js winCard 依固定順序挑來源，最後才用 ESPN。', 'espn.mjs parseSummary predict; sheets.js winCard picks sources in a fixed order, ESPN last.']
        }),
        n('sports-lineups', 'user', ['先發名單換來源', 'Starters from another source'], ['賽前就看得到先發', 'Starters before the game'], {
          p: ['ESPN 的資料介面拒絕我們的雲端伺服器，NBA 先發又要到開賽才標。', 'ESPN’s data API refuses our cloud server, and marks NBA starters only at tip-off.'],
          i: ['改讀 RotoWire 的預計先發；還沒公布就用上一場的先發，或球隊的深度表。', 'Read RotoWire’s expected lineups; before they post, last game’s five or the team’s depth chart.'],
          r: ['每一場比賽賽前都有先發陣容卡。', 'Every game has a starters card before it starts.'],
          tech: ['代理的 trimRotowireNba；lib/lineups.mjs；ESPN depthcharts 作為後備。', 'The proxy’s trimRotowireNba; lib/lineups.mjs; ESPN depth charts as the fallback.']
        }),
        n('sports-home-league', 'flag', ['補上球隊的國內聯賽', 'A club’s home league added'], ['歐洲盃賽球隊也看得到國內排名', 'Cup clubs show their home table too'], {
          p: ['波蘭的 Lech 只出現在歐霸，ESPN 根本沒有波蘭聯賽。', 'Poland’s Lech appears only in the Europa League; ESPN has no Polish league at all.'],
          i: ['從 FotMob 找到這支球隊，補上它國內聯賽的排名和賽程。', 'Find the club on FotMob and add its home league’s table and games.'],
          r: ['點進任何球隊，都知道它在國內排第幾。', 'Any club page says where it stands at home.'],
          tech: ['代理的 fotmob-team 修剪；espn.mjs clubAbroad。', 'The proxy’s fotmob-team trim; espn.mjs clubAbroad.']
        }),
        n('sports-push', 'bell', ['賽果通知兩分鐘內到', 'Results within two minutes'], ['App 關著也會收到', 'Even with the app closed'], {
          p: ['以前賽果通知常常晚十五分鐘以上。', 'Result notices used to come fifteen minutes late or more.'],
          i: ['雲端每兩分鐘檢查一次；照最短的比賽長度開始問，規則說快結束時提早問。', 'The cloud checks every two minutes, starting at a game’s shortest length and early when the rules say the end is near.'],
          r: ['終場後大約兩分鐘就收到。', 'You hear about it about two minutes after the end.'],
          tech: ['push.js 在偶數分鐘的排程上；每場比賽每次只問 ESPN 一次（memo）；picks.mjs SHORTEST。', 'push.js on the even-minute cron; one ESPN ask per game per run (memo); picks.mjs SHORTEST.'],
          links: ['cloud-push']
        }),
        n('sports-picks', 'star', ['幫你排今晚的觀賽計畫', 'Tonight’s viewing plan'], ['挑出不撞時間的好比賽', 'Good games that don’t clash'], {
          p: ['同一晚有十幾場比賽，不知道該看哪場。', 'A dozen games a night, and no idea which to watch.'],
          i: ['依你追蹤的隊伍、比賽品質、勢均力敵、爭冠意義、名氣和你的習慣打分，再挑出不互相撞時間的。不同運動開賽相差 30 分鐘以上就不算撞。', 'Score games by your teams, quality, closeness, stakes, fame and habit, then pick ones that don’t clash; two sports clash only within 30 minutes.'],
          r: ['首頁就是一份今晚的計畫；凌晨 0 到 5 點的比賽不推薦。', 'The home tab is tonight’s plan; nothing from midnight to 5 a.m. is recommended.'],
          tech: ['lib/picks.mjs rank、clash；lib/foryou.mjs 的喜好分數。', 'lib/picks.mjs rank and clash; lib/foryou.mjs affinity.']
        }),
        n('sports-breaks', 'clock', ['每一種中斷都有倒數', 'A countdown for every break'], ['中場、暫停、局間', 'Half-time, timeouts, between innings'], {
          p: ['轉播進廣告，不知道要等多久。', 'The broadcast cuts to ads and you don’t know for how long.'],
          i: ['依各聯盟規則記下每種中斷的長度（NBA 每節前兩次暫停是強制的 2 分 45 秒）。', 'Keep each league’s rule for every break (the NBA’s first two timeouts a quarter are mandatory, 2:45).'],
          r: ['畫面上直接倒數。', 'A countdown right on screen.'],
          tech: ['kit orbit.mjs breakOf、watchBreak。', 'The kit’s orbit.mjs breakOf, watchBreak.']
        }),
        n('sports-f1', 'flag', ['F1 即時看板', 'F1’s live board'], ['車子在賽道圖上跑', 'Cars moving on the track map'], {
          p: ['一般比分 App 只看得到名次。', 'Score apps only show positions.'],
          i: ['讀 F1 官方的即時計時，每台車照自己的速度在賽道圖上移動，比較車手圈速、輪胎和勝率。賽事指揮的訊息照規則翻成中文。', 'Read F1’s own live timing: each car moves on the map at its own pace; compare drivers’ laps, tyres and win chance. Race control is put into Chinese by rule.'],
          r: ['像看轉播的資訊圖一樣。', 'Like the broadcast’s own graphics.'],
          tech: ['代理的 f1-live.orbit（now/session/laps/circuit）、Durable Object F1Log 記每一圈；lib/carpace.mjs、racecontrol.mjs。', 'The proxy’s f1-live.orbit (now/session/laps/circuit), Durable Object F1Log logging laps; lib/carpace.mjs, racecontrol.mjs.']
        })
      ]
    }),
    n('sports-career', 'user', ['球員的生涯', 'A player’s career'], ['選秀、待過的球隊、歷年數據', 'Draft, every team, each season'], {
      p: ['球員頁只有今年的數字，看不出他是誰、從哪裡來。', 'A player’s page had only this year’s numbers, not who he is or where he came from.'],
      i: ['每一種運動的球員和車手頁加上選秀、初登場、年資、待過的每一支球隊（年份、季數、出賽數，租借也算）、榮譽和歷年數據；球隊那一列點了就打開那支球隊。', 'Every sport’s player and driver page gains the draft, debut, years, each team with its years, seasons and games (loans too), honours and season by season; a team’s row opens that team.'],
      r: ['一頁看完一個球員的整個生涯。', 'A whole career on one page.'],
      tech: ['lib/career.mjs，打開頁面後在背景讀：NBA、MLB 從 ESPN，足球從 FotMob（名字和球隊對上、生日再確認），F1 從 Jolpica；中職沒有球員資料來源，所以沒有。', 'lib/career.mjs, read behind the page: NBA and MLB from ESPN, football from FotMob (matched by name and club, birthday checked), F1 from Jolpica; CPBL has no player source, so none there.'],
      links: ['sports-data']
    }),
    n('sports-limits', 'shield', ['省著用、不被擋', 'Thrifty, never blocked'], ['不超過來源的額度', 'Under every source’s limits'], {
      kids: [
        n('sports-today', 'calendar', ['一天的比分一次給', 'A whole day in one answer'], ['十幾個聯盟變成一個答案', 'A dozen leagues become one answer'], {
          p: ['打開首頁要讀十幾個聯盟，慢又浪費。', 'The home tab needed a dozen league reads: slow and wasteful.'],
          i: ['雲端把一天所有聯盟整理成一個答案，存 60 秒給所有人共用；沒人打開就不做。', 'The cloud builds the whole day once and shares it for 60 s; nothing runs while nobody opens the app.'],
          r: ['首頁一次讀完，雲端也少做很多事。', 'One read for the home tab, and far less work in the cloud.'],
          tech: ['GET /sports-today?day=；sports-today.js；手機和雲端用同一個解析程式 kit/sports-espn.mjs。', 'GET /sports-today?day=; sports-today.js; one parser for phone and cloud, kit/sports-espn.mjs.'],
          links: ['kit-shared-logic', 'cloud-proxy']
        }),
        n('sports-kept', 'backpack', ['打完的比賽永久保存', 'Finished games kept for good'], ['第一個人讀到就存起來', 'Kept the first time anyone reads it'], {
          p: ['已經結束的比賽一直重問來源，浪費又可能被限流。', 'Asking the source again and again for finished games wastes calls and risks being cut off.'],
          i: ['比賽、一天或一個月全部結束後，第一個人讀到就存進雲端倉庫，之後所有人讀這份。', 'Once a game, day or month is all over, the first read is kept in cloud storage and everyone reads that copy.'],
          r: ['舊比賽秒開，來源也不會被問爆。', 'Old games open instantly and the source is never flooded.'],
          tech: ['sports.js settleable、readKept；R2 mirror/；builders/kept.js 每晚整理。', 'sports.js settleable, readKept; R2 mirror/; builders/kept.js nightly.'],
          links: ['store-r2']
        }),
        n('sports-f1-kept', 'history', ['F1 歷史先收好', 'F1 history saved ahead'], ['官方存檔關了也打得開', 'Opens even with F1’s archive shut'], {
          p: ['F1 官方存檔不開放了，另一個來源 OpenF1 又會擋常來問的人。', 'F1’s archive is shut, and the other source, OpenF1, turns away frequent askers.'],
          i: ['每 20 分鐘排程一次，把結束的賽段一節一節存起來，每次最多 12 分鐘。', 'Every 20 minutes a job keeps finished sessions one by one, 12 minutes a run.'],
          r: ['任何一節的數據和每一圈都還打得開。', 'Every session’s data and laps still open.'],
          tech: ['builders/f1kept.js（每小時 :06、:26、:46）；取消的賽段跳過。', 'builders/f1kept.js (:06, :26, :46); called-off sessions skipped.']
        }),
        n('sports-direct', 'swap', ['被擋的來源改由手機讀', 'Phone reads blocked sources'], ['中職賽程照樣讀得到', 'CPBL schedules still come through'], {
          p: ['TheSportsDB 的免費額度對雲端伺服器（很多人共用的位址）一問就拒絕。', 'TheSportsDB’s free key refuses cloud servers, which share addresses with many others.'],
          i: ['改由每支手機自己去讀，結果記在手機上；ESPN 的另一個資料介面也一樣直接由手機讀。', 'Each phone reads it itself and keeps the result; ESPN’s other data API is read from the phone too.'],
          r: ['中華職棒的賽程不會因為雲端被擋而消失。', 'CPBL schedules don’t vanish when the cloud is refused.'],
          tech: ['catalog directKept；kit proxyJson 直接讀 sports.core.api.espn.com（它開放跨網域）。', 'catalog directKept; kit proxyJson reads sports.core.api.espn.com straight (it is CORS-open).']
        }),
        n('sports-trims', 'list', ['只拿需要的部分', 'Only the parts we use'], ['大頁面修剪成小答案', 'Big pages trimmed small'], {
          p: ['來源的一頁常常很大，手機只用到一小部分。', 'A source’s page is often big, and the phone uses a small part.'],
          i: ['雲端先把答案修剪成 App 會讀的欄位再傳。', 'The cloud trims an answer to the fields the app reads before sending it.'],
          r: ['在慢速網路上也很快。', 'Quick even on a slow connection.'],
          tech: ['&trim= 修剪：ESPN、Jolpica、FotMob、愛爾達、YouTube、formula1.com。', '&trim= for ESPN, Jolpica, FotMob, ELTA, YouTube, formula1.com.'],
          links: ['cloud-proxy']
        })
      ]
    }),
    n('sports-live', 'live', ['比分怎麼到你的畫面', 'How a score reaches your screen'], ['數字原地更新，不閃', 'Numbers change in place, no flicker'], {
      p: ['一直重畫整頁會閃，也耗電。', 'Redrawing the page flickers and burns battery.'],
      i: ['進行中的列表每 5 秒、打開的比賽每 3 秒讀一次，只改有變的數字；更新速度是 Jay 在管理頁設定的。', 'Lists every 5 s, an open game every 3 s, changing only the numbers that moved; Jay sets the speeds in his admin page.'],
      r: ['比分最多比 ESPN 晚幾秒，畫面不跳。', 'At most a few seconds behind ESPN, and the screen never jumps.'],
      tech: ['morph 原地更新；DEV 速度（sportsList 5 s、sportsGame 3 s）由 /config 提供；代理即時資料保留 2 秒。', 'morph in place; DEV speeds (sportsList 5 s, sportsGame 3 s) from /config; the proxy keeps live data 2 s.'],
      links: ['fast-morph', 'cheap-speeds']
    }),
    n('sports-data', 'tv', ['資料從哪裡來', 'Where the data comes from'], ['十幾個來源', 'A dozen sources'], {
      tech: ['ESPN（比分、球員、排名）、MLB 官方、中華職棒官網和 TheSportsDB、F1 即時計時、Jolpica（F1 歷史）、FotMob、外界勝率預估、愛爾達節目表、NBA.com 愛爾達轉播表、Apple TV、YouTube 精華、RotoWire。全部經過雲端代理。', 'ESPN (scores, players, tables), MLB, CPBL’s site and TheSportsDB, F1 live timing, Jolpica (F1 history), FotMob, outside win estimates, ELTA’s guide, NBA.com’s ELTA list, Apple TV, YouTube highlights, RotoWire. All through the cloud proxy.'],
      links: ['cloud-proxy', 'store-r2']
    }),
    n('sports-calls', 'pencil', ['Jay 的決定', 'Jay’s calls'], ['像真的觀眾一樣想', 'Thinking like a real viewer'], {
      tech: ['只放台灣看得到的聯賽；球隊用中文、球員和車手用英文原名（機器翻的「勒布朗·詹姆斯」很怪）；不放新聞也不放 AI；延期的比賽點了不開；過去的比賽頁只顯示那一刻。', 'Only leagues Taiwan can watch; teams in Chinese, players and drivers in their own English names (a machine’s Chinese spelling of LeBron James reads oddly); no news and no AI; a postponed game opens nothing; a past game shows only its own moment.']
    })
  ]
});

const transit = n('transit', 'bus', ['Orbit Transit', 'Orbit Transit'], ['全台公車、台鐵、高鐵、捷運和 YouBike', 'Buses, trains, metros and YouBike across Taiwan'], {
  app: 'transit',
  p: ['地圖 App 只比總時間，常推薦真人不會選的路線，颱風天還會規劃已經停駛的車。', 'Map apps compare total time only, suggest routes no one would take, and plan stopped trains on typhoon days.'],
  i: ['照一個人真正的移動方式來規劃和排名，再用即時資料一路導航。', 'Plan and rank the way a person really travels, then navigate with live data all the way.'],
  r: ['第一個推薦就是你會選的那條。', 'The first suggestion is the one you’d pick.'],
  kids: [
    n('transit-ai', 'ai', ['用說的查路線', 'Just say where you’re going'], ['下雨改搭車、這班為什麼慢', 'Rain-aware trips, why a train is late'], {
      p: ['規劃路線要一格一格選起點、終點和時間；下雨天還推薦騎 YouBike。', 'Planning meant picking start, end and time field by field; on a rainy day it still suggested a YouBike.'],
      i: ['說一句「明天早上八點從新竹車站到台北101」，簡單的由程式讀，有時間的交給 AI 讀成起點、終點和時間，先給你看懂了什麼再查；Weather 說路上會下雨，就把公車、捷運排在 YouBike 前面，淋雨的那段標一滴水；台鐵誤點時點「晚 N 分」看它現在在哪、什麼時候到你這站。', 'Say “tomorrow 8am from Hsinchu Station to Taipei 101”: plain phrases read by code, a time read by AI into from, to and when, shown as understood before searching; when Weather says rain is due, a bus or the metro goes before a YouBike, the wet legs marked with a drop; a late train’s “N min late” opens where it is now and when it reaches you.'],
      r: ['少打很多字，下雨天不會被叫去騎車。', 'Far less typing, and no bike ride into the rain.'],
      tech: ['/ai 的 transit-say（只讀成 from、to、時間）；手機上的家族筆記 weather.rain；lib/rain.mjs。', '/ai’s transit-say (only from, to and time); the phone’s family notebook weather.rain; lib/rain.mjs.'],
      links: ['ai', 'ai-family']
    }),
    n('transit-own', 'spark', ['比原始資料更快、更準', 'Better than the raw feed'], ['我們自己算的部分', 'What we work out ourselves'], {
      kids: [
        n('transit-rank', 'target', ['像人一樣排名', 'Ranked like a person would'], ['分鐘加上「麻煩成本」', 'Minutes plus a cost of bother'], {
          p: ['只比總時間的話，「公車轉公車」常常排第一，可是沒人想這樣搭。', 'By total time alone, bus-to-bus often wins, though nobody wants it.'],
          i: ['先收起真人不會選的方案，再用「分鐘＋麻煩」排序：在家多等一下只算三分之一；轉火車容易、轉公車像賭博；YouBike 10 分鐘不算什麼，超過 30 分鐘每分鐘算 4.5 倍。', 'Fold away what nobody would take, then order by minutes plus bother: waiting at home counts a third; changing onto a train is easy, onto a bus a gamble; 10 minutes on a YouBike is nothing, past 30 each minute counts 4.5×.'],
          r: ['Jay 真實的通勤被存成「判決」，排名改錯了測試就不會過。', 'Jay’s real trips are saved as verdicts; a ranking change that flips one fails the tests.'],
          tech: ['plan.mjs rank、scoreParts；tests/verdicts/；scripts/live.mjs --against HEAD 比較新舊排名。', 'plan.mjs rank, scoreParts; tests/verdicts/; scripts/live.mjs --against HEAD compares old and new.'],
          links: ['ship-tests']
        }),
        n('transit-rail', 'train', ['自己算火車路線', 'Our own train router'], ['台鐵、高鐵含轉車', 'TRA and HSR with changes'], {
          p: ['別人的規劃器常漏掉更快的火車組合。', 'Other planners miss faster train combinations.'],
          i: ['用公開時刻表自己算（一種叫「連接掃描」的演算法），和 Google、TDX 的方案並排比較。', 'Work it out from the public timetables (an algorithm called Connection Scan), side by side with Google’s and TDX’s.'],
          r: ['一定找得到最快的火車組合。', 'The fastest train combination is always found.'],
          tech: ['lib/rail.mjs Connection Scan；捷運另有自己的路線規劃。', 'lib/rail.mjs Connection Scan; the metro has its own router too.']
        }),
        n('transit-stopped', 'shield', ['停駛自己判斷', 'What isn’t running, worked out'], ['颱風天不會叫你去搭不存在的車', 'No ghost trains on typhoon days'], {
          p: ['颱風天，政府的時刻表資料還列著已經停駛的內灣線火車。', 'On a typhoon day the official timetable still listed Neiwan Line trains that weren’t running.'],
          i: ['讀營運單位公告的文字，分辨全線停駛、部分停駛、減班；路上看得到公車就算有開。', 'Read the operators’ notices and tell full stops from partial ones and fewer runs; a bus seen on the road counts as running.'],
          r: ['規劃會避開停駛的車，沒得搭時會說清楚哪幾線停了。', 'Plans avoid stopped services, and say which routes stopped when nothing is left.'],
          tech: ['lib/service.mjs；TDX Alert/News；代理 /transit/running 看路上有幾台車。', 'lib/service.mjs; TDX Alert/News; the proxy’s /transit/running counts buses on the road.'],
          links: ['kit-dayoff']
        }),
        n('transit-metro', 'map', ['自己畫的捷運圖', 'Our own metro map'], ['像車站牆上的路線圖', 'Like the map on the station wall'], {
          p: ['真實地圖上的捷運線彎彎曲曲，很難看懂。', 'On a real map metro lines twist and are hard to read.'],
          i: ['把每個城市的車站拉直成八個方向的路線圖；先在電腦上試很多次，挑交叉最少的版本。', 'Straighten each city’s stations into eight directions, trying many layouts ahead and keeping the one with fewest crossings.'],
          r: ['清楚的路線圖，上面看得到列車即時到站。', 'A clear map with trains arriving live.'],
          tech: ['metromap.mjs；scripts/metro-maps.mjs 預先算好 metro-drawings.mjs，路網變了手機才重算。', 'metromap.mjs; scripts/metro-maps.mjs precomputes metro-drawings.mjs; a phone redraws only when the network changes.']
        }),
        n('transit-nav', 'walk', ['導航自己往下一步走', 'Navigation that moves on by itself'], ['到站前一站就提醒', 'A buzz the stop before yours'], {
          p: ['定位會飄，導航常常以為你上車了或下車了。', 'GPS drifts, so navigation thinks you boarded or got off when you didn’t.'],
          i: ['兩次定位都說上車才算上車；錯過公車就換下一班；快遲到就提出準時的替代方案；App 被滑掉也能接著導航。', 'Two fixes must agree you boarded; a missed bus means the next; running late offers an on-time option; it resumes after the app is swiped away.'],
          r: ['一路跟著你，不會亂跳。', 'It follows the trip without jumping around.'],
          tech: ['nav.mjs、navlive.mjs、buzz.mjs；ot.nav.v1 存在手機上。', 'nav.mjs, navlive.mjs, buzz.mjs; ot.nav.v1 kept on the phone.']
        }),
        n('transit-chase', 'bike', ['騎 YouBike 追公車', 'Catch the bus by YouBike'], ['走路趕不上，就騎到前面幾站', 'Too late on foot? Ride ahead'], {
          p: ['走到站牌時公車剛好開走，下一班要等很久。', 'You reach the stop just as the bus leaves, and the next is a long wait.'],
          i: ['看即時資料裡那台車在哪，找它前面幾站中騎 YouBike 來得及、而且比它早 2 分鐘到的一站；早 3 分鐘以上到目的地才建議。導航中公車開走了也會問你要不要騎車追。', 'From where the bus really is now, find a stop further along its way you can reach by YouBike 2 minutes before it; suggested only when you arrive 3 or more minutes sooner. While navigating, it offers the chase once the bus has gone.'],
          r: ['任何路線都能用，全部從即時資料算，不寫死任何一條。', 'Any route, all from live data, nothing hard-coded.'],
          tech: ['lib/chase.mjs；TDX 的公車位置和到站預估。', 'lib/chase.mjs; TDX’s bus positions and estimates.'],
          links: ['transit-bike']
        }),
        n('transit-ticket', 'train', ['照你買的那班車規劃', 'Planned around your ticket'], ['TPASS 以外的台鐵、高鐵也行', 'Any TRA or HSR train, past TPASS'], {
          p: ['住在 TPASS 範圍內，規劃只會用月票能搭的車；可是有時候你已經買了高鐵票。', 'Inside a TPASS area plans kept to the pass’s trains, though sometimes you already hold an HSR ticket.'],
          i: ['輸入車次、選日期，或在查時刻按「用這班規劃路線」：整趟路線就繞著那一班車排，先準時到車站，下車後再接著走。', 'Type a train number and pick the day, or tap “Plan a trip on it” in Timetables: the whole trip is planned around that exact train, to its station in time and on from where it gets in.'],
          r: ['買了票的那班車，就是規劃裡的那班車。', 'The train on your ticket is the train in your plan.'],
          tech: ['lib/ticket.mjs、planner.mjs planTicket；車次從已經載入的時刻表找，不多讀資料。', 'lib/ticket.mjs, planner.mjs planTicket; the train found in the timetable already loaded, no extra read.'],
          links: ['transit-rail']
        }),
        n('transit-aboard', 'bus', ['從你正在搭的車規劃', 'Plans from the ride you’re on'], ['不會從軌道中間叫你走路', 'Never a walk from the middle of the track'], {
          p: ['在火車或公車上按規劃，App 會從你現在的位置走路出發，好像你站在鐵軌上。', 'Planning while on a train or bus started with a walk from where you were, as if you stood on the track.'],
          i: ['最近幾分鐘的定位如果是火車或公車的速度、沿著路線走，就找出你在哪一班車上，從它接下來的站規劃。', 'If the last few minutes of fixes move at a train’s or bus’s pace along its line, it finds which run you’re on and plans from its stops ahead.'],
          r: ['在車上也能直接問「怎麼回家」。', 'You can ask the way home while still on board.'],
          tech: ['lib/aboard.mjs（trainAboard：時刻表加上 TDX 的誤點）。', 'lib/aboard.mjs (trainAboard: the timetable plus TDX’s delay).'],
          links: ['transit-nav']
        }),
        n('transit-book', 'train', ['高鐵訂票一鍵到', 'HSR booking in one tap'], ['車次已經幫你填好', 'The train already filled in'], {
          p: ['規劃好要搭的高鐵，還要再打開高鐵 App 重新選站、選時間。', 'With an HSR ride planned, you still had to open the HSR app and pick the stations and time again.'],
          i: ['行程裡的高鐵旁邊有「高鐵訂票」，直接打開高鐵自己的 App（T Express）或網站，起訖站和時間都已經填好。', 'An HSR ride in a plan carries “Book on THSR”: it opens THSR’s own app (T Express) or site with the stations and time already filled in.'],
          r: ['從規劃到訂票，少了一整段重打。', 'From plan to ticket without typing it all again.'],
          tech: ['Orbit-Core /transit/book（TDX 訂票導訂連結，0 點）；Transit book.mjs 的小表單用真的連結，讓 iOS 能直接開 App。', 'Orbit-Core /transit/book (TDX’s booking hand-off link, 0 points); Transit book.mjs’s small sheet uses real links so iOS can open the app.']
        }),
        n('transit-bike', 'bike', ['YouBike 一定有車', 'YouBike with real bikes'], ['不會叫你去空站', 'Never sends you to an empty dock'], {
          p: ['規劃器會建議「附近的 YouBike 站」，到了卻沒車。', 'Planners suggest a nearby YouBike dock that turns out to be empty.'],
          i: ['YouBike 一定接真實站點；從腳踏車出發時只選現在有車的站；租借計時到 25 分鐘提醒（TPASS 前 30 分鐘免費）。', 'YouBike legs always end at real docks; starting on a bike, only docks with bikes now; the timer warns at 25 minutes (TPASS’s free half hour).'],
          r: ['騎車是可靠的備案，不是賭運氣。', 'Biking is a reliable fallback, not a gamble.'],
          tech: ['bike.mjs、rental.mjs、tpass.mjs；過頭前溪走最近的橋（rivers.mjs）。', 'bike.mjs, rental.mjs, tpass.mjs; rivers crossed by the nearest bridge (rivers.mjs).']
        })
      ]
    }),
    n('transit-limits', 'shield', ['省著用、不被擋', 'Thrifty, never blocked'], ['付費的地圖服務只在需要時用', 'Paid maps only when needed'], {
      kids: [
        n('transit-packs', 'backpack', ['公車資料每週打包', 'Bus data packed weekly'], ['附近的站在手機上算', 'Nearby stops worked out on the phone'], {
          p: ['每次查附近站牌都問雲端，又慢又費額度。', 'Asking the cloud for nearby stops every time is slow and costly.'],
          i: ['每個城市的路線、站牌、時刻表一週打包一次放雲端倉庫，手機讀了自己算。', 'Each city’s routes, stops and timetables are packed weekly into cloud storage; the phone works the rest out itself.'],
          r: ['地圖一移動附近站牌就出現。', 'Nearby stops appear as the map moves.'],
          tech: ['builders/buses.js 寫 bus/、shape/；packs.mjs、near.mjs、shapes.mjs 用 kit packJson 讀。', 'builders/buses.js writes bus/ and shape/; packs.mjs, near.mjs, shapes.mjs read with the kit’s packJson.'],
          links: ['store-r2']
        }),
        n('transit-caps', 'coin', ['Google 超過月上限就換', 'Past Google’s monthly cap, switch'], ['國土測繪圖和開放街圖接手', 'Taiwan’s own map and OpenStreetMap take over'], {
          p: ['Google 地圖超過額度要付錢。', 'Google Maps costs money past its free use.'],
          i: ['每一種 Google 服務都設每月上限；超過了地圖改用國土測繪中心的圖，走路改用 OpenStreetMap。已規劃的行程只重新對時間，可能不同時才再問付費規劃器。', 'Every Google service has a monthly cap; past it the map switches to NLSC’s and walking to OpenStreetMap. A saved trip is only re-timed; the paid planners are asked again only when the ways could differ.'],
          r: ['不會突然收到帳單。', 'No surprise bill.'],
          tech: ['transit.js CAPS；map.mjs 用同一個介面包 Google 或 Leaflet+NLSC。', 'transit.js CAPS; map.mjs wraps Google or Leaflet+NLSC behind one interface.'],
          links: ['cheap-guard']
        }),
        n('transit-fast', 'clock', ['規劃快 2 到 5 倍', 'Plans 2 to 5 times faster'], ['公車到站一個城市問一次', 'Buses due, asked once a city'], {
          p: ['規劃一趟路要一站一站問公車還有幾分鐘到，台北要等 7 到 10 秒。', 'Planning a trip asked each stop in turn when its buses were due; in Taipei that took 7 to 10 seconds.'],
          i: ['雲端一次拿整個城市每一站、每一路的到站時間，存兩分鐘大家共用；規劃時直接查這一份。', 'The cloud fetches a whole city’s buses due for every stop and route in one ask, keeps it two minutes for everyone, and plans read that one copy.'],
          r: ['第一批方案一到兩秒就出來。', 'The first plans show in a second or two.'],
          tech: ['transit.js /transit/eta：TDX 一個城市一次呼叫；城市第一次問時先用站牌自己的答案頂著。', 'transit.js /transit/eta: one TDX call a city; a city’s first ask is answered by its stops’ own ask beside it.'],
          links: ['transit-tdx']
        }),
        n('transit-tdx', 'clock', ['先讀業者自己的網站', 'The operators’ own sites first'], ['交通部的 TDX 只當備援', 'TDX only as a backup'], {
          p: ['交通部 TDX 的付費方案 12 月起不續了，免費方案一個月只有 3 點，撐不起即時公車和火車。', 'TDX’s paid plan ends in December, and its free tier, 3 points a month, can’t carry live buses and trains.'],
          i: ['公車、台鐵、高鐵、捷運和 YouBike 都改讀業者自己的網站和開放資料，手機自己讀得到的就讓手機讀；TDX 只在讀不到的時候用，答案大家共用。', 'Buses, TRA, HSR, the metros and YouBike come from the operators’ own sites and open data, read by the phone wherever it can; TDX only when they fail, its answers shared by everyone.'],
          r: ['即時到站、誤點和公告都還在，交通資料一毛錢都不用付。', 'Live arrivals, delays and notices all stay, and the transit data costs nothing.'],
          tech: ['Orbit-Core transit-free.js 回答 TDX 形狀的資料：臺北、新北、新竹、桃園、臺中、臺南、高雄和公路局的公車網站，台鐵開放資料和車站時刻、車次查詢，高鐵 GTFS，臺北、桃園、高雄捷運的月台資訊，YouBike 自己的清單；公車資料每週從 TDX 的 GTFS 打包（0 點）；TDX 的答案依它更新的速度共用。', 'Orbit-Core transit-free.js answers in TDX’s shape: the bus sites of Taipei, New Taipei, Hsinchu, Taoyuan, Taichung, Tainan, Kaohsiung and the Highway Bureau, TRA’s open data, station boards and train lookup, THSR’s GTFS, the Taipei, Taoyuan and Kaohsiung metros’ platform screens, YouBike’s own list; bus packs weekly from TDX’s GTFS (0 points); TDX’s answers shared at the speed it updates.'],
          links: ['cheap-plan']
        })
      ]
    }),
    n('transit-data', 'map', ['資料從哪裡來', 'Where the data comes from'], ['政府開放資料加上地圖服務', 'Open government data plus maps'], {
      tech: ['各縣市公車網站、台鐵和高鐵自己的資料、各捷運的月台資訊、YouBike；TDX 運輸資料流通服務當備援；Google Maps / Places / Routes、國土測繪中心地圖（NLSC）、OpenStreetMap。', 'Each city’s bus site, TRA’s and THSR’s own data, the metros’ platform screens, YouBike; TDX as backup; Google Maps / Places / Routes, NLSC maps, OpenStreetMap.'],
      links: ['cloud-proxy']
    }),
    n('transit-calls', 'pencil', ['Jay 的決定', 'Jay’s calls'], ['照真實的通勤判斷', 'Judged by real commutes'], {
      tech: ['永遠有一個推薦；不規劃計程車；高鐵不算免費；不要跟自己的火車賽跑到下一站；地圖被手指動過就不再拉回；例：竹東南 → 成功九街，5608 公車接 20 分鐘 YouBike。', 'There is always a recommendation; never taxis; HSR is never free; never race your own train to the next station; the map never pulls back once moved; e.g. Zhudong South → Chenggong 9th St.: the 5608 then a 20-minute ride.']
    })
  ]
});

const weather = n('weather', 'cloud', ['Orbit Weather', 'Orbit Weather'], ['一個答案的天氣，準到鄉鎮', 'One clear forecast, to the township'], {
  app: 'weather',
  p: ['每個氣象 App 說法都不一樣，看完更困惑。', 'Every weather app says something different.'],
  i: ['把好幾個來源混成一個答案，再學會哪個來源在哪裡比較準。', 'Blend several sources into one answer, and learn which is right where.'],
  r: ['一個數字，不用自己比對。', 'One number, nothing to compare yourself.'],
  kids: [
    n('weather-ask', 'ai', ['問天氣', 'Just ask the weather'], ['程式從預報回答', 'Answered by code from the forecast'], {
      p: ['想知道「明天竹北會下雨嗎」，要自己找地點、找日期、讀一整排數字。', 'To know “will it rain in Zhubei tomorrow” you had to find the place, the day, and read a row of numbers.'],
      i: ['在搜尋框直接問，程式找出地點和日期，從預報畫出那天的天空、一句結論、高低溫和降雨機率；只有程式找不到的地名才問 AI 在哪。雷達追蹤的陣雨變成天空卡片上的一塊，說幾點、哪裡會下。', 'Ask in the search box: code finds the place and day and draws that day’s sky, a verdict, low–high and rain chance from the forecast; only a place code can’t find goes to AI. A shower the radar tracks becomes a panel on the sky card saying when and where.'],
      r: ['一句話問，一眼看到答案。', 'Ask in a sentence, see the answer at a glance.'],
      tech: ['lib/ask.mjs；/ai 的 weather-ask 只回答地點；Orbit-Core weather-radar.js 追蹤氣象署雷達回波。', 'lib/ask.mjs; /ai’s weather-ask answers only a place; Orbit-Core weather-radar.js tracks CWA’s radar echoes.'],
      links: ['ai']
    }),
    n('weather-own', 'spark', ['比原始資料更準', 'Better than the raw feed'], ['我們自己算的部分', 'What we work out ourselves'], {
      kids: [
        n('weather-blend', 'cloud', ['多個來源混成一個答案', 'Many sources, one answer'], ['還會自己打分數', 'And it grades them'], {
          p: ['Google、中央氣象署、環境部的數字常不一樣。', 'Google, CWA and MOENV often disagree.'],
          i: ['雲端把它們和測站的實際讀數混在一起，每小時拿實測對答案，學會誰在哪裡比較準。', 'The cloud blends them with real station readings and checks against what happened every hour, learning who is right where.'],
          r: ['App 只顯示一個值，也從不寫來源。', 'The app shows one value and never names a source.'],
          tech: ['weather.js 混合約 1 公里格子；weather-skill.js 每小時評分；有測試會擋住來源名出現在畫面上。', 'weather.js blends a ~1 km cell; weather-skill.js scores hourly; a test fails if a source name reaches the screen.']
        }),
        n('weather-typhoon', 'wind', ['颱風停班停課機率', 'Typhoon day-off chance'], ['用過去 68 個颱風學出來', 'Learnt from 68 past storms'], {
          p: ['颱風天大家都在猜明天放不放假。', 'On typhoon days everyone guesses whether tomorrow is off.'],
          i: ['用 2019 到 2026 年 68 個颱風、4,671 個縣市日的真實決定做出模型：暴風圈多近、颱風多強、陣風、雨量、鄰近縣市已經宣布的比例。人事行政總處一公布就換成正式結果。', 'A model fitted to 68 storms and 4,671 county-days of real decisions (2019–2026): how close the storm circle is, its strength, gusts, rain, and how many neighbours already announced. The official word replaces it once the government’s personnel office (DGPA) posts it.'],
          r: ['每個縣市一個 1% 到 99% 的機率，隨預報更新。', 'One 1–99% chance per county that moves with each forecast.'],
          tech: ['typhoon.js 邏輯斯迴歸；22 縣市每 3 分鐘一起算進 KV；颱風路徑 CWA W-C0034-005；雨量 MET Norway（Open-Meteo 後備）。', 'typhoon.js logistic fit; all 22 counties every 3 minutes into KV; track CWA W-C0034-005; rain MET Norway (Open-Meteo fallback).'],
          links: ['kit-dayoff', 'cloud-relay']
        }),
        n('weather-soon', 'rain', ['兩小時內要下雨才說', 'Rain soon, only when it is'], ['一行提醒', 'One line'], {
          p: ['整天的降雨機率看不出幾點會下。', 'A day’s rain chance doesn’t say when.'],
          i: ['只有兩小時內從乾變濕（50% 以上），或雨要停了，才在數字下面多一行；接下來一小時直接看氣象署的雷達回波預報。', 'One line only when a wet hour (50%+) starts within two hours of a dry one, or rain eases; the next hour read straight from CWA’s radar forecast.'],
          r: ['該帶傘的時候才提醒你，連「一小時內會下雨」都說得出來。', 'Told when it’s time for an umbrella, down to “rain within the hour”.'],
          tech: ['lib/soon.mjs；Orbit-Core weather-radar.js 每 10 分鐘讀氣象署「未來1小時雷達定量降雨預報」（約 1.4 公里一格），1 毫米以上就算會下。', 'lib/soon.mjs; Orbit-Core weather-radar.js reads CWA’s one-hour radar rain forecast (about 1.4 km cells) every 10 minutes; 1 mm or more counts as rain.']
        }),
        n('weather-plan', 'pin', ['我的行程', 'Where you’ll be'], ['每個小時用那時候的地點', 'Each hour, where you’ll be then'], {
          p: ['早上在家看天氣，下午人在學校。', 'You check at home in the morning, but you’re at school in the afternoon.'],
          i: ['依你釘選的地點和時段，每個小時用你那時會在的地方的預報；假日學校釘選自動關掉。', 'From your pins and their hours, each hour uses the forecast for where you’ll be; a school pin is off on holidays.'],
          r: ['一條預報跟著你的一天走。', 'One forecast that follows your day.'],
          tech: ['lib/plan.mjs、pins.mjs（存在 Pass 上，w1:）。', 'lib/plan.mjs, pins.mjs (on the Pass, w1:).']
        })
      ]
    }),
    n('weather-limits', 'shield', ['省著用、不被擋', 'Thrifty, never blocked'], ['Google 每天只有 500 次', 'Google allows 500 a day'], {
      kids: [
        n('weather-squares', 'grid', ['同一塊區域共用答案', 'One answer per square'], ['約 5 公里一格', 'About 5 km a square'], {
          p: ['以前每 1 公里各問一次 Google，手機一移動就換格子，中午就把一天的額度用完。', 'Every 1 km cell used to ask Google itself; a moving phone crossed cells and the day’s cap ran out by noon.'],
          i: ['改成約 5 公里一格共用，15 分鐘內問過就不再問；額外的查詢依一天的時段慢慢放額度。', 'Share per ~5 km square, never asking twice within 15 minutes; extra calls paced through the day.'],
          r: ['額度撐得過一整天；真的用完了，每個欄位改用氣象署和測站補上。', 'The cap lasts the day, and if it runs out every field is filled from CWA and stations.'],
          tech: ['weather.js gridOf 0.05°、googlePace；格子答案在 KV 存 15 分鐘；GET /weather/status 看今天用了幾次。', 'weather.js gridOf 0.05°, googlePace; a cell’s answer kept 15 minutes in KV; GET /weather/status shows today’s calls.'],
          links: ['store-kv', 'cheap-caps']
        }),
        n('weather-county', 'flag', ['颱風機率一個縣市算一次', 'One typhoon number per county'], ['所有地點共用', 'Shared by every place'], {
          p: ['每個地點各算一次，同一個縣市還可能算出不同數字。', 'Working it out per place costs more and can disagree inside one county.'],
          i: ['22 個縣市每 3 分鐘一起算，以縣市政府所在地為準，每個地點讀自己縣市那一份。', 'All 22 counties at once every 3 minutes, at each county seat; every place reads its county’s.'],
          r: ['一致又省。', 'Consistent and cheap.'],
          tech: ['KV weather:dayoff；人事行政總處頁面 3 分鐘讀一次（透過台灣的 AI 中繼站）。', 'KV weather:dayoff; the DGPA’s page read every 3 minutes (through the Taiwan relay).']
        })
      ]
    }),
    n('weather-data', 'sun', ['資料從哪裡來', 'Where the data comes from'], ['政府和國際來源', 'Government and global sources'], {
      tech: ['Google Weather、中央氣象署（預報、測站、颱風路徑、強風燈號）、環境部空氣品質、國家災害防救中心警報、人事行政總處停班停課、MET Norway、Open-Meteo、CODiS 歷史測站資料（做模型用）。', 'Google Weather, CWA (forecasts, stations, typhoon tracks, gust lamps), MOENV air quality, NCDR alerts, DGPA closures, MET Norway, Open-Meteo, CODiS station history (for the model).']
    }),
    n('weather-calls', 'pencil', ['Jay 的決定', 'Jay’s calls'], ['一個數字只有一個意思', 'One number, one meaning'], {
      tech: ['同一個小時，文字、圖表、十天預報都讀同一個數字；舊預報不能假裝是現在（過 6 小時就隱藏）；天氣圖都自己畫，不用 emoji；不顯示來源名稱；颱風假在每個 App 都算假日。', 'The line, the graph and the 10-day row read the same hours; an old forecast never poses as now (hidden after 6 hours); the app draws its own pictures, no emoji; no source names; a typhoon day off is a holiday in every app.'],
      links: ['kit-dayoff']
    })
  ]
});

const classApp = n('class', 'school', ['Orbit Class', 'Orbit Class'], ['現在上什麼課、下一節是什麼', 'The class now and what’s next'], {
  app: 'orbit',
  p: ['紙本課表要自己算單雙週、調課，還常記錯教室。', 'A paper timetable makes you work out odd and even weeks, swaps and rooms yourself.'],
  i: ['每秒照時鐘重算現在第幾節，一張卡片回答「今天還剩什麼」。', 'Work out the period from the clock every second; one card answers “what’s left today”.'],
  r: ['打開就知道現在、下一節、幾點放學。', 'Open it to see now, next and when school’s out.'],
  kids: [
    n('class-more', 'ai', ['學校公告、待辦和讀書計畫', 'School news, to-dos, study plans'], ['和課表放在一起', 'Kept with the timetable'], {
      p: ['學校網站的公告一大堆，真正跟你有關的很難找；聯絡簿和考試範圍要自己抄。', 'A school site’s notices are endless and the ones that matter are hard to find; homework and exam scopes had to be copied by hand.'],
      i: ['學校公告每小時讀學校自己的網站，分成考試、升學、活動、獎助，「跟你有關」放最前面，轉知的另放；拍聯絡簿變待辦；考前讀書計畫由程式排、AI 只負責講清楚；「問我的課表」在課表編輯器裡直接問；上課前一鍵打開到學校的路線，下課提醒背五個單字。', 'School news reads the school’s own site every hour, sorted into exams, admissions, events and awards, what concerns you first and notices passed on kept apart; a photo of the homework book becomes to-dos; an exam study plan is laid out by code and only worded by AI; ask your timetable in its editor; before class, one tap opens the trip to school, and a break offers five words to review.'],
      r: ['每天要看的東西都在一個 App 裡。', 'What you check every school day, in one app.'],
      tech: ['Orbit-Core class-news.js（R2，45 天）；/ai 的 class-book、class-plan、class-ask；家族筆記把下兩週的課告訴其他 App。', 'Orbit-Core class-news.js (R2, 45 days); /ai’s class-book, class-plan, class-ask; the family notebook tells the other apps the next two weeks of classes.'],
      links: ['ai', 'ai-family']
    }),
    n('class-own', 'spark', ['自己算的部分', 'What it works out'], ['規則都在一個地方', 'Every rule in one place'], {
      kids: [
        n('class-clock', 'clock', ['每秒重算', 'Recomputed every second'], ['只改有變的字', 'Only changed text is rewritten'], {
          p: ['一直重畫畫面會閃，也耗電。', 'Redrawing everything flickers and drains power.'],
          i: ['每秒從時鐘算出星期、單雙週、第幾節或下課，只把變了的字寫進畫面。', 'Each second, weekday, odd/even week and period come from the clock; only changed fields are written.'],
          r: ['倒數很順，電池也省。', 'Smooth countdowns, little battery.'],
          tech: ['dashboard.js 每秒迴圈；schedule-calc.js 純函式有測試。', 'dashboard.js per-second loop; schedule-calc.js pure and tested.']
        }),
        n('class-weeks', 'calendar', ['單雙週自己數', 'Odd and even weeks counted'], ['跨年也不會亂', 'Right across the new year'], {
          p: ['用一般的週數，2026 年有第 53 週，單雙週會重複一次。', 'With ISO week numbers, 2026’s 53rd week would repeat “odd”.'],
          i: ['從 2025-12-29 那週開始一直往下數；學校算法不同可以一鍵對調。', 'Count straight on from the week of 2025-12-29; one switch flips it if a school counts differently.'],
          r: ['「語文/公民」這種隔週上的課永遠對。', 'Alternating slots like Language/Civics are always right.'],
          tech: ['WEEK_EPOCH。', 'WEEK_EPOCH.']
        }),
        n('class-swap', 'swap', ['調課一個規則', 'Swaps, one rule'], ['每個畫面和通知都讀同一個', 'Every screen and notice reads it'], {
          p: ['調課後有的畫面改了、通知卻還是舊的。', 'After a swap one screen changed while the notice stayed old.'],
          i: ['「某天有哪些課」只有一個函式，所有畫面和通知都用它；假日沒有課。', 'One function answers “which classes on this date”, for every screen and notice; holidays have none.'],
          r: ['畫面永遠不會互相矛盾。', 'Screens never disagree.'],
          tech: ['src/schedule.js classesOnDate；課前 5 分鐘的通知交給雲端送。', 'src/schedule.js classesOnDate; the five-minute notice is handed to the cloud.'],
          links: ['cloud-push', 'kit-dayoff']
        }),
        n('class-ai', 'camera', ['拍照匯入、一句話修改', 'Photo import, edit by sentence'], ['確認了才套用', 'Applied only once you confirm'], {
          p: ['手打一整張課表很累。', 'Typing a whole timetable is tiring.'],
          i: ['最多 6 張照片或 PDF 一起讀成一張課表，先試快的模型再試強的；手機再檢查可疑的結果。用一句話改課表時只回傳要改的地方，顯示差異讓你確認。', 'Up to six photos or PDFs read as one timetable, fast models first, then stronger ones; the phone flags anything odd. A sentence edit returns only what changes, shown as a diff to confirm.'],
          r: ['幾秒鐘就有一張課表，而且 AI 不會偷改。', 'A timetable in seconds, and AI never changes anything unseen.'],
          tech: ['/gemini、/nl-edit；提示詞和格式只放在伺服器，App 只送照片或句子，別人不能把它當免費 AI；每天全站上限 300 次。', '/gemini, /nl-edit; prompts and schemas live only on the server, the app sends only files or the sentence, so nobody can use it as a free AI; 300 a day in all.'],
          links: ['cloud-relay', 'cheap-caps']
        }),
        n('class-flight', 'clock', ['專注飛行', 'Focus flight'], ['跟著一架真的飛機讀書', 'Study along with a real plane'], {
          p: ['普通的倒數計時很無聊，讀到一半就想拿起手機。', 'A plain countdown is dull; halfway through you reach for the phone.'],
          i: ['選 25、50 或 90 分鐘，App 找出現在天上、大約那時候降落的真實航班；畫面是那架飛機在衛星地圖上飛，雲在下面飄，時間到它就落地。', 'Pick 25, 50 or 90 minutes and the app finds real planes in the air now that land about then; the screen is that plane flying over a satellite map, clouds drifting below, landing as the time runs out.'],
          r: ['讀書的時間變成一趟飛行，降落時手機通知你。', 'Study time becomes a flight, with a notice when it lands.'],
          tech: ['雲端的 /flight 從 15 個機場附近收集空中的客機（adsb.lol 位置、adsbdb 航線），手機自己挑最多 6 班；地圖是 Leaflet 加 Esri 衛星圖，只在這裡載入；src/flight*.js。', 'The cloud’s /flight gathers airliners in the air around 15 airports (adsb.lol positions, adsbdb routes) and the phone picks up to six; the map is Leaflet on Esri satellite imagery, loaded only here; src/flight*.js.'],
          links: ['cloud-push']
        })
      ]
    }),
    n('class-cal', 'calendar', ['課表放進手機行事曆', 'The timetable in your Calendar'], ['訂閱一次，一直是最新的', 'Subscribe once, always current'], {
      p: ['手機的行事曆看不到課表，調課了也要自己改。', 'The phone’s Calendar didn’t know the timetable, and a swap had to be copied by hand.'],
      i: ['「加到行事曆」給一個訂閱連結，手機的行事曆自己去讀接下來四週的課，調了課就跟著變。', '“Add to Calendar” gives a subscription link: the phone’s Calendar reads the next four weeks of classes itself and follows every swap.'],
      r: ['不用打開 App，行事曆和小工具上就看得到下一節課。', 'The next class shows in Calendar and its widgets without opening the app.'],
      tech: ['src/calendar.js 做出 .ics；Orbit-Core cal.js 存在 KV、用 webcal 給行事曆訂閱。', 'src/calendar.js builds the .ics; Orbit-Core cal.js keeps it in KV and serves it as a webcal subscription.']
    }),
    n('class-calls', 'pencil', ['Jay 的決定', 'Jay’s calls'], ['Orbit 的第一個 App', 'Orbit’s first app'], {
      tech: ['2026-08-26 Jay 上傳的第一個 App；AI 匯入不能改單雙週；分享金鑰 8 碼、24 小時，讓同學拿到一份自己的課表；離線也能打開。', 'Jay’s first app, uploaded 2026-08-26; AI import never changes the odd/even switch; an 8-character share key (24 h) gives a classmate their own copy; opens offline.']
    })
  ]
});

const words = n('words', 'book', ['Orbit Words', 'Orbit Words'], ['背得住的英文單字：大考 6,169 字', 'English words that stay: 6,169 exam words'], {
  app: 'vocab',
  p: ['單字背了又忘，選擇題又太簡單。', 'Words fade, and multiple choice is too easy.'],
  i: ['預測你什麼時候會忘，在快忘的時候考你，而且故意考最容易搞混的。', 'Predict when you’ll forget and ask just before, with the likeliest mix-ups.'],
  r: ['少花時間，記得更久。', 'Less time, longer memory.'],
  kids: [
    n('words-ai', 'ai', ['用新字聊天、拍照找單字', 'Chat with new words, words from a photo'], ['背了就用得上', 'Learned words, put to use'], {
      p: ['背過的單字不會用，課本上的生字還要一個一個查。', 'Words learned but never used, and a textbook page’s words looked up one by one.'],
      i: ['跟 AI 用英文聊幾句，它會邀你用上剛背的字，每句只改最少的地方並說為什麼；拍課本或講義，只留大考單字表裡有的字加入收藏；每個字有 AI 寫的例句和記憶法，「用它造句」AI 幫你看自然不自然。', 'Chat a few lines in English with AI, which invites the words you just learned and fixes each line with the fewest changes and why; photograph a textbook page and only the exam list’s words are starred; each word has AI examples and a memory hook, and “Make a sentence” checks your sentence.'],
      r: ['背的字真的變成會用的字。', 'Learned words become words you use.'],
      tech: ['/ai 的 words-chat、words-photo、words-check；已經做好的例句和記憶法留著（words/cards/），不再整批做新的。', '/ai’s words-chat, words-photo, words-check; the examples and hooks already made are kept (words/cards/), no new batch made ahead.'],
      links: ['ai']
    }),
    n('words-memory', 'spark', ['記憶模型', 'A memory model'], ['算出你快忘的時間', 'When you’re about to forget'], {
      p: ['固定天數複習，太早浪費、太晚忘光。', 'Fixed review days are too early or too late.'],
      i: ['每個字記下「穩定度」和「難度」，預測還記得的機率；穩定度到 10 天算學會。', 'Each word keeps a stability and a difficulty that predict the chance you still know it; 10 days’ stability is mastered.'],
      r: ['每天的 20 個字都是最需要的。', 'Each day’s 20 are the ones that matter most.'],
      tech: ['FSRS-5（lib/words.mjs）。', 'FSRS-5 (lib/words.mjs).']
    }),
    n('words-hard', 'target', ['故意出難的', 'Hard on purpose'], ['錯的選項是你最會搞混的', 'Wrong options you’d actually confuse'], {
      p: ['亂選的錯誤選項一看就知道不是。', 'Random wrong options are easy to rule out.'],
      i: ['錯誤選項挑拼法像、意思近，或你自己搞混過的字；新字第一題先快速檢查，一眼就會就幾週後再見；學會之後改成聽寫。', 'Wrong options are spelt alike, close in meaning, or ones you mixed up before; a new word gets a quick check first (known → weeks away); once held, dictation.'],
      r: ['真的會才算會。', 'Known means really known.'],
      tech: ['lib/words.mjs；提示和易混字寫在 data/hints.json，一次離線做好，不用即時 AI。', 'lib/words.mjs; mnemonics and confusions in data/hints.json, written once offline, no live AI.']
    }),
    n('words-dict', 'book', ['自己的字典', 'A dictionary of its own'], ['用台灣的說法，常用的意思先', 'In Taiwan’s wording, the main sense first'], {
      p: ['網路上的中文解釋常常是對岸用語，或第一個意思就是冷僻的（mean 寫成「低劣的」）。', 'Chinese glosses found online often use mainland wording or lead with a rare sense (mean as “inferior”).'],
      i: ['每個字的意思從維基詞典重新寫成台灣學生的說法，最常用的放第一個，附 KK 音標、例句和詞形變化。', 'Every word’s senses rewritten from Wiktionary in Taiwan students’ wording, the main one first, with KK, an example and the word’s forms.'],
      r: ['查到的第一個意思就是考試會考的那個。', 'The first sense you see is the one the exam asks.'],
      tech: ['釋義參考 Wiktionary，例句來自 Tatoeba；整本字典隨 App 離線。', 'Senses from Wiktionary, examples from Tatoeba; the whole dictionary ships offline with the app.']
    }),
    n('words-contest', 'pencil', ['拼字比賽', 'Spelling contest'], ['照全國單字比賽的考卷形式', 'In the national contest’s shape'], {
      p: ['Jay 要參加全國高中英文單字比賽，平常的練習和真的考卷不一樣。', 'Jay was entering the national high-school vocabulary contest, and everyday practice isn’t its paper.'],
      i: ['照比賽實施計畫的形式出一份計時考卷：先聽英拼寫（每個字念兩次），再考詞彙題（單題和題組），四成出自你最弱的字；一般練習模式裡的其中一種。', 'A timed paper in the shape of the contest’s official plan: spelling by ear first (each word said twice), then vocabulary questions (single and sets), 40% from your weakest words; one mode among the everyday ones.'],
      r: ['三種大小：20+20、50+50（40 分鐘，和比賽一樣）、50+100，每題 2 分。', 'Three sizes: 20+20, 50+50 (40 minutes, the contest’s) and 50+100, 2 points a question.'],
      tech: ['lib/contest.mjs（PAPERS、題組每組 5 題）、views/contest.js；格式核對 115 學年度實施計畫，不抄任何一所學校的考卷。', 'lib/contest.mjs (PAPERS, sets of 5), views/contest.js; the shape checked against the 2026 official plan, never copied from any school’s paper.']
    }),
    n('words-offline', 'backpack', ['完全離線', 'Fully offline'], ['每個字都有真人錄音', 'A recording per word'], {
      p: ['在公車上沒網路也想背。', 'You want to study on the bus with no signal.'],
      i: ['單字表和 6,169 個錄音都是 App 自己的檔案，存在手機上；進度每次改變都存手機，合併後才寫回 Pass。', 'The list and 6,169 recordings are the app’s own files kept on the phone; progress saves on every change and is merged before going to the Pass.'],
      r: ['離線也能完整使用，兩台手機的進度也不會互相蓋掉。', 'Works fully offline, and two phones never overwrite each other.'],
      tech: ['sw.js 保存全部檔案；kit pass-sync.mjs；z3: gzip 進度。', 'sw.js keeps every file; the kit’s pass-sync.mjs; z3: gzip progress.'],
      links: ['pass-sync', 'fast-sw']
    })
  ]
});

const beats = n('beats', 'play', ['Orbit Beats', 'Orbit Beats'], ['永不停的音樂，用你自己的節拍做歌', 'Endless music, and songs from your own beats'], {
  app: 'beats',
  p: ['做音樂需要樂器、軟體和很多時間。', 'Making music takes instruments, software and time.'],
  i: ['手機自己作曲：和弦、旋律、鼓、編曲、混音全部在手機上算出來，聲音不會上傳。', 'The phone composes: chords, melodies, drums, arrangement and mix, all worked out on the phone, nothing uploaded.'],
  r: ['按一下就有一首首不重複的歌。', 'One tap, and songs that never repeat.'],
  kids: [
    n('beats-say', 'ai', ['用說的選電台', 'Say what to play'], ['程式先聽懂', 'Code understands first'], {
      p: ['想聽「讀書用的 lo-fi」，要自己在一堆類型裡找。', 'For “lo-fi to study” you had to dig through genres.'],
      i: ['說想聽什麼，程式把它讀成律動、場景和速度，馬上換成那種歌；程式讀不懂的字才問 AI，AI 只回答律動和速度，從不碰聲音。別的 App 開始出聲，Beats 就停下，不會自己再開。自己做的歌透過 Pass 同步到每支手機。', 'Say what you’d like; code reads it into grooves, a scene and a tempo and the radio switches at once; only words code can’t place go to AI, which answers grooves and a tempo, never sound. When another app starts sound, Beats stops and never restarts itself. Songs you make sync to every phone through the Pass.'],
      r: ['說一句就換歌，也不會跟別的聲音搶。', 'One sentence changes the music, and it never fights other sound.'],
      tech: ['lib/say.mjs；/ai 的 beats-say；歌曲以配方（每首約 300 bytes）存在 Pass。', 'lib/say.mjs; /ai’s beats-say; songs kept on the Pass as recipes (about 300 bytes each).'],
      links: ['ai']
    }),
    n('beats-radio', 'live', ['無限電台', 'An endless radio'], ['每首歌都是新寫的', 'Every song freshly written'], {
      p: ['自動產生的音樂聽幾首就膩。', 'Generated music gets boring fast.'],
      i: ['每首歌有自己的樂團、調性、和弦和曲式（前奏、主歌、副歌、橋段）；下一首規定換曲風、換調、速度差 15 BPM 以上；最近六首不重複同一種律動。', 'Each song has its own band, key, chords and form (intro, verse, hook, bridge); the next must change groove family, key and tempo by 15 BPM or more; no groove repeats within six.'],
      r: ['一首接一首，鎖螢幕、切去用別的 App 也繼續播。', 'Song after song, playing on with the screen locked or while you use other apps.'],
      tech: ['lib/radio.mjs radioPick、makeSong；iPhone 鎖屏只保證一個 <audio> 播放，所以全部接在一條音訊串流裡（lib/tape.mjs，Media Source + AudioEncoder）。', 'lib/radio.mjs radioPick, makeSong; iOS keeps only one <audio> playing locked, so songs go onto one stream (lib/tape.mjs, Media Source + AudioEncoder).']
    }),
    n('beats-ears', 'drop', ['聽久了不累', 'Easy on the ears'], ['Jay 聽久了覺得煩躁之後的修正', 'Fixed after Jay found it tiring'], {
      p: ['Jay 聽了一陣子覺得煩躁，甚至有點不安。', 'After a while of listening Jay felt annoyed, even uneasy.'],
      i: ['量了 16 種曲風才找到原因：太大聲（被壓縮過頭）、2 到 5 kHz 太刺、合唱和高音鐘聲聽起來詭異。把刺耳的頻段壓下、整體降 2 dB、拿掉詭異的音色。', 'Measuring 16 grooves found it: too loud and squashed, harsh at 2–5 kHz, an eerie choir and celesta. The harsh band was dipped, the master lowered 2 dB, the eerie colours removed.'],
      r: ['響度從約 -10 降到約 -12.7 LUFS，每首歌音量相差不到 0.8。', 'Loudness from about -10 to about -12.7 LUFS, songs within 0.8 LU of each other.'],
      tech: ['lib/radio.mjs eased()；scripts/listen.mjs、loudness.mjs 量測。', 'lib/radio.mjs eased(); measured with scripts/listen.mjs and loudness.mjs.']
    }),
    n('beats-hear', 'spark', ['聽出你的節拍', 'Hearing your beats'], ['速度和角色自動判斷', 'Tempo and roles detected'], {
      p: ['自己錄的鼓點，電腦不知道速度和每段是什麼。', 'A recording of your own beats has no tempo or labels.'],
      i: ['在安靜處切段，從 70 到 190 BPM 每個速度打分；用頻率、衰減、雜訊判斷每段是大鼓、小鼓、貝斯還是旋律；從音高找出調性。', 'Split on silences, score every tempo from 70–190 BPM, and tell kick, snare, bass or riff from bands, decay and noise; find the key from the notes.'],
      r: ['在 100 組測試裡，97% 速度完全正確，97.5% 角色判斷正確。', 'On 100 test packs, 97% of tempos exact and 97.5% of roles right.'],
      tech: ['analyze.mjs；調性用 Krumhansl–Kessler 音階輪廓。', 'analyze.mjs; key from Krumhansl–Kessler profiles.']
    }),
    n('beats-game', 'target', ['節奏遊戲', 'A rhythm game'], ['每首歌都是一關', 'Every song is a level'], {
      p: ['節奏遊戲的譜常常跟音樂對不上。', 'Rhythm game charts often don’t match the music.'],
      i: ['譜直接用那首歌自己的音符做，每一下都會發出聲音；每個譜都保證兩隻拇指打得到。', 'The chart comes from the song’s own notes, so every tap sounds; every chart is playable with two thumbs.'],
      r: ['四種難度，判定 ±45 毫秒。', 'Four levels, judged within ±45 ms.'],
      tech: ['lib/game.mjs；tests/playable.test.mjs 檢查 16 首歌。', 'lib/game.mjs; tests/playable.test.mjs checks 16 songs.']
    }),
    n('beats-real', 'play', ['真實樂器的錄音', 'Real instruments, recorded'], ['只下載用到的', 'Only what a song plays is fetched'], {
      p: ['用電子合成的鋼琴聽起來很假。', 'A synthesised piano sounds fake.'],
      i: ['32 種真實樂器和三套鼓組都是開放授權的錄音；手機只下載這首歌用到的，解碼一次就重複使用。', '32 real instruments and three drum kits from open-licensed recordings; the phone fetches only what a song plays and decodes it once.'],
      r: ['好聽，而且不浪費流量。', 'Better sound without wasted data.'],
      tech: ['lib/samples.mjs（MusyngKite CC BY-SA 3.0、Virtuosity Drums、TR-808、Sonic Pi，CC0）；在背景 worker 裡做歌，畫面不卡；資料庫存成 AAC，約 WAV 的十分之一。', 'lib/samples.mjs (MusyngKite CC BY-SA 3.0; Virtuosity Drums, a TR-808, Sonic Pi, CC0); songs made in a background worker; the library keeps AAC, about a tenth of a WAV.'],
      links: ['fast-worker']
    })
  ]
});

const law = n('law', 'shield', ['Orbit Law', 'Orbit Law'], ['法規、裁判、立法，三邊互相連結', 'Laws, rulings and bills, all linked'], {
  app: 'law',
  p: ['法律散在不同的政府網站：法條在一個地方、判決在另一個、立法進度又在另一個，條文裡寫「前條」還得自己找。', 'Law is spread over separate government sites, and “the preceding article” means hunting for it yourself.'],
  i: ['把三邊做成同一套編號、互相連結，每個條號都能點，再加上會引用條文的 AI。', 'Give the three sides one set of ids, link everything, make every article number tappable, and add an AI that cites.'],
  r: ['從一條法律，一路點到判它的判決和正在修它的法案。', 'From one law, tap through to the rulings on it and the bills changing it.'],
  kids: [
    n('law-towns', 'flag', ['連鄉鎮市民代表會都有', 'Down to every township council'], ['全台 204 個代表會', 'All 204 township councils'], {
      p: ['鄉鎮市民代表會離生活最近，資料卻最難找：每個公所的網站都不一樣，很多只有 PDF、Word 或錄音檔。', 'Township councils are closest to daily life but hardest to read: every office’s site differs, many only PDFs, Word files or recordings.'],
      i: ['204 個代表會都有代表名單；其中 69 個從它們自己的網站讀進每一次會期的議程、議事錄、決議、質詢和錄音（共 1,655 個會期），47 個的 YouTube 錄影直接在 App 裡播；一位代表的總質詢可以點「重點摘要」，每一點都標出根據哪一段。22 個縣市議會也都有每天的議程和錄影。', 'All 204 have their members; 69 are read from their own sites into every session’s agenda, minutes, resolutions, questions and recordings (1,655 sessions), and 47 play their YouTube recordings in the app; a member’s questions can be summed up on a tap, each point citing the turn it rests on. All 22 city and county councils have their day-by-day sittings and recordings too.'],
      r: ['從立法院到你家鄉的代表會，都在同一個 App 裡查得到、聽得到。', 'From the legislature down to your own township, all searchable and playable in one app.'],
      tech: ['scripts/build-town.mjs 每天輪流重讀最久沒讀的鎮；只讓台灣連的網站透過台灣的中繼站；/law-ask 的 town 模式做重點摘要；問法律也會引用議員和代表的質詢。', 'scripts/build-town.mjs re-reads the town read longest ago each day; Taiwan-only sites through the Taiwan relay; /law-ask’s town mode sums up; Ask the law cites councillors’ questions too.'],
      links: ['law-councils', 'cloud-relay']
    }),
    n('law-links', 'spark', ['每個條號都能點', 'Every reference tappable'], ['約 99% 對到真的條文', 'About 99% land on the real article'], {
      p: ['「第 184 條」「前項」「同法第 3 條」都只是文字。', '“Article 184”, “the preceding paragraph” are just words.'],
      i: ['一套規則讀懂各種寫法（第X條之Y、至、前N條、其他法律名稱加條號），不認識的法律名稱就不亂連。', 'One set of rules reads every form (sub-articles like 5-1, ranges, “the first N articles”, another law’s name before “Article X”); an unknown name links nothing rather than the wrong thing.'],
      r: ['約 28,000 個引用中，約 99% 連到真實條文。', 'Of about 28,000 references, about 99% land on a real article.'],
      tech: ['lib/refs.mjs；法律簡稱只用真的常用的（勞基法、道交條例）。', 'lib/refs.mjs; short names only in real use (the Labor Standards Act, the Road Traffic Act).']
    }),
    n('law-three', 'grid', ['三邊用同一套編號', 'One id scheme for three sides'], ['法規、裁判、立法', 'Laws, rulings, bills'], {
      p: ['三個資料來源各有各的編號，彼此不認識。', 'The three sources each number things their own way.'],
      i: ['法律、條文、判決、法案都用同一套編號互相引用：條文顯示判它的判決和正在修它的法案，判決顯示它判的條文。', 'Laws, articles, rulings and bills share one id scheme: an article shows its rulings and open bills, a ruling the articles it rules on.'],
      r: ['看一條法，就看得到它的過去和未來。', 'One law shows its past and its future.'],
      tech: ['#law=<pcode>&a=<條>、#r=<釋字/憲判/判決>、#item=<屆>-<法>；資料裡寫成 pcode:key。', '#law=<pcode>&a=<key>, #r=<id>, #item=<term>-<law>; cites as pcode:key in the data.']
    }),
    n('law-stages', 'list', ['法案走到哪一步', 'Where a bill stands'], ['六步一眼看懂', 'Six steps at a glance'], {
      p: ['立法院的進度用語很難懂，同一部法還有很多版本。', 'The legislature’s stage words are hard, and one law has many versions.'],
      i: ['把進度整理成六步（提案、一讀、委員會、院會、三讀、公布），同一部法的所有版本合成一張卡；「總統公布」看法務部資料的異動日期判斷。', 'Stages become six steps (proposed, first reading, committee, floor, third reading, promulgated), every version of a law folded into one card; promulgation read from the MOJ copy’s date.'],
      r: ['用白話說「等委員會審」「政黨協商中」。', 'In plain words: “waiting for committee”, “parties negotiating”.'],
      tech: ['lib/bills.mjs、cards.mjs billCounts。', 'lib/bills.mjs, cards.mjs billCounts.']
    }),
    n('law-ai', 'send', ['問法律', 'Ask the law'], ['只用找到的資料回答，每點都附來源', 'Answers only from what it found, every point cited'], {
      p: ['一般 AI 回答法律問題會亂編條文。', 'A general AI makes up articles.'],
      i: ['先在 App 自己的資料裡找出最多 14 條相關條文，加上類似判決、釋字、行政規則、最新公告；AI 只能用這些回答，每一點的引用都被檢查過，還要判斷誰可能有理、罰則和下一步。', 'First find up to 14 articles in the app’s own data, plus similar rulings, constitutional interpretations, agency rules and notices; the AI may answer only from these, every cite is checked, and it must judge who is likely right, penalties and next steps.'],
      r: ['每一點都能點開原文。', 'Every point opens its source.'],
      tech: ['Orbit-Core law-chat.js（計畫用 Flash-Lite，回答用 Claude Sonnet，忙的時候換 GPT 同級的模型；五個模型用十個真實問題盲測後選的）、law-ground.js、law-more.js、law-local.js（議會和代表會）；條文交給主管機關定的，也跟去找那個辦法；記得前 8 題；每人每天 30 次；只有點了才問。', 'Orbit-Core law-chat.js (plan on Flash-Lite, answered by Claude Sonnet, a GPT model of its class when busy; picked by a blind test of five models on ten real questions), law-ground.js, law-more.js, law-local.js (councils and township councils); an article that leaves the details to a regulation is followed to it; remembers 8 questions back; 30 a day a Pass; only on a tap.'],
      links: ['cloud-relay', 'cheap-caps']
    }),
    n('law-live', 'tv', ['立法院直播', 'The legislature live'], ['真的在播才說直播中', 'Live only when it really is'], {
      p: ['照排程顯示「直播中」，結果畫面是彩色測試條。', 'Marking “live” from the schedule showed colour bars.'],
      i: ['每 90 秒讀立法院 IVOD 的直播清單，只有 IVOD 說在播才顯示；颱風停會也會標出來。', 'Read IVOD’s live list every 90 seconds and mark live only when IVOD says so; typhoon cancellations show too.'],
      r: ['點進去就是那場會議的直播。', 'Tap and it’s that meeting’s stream.'],
      tech: ['scripts/live-ly.mjs 由 live.yml 跑，每次結束自己啟動下一次（GitHub 的排程常常延遲）；寫到 live 分支的 live.json。', 'scripts/live-ly.mjs run by live.yml, each run starting the next (GitHub’s schedule runs late); live.json on the live branch.'],
      links: ['kit-dayoff']
    }),
    n('law-councils', 'flag', ['縣市議會也在裡面', 'The councils too'], ['22 個縣市議會，和全台的代表會', '22 councils, and the township councils'], {
      p: ['地方議會的議案、表決和會議紀錄多半是 PDF，散在各自的網站，有些只讓台灣的網路連。', 'Local councils’ bills, votes and minutes are mostly PDFs scattered over their own sites, some open only to Taiwan’s networks.'],
      i: ['每晚讀每個議會自己的網站和公開資料，把 PDF 裡的議案、決議和質詢讀成 App 裡一列一列的卡片；公開的錄影直接在 App 裡播。', 'Each night read every council’s own site and open data, turn the bills, resolutions and questions in their PDFs into rows in the app, and play the public recordings in it.'],
      r: ['每個議會每天開什麼會、錄影和議員的質詢，都在 App 裡點得到；「各議會的議程」把 22 個議會放在同一條日期上。', 'Every council’s sittings, recordings and councillors’ questions open in the app, day by day; “Every council’s agenda” puts all 22 on one strip of days.'],
      tech: ['scripts/build-council.mjs；歐噴的議會 API（all.cc.govapi.tw）加上各議會自己的網站（新竹縣、新竹市、花蓮、彰化、苗栗、嘉義市…）；PDF 用 pdftotext 讀；只讓台灣連的網站透過台灣的中繼站；HiNet、高雄 IVOD、YouTube 的公開影片。', 'scripts/build-council.mjs; the open councils API (all.cc.govapi.tw) plus each council’s own site (Hsinchu County, Hsinchu City, Hualien, Changhua, Miaoli, Chiayi City…); PDFs read by pdftotext; Taiwan-only sites through the Taiwan relay; public video from HiNet, Kaohsiung’s IVOD and YouTube.'],
      links: ['cloud-relay']
    }),
    n('law-build', 'history', ['每天自己把資料蓋好', 'Data built every day'], ['讀資料不用錢', 'Reading costs nothing'], {
      p: ['每次查法條都去問政府網站，又慢又會被擋。', 'Asking government sites on every read is slow and gets blocked.'],
      i: ['每天凌晨 3:30 自動下載、整理成靜態檔案放上網站；判決在司法院開放的半夜 00:05 到 06:00 一個月一個月補；全文檢索用預先做好的索引。', 'Every day at 03:30 the data is downloaded and built into static files; rulings are back-filled month by month from 00:05 to 06:00 when the Judicial Yuan’s site opens; full-text search uses a prebuilt index.'],
      r: ['法條、判決、法案都秒開、離線也能讀，而且一毛錢都不用。', 'Laws, rulings and bills open instantly, offline too, for nothing.'],
      tech: ['pages.yml：build-data、notices、ly、photos、budget、agency、local、rulings、cons、news；rulings.yml；全文檢索用二字索引；判決全文不存，打開時才透過 /law-page 讀。', 'pages.yml: build-data, notices, ly, photos, budget, agency, local, rulings, cons, news; rulings.yml; bigram full-text index; judgments open through /law-page, never stored.'],
      links: ['ship-pages', 'cheap-static']
    }),
    n('law-data', 'book', ['資料從哪裡來', 'Where the data comes from'], ['全部是公開資料', 'All public data'], {
      tech: ['全國法規資料庫（中英文）、g0v 立法院 API、司法院裁判書（近 3 年）、憲法法庭（釋字 1–813 和憲判字）、各部會行政規則、22 縣市中的 20 個地方法規（有些只接受台灣連線，透過台灣的中繼站讀）、主計總處預算、公共政策網路參與平台預告、立委照片。', 'the national Laws & Regulations Database (zh and en), the g0v Legislative Yuan API, Judicial Yuan judgments (3 years), the Constitutional Court (interpretations 1–813 and its new judgments), ministries’ rules, local rules from 20 of 22 counties (some answer only from Taiwan, read through the Taiwan relay), DGBAS budgets, join.gov.tw notices, legislators’ photos.'],
      links: ['cloud-relay']
    })
  ]
});

const securities = n('securities', 'chart', ['Orbit Securities', 'Orbit Securities'], ['一間台灣券商，用模擬金，規則全是真的', 'A Taiwan broker on practice money, with real rules'], {
  app: 'stock',
  p: ['模擬投資 App 常常把規則簡化，學到的跟真實世界不一樣。', 'Practice trading apps simplify the rules, so what you learn isn’t real.'],
  i: ['真實報價、真實券商規則，連麻煩的開戶申請都照做。', 'Real prices and a real broker’s rules, even the annoying applications.'],
  r: ['台灣的個人能買的商品幾乎都在：台股、美股、期貨、選擇權、基金、債券、外匯、黃金、加密貨幣。', 'Almost everything a person in Taiwan can buy: stocks, futures, options, funds, bonds, FX, gold, crypto.'],
  kids: [
    n('sec-ai', 'ai', ['用說的下單、重大訊息白話', 'Orders in words, filings in plain words'], ['程式算，AI 只說一句', 'Code works it out, AI says one line'], {
      p: ['新手看不懂公司的重大訊息；下單要自己算 5 萬元能買幾股。', 'A beginner can’t read company filings, and has to work out how many shares NT$50,000 buys.'],
      i: ['在搜尋框打「用 5 萬買台積電零股」，程式算出能買幾股、打開填好的下單單，你確認才送出；每支台股的重大訊息讀成一列一列，AI 用一句白話說重點；賣掉一檔股票後，用帳戶自己的數字說這筆交易學到什麼；持股的新聞從 Orbit News 來。', 'Type “use 50,000 to buy TSMC odd lots” in search: code works out the shares and opens a filled ticket you confirm; each Taiwan stock’s filings read into rows with AI’s one plain line; after selling a holding, what the trade taught, told from the account’s own numbers; news about what you hold comes from Orbit News.'],
      r: ['像有個耐心的學長在旁邊，但錢和數字都是真的規則算的。', 'Like a patient senior beside you, with every number from the real rules.'],
      tech: ['lib/sayorder.mjs（不用 AI）；Orbit-Core builders/filings.js 寫 stock/filings/；/ai 的 sec-filing、sec-lesson，一則重大訊息只問一次、大家共用。', 'lib/sayorder.mjs (no AI); Orbit-Core builders/filings.js writes stock/filings/; /ai’s sec-filing and sec-lesson, each filing asked once for everyone.'],
      links: ['ai']
    }),
    n('sec-ledger', 'list', ['帳戶是一本流水帳', 'The account is a log'], ['數字都從頭重算', 'Every figure replayed'], {
      p: ['直接改「現金」這種數字，兩台手機同時用就會算錯。', 'Editing a cash figure directly breaks when two phones trade.'],
      i: ['帳戶只記事件（委託、成交、配息），現金、持股、成本都從頭重算出來；兩台裝置合併就是把兩本記錄合起來。', 'The account records only events (orders, fills, dividends); cash, holdings and cost are replayed from them; two devices merge by joining logs.'],
      r: ['不會憑空多出或少掉錢。', 'Money never appears or vanishes.'],
      tech: ['kit stock-account.mjs（App 和伺服器共用）。', 'The kit’s stock-account.mjs (shared by the app and the server).'],
      links: ['kit-shared-logic']
    }),
    n('sec-fill', 'check', ['成交由伺服器決定', 'The server fills orders'], ['手機的數字不能加錢', 'A phone’s figures never add money'], {
      p: ['如果成交價由手機決定，改一下手機就能作弊。', 'If the phone decided fills, editing the phone would cheat.'],
      i: ['伺服器用最新報價成交，等不到就用 5 分鐘 K 線照委託條件成交；它也會把整本帳重算一次，只有市場能讓帳戶變多。', 'The server fills at a fresh quote, else from 5-minute bars on the order’s terms, and replays the whole account so only the market makes it richer.'],
      r: ['App 關著時掛的單也照樣成交。', 'Orders waiting while the app is closed fill the same way.'],
      tech: ['stock-fill.js、stock-check.js。', 'stock-fill.js, stock-check.js.'],
      links: ['cloud-proxy', 'pass-economy']
    }),
    n('sec-rules', 'shield', ['真實券商規則', 'A real broker’s rules'], ['連開戶資格都照做', 'Down to the account papers'], {
      p: ['真的券商有很多限制，模擬的常常沒有。', 'Real brokers have many limits that simulators skip.'],
      i: ['照各市場規定：手續費、稅、漲跌停、整股零股、融資融券（維持率 130% 追繳）、當沖額度、複委託只能用現金、港股每手股數、美股盤前盤後、熔斷、處置股；權證、期貨、槓桿 ETF 要先簽風險預告書或開戶。', 'Each market’s rules: fees, taxes, limits, lots and odd lots, margin (calls at 130%), day-trade room, cash-only foreign stocks, Hong Kong board lots, US extended hours, circuit breakers, disposition stocks; warrants, futures and leveraged ETFs need their papers first.'],
      r: ['學到的就是真的。', 'What you learn is real.'],
      tech: ['kit stock-markets.mjs、stock-credit.mjs、stock-access.mjs；期貨價 = 加權指數 + 期交所結算價差；選擇權用 Black-76 模型。', 'The kit’s stock-markets.mjs, stock-credit.mjs, stock-access.mjs; futures = live index + TAIFEX settle basis; options priced with Black-76.']
    }),
    n('sec-data', 'chart', ['資料從哪裡來', 'Where the data comes from'], ['報價和交易所名單', 'Quotes and exchange lists'], {
      tech: ['Yahoo Finance（報價、K 線、搜尋）、證交所和櫃買中心（新股申購、處置和注意股、全額交割股、興櫃）、期交所（結算價、保證金）、投信投顧公會基金淨值、鉅亨網基金歷史、台灣銀行定存利率。雲端代理不固定在台灣，因為固定在台灣時 Yahoo 擋了 16 次中的 11 次。', 'Yahoo Finance (quotes, charts, search), TWSE and TPEx (IPOs, disposition lists, full-delivery stocks, the emerging market), TAIFEX (settles, margins), SITCA fund NAVs, cnyes fund history, Bank of Taiwan rates. The proxy isn’t pinned to Taiwan: pinned, Yahoo refused 11 of 16 reads.'],
      links: ['cloud-proxy']
    }),
    n('sec-calls', 'pencil', ['Jay 的決定', 'Jay’s calls'], ['像真的券商', 'Like a real broker'], {
      tech: ['不寫「模擬」「練習」；中文漲紅、英文漲綠；所有的錢都只在這個 App 顯示；每週一發 NT$10,000 薪水；首頁不顯示餘額。', 'No “simulated” or “practice” wording; up is red in Chinese, green in English; all money is shown only here; NT$10,000 pay every Monday; no balance on the home page.'],
      links: ['pass-economy']
    })
  ]
});

const money = n('money', 'wallet', ['Orbit Money', 'Orbit Money'], ['記自己真正的錢：月曆、帳戶、拍照記帳', 'Your real money: calendar, accounts, photo entries'], {
  app: 'money',
  p: ['Jay 對原本的記帳 App 很不滿意。', 'Jay was fed up with his accounting app.'],
  i: ['做一個 Orbit 家族的記帳 App，和 Securities 的模擬金完全分開。', 'An Orbit accounting app, kept fully apart from Securities’ practice money.'],
  r: ['月曆一眼看每天花多少，拍一張照就記好一筆。', 'Each day’s spending at a glance, an entry from one photo.'],
  kids: [
    n('money-ai', 'ai', ['問我的帳、車資記帳', 'Ask your books, rides logged'], ['手機算，AI 只挑表', 'The phone adds up, AI picks the tables'], {
      p: ['想知道「這個月吃飯花了多少」，要自己翻統計、加總。', 'To know “how much did I spend on food this month” you dug through stats and added it up.'],
      i: ['問一句，手機先把帳本整理成幾張小表（花在哪、怎麼付、比上個月），AI 只挑哪幾張回答並寫一句話，畫成有分類圖示和長條的列；每月回顧由程式算、AI 給一句建議；Orbit Transit 規劃好的車資，月曆上一點就記成一筆交通。', 'Ask a sentence: the phone sums the books into small tables (where it went, how it was paid, against last month), AI only picks which answer and writes one line, drawn as rows with category tiles and bars; the monthly review is added up by code with one AI suggestion; a fare Orbit Transit planned is one tap from an entry on the calendar.'],
      r: ['答案一眼看懂，帳本內容不會整本送給 AI。', 'Answers at a glance, and the whole book is never handed to AI.'],
      tech: ['/ai 的 money-ask、money-month、money-say；只送整理過的事實；家族筆記 transit.ride。', '/ai’s money-ask, money-month, money-say; only the digest is sent; the family notebook’s transit.ride.'],
      links: ['ai', 'ai-family']
    }),
    n('money-guess', 'spark', ['記一筆幾乎不用選', 'An entry nearly fills itself'], ['從你自己的紀錄猜', 'Guessed from your own entries'], {
      p: ['每記一筆都要選收支、分類、細項、付款方式，記帳很快就懶得記。', 'Every entry asked for its kind, category, sub-category and way to pay, so people soon stop logging.'],
      i: ['從你過去最像現在的紀錄（同一個時段、星期幾、今天已經記過的）猜出全部，常用金額點一下就填好；分類是一組大家都用的十二大類，每類兩到五個細項（早餐、午餐、晚餐各算各的，統計看得出每一餐；YouBike、捷運、公車都在「交通 › 搭車」）。', 'Guess it all from your past entries most like now (the hour, the weekday, what you logged today), with your usual amounts one tap away; one broad set of twelve categories for everyone, each with two to five subs (breakfast, lunch and dinner each their own, so the stats show every meal; YouBike, the MRT and buses all under Transport › Rides).'],
      r: ['大部分時候打開、點金額、儲存，就記好了。', 'Most of the time: open, tap the amount, save.'],
      tech: ['lib/cats.mjs 的猜測只讀本機帳本；金額不自動填，要點一下（Jay 10-30）。', 'The guesses in lib/cats.mjs read only the books on the phone; the amount is never filled without a tap (Jay 10-30).']
    }),
    n('money-merge', 'swap', ['兩台裝置逐筆合併', 'Two devices merge entry by entry'], ['刪掉的也記得', 'Deletions remembered'], {
      p: ['手機和平板都記帳，存檔時會互相蓋掉。', 'A phone and a tablet saving books overwrite each other.'],
      i: ['每一筆都有修改時間，刪除留下「墓碑」120 天，合併時一筆一筆比，新的贏。', 'Every record has a time; a removal leaves a tombstone for 120 days; merging compares record by record, newest wins.'],
      r: ['不會少一筆。', 'Nothing goes missing.'],
      tech: ['lib/books.mjs（純函式、有測試）；存成 m1: + gzip。', 'lib/books.mjs (pure, tested); stored as m1: + gzip.'],
      links: ['pass-safe']
    }),
    n('money-photo', 'camera', ['拍照記帳', 'An entry from a photo'], ['任何一張圖都行', 'Any picture at all'], {
      p: ['只會讀發票的功能太窄：收據、帳單、App 截圖、轉帳通知、價目牌都還是要手打。', 'A tool that only read invoices was too narrow: receipts, bills, app screenshots, transfer notices and price tags still had to be typed.'],
      i: ['紙本電子發票的 QR code 先在手機上直接讀（不用 AI），店名查經濟部的登記；其他任何東西，AI 讀出金額、日期、店名、品項、分類和付款方式（只用你自己的分類和付款方式），變成一筆填好的帳，存之前先看一眼；已經記過一樣的（同金額、一天內），會問要不要合併，不會記兩次。', 'A paper e-invoice’s QR codes are read on the phone itself first (no AI), the store named from the company register; anything else, AI reads the amount, day, store, items, category and way to pay (only from your own lists) into a filled-in entry to check before saving; one already logged (same amount, within a day) is offered to merge, never added twice.'],
      r: ['一張照片就是一筆帳，原本的發票掃描、對獎和載具匯入都拿掉了。', 'One photo, one entry; the old invoice scanning, prize checking and carrier import are gone.'],
      tech: ['views/photo.mjs；代理的 /money-read 用 Gemini Flash-Lite 讀圖並檢查（真的日期、整數金額、分類只能從清單裡選），每個 Pass 一天 30 次。', 'views/photo.mjs; the proxy’s /money-read reads the picture with Gemini Flash-Lite and checks it (real days, whole totals, categories only from the list), 30 a day a Pass.']
    }),
    n('money-calls', 'pencil', ['Jay 的決定', 'Jay’s calls'], ['真的錢不能亂編', 'Real money is never invented'], {
      tech: ['從不自己生出帳目、餘額或分類；一組十二大類給所有人，不再先選「學生／上班族／家庭」；帳戶有現金、銀行、信用卡、儲值卡、電子支付。', 'Never invents entries, balances or categories; one set of twelve categories for everyone, no more picking student, office worker or family first; accounts are cash, bank, credit card, stored-value card and e-payment.']
    })
  ]
});

const news = n('news', 'list', ['Orbit News', 'Orbit News'], ['同一則新聞，各家怎麼報', 'One story, every side'], {
  app: 'news',
  p: ['台灣的媒體各有立場，只看一家，很難知道另一邊怎麼說，也不知道哪些新聞只有一邊在報。', 'Taiwan’s outlets each lean a way: read one and you can’t tell what the other side says, or which stories only one side carries.'],
  i: ['把同一件事的報導收成一則新聞，算出偏綠、中間、偏藍（英文新聞是左、中、右）各有幾家在報，標題並排。', 'Gather every report of the same event into one story, count how many outlets lean green, centre or blue (left, centre or right for English news) carry it, and set their headlines side by side.'],
  r: ['一眼看出一件事各邊怎麼報、哪一邊沒報。', 'At a glance, how each side tells it and which side left it out.'],
  kids: [
    n('news-more', 'ai', ['各方怎麼說、今天五則', 'Each side’s angle, today’s five'], ['只講差在哪', 'Only where they differ'], {
      p: ['標題並排還是要自己讀出各家的角度；重要的新聞不一定是你關心的。', 'Headlines side by side still left you to read each side’s angle; the biggest news isn’t always what you care about.'],
      i: ['政治和國際大新聞上，AI 只從各家自己的標題寫出每一邊的角度，和最重要的一個差別，從不判斷誰對；每天早上挑五則給你；你在 Securities 持有的股票、在 Sports 追蹤的球隊排在「你關心的」；新聞提到的法律一點就在 Orbit Law 打開，英文新聞裡正在背的單字畫底線。', 'On big political and world stories, AI writes each side’s angle and the one difference that matters, from their own headlines only, never who’s right; five stories picked for you each morning; what you hold in Securities and follow in Sports leads “What you follow”; laws a story names open in Orbit Law, and words you’re learning are underlined in English stories.'],
      r: ['看懂各邊怎麼說，也看到跟你有關的事。', 'See how each side tells it, and what concerns you.'],
      tech: ['各方怎麼說在第一個人打開那則新聞時才做（Orbit-Core ai-open.js），頭條例外；news-laws.js 對照 Law 的法案；家族筆記（只在手機上）。', 'Each side’s angle is made when the first person opens the story (Orbit-Core ai-open.js), the lead stories excepted; news-laws.js matches Law’s bills; the family notebook (on the phone only).'],
      links: ['ai', 'ai-family']
    }),
    n('news-sides', 'flag', ['媒體的立場從哪裡來', 'Where an outlet’s place comes from'], ['照研究和公開評等，不是我們自己判', 'From research and public ratings, never our own reading'], {
      p: ['自己判斷哪家媒體偏哪邊，很容易變成自己的偏見。', 'Judging each outlet’s lean ourselves would just be our own bias.'],
      i: ['台灣媒體照已發表的研究（例如台灣選舉與民主化調查），新的網路媒體照老闆和公開立場（標成較弱）；英文媒體照 AllSides，沒有的再看 Media Bias/Fact Check；中國官媒另外列。', 'Taiwan’s outlets by published research (such as TEDS), newer web outlets by owner and stated stance (marked weaker); English outlets by AllSides, else Media Bias/Fact Check; China’s state media apart.'],
      r: ['每家媒體的卡片都寫著為什麼放在那裡。', 'Every outlet’s card says why it sits where it does.'],
      tech: ['Orbit-Core kit/news-outlets.mjs：OUTLETS（118 家新聞媒體，另有 7 家體育）、BASIS（每個依據的出處）、藍綠和統獨兩條軸；沒有任何研究把一家媒體放在白色，所以只列新聞提到哪些政黨。', 'Orbit-Core kit/news-outlets.mjs: OUTLETS (118 news outlets, plus 7 sports), BASIS (the source of each place), the green–blue and unification–independence axes; no study places an outlet as TPP-leaning, so stories list the parties their headlines name.']
    }),
    n('news-stories', 'grid', ['依重要程度排，不是依時間', 'By importance, not by time'], ['大新聞留好幾週，一直長大', 'Big stories stay for weeks and grow'], {
      p: ['照時間排的新聞，大事一下就被小事蓋過去。', 'News sorted by time buries a big event under small ones.'],
      i: ['看有幾家在報、寫了多少、持續幾天來排；同一件事的新報導併進原本那則；八卦、算命、標題黨和業配直接拿掉。', 'Rank by how many outlets carry it, how much they wrote and for how many days; new reports join the story they belong to; gossip, fortune-telling, clickbait and promos are left out.'],
      r: ['打開就是現在最重要的事，各家的影片也在旁邊。', 'Open it and the biggest stories lead, with the outlets’ own clips beside them.'],
      tech: ['Orbit-Core builders/news.js 每 10 分鐘讀各家的 RSS 和新聞地圖（輪流讀），分成 14 個主題，寫到 R2 的 news/index.json；手機讀這個檔，沒有用 AI。', 'Orbit-Core builders/news.js reads the outlets’ RSS feeds and news sitemaps every 10 minutes (in turns), sorts them into 14 topics and writes R2 news/index.json; phones read that file; no AI.']
    }),
    n('news-fair', 'shield', ['只放標題和連結', 'Headlines and links only'], ['點了就到原本的媒體', 'A tap opens the outlet itself'], {
      tech: ['只用標題、連結、媒體自己的簡短摘要和圖片，都標明出處；圖片不存；影片用 YouTube 自己的播放器播。', 'Only headlines, links, the outlet’s own short summary and picture, each credited; no picture is kept; clips play in YouTube’s own player.']
    }),
    n('news-calls', 'pencil', ['Jay 的決定', 'Jay’s calls'], ['台灣和國際，不只政治', 'Taiwan and the world, not only politics'], {
      tech: ['Jay 2026-11-10 開始：以台灣和國際英文新聞為主；不只政治，科技、經濟、社會也算；Orbit 自己的樣子和用語，不抄別人。', 'Begun by Jay 2026-11-10: Taiwan’s and the world’s English news; not only politics but tech, the economy and society; Orbit’s own look and words, copying nobody.']
    })
  ]
});

export const APP_BRANCHES = [sports, transit, weather, classApp, money, news, words, beats, law, securities];
