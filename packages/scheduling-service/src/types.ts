export interface Discipline {
  disciplineId: string;
  name: string;
  code: string;                    // ex: MATH, FR, BIOL
  coefficient: number;             // Coefficient de pondération officiel RDC
  pointsMaxima: number;            // Maximum de points pour la cote semestrielle
  isEliminatoire: boolean;         // Matière éliminatoire si < 50%
  cycleLevel: 'CTEB' | 'HUMANITES' | 'LICENCE' | 'MASTER';
  filiere: string;                 // ex: SCIENTIFIQUE, LITTERAIRE, COMMERCIAL, TECHNIQUE
}

export interface ClassConfiguration {
  classId: string;
  schoolId: string;
  name: string;                    // ex: "4ème Humanités Scientifiques A"
  level: string;                   // ex: "4EME"
  filiere: string;
  maxStudents: number;
  disciplines: Discipline[];
  totalMaximaAnnuel: number;       // Somme des maxima × coefficients
  totalMaximaSemestriel: number;
}

export interface TimeSlot {
  slotId: string;
  dayOfWeek: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
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
