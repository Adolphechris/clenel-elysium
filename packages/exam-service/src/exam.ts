import * as crypto from 'crypto';
import { ExamSession, ExamDiscipline, JuryDeliberation, JuryDecision, ExamType } from './types';

/**
 * Service de gestion des examens officiels et des jurys
 * VF-075-01 : Tout examen officiel doit avoir un président de jury désigné.
 * VF-075-02 : La délibération du jury est scellée cryptographiquement (immuable après signature).
 * VF-075-03 : Le réseau peut révéler les résultats uniquement après scellement.
 * VF-067-01 : Un élève avec ≥ 50% global est ADMIS ; une matière éliminatoire < 50% = AJOURNÉ.
 */
export class ExamService {
  private sessions: Map<string, ExamSession> = new Map();
  private deliberations: Map<string, JuryDeliberation[]> = new Map();

  /**
   * Planifie une session d'examens.
   */
  public planExamSession(params: {
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
  }): ExamSession {
    // VF-075-01
    if (!params.juryPresidentId) throw new Error('JURY_INVALIDE: Un président de jury est obligatoire (VF-075-01).');
    if (params.juryMembers.length < 2) throw new Error('JURY_INVALIDE: Le jury doit comporter au moins 2 membres en plus du président.');
    if (params.disciplines.length === 0) throw new Error('DISCIPLINES_MANQUANTES: Au moins une discipline est requise.');

    const session: ExamSession = {
      examId: `EXAM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      ...params,
      status: 'PLANIFIE',
      createdAtUTC: new Date().toISOString()
    };

    this.sessions.set(session.examId, session);
    this.deliberations.set(session.examId, []);
    return session;
  }

  /**
   * Enregistre la délibération du jury pour un élève.
   * VF-067-01 : Logique d'admission officielle RDC.
   * VF-075-02 : Scellement cryptographique SHA-256.
   */
  public deliberateStudent(params: {
    examId: string;
    studentId: string;
    gradesByDiscipline: { disciplineId: string; points: number; maxima: number; isEliminatoire: boolean }[];
    juryNotes?: string;
  }): JuryDeliberation {
    const session = this.sessions.get(params.examId);
    if (!session) throw new Error(`EXAMEN_INTROUVABLE: ${params.examId}`);
    if (session.status === 'SELLE') throw new Error('EXAM_SELLE: Cet examen est scellé, aucune modification possible (VF-075-02).');

    // Calcul selon la formule officielle RDC
    const totalPoints = params.gradesByDiscipline.reduce((acc, g) => acc + g.points, 0);
    const totalMaxima = params.gradesByDiscipline.reduce((acc, g) => acc + g.maxima, 0);
    const pourcentage = totalMaxima > 0 ? Math.round((totalPoints / totalMaxima) * 1000) / 10 : 0;

    // VF-067-01 : Règle d'admission
    const hasEliminatoryFailure = params.gradesByDiscipline.some(
      g => g.isEliminatoire && (g.points / g.maxima) < 0.5
    );
    let decision: JuryDecision;
    let mention: string;

    if (hasEliminatoryFailure) {
      decision = 'AJOURNE';
      mention = 'ECHEC_MATIERE_ELIMINATOIRE';
    } else if (pourcentage >= 80) {
      decision = 'ADMIS'; mention = 'GRANDE_DISTINCTION';
    } else if (pourcentage >= 70) {
      decision = 'ADMIS'; mention = 'DISTINCTION';
    } else if (pourcentage >= 60) {
      decision = 'ADMIS'; mention = 'SATISFACTION';
    } else if (pourcentage >= 50) {
      decision = 'ADMIS'; mention = 'SUFFISANCE';
    } else {
      decision = 'AJOURNE'; mention = 'ECHEC';
    }

    // VF-075-02 : Scellement cryptographique
    const sealPayload = JSON.stringify({ examId: params.examId, studentId: params.studentId, totalPoints, totalMaxima, pourcentage, decision });
    const sealHash = crypto.createHash('sha256').update(sealPayload).digest('hex');

    const delib: JuryDeliberation = {
      deliberationId: `DELIB-${crypto.randomUUID()}`,
      examId: params.examId,
      schoolId: session.schoolId,
      studentId: params.studentId,
      totalPoints, totalMaxima, pourcentage,
      decision, mention,
      juryNotes: params.juryNotes,
      deliberatedAtUTC: new Date().toISOString(),
      sealHash
    };

    this.deliberations.get(params.examId)!.push(delib);
    return delib;
  }

  /**
   * Scelle définitivement la session (VF-075-03 : résultats publiables après scellement).
   */
  public sealSession(examId: string, juryPresidentId: string): string {
    const session = this.sessions.get(examId);
    if (!session) throw new Error(`EXAMEN_INTROUVABLE: ${examId}`);
    if (session.juryPresidentId !== juryPresidentId) {
      throw new Error('AUTORISATION_REFUSEE: Seul le président du jury peut sceller la session.');
    }
    session.status = 'SELLE';
    const delibCount = this.deliberations.get(examId)?.length || 0;
    return `SESSION_SCELLE: ${examId} — ${delibCount} délibérations finalisées.`;
  }

  public getDeliberations(examId: string): JuryDeliberation[] {
    return this.deliberations.get(examId) || [];
  }
}
