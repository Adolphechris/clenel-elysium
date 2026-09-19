/**
 * Types officiels du Moteur Académique ELLYSIUM (RDC)
 * Conforme au Tome 4, Tome 5 (Module 67) et Tome 9 (Module 141)
 */

export interface GradeItem {
  disciplineId: string;
  disciplineName: string;
  pointsObtenus: number;
  pointsMaxima: number;
  coefficient?: number;
  isEliminatoire?: boolean; // Matière fondamentale
}

export type MentionRDC = 
  | 'PLUS_GRANDE_DISTINCTION' // >= 90%
  | 'GRANDE_DISTINCTION'      // >= 80%
  | 'DISTINCTION'             // >= 70%
  | 'SATISFACTION'            // >= 60%
  | 'PASSABLE'                // >= 50%
  | 'AJOURNE'                 // < 50% ou échec éliminatoire
  | 'REFUSE';                 // Défaut grave / fraude

export interface DeliberationResult {
  totalPointsObtenus: number;
  totalPointsMaxima: number;
  pourcentageOfficiel: number; // Arrondi à 2 décimales
  mention: MentionRDC;
  isAdmis: boolean;
  matieresEnEchec: string[];
  disciplinesEliminatoiresEchouees: string[];
  formuleAppliquee: string;
}

export interface StudentReportCard {
  reportCardId: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  classId: string;
  academicYear: string;
  period: 'PREMIER_SEMESTRE' | 'SECOND_SEMESTRE' | 'ANNUEL';
  grades: GradeItem[];
  deliberation: DeliberationResult;
  timestampUTC: string;
  cryptographicHash?: string;
  verificationUrl?: string;
}
