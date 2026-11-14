// Jay's homepage icons (public/home/): his J ringed by the family's moons, drawn once here and written as the SVG the browsers
// that can use it take, the PNGs Safari and iOS want, and favicon.ico for
// anything that asks the site's root. site.js serves them at the domain's
// root (/favicon.ico, /apple-touch-icon.png…). Run: node scripts/home-icons.mjs
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { APP_ORDER, BRANDS } from '../../Orbit-Core/kit/brand.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const out = new URL('../public/home/', import.meta.url);

// `square`: full bleed (iOS rounds the corners itself); otherwise rounded.
// Jay's own mark in the family's style (Jay 2026-11-14 "yes redraw"): the
// ten apps' moons, as Orbit's (Orbit-Core kit/brand.mjs), around a white J
// where Orbit has its planet.
const ringArc = (r, a0, a1) => {
  const at = d => [256 + r * Math.cos((d * Math.PI) / 180), 256 + r * Math.sin((d * Math.PI) / 180)].map(n => n.toFixed(2)).join(' ');
  return `M${at(a0)} A${r} ${r} 0 0 1 ${at(a1)}`;
};
const moons = APP_ORDER.map((id, i, all) => {
  const step = 360 / all.length;
  return `<path d="${ringArc(150, -90 + i * step + 10, -90 + (i + 1) * step - 10)}" fill="none" stroke="${BRANDS[id].paint?.[1] || BRANDS[id].color}" stroke-width="46" stroke-linecap="round"/>`;
}).join('');
const icon = ({ square = false } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
<linearGradient id="bg" x1="0.2" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#4f46e5"/><stop offset="0.5" stop-color="#2e1f86"/><stop offset="1" stop-color="#0c0a33"/></linearGradient>
<linearGradient id="j" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3ee"/></linearGradient>
</defs>
<rect width="512" height="512" rx="${square ? 0 : 116}" fill="url(#bg)"/>
${moons}
<path d="M300 184 V286 A44 44 0 0 1 212 286" fill="none" stroke="url(#j)" stroke-width="44" stroke-linecap="round"/>
</svg>
`;

// An .ico holding one PNG (every browser since IE Vista reads that).
function ico(png, size) {
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  head.writeUInt8(size, 6); head.writeUInt8(size, 7); head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
  head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
  return Buffer.concat([head, png]);
}

const browser = await chromium.launch();
const page = await browser.newPage();
const png = async (svg, size) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;background:transparent"><img style="width:${size}px;height:${size}px;display:block" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">`);
  return page.screenshot({ omitBackground: true, type: 'png' });
};
await writeFile(new URL('favicon.svg', out), icon());
const f32 = await png(icon(), 32);
await writeFile(new URL('favicon-32.png', out), f32);
await writeFile(new URL('favicon.ico', out), ico(f32, 32));
await writeFile(new URL('apple-touch-icon.png', out), await png(icon({ square: true }), 180));
await writeFile(new URL('icon-512.png', out), await png(icon({ square: true }), 512));
await browser.close();
console.log('wrote public/home/ icons');
