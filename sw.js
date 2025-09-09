/**
 * ChakaBNB Service Worker
 * Basic caching and offline functionality
 */

const CACHE_NAME = 'chakabnb-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/search-results.html',
    '/property-detail.html',
    '/login.html',
    '/register.html',
    '/list-property.html',
    '/logo.png',
    '/js/security.js',
    '/js/error-handler.js',
    '/js/accessibility.js',
    '/js/seo-optimizer.js',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js',
    'https://unpkg.com/aos@2.3.1/dist/aos.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
