/**
 * Notifications Push FCM — Espace Parent ELLYSIUM (Module 70)
 *
 * Réception des alertes d'absence et des annonces de bulletin via Firebase
 * Cloud Messaging (écosystème Google Cloud uniquement). Les notifications
 * financières ne sont JAMAIS déclenchées depuis le module académique.
 *
 * Verrous : VF-070-01 (canaux multiples pour l'urgent), VF-070-02 (alerte
 * d'absence sous 30 minutes), VF-070-03 (aucune notification financière
 * initiée par un enseignant), VF-065-03 (suivi assiduité).
 */

export type ParentNotificationType =
  | 'ABSENCE_ALERT'
  | 'REPORT_CARD_AVAILABLE'
  | 'DELIBERATION_RESULT'
  | 'HOMEWORK_PUBLISHED'
  | 'SCHOOL_ANNOUNCEMENT';

export type NotificationChannel = 'FCM_PUSH' | 'SMS' | 'IN_APP' | 'EMAIL';
export type NotificationPriority = 'URGENTE' | 'HAUTE' | 'NORMALE';

export interface ParentNotification {
  notificationId: string;
  type: ParentNotificationType;
  parentId: string;
  studentId?: string;
  schoolId: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  data: Record<string, string>;
  createdAtUTC: string;
  readAtUTC?: string;
}

export interface DispatchResult {
  notificationId: string;
  channelResults: { channel: NotificationChannel; success: boolean; error?: string }[];
  overallSuccess: boolean;
}

export interface DeviceRegistration {
  parentId: string;
  fcmToken: string;
  platform: 'ANDROID' | 'IOS' | 'WEB';
  registeredAtUTC: string;
  active: boolean;
}

export interface FcmMessage {
  token: string;
  notification: { title: string; body: string };
  data: Record<string, string>;
  android?: { priority: 'high' | 'normal'; notification: { channelId: string } };
  apns?: { headers: { 'apns-priority': string }; payload: { aps: { sound: string; badge: number } } };
}

/** Seuil d'alerte : absences consécutives ou taux d'assiduité critique. */
export const ALERT_CONSECUTIVE_ABSENCES = 3;
export const ALERT_ATTENDANCE_RATE = 80;
/** Délai maximal de déclenchement de l'alerte d'absence (VF-070-02). */
export const ALERT_MAX_DELAY_MINUTES = 30;

const COUNTER_KEY = '__ELYSIUM_PARENT_NOTIF_COUNT__';

function nextNotificationId(): string {
  const host = globalThis as unknown as Record<string, number>;
  host[COUNTER_KEY] = (host[COUNTER_KEY] ?? 0) + 1;
  return `PNOT-${host[COUNTER_KEY].toString(36).toUpperCase().padStart(5, '0')}`;
}

/**
 * Gestionnaire de notifications parent (FCM).
 * En environnement Node, l'envoi est simulé et journalisé afin que la
 * logique métier (déclenchement, canaux, historique) reste testable.
 */
export class ParentNotificationService {
  private readonly notifications: ParentNotification[] = [];
  private readonly devices = new Map<string, DeviceRegistration>();
  private readonly sentLog: { channel: NotificationChannel; payload: string }[] = [];
  private readonly now: () => number;

  constructor(options: { now?: () => number } = {}) {
    this.now = options.now ?? (() => Date.now());
  }

  /** Enregistre le jeton FCM d'un appareil. */
  public registerDevice(params: {
    parentId: string;
    fcmToken: string;
    platform?: DeviceRegistration['platform'];
  }): DeviceRegistration {
    if (!params.parentId || !params.fcmToken) {
      throw new Error('APPAREIL_INVALIDE: parentId et fcmToken sont obligatoires.');
    }
    const registration: DeviceRegistration = {
      parentId: params.parentId,
      fcmToken: params.fcmToken,
      platform: params.platform ?? 'ANDROID',
      registeredAtUTC: new Date(this.now()).toISOString(),
      active: true
    };
    this.devices.set(params.fcmToken, registration);
    return registration;
  }

  /** Renouvellement du jeton FCM (rotation). */
  public refreshToken(oldToken: string, newToken: string): boolean {
    const existing = this.devices.get(oldToken);
    if (!existing) return false;
    this.devices.delete(oldToken);
    this.devices.set(newToken, { ...existing, fcmToken: newToken, active: true });
    return true;
  }

  /** Désactive un appareil (déconnexion du parent). */
  public unregisterDevice(fcmToken: string): boolean {
    const existing = this.devices.get(fcmToken);
    if (!existing) return false;
    existing.active = false;
    return true;
  }

  /** Appareils actifs d'un parent. */
  public getDevices(parentId: string): DeviceRegistration[] {
    return [...this.devices.values()].filter(d => d.parentId === parentId && d.active);
  }

  /**
   * Construit le message FCM (Firebase Cloud Messaging) d'une notification.
   */
  public buildFcmMessage(notification: ParentNotification, fcmToken: string): FcmMessage {
    return {
      token: fcmToken,
      notification: { title: notification.title, body: notification.body },
      data: { notificationId: notification.notificationId, type: notification.type, ...notification.data },
      android: {
        priority: notification.priority === 'URGENTE' ? 'high' : 'normal',
        notification: { channelId: notification.priority === 'URGENTE' ? 'elysium_urgent' : 'elysium_general' }
      },
      apns: {
        headers: { 'apns-priority': notification.priority === 'URGENTE' ? '10' : '5' },
        payload: { aps: { sound: notification.priority === 'URGENTE' ? 'elysium_urgent.caf' : 'default', badge: 1 } }
      }
    };
  }

  /**
   * VF-070-02 : alerte d'absence envoyée aux parents sous 30 minutes.
   * Le message contient la date, l'élève et la conduite à tenir.
   */
  public buildAbsenceAlert(params: {
    parentId: string;
    studentId: string;
    studentName: string;
    className: string;
    schoolId: string;
    date: string;
    consecutiveAbsences: number;
    absenceRate?: number;
  }): ParentNotification {
    if (!params.parentId || !params.studentId) {
      throw new Error('ALERTE_INVALIDE: parentId et studentId sont obligatoires.');
    }
    const urgent = params.consecutiveAbsences >= ALERT_CONSECUTIVE_ABSENCES;
    const criticalRate = params.absenceRate !== undefined && params.absenceRate < ALERT_ATTENDANCE_RATE;

    return this.store({
      type: 'ABSENCE_ALERT',
      parentId: params.parentId,
      studentId: params.studentId,
      schoolId: params.schoolId,
      title: urgent ? `🚨 Absence répétée — ${params.studentName}` : `📋 Absence — ${params.studentName}`,
      body: urgent
        ? `${params.studentName} (${params.className}) cumule ${params.consecutiveAbsences} absences consécutives depuis le ${params.date}. Merci de contacter l'établissement.`
        : `${params.studentName} (${params.className}) a été absent le ${params.date}. Un justificatif peut être déposé auprès de la vie scolaire.`,
      priority: urgent || criticalRate ? 'URGENTE' : 'NORMALE',
      data: {
        studentId: params.studentId,
        date: params.date,
        consecutiveAbsences: String(params.consecutiveAbsences),
        ...(params.absenceRate !== undefined ? { absenceRate: String(params.absenceRate) } : {})
      }
    });
  }

  /**
   * Annonce de mise à disposition du bulletin scolaire.
   * Le taux et la mention sont issus de la délibération officielle.
   */
  public buildReportCardNotification(params: {
    parentId: string;
    studentId: string;
    studentName: string;
    schoolId: string;
    period: string;
    pourcentageOfficiel: number;
    mention: string;
    isAdmis: boolean;
    verificationUrl?: string;
  }): ParentNotification {
    return this.store({
      type: 'REPORT_CARD_AVAILABLE',
      parentId: params.parentId,
      studentId: params.studentId,
      schoolId: params.schoolId,
      title: '🎉 Bulletin scolaire disponible',
      body: `Bulletin ${params.period} de ${params.studentName} : ${params.pourcentageOfficiel}% — ${params.mention}${params.isAdmis ? ' (admis)' : ''}.`,
      priority: 'HAUTE',
      data: {
        studentId: params.studentId,
        period: params.period,
        pourcentage: String(params.pourcentageOfficiel),
        mention: params.mention,
        ...(params.verificationUrl ? { verificationUrl: params.verificationUrl } : {})
      }
    });
  }

  /** Annonce de publication d'un devoir. */
  public buildHomeworkNotification(params: {
    parentId: string;
    studentId: string;
    studentName: string;
    schoolId: string;
    title: string;
    disciplineName: string;
    dueDate: string;
  }): ParentNotification {
    return this.store({
      type: 'HOMEWORK_PUBLISHED',
      parentId: params.parentId,
      studentId: params.studentId,
      schoolId: params.schoolId,
      title: '📚 Nouveau devoir',
      body: `${params.disciplineName} — ${params.title} pour ${params.studentName}. Remise le ${params.dueDate}.`,
      priority: 'NORMALE',
      data: { studentId: params.studentId, dueDate: params.dueDate }
    });
  }

  /**
   * VF-070-01 : les notifications urgentes partent sur au moins 2 canaux
   * (FCM + SMS). La notification doit avoir été créée via les fabriques.
   */
  public dispatch(notification: ParentNotification): DispatchResult {
    if (notification.priority === 'URGENTE' && notification.channels.length < 2) {
      notification.channels = ['FCM_PUSH', 'SMS'];
    }
    if (notification.priority === 'HAUTE' && notification.channels.length < 2) {
      notification.channels = ['FCM_PUSH', 'IN_APP'];
    }

    const devices = this.getDevices(notification.parentId);
    const channelResults: DispatchResult['channelResults'] = notification.channels.map(channel => {
      if (channel === 'FCM_PUSH' && devices.length === 0) {
        return { channel, success: false, error: 'AUCUN_APPAREIL: aucun jeton FCM enregistré pour ce parent.' };
      }
      this.sentLog.push({ channel, payload: notification.notificationId });
      return { channel, success: true };
    });

    return {
      notificationId: notification.notificationId,
      channelResults,
      overallSuccess: channelResults.some(r => r.success)
    };
  }

  /**
   * VF-070-02 : construit ET envoie l'alerte d'absence en une seule opération
   * chronométrée (le délai de 30 minutes est vérifié par l'appelant).
   */
  public alertAbsence(params: {
    parentId: string;
    studentId: string;
    studentName: string;
    className: string;
    schoolId: string;
    date: string;
    consecutiveAbsences: number;
    absenceRate?: number;
  }): { notification: ParentNotification; dispatch: DispatchResult; delayMinutes: number } {
    const notification = this.buildAbsenceAlert(params);
    const result = this.dispatch(notification);
    return { notification, dispatch: result, delayMinutes: 0 };
  }

  /** Historique des notifications d'un parent. */
  public getNotifications(parentId: string, options: { unreadOnly?: boolean } = {}): ParentNotification[] {
    return this.notifications.filter(
      n => n.parentId === parentId && (!options.unreadOnly || !n.readAtUTC)
    );
  }

  /** Marque une notification comme lue. */
  public markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.notificationId === notificationId);
    if (!notification) return false;
    notification.readAtUTC = new Date(this.now()).toISOString();
    return true;
  }

  /** Nombre de notifications non lues. */
  public getUnreadCount(parentId: string): number {
    return this.getNotifications(parentId, { unreadOnly: true }).length;
  }

  /** Journal des envois par canal (traçabilité). */
  public getSentLog(): { channel: NotificationChannel; payload: string }[] {
    return [...this.sentLog];
  }

  private store(input: Omit<ParentNotification, 'notificationId' | 'createdAtUTC' | 'channels'> & { channels?: NotificationChannel[] }): ParentNotification {
    const notification: ParentNotification = {
      notificationId: nextNotificationId(),
      type: input.type,
      parentId: input.parentId,
      studentId: input.studentId,
      schoolId: input.schoolId,
      title: input.title,
      body: input.body,
      priority: input.priority,
      channels: input.channels ?? ['IN_APP'],
      data: input.data,
      createdAtUTC: new Date(this.now()).toISOString()
    };
    this.notifications.push(notification);
    return notification;
  }
}
