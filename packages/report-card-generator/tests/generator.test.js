const test = require('node:test');
const assert = require('node:assert');
const { generateOfficialReportCard } = require('../dist/generator');
const { calculateDeliberationRDC } = require('@elysium/academic-engine');

test('Generates sealed official report card with valid HTML and SHA-256 seal', () => {
  const grades = [
    { disciplineId: 'FR', disciplineName: 'Français', pointsObtenus: 38, pointsMaxima: 50, coefficient: 2 },
    { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 75, pointsMaxima: 100, coefficient: 3 },
    { disciplineId: 'PHY', disciplineName: 'Physique', pointsObtenus: 32, pointsMaxima: 50, coefficient: 2 }
  ];

  const deliberation = calculateDeliberationRDC(grades);

  const rawCard = {
    reportCardId: 'BULLETIN-2026-0001',
    studentId: 'IUNE-CD-KIN-2026-9921',
    studentName: 'Mukendi Tshilumba David',
    schoolId: 'COLLEGE_BOBOTO_KINSHASA',
    classId: '4EME_HUMANITES_SCIENTIFIQUES',
    academicYear: '2026-2027',
    period: 'ANNUEL',
    grades,
    deliberation,
    timestampUTC: '2026-09-19T14:30:00Z'
  };

  const doc = generateOfficialReportCard(rawCard);

  assert.strictEqual(doc.hash.length, 64);
  assert.strictEqual(doc.verificationUrl.startsWith('https://elysium.cd/verify/'), true);
  assert.strictEqual(doc.htmlContent.includes('RÉPUBLIQUE DÉMOCRATIQUE DU CONGO'), true);
  assert.strictEqual(doc.htmlContent.includes('Mukendi Tshilumba David'), true);
  assert.strictEqual(doc.htmlContent.includes('COLLEGE_BOBOTO_KINSHASA'), true);
  assert.strictEqual(doc.htmlContent.includes('73%'), true);
  assert.strictEqual(doc.htmlContent.includes(doc.hash), true);
});
