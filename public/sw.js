// Generic name so it doesn't conflict between different CIEs
const CACHE_NAME = 'cie-pwa-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  // We remove the specific manifest path here because
  // each CIE has a different manifest location.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// The most important part for the Install Button
self.addEventListener('fetch', (event) => {
  // Simple Network-First strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});