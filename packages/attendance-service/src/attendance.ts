import { AttendanceEntry } from '@elysium/shared-types';
import { StudentAttendanceSummary, AttendanceRollCall } from './types';

/**
 * Traite et calcule le bilan d'assiduité d'un élève.
 * Verrous associés : VF-065-01, VF-065-03, VF-065-05
 */
export function calculateStudentAttendance(
  studentId: string,
  history: AttendanceEntry[]
): StudentAttendanceSummary {
  const studentEntries = history.filter(e => e.studentId === studentId);

  let presents = 0;
  let absents = 0;
  let retards = 0;
  let excuses = 0;

  // Tri chronologique
  const sorted = [...studentEntries].sort((a, b) => a.date.localeCompare(b.date));

  let currentConsecutiveAbsences = 0;
  let maxConsecutiveAbsences = 0;

  for (const entry of sorted) {
    switch (entry.status) {
      case 'PRESENT':
        presents++;
        currentConsecutiveAbsences = 0;
        break;
      case 'ABSENT':
        absents++;
        currentConsecutiveAbsences++;
        if (currentConsecutiveAbsences > maxConsecutiveAbsences) {
          maxConsecutiveAbsences = currentConsecutiveAbsences;
        }
        break;
      case 'RETARD':
        retards++;
        // Un retard n'est pas une absence totale mais impacte l'assiduité
        break;
      case 'EXCUSE':
        excuses++;
        currentConsecutiveAbsences = 0;
        break;
    }
  }

  const total = studentEntries.length;
  // Assiduité : (Présences + Excuses + 0.5 * Retards) / Total * 100
  const taux = total > 0 
    ? Math.round(((presents + excuses + (retards * 0.5)) / total) * 10000) / 100
    : 100.0;

  // Règle d'alerte : > 3 absences consécutives OU taux d'assiduité < 80% (Verrou VF-065-03)
  let requiresParentAlert = false;
  let alertReason: string | undefined = undefined;

  if (maxConsecutiveAbsences >= 3) {
    requiresParentAlert = true;
    alertReason = `Alerte assiduité : ${maxConsecutiveAbsences} absences consécutives non justifiées détectées.`;
  } else if (taux < 80.0 && total >= 5) {
    requiresParentAlert = true;
    alertReason = `Alerte assiduité : Taux de présence critique (${taux}%) sous le seuil légal de 80%.`;
  }

  return {
    studentId,
    totalRollCalls: total,
    presents,
    absents,
    retards,
    excuses,
    tauxAssiduite: taux,
    consecutiveAbsences: maxConsecutiveAbsences,
    requiresParentAlert,
    alertReason
  };
}
