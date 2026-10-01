/* ============================================================
   Service Worker — وِرْدِي PWA
   ⚠️ عند أي تعديل: غيّر CACHE_NAME أدناه
   ============================================================ */

const CACHE_NAME   = 'wirdi-v2609291431';
const OFFLINE_URL  = './offline.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  './more.html',
  './quran.html',
  './surah.html',
  './tafsir.html',
  './support.html',
  './athkar.html',
  './athkar-morning.html',
  './athkar-evening.html',
  './athkar-daily.html',
  './prayer.html',
  './prayer-settings.html',
  './tasbih.html',
  './zakat.html',
  './calendar.html',
  './amin.html',
  './favorites.html',
  './settings.html',
  './notifications.html',
  './stats.html',
  './offline.html',
  './manifest.json',

  './assets/css/style.css',
  './assets/css/header.css',
  './assets/css/index.css',
  './assets/css/quran.css',
  './assets/css/tafsir.css',
  './assets/css/athkar.css',
  './assets/css/tasbih.css',
  './assets/css/prayer.css',
  './assets/css/prayer-settings.css',
  './assets/css/zakat.css',
  './assets/css/calendar.css',
  './assets/css/amin.css',
  './assets/css/favorites.css',
  './assets/css/settings.css',
  './assets/css/stats.css',
  './assets/css/notifications.css',
  './assets/css/support.css',
  './assets/css/streak.css',
  './assets/css/smart-adhkar.css',
  './assets/css/smart-adhkar-sky.css',
  './assets/css/share-image.css',
  './assets/css/adhan.css',
  './assets/css/pwa.css',

  './assets/js/app.js',
  './assets/js/header.js',
  './assets/js/logo.js',
  './assets/js/seo.js',
  './assets/js/pwa.js',
  './assets/js/quran.js',
  './assets/js/surah.js',
  './assets/js/tafsir.js',
  './assets/js/support.js',
  './assets/js/smart-adhkar.js',
  './assets/js/adhan.js',
  './assets/js/notifications.js',
  './assets/js/index.js',
  './assets/js/streak.js',
  './assets/js/stats.js',
  './assets/js/athkar-core.js',
  './assets/js/athkar-data.js',
  './assets/js/athkar-morning.js',
  './assets/js/athkar-evening.js',
  './assets/js/athkar-daily.js',
  './assets/js/prayer.js',
  './assets/js/prayer-settings.js',
  './assets/js/tasbih.js',
  './assets/js/zakat.js',
  './assets/js/calendar.js',
  './assets/js/amin.js',
  './assets/js/favorites.js',
  './assets/js/settings.js',
  './assets/js/share-image.js',

  './assets/img/logo.png',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const failed = [];
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => { failed.push(url); })
        )
      ).then(() => {
        if (failed.length) {
          console.warn('[SW] ملفات لم تخزن (' + failed.length + '):', failed);
        } else {
          console.log('[SW] ✅ تم تخزين كل الملفات');
        }
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const accept = req.headers.get('accept') || '';

  if (accept.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
