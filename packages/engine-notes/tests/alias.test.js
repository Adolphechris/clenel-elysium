const test = require('node:test');
const assert = require('node:assert');
const engineNotes = require('../dist/index.js');
const academicEngine = require('@elysium/academic-engine');

test('Engine Notes: ré-exporte la fonction de délibération officielle', () => {
  assert.strictEqual(
    engineNotes.calculateDeliberationRDC,
    academicEngine.calculateDeliberationRDC
  );

  const result = engineNotes.calculateDeliberationRDC([
    { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 15, pointsMaxima: 20, coefficient: 2 }
  ]);

  assert.strictEqual(result.pourcentageOfficiel, 75);
  assert.strictEqual(result.mention, 'DISTINCTION');
  assert.strictEqual(result.isAdmis, true);
});

test('Engine Notes: ré-exporte le sceau cryptographique des bulletins', () => {
  assert.strictEqual(
    engineNotes.generateReportCardSeal,
    academicEngine.generateReportCardSeal
  );
});

test('Engine Notes: la formule RDC reste inviolable via l\'alias', () => {
  assert.throws(
    () => engineNotes.calculateDeliberationRDC([
      { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 30, pointsMaxima: 20 }
    ]),
    /DEPASSEMENT_MAXIMA/
  );
  assert.throws(() => engineNotes.calculateDeliberationRDC([]), /ERREUR_ACADEMIQUE/);
});
