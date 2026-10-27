<p align="center">
  <img src="public/icons/icon-192.png" width="96" height="96" alt="">
</p>

<h1 align="center">Orbit Showcase</h1>

<p align="center">
  <b>Orbit explained for anyone.</b><br>
  <a href="https://jaypengx.com/showcase/"><b>jaypengx.com/showcase</b></a>
</p>

<p align="center">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES_modules-F7DF1E?logo=javascript&logoColor=000"> <img alt="GitHub" src="https://img.shields.io/badge/GitHub-Pages-24292F?logo=github&logoColor=fff"> <img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub_Actions-daily_stats-2088FF?logo=githubactions&logoColor=fff"> <img alt="Tests" src="https://img.shields.io/badge/Tests-node_--test-339933?logo=nodedotjs&logoColor=fff">
</p>

The Orbit family of apps, shown the way a page does better than a PDF: the structure, the numbers, and the apps themselves running. Open to everyone, on phones and computers, with no sign-in.

## What it shows

| Tab | What you see |
| --- | --- |
| 總覽 | The family of apps and the headline numbers |
| App | Each app's screens, and the app itself running on sample data with a guided tour |
| 架構 | How it's built, as small pictures: problem, idea, result |
| 數字 | When each app arrived, every day's updates, hours and code written |

## Stack

- Plain JavaScript (ES modules), HTML and CSS: no framework, no build step.
- The look comes from the shared kit in [Shared-Proxy](https://github.com/JayPengX/Shared-Proxy).
- The numbers recount themselves: a GitHub Actions run clones every Orbit repo daily and counts commits, lines, tests and days. Nothing is typed in by hand.
- Demos run on made-up sample data only.
- Hosted on GitHub Pages and served at jaypengx.com by a Cloudflare Worker.

## For developers

```bash
npm test
```

How it's put together and how to keep it true: **[MAP.md](MAP.md)**.
