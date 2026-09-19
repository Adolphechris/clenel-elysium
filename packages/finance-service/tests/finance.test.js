const test = require('node:test');
const assert = require('node:assert');
const { SealedFinanceService } = require('../dist/finance');

test('Finance: Generates valid receipt with transaction reference', () => {
  const service = new SealedFinanceService();
  const req = {
    schoolId: 'SCH-BOBOTO',
    studentId: 'ST-001',
    amount: 150,
    currency: 'USD',
    feeType: 'MINERVAL',
    paymentChannel: 'MPESA',
    cashierId: 'CASHIER-01'
  };

  const res = service.processPayment(req);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.receipt.amount, 150);
  assert.strictEqual(res.receipt.paymentChannel, 'MPESA');
  assert.strictEqual(res.transactionRef.startsWith('TX-'), true);
});

test('Finance: Rejects invalid or negative amounts', () => {
  const service = new SealedFinanceService();
  const res = service.processPayment({
    schoolId: 'SCH-1',
    studentId: 'ST-1',
    amount: -10,
    currency: 'USD',
    feeType: 'MINERVAL',
    paymentChannel: 'CASH',
    cashierId: 'C-1'
  });

  assert.strictEqual(res.success, false);
  assert.strictEqual(res.errorMessage.includes('MONTANT_INVALIDE'), true);
});

test('Finance: Enforces Article 5 barrier against academic roles (VF-071-01)', () => {
  const service = new SealedFinanceService();

  // Enseignant bloqué
  assert.throws(() => {
    service.assertFinancialAccessAuthorized('ENSEIGNANT');
  }, /VIOLATION_ARTICLE_5/);

  // Élève bloqué
  assert.throws(() => {
    service.assertFinancialAccessAuthorized('ELEVE_AFFILIE');
  }, /VIOLATION_ARTICLE_5/);

  // Comptable et préfet autorisés
  assert.doesNotThrow(() => {
    service.assertFinancialAccessAuthorized('COMPTABLE');
    service.assertFinancialAccessAuthorized('PREFET');
  });
});
