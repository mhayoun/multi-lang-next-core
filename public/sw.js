const CACHE_NAME = 'cie-pwa-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
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

// FIX 3: Improved Fetch Handler
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and same-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only return valid network responses
        // If we get an error or a redirect (like to the homepage), we check cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return caches.match(event.request).then((cached) => cached || response);
        }
        return response;
      })
      .catch(() => {
        // If the network is down completely, use the cache
        return caches.match(event.request);
      })
  );
});