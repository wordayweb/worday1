/* ============ Service Worker — وِرْدِي PWA ============ */

const CACHE_NAME = 'wirdi-v1';
const OFFLINE_URL = './offline.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  './athkar.html',
  './athkar-morning.html',
  './athkar-evening.html',
  './athkar-daily.html',
  './quran.html',
  './surah.html',
  './prayer.html',
  './prayer-settings.html',
  './tasbih.html',
  './amin.html',
  './calendar.html',
  './zakat.html',
  './favorites.html',
  './settings.html',
  './more.html',
  './404.html',
  './assets/css/style.css',
  './assets/css/header.css',
  './assets/css/quran.css',
  './assets/css/athkar.css',
  './assets/css/tasbih.css',
  './assets/css/prayer.css',
  './assets/css/prayer-settings.css',
  './assets/css/calendar.css',
  './assets/css/zakat.css',
  './assets/css/amin.css',
  './assets/css/favorites.css',
  './assets/css/settings.css',
  './assets/css/smart-adhkar.css',
  './assets/css/pwa.css',
  './assets/js/app.js',
  './assets/js/navbar.js',
  './assets/js/header.js',
  './assets/js/logo.js',
  './assets/js/seo.js',
  './assets/js/quran.js',
  './assets/js/surah.js',
  './assets/js/prayer.js',
  './assets/js/prayer-settings.js',
  './assets/js/athkar-data.js',
  './assets/js/athkar-core.js',
  './assets/js/athkar-morning.js',
  './assets/js/athkar-evening.js',
  './assets/js/athkar-daily.js',
  './assets/js/tasbih.js',
  './assets/js/amin.js',
  './assets/js/calendar.js',
  './assets/js/zakat.js',
  './assets/js/favorites.js',
  './assets/js/settings.js',
  './assets/js/smart-adhkar.js',
  './assets/js/pwa.js',
  './assets/img/logo.png',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 تخزين الملفات...');
        return cache.addAll(PRECACHE_URLS).catch(err => {
          console.warn('⚠️ بعض الملفات فشلت:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) return;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(request).then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      }).catch(() => {
        if (request.destination === 'document') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});