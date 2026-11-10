// Turns the recordings (record.mjs) into the demos under public/demo/, each
// the app as its own deploy builds it today:
//   demo/<Repo>/            the app's own files (its whole site folder, but
//                           for big media folders: only the files the
//                           recording used), minified and addressed by
//                           their content like the real app's deploy
//                           (Orbit-Core kit/stamp-app.mjs), index.html with
//                           the demo's data and sandbox put first
//   demo/Orbit-Core/kit/    the kit, built the way the kit's own deploy
//                           builds it (kit/stamp.mjs: minified, hashed)
//   demo/_x/                every outside answer and picture, one file each
//   demo/_demo/<id>.js      the demo's data: its clock, place and answers
//   demo/_demo/shim.js      the sandbox (written by hand, not built)
// The deploy records and builds every demo again from each repo's main
// (scripts/demo/refresh.mjs), so a demo is the app as it is today.
// Nothing in a demo reaches outside the showcase or changes the live apps.
//   node scripts/demo/build.mjs [id…] [--repos dir]
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DEMOS } from './apps.mjs';

const args = process.argv.slice(2);
const r = args.indexOf('--repos');
const repos = resolve(r < 0 ? new URL('../../..', import.meta.url).pathname : args.splice(r, 2)[1]);
const ids = args.length ? args : Object.keys(DEMOS);
const site = new URL('../../public/demo/', import.meta.url).pathname;
const TOKEN = 'eyJkIjoiMDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWYifQ.preview';
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/gif': 'gif', 'application/json': 'json', 'text/javascript': 'js', 'text/css': 'css', 'audio/mpeg': 'mp3' };

// The kit, once, from the same repos the recordings were made with: its
// source with the demo's two changes, then built as its own deploy builds it.
const kitSrc = join(mkdtempSync(join(tmpdir(), 'demo-kit-')), 'kit');
cpSync(join(repos, 'Orbit-Core/kit'), kitSrc, { recursive: true, filter: p => !/\/(tests?|node_modules)(\/|$)|\.md$/.test(p) });
// The demos run on the proxy's own addresses, wherever the showcase is served.
const domain = join(kitSrc, 'domain.mjs');
writeFileSync(domain, readFileSync(domain, 'utf8').replace(/^export const DOMAIN = '[^']*';/m, "export const DOMAIN = '';"));
// No betting anywhere in the showcase (Jay): Money's help names the betting app beside Securities.
const help = join(kitSrc, 'help.mjs');
writeFileSync(help, readFileSync(help, 'utf8').replace('和 Securities、Longshot 的遊戲錢', '和 Securities 的遊戲錢').replace('play money in Securities and Longshot.', 'play money in Securities.'));
rmSync(join(site, 'Orbit-Core'), { recursive: true, force: true });
const stamp = (() => {
  try {
    return execFileSync('git', ['-C', join(repos, 'Orbit-Core'), 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'local';
  }
})();
execFileSync(process.execPath, [join(kitSrc, 'stamp.mjs'), join(site, 'Orbit-Core'), stamp], { stdio: 'inherit' });
const kitBuilt = JSON.parse(readFileSync(join(site, 'Orbit-Core/kit/version.json'), 'utf8'));
const { stampApp } = await import(pathToFileURL(join(kitSrc, 'stamp-app.mjs')).href);
mkdirSync(join(site, '_x'), { recursive: true });

for (const id of ids) {
  const demo = DEMOS[id];
  const rec = JSON.parse(readFileSync(join(repos, '.demo-records', `${id}.json`), 'utf8'));
  const from = join(repos, demo.repo, demo.dist || 'public');
  const to = join(site, demo.repo);
  rmSync(to, { recursive: true, force: true });
  const skip = demo.skip || [];
  cpSync(from, to, { recursive: true, filter: p => !skip.some(s => p.startsWith(join(from, s))) && !/\/sw\.js$/.test(p) });
  // Files the app's deploy builds (not in the repo), from the live site.
  for (const [f, url] of Object.entries(demo.built || {})) {
    const res = await fetch(url);
    if (res.ok) writeFileSync(join(to, f), Buffer.from(await res.arrayBuffer()));
  }
  // Files from a skipped folder the demo needs though the recording didn't ask for them.
  for (const f of demo.keep || []) (mkdirSync(dirname(join(to, f)), { recursive: true }), cpSync(join(from, f), join(to, f)));
  const answers = [];
  const items = {};
  const pics = {};
  const origin = new URL(rec.base).origin;
  for (const g of rec.got) {
    const body = Buffer.from(g.body, 'base64');
    const type = g.type.split(';')[0].trim();
    let url = g.url;
    if (url.startsWith(origin)) {
      const path = new URL(url).pathname;
      if (path === '/__ext') url = new URL(url).searchParams.get('u');
      else {
        // The app's and kit's own files: a big folder's file the recording used.
        const file = path.startsWith('/Orbit-Core/') ? join(site, path) : join(to, path.replace(/^\/[^/]+\//, ''));
        if (!existsSync(file) && g.status === 200) (mkdirSync(dirname(file), { recursive: true }), writeFileSync(file, body));
        continue;
      }
    }
    if (g.status >= 300 && g.status < 400) continue;
    // A batch through the proxy: kept item by item, since the app groups its
    // reads into batches by timing, never the same way twice.
    if (/\/sports-proxy$/.test(new URL(url).pathname) && new URL(url).searchParams.has('batch')) {
      const us = new URL(url).searchParams.getAll('u');
      // (A line each, { i, s, b }, or whole, { r: [{ s, b }…] }, as the preview answers.)
      const text = body.toString('utf8');
      const all = text.startsWith('{"r":') ? JSON.parse(text).r.map((x, i) => ({ ...x, i })) : text.split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
      for (const got of all) {
        if (got.s !== 200 || !us[got.i]) continue;
        const text = JSON.stringify(got.b);
        const name = `${createHash('sha1').update(text).digest('hex').slice(0, 16)}.json`;
        if (!existsSync(join(site, '_x', name))) writeFileSync(join(site, '_x', name), text);
        items[us[got.i]] = `../_x/${name}`;
      }
      continue;
    }
    const name = `${createHash('sha1').update(body).digest('hex').slice(0, 16)}.${EXT[type] || 'bin'}`;
    if (!existsSync(join(site, '_x', name))) writeFileSync(join(site, '_x', name), body);
    if (/^image\/|^text\/css|javascript/.test(type) && g.method === 'GET') pics[url] = `../_x/${name}`;
    answers.push([g.method, url, g.post || '', g.status, g.type, `../_x/${name}`]);
    const single = new URL(url);
    if (g.status === 200 && /\/sports-proxy$/.test(single.pathname) && single.searchParams.get('url')) {
      const trim = single.searchParams.get('trim');
      items[trim ? `${trim}!${single.searchParams.get('url')}` : single.searchParams.get('url')] ??= `../_x/${name}`;
    }
  }
  // (liveMap: the map the real app shows, asked of the proxy when the demo opens; shim.js)
  const data = { at: rec.at, geo: demo.geo, ua: demo.ua, wall: demo.wall, token: TOKEN, stores: demo.stores || [], answers, items, pics, ...(demo.liveMap ? { liveMap: 'https://api.jaypengx.com/transit/showcase-map' } : {}) };
  writeFileSync(join(site, '_demo', `${id}.js`), `window.__DEMO=${JSON.stringify(data)};\n`);
  // Minified and addressed by content like the real app's deploy, its kit's
  // files listed for modulepreload: the demo opens as fast as the app.
  await stampApp({ root: to, version: `demo-${rec.at}`, kitDir: kitSrc, kit: { version: kitBuilt.version, files: kitBuilt.files } });
  const index = join(to, 'index.html');
  const html = readFileSync(index, 'utf8');
  // (the page's version and version.json the same, whatever the app's build wrote: never "a newer deploy", never a reload)
  const built = html.match(/<meta name="build-version" content="([^"]*)"/)?.[1];
  if (built) writeFileSync(join(to, 'version.json'), `${JSON.stringify({ version: built })}\n`);
  const style = demo.css ? `<style>${demo.css}</style>` : '';
  writeFileSync(index, html.replace(/<head>/i, `<head><script src="../_demo/${id}.js"></script><script src="../_demo/shim.js"></script><meta name="robots" content="noindex">${style}`));
  console.log(`${id}: ${answers.length} answers, ${Object.keys(items).length} proxy reads, ${Object.keys(pics).length} pictures`);
}

// Answers no demo uses any more (an earlier recording's) go.
const used = new Set(readdirSync(join(site, '_demo')).flatMap(f => readFileSync(join(site, '_demo', f), 'utf8').match(/_x\/[\w.]+/g) || []).map(x => x.slice(3)));
for (const f of readdirSync(join(site, '_x'))) if (!used.has(f)) rmSync(join(site, '_x', f));
