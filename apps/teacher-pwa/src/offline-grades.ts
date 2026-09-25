/**
 * Saisie de Cotes Hors-Ligne — Espace Enseignant ELLYSIUM (Tome 7 / Module 112)
 *
 * Validation stricte des notes selon les normes RDC, persistance locale
 * (IndexedDB) et file de synchronisation différentielle.
 *
 * Verrous : VF-112-01 (saisie sans réseau), VF-112-03 (synchronisation intégrale),
 * VF-066-03 (intégrité de la formule), VF-067-02 (notes dans les limites).
 */

import {
  calculateDeliberationRDC,
  type DeliberationResult,
  type GradeItem,
  type MentionRDC
} from '@elysium/academic-engine';
import {
  IndexedDBStore,
  ELLYSIUM_STORES,
  type StoreKey
} from '@elysium/pwa-offline';

export type GradeSyncStatus = 'PENDING_SYNC' | 'SYNCED' | 'CONFLICT';

export interface GradeInput {
  studentId: string;
  studentName?: string;
  classId: string;
  disciplineId: string;
  disciplineName: string;
  evaluationId: string;
  pointsObtenus: number;
  pointsMaxima: number;
  coefficient?: number;
  isEliminatoire?: boolean;
}

export interface GradeEntry extends GradeInput {
  localId: string;
  rate: number;
  status: GradeSyncStatus;
  createdAtLocal: string;
  syncedAtUTC?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rate: number | null;
  projectedMention: MentionRDC | null;
}

export interface DisciplineProgress {
  disciplineId: string;
  disciplineName: string;
  pointsObtenus: number;
  pointsMaxima: number;
  rate: number;
  evaluationCount: number;
}

export interface StudentProgress {
  studentId: string;
  studentName: string | null;
  classId: string;
  evaluationCount: number;
  byDiscipline: DisciplineProgress[];
  deliberation: DeliberationResult | null;
  lastUpdatedUTC: string;
}

export interface GradeBatchReport {
  classId: string;
  disciplineId: string;
  evaluationId: string;
  accepted: GradeEntry[];
  rejected: { studentId: string; reason: string }[];
  averageRate: number;
  highestRate: number;
  lowestRate: number;
  queuedForSync: number;
}

export interface GradeQueueStats {
  pending: number;
  synced: number;
  total: number;
  oldestPendingAtLocal: string | null;
}

const LOCAL_COUNTER_KEY = '__ELYSIUM_GRADE_COUNTER__';

function nextLocalId(): string {
  const host = globalThis as unknown as Record<string, number>;
  host[LOCAL_COUNTER_KEY] = (host[LOCAL_COUNTER_KEY] ?? 0) + 1;
  return `GRD-${host[LOCAL_COUNTER_KEY].toString(36).toUpperCase().padStart(4, '0')}`;
}

/**
 * Carnet de cotes hors-ligne de l'enseignant.
 * Toute note saisie est validée localement puis mise en file d'attente.
 */
export class OfflineGradeBook {
  private readonly teacherId: string;
  private readonly schoolId: string;
  private readonly now: () => number;
  private readonly entries = new Map<StoreKey, GradeEntry>();
  private storage?: IndexedDBStore;
  private online = true;

  constructor(options: { teacherId: string; schoolId: string; storage?: IndexedDBStore; now?: () => number }) {
    if (!options || !options.teacherId || !options.schoolId) {
      throw new Error('ENSEIGNANT_INCONNU: teacherId et schoolId sont obligatoires.');
    }
    this.teacherId = options.teacherId;
    this.schoolId = options.schoolId;
    this.storage = options.storage;
    this.now = options.now ?? (() => Date.now());
  }

  /** Ouvre la persistance locale (optionnelle). */
  public async open(dbName = 'elysium-teacher-offline'): Promise<IndexedDBStore> {
    this.storage = await IndexedDBStore.open(dbName, 1, [
      { name: ELLYSIUM_STORES.GRADES, keyPath: 'localId' },
      { name: ELLYSIUM_STORES.SYNC_QUEUE, autoIncrement: true }
    ]);
    const stored = await this.storage.getAll<GradeEntry>(ELLYSIUM_STORES.GRADES);
    for (const entry of stored) {
      this.entries.set(entry.localId, entry);
    }
    return this.storage;
  }

  /** Bascule l'état réseau (mode terrain). */
  public setOnlineStatus(online: boolean): void {
    this.online = online;
  }

  /** État réseau courant. */
  public isOnline(): boolean {
    return this.online;
  }

  /**
   * Validation d'une note selon la formule RDC.
   * Un taux < 50% produit un avertissement (matière en échec), pas un blocage :
   * l'enseignant doit pouvoir saisir l'ensemble des notes de sa classe.
   */
  public validateGrade(input: GradeInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!input || typeof input !== 'object') {
      return { valid: false, errors: ['SAISIE_INVALIDE: Aucune note fournie.'], warnings: [], rate: null, projectedMention: null };
    }
    if (!input.studentId) errors.push('ELEVE_INCONNU: studentId est obligatoire.');
    if (!input.classId) errors.push('CLASSE_INCONNUE: classId est obligatoire.');
    if (!input.disciplineId) errors.push('DISCIPLINE_INCONNUE: disciplineId est obligatoire.');
    if (!input.evaluationId) errors.push('EVALUATION_INCONNUE: evaluationId est obligatoire.');

    if (typeof input.pointsObtenus !== 'number' || Number.isNaN(input.pointsObtenus)) {
      errors.push('NOTE_INVALIDE: La note doit être un nombre.');
    }
    if (typeof input.pointsMaxima !== 'number' || Number.isNaN(input.pointsMaxima)) {
      errors.push('MAXIMA_INVALIDE: Le maximum doit être un nombre.');
    }
    if (input.pointsMaxima !== undefined && input.pointsMaxima <= 0) {
      errors.push(`MAXIMA_NUL: Le maximum doit être strictement positif pour ${input.disciplineName}.`);
    }
    if (input.pointsObtenus !== undefined && input.pointsObtenus < 0) {
      errors.push(`NOTE_INVALIDE: Note négative interdite (${input.pointsObtenus}).`);
    }
    if (
      input.pointsObtenus !== undefined &&
      input.pointsMaxima !== undefined &&
      input.pointsObtenus > input.pointsMaxima
    ) {
      errors.push(
        `DEPASSEMENT_MAXIMA: La note (${input.pointsObtenus}) dépasse le maximum (${input.pointsMaxima}) pour ${input.disciplineName}.`
      );
    }

    if (errors.length > 0) {
      return { valid: false, errors, warnings, rate: null, projectedMention: null };
    }

    const item: GradeItem = {
      disciplineId: input.disciplineId,
      disciplineName: input.disciplineName,
      pointsObtenus: input.pointsObtenus,
      pointsMaxima: input.pointsMaxima,
      coefficient: input.coefficient,
      isEliminatoire: input.isEliminatoire
    };

    // La mention projetée est calculée par le moteur officiel, jamais recalculée localement.
    const deliberation = calculateDeliberationRDC([item]);
    const rate = Math.round(((input.pointsObtenus / input.pointsMaxima) * 100) * 100) / 100;

    if (deliberation.mention === 'AJOURNE') {
      warnings.push(
        `MATIERE_EN_ECHEC: ${input.disciplineName} à ${rate}% — inférieur au seuil de 50%.`
      );
    }

    return { valid: true, errors, warnings, rate, projectedMention: deliberation.mention };
  }

  /** Saisit une note. Lève une erreur si la saisie est invalide. */
  public enterGrade(input: GradeInput): GradeEntry {
    const validation = this.validateGrade(input);
    if (!validation.valid) {
      throw new Error(validation.errors.join(' | '));
    }

    const entry: GradeEntry = {
      ...input,
      localId: nextLocalId(),
      rate: validation.rate ?? 0,
      status: this.online ? 'SYNCED' : 'PENDING_SYNC',
      createdAtLocal: new Date(this.now()).toISOString()
    };

    this.entries.set(entry.localId, entry);
    if (this.storage) {
      void this.storage.put(
        ELLYSIUM_STORES.GRADES,
        entry as unknown as Record<string, unknown>,
        entry.localId
      );
    }
    return entry;
  }

  /**
   * Saisie en lot d'une classe : les notes invalides sont isolées et retournées
   * dans `rejected` sans interrompre la saisie des autres élèves.
   */
  public enterGradeBatch(params: {
    classId: string;
    disciplineId: string;
    disciplineName: string;
    evaluationId: string;
    pointsMaxima: number;
    coefficient?: number;
    isEliminatoire?: boolean;
    grades: { studentId: string; studentName?: string; pointsObtenus: number }[];
  }): GradeBatchReport {
    const accepted: GradeEntry[] = [];
    const rejected: { studentId: string; reason: string }[] = [];

    for (const grade of params.grades) {
      try {
        accepted.push(
          this.enterGrade({
            studentId: grade.studentId,
            studentName: grade.studentName,
            classId: params.classId,
            disciplineId: params.disciplineId,
            disciplineName: params.disciplineName,
            evaluationId: params.evaluationId,
            pointsObtenus: grade.pointsObtenus,
            pointsMaxima: params.pointsMaxima,
            coefficient: params.coefficient,
            isEliminatoire: params.isEliminatoire
          })
        );
      } catch (error) {
        rejected.push({
          studentId: grade.studentId,
          reason: error instanceof Error ? error.message : 'ERREUR_SAISIE_INCONNUE'
        });
      }
    }

    const rates = accepted.map(e => e.rate);
    return {
      classId: params.classId,
      disciplineId: params.disciplineId,
      evaluationId: params.evaluationId,
      accepted,
      rejected,
      averageRate: rates.length ? Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100) / 100 : 0,
      highestRate: rates.length ? Math.max(...rates) : 0,
      lowestRate: rates.length ? Math.min(...rates) : 0,
      queuedForSync: accepted.filter(e => e.status === 'PENDING_SYNC').length
    };
  }

  /** Toutes les notes d'un élève. */
  public getStudentGrades(studentId: string): GradeEntry[] {
    return [...this.entries.values()].filter(e => e.studentId === studentId);
  }

  /** Toutes les notes d'une classe pour une évaluation donnée. */
  public getClassGrades(classId: string, evaluationId?: string): GradeEntry[] {
    return [...this.entries.values()].filter(
      e => e.classId === classId && (evaluationId === undefined || e.evaluationId === evaluationId)
    );
  }

  /** Notes en attente de synchronisation. */
  public getPendingEntries(): GradeEntry[] {
    return [...this.entries.values()].filter(e => e.status === 'PENDING_SYNC');
  }

  /**
   * Progression d'un élève : agrégation par discipline puis délibération
   * officielle via le moteur central.
   */
  public viewStudentProgress(studentId: string, classId?: string): StudentProgress {
    const all = this.getStudentGrades(studentId).filter(
      e => classId === undefined || e.classId === classId
    );

    const byDisciplineMap = new Map<string, DisciplineProgress>();
    for (const entry of all) {
      const current = byDisciplineMap.get(entry.disciplineId);
      if (current) {
        current.pointsObtenus += entry.pointsObtenus;
        current.pointsMaxima += entry.pointsMaxima;
        current.evaluationCount += 1;
        current.rate = Math.round((current.pointsObtenus / current.pointsMaxima) * 10000) / 100;
      } else {
        byDisciplineMap.set(entry.disciplineId, {
          disciplineId: entry.disciplineId,
          disciplineName: entry.disciplineName,
          pointsObtenus: entry.pointsObtenus,
          pointsMaxima: entry.pointsMaxima,
          rate: entry.rate,
          evaluationCount: 1
        });
      }
    }

    const grades: GradeItem[] = [...byDisciplineMap.values()].map(d => ({
      disciplineId: d.disciplineId,
      disciplineName: d.disciplineName,
      pointsObtenus: d.pointsObtenus,
      pointsMaxima: d.pointsMaxima
    }));

    return {
      studentId,
      studentName: all[0]?.studentName ?? null,
      classId: classId ?? all[0]?.classId ?? '',
      evaluationCount: all.length,
      byDiscipline: [...byDisciplineMap.values()].sort((a, b) => (a.disciplineId < b.disciplineId ? -1 : 1)),
      deliberation: grades.length ? calculateDeliberationRDC(grades) : null,
      lastUpdatedUTC: new Date(this.now()).toISOString()
    };
  }

  /** Marque une note comme synchronisée (accusé de réception serveur). */
  public markAsSynced(localId: string, syncedAtUTC = new Date(this.now()).toISOString()): boolean {
    const entry = this.entries.get(localId);
    if (!entry) return false;
    entry.status = 'SYNCED';
    entry.syncedAtUTC = syncedAtUTC;
    if (this.storage) {
      void this.storage.put(
        ELLYSIUM_STORES.GRADES,
        entry as unknown as Record<string, unknown>,
        entry.localId
      );
    }
    return true;
  }

  /** Marque une note en conflit (écart avec le serveur, résolu par CRDT). */
  public markAsConflict(localId: string): boolean {
    const entry = this.entries.get(localId);
    if (!entry) return false;
    entry.status = 'CONFLICT';
    return true;
  }

  /** Statistiques de la file de synchronisation. */
  public getQueueStats(): GradeQueueStats {
    const all = [...this.entries.values()];
    const pending = all.filter(e => e.status === 'PENDING_SYNC');
    const oldest = pending.map(e => e.createdAtLocal).sort()[0] ?? null;
    return {
      pending: pending.length,
      synced: all.filter(e => e.status === 'SYNCED').length,
      total: all.length,
      oldestPendingAtLocal: oldest
    };
  }

  /** Identifiant de l'enseignant propriétaire du carnet. */
  public get owner(): { teacherId: string; schoolId: string } {
    return { teacherId: this.teacherId, schoolId: this.schoolId };
  }
}
