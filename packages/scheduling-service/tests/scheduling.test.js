const test = require('node:test');
const assert = require('node:assert');
const { SchedulingService } = require('../dist/scheduling');

test('Scheduling: Configures class with correct total maxima for RDC formula', () => {
  const svc = new SchedulingService();
  const cls = svc.configureClass({
    schoolId: 'SCH-KIN',
    name: '4ème Humanités Scientifiques',
    level: '4EME', filiere: 'SCIENTIFIQUE',
    disciplines: [
      { name: 'Mathématiques', code: 'MATH', coefficient: 3, pointsMaxima: 100, isEliminatoire: true, cycleLevel: 'HUMANITES', filiere: 'SCIENTIFIQUE' },
      { name: 'Physique', code: 'PHYS', coefficient: 2, pointsMaxima: 50, isEliminatoire: false, cycleLevel: 'HUMANITES', filiere: 'SCIENTIFIQUE' },
      { name: 'Français', code: 'FR', coefficient: 2, pointsMaxima: 50, isEliminatoire: false, cycleLevel: 'HUMANITES', filiere: 'SCIENTIFIQUE' }
    ]
  });
  // MATH: 100*3=300, PHYS: 50*2=100, FR: 50*2=100 => Total = 500
  assert.strictEqual(cls.totalMaximaAnnuel, 500);
  assert.strictEqual(cls.totalMaximaSemestriel, 250);
  assert.strictEqual(cls.disciplines.length, 3);
});

test('Scheduling: Validates valid schedule with no conflicts', () => {
  const svc = new SchedulingService();
  const result = svc.validateSchedule('CLS-1', 'SCH-1', '2026-2027', [
    { slotId: '1', dayOfWeek: 'LUNDI', startTime: '07:30', endTime: '09:30', disciplineId: 'D1', disciplineName: 'Math', teacherId: 'T1', classId: 'CLS-1' },
    { slotId: '2', dayOfWeek: 'LUNDI', startTime: '10:00', endTime: '12:00', disciplineId: 'D2', disciplineName: 'Français', teacherId: 'T2', classId: 'CLS-1' }
  ]);
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.validationErrors.length, 0);
  assert.strictEqual(result.totalHoursPerWeek, 4);
});

test('Scheduling: Detects teacher double-booking conflict (VF-064-03)', () => {
  const svc = new SchedulingService();
  const result = svc.validateSchedule('CLS-1', 'SCH-1', '2026-2027', [
    { slotId: '1', dayOfWeek: 'MARDI', startTime: '08:00', endTime: '10:00', disciplineId: 'D1', disciplineName: 'Math', teacherId: 'PROF-1', classId: 'CLS-1' },
    { slotId: '2', dayOfWeek: 'MARDI', startTime: '09:00', endTime: '11:00', disciplineId: 'D2', disciplineName: 'Physique', teacherId: 'PROF-1', classId: 'CLS-2' }
  ]);
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.validationErrors.some(e => e.includes('VF-064-03')), true);
});
