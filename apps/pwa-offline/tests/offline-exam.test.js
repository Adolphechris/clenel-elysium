const test = require('node:test');
const assert = require('node:assert');
const {
  OfflineExamManager,
  MAX_OFFLINE_EVALUATIONS,
  DEFAULT_SESSION_DURATION_MINUTES
} = require('../dist/lib/offline-exam');
const { EncryptedSyncManager } = require('../dist/lib/encrypted-sync');
const { openEllYsiumOfflineDB, ELLYSIUM_STORES, IndexedDBStore } = require('../dist/lib/indexed-db-store');

const FENETRE = {
  opensAtUTC: '2026-09-01T06:00:00.000Z',
  closesAtUTC: '2026-12-31T22:00:00.000Z'
};

function buildEvaluation(index = 1) {
  return {
    evaluationId: `EVA-${index}`,
    title: `Interrogation n°${index} — Mathématiques`,
    disciplineId: 'MATH',
    disciplineName: 'Mathématiques',
    period: 'PREMIER_SEMESTRE',
    questions: [
      { questionId: 'Q1', label: 'Limites', disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsMaxima: 10, coefficient: 1 },
      { questionId: 'Q2', label: 'Dérivées', disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsMaxima: 20, coefficient: 2 },
      { questionId: 'Q3', label: 'Probabilités', disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsMaxima: 10, coefficient: 1 }
    ],
    ...FENETRE
  };
}

function newManager(options = {}) {
  return new OfflineExamManager({ now: () => Date.parse('2026-09-19T08:00:00.000Z'), ...options });
}

test('Hors-ligne: enregistre un sujet et refuse les doublons', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());

  assert.strictEqual(mgr.listEvaluations().length, 1);
  assert.strictEqual(mgr.getEvaluation('EVA-1').title.includes('Mathématiques'), true);
  assert.throws(() => mgr.registerEvaluation(buildEvaluation()), /SUJET_EXISTANT/);
  assert.throws(
    () => mgr.registerEvaluation({ ...buildEvaluation(2), questions: [] }),
    /SUJET_INVALIDE/
  );
});

test('Hors-ligne: démarre une session de 90 minutes par défaut', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());

  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });
  assert.strictEqual(session.status, 'IN_PROGRESS');
  assert.strictEqual(session.startedAtUTC, '2026-09-19T08:00:00.000Z');
  assert.strictEqual(
    session.expiresAtUTC,
    new Date(Date.parse('2026-09-19T08:00:00.000Z') + DEFAULT_SESSION_DURATION_MINUTES * 60000).toISOString()
  );
  assert.strictEqual(mgr.getSession(session.sessionId).studentId, 'ST-001');
});

test('Hors-ligne: refuse un sujet inconnu, un élève vide et une double session', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());

  assert.throws(() => mgr.startExam({ evaluationId: 'INCONNU', studentId: 'ST-001' }), /SUJET_INTROUVABLE/);
  assert.throws(() => mgr.startExam({ evaluationId: 'EVA-1', studentId: '' }), /ELEVE_INCONNU/);

  mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });
  assert.throws(
    () => mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' }),
    /SESSION_DEJA_OUVERTE/
  );
});

test('Hors-ligne: refus des évaluations hors fenêtre de passage', () => {
  const mgr = newManager();
  mgr.registerEvaluation({
    ...buildEvaluation(9),
    evaluationId: 'EVA-FUTUR',
    opensAtUTC: '2026-12-01T06:00:00.000Z'
  });

  assert.throws(
    () => mgr.startExam({ evaluationId: 'EVA-FUTUR', studentId: 'ST-001' }),
    /HORS_FENETRE/
  );
});

test('Hors-ligne: enregistre et met à jour les réponses', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });

  mgr.recordAnswer(session.sessionId, 'Q1', 8);
  mgr.recordAnswer(session.sessionId, 'Q2', 15);
  mgr.recordAnswer(session.sessionId, 'Q2', 17);

  const stored = mgr.getSession(session.sessionId);
  assert.strictEqual(stored.answers.length, 2);
  assert.strictEqual(stored.answers.find(a => a.questionId === 'Q2').pointsObtenus, 17);
});

test('Hors-ligne: validation stricte des réponses (note hors limites, question inconnue)', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });

  assert.throws(
    () => mgr.recordAnswer(session.sessionId, 'Q1', 11),
    /DEPASSEMENT_MAXIMA/
  );
  assert.throws(() => mgr.recordAnswer(session.sessionId, 'Q1', -2), /NOTE_INVALIDE/);
  assert.throws(() => mgr.recordAnswer(session.sessionId, 'Q1', 'dix'), /NOTE_INVALIDE/);
  assert.throws(() => mgr.recordAnswer(session.sessionId, 'Q99', 5), /QUESTION_INTROUVABLE/);
  assert.throws(() => mgr.recordAnswer('SES-INTROUVABLE', 'Q1', 5), /SESSION_INTROUVABLE/);
});

test('Hors-ligne: la formule officielle RDC est appliquée au scellement', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });

  mgr.recordAnswer(session.sessionId, 'Q1', 8);   // 8/10 * coef 1
  mgr.recordAnswer(session.sessionId, 'Q2', 16);  // 16/20 * coef 2
  mgr.recordAnswer(session.sessionId, 'Q3', 5);   // 5/10 * coef 1

  const sealed = mgr.submitExam(session.sessionId);

  // (8*1 + 16*2 + 5*1) / (10*1 + 20*2 + 10*1) = 45/60 = 75%
  assert.strictEqual(sealed.deliberation.totalPointsObtenus, 45);
  assert.strictEqual(sealed.deliberation.totalPointsMaxima, 60);
  assert.strictEqual(sealed.deliberation.pourcentageOfficiel, 75);
  assert.strictEqual(sealed.deliberation.mention, 'DISTINCTION');
  assert.strictEqual(sealed.deliberation.isAdmis, true);
  assert.strictEqual(sealed.grades.length, 3);
});

test('Hors-ligne: mention AJOURNE sous 50%', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });

  mgr.recordAnswer(session.sessionId, 'Q1', 2);
  mgr.recordAnswer(session.sessionId, 'Q2', 4);

  const sealed = mgr.submitExam(session.sessionId);
  assert.strictEqual(sealed.deliberation.isAdmis, false);
  assert.strictEqual(sealed.deliberation.mention, 'AJOURNE');
  // Q1 (2/10) et Q2 (4/20) sont toutes deux sous 50%
  assert.deepStrictEqual(sealed.deliberation.matieresEnEchec, ['Mathématiques', 'Mathématiques']);
});

test('Hors-ligne: un sujet sans réponse ne peut pas être scellé', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });

  assert.throws(() => mgr.submitExam(session.sessionId), /ERREUR_ACADEMIQUE/);
  assert.throws(() => mgr.submitExam('SES-INTROUVABLE'), /SESSION_INTROUVABLE/);
});

test('Hors-ligne: le sceau est immuable et vérifiable (SHA-256)', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });
  mgr.recordAnswer(session.sessionId, 'Q1', 9);
  mgr.recordAnswer(session.sessionId, 'Q2', 18);

  const sealed = mgr.submitExam(session.sessionId);
  assert.strictEqual(sealed.cryptographicHash.length, 64);
  assert.strictEqual(mgr.verifySeal(sealed.sealId), true);
  assert.strictEqual(mgr.getSession(session.sessionId).status, 'SEALED');

  // Altération frauduleuse d'une note → sceau invalidé
  sealed.grades[0].pointsObtenus = 10;
  assert.strictEqual(mgr.verifySeal(sealed.sealId), false);
  assert.strictEqual(mgr.verifySeal('SEAL-INCONNU'), false);
});

test('Hors-ligne: une session déjà scellée renvoie le résultat existant', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });
  mgr.recordAnswer(session.sessionId, 'Q1', 7);

  const first = mgr.submitExam(session.sessionId);
  const second = mgr.submitExam(session.sessionId);
  assert.strictEqual(first.sealId, second.sealId);
  assert.throws(() => mgr.recordAnswer(session.sessionId, 'Q2', 10), /SESSION_FERMEE/);
});

test('Hors-ligne: le quota est plafonné à 5 évaluations par élève', () => {
  const mgr = newManager();
  for (let i = 1; i <= 5; i++) mgr.registerEvaluation(buildEvaluation(i));

  assert.deepStrictEqual(mgr.getQuota('ST-001'), {
    maxEvaluations: MAX_OFFLINE_EVALUATIONS,
    used: 0,
    remaining: 5,
    exhausted: false
  });

  for (let i = 1; i <= 5; i++) {
    mgr.startExam({ evaluationId: `EVA-${i}`, studentId: 'ST-001' });
  }

  assert.strictEqual(mgr.getQuota('ST-001').used, 5);
  assert.strictEqual(mgr.getQuota('ST-001').remaining, 0);
  assert.strictEqual(mgr.getQuota('ST-001').exhausted, true);

  // Le quota est individuel : un autre élève n'est pas impacté
  assert.strictEqual(mgr.getQuota('ST-002').remaining, 5);
});

test('Hors-ligne: la 6ᵉ évaluation est refusée (VF-112-06)', () => {
  const mgr = newManager();
  for (let i = 1; i <= 6; i++) mgr.registerEvaluation(buildEvaluation(i));
  for (let i = 1; i <= 5; i++) mgr.startExam({ evaluationId: `EVA-${i}`, studentId: 'ST-001' });

  assert.throws(
    () => mgr.startExam({ evaluationId: 'EVA-6', studentId: 'ST-001' }),
    /QUOTA_HORS_LIGNE_DEPASSE/
  );
});

test('Hors-ligne: la session expirée refuse toute réponse', () => {
  let nowMs = Date.parse('2026-09-19T08:00:00.000Z');
  const mgr = new OfflineExamManager({ now: () => nowMs });
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });

  nowMs = Date.parse('2026-09-19T10:00:00.000Z'); // > 90 minutes
  assert.throws(() => mgr.recordAnswer(session.sessionId, 'Q1', 5), /SESSION_EXPIREE/);
  assert.strictEqual(mgr.getSession(session.sessionId).status, 'EXPIRED');
  assert.throws(() => mgr.submitExam(session.sessionId), /SESSION_EXPIREE/);
});

test('Sync: les sceaux en attente sont comptabilisés puis marqués synchronisés', () => {
  const mgr = newManager();
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });
  mgr.recordAnswer(session.sessionId, 'Q1', 9);
  mgr.submitExam(session.sessionId);

  assert.strictEqual(mgr.getPendingSeals().length, 1);
  assert.strictEqual(mgr.getStudentResults('ST-001').length, 1);
  assert.strictEqual(mgr.markSealedAsSynced(mgr.getPendingSeals()[0].sealId, '2026-09-19T12:00:00.000Z'), true);
  assert.strictEqual(mgr.getPendingSeals().length, 0);
  assert.strictEqual(mgr.markSealedAsSynced('SEAL-INCONNU'), false);
});

test('Sync: export chiffré des sceaux pour envoi différentiel', () => {
  const sync = new EncryptedSyncManager({ deviceId: 'DEV-EL-01', masterKey: 'phrase-partagee-2026' });
  const mgr = newManager({ syncManager: sync });
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });
  mgr.recordAnswer(session.sessionId, 'Q1', 9);
  mgr.recordAnswer(session.sessionId, 'Q2', 17);
  const sealed = mgr.submitExam(session.sessionId);

  const exported = mgr.exportPendingSealsForSync();
  assert.strictEqual(exported.recordCount, 1);
  assert.strictEqual(exported.digest.length, 64);

  const decoded = sync.decrypt(exported.envelopes[0], `elysium-pwa-sync-v1:examSeal:${sealed.sealId}`);
  assert.strictEqual(decoded.cryptographicHash, sealed.cryptographicHash);
  // (9*1 + 17*2) / (10*1 + 20*2) = 43/50 = 86%
  assert.strictEqual(decoded.deliberation.pourcentageOfficiel, 86);

  const records = mgr.toVersionedRecords([sealed], 'DEV-EL-01');
  assert.strictEqual(records[0].collection, 'examSeals');
  assert.strictEqual(records[0].recordId, sealed.sealId);
});

test('Persistance: les sceaux sont écrits dans IndexedDB local', async () => {
  IndexedDBStore.resetAll();
  const storage = await openEllYsiumOfflineDB('elysium-exam-persist');
  const mgr = newManager({ storage });
  mgr.registerEvaluation(buildEvaluation());
  const session = mgr.startExam({ evaluationId: 'EVA-1', studentId: 'ST-001' });
  mgr.recordAnswer(session.sessionId, 'Q1', 9);
  const sealed = mgr.submitExam(session.sessionId);

  // La persistance est asynchrone : on laisse le microtask s'exécuter.
  await new Promise(resolve => setImmediate(resolve));

  const stored = await storage.getAll(ELLYSIUM_STORES.EXAM_SEALS);
  assert.strictEqual(stored.length, 1);
  assert.strictEqual(stored[0].cryptographicHash, sealed.cryptographicHash);
  IndexedDBStore.resetAll();
});
