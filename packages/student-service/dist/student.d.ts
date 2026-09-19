import { StudentProfile } from '@elysium/shared-types';
import { AdmissionRequest, StudentTransferRecord } from './types';
/**
 * Service de gestion des élèves et de l'IUNE (Identifiant Unique National ELLYSIUM)
 * Verrous associés : VF-058-01, VF-060-01, VF-060-03
 */
export declare class StudentService {
    /**
     * Génère un IUNE officiel respectant le format standard congolais :
     * IUNE-CD-[PROVINCE]-[ANNEE]-[6_HEX]
     */
    generateIUNE(provinceCode: string, year?: number): string;
    /**
     * Crée un dossier numérique unifié d'élève.
     */
    registerStudent(request: AdmissionRequest): StudentProfile;
    /**
     * Enregistre un transfert d'établissement avec traçabilité immuable (VF-060-03)
     */
    recordTransfer(student: StudentProfile, toSchoolId: string, prefetId: string, reason: string): {
        updatedStudent: StudentProfile;
        transferRecord: StudentTransferRecord;
    };
}
