const CACHE_NAME = 'anilbayram-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/A.ico'
];

// Install: Yeni cache oluştur ve dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => {
        console.log('Asset caching failed:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Eski cache'leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network First stratejisi — önce sunucudan çek, başarısız olursa önbellekten sun
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        // Başarılı yanıtı önbelleğe kaydet
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Ağ başarısız olursa önbellekten sun (offline desteği)
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/index.html');
        });
      })
  );
});
