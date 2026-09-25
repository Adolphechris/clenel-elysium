/**
 * Espace Enseignant ELLYSIUM — Application PWA hors-ligne (Tome 7 / Module 112)
 *
 * Orchestration des fonctions enseignantes : classes, appels, saisie de cotes,
 * suivi de progression et synchronisation différentielle.
 *
 * Verrous : VF-112-01 (fonctionnement intégral sans réseau), VF-112-02 (appel
 * hors-ligne), VF-112-03 (synchronisation intégrale), VF-066-03 (formule RDC).
 */

import { IndexedDBStore } from '@elysium/pwa-offline';
import {
  OfflineGradeBook,
  type GradeBatchReport,
  type GradeEntry,
  type StudentProgress
} from './offline-grades';
import { ServiceWorkerManager } from './service-worker';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';

export interface TeacherProfile {
  teacherId: string;
  teacherName: string;
  schoolId: string;
  schoolName: string;
  disciplines: string[];
}

export interface SchoolClass {
  classId: string;
  className: string;
  level: string;
  studentCount: number;
  disciplineIds: string[];
  schoolId: string;
}

export interface Student {
  studentId: string;
  studentName: string;
  classId: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
}

export interface AttendanceEntryRecord extends AttendanceRecord {
  localId: string;
  classId: string;
  date: string;
  teacherId: string;
  schoolId: string;
  createdAtLocal: string;
  status_sync: 'PENDING_SYNC' | 'SYNCED';
}

export interface AttendanceReport {
  classId: string;
  date: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  queuedForSync: number;
  entries: AttendanceEntryRecord[];
}

export interface SyncReport {
  status: 'SUCCESS' | 'DEFERRED';
  syncedGrades: number;
  syncedAttendance: number;
  remainingPending: number;
  syncedAtUTC: string | null;
  reason?: string;
}

export interface TeacherPWAState {
  initialized: boolean;
  online: boolean;
  offlineSince: string | null;
  serviceWorkerRegistered: boolean;
  profile: TeacherProfile | null;
  queue: { pending: number; synced: number; total: number };
}

export interface TeacherPWACatalogue {
  classes?: SchoolClass[];
  students?: Student[];
}

const ATTENDANCE_COUNTER_KEY = '__ELYSIUM_ATTENDANCE_COUNTER__';

function nextAttendanceId(): string {
  const host = globalThis as unknown as Record<string, number>;
  host[ATTENDANCE_COUNTER_KEY] = (host[ATTENDANCE_COUNTER_KEY] ?? 0) + 1;
  return `ROL-${host[ATTENDANCE_COUNTER_KEY].toString(36).toUpperCase().padStart(4, '0')}`;
}

const DEFAULT_CLASSES: SchoolClass[] = [
  {
    classId: 'CL-4HUM-A',
    className: '4ème Humanités Scientifiques A',
    level: 'SECONDAIRE',
    studentCount: 45,
    disciplineIds: ['MATH', 'FR', 'BIO', 'PHY', 'HIST'],
    schoolId: 'SCH-KIN-01'
  },
  {
    classId: 'CL-3HUM-B',
    className: '3ème Humanités Littéraires B',
    level: 'SECONDAIRE',
    studentCount: 38,
    disciplineIds: ['FR', 'HIST', 'ANG', 'PHILO'],
    schoolId: 'SCH-KIN-01'
  }
];

const DEFAULT_STUDENTS: Student[] = [
  { studentId: 'ST-001', studentName: 'KASONGO David', classId: 'CL-4HUM-A' },
  { studentId: 'ST-002', studentName: 'LUMEMBE Sara', classId: 'CL-4HUM-A' },
  { studentId: 'ST-003', studentName: 'MBUYI Emmanuel', classId: 'CL-4HUM-A' },
  { studentId: 'ST-004', studentName: 'TSHIMANGA Grace', classId: 'CL-4HUM-A' },
  { studentId: 'ST-005', studentName: 'KABILA Michel', classId: 'CL-4HUM-A' },
  { studentId: 'ST-006', studentName: 'NGALULA Christine', classId: 'CL-3HUM-B' },
  { studentId: 'ST-007', studentName: 'BANZA Pierre', classId: 'CL-3HUM-B' },
  { studentId: 'ST-008', studentName: 'KALOMBO Josée', classId: 'CL-3HUM-B' }
];

/**
 * Point d'entrée applicatif de l'espace enseignant.
 */
export class TeacherPWA {
  private profile: TeacherProfile | null = null;
  private gradeBook: OfflineGradeBook | null = null;
  private readonly serviceWorker = new ServiceWorkerManager('/sw.js');
  private readonly classes: SchoolClass[];
  private readonly students: Student[];
  private readonly attendance = new Map<string, AttendanceEntryRecord>();
  private online = true;
  private offlineSince: string | null = null;
  private initialized = false;
  private readonly now: () => number;

  constructor(options: { catalogue?: TeacherPWACatalogue; now?: () => number } = {}) {
    this.classes = options.catalogue?.classes ?? DEFAULT_CLASSES;
    this.students = options.catalogue?.students ?? DEFAULT_STUDENTS;
    this.now = options.now ?? (() => Date.now());
  }

  /**
   * Initialise l'application : profil enseignant, carnet de cotes hors-ligne,
   * persistance locale et enregistrement du Service Worker.
   */
  public async initialize(profile: TeacherProfile, options: { openStorage?: boolean } = {}): Promise<TeacherPWAState> {
    if (!profile || !profile.teacherId) {
      throw new Error('PROFIL_INVALIDE: teacherId est obligatoire.');
    }

    this.profile = profile;
    this.gradeBook = new OfflineGradeBook({
      teacherId: profile.teacherId,
      schoolId: profile.schoolId,
      now: this.now
    });

    if (options.openStorage) {
      await this.gradeBook.open(`elysium-teacher-${profile.teacherId}`);
    }

    try {
      await this.serviceWorker.register();
    } catch {
      // Enregistrement impossible (environnement non-navigateur) : l'application
      // reste pleinement fonctionnelle, seule la pré-charge des assets est absente.
    }

    this.initialized = true;
    return this.getState();
  }

  /** État courant de l'application (affiché dans l'en-tête PWA). */
  public getState(): TeacherPWAState {
    return {
      initialized: this.initialized,
      online: this.online,
      offlineSince: this.offlineSince,
      serviceWorkerRegistered: this.serviceWorker.isRegistered(),
      profile: this.profile ? { ...this.profile, disciplines: [...this.profile.disciplines] } : null,
      queue: this.gradeBook
        ? this.gradeBook.getQueueStats()
        : { pending: 0, synced: 0, total: 0 }
    };
  }

  /** Liste des classes confiées à l'enseignant. */
  public loadClasses(): SchoolClass[] {
    this.assertInitialized();
    const schoolId = this.profile!.schoolId;
    return this.classes
      .filter(c => c.schoolId === schoolId)
      .map(c => ({ ...c, disciplineIds: [...c.disciplineIds] }));
  }

  /** Élèves d'une classe (pour alimenter l'appel ou la grille de cotes). */
  public getClassStudents(classId: string): Student[] {
    this.assertInitialized();
    if (!this.classes.some(c => c.classId === classId)) {
      throw new Error(`CLASSE_INTROUVABLE: Aucune classe « ${classId} » pour cet enseignant.`);
    }
    return this.students.filter(s => s.classId === classId).map(s => ({ ...s }));
  }

  /**
   * Effectue et enregistre l'appel d'une classe.
   * VF-112-02 : l'appel est intégralement réalisable sans connexion.
   */
  public takeAttendance(params: {
    classId: string;
    date: string;
    records: AttendanceRecord[];
  }): AttendanceReport {
    this.assertInitialized();
    this.getClassStudents(params.classId);

    if (!params.date || !/^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
      throw new Error(`DATE_INVALIDE: Le format attendu est AAAA-MM-JJ (reçu « ${params.date} »).`);
    }
    if (!params.records || params.records.length === 0) {
      throw new Error('APPEL_VIDE: Au moins un élève doit être convoqué pour l\'appel.');
    }

    const known = new Set(this.students.filter(s => s.classId === params.classId).map(s => s.studentId));
    const createdAtLocal = new Date(this.now()).toISOString();
    const entries: AttendanceEntryRecord[] = [];

    for (const record of params.records) {
      if (!known.has(record.studentId)) {
        throw new Error(
          `ELEVE_HORS_CLASSE: L'élève ${record.studentId} n'appartient pas à la classe ${params.classId}.`
        );
      }
      const localId = nextAttendanceId();
      const entry: AttendanceEntryRecord = {
        studentId: record.studentId,
        status: record.status,
        localId,
        classId: params.classId,
        date: params.date,
        teacherId: this.profile!.teacherId,
        schoolId: this.profile!.schoolId,
        createdAtLocal,
        status_sync: this.online ? 'SYNCED' : 'PENDING_SYNC'
      };
      this.attendance.set(localId, entry);
      entries.push(entry);
    }

    const present = entries.filter(e => e.status === 'PRESENT').length;
    const absent = entries.filter(e => e.status === 'ABSENT').length;
    const late = entries.filter(e => e.status === 'RETARD').length;
    const excused = entries.filter(e => e.status === 'EXCUSE').length;

    return {
      classId: params.classId,
      date: params.date,
      total: entries.length,
      present,
      absent,
      late,
      excused,
      // Assiduité : (Présents + Excuses + Retards / 2) / Convoqués * 100
      attendanceRate: Math.round(((present + excused + late / 2) / entries.length) * 10000) / 100,
      queuedForSync: entries.filter(e => e.status_sync === 'PENDING_SYNC').length,
      entries
    };
  }

  /** Dernier appel enregistré pour une classe à une date donnée. */
  public getAttendance(classId: string, date: string): AttendanceEntryRecord[] {
    return [...this.attendance.values()].filter(e => e.classId === classId && e.date === date);
  }

  /**
   * Saisie des cotes d'une évaluation pour une classe entière.
   * Les notes invalides sont isolées : l'enseignant termine sa saisie.
   */
  public enterGrades(params: {
    classId: string;
    disciplineId: string;
    disciplineName: string;
    evaluationId: string;
    pointsMaxima: number;
    coefficient?: number;
    isEliminatoire?: boolean;
    grades: { studentId: string; studentName?: string; pointsObtenus: number }[];
  }): GradeBatchReport {
    this.assertInitialized();
    this.getClassStudents(params.classId);
    return this.gradeBook!.enterGradeBatch(params);
  }

  /** Progression académique d'un élève (délibération officielle RDC). */
  public viewStudentProgress(studentId: string, classId?: string): StudentProgress {
    this.assertInitialized();
    if (!this.students.some(s => s.studentId === studentId)) {
      throw new Error(`ELEVE_INTROUVABLE: Aucun élève « ${studentId} » dans le périmètre de l'enseignant.`);
    }
    return this.gradeBook!.viewStudentProgress(studentId, classId);
  }

  /**
   * Synchronise toutes les données en attente vers le serveur.
   * Hors-ligne, l'opération est différée (VF-112-03) sans perte de donnée.
   */
  public syncOffline(): SyncReport {
    this.assertInitialized();

    if (!this.online) {
      const pendingGrades = this.gradeBook!.getPendingEntries().length;
      const pendingAttendance = [...this.attendance.values()].filter(e => e.status_sync === 'PENDING_SYNC').length;
      return {
        status: 'DEFERRED',
        syncedGrades: 0,
        syncedAttendance: 0,
        remainingPending: pendingGrades + pendingAttendance,
        syncedAtUTC: null,
        reason: 'RESEAU_INDISPONIBLE: Synchronisation différée jusqu\'au retour du réseau.'
      };
    }

    const syncedAtUTC = new Date(this.now()).toISOString();
    let syncedGrades = 0;
    for (const entry of this.gradeBook!.getPendingEntries()) {
      if (this.gradeBook!.markAsSynced(entry.localId, syncedAtUTC)) syncedGrades++;
    }

    let syncedAttendance = 0;
    for (const entry of this.attendance.values()) {
      if (entry.status_sync === 'PENDING_SYNC') {
        entry.status_sync = 'SYNCED';
        syncedAttendance++;
      }
    }

    const remainingPending =
      this.gradeBook!.getPendingEntries().length +
      [...this.attendance.values()].filter(e => e.status_sync === 'PENDING_SYNC').length;

    return { status: 'SUCCESS', syncedGrades, syncedAttendance, remainingPending, syncedAtUTC };
  }

  /**
   * Bascule en mode hors-ligne (ou revient en ligne).
   * Le retour en ligne déclenche la synchronisation différée de la file.
   */
  public goOffline(offline = true): TeacherPWAState {
    this.gradeBook?.setOnlineStatus(!offline);
    this.online = !offline;

    if (offline) {
      this.offlineSince = new Date(this.now()).toISOString();
    } else {
      this.offlineSince = null;
      this.syncOffline();
    }
    return this.getState();
  }

  /** Bascule l'état réseau sans effet de bord (utile pour les tests). */
  public setOnlineStatus(online: boolean): void {
    this.online = online;
    this.gradeBook?.setOnlineStatus(online);
  }

  /** Accès au carnet de cotes (avancé). */
  public getGradeBook(): OfflineGradeBook {
    this.assertInitialized();
    return this.gradeBook!;
  }

  /** Notes d'un élève (raccourci). */
  public getStudentGrades(studentId: string): GradeEntry[] {
    this.assertInitialized();
    return this.gradeBook!.getStudentGrades(studentId);
  }

  /** Accès au gestionnaire de Service Worker. */
  public getServiceWorker(): ServiceWorkerManager {
    return this.serviceWorker;
  }

  /** Purge la base locale (déconnexion definitively d'un appareil). */
  public async clearLocalData(): Promise<void> {
    this.attendance.clear();
    await IndexedDBStore.deleteDB(`elysium-teacher-${this.profile?.teacherId ?? 'inconnu'}`);
  }

  private assertInitialized(): void {
    if (!this.initialized || !this.profile || !this.gradeBook) {
      throw new Error('PWA_NON_INITIALISEE: Appelez initialize() avant d\'utiliser l\'application.');
    }
  }
}
