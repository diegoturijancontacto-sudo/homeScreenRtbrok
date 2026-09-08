const CACHE_NAME = 'mi-pwa-cache-v1';
const urlsToCache = [
  './',
  './mobile.html',
  './images/icon-192.png'
];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Interceptar peticiones para servir contenido desde la caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
