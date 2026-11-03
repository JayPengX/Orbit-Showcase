# Working on Orbit Showcase

Read `../Orbit-Core/CLAUDE.md` first: the family's map (the kit, the Workers and their APIs,
data and sync, the component patterns) and the rules to read before any work
(`../Orbit-Core/docs/RULEBOOK.md`, `TRUTH.md`, `DESIGN.md`). Before writing a helper or a
component, look for it in the kit: `node ../Orbit-Core/tools/kit-find.mjs <word>`.
MAP.md is this repo's map (README.md is the short public front page).

- A change to how this app is built (a module, a data or sync path, a pattern) updates MAP.md
  in the same push; anything the kit or a Worker gains goes into `../Orbit-Core/CLAUDE.md`.
- Push with `sh ../Orbit-Core/tools/push.sh`: it rebases onto `origin/main`, runs what the deploy runs (tests against main's kit), and pushes main only if they pass (a red deploy mails Jay).
- Audience: teachers and readers who know no tech. Plain everyday words, problem → idea → result,
  and technical names only inside the 技術細節 fold. Chinese first, English second.
- Exceptions to the family rules: open to all (no Pass gate, no installGate), and its own side bar
  on computers (900px wide, over 520 tall) in place of the kit's tab rail. Pages lay out by the
  page's width (`@container page`, wide from 560px), never the screen's. Check WebKit and Chromium
  on every screen: phone upright and on its side, tablet, computer.
- Honest framing: Jay sets the direction, the standards and the judgement calls; Claude does the typing.
  Every number comes from git (`scripts/stats.mjs`), never estimated.
- No betting anywhere (Jay 2026-10-27); `tests/content.test.mjs` checks it.
- Update content only when Jay says "catch up the showcase"; the deploy recounts the numbers daily.
