// Generates placeholder product illustrations into public/products/*.svg.
// Replace any file with real photography of the same name (or update catalog.data.ts).
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../public/products/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const S = 1200;
const defs = `
<defs>
  <radialGradient id="bg" cx="50%" cy="38%" r="75%">
    <stop offset="0" stop-color="#1f1f1f"/><stop offset=".55" stop-color="#121212"/><stop offset="1" stop-color="#080808"/>
  </radialGradient>
  <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5f6368"/><stop offset=".2" stop-color="#f3f5f7"/><stop offset=".42" stop-color="#8e949a"/>
    <stop offset=".6" stop-color="#e6e9ec"/><stop offset=".82" stop-color="#555a60"/><stop offset="1" stop-color="#c7ccd1"/>
  </linearGradient>
  <linearGradient id="m2" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7a7f85"/><stop offset=".35" stop-color="#eef1f3"/><stop offset=".55" stop-color="#6b7076"/><stop offset="1" stop-color="#d5d9dd"/>
  </linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity=".7"/>
  </filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .05 0"/></filter>
</defs>`;

const frame = (body, view = `0 0 ${S} ${S}`) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="${S}" height="${S}">${defs}
<rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#bg)"/>
<ellipse cx="600" cy="1010" rx="380" ry="40" fill="#000" opacity=".55"/>
<g filter="url(#sh)">${body}</g>
<rect x="-2000" y="-2000" width="6000" height="6000" filter="url(#grain)"/>
<text x="${view.split(' ')[0] * 1 + 40}" y="${view.split(' ')[1] * 1 + view.split(' ')[3] * 1 - 40}" font-family="Georgia, serif" font-size="${view.split(' ')[3] / 60}" letter-spacing="4" fill="#A39F97" opacity=".55">ILLUSTRATION · PHOTO TO COME</text>
</svg>`;

const r = (n) => n.toFixed(1);

// Links laid along a U-shaped drape
function drape({ count, rx, ry, w, depth = 430, top = 250, twist = false }) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = 170 + t * 860;
    const y = top + depth * Math.sin(Math.PI * t);
    const dx = 860, dy = depth * Math.PI * Math.cos(Math.PI * t);
    const a = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (twist) {
      out += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${rx}" ry="${ry}" transform="rotate(${r(a + 35)} ${r(x)} ${r(y)})" fill="none" stroke="url(#m)" stroke-width="${w}"/>`;
    } else if (i % 2 === 0) {
      out += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${rx}" ry="${ry}" transform="rotate(${r(a)} ${r(x)} ${r(y)})" fill="none" stroke="url(#m)" stroke-width="${w}"/>`;
    } else {
      out += `<rect x="${r(x - rx)}" y="${r(y - w / 2)}" width="${rx * 2}" height="${w}" rx="${w / 2}" transform="rotate(${r(a)} ${r(x)} ${r(y)})" fill="url(#m2)"/>`;
    }
  }
  return out;
}

const ring = {
  signet: `
    <ellipse cx="600" cy="640" rx="300" ry="250" fill="none" stroke="url(#m)" stroke-width="74"/>
    <path d="M430 400 L770 400 L800 470 L400 470 Z" fill="url(#m2)"/>
    <rect x="440" y="330" width="320" height="90" rx="12" fill="url(#m)"/>
    <rect x="470" y="350" width="260" height="50" rx="6" fill="none" stroke="#2a2a2a" stroke-width="4" opacity=".6"/>`,
  fracture: `
    <ellipse cx="600" cy="600" rx="290" ry="290" fill="none" stroke="url(#m)" stroke-width="96"/>
    <path d="M560 300 L600 360 L585 410 L640 470 L610 520" fill="none" stroke="#0d0d0d" stroke-width="16" stroke-linejoin="bevel"/>
    <path d="M780 820 L740 760 L770 720 L720 690" fill="none" stroke="#0d0d0d" stroke-width="12" stroke-linejoin="bevel"/>`,
  orbit: `
    <ellipse cx="540" cy="600" rx="250" ry="250" fill="none" stroke="url(#m)" stroke-width="56"/>
    <ellipse cx="680" cy="600" rx="250" ry="250" fill="none" stroke="url(#m2)" stroke-width="56" transform="rotate(-12 680 600)"/>`,
};

const bracelet = {
  cuff: `<path d="M330 760 A300 260 0 1 1 870 760" fill="none" stroke="url(#m)" stroke-width="120" stroke-linecap="round"/>
    <path d="M330 760 A300 260 0 1 1 870 760" fill="none" stroke="#0e0e0e" stroke-width="6" stroke-dasharray="2 40" opacity=".5"/>`,
  links: (() => {
    let o = '';
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2, x = 600 + 300 * Math.cos(a), y = 600 + 260 * Math.sin(a);
      const deg = (a * 180) / Math.PI + 90;
      o += i % 2 === 0
        ? `<ellipse cx="${r(x)}" cy="${r(y)}" rx="62" ry="38" transform="rotate(${r(deg)} ${r(x)} ${r(y)})" fill="none" stroke="url(#m)" stroke-width="20"/>`
        : `<rect x="${r(x - 60)}" y="${r(y - 10)}" width="120" height="20" rx="10" transform="rotate(${r(deg)} ${r(x)} ${r(y)})" fill="url(#m2)"/>`;
    }
    return o;
  })(),
  torque: `<ellipse cx="600" cy="600" rx="320" ry="280" fill="none" stroke="url(#m)" stroke-width="64"/>
    <ellipse cx="600" cy="600" rx="320" ry="280" fill="none" stroke="#1a1a1a" stroke-width="64" stroke-dasharray="10 26" opacity=".45"/>
    <circle cx="600" cy="320" r="44" fill="url(#m2)"/>`,
};

const chainV = `<path d="M330 120 L600 520 L870 120" fill="none" stroke="url(#m2)" stroke-width="7" stroke-dasharray="16 6"/>`;
const pendant = {
  sigil: `${chainV}<path d="M600 540 A190 190 0 1 1 470 600" fill="none" stroke="url(#m)" stroke-width="54" stroke-linecap="round" transform="translate(0 150)"/>
    <path d="M600 640 L640 740 L600 840 L560 740 Z" fill="url(#m2)"/>`,
  blade: `${chainV}<path d="M600 520 C700 600 760 720 700 900 C680 820 640 760 600 740 C560 760 520 820 500 900 C440 720 500 600 600 520 Z" fill="url(#m)"/>
    <path d="M600 600 L625 690 L600 720 L575 690 Z" fill="#141414"/>`,
  crest: `${chainV}<path d="M600 530 C640 600 720 600 760 560 C740 660 680 700 640 720 L600 900 L560 720 C520 700 460 660 440 560 C480 600 560 600 600 530 Z" fill="url(#m)"/>
    <path d="M600 650 L620 720 L600 790 L580 720 Z" fill="#141414"/>`,
};

const art = {
  'cable-ballast-chain': drape({ count: 29, rx: 30, ry: 18, w: 10, depth: 460 }),
  'serpent-rope-chain': drape({ count: 46, rx: 22, ry: 11, w: 8, depth: 470, twist: true }),
  'monolith-signet': ring.signet,
  'fracture-band': ring.fracture,
  'orbit-ring': ring.orbit,
  'shackle-cuff': bracelet.cuff,
  'vertebra-bracelet': bracelet.links,
  'torque-bangle': bracelet.torque,
  'sigil-pendant': pendant.sigil,
  'blade-pendant': pendant.blade,
  'crest-pendant': pendant.crest,
};

for (const [slug, body] of Object.entries(art)) {
  writeFileSync(new URL(`${slug}.svg`, OUT), frame(body));
  // detail: same drawing, closer framing
  writeFileSync(new URL(`${slug}-detail.svg`, OUT), frame(body, '300 300 600 600'));
}
console.log('wrote', Object.keys(art).length * 2, 'svgs');
