export interface Discipline {
    disciplineId: string;
    name: string;
    code: string;
    coefficient: number;
    pointsMaxima: number;
    isEliminatoire: boolean;
    cycleLevel: 'CTEB' | 'HUMANITES' | 'LICENCE' | 'MASTER';
    filiere: string;
}
export interface ClassConfiguration {
    classId: string;
    schoolId: string;
    name: string;
    level: string;
    filiere: string;
    maxStudents: number;
    disciplines: Discipline[];
    totalMaximaAnnuel: number;
    totalMaximaSemestriel: number;
}
export interface TimeSlot {
    slotId: string;
    dayOfWeek: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';
    startTime: string;
    endTime: string;
    disciplineId: string;
    disciplineName: string;
    teacherId: string;
    classId: string;
    room?: string;
}
export interface WeeklySchedule {
    scheduleId: string;
    classId: string;
    schoolId: string;
    academicYear: string;
    slots: TimeSlot[];
    totalHoursPerWeek: number;
    isValid: boolean;
    validationErrors: string[];
}
