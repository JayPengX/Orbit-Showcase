// Turns the recordings (record.mjs) into the frozen demos under public/demo/:
//   demo/<Repo>/            the app's own files as they were (its whole site
//                           folder, but for big media folders: only the files
//                           the recording used), index.html with the demo's
//                           data and sandbox put first
//   demo/Shared-Proxy/kit/  the kit, as it was (the apps load it from ../)
//   demo/_x/                every outside answer and picture, one file each
//   demo/_demo/<id>.js      the demo's data: its clock, place and answers
//   demo/_demo/shim.js      the sandbox (written by hand, not built)
// Nothing in a demo reaches outside the showcase or changes with the live apps.
//   node scripts/demo/build.mjs [id…] [--repos dir]
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { DEMOS } from './apps.mjs';

const args = process.argv.slice(2);
const r = args.indexOf('--repos');
const repos = resolve(r < 0 ? new URL('../../..', import.meta.url).pathname : args.splice(r, 2)[1]);
const ids = args.length ? args : Object.keys(DEMOS);
const site = new URL('../../public/demo/', import.meta.url).pathname;
const TOKEN = 'eyJkIjoiMDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWYifQ.preview';
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/gif': 'gif', 'application/json': 'json', 'text/javascript': 'js', 'text/css': 'css', 'audio/mpeg': 'mp3' };

// The kit, once, from the same repos the recordings were made with.
rmSync(join(site, 'Shared-Proxy'), { recursive: true, force: true });
cpSync(join(repos, 'Shared-Proxy/kit'), join(site, 'Shared-Proxy/kit'), { recursive: true, filter: p => !/\/(tests?|node_modules)(\/|$)|stamp-app\.mjs$|\.md$/.test(p) });
mkdirSync(join(site, '_x'), { recursive: true });

for (const id of ids) {
  const demo = DEMOS[id];
  const rec = JSON.parse(readFileSync(join(repos, '.demo-records', `${id}.json`), 'utf8'));
  const from = join(repos, demo.repo, demo.dist || 'public');
  const to = join(site, demo.repo);
  rmSync(to, { recursive: true, force: true });
  const skip = demo.skip || [];
  cpSync(from, to, { recursive: true, filter: p => !skip.some(s => p.startsWith(join(from, s))) && !/\/sw\.js$/.test(p) });
  // Files from a skipped folder the demo needs though the recording didn't ask for them.
  for (const f of demo.keep || []) (mkdirSync(dirname(join(to, f)), { recursive: true }), cpSync(join(from, f), join(to, f)));
  const answers = [];
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
        const file = path.startsWith('/Shared-Proxy/') ? join(site, path) : join(to, path.replace(/^\/[^/]+\//, ''));
        if (!existsSync(file) && g.status === 200) (mkdirSync(dirname(file), { recursive: true }), writeFileSync(file, body));
        continue;
      }
    }
    if (g.status >= 300 && g.status < 400) continue;
    const name = `${createHash('sha1').update(body).digest('hex').slice(0, 16)}.${EXT[type] || 'bin'}`;
    if (!existsSync(join(site, '_x', name))) writeFileSync(join(site, '_x', name), body);
    if (/^image\//.test(type) && g.method === 'GET') pics[url] = `../_x/${name}`;
    answers.push([g.method, url, g.post || '', g.status, g.type, `../_x/${name}`]);
  }
  const data = { at: rec.at, geo: demo.geo, token: TOKEN, stores: demo.stores || [], answers, pics };
  writeFileSync(join(site, '_demo', `${id}.js`), `window.__DEMO=${JSON.stringify(data)};\n`);
  const index = join(to, 'index.html');
  const html = readFileSync(index, 'utf8');
  writeFileSync(index, html.replace(/<head>/i, `<head><script src="../_demo/${id}.js"></script><script src="../_demo/shim.js"></script><meta name="robots" content="noindex">`));
  console.log(`${id}: ${answers.length} answers, ${Object.keys(pics).length} pictures`);
}

// Answers no demo uses any more (an earlier recording's) go.
const used = new Set(readdirSync(join(site, '_demo')).flatMap(f => readFileSync(join(site, '_demo', f), 'utf8').match(/_x\/[\w.]+/g) || []).map(x => x.slice(3)));
for (const f of readdirSync(join(site, '_x'))) if (!used.has(f)) rmSync(join(site, '_x', f));
