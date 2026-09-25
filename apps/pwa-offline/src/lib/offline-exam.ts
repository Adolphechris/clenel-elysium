/**
 * Mode d'Évaluation Hors-Ligne — ELLYSIUM PWA (Tome 7 / Module 112)
 *
 * Permet à un élève de passer au maximum 5 évaluations sans connexion réseau.
 * Les résultats sont calculés localement avec la FORMULE OFFICIELLE RDC
 * (source de vérité : @elysium/academic-engine) puis SCELLÉS par empreinte
 * SHA-256 afin d'être transmis au retour du réseau sans possibilité d'altération.
 *
 * Verrous : VF-112-01 (droit d'évaluer hors-ligne), VF-112-06 (plafond de 5
 * évaluations hors-ligne), VF-112-07 (scellement des résultats), VF-066-03
 * (intégrité de la formule de délibération).
 */

import * as crypto from 'crypto';
import {
  calculateDeliberationRDC,
  type DeliberationResult,
  type GradeItem
} from '@elysium/academic-engine';
import {
  EncryptedSyncManager,
  type SyncEnvelope,
  type VersionedRecord
} from './encrypted-sync';
import { IndexedDBStore, ELLYSIUM_STORES } from './indexed-db-store';

/** Plafond officiel d'évaluations passables hors-ligne par élève. */
export const MAX_OFFLINE_EVALUATIONS = 5;

/** Durée maximale d'une session d'évaluation hors-ligne. */
export const DEFAULT_SESSION_DURATION_MINUTES = 90;

export interface ExamQuestion {
  questionId: string;
  label: string;
  disciplineId: string;
  disciplineName: string;
  pointsMaxima: number;
  coefficient?: number;
  isEliminatoire?: boolean;
}

export interface OfflineEvaluation {
  evaluationId: string;
  title: string;
  disciplineId: string;
  disciplineName: string;
  period: 'PREMIER_SEMESTRE' | 'SECOND_SEMESTRE' | 'ANNUEL';
  questions: ExamQuestion[];
  opensAtUTC: string;
  closesAtUTC: string;
}

export interface ExamAnswer {
  questionId: string;
  pointsObtenus: number;
  answeredAtUTC: string;
}

export interface ExamSession {
  sessionId: string;
  evaluationId: string;
  studentId: string;
  startedAtUTC: string;
  expiresAtUTC: string;
  status: 'IN_PROGRESS' | 'SEALED' | 'EXPIRED';
  answers: ExamAnswer[];
}

export interface SealedExamResult {
  sealId: string;
  sessionId: string;
  evaluationId: string;
  studentId: string;
  disciplineId: string;
  disciplineName: string;
  answers: ExamAnswer[];
  grades: GradeItem[];
  deliberation: DeliberationResult;
  cryptographicHash: string;
  sealedAtUTC: string;
  syncStatus: 'PENDING_SYNC' | 'SYNCED';
  syncedAtUTC?: string;
}

export interface OfflineExamQuota {
  maxEvaluations: number;
  used: number;
  remaining: number;
  exhausted: boolean;
}

export interface SealedSyncExport {
  studentId: string;
  recordCount: number;
  envelopes: SyncEnvelope[];
  digest: string;
}

function canonicalize(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/**
 * Gestionnaire d'évaluations hors-ligne.
 * Aucune donnée n'est transmise ici : la validation est purement locale et
 * la formule appliquée est strictement identique à celle du serveur.
 */
export class OfflineExamManager {
  private readonly evaluations = new Map<string, OfflineEvaluation>();
  private readonly sessions = new Map<string, ExamSession>();
  private readonly seals = new Map<string, SealedExamResult>();
  private readonly storage?: IndexedDBStore;
  private readonly syncManager?: EncryptedSyncManager;
  private readonly now: () => number;

  constructor(options: { storage?: IndexedDBStore; syncManager?: EncryptedSyncManager; now?: () => number } = {}) {
    this.storage = options.storage;
    this.syncManager = options.syncManager;
    this.now = options.now ?? (() => Date.now());
  }

  /** Enregistre un sujet d'évaluation téléchargeable hors-ligne. */
  public registerEvaluation(evaluation: OfflineEvaluation): OfflineEvaluation {
    if (!evaluation || !evaluation.evaluationId) {
      throw new Error('SUJET_INVALIDE: evaluationId est obligatoire.');
    }
    if (!evaluation.questions || evaluation.questions.length === 0) {
      throw new Error(`SUJET_INVALIDE: Le sujet « ${evaluation.evaluationId} » ne contient aucune question.`);
    }
    for (const q of evaluation.questions) {
      if (!q.pointsMaxima || q.pointsMaxima <= 0) {
        throw new Error(
          `MAXIMA_NUL: Le maximum de la question ${q.questionId} doit être strictement positif.`
        );
      }
    }
    if (this.evaluations.has(evaluation.evaluationId)) {
      throw new Error(`SUJET_EXISTANT: Le sujet « ${evaluation.evaluationId} » est déjà enregistré.`);
    }
    this.evaluations.set(evaluation.evaluationId, evaluation);
    return evaluation;
  }

  /** Liste des sujets enregistrés. */
  public listEvaluations(): OfflineEvaluation[] {
    return [...this.evaluations.values()];
  }

  /** Récupère un sujet par son identifiant. */
  public getEvaluation(evaluationId: string): OfflineEvaluation | undefined {
    return this.evaluations.get(evaluationId);
  }

  /**
   * Consommation du quota hors-ligne d'un élève.
   * VF-112-06 : 5 évaluations maximum par élève et par période.
   */
  public getQuota(studentId: string): OfflineExamQuota {
    const used = this.sessionsForStudent(studentId).length;
    return {
      maxEvaluations: MAX_OFFLINE_EVALUATIONS,
      used,
      remaining: Math.max(0, MAX_OFFLINE_EVALUATIONS - used),
      exhausted: used >= MAX_OFFLINE_EVALUATIONS
    };
  }

  /**
   * Démarre une session d'évaluation hors-ligne.
   * Refuse une 6ᵉ évaluation, une double session sur le même sujet, ou un sujet fermé.
   */
  public startExam(params: {
    evaluationId: string;
    studentId: string;
    sessionDurationMinutes?: number;
  }): ExamSession {
    const evaluation = this.evaluations.get(params.evaluationId);
    if (!evaluation) {
      throw new Error(`SUJET_INTROUVABLE: Aucun sujet hors-ligne pour « ${params.evaluationId} ».`);
    }
    if (!params.studentId) {
      throw new Error('ELEVE_INCONNU: studentId est obligatoire.');
    }

    const alreadyRunning = this.sessionsForStudent(params.studentId).find(
      s => s.evaluationId === params.evaluationId && s.status === 'IN_PROGRESS'
    );
    if (alreadyRunning) {
      throw new Error(
        `SESSION_DEJA_OUVERTE: L'élève a déjà une session en cours sur le sujet « ${params.evaluationId} ».`
      );
    }

    const quota = this.getQuota(params.studentId);
    if (quota.exhausted) {
      throw new Error(
        `QUOTA_HORS_LIGNE_DEPASSE: Maximum de ${MAX_OFFLINE_EVALUATIONS} évaluations hors-ligne atteint. Reconnectez-vous au réseau.`
      );
    }

    const nowMs = this.now();
    const nowIso = new Date(nowMs).toISOString();
    if (nowIso < evaluation.opensAtUTC) {
      throw new Error(`HORS_FENETRE: Le sujet « ${evaluation.evaluationId} » n'est pas encore ouvert.`);
    }
    if (nowIso > evaluation.closesAtUTC) {
      throw new Error(`HORS_FENETRE: Le sujet « ${evaluation.evaluationId} » est fermé.`);
    }

    const duration = params.sessionDurationMinutes ?? DEFAULT_SESSION_DURATION_MINUTES;
    const session: ExamSession = {
      sessionId: `SES-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
      evaluationId: evaluation.evaluationId,
      studentId: params.studentId,
      startedAtUTC: nowIso,
      expiresAtUTC: new Date(nowMs + duration * 60_000).toISOString(),
      status: 'IN_PROGRESS',
      answers: []
    };

    this.sessions.set(session.sessionId, session);
    return session;
  }

  /** Récupère une session par identifiant. */
  public getSession(sessionId: string): ExamSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Enregistre une réponse. Validation stricte : question existante, note dans
   * les limites, session ouverte et non expirée.
   */
  public recordAnswer(sessionId: string, questionId: string, pointsObtenus: number): ExamAnswer {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`SESSION_INTROUVABLE: Aucune session « ${sessionId} ».`);
    }
    if (session.status !== 'IN_PROGRESS') {
      throw new Error(`SESSION_FERMEE: La session ${sessionId} n'accepte plus de réponses (${session.status}).`);
    }
    if (this.now() > new Date(session.expiresAtUTC).getTime()) {
      session.status = 'EXPIRED';
      throw new Error(`SESSION_EXPIREE: Le temps imparti est écoulé pour la session ${sessionId}.`);
    }

    const evaluation = this.evaluations.get(session.evaluationId);
    const question = evaluation?.questions.find(q => q.questionId === questionId);
    if (!question) {
      throw new Error(`QUESTION_INTROUVABLE: La question « ${questionId} » n'existe pas dans ce sujet.`);
    }
    if (typeof pointsObtenus !== 'number' || Number.isNaN(pointsObtenus)) {
      throw new Error('NOTE_INVALIDE: La note doit être un nombre.');
    }
    if (pointsObtenus < 0) {
      throw new Error(`NOTE_INVALIDE: Note négative interdite (${pointsObtenus}).`);
    }
    if (pointsObtenus > question.pointsMaxima) {
      throw new Error(
        `DEPASSEMENT_MAXIMA: La note (${pointsObtenus}) dépasse le maximum (${question.pointsMaxima}) de la question ${questionId}.`
      );
    }

    const answer: ExamAnswer = {
      questionId,
      pointsObtenus,
      answeredAtUTC: new Date(this.now()).toISOString()
    };
    const existing = session.answers.findIndex(a => a.questionId === questionId);
    if (existing >= 0) session.answers[existing] = answer;
    else session.answers.push(answer);

    return answer;
  }

  /**
   * Clôture de l'évaluation : application de la formule RDC puis scellement.
   * Le résultat est immuable (scellé) et mis en attente de synchronisation.
   */
  public submitExam(sessionId: string): SealedExamResult {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`SESSION_INTROUVABLE: Aucune session « ${sessionId} ».`);
    }
    if (session.status === 'SEALED') {
      const existing = [...this.seals.values()].find(s => s.sessionId === sessionId);
      if (existing) return existing;
      throw new Error(`DEJA_SCELLE: La session ${sessionId} a déjà été scellée.`);
    }
    if (session.status === 'EXPIRED') {
      throw new Error(`SESSION_EXPIREE: La session ${sessionId} a expiré sans être scellée.`);
    }
    if (session.answers.length === 0) {
      throw new Error('ERREUR_ACADEMIQUE: Impossible de délibérer sur une liste vide d\'évaluations.');
    }

    const evaluation = this.evaluations.get(session.evaluationId);
    if (!evaluation) {
      throw new Error(`SUJET_INTROUVABLE: Sujet « ${session.evaluationId} » introuvable au moment du scellement.`);
    }

    const grades: GradeItem[] = session.answers.map(answer => {
      const question = evaluation.questions.find(q => q.questionId === answer.questionId)!;
      return {
        disciplineId: question.disciplineId,
        disciplineName: question.disciplineName,
        pointsObtenus: answer.pointsObtenus,
        pointsMaxima: question.pointsMaxima,
        coefficient: question.coefficient,
        isEliminatoire: question.isEliminatoire
      };
    });

    // Formule officielle RDC — aucune implémentation locale divergente.
    const deliberation = calculateDeliberationRDC(grades);

    const sealedAtUTC = new Date(this.now()).toISOString();
    const cryptographicHash = this.computeSealHash({
      sessionId,
      evaluationId: evaluation.evaluationId,
      studentId: session.studentId,
      answers: session.answers,
      grades,
      deliberation,
      sealedAtUTC
    });

    const sealed: SealedExamResult = {
      sealId: `SEAL-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
      sessionId,
      evaluationId: evaluation.evaluationId,
      studentId: session.studentId,
      disciplineId: evaluation.disciplineId,
      disciplineName: evaluation.disciplineName,
      answers: [...session.answers],
      grades,
      deliberation,
      cryptographicHash,
      sealedAtUTC,
      syncStatus: 'PENDING_SYNC'
    };

    session.status = 'SEALED';
    this.seals.set(sealed.sealId, sealed);

    if (this.storage) {
      void this.storage.put(ELLYSIUM_STORES.EXAM_SEALS, sealed as unknown as Record<string, unknown>, sealed.sealId);
    }

    return sealed;
  }

  /**
   * Empreinte canonique SHA-256 du résultat.
   * Toute modification ultérieure (note, mention, décompte) invalide le sceau.
   */
  public computeSealHash(input: {
    sessionId: string;
    evaluationId: string;
    studentId: string;
    answers: ExamAnswer[];
    grades: GradeItem[];
    deliberation: DeliberationResult;
    sealedAtUTC: string;
  }): string {
    return crypto
      .createHash('sha256')
      .update(
        canonicalize({
          evaluationId: input.evaluationId,
          studentId: input.studentId,
          sessionId: input.sessionId,
          answers: [...input.answers].sort((a, b) => (a.questionId < b.questionId ? -1 : 1)),
          grades: input.grades,
          pourcentageOfficiel: input.deliberation.pourcentageOfficiel,
          mention: input.deliberation.mention,
          isAdmis: input.deliberation.isAdmis,
          formuleAppliquee: input.deliberation.formuleAppliquee,
          sealedAtUTC: input.sealedAtUTC
        })
      )
      .digest('hex');
  }

  /** Vérifie l'intégrité d'un sceau par recalcul de l'empreinte. */
  public verifySeal(sealId: string): boolean {
    const sealed = this.seals.get(sealId);
    if (!sealed) return false;
    const expected = this.computeSealHash({
      sessionId: sealed.sessionId,
      evaluationId: sealed.evaluationId,
      studentId: sealed.studentId,
      answers: sealed.answers,
      grades: sealed.grades,
      deliberation: sealed.deliberation,
      sealedAtUTC: sealed.sealedAtUTC
    });
    return expected === sealed.cryptographicHash;
  }

  /** Sceaux en attente d'envoi au serveur. */
  public getPendingSeals(): SealedExamResult[] {
    return [...this.seals.values()].filter(s => s.syncStatus === 'PENDING_SYNC');
  }

  /** Marque un sceau comme synchronisé après accusé de réception du serveur. */
  public markSealedAsSynced(sealId: string, syncedAtUTC = new Date(this.now()).toISOString()): boolean {
    const sealed = this.seals.get(sealId);
    if (!sealed) return false;
    sealed.syncStatus = 'SYNCED';
    sealed.syncedAtUTC = syncedAtUTC;
    if (this.storage) {
      void this.storage.put(ELLYSIUM_STORES.EXAM_SEALS, sealed as unknown as Record<string, unknown>, sealed.sealId);
    }
    return true;
  }

  /** Historique des résultats scellés d'un élève. */
  public getStudentResults(studentId: string): SealedExamResult[] {
    return [...this.seals.values()].filter(s => s.studentId === studentId);
  }

  /**
   * Export chiffré des sceaux en attente, prêt pour la synchronisation différentielle.
   * Sans gestionnaire de synchronisation, une enveloppe par sceau est produite
   * par une clé de session dédiée à l'appareil.
   */
  public exportPendingSealsForSync(): SealedSyncExport {
    const pending = this.getPendingSeals();
    const manager = this.syncManager ?? new EncryptedSyncManager({ deviceId: 'offline-exam-device' });
    const envelopes = pending.map(seal =>
      manager.encrypt(seal, `elysium-pwa-sync-v1:examSeal:${seal.sealId}`)
    );
    return {
      studentId: pending[0]?.studentId ?? '',
      recordCount: envelopes.length,
      envelopes,
      digest: crypto
        .createHash('sha256')
        .update(pending.map(s => `${s.sealId}@${s.cryptographicHash}`).sort().join('|'))
        .digest('hex')
    };
  }

  /** Convertit les sceaux en enregistrements versionnés pour la synchronisation différentielle. */
  public toVersionedRecords(seals: SealedExamResult[], deviceId: string): VersionedRecord[] {
    return seals.map(seal => ({
      recordId: seal.sealId,
      collection: 'examSeals',
      deviceId,
      updatedAtUTC: seal.sealedAtUTC,
      deleted: false,
      payload: seal as unknown as Record<string, unknown>
    }));
  }

  private sessionsForStudent(studentId: string): ExamSession[] {
    return [...this.sessions.values()].filter(s => s.studentId === studentId);
  }
}
