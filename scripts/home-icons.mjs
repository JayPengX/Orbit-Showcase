// Jay's homepage icons (public/home/): the planet with its ring and three
// app-coloured moons, drawn once here and written as the SVG the browsers
// that can use it take, the PNGs Safari and iOS want, and favicon.ico for
// anything that asks the site's root. site.js serves them at the domain's
// root (/favicon.ico, /apple-touch-icon.png…). Run: node scripts/home-icons.mjs
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)('playwright');
const out = new URL('../public/home/', import.meta.url);

// `square`: full bleed (iOS rounds the corners itself); otherwise rounded.
const icon = ({ square = false } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
<defs>
<linearGradient id="bg" x1="0.2" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#3730a3"/><stop offset="0.55" stop-color="#1e1b4b"/><stop offset="1" stop-color="#020617"/></linearGradient>
<radialGradient id="ball" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#e0e7ff"/><stop offset="0.45" stop-color="#818cf8"/><stop offset="1" stop-color="#3730a3"/></radialGradient>
<clipPath id="front"><rect x="0" y="64" width="128" height="64"/></clipPath>
</defs>
<rect width="128" height="128" rx="${square ? 0 : 28}" fill="url(#bg)"/>
<g transform="rotate(-18 64 64)">
<ellipse cx="64" cy="64" rx="50" ry="15" fill="none" stroke="#c7d2fe" stroke-opacity="0.55" stroke-width="4"/>
<circle cx="64" cy="64" r="25" fill="url(#ball)"/>
<ellipse cx="64" cy="64" rx="50" ry="15" fill="none" stroke="#e0e7ff" stroke-width="4" clip-path="url(#front)"/>
<circle cx="16" cy="60" r="6" fill="#f97316"/>
<circle cx="104" cy="74" r="7" fill="#10b981"/>
<circle cx="96" cy="52" r="4.5" fill="#db2777"/>
</g>
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
