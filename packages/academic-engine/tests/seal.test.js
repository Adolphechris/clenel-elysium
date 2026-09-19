const test = require('node:test');
const assert = require('node:assert');
const { generateReportCardSeal } = require('../dist/seal');

test('Cryptographic Seal: Generates consistent SHA-256 hash and verification URL', () => {
  const reportCard = {
    reportCardId: 'RC-2026-KIN-001',
    studentId: 'STUD-98472',
    studentName: 'Kasongo Ilunga',
    schoolId: 'SCH-GOMBE-01',
    classId: 'CLASS-4-SC-A',
    academicYear: '2026-2027',
    period: 'ANNUEL',
    grades: [],
    deliberation: {
      totalPointsObtenus: 750,
      totalPointsMaxima: 1000,
      pourcentageOfficiel: 75.0,
      mention: 'DISTINCTION',
      isAdmis: true,
      matieresEnEchec: [],
      disciplinesEliminatoiresEchouees: [],
      formuleAppliquee: 'Taux = (Sum P / Sum M) * 100'
    },
    timestampUTC: '2026-09-19T14:00:00Z'
  };

  const seal = generateReportCardSeal(reportCard);

  assert.strictEqual(seal.hash.length, 64); // SHA-256 hex string
  assert.strictEqual(seal.verificationUrl, `https://elysium.cd/verify/${seal.hash}`);

  // Déterminisme : le même payload produit exactement le même hash
  const seal2 = generateReportCardSeal(reportCard);
  assert.strictEqual(seal.hash, seal2.hash);
});
