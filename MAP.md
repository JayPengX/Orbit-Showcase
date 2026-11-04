# Orbit Showcase: the map

Orbit explained for anyone, in what a page does better than a PDF: the structure, the numbers
and the apps themselves, running.
Jay's 自主學習 portfolio. Live at https://jaypengx.com/showcase/.

Open to everyone: no Orbit Pass and no Add to Home Screen step. It works on phones and on
computers, either way up, in Safari and Chrome. The page lays itself out by its own width
(`.page` is a CSS container): one column on a phone upright, the wide arrangements from 560 px of
page (a phone on its side, a tablet, a computer).

## One page, then one tap deeper

Built for a reader with a few minutes (a teacher, a professor): one page read top to bottom,
nothing to figure out first (Jay 2026-11-04: "too fluff, densed for a professor who only got a few
minutes"; keep the demos and screenshots).

| Where | What it shows | Code, data |
| --- | --- | --- |
| `#home` the top | One sentence on what Orbit is and who does what, four numbers from git, three real screens fanned | `views/main.mjs` `top`, `public/data/stats.json` |
| `#apps` | The nine apps, each its question; 試玩 runs the real app at once | `views/main.mjs` `apps`, `views/demo.mjs`, `lib/demos.mjs`, `public/demo/` |
| `#wow` | Six things people don't expect: a figure the tree's own card states; a tap opens that card | `views/main.mjs` `WOW`, `lib/tree-show.mjs` |
| `#made` | Jay's part and Claude's, one problem from spotted to fixed, every day / the hours / code rewritten (`#numbers`), links to the whole system | `views/main.mjs` `made`, `views/numbers.mjs` |
| `#apps/<app>` | An app's page: its question, 試玩, its screens (swipe), why it exists, its clever parts (the tree's leaves), day one beside today, the next app | `views/apps.mjs`, `lib/apps.mjs` |
| `#how`, `#how/<node>`, `#how/map[-<story>]` | The whole system: the structure tree (each card a small picture first, then problem → idea → result, technical names folded away) and the journeys | `views/how.mjs`, `lib/tree.mjs`, `tree-apps.mjs`, `tree-show.mjs`, `stories.mjs` |

The frame (`app.mjs`): a bar along the top with the brand, share and language, and the page's
three chapters (lit as you scroll; on a phone the brand row scrolls away and the chapters stay).
On an app's page or the system's, the bar's second row is the way back, where you are and 試玩.
On a computer (900 px wide and over 520 tall) a side bar replaces the bar: the chapters, the nine
apps by name, the whole system. A link to a chapter on the page scrolls there; back and forward
return to where the reader was.

Jay 2026-10-27: the showcase is structure, numbers and demos only. The story of how it was made
(requests, decisions, setbacks) is kept privately for Jay, not on the site.

Jay's own homepage lives here too: `public/home/index.html`, one self-contained file (no kit,
no betting, open to all) that the `orbit-home` Worker serves at https://jaypengx.com/ (published to Cloudflare by `deploy/cf-site.mjs`). It links Orbit, the
showcase and GitHub.

The views are `public/views/*.mjs`; `public/shell.mjs` holds what they share (language, icons, app titles, screenshot addresses, a card's problem → idea → result). The look is the kit's
(`Orbit-Core/kit`), with the showcase's own `public/showcase.css`.

## Keeping it true

- **The numbers refresh by themselves.** The deploy runs on every push and daily at 00:17 Taipei.
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
