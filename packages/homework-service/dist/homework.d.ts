import { Homework, StudentSubmission } from './types';
/**
 * Service de Gestion des Devoirs et Travaux
 * VF-069-01 : Un devoir ne peut être publié sans date de remise.
 * VF-069-02 : Aucun devoir ne peut être modifié après sa publication.
 * VF-069-03 : La correction est enregistrée de manière immuable.
 */
export declare class HomeworkService {
    private homeworks;
    private submissions;
    /**
     * Crée et publie un devoir.
     */
    createHomework(params: {
        classId: string;
        schoolId: string;
        disciplineId: string;
        disciplineName: string;
        teacherId: string;
        title: string;
        instructions: string;
        maxPoints: number;
        dueDateUTC: string;
        attachmentUrls?: string[];
    }): Homework;
    /**
     * Enregistre la soumission d'un élève.
     */
    submitHomework(homeworkId: string, studentId: string, content?: string, attachmentUrls?: string[]): StudentSubmission;
    /**
     * Corrige une soumission (action immuable — VF-069-03).
     */
    gradeSubmission(homeworkId: string, submissionId: string, grade: number, comment: string): StudentSubmission;
    getSubmissions(homeworkId: string): StudentSubmission[];
}
