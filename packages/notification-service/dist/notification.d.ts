import { NotificationPayload, NotificationResult, NotificationChannel, NotificationType, NotificationPriority } from './types';
/**
 * Service de Notifications Multi-Canal ELLYSIUM
 * VF-070-01 : Toute notification urgente arrive sur au moins 2 canaux simultanément.
 * VF-070-02 : Les alertes d'absence parent sont déclenchées sous 30 minutes.
 * VF-070-03 : Aucune notification financière ne peut être déclenchée par un enseignant.
 * VF-110-04 : Accusé de réception obligatoire pour convocations.
 */
export declare class NotificationService {
    private queue;
    private sentLog;
    /**
     * Crée et enqueue une notification.
     */
    createNotification(params: {
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
    }): NotificationPayload;
    /**
     * Alerte d'absence élève envoyée aux parents (VF-065-03, VF-070-02).
     */
    alertAbsenceToParent(params: {
        studentId: string;
        studentName: string;
        parentId: string;
        parentPhone: string;
        parentFcmToken?: string;
        schoolId: string;
        date: string;
        consecutiveAbsences: number;
    }): NotificationPayload;
    /**
     * Notification de publication d'un bulletin ou résultat de délibération.
     */
    notifyResultsPublished(params: {
        studentId: string;
        parentId: string;
        schoolId: string;
        reportCardId: string;
        mention: string;
        pourcentage: number;
        isAdmis: boolean;
    }): NotificationPayload;
    /**
     * Simule l'envoi (en production, appelle les API Firebase FCM et passerelles SMS congolaises).
     */
    send(notifId: string): Promise<NotificationResult>;
    getQueue(): ReadonlyArray<NotificationPayload>;
    getSentCount(): number;
}
