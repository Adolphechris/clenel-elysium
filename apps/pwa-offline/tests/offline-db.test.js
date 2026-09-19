const test = require('node:test');
const assert = require('node:assert');
const { OfflineSyncManager } = require('../dist/lib/offline-db');

test('PWA: Stores grade offline when network is unavailable', () => {
  const mgr = new OfflineSyncManager();
  mgr.setOnlineStatus(false); // Simulation coupure réseau

  const entry = mgr.storeGradeOffline({
    studentId: 'ST-001',
    disciplineId: 'MATH',
    pointsObtenus: 42,
    pointsMaxima: 50,
    teacherId: 'PROF-01',
    classId: 'CL-4SCA',
    schoolId: 'SCH-KIN-01'
  });

  assert.strictEqual(entry.status, 'PENDING_SYNC');
  assert.strictEqual(entry.localId.startsWith('LOC-'), true);
  assert.strictEqual(mgr.getQueueStats().pending, 1);
});

test('PWA: Queues multiple entries and syncs on network restore', () => {
  const mgr = new OfflineSyncManager();
  mgr.setOnlineStatus(false);

  // Enregistrement de 5 appels de présences hors-ligne
  const ids = [];
  for (let i = 0; i < 5; i++) {
    const entry = mgr.storeRollCallOffline({
      studentId: `ST-00${i}`,
      attendanceStatus: i % 2 === 0 ? 'PRESENT' : 'ABSENT',
      date: '2026-09-19',
      teacherId: 'PROF-02',
      classId: 'CL-3HUM',
      schoolId: 'SCH-KIN-01'
    });
    ids.push(entry.localId);
  }

  assert.strictEqual(mgr.getQueueStats().pending, 5);

  // Retour du réseau et synchronisation
  mgr.setOnlineStatus(true);
  const syncTime = new Date().toISOString();
  ids.forEach(id => mgr.markAsSynced(id, 'rollCall', syncTime));

  assert.strictEqual(mgr.getQueueStats().pending, 0);
  assert.strictEqual(mgr.getQueueStats().synced, 5);
});

test('PWA: Rejects invalid grades (VF-112-01)', () => {
  const mgr = new OfflineSyncManager();
  mgr.setOnlineStatus(false);

  // Note > maximum
  assert.throws(() => {
    mgr.storeGradeOffline({
      studentId: 'ST-999',
      disciplineId: 'FR',
      pointsObtenus: 60,
      pointsMaxima: 50,
      teacherId: 'PROF-03',
      classId: 'CL-1CTEB',
      schoolId: 'SCH-KIN-01'
    });
  }, /SAISIE_INVALIDE/);
});
