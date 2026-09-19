export type NotificationChannel = 'FCM_PUSH' | 'SMS' | 'IN_APP' | 'EMAIL';
export type NotificationPriority = 'URGENT' | 'HAUTE' | 'NORMALE' | 'BASSE';
export type NotificationType =
  | 'ABSENCE_ALERT'           // Alerte absence élève → parent
  | 'GRADES_PUBLISHED'        // Bulletin/cotes disponibles
  | 'DELIBERATION_RESULT'     // Résultat de délibération officiel
  | 'PAYMENT_REMINDER'        // Rappel paiement (caisse)
  | 'CONVOCATION'             // Convocation disciplinaire
  | 'EXAM_SCHEDULE'           // Planning d'examen
  | 'SCHOOL_ANNOUNCEMENT'     // Annonce générale direction
  | 'DIPLOMA_READY';          // Diplôme prêt à retirer

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
  channelResults: { channel: NotificationChannel; success: boolean; error?: string }[];
  overallSuccess: boolean;
}
