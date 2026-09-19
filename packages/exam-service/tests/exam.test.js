const test = require('node:test');
const assert = require('node:assert');
const { ExamService } = require('../dist/exam');

const svc = new ExamService();
const discipline = {
  disciplineId: 'MATH', disciplineName: 'Mathématiques',
  coefficient: 3, pointsMaxima: 100,
  examDate: '2026-09-25', examStartTime: '07:30',
  room: 'Salle A', surveillants: ['SURV-1']
};

let examId;
test('Exam: Plans a valid exam session (VF-075-01)', () => {
  const session = svc.planExamSession({
    schoolId: 'SCH-1', classId: 'CLS-1',
    type: 'EXAMEN_SEMESTRIEL', academicYear: '2026-2027', semester: 1,
    disciplines: [discipline],
    startDate: '2026-09-25', endDate: '2026-10-02',
    juryPresidentId: 'PRES-1', juryMembers: ['MEM-1', 'MEM-2']
  });
  examId = session.examId;
  assert.strictEqual(session.status, 'PLANIFIE');
  assert.strictEqual(session.examId.startsWith('EXAM-'), true);
});

test('Exam: Deliberates student with GRANDE DISTINCTION (≥80%)', () => {
  const delib = svc.deliberateStudent({
    examId,
    studentId: 'ST-001',
    gradesByDiscipline: [
      { disciplineId: 'MATH', points: 85, maxima: 100, isEliminatoire: false }
    ]
  });
  assert.strictEqual(delib.decision, 'ADMIS');
  assert.strictEqual(delib.mention, 'GRANDE_DISTINCTION');
  assert.strictEqual(delib.pourcentage, 85);
  assert.strictEqual(typeof delib.sealHash, 'string');
  assert.strictEqual(delib.sealHash.length, 64);
});

test('Exam: Eliminatory failure overrides passing average (VF-067-01)', () => {
  const delib = svc.deliberateStudent({
    examId,
    studentId: 'ST-002',
    gradesByDiscipline: [
      { disciplineId: 'MATH', points: 20, maxima: 100, isEliminatoire: true }, // 20% < 50% — ELIMINATOIRE
      { disciplineId: 'FR', points: 45, maxima: 50, isEliminatoire: false }    // 90%
    ]
  });
  assert.strictEqual(delib.decision, 'AJOURNE');
  assert.strictEqual(delib.mention, 'ECHEC_MATIERE_ELIMINATOIRE');
});

test('Exam: Sealing prevents further modifications (VF-075-02/03)', () => {
  svc.sealSession(examId, 'PRES-1');
  assert.throws(() => {
    svc.deliberateStudent({
      examId, studentId: 'ST-003',
      gradesByDiscipline: [{ disciplineId: 'MATH', points: 70, maxima: 100, isEliminatoire: false }]
    });
  }, /EXAM_SELLE/);
});
