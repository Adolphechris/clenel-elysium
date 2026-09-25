const test = require('node:test');
const assert = require('node:assert');
const {
  EncryptedSyncManager,
  SYNC_ALGORITHM,
  canonicalize,
  digestOf
} = require('../dist/lib/encrypted-sync');

function makeRecord(overrides = {}) {
  return {
    recordId: 'LOC-001',
    collection: 'grades',
    deviceId: 'DEV-A',
    updatedAtUTC: '2026-09-19T10:00:00.000Z',
    deleted: false,
    payload: { studentId: 'ST-001', pointsObtenus: 42, pointsMaxima: 50 },
    ...overrides
  };
}

test.beforeEach(() => {
  EncryptedSyncManager.resetAllState();
});

test('Chiffrement: produit une enveloppe AES-256-GCM complète', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const envelope = mgr.encrypt({ cote: 42 });

  assert.strictEqual(envelope.algorithm, SYNC_ALGORITHM);
  assert.strictEqual(envelope.version, 1);
  assert.strictEqual(Buffer.from(envelope.ciphertext, 'base64').length > 0, true);
  assert.strictEqual(Buffer.from(envelope.iv, 'base64').length, 12);
  assert.strictEqual(Buffer.from(envelope.authTag, 'base64').length, 16);
  assert.strictEqual(envelope.keyId, mgr.getKeyFingerprint());
  assert.strictEqual(envelope.ciphertext.includes('42'), false, 'le contenu ne doit jamais fuir en clair');
});

test('Chiffrement: le déchiffrement restitue la charge utile exacte', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const payload = { studentId: 'ST-001', grades: [12, 15, 8], nested: { ok: true } };

  const envelope = mgr.encrypt(payload);
  assert.deepStrictEqual(mgr.decrypt(envelope), payload);
});

test('Chiffrement: deux chiffrements du même contenu donnent des enveloppes différentes', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const a = mgr.encrypt({ valeur: 1 });
  const b = mgr.encrypt({ valeur: 1 });

  assert.notStrictEqual(a.ciphertext, b.ciphertext);
  assert.notStrictEqual(a.iv, b.iv);
  assert.deepStrictEqual(mgr.decrypt(a), mgr.decrypt(b));
});

test('Chiffrement: détecte toute altération du contenu chiffré', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const envelope = mgr.encrypt({ cote: 42 });

  const tampered = { ...envelope, ciphertext: Buffer.from('cote:99').toString('base64') };
  assert.strictEqual(mgr.verifyEnvelope(tampered), false);
  assert.throws(() => mgr.decrypt(tampered), /DECHIFFREMENT_ECHEC/);
});

test('Chiffrement: détecte une clé maîtresse erronée', () => {
  const mgrA = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const mgrB = new EncryptedSyncManager({ deviceId: 'DEV-B', masterKey: 'autre-secret-2026' });
  const envelope = mgrA.encrypt({ secret: 'donnees' });

  assert.throws(() => mgrB.decrypt(envelope), /DECHIFFREMENT_ECHEC/);
});

test('Chiffrement: refuse un AAD différent (contexte authentifié)', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const envelope = mgr.encrypt({ secret: 1 }, 'contexte-A');
  assert.throws(() => mgr.decrypt(envelope, 'contexte-B'), /DECHIFFREMENT_ECHEC/);
});

test('Chiffrement: dérive une clé AES-256 déterministe (PBKDF2)', () => {
  const k1 = EncryptedSyncManager.deriveKey('phrase-secrete-elysium');
  const k2 = EncryptedSyncManager.deriveKey('phrase-secrete-elysium');
  const k3 = EncryptedSyncManager.deriveKey('phrase-secrete-autre');

  assert.strictEqual(k1.length, 32);
  assert.strictEqual(k1.toString('hex'), k2.toString('hex'));
  assert.notStrictEqual(k1.toString('hex'), k3.toString('hex'));
  assert.throws(() => EncryptedSyncManager.deriveKey('court'), /CLE_INVALIDE/);
});

test('Chiffrement: rejette une clé maîtresse brute de mauvaise taille', () => {
  assert.throws(
    () => new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: Buffer.alloc(8) }),
    /CLE_INVALIDE/
  );
});

test('Différentiel: n\'envoie que les changements postérieurs à la dernière révision', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const records = [
    makeRecord({ recordId: 'LOC-001', updatedAtUTC: '2026-09-19T08:00:00.000Z' }),
    makeRecord({ recordId: 'LOC-002', updatedAtUTC: '2026-09-19T12:00:00.000Z' }),
    makeRecord({ recordId: 'LOC-003', updatedAtUTC: '2026-09-19T18:00:00.000Z' })
  ];

  const differential = mgr.buildDifferential('grades', records, {
    sinceUTC: '2026-09-19T10:00:00.000Z',
    baseRevision: 7
  });

  assert.strictEqual(differential.recordCount, 2);
  assert.deepStrictEqual(differential.records.map(r => r.recordId), ['LOC-002', 'LOC-003']);
  assert.strictEqual(differential.baseRevision, 7);
  assert.strictEqual(differential.digest.length, 64);
});

test('Différentiel: sans révision initiale, tout est transmis', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const differential = mgr.buildDifferential('grades', [makeRecord()], { sinceUTC: null });

  assert.strictEqual(differential.recordCount, 1);
  assert.strictEqual(differential.sinceUTC, null);
});

test('Différentiel: filtre les collections étrangères et conserve les tombstones', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const differential = mgr.buildDifferential('grades', [
    makeRecord({ recordId: 'LOC-100', updatedAtUTC: '2026-09-19T11:00:00.000Z' }),
    makeRecord({ recordId: 'ROL-200', collection: 'rollCalls', updatedAtUTC: '2026-09-19T11:00:00.000Z' }),
    makeRecord({ recordId: 'LOC-101', deleted: true, updatedAtUTC: '2026-09-19T20:00:00.000Z' })
  ], { sinceUTC: '2026-09-19T10:00:00.000Z' });

  assert.deepStrictEqual(differential.records.map(r => r.recordId), ['LOC-100', 'LOC-101']);
  assert.strictEqual(differential.records[1].deleted, true);
});

test('Différentiel: la charge utile différentielle chiffrée est déchiffrable par l\'appareil porteur', () => {
  const sender = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'phrase-partagee-2026' });
  const receiver = new EncryptedSyncManager({ deviceId: 'DEV-B', masterKey: 'phrase-partagee-2026' });

  const envelope = sender.buildEncryptedDifferential('grades', [makeRecord()], { sinceUTC: null });
  const payload = receiver.decrypt(envelope, 'elysium-pwa-sync-v1:differential:grades');

  assert.strictEqual(payload.collection, 'grades');
  assert.strictEqual(payload.records[0].recordId, 'LOC-001');
});

test('Lot chiffré: chiffrement/déchiffrement de groupe avec empreinte', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const batch = mgr.encryptBatch('grades', [makeRecord(), makeRecord({ recordId: 'LOC-002' })]);

  assert.strictEqual(batch.recordCount, 2);
  assert.strictEqual(batch.algorithm, SYNC_ALGORITHM);
  assert.deepStrictEqual(mgr.decryptBatch(batch).map(r => r.recordId), ['LOC-001', 'LOC-002']);

  batch.envelopes.pop();
  assert.throws(() => mgr.decryptBatch(batch), /INTEGRITE_LOT_ECHEC/);
});

test('CRDT: fusion sans conflit quand les enregistrements sont identiques', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const result = mgr.merge([makeRecord()], [makeRecord({ deviceId: 'DEV-B' })]);

  assert.strictEqual(result.merged.length, 1);
  assert.strictEqual(result.conflicts.length, 0);
});

test('CRDT: Last-Writer-Wins sur les champs scalaires', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const local = makeRecord({
    deviceId: 'DEV-A',
    updatedAtUTC: '2026-09-19T15:00:00.000Z',
    payload: { studentId: 'ST-001', pointsObtenus: 42, pointsMaxima: 50 }
  });
  const remote = makeRecord({
    deviceId: 'DEV-B',
    updatedAtUTC: '2026-09-19T16:00:00.000Z',
    payload: { studentId: 'ST-001', pointsObtenus: 48, pointsMaxima: 50 }
  });

  const result = mgr.merge([local], [remote]);
  assert.strictEqual(result.merged[0].payload.pointsObtenus, 48);
  assert.strictEqual(result.conflicts[0].strategy, 'REMOTE_WINS');
  assert.deepStrictEqual(result.conflicts[0].divergingFields, ['pointsObtenus']);
});

test('CRDT: départage déterministe en cas d\'horodatage identique', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const local = makeRecord({ deviceId: 'DEV-A', payload: { pointsObtenus: 10, pointsMaxima: 20 } });
  const remote = makeRecord({ deviceId: 'DEV-Z', payload: { pointsObtenus: 20, pointsMaxima: 20 } });

  const result = mgr.merge([local], [remote]);
  assert.strictEqual(result.merged[0].deviceId, 'DEV-Z');
  assert.strictEqual(result.conflicts[0].strategy, 'REMOTE_WINS');

  // La fusion est commutative : l'ordre d'entrée ne change pas le résultat.
  const reversed = mgr.merge([remote], [local]);
  assert.strictEqual(reversed.merged[0].deviceId, 'DEV-Z');
});

test('CRDT: fusion ensembliste (union) sur les champs de type liste', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const local = makeRecord({
    deviceId: 'DEV-A',
    payload: { tags: ['absent', 'math'], pointsObtenus: 10, pointsMaxima: 20 }
  });
  const remote = makeRecord({
    deviceId: 'DEV-B',
    updatedAtUTC: '2026-09-19T16:00:00.000Z',
    payload: { tags: ['absent', 'retard'], pointsObtenus: 10, pointsMaxima: 20 }
  });

  const result = mgr.merge([local], [remote]);
  assert.deepStrictEqual(result.merged[0].payload.tags, ['absent', 'math', 'retard']);
  assert.strictEqual(result.conflicts[0].strategy, 'UNION_MERGE');
});

test('CRDT: un champ scalaire divergent annule la fusion ensembliste', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const local = makeRecord({ deviceId: 'DEV-A', payload: { tags: ['a'], pointsObtenus: 10 } });
  const remote = makeRecord({
    deviceId: 'DEV-B',
    updatedAtUTC: '2026-09-20T10:00:00.000Z',
    payload: { tags: ['b'], pointsObtenus: 18 }
  });

  const result = mgr.merge([local], [remote]);
  assert.strictEqual(result.conflicts[0].strategy, 'REMOTE_WINS');
  assert.deepStrictEqual(result.merged[0].payload.tags, ['b']);
});

test('CRDT: les tombstones (suppressions) sont irréversibles', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const localDelete = makeRecord({
    deviceId: 'DEV-A',
    updatedAtUTC: '2026-09-19T18:00:00.000Z',
    deleted: true
  });
  const remoteEdit = makeRecord({
    deviceId: 'DEV-B',
    updatedAtUTC: '2026-09-19T17:00:00.000Z',
    deleted: false
  });

  const result = mgr.merge([localDelete], [remoteEdit]);
  assert.deepStrictEqual(result.merged, []);
  assert.deepStrictEqual(result.tombstones, ['LOC-001']);
  assert.strictEqual(result.conflicts[0].strategy, 'LOCAL_WINS');
});

test('CRDT: une suppression plus ancienne qu\'une édition est réanimée', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const oldDelete = makeRecord({
    deviceId: 'DEV-A',
    updatedAtUTC: '2026-09-19T08:00:00.000Z',
    deleted: true
  });
  const newEdit = makeRecord({
    deviceId: 'DEV-B',
    updatedAtUTC: '2026-09-19T19:00:00.000Z',
    deleted: false
  });

  const result = mgr.merge([oldDelete], [newEdit]);
  assert.strictEqual(result.merged.length, 1);
  assert.strictEqual(result.merged[0].deleted, false);
});

test('CRDT: fusionne des ensembles disjoints sans perte ni doublon', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  const result = mgr.merge(
    [makeRecord({ recordId: 'LOC-A' }), makeRecord({ recordId: 'LOC-B' })],
    [makeRecord({ recordId: 'LOC-B', deviceId: 'DEV-B' }), makeRecord({ recordId: 'LOC-C' })]
  );

  assert.deepStrictEqual(result.merged.map(r => r.recordId), ['LOC-A', 'LOC-B', 'LOC-C']);
});

test('CRDT: la fusion chiffrée est directement transmissible', () => {
  const sender = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'phrase-partagee-2026' });
  const receiver = new EncryptedSyncManager({ deviceId: 'DEV-B', masterKey: 'phrase-partagee-2026' });

  const { merge, envelope } = sender.mergeAndEncrypt('grades', [makeRecord()], [
    makeRecord({ deviceId: 'DEV-B', updatedAtUTC: '2026-09-19T19:00:00.000Z', payload: { studentId: 'ST-001', pointsObtenus: 45, pointsMaxima: 50 } })
  ]);
  assert.strictEqual(merge.merged[0].payload.pointsObtenus, 45);

  const decrypted = receiver.decrypt(envelope, 'elysium-pwa-sync-v1:merge:grades');
  assert.strictEqual(decrypted.merged[0].payload.pointsObtenus, 45);
});

test('État de synchronisation: la révision n\'recule jamais', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  mgr.commitSyncState({ revision: 12, syncedDevices: ['DEV-B'] });
  const state = mgr.commitSyncState({ revision: 3, syncedDevices: ['DEV-C'] });

  assert.strictEqual(state.lastRevision, 12);
  assert.deepStrictEqual(state.syncedDevices, ['DEV-B', 'DEV-C']);
  assert.strictEqual(state.lastSyncUTC !== null, true);
});

test('État de synchronisation: alimente la révision de la différentielle', () => {
  const mgr = new EncryptedSyncManager({ deviceId: 'DEV-A', masterKey: 'mot-de-passe-elysium' });
  mgr.commitSyncState({ revision: 41, lastSyncUTC: '2026-09-19T10:00:00.000Z' });

  const differential = mgr.buildDifferential('grades', [
    makeRecord({ recordId: 'LOC-OLD', updatedAtUTC: '2026-09-19T09:00:00.000Z' }),
    makeRecord({ recordId: 'LOC-NEW', updatedAtUTC: '2026-09-19T11:00:00.000Z' })
  ]);

  assert.strictEqual(differential.baseRevision, 41);
  assert.deepStrictEqual(differential.records.map(r => r.recordId), ['LOC-NEW']);
});

test('Utilitaire: canonicalisation stable et empreinte SHA-256 déterministe', () => {
  assert.strictEqual(canonicalize({ b: 1, a: 2 }), '{"a":2,"b":1}');
  assert.strictEqual(digestOf({ a: 1, b: 2 }), digestOf({ b: 2, a: 1 }));
  assert.strictEqual(digestOf({ a: 1 }).length, 64);
  assert.notStrictEqual(digestOf({ a: 1 }), digestOf({ a: 2 }));
});
