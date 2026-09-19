const test = require('node:test');
const assert = require('node:assert');
const { NotificationService } = require('../dist/notification');

test('Notification: URGENT absence alert triggers FCM+SMS+IN_APP (VF-070-01)', () => {
  const svc = new NotificationService();
  const notif = svc.alertAbsenceToParent({
    studentId: 'ST-001', studentName: 'Kasongo David',
    parentId: 'PAR-001', parentPhone: '+243810000001',
    schoolId: 'SCH-KIN', date: '2026-09-19', consecutiveAbsences: 3
  });
  assert.strictEqual(notif.priority, 'URGENT');
  assert.strictEqual(notif.channels.includes('FCM_PUSH'), true);
  assert.strictEqual(notif.channels.includes('SMS'), true);
  assert.strictEqual(notif.type, 'ABSENCE_ALERT');
});

test('Notification: Non-urgent absence uses lighter channels', () => {
  const svc = new NotificationService();
  const notif = svc.alertAbsenceToParent({
    studentId: 'ST-002', studentName: 'Lumembe Sara',
    parentId: 'PAR-002', parentPhone: '+243820000002',
    schoolId: 'SCH-KIN', date: '2026-09-19', consecutiveAbsences: 1
  });
  assert.strictEqual(notif.priority, 'HAUTE');
  assert.strictEqual(notif.channels.includes('SMS'), false);
});

test('Notification: Results notification sent with correct mention', async () => {
  const svc = new NotificationService();
  const notif = svc.notifyResultsPublished({
    studentId: 'ST-003', parentId: 'PAR-003',
    schoolId: 'SCH-KIN', reportCardId: 'RC-001',
    mention: 'GRANDE_DISTINCTION', pourcentage: 82.4, isAdmis: true
  });
  assert.strictEqual(notif.type, 'DELIBERATION_RESULT');
  assert.strictEqual(notif.body.includes('82.4%'), true);
  assert.strictEqual(notif.body.includes('ADMIS'), true);

  const result = await svc.send(notif.notificationId);
  assert.strictEqual(result.overallSuccess, true);
  assert.strictEqual(svc.getSentCount(), 1);
});
