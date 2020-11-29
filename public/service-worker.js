const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    '/index.js',
    '/indexedDB.js',
    '/manifest.webmanifest',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
];

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches
//             .open(PRECACHE)
//             .then((cache) => cache.addAll(FILES_TO_CACHE))
//             .then(self.skipWaiting())
//     );
// });

// // The activate handler takes care of cleaning up old caches.
// self.addEventListener('activate', (event) => {
//     const currentCaches = [PRECACHE, RUNTIME];
//     event.waitUntil(
//         caches
//             .keys()
//             .then((cacheNames) => {
//                 return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
//             })
//             .then((cachesToDelete) => {
//                 return Promise.all(
//                     cachesToDelete.map((cacheToDelete) => {
//                         return caches.delete(cacheToDelete);
//                     })
//                 );
//             })
//             .then(() => self.clients.claim())
//     );
// });

// self.addEventListener('fetch', (event) => {
//     if (event.request.url.startsWith(self.location.origin)) {
//         event.respondWith(
//             caches.match(event.request).then((cachedResponse) => {
//                 if (cachedResponse) {
//                     return cachedResponse;
//                 }

//                 return caches.open(RUNTIME).then((cache) => {
//                     return fetch(event.request).then((response) => {
//                         return cache.put(event.request, response.clone()).then(() => {
//                             return response;
//                         });
//                     });
//                 });
//             })
//         );
//     }
// });

self.addEventListener('install', function(event) {
    console.log('used to register the service worker');
    event.waitUntil(
        caches.open(PRECACHE)
          .then(function(cache) {
            return cache.addAll(FILES_TO_CACHE)
          })
          .then(self.skipWaiting())
      )
})
  
self.addEventListener('fetch', function(event) {
    console.log('used to intercept requests so we can check for the file or data in the cache');
    event.respondWith(
        fetch(event.request)
          .catch(() => {
            return caches.open(PRECACHE)
              .then((cache) => {
                return cache.match(event.request)
              })
          })
    )
})
  
self.addEventListener('activate', function(event) {
    console.log('this event triggers when the service worker activates');
    event.waitUntil(
        caches.keys()
          .then((keyList) => {
            return Promise.all(keyList.map((key) => {
              if (key !== PRECACHE) {
                console.log('[ServiceWorker] Removing old cache', key)
                return caches.delete(key)
              }
            }))
          })
          .then(() => self.clients.claim())
    )
})