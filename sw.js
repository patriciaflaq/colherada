const CACHE_NAME = 'colherada-v35';
const ASSETS = [
  './index.html?share_target',  // share target
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for API calls, share target, and fonts
  if (e.request.mode === 'navigate' || e.request.url.includes('index.html') || e.request.url.includes('anthropic.com') || e.request.url.includes('fonts.googleapis') || e.request.url.includes('shared_url') || e.request.url.includes('shared_text')) {
    e.respondWith(
      // offline: colherada.com/ gera request para '/', que nao esta no cache —
      // cai para o index.html cacheado em vez de falhar
      fetch(e.request).catch(() =>
        caches.match(e.request).then(cached => cached || caches.match('./index.html'))
      )
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
