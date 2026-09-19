import { StudentReportCard, generateReportCardSeal } from '@elysium/academic-engine';
import { renderReportCardHTML } from './template';

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
export function generateOfficialReportCard(rawCard: Omit<StudentReportCard, 'cryptographicHash' | 'verificationUrl'>): GeneratedDocument {
  // 1. Calcul du sceau cryptographique SHA-256
  const { hash, verificationUrl } = generateReportCardSeal(rawCard);

  // 2. Assemblage du bulletin scellé
  const sealedReportCard: StudentReportCard = {
    ...rawCard,
    cryptographicHash: hash,
    verificationUrl
  };

  // 3. Rendu HTML normé
  const htmlContent = renderReportCardHTML(sealedReportCard);

  return {
    reportCard: sealedReportCard,
    htmlContent,
    hash,
    verificationUrl
  };
}
