const test = require('node:test');
const assert = require('node:assert');
const { ParentPortal, DEMO_DATA_SOURCE } = require('../dist/parent-portal');
const { MobileMoneyPaymentService } = require('../dist/payment-service');
const { ParentNotificationService } = require('../dist/notifications');

const NOW = () => Date.parse('2026-09-19T10:00:00.000Z');

const PROFILE = {
  parentId: 'PAR-01',
  parentName: 'KASONGO Marie',
  phoneNumber: '+243810000000',
  fcmToken: 'fcm-token-KASONGO'
};

async function boot(portalOptions = {}) {
  const portal = new ParentPortal({ now: NOW, ...portalOptions });
  const state = await portal.initialize(PROFILE);
  return { portal, state };
}

test('Initialisation: enregistre le profil et l\'appareil FCM', async () => {
  const { state } = await boot();

  assert.strictEqual(state.initialized, true);
  assert.strictEqual(state.parentId, 'PAR-01');
  assert.strictEqual(state.parentName, 'KASONGO Marie');
  assert.strictEqual(state.childCount, 2);
  assert.strictEqual(state.registeredDevices, 1);
});

test('Initialisation: refuse un profil invalide et protège les méthodes non initialisées', async () => {
  const portal = new ParentPortal();
  await assert.rejects(() => portal.initialize({ parentId: '' }), /PROFIL_INVALIDE/);
  assert.throws(() => portal.loadChildren(), /PORTAL_NON_INITIALISE/);
  assert.throws(() => portal.viewReportCard('ST-001'), /PORTAL_NON_INITIALISE/);
});

test('Enfants: liste les enfants rattachés au parent', async () => {
  const { portal } = await boot();
  const children = portal.loadChildren();

  assert.strictEqual(children.length, 2);
  assert.deepStrictEqual(children.map(c => c.studentId), ['ST-001', 'ST-006']);
  assert.strictEqual(children[0].studentName, 'KASONGO David');
  assert.throws(() => portal.viewReportCard('ST-999'), /ENFANT_INTROUVABLE/);
});

test('Bulletin: recalcule la délibération officielle et scelle le document', async () => {
  const { portal } = await boot();
  const card = portal.viewReportCard('ST-001');

  // (68*2 + 42*2 + 36*1) / (100*2 + 50*2 + 50*1) = 256/350 = 73.14%
  assert.strictEqual(card.totalPointsObtenus, 256);
  assert.strictEqual(card.totalPointsMaxima, 350);
  assert.strictEqual(card.pourcentageOfficiel, 73.14);
  assert.strictEqual(card.mention, 'DISTINCTION');
  assert.strictEqual(card.isAdmis, true);
  assert.deepStrictEqual(card.matieresEnEchec, []);
  assert.strictEqual(card.cryptographicHash.length, 64);
  assert.strictEqual(card.verificationUrl.startsWith('https://elysium.cd/verify/'), true);
  assert.strictEqual(card.formuleAppliquee.includes('Coef'), true);
  assert.strictEqual(card.grades.length, 3);
  assert.strictEqual(card.grades.find(g => g.disciplineId === 'MATH').percentage, 84);
});

test('Bulletin: refus si aucun bulletin publié', async () => {
  const { portal } = await boot();
  assert.throws(() => portal.viewReportCard('ST-006'), /BULLETIN_INDISPONIBLE/);
});

test('Bulletin: un élève sous 50% est ajourné avec les matières en échec', async () => {
  const dataSource = {
    ...DEMO_DATA_SOURCE,
    getReportCards: () => [
      {
        reportCardId: 'BUL-2026-0002',
        studentId: 'ST-001',
        period: 'ANNUEL',
        academicYear: '2026-2027',
        publishedAtUTC: '2026-09-19T06:00:00.000Z',
        grades: [
          { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 12, pointsMaxima: 50, coefficient: 1 },
          { disciplineId: 'FR', disciplineName: 'Français', pointsObtenus: 30, pointsMaxima: 50, coefficient: 1 }
        ]
      }
    ]
  };
  const { portal } = await boot({ dataSource });
  const card = portal.viewReportCard('ST-001', 'ANNUEL');

  assert.strictEqual(card.pourcentageOfficiel, 42);
  assert.strictEqual(card.mention, 'AJOURNE');
  assert.strictEqual(card.isAdmis, false);
  assert.deepStrictEqual(card.matieresEnEchec, ['Mathématiques']);
});

test('Bulletin: rejette une note hors maximum (intégrité de la formule)', async () => {
  const dataSource = {
    ...DEMO_DATA_SOURCE,
    getReportCards: () => [
      {
        reportCardId: 'BUL-BIDON',
        studentId: 'ST-001',
        period: 'ANNUEL',
        academicYear: '2026-2027',
        publishedAtUTC: '2026-09-19T06:00:00.000Z',
        grades: [
          { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 60, pointsMaxima: 50 }
        ]
      }
    ]
  };
  const { portal } = await boot({ dataSource });
  assert.throws(() => portal.viewReportCard('ST-001'), /DEPASSEMENT_MAXIMA/);
});

test('Assiduité: synthétise les appels via le service-central', async () => {
  const { portal } = await boot();
  const attendance = portal.viewAttendance('ST-001');

  assert.strictEqual(attendance.totalRollCalls, 5);
  assert.strictEqual(attendance.presents, 3);
  assert.strictEqual(attendance.absents, 1);
  assert.strictEqual(attendance.retards, 1);
  // (3 présents + 0 excused + 0.5 retard) / 5 = 70%
  assert.strictEqual(attendance.tauxAssiduite, 70);
  assert.strictEqual(attendance.requiresParentAlert, true);
  assert.deepStrictEqual(attendance.absenceDates, ['2026-09-15']);
  assert.strictEqual(attendance.studentName, 'KASONGO David');
});

test('Notifications: alerte d\'absence urgente + annonce de bulletin', async () => {
  const { portal } = await boot();
  const bundle = portal.receiveNotifications('ST-001');

  assert.strictEqual(bundle.notifications.length, 2);
  assert.strictEqual(bundle.notifications[0].type, 'ABSENCE_ALERT');
  assert.strictEqual(bundle.notifications[0].priority, 'URGENTE');
  assert.strictEqual(bundle.notifications[1].type, 'REPORT_CARD_AVAILABLE');
  assert.strictEqual(bundle.notifications[1].title.includes('Bulletin'), true);
  assert.strictEqual(bundle.unreadCount, 2);

  // VF-070-01 : l'urgence part sur 2 canaux
  const urgentDispatch = bundle.dispatches[0];
  assert.deepStrictEqual(urgentDispatch.channelResults.map(c => c.channel).sort(), ['FCM_PUSH', 'SMS']);
  assert.strictEqual(urgentDispatch.overallSuccess, true);
  assert.strictEqual(portal.getState().unreadNotifications, 2);
});

test('Notifications: pas d\'alerte si l\'assiduité est correcte', async () => {
  const dataSource = {
    ...DEMO_DATA_SOURCE,
    getAttendanceEntries: () =>
      ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18'].map((date, i) => ({
        attendanceId: `AT-OK-${i}`,
        schoolId: 'SCH-KIN-01',
        classId: 'CL-4HUM-A',
        studentId: 'ST-001',
        date,
        status: 'PRESENT',
        markedByTeacherId: 'PROF-01',
        timestampUTC: '2026-09-19T06:00:00.000Z',
        parentNotified: false
      }))
  };
  const { portal } = await boot({ dataSource });
  const bundle = portal.receiveNotifications('ST-001');

  assert.strictEqual(bundle.notifications.length, 1);
  assert.strictEqual(bundle.notifications[0].type, 'REPORT_CARD_AVAILABLE');
});

test('Notifications: marquage lu et historique par parent', () => {
  const service = new ParentNotificationService({ now: NOW });
  service.registerDevice({ parentId: 'PAR-01', fcmToken: 'tok-1' });
  service.registerDevice({ parentId: 'PAR-02', fcmToken: 'tok-2' });

  const alert = service.buildAbsenceAlert({
    parentId: 'PAR-01',
    studentId: 'ST-001',
    studentName: 'KASONGO David',
    className: '4ème A',
    schoolId: 'SCH-KIN-01',
    date: '2026-09-19',
    consecutiveAbsences: 3
  });

  assert.strictEqual(alert.title.includes('Absence répétée'), true);
  assert.strictEqual(service.getNotifications('PAR-01').length, 1);
  assert.strictEqual(service.getNotifications('PAR-02').length, 0);
  assert.strictEqual(service.getUnreadCount('PAR-01'), 1);
  assert.strictEqual(service.markAsRead(alert.notificationId), true);
  assert.strictEqual(service.getUnreadCount('PAR-01'), 0);
  assert.strictEqual(service.markAsRead('PNOT-INTROUVABLE'), false);
});

test('Notifications: alerte simple (non urgente) sur absence isolée', () => {
  const service = new ParentNotificationService({ now: NOW });
  const alert = service.buildAbsenceAlert({
    parentId: 'PAR-01',
    studentId: 'ST-001',
    studentName: 'KASONGO David',
    className: '4ème A',
    schoolId: 'SCH-KIN-01',
    date: '2026-09-19',
    consecutiveAbsences: 1,
    absenceRate: 96
  });

  assert.strictEqual(alert.priority, 'NORMALE');
  assert.strictEqual(alert.data.absenceRate, '96');
  assert.throws(
    () => service.buildAbsenceAlert({ parentId: '', studentId: 'ST-001', studentName: 'X', className: 'C', schoolId: 'S', date: '2026-09-19', consecutiveAbsences: 1 }),
    /ALERTE_INVALIDE/
  );
});

test('Notifications: gestion des appareils FCM et du payload', () => {
  const service = new ParentNotificationService({ now: NOW });
  service.registerDevice({ parentId: 'PAR-01', fcmToken: 'tok-1', platform: 'ANDROID' });

  assert.strictEqual(service.getDevices('PAR-01').length, 1);
  assert.strictEqual(service.refreshToken('tok-1', 'tok-2'), true);
  assert.strictEqual(service.getDevices('PAR-01')[0].fcmToken, 'tok-2');
  assert.strictEqual(service.refreshToken('tok-inexistant', 'tok-3'), false);
  assert.strictEqual(service.unregisterDevice('tok-2'), true);
  assert.strictEqual(service.getDevices('PAR-01').length, 0);
  assert.throws(() => service.registerDevice({ parentId: 'PAR-01', fcmToken: '' }), /APPAREIL_INVALIDE/);

  service.registerDevice({ parentId: 'PAR-01', fcmToken: 'tok-9' });
  const alert = service.buildAbsenceAlert({
    parentId: 'PAR-01', studentId: 'ST-001', studentName: 'D', className: '4A',
    schoolId: 'SCH-KIN-01', date: '2026-09-19', consecutiveAbsences: 4
  });
  const message = service.buildFcmMessage(alert, 'tok-9');
  assert.strictEqual(message.token, 'tok-9');
  assert.strictEqual(message.android.priority, 'high');
  assert.strictEqual(message.android.notification.channelId, 'elysium_urgent');
  assert.strictEqual(message.apns.headers['apns-priority'], '10');
  assert.strictEqual(message.data.type, 'ABSENCE_ALERT');
});

test('Notifications: échec FCM si aucun appareil enregistré', () => {
  const service = new ParentNotificationService({ now: NOW });
  const alert = service.buildAbsenceAlert({
    parentId: 'PAR-01', studentId: 'ST-001', studentName: 'D', className: '4A',
    schoolId: 'SCH-KIN-01', date: '2026-09-19', consecutiveAbsences: 3
  });
  const result = service.dispatch(alert);
  const fcm = result.channelResults.find(c => c.channel === 'FCM_PUSH');

  assert.strictEqual(fcm.success, false);
  assert.strictEqual(fcm.error.includes('AUCUN_APPAREIL'), true);
  assert.strictEqual(result.overallSuccess, true, 'le canal SMS reste disponible');
});

test('Paiement: génère un reçu Mobile Money scellé (M-Pesa)', async () => {
  const { portal } = await boot();
  const outcome = portal.makePayment({
    studentId: 'ST-001',
    amount: 150000,
    feeType: 'MINERVAL',
    operator: 'MPESA'
  });

  assert.strictEqual(outcome.success, true);
  assert.strictEqual(outcome.receipt.amount, 150000);
  assert.strictEqual(outcome.receipt.currency, 'CDF');
  assert.strictEqual(outcome.receipt.status, 'ENVOYE');
  assert.strictEqual(outcome.receipt.ussdCode.startsWith('*182#'), true);
  assert.strictEqual(outcome.receipt.receiptHash.length, 64);
  assert.strictEqual(outcome.receipt.verificationUrl.includes('/verify/recu/'), true);
  assert.strictEqual(portal.getPaymentService().verifyReceipt(outcome.receipt.receiptId), true);
});

test('Paiement: les trois opérateurs congolais sont pris en charge', async () => {
  const { portal } = await boot();

  for (const [operator, prefix] of [['MPESA', '*182#'], ['ORANGE_MONEY', '*150#'], ['AIRTEL_MONEY', '*133#']]) {
    const outcome = portal.makePayment({
      studentId: 'ST-001',
      amount: 25000,
      feeType: 'INSCRIPTION',
      operator,
      payerPhoneNumber: operator === 'ORANGE_MONEY' ? '+243800000000' : operator === 'AIRTEL_MONEY' ? '+243970000000' : '+243810000000'
    });
    assert.strictEqual(outcome.success, true, `${operator} doit être accepté`);
    assert.strictEqual(outcome.receipt.ussdCode.startsWith(prefix), true);
  }

  assert.deepStrictEqual(MobileMoneyPaymentService.supportedOperators, ['MPESA', 'ORANGE_MONEY', 'AIRTEL_MONEY']);
});

test('Paiement: refus des montants et numéros invalides', async () => {
  const { portal } = await boot();

  assert.strictEqual(portal.makePayment({ studentId: 'ST-001', amount: 0, feeType: 'MINERVAL', operator: 'MPESA' }).errorMessage.includes('MONTANT_INVALIDE'), true);
  assert.strictEqual(portal.makePayment({ studentId: 'ST-001', amount: -5, feeType: 'MINERVAL', operator: 'MPESA' }).errorMessage.includes('MONTANT_INVALIDE'), true);
  assert.strictEqual(portal.makePayment({ studentId: 'ST-001', amount: 100, feeType: 'MINERVAL', operator: 'VODACASH' }).errorMessage.includes('OPERATEUR_INSUPPORTE'), true);

  const mauvaisOperateur = portal.makePayment({
    studentId: 'ST-001', amount: 100, feeType: 'MINERVAL', operator: 'MPESA', payerPhoneNumber: '+243800000000'
  });
  assert.strictEqual(mauvaisOperateur.errorMessage.includes('NUMERO_INVALIDE'), true);
});

test('Paiement: confirmation opérateur, annulation et intégrité du reçu', () => {
  const service = new MobileMoneyPaymentService({ now: NOW });
  const result = service.initiatePayment({
    parentId: 'PAR-01', studentId: 'ST-001', schoolId: 'SCH-KIN-01', amount: 150000,
    currency: 'CDF', feeType: 'MINERVAL', operator: 'MPESA', payerPhoneNumber: '+243810000000'
  });
  const receipt = result.receipt;

  assert.strictEqual(service.confirmPayment(receipt.receiptId, 'MAUVAIS-CODE').success, false);
  assert.strictEqual(service.confirmPayment(receipt.receiptId, receipt.confirmationCode).success, true);
  assert.strictEqual(service.getReceipt(receipt.receiptId).status, 'CONFIRME');
  assert.strictEqual(service.cancelPayment(receipt.receiptId), false, 'un reçu confirmé ne s\'annule pas');
  assert.strictEqual(service.confirmPayment('RCP-INTROUVABLE', 'X').success, false);

  receipt.amount = 1;
  assert.strictEqual(service.verifyReceipt(receipt.receiptId), false, 'le reçu altéré est détecté');
});

test('Paiement: état de compte et solde', () => {
  const service = new MobileMoneyPaymentService({ now: NOW });
  const fees = [
    { feeType: 'MINERVAL', label: 'Minerval', amountDue: 150000 },
    { feeType: 'INSCRIPTION', label: 'Inscription', amountDue: 25000 }
  ];

  let statement = service.getStatement({ studentId: 'ST-001', schoolId: 'SCH-KIN-01', fees });
  assert.strictEqual(statement.totalDue, 175000);
  assert.strictEqual(statement.balance, 175000);
  assert.strictEqual(statement.isSettled, false);

  const receipt = service.initiatePayment({
    parentId: 'PAR-01', studentId: 'ST-001', schoolId: 'SCH-KIN-01', amount: 175000,
    currency: 'CDF', feeType: 'MINERVAL', operator: 'ORANGE_MONEY', payerPhoneNumber: '+243800000000'
  }).receipt;
  service.confirmPayment(receipt.receiptId, receipt.confirmationCode);

  statement = service.getStatement({ studentId: 'ST-001', schoolId: 'SCH-KIN-01', fees });
  assert.strictEqual(statement.totalPaid, 175000);
  assert.strictEqual(statement.balance, 0);
  assert.strictEqual(statement.isSettled, true);
});

test('Article 5: un impayé ne bloque JAMAIS l\'accès académique', async () => {
  const { portal } = await boot();
  const guarantee = portal.getPaymentService().assertNoAcademicBlocking('ST-001');

  assert.strictEqual(guarantee.academicAccessGranted, true);
  assert.strictEqual(guarantee.blockedByFinance, false);
  assert.strictEqual(guarantee.hasOutstandingBalance, true);
  assert.strictEqual(guarantee.reference.includes('Article 5'), true);

  // Le bulletin reste accessible malgré une situation d'impayé
  assert.strictEqual(portal.viewReportCard('ST-001').mention, 'DISTINCTION');
});

test('Article 5: aucune donnée financière dans une charge utile académique', () => {
  const service = new MobileMoneyPaymentService({ now: NOW });

  service.assertAcademicPayloadIsFinancialFree({ mention: 'DISTINCTION', pourcentageOfficiel: 73.14, grades: [] });
  assert.throws(
    () => service.assertAcademicPayloadIsFinancialFree({ mention: 'PASSABLE', solde: 150000 }),
    /VIOLATION_ARTICLE_5/
  );
  assert.throws(
    () => service.assertAcademicPayloadIsFinancialFree({ mention: 'PASSABLE', paymentStatus: 'UNPAID' }),
    /VIOLATION_ARTICLE_5/
  );
});

test('Article 5: la garantie accompagne chaque paiement', async () => {
  const { portal } = await boot();
  const outcome = portal.makePayment({ studentId: 'ST-001', amount: 1000, feeType: 'MINERVAL', operator: 'MPESA' });

  assert.strictEqual(outcome.academicAccessGuarantee.academicAccessGranted, true);
  assert.strictEqual(outcome.academicAccessGuarantee.blockedByFinance, false);
  assert.throws(() => portal.makePayment({ studentId: 'ST-999', amount: 1000, feeType: 'MINERVAL', operator: 'MPESA' }), /ENFANT_INTROUVABLE/);
});

test('Paiement: historique des reçus et conversion de devises', async () => {
  const { portal } = await boot();
  portal.makePayment({ studentId: 'ST-001', amount: 150000, feeType: 'MINERVAL', operator: 'MPESA' });
  portal.makePayment({ studentId: 'ST-001', amount: 25000, feeType: 'INSCRIPTION', operator: 'AIRTEL_MONEY', payerPhoneNumber: '+243970000000' });

  assert.strictEqual(portal.getReceipts('ST-001').length, 2);
  assert.strictEqual(portal.getReceipts('ST-006').length, 0);
  assert.strictEqual(portal.getPaymentService().convert(100, 'USD', 'CDF'), 285000);
  assert.strictEqual(portal.getPaymentService().convert(285000, 'CDF', 'USD'), 100);
});
