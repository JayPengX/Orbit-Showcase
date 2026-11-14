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

## One page, then one tap deeper

Built for a reader with a few minutes (a teacher, a professor): one page read top to bottom,
nothing to figure out first (Jay 2026-11-04: "too fluff, densed for a professor who only got a few
minutes"; keep the demos and screenshots).

| Where | What it shows | Code, data |
| --- | --- | --- |
| `#home` the top | One sentence on what Orbit is and who does what, four numbers from git, three real screens fanned | `views/main.mjs` `top`, `public/data/stats.json` |
| `#apps` | The ten apps, each its question; 試玩 runs the real app at once (News has no demo yet) | `views/main.mjs` `apps`, `views/demo.mjs`, `lib/demos.mjs`, `public/demo/` |
| `#wow` | Six things people don't expect: a figure the tree's own card states; a tap opens that card | `views/main.mjs` `WOW`, `lib/tree-show.mjs` |
| `#made` | Jay's part and Claude's, one problem from spotted to fixed, every day / the hours / code rewritten (`#numbers`), 問 Orbit, links to the whole system | `views/main.mjs` `made`, `views/numbers.mjs`, `views/ask.mjs` |
| `#apps/<app>` | An app's page: its question, 試玩, its screens (swipe), why it exists, its clever parts (the tree's leaves), day one beside today, the next app | `views/apps.mjs`, `lib/apps.mjs` |
| `#how`, `#how/<node>`, `#how/map[-<story>]` | The whole system: the structure tree (each card a small picture first, then problem → idea → result, technical names folded away) and the journeys | `views/how.mjs`, `lib/tree.mjs`, `tree-apps.mjs`, `tree-show.mjs`, `stories.mjs` |

The frame (`app.mjs`): a bar along the top with the brand, share and language, and the page's
three chapters (lit as you scroll; on a phone the brand row scrolls away and the chapters stay).
On an app's page or the system's, the bar's second row is the way back, where you are and 試玩.
On a computer (900 px wide and over 520 tall) a side bar replaces the bar: the chapters, the ten
apps by name, the whole system. A link to a chapter on the page scrolls there; back and forward
return to where the reader was.

Jay's own homepage lives here too: `public/home/index.html`, one self-contained file (no kit,
no betting, open to all) that the `orbit-home` Worker serves at https://jaypengx.com/ (published to Cloudflare by `deploy/cf-site.mjs`). It leads with Orbit (a card of its own, opening
orbit.jaypengx.com/app/), then the
showcase and GitHub.

The views are `public/views/*.mjs`; `public/shell.mjs` holds what they share (language, icons, app titles, screenshot addresses, a card's problem → idea → result). The look is the kit's
(`Orbit-Core/kit`), with the showcase's own `public/showcase.css`.

## 問 Orbit

A reader's question about how Orbit was made (the AI plan, 2026-11-11). Code first: `lib/ask.mjs`
`cardsFor` picks the structure tree's cards that share its words (pairs of Chinese characters,
English words; a title counts double). Then one AI call, `showcase-ask` (Orbit-Core
`ai-features.js`: Haiku, Luna next), on the showcase's own pass (`/showcase/pass`, as the demos
take theirs; 20 a day an address) says the answer from those cards only and names the ones to
open, drawn by the kit's `aiAnswer` (rows open the card). No pass, the day's answers spent or
offline: the cards code picked, as they are. Nothing new is written about Orbit for it: it reads
the tree as it stands.

## Keeping it true

- **The demos are the apps as they are today.** The deploy (every push, and daily at 10:17 Taipei)
  records every demo again from each app's main and builds it the way the app's own deploy does
  (`scripts/demo/refresh.mjs` → `record.mjs --strict` → `build.mjs`: minified, hashed, the kit's
  files preloaded). A demo whose walk fails keeps the copy committed in `public/demo/`, and every
  demo keeps it when the deploy runs outside 08:00–22:00 in Taiwan (before 08:00, Taiwan's date isn't
  UTC's, and a recording played in another time zone asks for other days). A demo's kit is addressed by its build, not
  file by file, so a copy kept from an older day still runs beside a rebuilt kit. Nobody catches the demos up by hand; a tour step that no
  longer matches the app (`lib/demos.mjs` `TOURS`) shows as that demo's warning in the deploy.
- **The numbers refresh by themselves.** The deploy runs on every push and daily at 10:17 Taipei.
  It clones every family repo and recounts commits, lines, tests and days with `scripts/stats.mjs`.
  Nothing in the pages is typed in.
- **Everything else changes only when Jay says "catch up the showcase".** At that point, update the
  data files above from the repos' own history, with real dates.
- Screenshots use made-up data only, never anyone's own. The pre-GitHub versions were drawn from
  Jay's saved copies with a sample timetable.
- Nothing about betting appears anywhere. A test enforces it.

## Run it

```sh
npm test
TZ=Asia/Taipei node scripts/stats.mjs <folder with the family repos> > public/data/stats.json
```

To preview, serve a folder that holds `Orbit-Showcase -> public` and `Orbit-Core` side by side,
then open `/Orbit-Showcase/`.
