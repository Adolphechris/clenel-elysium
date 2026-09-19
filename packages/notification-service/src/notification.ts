import * as crypto from 'crypto';
import { NotificationPayload, NotificationResult, NotificationChannel, NotificationType, NotificationPriority } from './types';

/**
 * Service de Notifications Multi-Canal ELLYSIUM
 * VF-070-01 : Toute notification urgente arrive sur au moins 2 canaux simultanément.
 * VF-070-02 : Les alertes d'absence parent sont déclenchées sous 30 minutes.
 * VF-070-03 : Aucune notification financière ne peut être déclenchée par un enseignant.
 * VF-110-04 : Accusé de réception obligatoire pour convocations.
 */
export class NotificationService {
  private queue: NotificationPayload[] = [];
  private sentLog: NotificationResult[] = [];

  /**
   * Crée et enqueue une notification.
   */
  public createNotification(params: {
    type: NotificationType;
    recipientId: string;
    recipientPhone?: string;
    recipientFcmToken?: string;
    schoolId: string;
    title: string;
    body: string;
    priority?: NotificationPriority;
    channels?: NotificationChannel[];
    data?: Record<string, string>;
  }): NotificationPayload {
    // VF-070-01 : URGENT → au moins FCM + SMS
    const defaultChannels = params.priority === 'URGENT'
      ? ['FCM_PUSH', 'SMS'] as NotificationChannel[]
      : ['IN_APP'] as NotificationChannel[];

    const notif: NotificationPayload = {
      notificationId: `NOTIF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      type: params.type,
      recipientId: params.recipientId,
      recipientPhone: params.recipientPhone,
      recipientFcmToken: params.recipientFcmToken,
      schoolId: params.schoolId,
      title: params.title,
      body: params.body,
      priority: params.priority || 'NORMALE',
      channels: params.channels || defaultChannels,
      data: params.data,
      createdAtUTC: new Date().toISOString()
    };

    this.queue.push(notif);
    return notif;
  }

  /**
   * Alerte d'absence élève envoyée aux parents (VF-065-03, VF-070-02).
   */
  public alertAbsenceToParent(params: {
    studentId: string;
    studentName: string;
    parentId: string;
    parentPhone: string;
    parentFcmToken?: string;
    schoolId: string;
    date: string;
    consecutiveAbsences: number;
  }): NotificationPayload {
    const isUrgent = params.consecutiveAbsences >= 3;
    return this.createNotification({
      type: 'ABSENCE_ALERT',
      recipientId: params.parentId,
      recipientPhone: params.parentPhone,
      recipientFcmToken: params.parentFcmToken,
      schoolId: params.schoolId,
      title: isUrgent ? `⚠️ ALERTE URGENTE — Absences ${params.studentName}` : `Absence signalée — ${params.studentName}`,
      body: `Votre enfant ${params.studentName} était absent(e) le ${params.date}. Absences consécutives : ${params.consecutiveAbsences}.`,
      priority: isUrgent ? 'URGENT' : 'HAUTE',
      channels: isUrgent ? ['FCM_PUSH', 'SMS', 'IN_APP'] : ['FCM_PUSH', 'IN_APP'],
      data: {
        studentId: params.studentId,
        date: params.date,
        consecutiveAbsences: String(params.consecutiveAbsences)
      }
    });
  }

  /**
   * Notification de publication d'un bulletin ou résultat de délibération.
   */
  public notifyResultsPublished(params: {
    studentId: string;
    parentId: string;
    schoolId: string;
    reportCardId: string;
    mention: string;
    pourcentage: number;
    isAdmis: boolean;
  }): NotificationPayload {
    const emoji = params.isAdmis ? '🎉' : '📋';
    return this.createNotification({
      type: 'DELIBERATION_RESULT',
      recipientId: params.parentId,
      schoolId: params.schoolId,
      title: `${emoji} Résultats disponibles — ELLYSIUM`,
      body: `Le bulletin de votre enfant est disponible. Résultat : ${params.pourcentage}% — ${params.mention.replace(/_/g, ' ')}. ${params.isAdmis ? 'ADMIS(E)' : 'AJOURNÉ(E)'}`,
      priority: 'HAUTE',
      channels: ['FCM_PUSH', 'IN_APP'],
      data: {
        reportCardId: params.reportCardId,
        mention: params.mention,
        pourcentage: String(params.pourcentage),
        isAdmis: String(params.isAdmis)
      }
    });
  }

  /**
   * Simule l'envoi (en production, appelle les API Firebase FCM et passerelles SMS congolaises).
   */
  public async send(notifId: string): Promise<NotificationResult> {
    const notif = this.queue.find(n => n.notificationId === notifId);
    if (!notif) throw new Error(`NOTIF_NOT_FOUND: ${notifId}`);

    const channelResults = notif.channels.map(channel => ({
      channel,
      success: true // En production: appel FCM Admin SDK ou passerelle M-Pesa SMS
    }));

    notif.sentAtUTC = new Date().toISOString();

    const result: NotificationResult = {
      notificationId: notifId,
      channelResults,
      overallSuccess: channelResults.every(r => r.success)
    };

    this.sentLog.push(result);
    return result;
  }

  public getQueue(): ReadonlyArray<NotificationPayload> { return this.queue; }
  public getSentCount(): number { return this.sentLog.length; }
}
