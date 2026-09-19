const test = require('node:test');
const assert = require('node:assert');
const { ImmutableAuditTrail } = require('../dist/audit');

test('Audit Trail: Logs events and builds cryptographic chain', () => {
  const trail = new ImmutableAuditTrail();

  trail.log('STUDENT_ENROLLED', 'OP-1', 'PREFET', 'ST-001', 'Student', { school: 'SCH-1' });
  trail.log('GRADE_SUBMITTED', 'OP-2', 'ENSEIGNANT', 'GR-001', 'Grade', { points: 42 });
  trail.log('REPORT_CARD_GENERATED', 'OP-1', 'PREFET', 'RC-001', 'ReportCard', {});

  const events = trail.getEvents();
  assert.strictEqual(events.length, 3);

  // Vérification de la chaîne Merkle
  assert.strictEqual(events[0].previousHash, '0'.repeat(64)); // Genesis
  assert.strictEqual(events[1].previousHash, events[0].eventHash); // Chaîne
  assert.strictEqual(events[2].previousHash, events[1].eventHash); // Chaîne
});

test('Audit Trail: Chain integrity verification passes on unmodified trail', () => {
  const trail = new ImmutableAuditTrail();

  trail.log('PAYMENT_RECORDED', 'CAS-01', 'COMPTABLE', 'PAY-001', 'Payment', { amount: 100 });
  trail.log('DIPLOMA_ISSUED', 'OP-1', 'PREFET', 'DIP-001', 'Diploma', {});

  const result = trail.verifyChainIntegrity();
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.brokenAtIndex, undefined);
});

test('Audit Trail: Detects chain tampering (VF-155-05)', () => {
  const trail = new ImmutableAuditTrail();
  trail.log('GRADE_SUBMITTED', 'OP-1', 'ENSEIGNANT', 'GR-001', 'Grade', { points: 30 });
  trail.log('DELIBERATION_SEALED', 'OP-2', 'PREFET', 'DEL-001', 'Deliberation', {});

  // Simulation de tampering: altération directe d'un événement
  const events = trail.getEvents();
  events[0].payload = { points: 50 }; // Tentative de fraude

  const result = trail.verifyChainIntegrity();
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.brokenAtIndex, 0);
});
