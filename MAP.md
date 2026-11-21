# Orbit Showcase: the map

Orbit explained for anyone, in what a page does better than a PDF: the structure, the numbers
and the apps themselves, running.
Jay's showcase of the Orbit project. Live at https://jaypengx.com/showcase/.

Open to everyone: no Orbit Pass and no Add to Home Screen step. It works on phones and on
computers, either way up, in Safari and Chrome. The page lays itself out by its own width
(`.page` is a CSS container): one column on a phone upright, the wide arrangements from 560 px of
page (a phone on its side, a tablet, a computer).

## Rules

Jay's, dated (Taiwan day), newest wins; the family's are in Orbit-Core `docs/RULEBOOK.md`.

- 10-27 Open to all (no Pass, no Add to Home Screen step; an exception to the family) and a real desktop layout besides the phone one: its own side bar on computers (900 px wide, over 520 tall) in place of the kit's rail; pages lay out by the page's width (`@container page`, wide from 560 px), never the screen's. Check WebKit and Chromium on every screen.
- 10-27 Only structure, numbers and demos; plain everyday words for readers who know no tech (problem → idea → result; technical names only inside the 技術細節 fold); Chinese first, English second. The story of how it was made is kept privately for Jay, never in a repo.
- 10-27 Honest framing: Jay sets the direction, the standards and the judgement calls; Claude does the typing. Every number comes from git (`scripts/stats.mjs`), never estimated; "on GitHub since", never "began on".
- 10-27 No betting anywhere (`tests/content.test.mjs`).
- 10-30 Demos may run the real apps on live data, read-only behind a short showcase pass (`showcase.js`: from the showcase's address only, per-address and daily caps; past any limit the recording plays); full screen on phones, bug-free, small coach-mark tours.
- 11-04 One page a reader with a few minutes (a teacher, a professor) reads top to bottom; keep the demos and screenshots.
- Content changes only when Jay says "catch up the showcase"; the deploy recounts the numbers and re-records the demos daily by itself.
- 11-14 A showcase of the Orbit project, never named a school or 自主學習 piece; no language switch (the browser's language picks it, as on the homepage and the Pass site).
- 11-14 It is Jay's representative piece: the design bar is high, still quick to scan for a professor with minutes. 問 Orbit is everywhere on the page (a pill along the bottom asking about what's on screen), lean on AI (asked only when sent, an answer kept on the device). Demos run in a phone, tablet or computer frame on a computer; while a guided tour runs only its step's target answers a tap, also between a tap and the next step (scrolling stays free); a tour is never stuck: its sheet closed some other way moves it on, a target long gone shows 下一步 (11-19).
- 11-17 For a busy professor who knows nothing about code ("show actual good point that make sense to a professor"): what's impressive, never our plumbing. AI is shown as what it does for you, never as a cost rule ("AI only on a tap" is not a selling point). Screenshots and demos sell one clear point each.
- 11-18 Redone around one claim (the showcase report): ten apps a student made directing an AI, and every decision measured, changed and proven better ("mix both in the hero"). Five parts, each one point and one thing to do: the claim with the ten apps' screens in turn; the ten apps as equals, each its special part ("all ten has it's special thing"; the family's one app order); how Jay decides (four decisions, each question → tried → found → the call, the data lock done for real in the page); before → after measured, the trip-planning wait felt; how it grew (milestones from git, mistakes that became rules, who does what). Still never named a school or 自主學習 piece (Jay 11-18: "keep it unnamed").

## One page, then one tap deeper

Built for a reader with a few minutes (a teacher, a professor): one page read top to bottom,
nothing to figure out first (Jay 2026-11-04: "too fluff, densed for a professor who only got a few
minutes"; keep the demos and screenshots).

| Where | What it shows | Code, data |
| --- | --- | --- |
| `#home` the top | The claim (ten apps a student made directing an AI; every decision measured, changed and proven better), who does what, four numbers from git (apps, days, data sources, automatic checks; asked for at once by `index.html`, never waited on past 2.5 s: drawn without them, then with them), three real screens fanned, the next app's turn every few seconds (only while on screen; still for reduced motion) | `views/main.mjs` `top`, `fan`; `public/data/stats.json` |
| `#apps` | The ten apps as equals, in the family's order: each its question and its special part (`BEST`, as its tree card states it); 試玩 runs the real app at once | `views/main.mjs` `apps`, `views/demo.mjs`, `lib/demos.mjs`, `public/demo/` |
| `#decide` | How Jay decides: four decisions (a blind test, stop and test everything, a bus ride, data locked), each the question → what he tried → what it showed → the call, opening its tree card; the bus ride's route, and the data lock done for real in the page (what you type, locked as Orbit locks it: PBKDF2-SHA256 600,000 rounds, AES-256-GCM, a sample pass, nothing sent) | `views/main.mjs` `DECISIONS`, `lockDemo` |
| `#proof` | Before → after: the trip-planning wait felt (two bars filling over the measured times, the middle of each range), four more with the old number struck and the new one large, two behind 「更多」; each measured around its change and stated on its tree card; the ones Jay raised carry his day | `views/main.mjs` `SOLVED`, `race`; `lib/tree-show.mjs` |
| `#made` | How it grew: the milestones (each app's first day and Claude's first, from git; the decisions' days), four mistakes that became rules (the tree's team-lessons) and the count of Jay's rules, Jay's part and Claude's (each led by its number), every day's updates (`#numbers`), then the way deeper (`#system`: the journey of one tap, 問 Orbit's box where the page ends) | `views/main.mjs` `milestones`, `LESSONS`, `made`, `system`; `views/numbers.mjs`, `views/ask.mjs` |
| `#apps/<app>` | An app's page: its question, 試玩, its screens (swipe; the README's own posters, each URL stamped by `scripts/shot-versions.mjs` so no phone shows a kept old one), why it exists, its clever parts (the tree's leaves), day one beside today, the next app | `views/apps.mjs`, `lib/apps.mjs` |
| `#how`, `#how/<node>`, `#how/map[-<story>]` | The whole system: the structure tree (each card a small picture first, then problem → idea → result, technical names folded away) and the journeys (opening Orbit, one for every app, a fix) | `views/how.mjs`, `lib/tree.mjs`, `tree-apps.mjs`, `tree-show.mjs`, `stories.mjs` |

The frame (`app.mjs`): a bar along the top with the brand and share, and the page's
four chapters (lit as you scroll; on a phone the brand row scrolls away and the chapters stay;
under 360 wide a chapter's short name where it has one).
On an app's page or the system's, the bar's second row is the way back, where you are and 試玩.
On a computer (900 px wide and over 520 tall) a side bar replaces the bar: the chapters, the ten
apps by name, the whole system. A link to a chapter on the page scrolls there; back and forward
return to where the reader was.
A browser too old for the page (no import maps: Safari before 16.4) reads a line saying so,
from a plain script in `index.html` (`tests/too-old.test.mjs`). The apps' pages need import maps
too and have no such line: there that Safari still sees a blank page.

Jay's own homepage lives here too: `public/home/index.html`, one self-contained file (no kit,
no betting, open to all) that the `orbit-home` Worker serves at https://jaypengx.com/ (published to Cloudflare by `deploy/cf-site.mjs`). It leads with Orbit (a card of its own, opening
orbit.jaypengx.com/app/), then the
showcase and GitHub.

The views are `public/views/*.mjs`; `public/shell.mjs` holds what they share (language, icons, app titles, screenshot addresses, a card's problem → idea → result). The look is the kit's
(`Orbit-Core/kit`), with the showcase's own `public/showcase.css`.

## 問 Orbit

A reader's question about how Orbit was made (the AI plan, 2026-11-11), asked from anywhere
(2026-11-14): a pill along the bottom (`askDock`) names a question about what's on screen
(`setAskContext`: the chapter, an app's page, the system; every tree card ends on its own ask) and
opens the conversation in a sheet. On a short screen it waits until the first screen's numbers and
button have scrolled above it (11-17: it covered them on a 320 phone and one on its side). Code first: `lib/ask.mjs`
`cardsFor` picks the structure tree's cards that share its words (pairs of Chinese characters,
English words; a title counts double). Then one AI call, `showcase-ask` (Orbit-Core
`ai-features.js`: Haiku, Luna next), on the showcase's own pass (`/showcase/pass`, as the demos
take theirs; 20 a day an address) says the answer from those cards only and names the ones to
open, drawn by the kit's `aiAnswer` (rows open the card). No pass, the day's answers spent,
offline or a stuck connection (each call has a time limit): the cards code picked, as they are. An
answer once given is kept on the device (localStorage `orbitShowcase.asked2`, 40 at most) and never asked again; the cards of what's on
screen join the ones code picked. Nothing new is written about Orbit for it: it reads
the tree as it stands.

## Keeping it true

- **The demos are the apps as they are today.** The deploy (every push, and daily at 10:17 Taipei)
  records every demo again from each app's main and builds it the way the app's own deploy does
  (`scripts/demo/refresh.mjs` → `record.mjs --strict` → `build.mjs`: minified, hashed, the kit's
  files preloaded). A demo whose walk fails (a step not there within 20 s, or a tour screen saying its data didn't come) keeps the copy the site serves now (each build lists a demo's files in `_demo/<id>.files.json`), else the one committed in `public/demo/`; every
  demo and their kit stay as live when the deploy runs outside 08:00–22:00 in Taiwan (before 08:00, Taiwan's date isn't
  UTC's, and a recording played in another time zone asks for other days). A demo's kit is addressed by its build, not
  file by file, so a copy kept from an older day still runs beside a rebuilt kit. Nobody catches the demos up by hand: every hour from 08:23 to 21:23 Taipei the deploy looks
  (`scripts/demo/stale.mjs`) and records again once an app's main or the kit is newer than what the live demos were recorded
  from (`_demo/heads.json`, written by `refresh.mjs`; 11-21); a tour step that no
  longer matches the app (`lib/demos.mjs` `TOURS`) shows as that demo's warning in the deploy.
- **The numbers refresh by themselves.** The deploy runs on every push and daily at 10:17 Taipei.
  It clones every family repo and recounts commits, lines, tests and days with `scripts/stats.mjs`.
  Nothing in the pages is typed in.
- **Everything else changes only when Jay says "catch up the showcase".** At that point, update the
  data files above from the repos' own history, with real dates.
- Screenshots use public or sample data only, never anyone's own. The pre-GitHub versions were drawn from
  Jay's saved copies with a sample timetable.
- **The data sources and news outlets are counted too** (`scripts/stats.mjs` `countSources`: the kit's
  `sources.mjs` without the AI makers, the tools and the markets; `countOutlets`: `news-outlets.mjs`
  without the sports desks).
- **A before → after** on `#proof` is a measurement around a change, written on its tree card
  (`lib/tree-show.mjs` `pairs`, with where it was measured in a comment); a new one goes on its card
  first.
- Nothing about betting appears anywhere. A test enforces it.

## Run it

```sh
npm test
TZ=Asia/Taipei node scripts/stats.mjs <folder with the family repos> > public/data/stats.json
```

To preview, serve a folder that holds `Orbit-Showcase -> public` and `Orbit-Core` side by side,
then open `/Orbit-Showcase/`.
