/* ============================================================
   Service Worker — وِرْدِي PWA  (v2 — tolerant caching)
   ⚠️ عند أي تعديل: غيّر CACHE_NAME أدناه
   ============================================================ */

const CACHE_NAME   = 'wirdi-v2609292500';
const OFFLINE_URL  = './data/offline.html';

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
  './manifest.json',
  './assets/css/style.css',
  './assets/css/header.css',
  './assets/css/quran.css',
  './assets/css/tafsir.css',
  './assets/css/support.css',
  './assets/css/athkar.css',
  './assets/css/tasbih.css',
  './assets/css/prayer.css',
  './assets/css/prayer-settings.css',
  './assets/css/calendar.css',
  './assets/css/amin.css',
  './assets/css/favorites.css',
  './assets/css/settings.css',
  './assets/css/streak.css',
  './assets/css/smart-adhkar.css',
  './assets/css/zakat.css',
  './assets/css/pwa.css',
  './assets/js/app.js',
  './assets/js/header.js',
  './assets/js/navbar.js',
  './assets/js/logo.js',
  './assets/js/seo.js',
  './assets/js/pwa.js',
  './assets/js/quran.js',
  './assets/js/surah.js',
  './assets/js/tafsir.js',
  './assets/js/support.js',
  './assets/js/athkar-core.js',
  './assets/js/athkar-data.js',
  './assets/js/athkar-daily.js',
  './assets/js/athkar-morning.js',
  './assets/js/athkar-evening.js',
  './assets/js/prayer.js',
  './assets/js/prayer-settings.js',
  './assets/js/tasbih.js',
  './assets/js/zakat.js',
  './assets/js/calendar.js',
  './assets/js/favorites.js',
  './assets/js/settings.js',
  './assets/js/streak.js',
  './assets/img/logo.png',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png'
];

/* ---------- install (متسامح: كل ملف منفرد) ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const failed = [];
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => {
            failed.push(url);
          })
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

/* ---------- activate ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------- fetch ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const accept = req.headers.get('accept') || '';

  // صفحات HTML: Network-First مع احتياطي offline
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

  // أصول: Cache-First
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

/* ---------- messages ---------- */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});