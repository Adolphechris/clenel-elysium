export type DiplomaLevel = 'CTEB' | 'EXETAT' | 'GRADUAT' | 'LICENCE' | 'MASTER' | 'DOCTORAT';

export interface DiplomaRecord {
  diplomaId: string;
  serialNumber: string;            // Format: CD-DIP-[PROV]-[YEAR]-[NUM]
  studentIune: string;             // IUNE de l'élève
  studentFullName: string;
  studentBirthDate: string;
  studentBirthPlace: string;
  schoolId: string;
  schoolName: string;
  province: string;
  level: DiplomaLevel;
  optionFiliere: string;
  pourcentage: number;
  mention: string;
  academicYear: string;
  issuedAtUTC: string;
  sealHash: string;               // SHA-256 du certificat canonique
  kmsSignatureHex: string;        // Signature ECDSA P-256 (simulée ou KMS HSM)
  verificationUrl: string;        // https://verify.elysium.cd/:sealHash
  status: 'VALIDE' | 'REVOQUE' | 'SUSPENDU';
  revocationReason?: string;
}

export interface VerificationResult {
  isValid: boolean;
  diploma?: DiplomaRecord;
  verifiedAtUTC: string;
  message: string;
}
