// Every screenshot's content stamp (public/lib/shot-v.mjs), put on its URL so a
// retaken shot is never shown from a phone's cache (the service worker keeps
// pictures and shows a kept one first). Run after the shots change;
// tools/store-shots.mjs --apply runs it, and the tests fail when it's stale.
//   node scripts/shot-versions.mjs [--check]
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const dir = new URL('../public/shots/', import.meta.url).pathname;
const out = new URL('../public/lib/shot-v.mjs', import.meta.url).pathname;
const walk = d => readdirSync(join(dir, d), { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.webp') ? [join(d, e.name)] : []));
const v = Object.fromEntries(walk('').sort().map(f => [f.replace(/\.webp$/, ''), createHash('sha1').update(readFileSync(join(dir, f))).digest('hex').slice(0, 8)]));
const text = `// Made by scripts/shot-versions.mjs: each screenshot's content stamp, for its URL.\nexport const SHOT_V = ${JSON.stringify(v, null, 0).replace(/,"/g, ',\n  "').replace(/^\{/, '{\n  ').replace(/\}$/, '\n}')};\n`;
if (process.argv.includes('--check')) {
  if (!existsSync(out) || readFileSync(out, 'utf8') !== text) (console.error('public/lib/shot-v.mjs is stale: node scripts/shot-versions.mjs'), process.exit(1));
} else writeFileSync(out, text);
