// Draws the app icon, splash screen and Play Store art into assets/. Run from the repo root: node scripts/make-art.js
// then npm run assets to turn them into every Android size.
const sharp = require('sharp');
const bg = `<defs><radialGradient id="g" cx="50%" cy="20%" r="80%"><stop offset="0" stop-color="#4a2e1e"/><stop offset="1" stop-color="#2a1a12"/></radialGradient></defs><rect width="1024" height="1024" fill="url(#g)"/>`;
// Two tiles: a face-down one behind, a face-up "?" in front. Drawn inside the adaptive-icon safe zone (center 66%).
const tiles = `<g transform="translate(512 512) scale(1.15) translate(-515 -530)">
<defs>
 <linearGradient id="back" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a6b3e"/><stop offset="1" stop-color="#6e4627"/></linearGradient>
 <linearGradient id="face" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e9c8"/><stop offset="1" stop-color="#e2c690"/></linearGradient>
 <filter id="s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".45"/></filter>
</defs>
<g transform="rotate(-12 430 470)" filter="url(#s)">
 <rect x="290" y="330" width="280" height="280" rx="34" fill="#4a2d17"/>
 <rect x="290" y="322" width="280" height="272" rx="34" fill="url(#back)"/>
 <text x="430" y="535" font-family="Inter Display" font-weight="800" font-size="190" text-anchor="middle" fill="rgba(255,236,205,.5)">?</text>
</g>
<g transform="rotate(8 600 600)" filter="url(#s)">
 <rect x="455" y="455" width="290" height="290" rx="36" fill="#a9844d"/>
 <rect x="455" y="447" width="290" height="282" rx="36" fill="url(#face)"/>
 <text x="592" y="660" font-family="Inter Display" font-weight="800" font-size="200" text-anchor="middle" fill="#2b1c10">R</text>
</g></g>`;
const svg = (w, h, inner) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`);
(async () => {
  await sharp(svg(1024, 1024, bg + tiles)).png().toFile('assets/icon-only.png');
  await sharp(svg(1024, 1024, tiles)).png().toFile('assets/icon-foreground.png');
  await sharp(svg(1024, 1024, bg)).png().toFile('assets/icon-background.png');
  const sp = `<defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#4a2e1e"/><stop offset="1" stop-color="#2a1a12"/></radialGradient></defs><rect width="2732" height="2732" fill="url(#g)"/><g transform="translate(854 774) scale(1)">${tiles}</g>
  <text x="1366" y="1960" font-family="Inter Display" font-weight="800" font-size="120" text-anchor="middle" fill="#f3e9d8">Reverse Tile Table</text>`;
  await sharp(svg(2732, 2732, sp)).png().toFile('assets/splash.png');
  await sharp(svg(2732, 2732, sp)).png().toFile('assets/splash-dark.png');
  await sharp(svg(512, 512, `<g transform="scale(.5)">${bg + tiles}</g>`)).png().toFile('assets/store-icon-512.png');
})();
(async () => {
  const fg = `<defs><radialGradient id="g" cx="30%" cy="40%" r="90%"><stop offset="0" stop-color="#4a2e1e"/><stop offset="1" stop-color="#2a1a12"/></radialGradient></defs><rect width="1024" height="500" fill="url(#g)"/>
  <g transform="translate(20 50) scale(.4)">${tiles}</g>
  <text x="440" y="220" font-family="Inter Display" font-weight="800" font-size="56" fill="#f3e9d8">Reverse Tile Table</text>
  <text x="440" y="280" font-family="Inter Display" font-weight="500" font-size="25" fill="#bba98f">The game is over. Every tile is face down.</text>
  <text x="440" y="316" font-family="Inter Display" font-weight="500" font-size="25" fill="#bba98f">Put them back where they were played.</text>`;
  await sharp(svg(1024, 500, fg)).png().toFile('assets/feature-graphic.png');
})();
