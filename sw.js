const CACHE = 'gamechanger-v1';
const URLS = ['/', '/index.html', '/manifest.json', '/icon.svg', '/tracks.json', '/tracks/', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Normalize by stripping mode param for cache match
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const normalized = '/index.html';
    e.respondWith(
      caches.match(normalized).then(r => r || fetch(e.request))
    );
    return;
  }
  // Cache audio files on first fetch
  if (url.pathname.startsWith('/tracks/')) {
    e.respondWith(
      caches.open(CACHE).then(c =>
        c.match(e.request).then(r => r || fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; }))
      )
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => new Response('Offline', {status:503})))
  );
});
