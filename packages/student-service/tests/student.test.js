const test = require('node:test');
const assert = require('node:assert');
const { StudentService } = require('../dist/student');

test('Student: Generates valid national IUNE according to Congolese standard', () => {
  const service = new StudentService();
  const iune = service.generateIUNE('KIN', 2026);
  assert.strictEqual(/^IUNE-CD-KIN-2026-[0-9A-F]{6}$/.test(iune), true);
});

test('Student: Registers student profile with unique ID and timestamp', () => {
  const service = new StudentService();
  const profile = service.registerStudent({
    firstName: 'Glodi',
    lastName: 'Kabuya',
    gender: 'M',
    birthDate: '2010-04-12',
    provinceCode: 'HKT',
    schoolId: 'SCH-LUBUMBASHI-01',
    isIndependent: false
  });

  assert.strictEqual(profile.firstName, 'Glodi');
  assert.strictEqual(profile.lastName, 'KABUYA');
  assert.strictEqual(profile.iune.startsWith('IUNE-CD-HKT-2026-'), true);
  assert.strictEqual(profile.studentId.startsWith('STU-'), true);
});

test('Student: Records transfer between schools with traceable audit record (VF-060-03)', () => {
  const service = new StudentService();
  const student = service.registerStudent({
    firstName: 'Sarah',
    lastName: 'Mpemba',
    gender: 'F',
    birthDate: '2011-08-20',
    provinceCode: 'KIN',
    schoolId: 'SCH-GOMBE-01',
    isIndependent: false
  });

  const { updatedStudent, transferRecord } = service.recordTransfer(
    student,
    'SCH-LIMETE-02',
    'PREFET-99',
    'Déménagement familial à Limete'
  );

  assert.strictEqual(updatedStudent.schoolId, 'SCH-LIMETE-02');
  assert.strictEqual(transferRecord.fromSchoolId, 'SCH-GOMBE-01');
  assert.strictEqual(transferRecord.toSchoolId, 'SCH-LIMETE-02');
  assert.strictEqual(transferRecord.approvedByPrefetId, 'PREFET-99');
});
