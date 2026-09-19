import * as crypto from 'crypto';
import { StudentProfile } from '@elysium/shared-types';
import { AdmissionRequest, StudentTransferRecord } from './types';

/**
 * Service de gestion des élèves et de l'IUNE (Identifiant Unique National ELLYSIUM)
 * Verrous associés : VF-058-01, VF-060-01, VF-060-03
 */
export class StudentService {
  /**
   * Génère un IUNE officiel respectant le format standard congolais :
   * IUNE-CD-[PROVINCE]-[ANNEE]-[6_HEX]
   */
  public generateIUNE(provinceCode: string, year: number = 2026): string {
    const cleanProvince = provinceCode.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    const entropy = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `IUNE-CD-${cleanProvince || 'KIN'}-${year}-${entropy}`;
  }

  /**
   * Crée un dossier numérique unifié d'élève.
   */
  public registerStudent(request: AdmissionRequest): StudentProfile {
    if (!request.firstName || !request.lastName) {
      throw new Error("DONNEES_MANQUANTES: Le nom et le prénom de l'élève sont obligatoires.");
    }

    const studentId = `STU-${crypto.randomUUID()}`;
    const iune = this.generateIUNE(request.provinceCode);
    const enrollmentDateUTC = new Date().toISOString();

    return {
      studentId,
      iune,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim().toUpperCase(),
      gender: request.gender,
      birthDate: request.birthDate,
      schoolId: request.schoolId,
      classId: request.classId,
      isIndependent: request.isIndependent,
      parentPhone: request.parentPhone,
      enrollmentDateUTC
    };
  }

  /**
   * Enregistre un transfert d'établissement avec traçabilité immuable (VF-060-03)
   */
  public recordTransfer(
    student: StudentProfile,
    toSchoolId: string,
    prefetId: string,
    reason: string
  ): { updatedStudent: StudentProfile; transferRecord: StudentTransferRecord } {
    if (!student.schoolId) {
      throw new Error("TRANSFERT_IMPOSSIBLE: L'élève n'est rattaché à aucun établissement d'origine.");
    }
    if (student.schoolId === toSchoolId) {
      throw new Error("TRANSFERT_INVALIDE: L'établissement de destination est identique à l'origine.");
    }

    const transferRecord: StudentTransferRecord = {
      transferId: `TRF-${crypto.randomUUID()}`,
      studentId: student.studentId,
      fromSchoolId: student.schoolId,
      toSchoolId,
      reason,
      approvedByPrefetId: prefetId,
      timestampUTC: new Date().toISOString()
    };

    const updatedStudent: StudentProfile = {
      ...student,
      schoolId: toSchoolId
    };

    return { updatedStudent, transferRecord };
  }
}
