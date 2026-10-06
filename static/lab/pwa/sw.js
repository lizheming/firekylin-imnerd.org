var cacheKey = 'v1';
self.addEventListener('install', function (event) {
  event.waitUntil(fetch('/').then(function (response) {
    caches.open(cacheKey).then(function (cache) {
      cache.put('/', response);
      self.skipWaiting();
    });
  }));
});

self.addEventListener('activate', function () {
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  
});
