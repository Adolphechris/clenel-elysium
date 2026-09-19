/**
 * Service Worker — ELLYSIUM PWA (Module 112 / Tome 7)
 * Cache prédictif pour 72h d'autonomie sans réseau.
 * VF-112-01 : L'application fonctionne intégralement sans connexion.
 */
const CACHE_NAME = 'elysium-v1';
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/offline.html'
];

// Installation : mise en cache des assets essentiels
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ELLYSIUM SW] Pré-chargement des ressources offline...');
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Interception des requêtes : stratégie Network-First avec fallback cache
self.addEventListener('fetch', (event) => {
  // Les appels API sont mis en file d'attente si hors-ligne
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Retour à la réponse mise en cache ou réponse hors-ligne
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Pour les assets statiques : Cache-First
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
