export type ExamType = 'INTERRO_ORDINAIRE' | 'DEVOIR_SURVEILLE' | 'EXAMEN_SEMESTRIEL' | 'EXAMEN_ETAT' | 'RATTRAPAGE';
export type JuryDecision = 'ADMIS' | 'AJOURNE' | 'EXCLU' | 'DISPENSE' | 'RENVOI_JURY';
export interface ExamSession {
    examId: string;
    schoolId: string;
    classId: string;
    type: ExamType;
    academicYear: string;
    semester: 1 | 2;
    disciplines: ExamDiscipline[];
    startDate: string;
    endDate: string;
    juryPresidentId: string;
    juryMembers: string[];
    status: 'PLANIFIE' | 'EN_COURS' | 'CLOS' | 'DELIBERE' | 'SELLE';
    createdAtUTC: string;
}
export interface ExamDiscipline {
    disciplineId: string;
    disciplineName: string;
    coefficient: number;
    pointsMaxima: number;
    examDate: string;
    examStartTime: string;
    room: string;
    surveillants: string[];
}
export interface JuryDeliberation {
    deliberationId: string;
    examId: string;
    schoolId: string;
    studentId: string;
    totalPoints: number;
    totalMaxima: number;
    pourcentage: number;
    decision: JuryDecision;
    mention: string;
    juryNotes?: string;
    deliberatedAtUTC: string;
    sealHash: string;
}
