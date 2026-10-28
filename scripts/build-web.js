// Copies the game into www/ for the Android app, with its fonts bundled so the app needs no internet.
// The web version on GitHub Pages is served straight from the repo root and doesn't use this.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'www');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
for (const f of ['gen.js', 'gen-worker.js', 'common.txt', 'words.txt', 'privacy.html']) fs.copyFileSync(path.join(root, f), path.join(out, f));

const fonts = [
  ['Bricolage Grotesque', 'bricolage-grotesque', [600, 800]],
  ['Figtree', 'figtree', [400, 500, 600, 700]],
  ['Jost', 'jost', [500, 600]],
];
let css = '';
for (const [family, pkg, weights] of fonts) for (const w of weights) {
  const file = `${pkg}-latin-${w}-normal.woff2`;
  fs.copyFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file), path.join(out, 'fonts', file));
  css += `@font-face { font-family: "${family}"; font-style: normal; font-weight: ${w}; font-display: swap; src: url(fonts/${file}) format("woff2"); }\n`;
}
fs.writeFileSync(path.join(out, 'fonts.css'), css);

// Swap the Google Fonts links for the bundled copy.
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const links = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/;
if (!links.test(html)) throw new Error('index.html font links changed: update scripts/build-web.js');
html = html.replace(links, '<link rel="stylesheet" href="fonts.css">');
// The app draws under Android's status and navigation bars; Capacitor reports their size in --safe-area-inset-*.
html = html.replace('</head>', `<style>
.wrap { padding-top: calc(14px + var(--safe-area-inset-top, env(safe-area-inset-top, 0px)));
  padding-bottom: calc(40px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))); }
</style>
</head>`);
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('Built www/');
