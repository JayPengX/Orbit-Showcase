# Orbit Showcase

Orbit explained for anyone: the nine apps, how the whole system works, and how it grew.
Jay's 自主學習 portfolio. Live at https://jaypengx.github.io/Orbit-Showcase/.

Open to everyone: no Orbit Pass and no Add to Home Screen step. It works on phones and on
computers (the one exception to the family's phones-only rule), in Safari and Chrome.

## The four tabs

| Tab | What it shows | Its data |
| --- | --- | --- |
| 總覽 | The family, the real numbers, Orbit in three sentences | `public/data/stats.json` |
| App | Each app's real screens in a phone frame, day one beside today, how it works | `public/lib/apps.mjs`, `public/shots/` |
| 架構 | The structure tree (problem → idea → result, technical names folded away) and the journey map (five everyday stories walked across the system) | `public/lib/tree.mjs`, `tree-apps.mjs`, `stories.mjs` |
| 歷程 | Where it began, the tools, Jay's decisions, the apps' birthdays, the big changes, how Jay works | `public/lib/history.mjs` |

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
