/**
 * Service Worker — ELLYSIUM Espace Enseignant (Module 112 / Tome 7)
 * Généré par src/service-worker.ts — NE PAS ÉDITER MANUELLEMENT.
 * Verrous : VF-112-01 (fonctionnement hors-ligne), VF-112-03 (synchronisation).
 */
const CACHE_NAME = 'elysium-teacher-v1';
const OFFLINE_SHELL_URL = '/offline.html';
const OFFLINE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/styles.css",
  "/app.js",
  "/offline.html"
];
const API_PREFIXES = [
  "/api/",
  "https://elysium.cd/api/",
  "https://firebasestorage.googleapis.com/"
];
const STATIC_EXTENSIONS = [
  ".html",
  ".js",
  ".css",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
  ".woff",
  ".woff2",
  ".ico"
];

function extensionOf(url) {
  const clean = url.split('?')[0].split('#')[0];
  const lastDot = clean.lastIndexOf('.');
  const lastSlash = clean.lastIndexOf('/');
  return lastDot > lastSlash ? clean.slice(lastDot).toLowerCase() : '';
}

function resolveStrategy(url, requestMethod) {
  const method = requestMethod || 'GET';
  if (method !== 'GET' && method !== 'HEAD') return 'BYPASS';
  if (API_PREFIXES.some(prefix => url.startsWith(prefix))) return 'NETWORK_FIRST';
  if (url === OFFLINE_SHELL_URL) return 'OFFLINE_SHELL';
  if (STATIC_EXTENSIONS.includes(extensionOf(url))) return 'CACHE_FIRST';
  return 'NETWORK_FIRST';
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_ASSETS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Requêtes API : NETWORK_FIRST avec repli cache puis coquille hors-ligne
self.addEventListener('fetch', (event) => {
  const strategy = resolveStrategy(event.request.url, event.request.method);

  if (strategy === 'BYPASS') return;

  if (strategy === 'CACHE_FIRST') {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)
        .then(cached => cached || caches.match(OFFLINE_SHELL_URL)))
  );
});

// Message de mise à jour immediate depuis l'application
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
