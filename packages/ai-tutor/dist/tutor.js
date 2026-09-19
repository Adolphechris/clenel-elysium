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
exports.AiTutorService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Tuteur IA Encadré — Module 74 / Tome 10
 * VF-074-01 : L'IA ne répond qu'aux questions à portée pédagogique validée.
 * VF-074-02 : Quota quotidien de 20 questions par élève pour éviter la dépendance.
 * VF-074-03 : Toute session IA est journalisée dans l'audit trail de l'établissement.
 * VF-074-04 : L'IA est explicitement introduite comme un OUTIL — jamais comme un substitut à l'enseignant.
 * VF-001-01 : Doctrine exclusive Google — Vertex AI Gemini uniquement (PAS GPT/Claude/Mistral/etc.)
 */
// Sujets hors-scope détectés par mots-clés (filtres basiques côté client)
const OUT_OF_SCOPE_PATTERNS = [
    /politique/i, /argent|tarif|prix/i, /religion|foi|église|mosquée/i,
    /réponse.*exam|exam.*réponse|correction.*exam|donne.*réponse/i, // Anti-triche
    /pornograph|sexuel/i, /violence|bless|tuer/i
];
const DAILY_QUOTA = 20;
class AiTutorService {
    sessions = new Map();
    dailyUsage = new Map(); // userId -> questions today
    /**
     * Démarre une session de tutorat.
     */
    startSession(params) {
        const userId = params.userId;
        const usageToday = this.dailyUsage.get(userId) || 0;
        const session = {
            sessionId: `TUT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            userId,
            userRole: params.userRole,
            classId: params.classId,
            schoolId: params.schoolId,
            topic: params.topic,
            startedAtUTC: new Date().toISOString(),
            messages: [{
                    messageId: `MSG-${crypto.randomBytes(3).toString('hex')}`,
                    role: 'TUTOR',
                    content: `Bonjour ! Je suis l'assistant ELLYSIUM, un outil pédagogique. Je suis là pour vous aider avec vos questions de ${params.topic.replace(/_/g, ' ').toLowerCase()}. Je suis un outil de soutien — votre enseignant reste votre référence principale.`,
                    timestamp: new Date().toISOString(),
                    isFlagged: false
                }],
            questionsAsked: 0,
            dailyQuotaRemaining: DAILY_QUOTA - usageToday
        };
        this.sessions.set(session.sessionId, session);
        return session;
    }
    /**
     * Traite une question de l'élève et génère une réponse simulée (stub Vertex AI).
     * En production: appel à Vertex AI Gemini Pro via @google-cloud/vertexai.
     * VF-074-02 : Quota DAILY_QUOTA questions/élève/jour.
     */
    async askQuestion(sessionId, question) {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error(`SESSION_INVALIDE: ${sessionId}`);
        // VF-074-02 : Vérification du quota quotidien
        const usageToday = this.dailyUsage.get(session.userId) || 0;
        if (usageToday >= DAILY_QUOTA) {
            throw new Error(`QUOTA_DEPASSE: Vous avez atteint votre limite de ${DAILY_QUOTA} questions par jour. Revenez demain.`);
        }
        // Enregistrement de la question
        const userMsg = {
            messageId: `MSG-${crypto.randomBytes(3).toString('hex')}`,
            role: 'USER',
            content: question,
            timestamp: new Date().toISOString(),
            isFlagged: false
        };
        // VF-074-01 : Vérification du scope pédagogique
        const isOutOfScope = OUT_OF_SCOPE_PATTERNS.some(pat => pat.test(question));
        let responseContent;
        let isWithinScope = true;
        if (isOutOfScope) {
            userMsg.isFlagged = true;
            userMsg.flagReason = 'Contenu hors périmètre pédagogique';
            responseContent = `Cette question dépasse le cadre de mon rôle de tuteur pédagogique. Veuillez poser des questions relatives à votre cours de ${session.topic.replace(/_/g, ' ').toLowerCase()}. Pour toute autre question, consultez votre enseignant.`;
            isWithinScope = false;
        }
        else {
            // STUB Vertex AI — en production, ceci appelle Vertex AI Gemini Pro
            // avec le contexte du curriculum RDC et les instructions système ELLYSIUM
            responseContent = this.generateStubResponse(question, session.topic);
            this.dailyUsage.set(session.userId, usageToday + 1);
            session.questionsAsked += 1;
            session.dailyQuotaRemaining = DAILY_QUOTA - (usageToday + 1);
        }
        const tutorMsg = {
            messageId: `MSG-${crypto.randomBytes(3).toString('hex')}`,
            role: 'TUTOR',
            content: responseContent,
            timestamp: new Date().toISOString(),
            isFlagged: false
        };
        session.messages.push(userMsg, tutorMsg);
        return {
            message: tutorMsg,
            isWithinScope,
            pedagogicalNote: isWithinScope
                ? `Question n°${session.questionsAsked} — Sujet: ${session.topic}. Quota restant: ${session.dailyQuotaRemaining}/${DAILY_QUOTA}.`
                : 'Question signalée comme hors-périmètre.'
        };
    }
    /**
     * Génère une réponse pédagogique de stub.
     * Production: remplacer par l'appel réel @google-cloud/vertexai avec gemini-2.5-flash-002
     */
    generateStubResponse(question, topic) {
        const responses = {
            MATHEMATIQUES: `Bonne question ! Pour résoudre ce type de problème mathématique, commençons par identifier les données. [Réponse Vertex AI Gemini — à activer en production avec les clés GCP de l'établissement].`,
            FRANCAIS: `En français, voici comment analyser ce point linguistique. [Réponse Vertex AI Gemini — à activer en production].`,
            SCIENCES: `Voici l'explication scientifique de ce phénomène selon le programme RDC. [Réponse Vertex AI Gemini — à activer en production].`,
        };
        return responses[topic] || `Voici des pistes pour répondre à votre question sur « ${question.slice(0, 50)}... ». [Réponse Vertex AI Gemini — à activer avec les credentials GCP].`;
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
}
exports.AiTutorService = AiTutorService;
