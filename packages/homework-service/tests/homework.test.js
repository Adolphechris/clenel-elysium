const test = require('node:test');
const assert = require('node:assert');
const { HomeworkService } = require('../dist/homework');

function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

test('Homework: Creates published homework with future due date', () => {
  const svc = new HomeworkService();
  const hw = svc.createHomework({
    classId: 'CLS-1', schoolId: 'SCH-1',
    disciplineId: 'MATH', disciplineName: 'Mathématiques',
    teacherId: 'PROF-1', title: 'Exercices algèbre',
    instructions: 'Résoudre les équations du second degré.',
    maxPoints: 20, dueDateUTC: futureDate(7)
  });
  assert.strictEqual(hw.status, 'PUBLIE');
  assert.strictEqual(hw.homeworkId.startsWith('HW-'), true);
});

test('Homework: Student submits, then receives grade (VF-069-03 — immutable)', () => {
  const svc = new HomeworkService();
  const hw = svc.createHomework({
    classId: 'CLS-1', schoolId: 'SCH-1',
    disciplineId: 'FR', disciplineName: 'Français',
    teacherId: 'PROF-2', title: 'Dissertation',
    instructions: 'Rédigez une dissertation sur le colonialisme.',
    maxPoints: 30, dueDateUTC: futureDate(3)
  });

  const sub = svc.submitHomework(hw.homeworkId, 'ST-001', 'Voici ma dissertation...');
  assert.strictEqual(sub.status, 'SOUMIS');

  const graded = svc.gradeSubmission(hw.homeworkId, sub.submissionId, 25, 'Très bon travail, argumentation solide.');
  assert.strictEqual(graded.grade, 25);
  assert.strictEqual(graded.status, 'CORRIGE');

  // VF-069-03 : Tentative de re-correction → erreur
  assert.throws(() => {
    svc.gradeSubmission(hw.homeworkId, sub.submissionId, 10, 'Modification frauduleuse');
  }, /DEJA_CORRIGE/);
});

test('Homework: Rejects duplicate submission', () => {
  const svc = new HomeworkService();
  const hw = svc.createHomework({
    classId: 'CLS-1', schoolId: 'SCH-1',
    disciplineId: 'BIO', disciplineName: 'Biologie',
    teacherId: 'PROF-3', title: 'TP cellule',
    instructions: 'Dessinez et légendez la cellule animale.',
    maxPoints: 15, dueDateUTC: futureDate(5)
  });
  svc.submitHomework(hw.homeworkId, 'ST-002', 'Premier rendu');
  assert.throws(() => {
    svc.submitHomework(hw.homeworkId, 'ST-002', 'Deuxième tentative');
  }, /DEJA_SOUMIS/);
});
