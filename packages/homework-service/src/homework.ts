import * as crypto from 'crypto';
import { Homework, StudentSubmission, HomeworkStatus, SubmissionStatus } from './types';

/**
 * Service de Gestion des Devoirs et Travaux
 * VF-069-01 : Un devoir ne peut être publié sans date de remise.
 * VF-069-02 : Aucun devoir ne peut être modifié après sa publication.
 * VF-069-03 : La correction est enregistrée de manière immuable.
 */
export class HomeworkService {
  private homeworks: Map<string, Homework> = new Map();
  private submissions: Map<string, StudentSubmission[]> = new Map();

  /**
   * Crée et publie un devoir.
   */
  public createHomework(params: {
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
  }): Homework {
    // VF-069-01
    if (!params.dueDateUTC) throw new Error('DATE_MANQUANTE: La date de remise est obligatoire.');
    if (new Date(params.dueDateUTC) <= new Date()) {
      throw new Error('DATE_INVALIDE: La date de remise doit être dans le futur.');
    }
    if (params.maxPoints <= 0) throw new Error('POINTS_INVALIDES: Le maximum doit être positif.');

    const hw: Homework = {
      homeworkId: `HW-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      ...params,
      publishedAtUTC: new Date().toISOString(),
      status: 'PUBLIE'
    };
    this.homeworks.set(hw.homeworkId, hw);
    this.submissions.set(hw.homeworkId, []);
    return hw;
  }

  /**
   * Enregistre la soumission d'un élève.
   */
  public submitHomework(homeworkId: string, studentId: string, content?: string, attachmentUrls?: string[]): StudentSubmission {
    const hw = this.homeworks.get(homeworkId);
    if (!hw) throw new Error(`DEVOIR_INTROUVABLE: ${homeworkId}`);
    if (hw.status === 'CLOS' || hw.status === 'CORRIGE') {
      throw new Error('DEVOIR_CLOS: Ce devoir n\'accepte plus de soumissions.');
    }

    const now = new Date();
    const dueDate = new Date(hw.dueDateUTC);
    const isLate = now > dueDate;

    const existing = this.submissions.get(homeworkId)!;
    const alreadySubmitted = existing.find(s => s.studentId === studentId);
    if (alreadySubmitted) throw new Error(`DEJA_SOUMIS: L'élève ${studentId} a déjà rendu ce devoir.`);

    const sub: StudentSubmission = {
      submissionId: `SUB-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      homeworkId, studentId, content, attachmentUrls,
      submittedAtUTC: now.toISOString(),
      status: isLate ? 'RETARD' : 'SOUMIS'
    };
    existing.push(sub);
    return sub;
  }

  /**
   * Corrige une soumission (action immuable — VF-069-03).
   */
  public gradeSubmission(homeworkId: string, submissionId: string, grade: number, comment: string): StudentSubmission {
    const hw = this.homeworks.get(homeworkId);
    if (!hw) throw new Error(`DEVOIR_INTROUVABLE: ${homeworkId}`);

    const subs = this.submissions.get(homeworkId)!;
    const sub = subs.find(s => s.submissionId === submissionId);
    if (!sub) throw new Error(`SOUMISSION_INTROUVABLE: ${submissionId}`);
    if (sub.status === 'CORRIGE') throw new Error('DEJA_CORRIGE: Une soumission corrigée est immuable (VF-069-03).');
    if (grade < 0 || grade > hw.maxPoints) throw new Error(`NOTE_INVALIDE: ${grade} hors limites [0, ${hw.maxPoints}].`);

    sub.grade = grade;
    sub.teacherComment = comment;
    sub.gradedAtUTC = new Date().toISOString();
    sub.status = 'CORRIGE';
    return sub;
  }

  public getSubmissions(homeworkId: string): StudentSubmission[] {
    return this.submissions.get(homeworkId) || [];
  }
}
