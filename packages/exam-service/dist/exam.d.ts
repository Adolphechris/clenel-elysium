import { ExamSession, ExamDiscipline, JuryDeliberation, ExamType } from './types';
/**
 * Service de gestion des examens officiels et des jurys
 * VF-075-01 : Tout examen officiel doit avoir un président de jury désigné.
 * VF-075-02 : La délibération du jury est scellée cryptographiquement (immuable après signature).
 * VF-075-03 : Le réseau peut révéler les résultats uniquement après scellement.
 * VF-067-01 : Un élève avec ≥ 50% global est ADMIS ; une matière éliminatoire < 50% = AJOURNÉ.
 */
export declare class ExamService {
    private sessions;
    private deliberations;
    /**
     * Planifie une session d'examens.
     */
    planExamSession(params: {
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
    }): ExamSession;
    /**
     * Enregistre la délibération du jury pour un élève.
     * VF-067-01 : Logique d'admission officielle RDC.
     * VF-075-02 : Scellement cryptographique SHA-256.
     */
    deliberateStudent(params: {
        examId: string;
        studentId: string;
        gradesByDiscipline: {
            disciplineId: string;
            points: number;
            maxima: number;
            isEliminatoire: boolean;
        }[];
        juryNotes?: string;
    }): JuryDeliberation;
    /**
     * Scelle définitivement la session (VF-075-03 : résultats publiables après scellement).
     */
    sealSession(examId: string, juryPresidentId: string): string;
    getDeliberations(examId: string): JuryDeliberation[];
}
