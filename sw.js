// Lets the game install as an app from Edge or Chrome and keep working offline.
// Network first, so a new version on GitHub Pages shows up on the next load; the saved copy is only used offline.
const CACHE = 'rtt-v1';
const CORE = ['./', 'index.html', 'config.js', 'gen.js', 'gen-worker.js', 'peerjs.min.js', 'common.txt', 'words.txt',
  'privacy.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !fonts) return; // online play and anything else goes straight to the network
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (fonts) { // fonts never change: saved copy first
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req); if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res;
    }
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return (await cache.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' && await cache.match('index.html')) || Response.error();
    }
  })());
});
