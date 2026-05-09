const CACHE_NAME = 'cie-pwa-cache-v1';
const ASSETS_TO_CACHE = ['/'];

self.addEventListener('install', (event) => {
  console.log('[SW] Install Event active');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate Event active');
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // DEBUG: Specifically track manifest requests
  if (url.pathname.includes('manifest.json')) {
    console.log(`[SW Debug] Fetching manifest: ${url.pathname}`);
  }

  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (url.pathname.includes('manifest.json')) {
          console.log(`[SW Debug] Manifest Response Status: ${response.status}, Type: ${response.type}, Content-Type: ${response.headers.get('content-type')}`);
        }

        if (!response || response.status !== 200) {
          return caches.match(event.request).then((cached) => cached || response);
        }
        return response;
      })
      .catch((err) => {
        if (url.pathname.includes('manifest.json')) {
          console.error(`[SW Debug] Manifest Fetch Failed:`, err);
        }
        return caches.match(event.request);
      })
  );
});