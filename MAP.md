# Orbit Showcase: the map

Orbit explained for anyone, in what a page does better than a PDF: the structure, the numbers
and the apps themselves, running.
Jay's 自主學習 portfolio. Live at https://jaypengx.com/showcase/.

Open to everyone: no Orbit Pass and no Add to Home Screen step. It works on phones and on
computers (the one exception to the family's phones-only rule), in Safari and Chrome.

## The four tabs

| Tab | What it shows | Its data |
| --- | --- | --- |
| 總覽 | The family, the headline numbers | `public/data/stats.json` |
| App | Each app's screens, and the app itself running on frozen data with a tour (`#apps/<app>`) | `public/lib/apps.mjs`, `public/lib/demos.mjs`, `public/demo/` |
| 架構 | The structure tree (each card a small picture first: steps, numbers, before → after; then problem → idea → result, technical names folded away) and the journey map | `public/lib/tree.mjs`, `tree-apps.mjs`, `tree-show.mjs`, `stories.mjs` |
| 數字 | When each app arrived, every day's updates, the hours, code written and rewritten | `public/data/stats.json`, `public/lib/births.mjs` |

Jay 2026-10-27: the showcase is structure, numbers and demos only. The story of how it was made
(requests, decisions, setbacks) is kept privately for Jay, not on the site.

The views are `public/views/*.mjs`; `public/shell.mjs` holds what they share. The look is the kit's
(`Shared-Proxy/kit`), with the showcase's own `public/showcase.css`.

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

To preview, serve a folder that holds `Orbit-Showcase -> public` and `Shared-Proxy` side by side,
then open `/Orbit-Showcase/`.
