import { DiplomaRecord, DiplomaLevel, VerificationResult } from './types';
/**
 * Registre Souverain d'Authenticité des Diplômes — Module 76
 * VF-076-01 : Tout diplôme officiel est scellé cryptographiquement et vérifiable publiquement.
 * VF-076-02 : Numéro de série national unique et non-reproductible.
 * VF-076-03 : Immutabilité garantie — conservation 100 ans (WORM Storage).
 * VF-076-04 : Révocation publique traçable avec motif obligatoire.
 */
export declare class DiplomaRegistry {
    private diplomas;
    private serials;
    /**
     * Émet et enregistre un diplôme officiel scellé.
     */
    issueDiploma(params: {
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
    }): DiplomaRecord;
    /**
     * Vérifie publiquement l'authenticité d'un diplôme via son hash ou numéro de série.
     */
    verify(query: string): VerificationResult;
    /**
     * Révocation d'un diplôme frauduleux (VF-076-04).
     */
    revokeDiploma(sealHash: string, reason: string): DiplomaRecord;
    getRegistryCount(): number;
}
