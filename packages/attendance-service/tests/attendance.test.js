const test = require('node:test');
const assert = require('node:assert');
const { calculateStudentAttendance } = require('../dist/attendance');

test('Attendance: Calculates perfect 100% attendance rate', () => {
  const entries = [
    { studentId: 'S1', schoolId: 'SCH1', classId: 'C1', date: '2026-09-01', status: 'PRESENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '1' },
    { studentId: 'S1', schoolId: 'SCH1', classId: 'C1', date: '2026-09-02', status: 'PRESENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '2' },
    { studentId: 'S1', schoolId: 'SCH1', classId: 'C1', date: '2026-09-03', status: 'PRESENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '3' }
  ];

  const summary = calculateStudentAttendance('S1', entries);
  assert.strictEqual(summary.tauxAssiduite, 100.0);
  assert.strictEqual(summary.presents, 3);
  assert.strictEqual(summary.requiresParentAlert, false);
});

test('Attendance: Triggers parent alert on 3 consecutive unexcused absences (VF-065-03)', () => {
  const entries = [
    { studentId: 'S2', schoolId: 'SCH1', classId: 'C1', date: '2026-09-01', status: 'PRESENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '1' },
    { studentId: 'S2', schoolId: 'SCH1', classId: 'C1', date: '2026-09-02', status: 'ABSENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '2' },
    { studentId: 'S2', schoolId: 'SCH1', classId: 'C1', date: '2026-09-03', status: 'ABSENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '3' },
    { studentId: 'S2', schoolId: 'SCH1', classId: 'C1', date: '2026-09-04', status: 'ABSENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '4' }
  ];

  const summary = calculateStudentAttendance('S2', entries);
  assert.strictEqual(summary.consecutiveAbsences, 3);
  assert.strictEqual(summary.requiresParentAlert, true);
  assert.strictEqual(summary.alertReason.includes('3 absences consécutives'), true);
});

test('Attendance: Retards and excuses are handled accurately', () => {
  const entries = [
    { studentId: 'S3', schoolId: 'SCH1', classId: 'C1', date: '2026-09-01', status: 'PRESENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '1' },
    { studentId: 'S3', schoolId: 'SCH1', classId: 'C1', date: '2026-09-02', status: 'EXCUSE', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '2' },
    { studentId: 'S3', schoolId: 'SCH1', classId: 'C1', date: '2026-09-03', status: 'RETARD', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '3' },
    { studentId: 'S3', schoolId: 'SCH1', classId: 'C1', date: '2026-09-04', status: 'PRESENT', markedByTeacherId: 'T1', timestampUTC: '', parentNotified: false, attendanceId: '4' }
  ];

  const summary = calculateStudentAttendance('S3', entries);
  // (2 presents + 1 excuse + 0.5 retard) / 4 = 3.5 / 4 = 87.5%
  assert.strictEqual(summary.tauxAssiduite, 87.5);
  assert.strictEqual(summary.requiresParentAlert, false);
});
