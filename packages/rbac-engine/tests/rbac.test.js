const test = require('node:test');
const assert = require('node:assert');
const { RbacEngine } = require('../dist/rbac');

const engine = new RbacEngine();
const SCH = 'SCH-KIN-01';

test('RBAC: ENSEIGNANT can write grades (own school)', () => {
  const decision = engine.evaluate({
    requesterId: 'PROF-1', requesterRole: 'ENSEIGNANT',
    requesterSchoolId: SCH, targetSchoolId: SCH,
    resource: 'grades', action: 'WRITE'
  });
  assert.strictEqual(decision.granted, true);
  assert.strictEqual(decision.httpStatus, 200);
});

test('RBAC: ENSEIGNANT CANNOT access finances (Article 5 — VF-080-03)', () => {
  const decision = engine.evaluate({
    requesterId: 'PROF-1', requesterRole: 'ENSEIGNANT',
    requesterSchoolId: SCH, targetSchoolId: SCH,
    resource: 'finances', action: 'READ'
  });
  assert.strictEqual(decision.granted, false);
  assert.strictEqual(decision.httpStatus, 403);
  assert.strictEqual(decision.reason.includes('FORBIDDEN_ARTICLE_5'), true);
});

test('RBAC: ELEVE CANNOT access finances (Article 5)', () => {
  const decision = engine.evaluate({
    requesterId: 'ST-001', requesterRole: 'ELEVE',
    requesterSchoolId: SCH, targetSchoolId: SCH,
    resource: 'finances', action: 'READ'
  });
  assert.strictEqual(decision.granted, false);
  assert.strictEqual(decision.reason.includes('FORBIDDEN_ARTICLE_5'), true);
});

test('RBAC: COMPTABLE can access finances', () => {
  const decision = engine.evaluate({
    requesterId: 'CAS-01', requesterRole: 'COMPTABLE',
    requesterSchoolId: SCH, targetSchoolId: SCH,
    resource: 'finances', action: 'WRITE'
  });
  assert.strictEqual(decision.granted, true);
});

test('RBAC: Cross-school access blocked for ENSEIGNANT (VF-080-02)', () => {
  const decision = engine.evaluate({
    requesterId: 'PROF-2', requesterRole: 'ENSEIGNANT',
    requesterSchoolId: SCH, targetSchoolId: 'SCH-KIN-99',
    resource: 'grades', action: 'READ'
  });
  assert.strictEqual(decision.granted, false);
  assert.strictEqual(decision.reason.includes('INTERDIT_CLOISONNEMENT'), true);
});

test('RBAC: ELEVE cannot read other student data (ABAC — VF-080-04)', () => {
  const decision = engine.evaluate({
    requesterId: 'ST-001', requesterRole: 'ELEVE',
    requesterSchoolId: SCH, targetSchoolId: SCH,
    resource: 'grades', action: 'READ',
    targetOwnerId: 'ST-999' // Autre élève
  });
  assert.strictEqual(decision.granted, false);
  assert.strictEqual(decision.reason.includes('FORBIDDEN_ABAC'), true);
});

test('RBAC: SUPER_ADMIN can read cross-school audit logs', () => {
  const decision = engine.evaluate({
    requesterId: 'CNEL-1', requesterRole: 'SUPER_ADMIN',
    requesterSchoolId: 'CNEL-HQ', targetSchoolId: SCH,
    resource: 'audit_logs', action: 'READ'
  });
  assert.strictEqual(decision.granted, true);
});
