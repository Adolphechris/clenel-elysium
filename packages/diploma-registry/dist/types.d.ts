export type DiplomaLevel = 'CTEB' | 'EXETAT' | 'GRADUAT' | 'LICENCE' | 'MASTER' | 'DOCTORAT';
export interface DiplomaRecord {
    diplomaId: string;
    serialNumber: string;
    studentIune: string;
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
    sealHash: string;
    kmsSignatureHex: string;
    verificationUrl: string;
    status: 'VALIDE' | 'REVOQUE' | 'SUSPENDU';
    revocationReason?: string;
}
export interface VerificationResult {
    isValid: boolean;
    diploma?: DiplomaRecord;
    verifiedAtUTC: string;
    message: string;
}
