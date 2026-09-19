import * as crypto from 'crypto';
import { StudentReportCard } from './types';

/**
 * Calcule l'empreinte cryptographique canonique d'un bulletin (SHA-256)
 * Verrous associés : VF-068-01, VF-076-01, VF-076-04
 */
export function generateReportCardSeal(reportCard: Omit<StudentReportCard, 'cryptographicHash' | 'verificationUrl'>): {
  hash: string;
  verificationUrl: string;
} {
  // Canonicalisation JSON déterministe pour éviter les variations de clés
  const canonicalPayload = JSON.stringify({
    reportCardId: reportCard.reportCardId,
    studentId: reportCard.studentId,
    schoolId: reportCard.schoolId,
    classId: reportCard.classId,
    academicYear: reportCard.academicYear,
    period: reportCard.period,
    totalPointsObtenus: reportCard.deliberation.totalPointsObtenus,
    totalPointsMaxima: reportCard.deliberation.totalPointsMaxima,
    pourcentageOfficiel: reportCard.deliberation.pourcentageOfficiel,
    mention: reportCard.deliberation.mention,
    timestampUTC: reportCard.timestampUTC
  });

  const hash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');
  const verificationUrl = `https://elysium.cd/verify/${hash}`;

  return {
    hash,
    verificationUrl
  };
}
