const CACHE_NAME = 'suas-app-cache-v3'; // Versão incrementada para forçar a atualização
const urlsToCache = [
  './', // O '.' é importante para o GitHub Pages
  './index.html',
  './manifest.json'
  // Linhas dos ícones removidas para garantir que a cache seja criada com sucesso.
];

// Evento de Instalação: guarda os ficheiros essenciais em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberta e atualizada');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Fetch: serve os ficheiros a partir da cache se disponíveis
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrarmos na cache, retornamos
        if (response) {
          return response;
        }
        // Caso contrário, fazemos o pedido à rede
        return fetch(event.request);
      }
    )
  );
});

// Evento de Ativação: limpa caches antigas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('A limpar cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
