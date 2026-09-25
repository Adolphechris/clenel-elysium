/**
 * Espace Parent / Tuteur ELLYSIUM
 *
 * Point d'entrée du portail : suivi scolaire de(s) l'(es) enfant(s), consultation
 * du bulletin sécurisé, suivi d'assiduité, notifications d'absence et paiement
 * Mobile Money.
 *
 * Principe constitutionnel central (Article 5) : la finance et l'académie sont
 * strictement séparées. Le portail recalcule la délibération à partir des notes
 * publiées (source de vérité : @elysium/academic-engine) et refuse d'exposer
 * toute donnée financière dans une vue académique.
 *
 * Verrous : VF-065-03 (assiduité), VF-068-01 (bulletin scellé), VF-070-02
 * (alerte d'absence), VF-071-01..04 (caisse étanche).
 */

import {
  calculateDeliberationRDC,
  generateReportCardSeal,
  type DeliberationResult,
  type GradeItem,
  type MentionRDC
} from '@elysium/academic-engine';
import { calculateStudentAttendance } from '@elysium/attendance-service';
import type { AttendanceEntry } from '@elysium/shared-types';
import {
  MobileMoneyPaymentService,
  type Currency,
  type FeeType,
  type MobileMoneyOperator,
  type MobileMoneyReceipt
} from './payment-service';
import {
  ParentNotificationService,
  type DispatchResult,
  type ParentNotification
} from './notifications';

export interface ParentProfile {
  parentId: string;
  parentName: string;
  phoneNumber: string;
  email?: string;
  fcmToken?: string;
}

export interface ChildProfile {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  schoolId: string;
  schoolName: string;
  academicYear: string;
}

export interface ChildReportCard {
  reportCardId: string;
  studentId: string;
  period: 'PREMIER_SEMESTRE' | 'SECOND_SEMESTRE' | 'ANNUEL';
  academicYear: string;
  grades: GradeItem[];
  publishedAtUTC: string;
}

export interface ParentReportCardView {
  reportCardId: string;
  studentId: string;
  studentName: string;
  className: string;
  schoolName: string;
  period: string;
  academicYear: string;
  grades: {
    disciplineId: string;
    disciplineName: string;
    pointsObtenus: number;
    pointsMaxima: number;
    percentage: number;
    mention: MentionRDC;
  }[];
  totalPointsObtenus: number;
  totalPointsMaxima: number;
  pourcentageOfficiel: number;
  mention: MentionRDC;
  isAdmis: boolean;
  matieresEnEchec: string[];
  formuleAppliquee: string;
  cryptographicHash: string;
  verificationUrl: string;
  publishedAtUTC: string;
}

export interface ParentAttendanceView {
  studentId: string;
  studentName: string;
  className: string;
  totalRollCalls: number;
  presents: number;
  absents: number;
  retards: number;
  excuses: number;
  tauxAssiduite: number;
  requiresParentAlert: boolean;
  alertReason?: string;
  absenceDates: string[];
}

export interface ParentPortalState {
  initialized: boolean;
  parentId: string | null;
  parentName: string | null;
  childCount: number;
  unreadNotifications: number;
  registeredDevices: number;
}

export interface NotificationsBundle {
  notifications: ParentNotification[];
  dispatches: DispatchResult[];
  unreadCount: number;
}

export interface PaymentOutcome {
  success: boolean;
  receipt?: MobileMoneyReceipt;
  errorMessage?: string;
  academicAccessGuarantee: ReturnType<MobileMoneyPaymentService['assertNoAcademicBlocking']>;
}

/**
 * Source de données du portail ( Firestore en production, jeu de démonstration
 * par défaut pour les tests et la PWA hors-ligne).
 */
export interface ParentDataSource {
  getChildren(parentId: string): ChildProfile[];
  getReportCards(studentId: string): ChildReportCard[];
  getAttendanceEntries(studentId: string): AttendanceEntry[];
  getFees(studentId: string): { feeType: FeeType; label: string; amountDue: number }[];
}

const DEMO_CHILDREN: ChildProfile[] = [
  {
    studentId: 'ST-001',
    studentName: 'KASONGO David',
    classId: 'CL-4HUM-A',
    className: '4ème Humanités Scientifiques A',
    schoolId: 'SCH-KIN-01',
    schoolName: 'École Sainte-Marie — Kinshasa',
    academicYear: '2026-2027'
  },
  {
    studentId: 'ST-006',
    studentName: 'NGALULA Christine',
    classId: 'CL-3HUM-B',
    className: '3ème Humanités Littéraires B',
    schoolId: 'SCH-KIN-01',
    schoolName: 'École Sainte-Marie — Kinshasa',
    academicYear: '2026-2027'
  }
];

const DEMO_REPORT_CARDS: ChildReportCard[] = [
  {
    reportCardId: 'BUL-2026-0001',
    studentId: 'ST-001',
    period: 'PREMIER_SEMESTRE',
    academicYear: '2026-2027',
    publishedAtUTC: '2026-09-19T06:00:00.000Z',
    grades: [
      { disciplineId: 'FR', disciplineName: 'Français', pointsObtenus: 68, pointsMaxima: 100, coefficient: 2 },
      { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 42, pointsMaxima: 50, coefficient: 2 },
      { disciplineId: 'BIO', disciplineName: 'Biologie', pointsObtenus: 36, pointsMaxima: 50, coefficient: 1 }
    ]
  }
];

const DEMO_ATTENDANCE: AttendanceEntry[] = [
  { attendanceId: 'AT-001', schoolId: 'SCH-KIN-01', classId: 'CL-4HUM-A', studentId: 'ST-001', date: '2026-09-14', status: 'PRESENT', markedByTeacherId: 'PROF-01', timestampUTC: '2026-09-14T07:00:00.000Z', parentNotified: false },
  { attendanceId: 'AT-002', schoolId: 'SCH-KIN-01', classId: 'CL-4HUM-A', studentId: 'ST-001', date: '2026-09-15', status: 'ABSENT', markedByTeacherId: 'PROF-01', timestampUTC: '2026-09-15T07:00:00.000Z', parentNotified: true },
  { attendanceId: 'AT-003', schoolId: 'SCH-KIN-01', classId: 'CL-4HUM-A', studentId: 'ST-001', date: '2026-09-16', status: 'RETARD', markedByTeacherId: 'PROF-01', timestampUTC: '2026-09-16T07:00:00.000Z', parentNotified: false },
  { attendanceId: 'AT-004', schoolId: 'SCH-KIN-01', classId: 'CL-4HUM-A', studentId: 'ST-001', date: '2026-09-17', status: 'PRESENT', markedByTeacherId: 'PROF-01', timestampUTC: '2026-09-17T07:00:00.000Z', parentNotified: false },
  { attendanceId: 'AT-005', schoolId: 'SCH-KIN-01', classId: 'CL-4HUM-A', studentId: 'ST-001', date: '2026-09-18', status: 'PRESENT', markedByTeacherId: 'PROF-01', timestampUTC: '2026-09-18T07:00:00.000Z', parentNotified: false }
];

/** Source de données de démonstration (remplace Firestore en local). */
export const DEMO_DATA_SOURCE: ParentDataSource = {
  getChildren: () => DEMO_CHILDREN.map(c => ({ ...c })),
  getReportCards: studentId => DEMO_REPORT_CARDS.filter(r => r.studentId === studentId).map(r => ({ ...r })),
  getAttendanceEntries: studentId => DEMO_ATTENDANCE.filter(a => a.studentId === studentId).map(a => ({ ...a })),
  getFees: () => [
    { feeType: 'MINERVAL', label: 'Minerval 1er semestre', amountDue: 150000 },
    { feeType: 'INSCRIPTION', label: 'Frais d\'inscription', amountDue: 25000 }
  ]
};

/**
 * Portail parent.
 */
export class ParentPortal {
  private profile: ParentProfile | null = null;
  private readonly payments: MobileMoneyPaymentService;
  private readonly notifications: ParentNotificationService;
  private readonly dataSource: ParentDataSource;
  private initialized = false;
  private readonly now: () => number;

  constructor(options: {
    dataSource?: ParentDataSource;
    payments?: MobileMoneyPaymentService;
    notifications?: ParentNotificationService;
    now?: () => number;
  } = {}) {
    this.dataSource = options.dataSource ?? DEMO_DATA_SOURCE;
    this.payments = options.payments ?? new MobileMoneyPaymentService({ now: options.now });
    this.notifications = options.notifications ?? new ParentNotificationService({ now: options.now });
    this.now = options.now ?? (() => Date.now());
  }

  /**
   * Initialise le portail : profil du parent et enregistrement de l'appareil
   * pour les notifications push FCM.
   */
  public async initialize(profile: ParentProfile): Promise<ParentPortalState> {
    if (!profile || !profile.parentId) {
      throw new Error('PROFIL_INVALIDE: parentId est obligatoire.');
    }
    this.profile = profile;
    if (profile.fcmToken) {
      this.notifications.registerDevice({ parentId: profile.parentId, fcmToken: profile.fcmToken, platform: 'ANDROID' });
    }
    this.initialized = true;
    return this.getState();
  }

  /** État courant du portail. */
  public getState(): ParentPortalState {
    return {
      initialized: this.initialized,
      parentId: this.profile?.parentId ?? null,
      parentName: this.profile?.parentName ?? null,
      childCount: this.initialized ? this.loadChildren().length : 0,
      unreadNotifications: this.profile ? this.notifications.getUnreadCount(this.profile.parentId) : 0,
      registeredDevices: this.profile ? this.notifications.getDevices(this.profile.parentId).length : 0
    };
  }

  /** Liste des enfants rattachés au parent. */
  public loadChildren(): ChildProfile[] {
    this.assertInitialized();
    return this.dataSource.getChildren(this.profile!.parentId);
  }

  /**
   * Consultation du bulletin scolaire.
   * La délibération est RECALCULÉE localement par le moteur officiel : le
   * parent ne voit jamais une mention non conforme à la formule RDC.
   */
  public viewReportCard(studentId: string, period?: ChildReportCard['period']): ParentReportCardView {
    this.assertInitialized();
    const child = this.findChild(studentId);
    const cards = this.dataSource
      .getReportCards(studentId)
      .filter(c => period === undefined || c.period === period);

    if (cards.length === 0) {
      throw new Error(`BULLETIN_INDISPONIBLE: Aucun bulletin ${period ?? ''} pour l'élève ${studentId}.`);
    }

    const card = cards[0]!;
    const deliberation: DeliberationResult = calculateDeliberationRDC(card.grades);
    const seal = generateReportCardSeal({
      reportCardId: card.reportCardId,
      studentId: card.studentId,
      studentName: child.studentName,
      schoolId: child.schoolId,
      classId: child.classId,
      academicYear: card.academicYear,
      period: card.period,
      grades: card.grades,
      deliberation,
      timestampUTC: card.publishedAtUTC
    });

    // ARTICLE 5 : aucune donnée financière ne doit apparaître dans une vue académique.
    this.payments.assertAcademicPayloadIsFinancialFree({ ...deliberation, grades: card.grades } as Record<string, unknown>);

    return {
      reportCardId: card.reportCardId,
      studentId: card.studentId,
      studentName: child.studentName,
      className: child.className,
      schoolName: child.schoolName,
      period: card.period,
      academicYear: card.academicYear,
      grades: card.grades.map(grade => ({
        disciplineId: grade.disciplineId,
        disciplineName: grade.disciplineName,
        pointsObtenus: grade.pointsObtenus,
        pointsMaxima: grade.pointsMaxima,
        percentage: Math.round((grade.pointsObtenus / grade.pointsMaxima) * 10000) / 100,
        mention: calculateDeliberationRDC([grade]).mention
      })),
      totalPointsObtenus: deliberation.totalPointsObtenus,
      totalPointsMaxima: deliberation.totalPointsMaxima,
      pourcentageOfficiel: deliberation.pourcentageOfficiel,
      mention: deliberation.mention,
      isAdmis: deliberation.isAdmis,
      matieresEnEchec: deliberation.matieresEnEchec,
      formuleAppliquee: deliberation.formuleAppliquee,
      cryptographicHash: seal.hash,
      verificationUrl: seal.verificationUrl,
      publishedAtUTC: card.publishedAtUTC
    };
  }

  /**
   * Suivi d'assiduité (serviceattendance-service, verrous VF-065-03).
   */
  public viewAttendance(studentId: string): ParentAttendanceView {
    this.assertInitialized();
    const child = this.findChild(studentId);
    const entries = this.dataSource.getAttendanceEntries(studentId);
    const summary = calculateStudentAttendance(studentId, entries);

    return {
      studentId,
      studentName: child.studentName,
      className: child.className,
      totalRollCalls: summary.totalRollCalls,
      presents: summary.presents,
      absents: summary.absents,
      retards: summary.retards,
      excuses: summary.excuses,
      tauxAssiduite: summary.tauxAssiduite,
      requiresParentAlert: summary.requiresParentAlert,
      alertReason: summary.alertReason,
      absenceDates: entries.filter(e => e.status === 'ABSENT').map(e => e.date).sort()
    };
  }

  /**
   * Réception des notifications : alerte d'absence (si justifiée) et annonce
   * de bulletin. VF-070-02 : l'absence est notifiée sans délai.
   */
  public receiveNotifications(studentId: string, options: { absenceDate?: string } = {}): NotificationsBundle {
    this.assertInitialized();
    const child = this.findChild(studentId);
    const notifications: ParentNotification[] = [];
    const dispatches: DispatchResult[] = [];

    const attendance = this.viewAttendance(studentId);
    if (attendance.requiresParentAlert) {
      const lastAbsence = options.absenceDate ?? attendance.absenceDates[attendance.absenceDates.length - 1] ?? '2026-09-19';
      const alert = this.notifications.alertAbsence({
        parentId: this.profile!.parentId,
        studentId,
        studentName: child.studentName,
        className: child.className,
        schoolId: child.schoolId,
        date: lastAbsence,
        consecutiveAbsences: Math.max(attendance.absents, 1),
        absenceRate: attendance.tauxAssiduite
      });
      notifications.push(alert.notification);
      dispatches.push(alert.dispatch);
    }

    try {
      const card = this.viewReportCard(studentId);
      const reportNotification = this.notifications.buildReportCardNotification({
        parentId: this.profile!.parentId,
        studentId,
        studentName: child.studentName,
        schoolId: child.schoolId,
        period: card.period,
        pourcentageOfficiel: card.pourcentageOfficiel,
        mention: card.mention,
        isAdmis: card.isAdmis,
        verificationUrl: card.verificationUrl
      });
      notifications.push(reportNotification);
      dispatches.push(this.notifications.dispatch(reportNotification));
    } catch {
      // Aucun bulletin publié : seule l'alerte d'absence est envoyée.
    }

    return {
      notifications,
      dispatches,
      unreadCount: this.notifications.getUnreadCount(this.profile!.parentId)
    };
  }

  /**
   * Paiement Mobile Money (M-Pesa, Orange Money, Airtel Money).
   * La garantie Article 5 est retournée systématiquement : un impayé ne
   * retire jamais l'accès au suivi scolaire.
   */
  public makePayment(params: {
    studentId: string;
    amount: number;
    feeType: FeeType;
    operator: MobileMoneyOperator;
    payerPhoneNumber?: string;
    currency?: Currency;
  }): PaymentOutcome {
    this.assertInitialized();
    const child = this.findChild(params.studentId);
    const guarantee = this.payments.assertNoAcademicBlocking(params.studentId);

    const result = this.payments.initiatePayment({
      parentId: this.profile!.parentId,
      studentId: params.studentId,
      schoolId: child.schoolId,
      amount: params.amount,
      currency: params.currency ?? 'CDF',
      feeType: params.feeType,
      operator: params.operator,
      payerPhoneNumber: params.payerPhoneNumber ?? this.profile!.phoneNumber
    });

    return {
      success: result.success,
      receipt: result.receipt,
      errorMessage: result.errorMessage,
      academicAccessGuarantee: guarantee
    };
  }

  /** Confirme la réception d'un paiement par l'opérateur. */
  public confirmPayment(receiptId: string, confirmationCode: string): boolean {
    this.assertInitialized();
    return this.payments.confirmPayment(receiptId, confirmationCode).success;
  }

  /** État de compte (solde restant) — données strictement financières. */
  public getStatement(studentId: string): ReturnType<MobileMoneyPaymentService['getStatement']> {
    this.assertInitialized();
    const child = this.findChild(studentId);
    return this.payments.getStatement({
      studentId,
      schoolId: child.schoolId,
      fees: this.dataSource.getFees(studentId)
    });
  }

  /** Historique des reçus de l'élève. */
  public getReceipts(studentId: string): MobileMoneyReceipt[] {
    return this.payments.getReceiptsForStudent(studentId);
  }

  /** Service de notifications (avancé). */
  public getNotificationService(): ParentNotificationService {
    return this.notifications;
  }

  /** Service de paiement (avancé). */
  public getPaymentService(): MobileMoneyPaymentService {
    return this.payments;
  }

  private findChild(studentId: string): ChildProfile {
    const child = this.loadChildren().find(c => c.studentId === studentId);
    if (!child) {
      throw new Error(`ENFANT_INTROUVABLE: L'élève ${studentId} n'est pas rattaché à ce parent.`);
    }
    return child;
  }

  private assertInitialized(): void {
    if (!this.initialized || !this.profile) {
      throw new Error('PORTAL_NON_INITIALISE: Appelez initialize() avant d\'utiliser le portail.');
    }
  }
}
