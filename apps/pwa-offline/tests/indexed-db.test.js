const test = require('node:test');
const assert = require('node:assert');
const {
  IndexedDBStore,
  openEllYsiumOfflineDB,
  ELLYSIUM_STORES
} = require('../dist/lib/indexed-db-store');

test.beforeEach(() => {
  IndexedDBStore.resetAll();
});

test('IndexedDB: opens a database and creates its object stores', async () => {
  const db = await IndexedDBStore.open('elysium-test-1', 1, [
    { name: 'grades', keyPath: 'localId' },
    { name: 'rollCalls', keyPath: 'localId' }
  ]);

  assert.strictEqual(db.name, 'elysium-test-1');
  assert.strictEqual(db.version, 1);
  assert.deepStrictEqual(db.storeNames.sort(), ['grades', 'rollCalls']);
});

test('IndexedDB: stores and reads a record by keyPath', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-2');
  const entry = { localId: 'LOC-001', studentId: 'ST-001', pointsObtenus: 42, pointsMaxima: 50 };

  const written = await db.put(ELLYSIUM_STORES.GRADES, entry);
  assert.strictEqual(written.key, 'LOC-001');

  const read = await db.get(ELLYSIUM_STORES.GRADES, 'LOC-001');
  assert.deepStrictEqual(read, entry);
  assert.strictEqual(await db.count(ELLYSIUM_STORES.GRADES), 1);
});

test('IndexedDB: overwrites a record with the same key', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-3');
  await db.put(ELLYSIUM_STORES.GRADES, { localId: 'LOC-002', pointsObtenus: 10 });
  await db.put(ELLYSIUM_STORES.GRADES, { localId: 'LOC-002', pointsObtenus: 18 });

  const read = await db.get(ELLYSIUM_STORES.GRADES, 'LOC-002');
  assert.strictEqual(read.pointsObtenus, 18);
  assert.strictEqual(await db.count(ELLYSIUM_STORES.GRADES), 1);
});

test('IndexedDB: generates auto-increment keys when no key is provided', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-4');
  const a = await db.add(ELLYSIUM_STORES.SYNC_QUEUE, { kind: 'GRADE' });
  const b = await db.add(ELLYSIUM_STORES.SYNC_QUEUE, { kind: 'ROLLCALL' });

  assert.strictEqual(a.key, 1);
  assert.strictEqual(b.key, 2);
  assert.strictEqual((await db.getAll(ELLYSIUM_STORES.SYNC_QUEUE)).length, 2);
});

test('IndexedDB: throws when a keyPath is missing', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-5');
  await assert.rejects(
    () => db.put(ELLYSIUM_STORES.GRADES, { studentId: 'ST-404' }),
    /CLE_MANQUANTE/
  );
});

test('IndexedDB: throws on unknown store', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-6');
  await assert.rejects(() => db.getAll('store-inexistant'), /ERREUR_BDD: Magasin inconnu/);
});

test('IndexedDB: getAll returns every record and getAllKeys lists keys', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-7');
  await db.put(ELLYSIUM_STORES.ROLLCALLS, { localId: 'ROL-001', status: 'PRESENT' });
  await db.put(ELLYSIUM_STORES.ROLLCALLS, { localId: 'ROL-002', status: 'ABSENT' });

  const all = await db.getAll(ELLYSIUM_STORES.ROLLCALLS);
  assert.strictEqual(all.length, 2);
  assert.deepStrictEqual((await db.getAllKeys(ELLYSIUM_STORES.ROLLCALLS)), ['ROL-001', 'ROL-002']);
});

test('IndexedDB: deletes a record and reports absence', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-8');
  await db.put(ELLYSIUM_STORES.GRADES, { localId: 'LOC-010', pointsObtenus: 5 });

  assert.strictEqual(await db.delete(ELLYSIUM_STORES.GRADES, 'LOC-010'), true);
  assert.strictEqual(await db.delete(ELLYSIUM_STORES.GRADES, 'LOC-010'), false);
  assert.strictEqual(await db.get(ELLYSIUM_STORES.GRADES, 'LOC-010'), undefined);
});

test('IndexedDB: clear empties a store and resets the auto-increment', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-9');
  await db.add(ELLYSIUM_STORES.SYNC_QUEUE, { kind: 'A' });
  await db.add(ELLYSIUM_STORES.SYNC_QUEUE, { kind: 'B' });
  await db.clear(ELLYSIUM_STORES.SYNC_QUEUE);

  assert.strictEqual(await db.count(ELLYSIUM_STORES.SYNC_QUEUE), 0);
  const after = await db.add(ELLYSIUM_STORES.SYNC_QUEUE, { kind: 'C' });
  assert.strictEqual(after.key, 1);
});

test('IndexedDB: returns defensive clones (no external mutation)', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-10');
  const entry = { localId: 'LOC-020', grades: [12, 15] };
  await db.put(ELLYSIUM_STORES.GRADES, entry);

  entry.grades.push(99);
  const read = await db.get(ELLYSIUM_STORES.GRADES, 'LOC-020');
  assert.deepStrictEqual(read.grades, [12, 15]);
});

test('IndexedDB: data survives close/reopen (persistance simulée)', async () => {
  const first = await openEllYsiumOfflineDB('elysium-persistant');
  await first.put(ELLYSIUM_STORES.GRADES, { localId: 'LOC-777', pointsObtenus: 17 });
  first.close();

  const second = await openEllYsiumOfflineDB('elysium-persistant');
  const read = await second.get(ELLYSIUM_STORES.GRADES, 'LOC-777');
  assert.strictEqual(read.pointsObtenus, 17);
});

test('IndexedDB: refuses operations once closed, then deleteDB purges everything', async () => {
  const db = await openEllYsiumOfflineDB('elysium-test-11');
  await db.put(ELLYSIUM_STORES.META, { key: 'revision', value: 12 });
  db.close();

  await assert.rejects(() => db.getAll(ELLYSIUM_STORES.META), /CONNECTION_FERMEE/);
  assert.strictEqual(await IndexedDBStore.deleteDB('elysium-test-11'), true);

  const reopened = await openEllYsiumOfflineDB('elysium-test-11');
  assert.strictEqual(await reopened.count(ELLYSIUM_STORES.META), 0);
});

test('IndexedDB: rejects a version downgrade', async () => {
  await IndexedDBStore.open('elysium-test-12', 3, [{ name: 'grades', keyPath: 'localId' }]);
  await assert.rejects(
    () => IndexedDBStore.open('elysium-test-12', 1),
    /VERSION_BDD_REFUSEE/
  );
});
