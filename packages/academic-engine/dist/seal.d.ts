import { StudentReportCard } from './types';
/**
 * Calcule l'empreinte cryptographique canonique d'un bulletin (SHA-256)
 * Verrous associés : VF-068-01, VF-076-01, VF-076-04
 */
export declare function generateReportCardSeal(reportCard: Omit<StudentReportCard, 'cryptographicHash' | 'verificationUrl'>): {
    hash: string;
    verificationUrl: string;
};
