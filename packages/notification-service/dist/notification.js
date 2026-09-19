"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Service de Notifications Multi-Canal ELLYSIUM
 * VF-070-01 : Toute notification urgente arrive sur au moins 2 canaux simultanément.
 * VF-070-02 : Les alertes d'absence parent sont déclenchées sous 30 minutes.
 * VF-070-03 : Aucune notification financière ne peut être déclenchée par un enseignant.
 * VF-110-04 : Accusé de réception obligatoire pour convocations.
 */
class NotificationService {
    queue = [];
    sentLog = [];
    /**
     * Crée et enqueue une notification.
     */
    createNotification(params) {
        // VF-070-01 : URGENT → au moins FCM + SMS
        const defaultChannels = params.priority === 'URGENT'
            ? ['FCM_PUSH', 'SMS']
            : ['IN_APP'];
        const notif = {
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
    alertAbsenceToParent(params) {
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
    notifyResultsPublished(params) {
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
    async send(notifId) {
        const notif = this.queue.find(n => n.notificationId === notifId);
        if (!notif)
            throw new Error(`NOTIF_NOT_FOUND: ${notifId}`);
        const channelResults = notif.channels.map(channel => ({
            channel,
            success: true // En production: appel FCM Admin SDK ou passerelle M-Pesa SMS
        }));
        notif.sentAtUTC = new Date().toISOString();
        const result = {
            notificationId: notifId,
            channelResults,
            overallSuccess: channelResults.every(r => r.success)
        };
        this.sentLog.push(result);
        return result;
    }
    getQueue() { return this.queue; }
    getSentCount() { return this.sentLog.length; }
}
exports.NotificationService = NotificationService;
