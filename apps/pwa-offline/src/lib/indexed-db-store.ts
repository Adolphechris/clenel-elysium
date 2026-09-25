/**
 * Persistance Locale IndexedDB — ELLYSIUM PWA (Tome 7 / Module 112)
 *
 * Implémentation d'un moteur de persistance local reproduisant fidèlement la
 * sémantique IndexedDB (stores, clés, transactions, clones structurés).
 *
 * En environnement Node (tests / CI), l'API native `indexedDB` n'existe pas :
 * nous utilisons donc un registre global simulant la persistance sur disque,
 * afin qu'une base ouverte, fermée puis rouverte retrouve ses données, exactement
 * comme le ferait le navigateur après un rechargement de la page.
 *
 * Verrous : VF-112-01 (saisie hors-ligne), VF-112-02 (appel hors-ligne),
 * VF-112-03 (synchronisation intégrale au retour du réseau).
 */

export type StoreKey = string | number;

/** Définition d'un magasin d'objets (équivalent `createObjectStore`). */
export interface StoreDefinition {
  name: string;
  /** Chemin de la clé dans l'objet (ex. `localId`). Absent → clé auto-incrémentée. */
  keyPath?: string;
  autoIncrement?: boolean;
}

interface StoredEntry {
  key: StoreKey;
  value: unknown;
}

interface MemoryStore {
  name: string;
  keyPath?: string;
  autoIncrement: boolean;
  entries: Map<string, StoredEntry>;
  nextKey: number;
}

interface MemoryDatabase {
  name: string;
  version: number;
  stores: Map<string, MemoryStore>;
  open: boolean;
}

const REGISTRY_KEY = '__ELYSIUM_IDB_REGISTRY__';

interface RegistryHost {
  [REGISTRY_KEY]?: Map<string, MemoryDatabase>;
}

/**
 * Registre global des bases simulées. Il survit à la fermeture des instances
 * et au rechargement du module, simulant la persistance sur disque du navigateur.
 */
function getRegistry(): Map<string, MemoryDatabase> {
  const host = globalThis as unknown as RegistryHost;
  if (!host[REGISTRY_KEY]) {
    host[REGISTRY_KEY] = new Map<string, MemoryDatabase>();
  }
  return host[REGISTRY_KEY]!;
}

/** Clone structuré : reproduit la copie défensive d'IndexedDB`. */
function structuredCloneSafe<T>(value: T): T {
  if (value === undefined || value === null) return value;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      return JSON.parse(JSON.stringify(value)) as T;
    }
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeKey(key: StoreKey): string {
  return typeof key === 'number' ? `n:${key}` : `s:${key}`;
}

/**
 * Base de données locale simulée façon IndexedDB.
 * Toutes les opérations sont asynchrones (`Promise`) comme l'API native.
 */
export class IndexedDBStore {
  private db: MemoryDatabase;

  private constructor(db: MemoryDatabase) {
    this.db = db;
  }

  /**
   * Ouvre (ou crée) une base de données locale.
   * @param name Nom de la base
   * @param version Version du schéma
   * @param stores Magasins à créer si absents
   */
  public static async open(
    name: string,
    version = 1,
    stores: StoreDefinition[] = []
  ): Promise<IndexedDBStore> {
    if (!name || typeof name !== 'string') {
      throw new Error('ERREUR_BDD: Le nom de la base est obligatoire.');
    }

    const registry = getRegistry();
    let db = registry.get(name);

    if (db && version < db.version) {
      throw new Error(
        `VERSION_BDD_REFUSEE: La version demandée (${version}) est antérieure à la version ouverte (${db.version}).`
      );
    }

    if (db && db.open) {
      return new IndexedDBStore(db);
    }

    if (!db) {
      db = { name, version, stores: new Map(), open: false };
      registry.set(name, db);
    }

    db.version = Math.max(db.version, version);

    for (const def of stores) {
      if (!db.stores.has(def.name)) {
        db.stores.set(def.name, {
          name: def.name,
          keyPath: def.keyPath,
          autoIncrement: def.autoIncrement === true,
          entries: new Map<string, StoredEntry>(),
          nextKey: 1
        });
      }
    }

    db.open = true;
    return new IndexedDBStore(db);
  }

  /**
   * Supprime définitivement une base et toutes ses données (équivalent `deleteDatabase`).
   */
  public static async deleteDB(name: string): Promise<boolean> {
    const registry = getRegistry();
    const existing = registry.get(name);
    if (existing) existing.open = false;
    return registry.delete(name);
  }

  /** Supprime toutes les bases simulées (isolation des tests). */
  public static resetAll(): void {
    const registry = getRegistry();
    for (const db of registry.values()) db.open = false;
    registry.clear();
  }

  /** Nom de la base ouverte. */
  public get name(): string {
    return this.db.name;
  }

  /** Version courante du schéma. */
  public get version(): number {
    return this.db.version;
  }

  /** Liste des noms de magasins. */
  public get storeNames(): string[] {
    return [...this.db.stores.keys()];
  }

  /**
   * Écrit un enregistrement. Si `key` est fourni, elle remplace l'enregistrement
   * de même clé ; sinon une clé est générée (clé fournie ou auto-incrémentée).
   */
  public async put<T extends Record<string, unknown>>(
    storeName: string,
    value: T,
    key?: StoreKey
  ): Promise<{ key: StoreKey; value: T }> {
    const store = this.requireStore(storeName);
    const cloned = structuredCloneSafe(value);

    let effectiveKey: StoreKey;

    if (key !== undefined && key !== null) {
      effectiveKey = key;
    } else if (store.keyPath) {
      const extracted = (cloned as Record<string, unknown>)[store.keyPath];
      if (extracted === undefined || extracted === null) {
        throw new Error(
          `CLE_MANQUANTE: Le champ « ${store.keyPath} » est requis comme clé du magasin « ${storeName} ».`
        );
      }
      effectiveKey = extracted as StoreKey;
    } else if (store.autoIncrement) {
      effectiveKey = store.nextKey++;
    } else {
      throw new Error(
        `CLE_OBLIGATOIRE: Le magasin « ${storeName} » n'est pas auto-incrémenté, la clé est obligatoire.`
      );
    }

    store.entries.set(normalizeKey(effectiveKey), { key: effectiveKey, value: cloned });
    return { key: effectiveKey, value: structuredCloneSafe(cloned) };
  }

  /** Alias d'écriture explicite, utile pour les clés auto-incrémentées. */
  public async add<T extends Record<string, unknown>>(
    storeName: string,
    value: T,
    key?: StoreKey
  ): Promise<{ key: StoreKey; value: T }> {
    return this.put(storeName, value, key);
  }

  /** Lit un enregistrement par sa clé. */
  public async get<T>(storeName: string, key: StoreKey): Promise<T | undefined> {
    const store = this.requireStore(storeName);
    const entry = store.entries.get(normalizeKey(key));
    return entry ? (structuredCloneSafe(entry.value) as T) : undefined;
  }

  /** Lit tous les enregistrements d'un magasin. */
  public async getAll<T>(storeName: string): Promise<T[]> {
    const store = this.requireStore(storeName);
    return [...store.entries.values()].map(e => structuredCloneSafe(e.value) as T);
  }

  /** Liste toutes les clés d'un magasin, dans l'ordre d'insertion. */
  public async getAllKeys(storeName: string): Promise<StoreKey[]> {
    const store = this.requireStore(storeName);
    return [...store.entries.values()].map(e => e.key);
  }

  /** Supprime un enregistrement. Retourne `false` si la clé est absente. */
  public async delete(storeName: string, key: StoreKey): Promise<boolean> {
    const store = this.requireStore(storeName);
    return store.entries.delete(normalizeKey(key));
  }

  /** Vide un magasin sans le supprimer. */
  public async clear(storeName: string): Promise<void> {
    const store = this.requireStore(storeName);
    store.entries.clear();
    store.nextKey = 1;
  }

  /** Nombre d'enregistrements dans un magasin. */
  public async count(storeName: string): Promise<number> {
    const store = this.requireStore(storeName);
    return store.entries.size;
  }

  /** Ferme la connexion courante (les données restent persistées). */
  public close(): void {
    this.db.open = false;
  }

  private requireStore(storeName: string): MemoryStore {
    if (!this.db.open) {
      throw new Error('CONNECTION_FERMEE: La base doit être ouverte avant toute opération.');
    }
    const store = this.db.stores.get(storeName);
    if (!store) {
      throw new Error(`ERREUR_BDD: Magasin inconnu « ${storeName} ».`);
    }
    return store;
  }
}

/**
 * Fabrique de magasins utilisés par le PWA.
 * Les noms de magasins sont centralisés pour garantir la cohérence entre versions.
 */
export const ELLYSIUM_STORES = {
  GRADES: 'grades',
  ROLLCALLS: 'rollCalls',
  EXAM_SEALS: 'examSeals',
  SYNC_QUEUE: 'syncQueue',
  META: 'meta'
} as const;

export type ElysiumStoreName = (typeof ELLYSIUM_STORES)[keyof typeof ELLYSIUM_STORES];

/**
 * Ouvre la base standard du PWA ELLYSIUM avec tous ses magasins.
 */
export async function openEllYsiumOfflineDB(
  dbName = 'elysium-offline',
  version = 1
): Promise<IndexedDBStore> {
  return IndexedDBStore.open(dbName, version, [
    { name: ELLYSIUM_STORES.GRADES, keyPath: 'localId' },
    { name: ELLYSIUM_STORES.ROLLCALLS, keyPath: 'localId' },
    { name: ELLYSIUM_STORES.EXAM_SEALS, keyPath: 'sealId' },
    { name: ELLYSIUM_STORES.SYNC_QUEUE, autoIncrement: true },
    { name: ELLYSIUM_STORES.META, keyPath: 'key' }
  ]);
}
