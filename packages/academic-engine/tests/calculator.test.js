const test = require('node:test');
const assert = require('node:assert');
const { calculateDeliberationRDC } = require('../dist/calculator');

test('RDC Formula: Taux = (Sum P / Sum M) * 100 and NOT average of percentages', () => {
  const grades = [
    { disciplineId: 'FR', disciplineName: 'Français', pointsObtenus: 10, pointsMaxima: 10, coefficient: 1 },
    { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 50, pointsMaxima: 100, coefficient: 1 }
  ];

  const result = calculateDeliberationRDC(grades);

  // Somme P = 60, Somme M = 110 => 60 / 110 * 100 = 54.55%
  // Une moyenne simple aurait donné (100% + 50%) / 2 = 75%
  assert.strictEqual(result.pourcentageOfficiel, 54.55);
  assert.strictEqual(result.totalPointsObtenus, 60);
  assert.strictEqual(result.totalPointsMaxima, 110);
  assert.strictEqual(result.isAdmis, true);
  assert.strictEqual(result.mention, 'PASSABLE');
});

test('Rejects grade exceeding maximum (VF-066-03)', () => {
  const invalidGrades = [
    { disciplineId: 'BIO', disciplineName: 'Biologie', pointsObtenus: 25, pointsMaxima: 20 }
  ];

  assert.throws(() => {
    calculateDeliberationRDC(invalidGrades);
  }, /DEPASSEMENT_MAXIMA/);
});

test('Rejects negative grade', () => {
  const invalidGrades = [
    { disciplineId: 'CHIM', disciplineName: 'Chimie', pointsObtenus: -5, pointsMaxima: 20 }
  ];

  assert.throws(() => {
    calculateDeliberationRDC(invalidGrades);
  }, /NOTE_INVALIDE/);
});

test('Eliminatory subject failure fails deliberation even with >= 50% total (VF-067-05)', () => {
  const grades = [
    { disciplineId: 'INFO', disciplineName: 'Informatique', pointsObtenus: 40, pointsMaxima: 100, isEliminatoire: true },
    { disciplineId: 'ANG', disciplineName: 'Anglais', pointsObtenus: 90, pointsMaxima: 100, isEliminatoire: false }
  ];

  // Total: 130 / 200 = 65% (Taux >= 50%), mais échec en Informatique éliminatoire (< 50%)
  const result = calculateDeliberationRDC(grades);

  assert.strictEqual(result.pourcentageOfficiel, 65.0);
  assert.strictEqual(result.isAdmis, false);
  assert.strictEqual(result.mention, 'AJOURNE');
  assert.deepStrictEqual(result.disciplinesEliminatoiresEchouees, ['Informatique']);
});

test('Mentions RDC attribution', () => {
  // PGD >= 90%
  const pgd = calculateDeliberationRDC([{ disciplineId: '1', disciplineName: 'M', pointsObtenus: 95, pointsMaxima: 100 }]);
  assert.strictEqual(pgd.mention, 'PLUS_GRANDE_DISTINCTION');

  // GD >= 80%
  const gd = calculateDeliberationRDC([{ disciplineId: '1', disciplineName: 'M', pointsObtenus: 84, pointsMaxima: 100 }]);
  assert.strictEqual(gd.mention, 'GRANDE_DISTINCTION');

  // Distinction >= 70%
  const d = calculateDeliberationRDC([{ disciplineId: '1', disciplineName: 'M', pointsObtenus: 72, pointsMaxima: 100 }]);
  assert.strictEqual(d.mention, 'DISTINCTION');

  // Satisfaction >= 60%
  const s = calculateDeliberationRDC([{ disciplineId: '1', disciplineName: 'M', pointsObtenus: 61, pointsMaxima: 100 }]);
  assert.strictEqual(s.mention, 'SATISFACTION');

  // Ajourné < 50%
  const aj = calculateDeliberationRDC([{ disciplineId: '1', disciplineName: 'M', pointsObtenus: 48, pointsMaxima: 100 }]);
  assert.strictEqual(aj.mention, 'AJOURNE');
  assert.strictEqual(aj.isAdmis, false);
});
