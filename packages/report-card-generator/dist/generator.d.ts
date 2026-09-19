import { StudentReportCard } from '@elysium/academic-engine';
export interface GeneratedDocument {
    reportCard: StudentReportCard;
    htmlContent: string;
    hash: string;
    verificationUrl: string;
}
/**
 * Génère un bulletin officiel scellé prêt pour l'impression ou la conversion PDF/A
 * Verrous associés : VF-068-01, VF-068-02, VF-076-01
 */
export declare function generateOfficialReportCard(rawCard: Omit<StudentReportCard, 'cryptographicHash' | 'verificationUrl'>): GeneratedDocument;
