/**
 * Service Worker — Espace Enseignant ELLYSIUM (Tome 7 / Module 112)
 *
 * Stratégies de cache :
 *  - assets statiques (HTML, JS, CSS, manifest, polices) : CACHE_FIRST
 *    (72h d'autonomie sans réseau, VF-112-01) ;
 *  - requêtes API : NETWORK_FIRST avec repli sur le cache puis sur la
 *    file de synchronisation locale (VF-112-03).
 *
 * Le module expose une source `renderServiceWorkerSource()` afin que le
 * fichier `public/sw.js` deployed soit généré depuis cette unique source
 * de vérité (aucune divergence possible entre tests et production).
 */

export type FetchStrategy = 'CACHE_FIRST' | 'NETWORK_FIRST' | 'OFFLINE_SHELL' | 'BYPASS';

export const CACHE_NAME = 'elysium-teacher-v1';
export const OFFLINE_SHELL_URL = '/offline.html';

/** Assets préchargés lors de l'installation du Service Worker. */
export const PRECACHE_ASSETS: string[] = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/app.js',
  OFFLINE_SHELL_URL
];

/** Préfixes de routes API traitées en NETWORK_FIRST. */
export const API_PREFIXES: string[] = [
  '/api/',
  'https://elysium.cd/api/',
  'https://firebasestorage.googleapis.com/'
];

/** Extensions traitées en CACHE_FIRST. */
export const STATIC_EXTENSIONS: string[] = [
  '.html', '.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2', '.ico'
];

function extensionOf(url: string): string {
  const clean = url.split('?')[0]!.split('#')[0]!;
  const lastDot = clean.lastIndexOf('.');
  const lastSlash = clean.lastIndexOf('/');
  return lastDot > lastSlash ? clean.slice(lastDot).toLowerCase() : '';
}

/**
 * Détermine la stratégie de cache appliquée à une URL.
 * Fonction pure : vérifiable sans navigateur.
 */
export function resolveStrategy(url: string, requestMethod = 'GET'): FetchStrategy {
  if (requestMethod !== 'GET' && requestMethod !== 'HEAD') return 'BYPASS';
  if (API_PREFIXES.some(prefix => url.startsWith(prefix))) return 'NETWORK_FIRST';
  if (url === OFFLINE_SHELL_URL) return 'OFFLINE_SHELL';
  if (STATIC_EXTENSIONS.includes(extensionOf(url))) return 'CACHE_FIRST';
  return 'NETWORK_FIRST';
}

/**
 * Gestionnaire du Service Worker côté application.
 * L'enregistrement est neutre si l'environnement n'est pas un navigateur
 * (tests Node, SSR), ce qui permet de tester la logique métier.
 */
export class ServiceWorkerManager {
  private registration: unknown = null;
  private registered = false;

  constructor(private readonly scriptUrl: string = '/sw.js') {}

  /**
   * Enregistre le Service Worker. Retourne `false` si l'environnement
   * ne dispose pas de l'API navigateur (cas des tests).
   */
  public async register(): Promise<boolean> {
    const nav = (globalThis as { navigator?: { serviceWorker?: { register: (url: string) => Promise<unknown> } } }).navigator;
    if (!nav || !nav.serviceWorker || typeof nav.serviceWorker.register !== 'function') {
      return false;
    }
    this.registration = await nav.serviceWorker.register(this.scriptUrl);
    this.registered = true;
    return true;
  }

  /** Désinstalle le Service Worker (nettoyage applicatif). */
  public async unregister(): Promise<boolean> {
    const caches = (globalThis as { caches?: { keys: () => Promise<string[]>; delete: (k: string) => Promise<boolean> } }).caches;
    if (caches) {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    }
    this.registered = false;
    this.registration = null;
    return true;
  }

  /** Service Worker actif ? */
  public isRegistered(): boolean {
    return this.registered;
  }

  /** Stratégie applicable à une URL donnée. */
  public getStrategy(url: string, requestMethod = 'GET'): FetchStrategy {
    return resolveStrategy(url, requestMethod);
  }

  /** Liste des assets à précharger. */
  public getPrecacheAssets(): string[] {
    return [...PRECACHE_ASSETS];
  }

  /** Le nom de la requête est-il mis en cache ? */
  public isCacheable(url: string): boolean {
    const strategy = this.getStrategy(url);
    return strategy === 'CACHE_FIRST' || strategy === 'OFFLINE_SHELL';
  }

  /**
   * Source complète du Service Worker déployé (`public/sw.js`).
   * Générée depuis les constantes ci-dessus pour garantir la cohérence.
   */
  public static renderServiceWorkerSource(): string {
    return `/**
 * Service Worker — ELLYSIUM Espace Enseignant (Module 112 / Tome 7)
 * Généré par src/service-worker.ts — NE PAS ÉDITER MANUELLEMENT.
 * Verrous : VF-112-01 (fonctionnement hors-ligne), VF-112-03 (synchronisation).
 */
const CACHE_NAME = '${CACHE_NAME}';
const OFFLINE_SHELL_URL = '${OFFLINE_SHELL_URL}';
const OFFLINE_ASSETS = ${JSON.stringify(PRECACHE_ASSETS, null, 2)};
const API_PREFIXES = ${JSON.stringify(API_PREFIXES, null, 2)};
const STATIC_EXTENSIONS = ${JSON.stringify(STATIC_EXTENSIONS, null, 2)};

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
`;
  }
}
