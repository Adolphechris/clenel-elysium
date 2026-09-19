export type NotificationChannel = 'FCM_PUSH' | 'SMS' | 'IN_APP' | 'EMAIL';
export type NotificationPriority = 'URGENT' | 'HAUTE' | 'NORMALE' | 'BASSE';
export type NotificationType = 'ABSENCE_ALERT' | 'GRADES_PUBLISHED' | 'DELIBERATION_RESULT' | 'PAYMENT_REMINDER' | 'CONVOCATION' | 'EXAM_SCHEDULE' | 'SCHOOL_ANNOUNCEMENT' | 'DIPLOMA_READY';
export interface NotificationPayload {
    notificationId: string;
    type: NotificationType;
    recipientId: string;
    recipientPhone?: string;
    recipientFcmToken?: string;
    schoolId: string;
    title: string;
    body: string;
    priority: NotificationPriority;
    channels: NotificationChannel[];
    data?: Record<string, string>;
    createdAtUTC: string;
    sentAtUTC?: string;
    deliveredAtUTC?: string;
}
export interface NotificationResult {
    notificationId: string;
    channelResults: {
        channel: NotificationChannel;
        success: boolean;
        error?: string;
    }[];
    overallSuccess: boolean;
}
