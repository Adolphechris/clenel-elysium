const test = require('node:test');
const assert = require('node:assert');
const { DiplomaRegistry } = require('../dist/registry');

test('DiplomaRegistry: Issues official sealed diploma (VF-076-01/02)', () => {
  const reg = new DiplomaRegistry();
  const dip = reg.issueDiploma({
    studentIune: 'IUNE-CD-KIN-2026-A1B2C3',
    studentFullName: 'MUKENDI Christian',
    studentBirthDate: '2008-04-12',
    studentBirthPlace: 'Kinshasa',
    schoolId: 'SCH-KIN-001',
    schoolName: 'Collège Boboto',
    province: 'KINSHASA',
    level: 'EXETAT',
    optionFiliere: 'SCIENTIFIQUE',
    pourcentage: 78.5,
    mention: 'DISTINCTION',
    academicYear: '2025-2026'
  });

  assert.strictEqual(dip.status, 'VALIDE');
  assert.strictEqual(dip.serialNumber.startsWith('CD-DIP-KIN-2025-'), true);
  assert.strictEqual(dip.sealHash.length, 64);
  assert.strictEqual(dip.verificationUrl.includes(dip.sealHash), true);
});

test('DiplomaRegistry: Public verification returns valid for authentic diploma', () => {
  const reg = new DiplomaRegistry();
  const dip = reg.issueDiploma({
    studentIune: 'IUNE-CD-KAT-2026-X9Y8Z7',
    studentFullName: 'KABEYA Sylvie',
    studentBirthDate: '2007-11-20',
    studentBirthPlace: 'Lubumbashi',
    schoolId: 'SCH-KAT-002',
    schoolName: 'Institut Twendelee',
    province: 'HAUT-KATANGA',
    level: 'EXETAT',
    optionFiliere: 'COMMERCIALE',
    pourcentage: 64.0,
    mention: 'SATISFACTION',
    academicYear: '2025-2026'
  });

  // Vérification par hash
  const resByHash = reg.verify(dip.sealHash);
  assert.strictEqual(resByHash.isValid, true);
  assert.strictEqual(resByHash.diploma.studentFullName, 'KABEYA Sylvie');

  // Vérification par numéro de série
  const resBySerial = reg.verify(dip.serialNumber);
  assert.strictEqual(resBySerial.isValid, true);
});

test('DiplomaRegistry: Rejects issuance under 50% threshold', () => {
  const reg = new DiplomaRegistry();
  assert.throws(() => {
    reg.issueDiploma({
      studentIune: 'IUNE-CD-KIN-2026-000000',
      studentFullName: 'INCONNU',
      studentBirthDate: '2008-01-01',
      studentBirthPlace: 'Kinshasa',
      schoolId: 'SCH-KIN-001',
      schoolName: 'Collège Boboto',
      province: 'KINSHASA',
      level: 'EXETAT',
      optionFiliere: 'LITTERAIRE',
      pourcentage: 48.0,
      mention: 'ECHEC',
      academicYear: '2025-2026'
    });
  }, /EMISSION_REFUSEE/);
});

test('DiplomaRegistry: Revocation invalidates verification (VF-076-04)', () => {
  const reg = new DiplomaRegistry();
  const dip = reg.issueDiploma({
    studentIune: 'IUNE-CD-KIN-2026-F1A2D3',
    studentFullName: 'FRAUDEUR Jean',
    studentBirthDate: '2006-03-01',
    studentBirthPlace: 'Kinshasa',
    schoolId: 'SCH-KIN-001',
    schoolName: 'Collège Boboto',
    province: 'KINSHASA',
    level: 'EXETAT',
    optionFiliere: 'SCIENTIFIQUE',
    pourcentage: 88.0,
    mention: 'GRANDE_DISTINCTION',
    academicYear: '2025-2026'
  });

  reg.revokeDiploma(dip.sealHash, 'Fraude constatée aux épreuves nationales d Examen d Etat');

  const check = reg.verify(dip.sealHash);
  assert.strictEqual(check.isValid, false);
  assert.strictEqual(check.message.includes('DIPLÔME RÉVOQUÉ'), true);
});
