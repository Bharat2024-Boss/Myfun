
const CACHE_NAME = 'kiddoland-v1';
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Quicksand:wght@400;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Don't cache API calls to Google GenAI as they require dynamic keys/responses
        if (event.request.url.includes('generativelanguage.googleapis.com')) {
          return fetchResponse;
        }
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Return a basic fallback if both cache and network fail
      return caches.match('./index.html');
    })
  );
});
