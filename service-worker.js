const CACHE_NAME = 'suas-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // URLs de CDNs - essenciais para o funcionamento offline
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  // Firebase SDKs - o cache pode ser complexo, mas guardamos os scripts principais
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-functions.js',
  // Ícones (adicione os caminhos para os seus ficheiros de ícones)
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Evento de Instalação: guarda os ficheiros essenciais em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Fetch: serve os ficheiros a partir da cache se disponíveis
self.addEventListener('fetch', event => {
  // Ignora pedidos para o Firestore, que precisam ser online
  if (event.request.url.includes('firestore.googleapis.com')) {
    return;
  }
    
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
