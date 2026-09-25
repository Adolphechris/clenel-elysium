const test = require('node:test');
const assert = require('node:assert');
const { TeacherPWA } = require('../dist/teacher-app');
const { OfflineGradeBook } = require('../dist/offline-grades');
const {
  ServiceWorkerManager,
  resolveStrategy,
  CACHE_NAME
} = require('../dist/service-worker');
const { IndexedDBStore } = require('@elysium/pwa-offline');

const PROFILE = {
  teacherId: 'PROF-01',
  teacherName: 'MUTOMBO Jean',
  schoolId: 'SCH-KIN-01',
  schoolName: 'École Sainte-Marie',
  disciplines: ['MATH', 'PHY']
};

async function boot(options = {}) {
  const app = new TeacherPWA({ now: () => Date.parse('2026-09-19T08:00:00.000Z'), ...options });
  const state = await app.initialize(PROFILE, options.initializeOptions);
  return { app, state };
}

test('Initialisation: crée le profil, le carnet et renvoie l\'état applicatif', async () => {
  IndexedDBStore.resetAll();
  const { state } = await boot();

  assert.strictEqual(state.initialized, true);
  assert.strictEqual(state.online, true);
  assert.strictEqual(state.offlineSince, null);
  assert.strictEqual(state.profile.teacherId, 'PROF-01');
  assert.deepStrictEqual(state.queue, { pending: 0, synced: 0, total: 0, oldestPendingAtLocal: null });
});

test('Initialisation: refuse un profil incomplet', async () => {
  const app = new TeacherPWA();
  await assert.rejects(() => app.initialize({ teacherId: '' }), /PROFIL_INVALIDE/);
});

test('Initialisation: les méthodes exigent une application initialisée', () => {
  const app = new TeacherPWA();
  assert.throws(() => app.loadClasses(), /PWA_NON_INITIALISEE/);
  assert.throws(() => app.syncOffline(), /PWA_NON_INITIALISEE/);
  assert.throws(() => app.viewStudentProgress('ST-001'), /PWA_NON_INITIALISEE/);
});

test('Initialisation: ouvre la persistance locale', async () => {
  IndexedDBStore.resetAll();
  const { app } = await boot({ initializeOptions: { openStorage: true } });
  const report = app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsMaxima: 20,
    grades: [{ studentId: 'ST-001', pointsObtenus: 15 }]
  });
  assert.strictEqual(report.accepted.length, 1);

  await new Promise(resolve => setImmediate(resolve));
  const db = await IndexedDBStore.open(`elysium-teacher-${PROFILE.teacherId}`);
  assert.strictEqual(await db.count('grades'), 1);
  IndexedDBStore.resetAll();
});

test('Classes: liste uniquement les classes de l\'établissement de l\'enseignant', async () => {
  const { app } = await boot();
  const classes = app.loadClasses();

  assert.strictEqual(classes.length, 2);
  assert.deepStrictEqual(classes.map(c => c.classId), ['CL-4HUM-A', 'CL-3HUM-B']);
  assert.strictEqual(classes[0].studentCount, 45);
  assert.throws(() => app.getClassStudents('CL-INTROUVABLE'), /CLASSE_INTROUVABLE/);
});

test('Appel: enregistre un appel complet et calcule le taux d\'assiduité', async () => {
  const { app } = await boot();
  const report = app.takeAttendance({
    classId: 'CL-4HUM-A',
    date: '2026-09-19',
    records: [
      { studentId: 'ST-001', status: 'PRESENT' },
      { studentId: 'ST-002', status: 'PRESENT' },
      { studentId: 'ST-003', status: 'ABSENT' },
      { studentId: 'ST-004', status: 'RETARD' },
      { studentId: 'ST-005', status: 'EXCUSE' }
    ]
  });

  assert.strictEqual(report.total, 5);
  assert.strictEqual(report.present, 2);
  assert.strictEqual(report.absent, 1);
  assert.strictEqual(report.late, 1);
  assert.strictEqual(report.excused, 1);
  // (2 présents + 1 excuse + 0.5 retard) / 5 = 70%
  assert.strictEqual(report.attendanceRate, 70);
  assert.strictEqual(report.entries[0].teacherId, 'PROF-01');
  assert.strictEqual(report.entries[0].schoolId, 'SCH-KIN-01');
  assert.strictEqual(app.getAttendance('CL-4HUM-A', '2026-09-19').length, 5);
});

test('Appel: valide la date, la classe et les élèves convoqués', async () => {
  const { app } = await boot();

  assert.throws(
    () => app.takeAttendance({ classId: 'CL-4HUM-A', date: '19/09/2026', records: [{ studentId: 'ST-001', status: 'PRESENT' }] }),
    /DATE_INVALIDE/
  );
  assert.throws(
    () => app.takeAttendance({ classId: 'CL-4HUM-A', date: '2026-09-19', records: [] }),
    /APPEL_VIDE/
  );
  assert.throws(
    () => app.takeAttendance({ classId: 'CL-4HUM-A', date: '2026-09-19', records: [{ studentId: 'ST-006', status: 'PRESENT' }] }),
    /ELEVE_HORS_CLASSE/
  );
});

test('Appel: fonctionne intégralement hors-ligne (VF-112-02)', async () => {
  const { app } = await boot();
  app.goOffline(true);

  const report = app.takeAttendance({
    classId: 'CL-4HUM-A',
    date: '2026-09-19',
    records: [
      { studentId: 'ST-001', status: 'PRESENT' },
      { studentId: 'ST-002', status: 'ABSENT' }
    ]
  });

  assert.strictEqual(report.queuedForSync, 2);
  assert.strictEqual(app.getState().queue.pending, 0);
});

test('Cotes: saisie en lot avec isolement des notes invalides', async () => {
  const { app } = await boot();
  const report = app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsMaxima: 20,
    coefficient: 2,
    grades: [
      { studentId: 'ST-001', studentName: 'KASONGO David', pointsObtenus: 18 },
      { studentId: 'ST-002', studentName: 'LUMEMBE Sara', pointsObtenus: 12 },
      { studentId: 'ST-003', studentName: 'MBUYI Emmanuel', pointsObtenus: 25 },
      { studentId: 'ST-004', studentName: 'TSHIMANGA Grace', pointsObtenus: -3 }
    ]
  });

  assert.strictEqual(report.accepted.length, 2);
  assert.strictEqual(report.rejected.length, 2);
  assert.strictEqual(report.rejected[0].reason.includes('DEPASSEMENT_MAXIMA'), true);
  assert.strictEqual(report.rejected[1].reason.includes('NOTE_INVALIDE'), true);
  assert.strictEqual(report.averageRate, 75);
  assert.strictEqual(report.highestRate, 90);
  assert.strictEqual(report.lowestRate, 60);
});

test('Cotes: refus des évaluations incomplètes', async () => {
  const { app } = await boot();

  const maxNul = app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'X',
    pointsMaxima: 0,
    grades: [{ studentId: 'ST-001', pointsObtenus: 5 }]
  });
  assert.strictEqual(maxNul.accepted.length, 0);
  assert.strictEqual(maxNul.rejected[0].reason.includes('MAXIMA_NUL'), true);
  assert.strictEqual(maxNul.rejected[0].studentId, 'ST-001');

  const sansEleve = app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'X',
    pointsMaxima: 20,
    grades: [{ studentId: '', pointsObtenus: 5 }]
  });
  assert.strictEqual(sansEleve.rejected[0].reason.includes('ELEVE_INCONNU'), true);
});

test('Progression: agrège par discipline et applique la formule RDC', async () => {
  const { app } = await boot();
  app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsMaxima: 20,
    grades: [{ studentId: 'ST-001', pointsObtenus: 16 }]
  });
  app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'FR',
    disciplineName: 'Français',
    evaluationId: 'DEVOIR-1',
    pointsMaxima: 50,
    grades: [{ studentId: 'ST-001', pointsObtenus: 30 }]
  });

  const progress = app.viewStudentProgress('ST-001', 'CL-4HUM-A');
  assert.strictEqual(progress.evaluationCount, 2);
  assert.strictEqual(progress.byDiscipline.length, 2);
  // (16 + 30) / (20 + 50) = 65.71%
  assert.strictEqual(progress.deliberation.pourcentageOfficiel, 65.71);
  assert.strictEqual(progress.deliberation.mention, 'SATISFACTION');
  assert.strictEqual(progress.deliberation.isAdmis, true);
  assert.strictEqual(progress.studentName, null);
});

test('Progression: élève inconnu et élève sans note', async () => {
  const { app } = await boot();
  assert.throws(() => app.viewStudentProgress('ST-999'), /ELEVE_INTROUVABLE/);

  const vide = app.viewStudentProgress('ST-002');
  assert.strictEqual(vide.evaluationCount, 0);
  assert.strictEqual(vide.deliberation, null);
});

test('Progression: un élève sous 50% est ajourné', async () => {
  const { app } = await boot();
  app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsMaxima: 20,
    grades: [{ studentId: 'ST-001', pointsObtenus: 4 }]
  });

  const progress = app.viewStudentProgress('ST-001', 'CL-4HUM-A');
  assert.strictEqual(progress.deliberation.isAdmis, false);
  assert.strictEqual(progress.deliberation.mention, 'AJOURNE');
  assert.deepStrictEqual(progress.deliberation.matieresEnEchec, ['Mathématiques']);
});

test('Hors-ligne: goOffline() met l\'application en attente de synchronisation', async () => {
  const { app } = await boot();
  app.goOffline(true);

  assert.strictEqual(app.getState().online, false);
  assert.strictEqual(app.getState().offlineSince, '2026-09-19T08:00:00.000Z');

  app.takeAttendance({
    classId: 'CL-4HUM-A',
    date: '2026-09-19',
    records: [{ studentId: 'ST-001', status: 'PRESENT' }]
  });
  app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsMaxima: 20,
    grades: [{ studentId: 'ST-001', pointsObtenus: 10 }]
  });

  const report = app.syncOffline();
  assert.strictEqual(report.status, 'DEFERRED');
  assert.strictEqual(report.syncedGrades, 0);
  assert.strictEqual(report.syncedAttendance, 0);
  assert.strictEqual(report.remainingPending, 2);
  assert.strictEqual(report.reason.includes('RESEAU_INDISPONIBLE'), true);
});

test('Synchronisation: le retour du réseau vide la file (VF-112-03)', async () => {
  const { app } = await boot();
  app.goOffline(true);

  app.takeAttendance({
    classId: 'CL-4HUM-A',
    date: '2026-09-19',
    records: [
      { studentId: 'ST-001', status: 'PRESENT' },
      { studentId: 'ST-002', status: 'ABSENT' }
    ]
  });
  app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsMaxima: 20,
    grades: [
      { studentId: 'ST-001', pointsObtenus: 10 },
      { studentId: 'ST-002', pointsObtenus: 12 }
    ]
  });

  const state = app.goOffline(false);
  assert.strictEqual(state.online, true);
  assert.strictEqual(state.offlineSince, null);
  assert.strictEqual(state.queue.pending, 0);
  assert.strictEqual(state.queue.synced, 2);

  const report = app.syncOffline();
  assert.strictEqual(report.status, 'SUCCESS');
  assert.strictEqual(report.remainingPending, 0);
  assert.strictEqual(report.syncedAtUTC, '2026-09-19T08:00:00.000Z');
});

test('Synchronisation: en ligne, les saisies sont immédiatement synchronisées', async () => {
  const { app } = await boot();
  app.enterGrades({
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsMaxima: 20,
    grades: [{ studentId: 'ST-001', pointsObtenus: 10 }]
  });

  assert.strictEqual(app.getState().queue.pending, 0);
  assert.strictEqual(app.getState().queue.synced, 1);
  assert.strictEqual(app.syncOffline().remainingPending, 0);
});

test('Service Worker: strategies cache-first / network-first / bypass', () => {
  assert.strictEqual(resolveStrategy('/app.js'), 'CACHE_FIRST');
  assert.strictEqual(resolveStrategy('/styles.css'), 'CACHE_FIRST');
  assert.strictEqual(resolveStrategy('/manifest.json'), 'CACHE_FIRST');
  assert.strictEqual(resolveStrategy('/api/classes'), 'NETWORK_FIRST');
  assert.strictEqual(resolveStrategy('https://elysium.cd/api/grades'), 'NETWORK_FIRST');
  assert.strictEqual(resolveStrategy('/offline.html'), 'OFFLINE_SHELL');
  assert.strictEqual(resolveStrategy('/api/grades', 'POST'), 'BYPASS');
  assert.strictEqual(resolveStrategy('/route-inconnue'), 'NETWORK_FIRST');
});

test('Service Worker: l\'enregistrement est neutre hors navigateur', async () => {
  const sw = new ServiceWorkerManager('/sw.js');
  assert.strictEqual(await sw.register(), false);
  assert.strictEqual(sw.isRegistered(), false);
  assert.strictEqual(sw.getStrategy('/app.js'), 'CACHE_FIRST');
  assert.strictEqual(sw.isCacheable('/app.js'), true);
  assert.strictEqual(sw.isCacheable('/api/grades'), false);
  assert.strictEqual(sw.getPrecacheAssets().includes('/offline.html'), true);
});

test('Service Worker: la source générée est cohérente avec les constantes', () => {
  const source = ServiceWorkerManager.renderServiceWorkerSource();

  assert.strictEqual(source.includes(`const CACHE_NAME = '${CACHE_NAME}';`), true);
  assert.strictEqual(source.includes("addEventListener('fetch'"), true);
  assert.strictEqual(source.includes("addEventListener('install'"), true);
  assert.strictEqual(source.includes("addEventListener('activate'"), true);
  assert.strictEqual(source.includes("addEventListener('message'"), true);
});

test('Carnet de cotes hors-ligne: validation, file et conflits', () => {
  const book = new OfflineGradeBook({
    teacherId: 'PROF-02',
    schoolId: 'SCH-KIN-01',
    now: () => Date.parse('2026-09-19T08:00:00.000Z')
  });

  const valide = book.validateGrade({
    studentId: 'ST-001',
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsObtenus: 10,
    pointsMaxima: 20
  });
  assert.strictEqual(valide.valid, true);
  assert.strictEqual(valide.rate, 50);
  assert.strictEqual(valide.projectedMention, 'PASSABLE');
  assert.deepStrictEqual(valide.warnings, []);

  const enEchec = book.validateGrade({
    studentId: 'ST-001',
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsObtenus: 5,
    pointsMaxima: 20
  });
  assert.strictEqual(enEchec.valid, true);
  assert.strictEqual(enEchec.projectedMention, 'AJOURNE');
  assert.strictEqual(enEchec.warnings[0].includes('MATIERE_EN_ECHEC'), true);

  assert.strictEqual(
    book.validateGrade({
      studentId: 'ST-001',
      classId: 'CL-4HUM-A',
      disciplineId: 'MATH',
      disciplineName: 'Mathématiques',
      evaluationId: 'INTERRO-1',
      pointsObtenus: 30,
      pointsMaxima: 20
    }).valid,
    false
  );

  book.setOnlineStatus(false);
  const entry = book.enterGrade({
    studentId: 'ST-001',
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsObtenus: 15,
    pointsMaxima: 20
  });
  assert.strictEqual(entry.status, 'PENDING_SYNC');
  assert.strictEqual(entry.localId.startsWith('GRD-'), true);
  assert.strictEqual(book.getQueueStats().pending, 1);
  assert.strictEqual(book.markAsConflict(entry.localId), true);
  assert.strictEqual(book.getQueueStats().pending, 0);
  assert.strictEqual(book.markAsConflict('GRD-INTROUVABLE'), false);
  assert.throws(() => book.enterGrade({
    studentId: '',
    classId: 'CL-4HUM-A',
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    evaluationId: 'INTERRO-1',
    pointsObtenus: 15,
    pointsMaxima: 20
  }), /ELEVE_INCONNU/);
});

test('Carnet de cotes: refus d\'un enseignant non identifié', () => {
  assert.throws(() => new OfflineGradeBook({ teacherId: '', schoolId: 'SCH-KIN-01' }), /ENSEIGNANT_INCONNU/);
});
