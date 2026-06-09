/**
 * Service Worker for AfroFlicks
 * Handles offline support, caching, and PWA functionality
 */

const CACHE_NAME = 'afroflicks-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/movie.html',
  '/search.html',
  '/genre.html',
  '/favorites.html',
  '/watchlater.html',
  '/about.html',
  '/privacy.html',
  '/404.html',
  '/assets/css/style.css',
  '/assets/js/config.js',
  '/assets/js/app.js',
  '/assets/js/index.js',
  '/assets/js/movie.js',
  '/assets/js/search.js',
  '/assets/js/genre.js',
  '/assets/js/favorites.js',
  '/assets/js/watchlater.js'
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('Cache addAll error:', err);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch event - serve from cache, fall back to network
 */
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip third-party API requests
  if (request.url.includes('themoviedb.org') || request.url.includes('youtube.com')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/404.html');
      })
    );
    return;
  }

  // Cache first for static assets
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          // Cache the response
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        });
      }).catch(() => {
        return caches.match('/404.html');
      })
    );
  } else {
    // Network first for API calls
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 404) {
            return caches.match('/404.html');
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).catch(() => {
            return caches.match('/offline.html') || caches.match('/index.html');
          });
        })
    );
  }
});

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  return url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.gif') ||
         url.includes('.svg') ||
         url.includes('.woff') ||
         url.includes('.woff2');
}

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(
      // Sync favorites when connection is restored
      Promise.resolve()
    );
  }
});

/**
 * Handle push notifications
 */
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/badge-72x72.png',
      tag: 'afroflicks-notification',
      requireInteraction: false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'AfroFlicks', options)
    );
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if app is already open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open it
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
