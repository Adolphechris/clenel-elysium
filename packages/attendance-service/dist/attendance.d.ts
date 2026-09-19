import { AttendanceEntry } from '@elysium/shared-types';
import { StudentAttendanceSummary } from './types';
/**
 * Traite et calcule le bilan d'assiduité d'un élève.
 * Verrous associés : VF-065-01, VF-065-03, VF-065-05
 */
export declare function calculateStudentAttendance(studentId: string, history: AttendanceEntry[]): StudentAttendanceSummary;
