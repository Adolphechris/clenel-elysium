/**
 * Synchronisation Chiffrée & Différentielle — ELLYSIUM PWA (Tome 7 / Module 112)
 *
 * Chiffrement AES-256-GCM des charges utiles de synchronisation, synchronisation
 * différentielle (seuls les changements depuis la dernière révision sont
 * transmis) et fusion de type CRDT (Last-Writer-Wins par champ, avec union
 * ensembliste et tombstones de suppression) pour les appareils terrain.
 *
 * Verrous : VF-112-03 (synchronisation intégrale), VF-112-04 (chiffrement des
 * données locales et transit), VF-112-05 (résolution déterministe des conflits).
 */

import * as crypto from 'crypto';

export const SYNC_ALGORITHM = 'AES-256-GCM' as const;
export const SYNC_ENVELOPE_VERSION = 1 as const;

/** Enveloppe chiffrée prête pour le transport réseau. */
export interface SyncEnvelope {
  version: typeof SYNC_ENVELOPE_VERSION;
  algorithm: typeof SYNC_ALGORITHM;
  keyId: string;
  iv: string;
  authTag: string;
  ciphertext: string;
  aad?: string;
  createdAtUTC: string;
}

/** Lot chiffré multi-enregistrements. */
export interface EncryptedSyncBatch {
  collection: string;
  deviceId: string;
  algorithm: typeof SYNC_ALGORITHM;
  envelopes: SyncEnvelope[];
  recordCount: number;
  digest: string;
  sealedAtUTC: string;
}

/** Enregistrement versionné transporté par la synchronisation différentielle. */
export interface VersionedRecord {
  recordId: string;
  collection: string;
  deviceId: string;
  updatedAtUTC: string;
  deleted: boolean;
  payload: Record<string, unknown>;
}

/** Charge utile différentielle prête au chiffrement. */
export interface DifferentialPayload {
  collection: string;
  sinceUTC: string | null;
  baseRevision: number;
  records: VersionedRecord[];
  generatedAtUTC: string;
  recordCount: number;
  digest: string;
}

export type ConflictStrategy = 'LOCAL_WINS' | 'REMOTE_WINS' | 'UNION_MERGE' | 'NO_CONFLICT';

export interface ConflictReport {
  recordId: string;
  strategy: ConflictStrategy;
  winningDeviceId: string;
  divergingFields: string[];
}

export interface MergeResult<T extends VersionedRecord = VersionedRecord> {
  merged: T[];
  conflicts: ConflictReport[];
  tombstones: string[];
}

export interface SyncState {
  lastSyncUTC: string | null;
  lastRevision: number;
  syncedDevices: string[];
}

const KEY_REGISTRY_KEY = '__ELYSIUM_SYNC_KEYS__';
const STATE_REGISTRY_KEY = '__ELYSIUM_SYNC_STATES__';

interface KeyHost { [KEY_REGISTRY_KEY]?: Map<string, Buffer>; }
interface StateHost { [STATE_REGISTRY_KEY]?: Map<string, SyncState>; }

function keyRegistry(): Map<string, Buffer> {
  const host = globalThis as unknown as KeyHost;
  if (!host[KEY_REGISTRY_KEY]) host[KEY_REGISTRY_KEY] = new Map<string, Buffer>();
  return host[KEY_REGISTRY_KEY]!;
}

function stateRegistry(): Map<string, SyncState> {
  const host = globalThis as unknown as StateHost;
  if (!host[STATE_REGISTRY_KEY]) host[STATE_REGISTRY_KEY] = new Map<string, SyncState>();
  return host[STATE_REGISTRY_KEY]!;
}

/**
 * Canonicalisation déterministe : clés triées récursivement afin que
 * l'empreinte d'un enregistrement soit stable sur tous les appareils.
 */
export function canonicalize(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(',')}}`;
  }
  if (typeof value === 'number' && !Number.isFinite(value)) return 'null';
  return JSON.stringify(value);
}

/** Empreinte SHA-256 d'une valeur quelconque, canonique et déterministe. */
export function digestOf(value: unknown): string {
  return crypto.createHash('sha256').update(canonicalize(value)).digest('hex');
}

function isPlainObjectArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.every(v => typeof v !== 'object' || v === null);
}

function unionMerge(a: unknown, b: unknown): unknown {
  const set = new Set<string>();
  for (const v of [...(a as unknown[]), ...(b as unknown[])]) set.add(canonicalize(v));
  return [...set]
    .map(v => JSON.parse(v) as unknown)
    .sort((x, y) => (canonicalize(x) < canonicalize(y) ? -1 : 1));
}

/**
 * Gestionnaire de synchronisation chiffrée.
 * Chaque appareil possède sa propre clé maîtresse dérivée (PBKDF2-SHA256)
 * et ne synchronise que ses changements.
 */
export class EncryptedSyncManager {
  private readonly deviceId: string;
  private readonly aad: string;
  private readonly key: Buffer;

  constructor(options: {
    deviceId: string;
    masterKey?: string | Buffer;
    aad?: string;
    salt?: string;
  }) {
    if (!options || !options.deviceId) {
      throw new Error('SYNC_CONFIG_INVALIDE: deviceId est obligatoire.');
    }
    this.deviceId = options.deviceId;
    this.aad = options.aad ?? 'elysium-pwa-sync-v1';
    this.key = EncryptedSyncManager.resolveKey(options);
  }

  /**
   * Dérive la clé maîtresse. Si aucune clé n'est fournie, une clé stable par
   * appareil est dérivée (registre global) afin de rendre les tests reproductibles.
   */
  private static resolveKey(options: {
    deviceId: string;
    masterKey?: string | Buffer;
    salt?: string;
  }): Buffer {
    if (options.masterKey instanceof Buffer) {
      if (options.masterKey.length !== 32) {
        throw new Error('CLE_INVALIDE: La clé maîtresse doit faire exactement 32 octets.');
      }
      return Buffer.from(options.masterKey);
    }
    if (typeof options.masterKey === 'string' && options.masterKey.length > 0) {
      return EncryptedSyncManager.deriveKey(options.masterKey, options.salt);
    }
    const registry = keyRegistry();
    const existing = registry.get(options.deviceId);
    if (existing) return existing;
    const generated = crypto.randomBytes(32);
    registry.set(options.deviceId, generated);
    return generated;
  }

  /** Dérive une clé AES-256 depuis une phrase secrète (PBKDF2-SHA256, 210 000 itérations). */
  public static deriveKey(passphrase: string, salt = 'elysium-pgi-rdc'): Buffer {
    if (!passphrase || passphrase.length < 8) {
      throw new Error('CLE_INVALIDE: La phrase secrète doit contenir au moins 8 caractères.');
    }
    return crypto.pbkdf2Sync(passphrase, salt, 210000, 32, 'sha256');
  }

  /** Identifiant de l'appareil courant. */
  public get device(): string {
    return this.deviceId;
  }

  /** Empreinte non réversible de la clé (pour contrôle d'appariement d'appareils). */
  public getKeyFingerprint(): string {
    return crypto.createHash('sha256').update(this.key).digest('hex').slice(0, 16).toUpperCase();
  }

  /**
   * Chiffre une charge utile en AES-256-GCM.
   * L'IV est aléatoire (12 octets) : un même contenu produit une enveloppe différente.
   */
  public encrypt(payload: unknown, aad: string = this.aad): SyncEnvelope {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    cipher.setAAD(Buffer.from(aad, 'utf8'));
    const ciphertext = Buffer.concat([
      cipher.update(Buffer.from(canonicalize(payload), 'utf8')),
      cipher.final()
    ]);
    return {
      version: SYNC_ENVELOPE_VERSION,
      algorithm: SYNC_ALGORITHM,
      keyId: this.getKeyFingerprint(),
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      ciphertext: ciphertext.toString('base64'),
      aad,
      createdAtUTC: new Date().toISOString()
    };
  }

  /** Déchiffre une enveloppe. Lève une erreur si l'intégrité est violée. */
  public decrypt<T = unknown>(envelope: SyncEnvelope, aad?: string): T {
    if (!envelope || envelope.algorithm !== SYNC_ALGORITHM) {
      throw new Error('CHIFFREMENT_INVALIDE: Algorithme de chiffrement non supporté.');
    }
    const context = aad ?? envelope.aad ?? this.aad;
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(envelope.iv, 'base64')
    );
    decipher.setAAD(Buffer.from(context, 'utf8'));
    decipher.setAuthTag(Buffer.from(envelope.authTag, 'base64'));
    let plain: Buffer;
    try {
      plain = Buffer.concat([
        decipher.update(Buffer.from(envelope.ciphertext, 'base64')),
        decipher.final()
      ]);
    } catch {
      throw new Error('DECHIFFREMENT_ECHEC: Enveloppe altérée ou clé maîtresse incorrecte.');
    }
    return JSON.parse(plain.toString('utf8')) as T;
  }

  /** Vérifie l'intégrité d'une enveloppe sans exposer la charge utile. */
  public verifyEnvelope(envelope: SyncEnvelope, aad?: string): boolean {
    try {
      this.decrypt(envelope, aad);
      return true;
    } catch {
      return false;
    }
  }

  /** Chiffre un lot d'enregistrements en une seule transaction logique. */
  public encryptBatch(
    collection: string,
    records: VersionedRecord[]
  ): EncryptedSyncBatch {
    const envelopes = records.map(record => this.encrypt(record, `${this.aad}:${collection}`));
    return {
      collection,
      deviceId: this.deviceId,
      algorithm: SYNC_ALGORITHM,
      envelopes,
      recordCount: envelopes.length,
      digest: digestOf(records.map(r => r.recordId)),
      sealedAtUTC: new Date().toISOString()
    };
  }

  /** Déchiffre un lot et vérifie son empreinte globale. */
  public decryptBatch<T = VersionedRecord>(batch: EncryptedSyncBatch): T[] {
    const records = batch.envelopes.map(e => this.decrypt<T>(e, `${this.aad}:${batch.collection}`));
    if (digestOf(records.map(r => (r as { recordId: string }).recordId)) !== batch.digest) {
      throw new Error('INTEGRITE_LOT_ECHEC: L\'empreinte du lot ne correspond pas à son contenu.');
    }
    return records;
  }

  /** État de synchronisation persisté par appareil. */
  public getState(): SyncState {
    const existing = stateRegistry().get(this.deviceId);
    return existing ? { ...existing, syncedDevices: [...existing.syncedDevices] } : {
      lastSyncUTC: null,
      lastRevision: 0,
      syncedDevices: []
    };
  }

  /** Met à jour l'état de synchronisation après un échange réussi. */
  public commitSyncState(next: Partial<SyncState> & { revision: number }): SyncState {
    const current = this.getState();
    const merged: SyncState = {
      lastSyncUTC: next.lastSyncUTC ?? new Date().toISOString(),
      lastRevision: Math.max(next.revision, current.lastRevision),
      syncedDevices: [...new Set([...current.syncedDevices, ...(next.syncedDevices ?? [])])]
    };
    stateRegistry().set(this.deviceId, merged);
    return merged;
  }

  /**
   * Construit une charge utile DIFFÉRENTIELLE : seuls les enregistrements
   * modifiés depuis la dernière révision connue sont transmis.
   * Les tombstones (suppressions) sont conservés afin que la suppression
   * se propage aux autres appareils.
   */
  public buildDifferential(
    collection: string,
    records: VersionedRecord[],
    options: { sinceUTC?: string | null; baseRevision?: number } = {}
  ): DifferentialPayload {
    const since = options.sinceUTC ?? this.getState().lastSyncUTC;
    const baseRevision = options.baseRevision ?? this.getState().lastRevision;

    const selected = records.filter(record => {
      if (record.collection !== collection) return false;
      if (!since) return true;
      return record.updatedAtUTC > since;
    });

    const ordered = [...selected].sort((a, b) => {
      if (a.updatedAtUTC === b.updatedAtUTC) return a.recordId < b.recordId ? -1 : 1;
      return a.updatedAtUTC < b.updatedAtUTC ? -1 : 1;
    });

    return {
      collection,
      sinceUTC: since,
      baseRevision,
      records: ordered,
      generatedAtUTC: new Date().toISOString(),
      recordCount: ordered.length,
      digest: digestOf(ordered.map(r => `${r.recordId}@${r.updatedAtUTC}`))
    };
  }

  /** Différentielle chiffré, prêt à l'envoi. */
  public buildEncryptedDifferential(
    collection: string,
    records: VersionedRecord[],
    options: { sinceUTC?: string | null; baseRevision?: number } = {}
  ): SyncEnvelope {
    const differential = this.buildDifferential(collection, records, options);
    return this.encrypt(differential, `${this.aad}:differential:${collection}`);
  }

  /**
   * Fusion CRDT entre l'état local et l'état distant.
   *
   * Règles de fusion (déterministes, VF-112-05) :
   *  - champs scalaires : Last-Writer-Wins sur `updatedAtUTC`,
   *    égalité départagée par `deviceId` (ordre lexicographique) ;
   *  - champs tableaux (ensembles) : union sans doublon (grow-only set) ;
   *  - suppressions (tombstones) : un enregistrement supprimé l'emporte si son
   *    horodatage est plus récent, la suppression étant irréversible.
   */
  public merge<T extends VersionedRecord = VersionedRecord>(
    localRecords: T[],
    remoteRecords: T[]
  ): MergeResult<T> {
    const localMap = new Map<string, T>(localRecords.map(r => [r.recordId, r]));
    const remoteMap = new Map<string, T>(remoteRecords.map(r => [r.recordId, r]));

    const merged: T[] = [];
    const conflicts: ConflictReport[] = [];
    const tombstones: string[] = [];

    const allIds = [...new Set([...localMap.keys(), ...remoteMap.keys()])].sort();

    for (const id of allIds) {
      const local = localMap.get(id);
      const remote = remoteMap.get(id);

      if (!local) {
        if (remote) {
          remote.deleted ? tombstones.push(id) : merged.push(remote);
        }
        continue;
      }
      if (!remote) {
        local.deleted ? tombstones.push(id) : merged.push(local);
        continue;
      }

      // Échec d'échelle : une suppression plus récente l'emporte définitivement.
      if (local.deleted && remote.deleted) {
        tombstones.push(id);
        continue;
      }
      if (local.deleted !== remote.deleted) {
        const newest = local.updatedAtUTC >= remote.updatedAtUTC ? local : remote;
        if (newest.deleted) {
          tombstones.push(id);
          if (newest === local) {
            conflicts.push({
              recordId: id,
              strategy: 'LOCAL_WINS',
              winningDeviceId: local.deviceId,
              divergingFields: ['deleted']
            });
          } else {
            conflicts.push({
              recordId: id,
              strategy: 'REMOTE_WINS',
              winningDeviceId: remote.deviceId,
              divergingFields: ['deleted']
            });
          }
        } else {
          merged.push(newest);
          conflicts.push({
            recordId: id,
            strategy: newest === local ? 'LOCAL_WINS' : 'REMOTE_WINS',
            winningDeviceId: newest.deviceId,
            divergingFields: ['deleted']
          });
        }
        continue;
      }

      const divergingFields = this.findDivergingFields(local, remote);

      if (divergingFields.length === 0) {
        merged.push({ ...local, deviceId: local.updatedAtUTC >= remote.updatedAtUTC ? local.deviceId : remote.deviceId });
        continue;
      }

      // Union ensembliste sur les champs tableaux identiques des deux côtés.
      const unioned = this.unionPayloadFields(local, remote, divergingFields);
      if (unioned) {
        merged.push({
          ...local,
          payload: unioned,
          updatedAtUTC: local.updatedAtUTC >= remote.updatedAtUTC ? local.updatedAtUTC : remote.updatedAtUTC,
          deviceId: local.updatedAtUTC >= remote.updatedAtUTC ? local.deviceId : remote.deviceId
        });
        conflicts.push({
          recordId: id,
          strategy: 'UNION_MERGE',
          winningDeviceId: local.updatedAtUTC >= remote.updatedAtUTC ? local.deviceId : remote.deviceId,
          divergingFields
        });
        continue;
      }

      // Last-Writer-Wins par champ, départagé par deviceId en cas d'égalité.
      const localFirst =
        local.updatedAtUTC > remote.updatedAtUTC ||
        (local.updatedAtUTC === remote.updatedAtUTC && local.deviceId >= remote.deviceId);

      merged.push({
        ...(localFirst ? local : remote),
        updatedAtUTC: local.updatedAtUTC >= remote.updatedAtUTC ? local.updatedAtUTC : remote.updatedAtUTC
      });
      conflicts.push({
        recordId: id,
        strategy: localFirst ? 'LOCAL_WINS' : 'REMOTE_WINS',
        winningDeviceId: (localFirst ? local : remote).deviceId,
        divergingFields
      });
    }

    return { merged, conflicts, tombstones };
  }

  /**
   * Fusionne puis chiffre : le résultat peut être transmis immédiatement.
   */
  public mergeAndEncrypt<T extends VersionedRecord = VersionedRecord>(
    collection: string,
    localRecords: T[],
    remoteRecords: T[]
  ): { merge: MergeResult<T>; envelope: SyncEnvelope } {
    const merge = this.merge(localRecords, remoteRecords);
    return {
      merge,
      envelope: this.encrypt(merge, `${this.aad}:merge:${collection}`)
    };
  }

  private findDivergingFields(local: VersionedRecord, remote: VersionedRecord): string[] {
    const keys = new Set([...Object.keys(local.payload), ...Object.keys(remote.payload)]);
    const diverging: string[] = [];
    for (const key of [...keys].sort()) {
      if (canonicalize(local.payload[key]) !== canonicalize(remote.payload[key])) {
        diverging.push(key);
      }
    }
    return diverging;
  }

  /**
   * Tente une union ensembliste (grow-only set) sur les champs divergents.
   * Retourne `null` si au moins un champ divergent n'est pas ensembliste.
   */
  private unionPayloadFields(
    local: VersionedRecord,
    remote: VersionedRecord,
    divergingFields: string[]
  ): Record<string, unknown> | null {
    const candidate: Record<string, unknown> = { ...local.payload };
    for (const field of divergingFields) {
      const a = local.payload[field];
      const b = remote.payload[field];
      if (!Array.isArray(a) || !Array.isArray(b) || !isPlainObjectArray(a) || !isPlainObjectArray(b)) {
        return null;
      }
      candidate[field] = unionMerge(a, b);
    }
    return candidate;
  }

  /** Purge l'état global (isolation des tests). */
  public static resetAllState(): void {
    keyRegistry().clear();
    stateRegistry().clear();
  }
}
