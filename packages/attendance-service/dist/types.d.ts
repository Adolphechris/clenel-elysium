import { AttendanceEntry } from '@elysium/shared-types';
export interface AttendanceRollCall {
    rollCallId: string;
    schoolId: string;
    classId: string;
    date: string;
    teacherId: string;
    entries: AttendanceEntry[];
    timestampUTC: string;
}
export interface StudentAttendanceSummary {
    studentId: string;
    totalRollCalls: number;
    presents: number;
    absents: number;
    retards: number;
    excuses: number;
    tauxAssiduite: number;
    consecutiveAbsences: number;
    requiresParentAlert: boolean;
    alertReason?: string;
}
