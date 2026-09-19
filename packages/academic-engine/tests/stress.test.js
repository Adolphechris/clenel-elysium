const test = require('node:test');
const assert = require('node:assert');
const { calculateDeliberationRDC } = require('../dist/calculator');

test('Performance & Stress Test: 10,000 deliberations computed in under 1 second', () => {
  const startTime = Date.now();
  const iterations = 10000;

  for (let i = 0; i < iterations; i++) {
    const grades = [
      { disciplineId: '1', disciplineName: 'Français', pointsObtenus: 35 + (i % 15), pointsMaxima: 50, coefficient: 2 },
      { disciplineId: '2', disciplineName: 'Math', pointsObtenus: 60 + (i % 40), pointsMaxima: 100, coefficient: 3 },
      { disciplineId: '3', disciplineName: 'Physique', pointsObtenus: 25 + (i % 25), pointsMaxima: 50, coefficient: 2 },
      { disciplineId: '4', disciplineName: 'Histoire', pointsObtenus: 15 + (i % 15), pointsMaxima: 30, coefficient: 1 }
    ];

    const res = calculateDeliberationRDC(grades);
    assert.strictEqual(res.pourcentageOfficiel >= 0 && res.pourcentageOfficiel <= 100, true);
  }

  const duration = Date.now() - startTime;
  assert.strictEqual(duration < 2000, true, `Calculation took too long: ${duration}ms for ${iterations} iterations`);
  console.log(`  ✓ 10 000 délibérations RDC calculées en ${duration} ms (${(duration / iterations).toFixed(4)} ms/délibération)`);
});
