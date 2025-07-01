    const CACHE_NAME = 'suas-app-cache-v4'; // Versão incrementada para forçar a atualização
    const urlsToCache = [
      './',
      './index.html',
      './manifest.json',
      './favicon.ico',
      './icons/icon-144x144.png',
      './icons/icon-192x192.png',
      './icons/icon-512x512.png'
    ];

    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => {
            console.log('Cache aberta e a guardar ficheiros essenciais.');
            return cache.addAll(urlsToCache);
          })
      );
    });

    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            return response || fetch(event.request);
          })
      );
    });

    self.addEventListener('activate', event => {
      const cacheWhitelist = [CACHE_NAME];
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
    