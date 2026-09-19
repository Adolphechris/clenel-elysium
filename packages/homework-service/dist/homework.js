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
exports.HomeworkService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Service de Gestion des Devoirs et Travaux
 * VF-069-01 : Un devoir ne peut être publié sans date de remise.
 * VF-069-02 : Aucun devoir ne peut être modifié après sa publication.
 * VF-069-03 : La correction est enregistrée de manière immuable.
 */
class HomeworkService {
    homeworks = new Map();
    submissions = new Map();
    /**
     * Crée et publie un devoir.
     */
    createHomework(params) {
        // VF-069-01
        if (!params.dueDateUTC)
            throw new Error('DATE_MANQUANTE: La date de remise est obligatoire.');
        if (new Date(params.dueDateUTC) <= new Date()) {
            throw new Error('DATE_INVALIDE: La date de remise doit être dans le futur.');
        }
        if (params.maxPoints <= 0)
            throw new Error('POINTS_INVALIDES: Le maximum doit être positif.');
        const hw = {
            homeworkId: `HW-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            ...params,
            publishedAtUTC: new Date().toISOString(),
            status: 'PUBLIE'
        };
        this.homeworks.set(hw.homeworkId, hw);
        this.submissions.set(hw.homeworkId, []);
        return hw;
    }
    /**
     * Enregistre la soumission d'un élève.
     */
    submitHomework(homeworkId, studentId, content, attachmentUrls) {
        const hw = this.homeworks.get(homeworkId);
        if (!hw)
            throw new Error(`DEVOIR_INTROUVABLE: ${homeworkId}`);
        if (hw.status === 'CLOS' || hw.status === 'CORRIGE') {
            throw new Error('DEVOIR_CLOS: Ce devoir n\'accepte plus de soumissions.');
        }
        const now = new Date();
        const dueDate = new Date(hw.dueDateUTC);
        const isLate = now > dueDate;
        const existing = this.submissions.get(homeworkId);
        const alreadySubmitted = existing.find(s => s.studentId === studentId);
        if (alreadySubmitted)
            throw new Error(`DEJA_SOUMIS: L'élève ${studentId} a déjà rendu ce devoir.`);
        const sub = {
            submissionId: `SUB-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            homeworkId, studentId, content, attachmentUrls,
            submittedAtUTC: now.toISOString(),
            status: isLate ? 'RETARD' : 'SOUMIS'
        };
        existing.push(sub);
        return sub;
    }
    /**
     * Corrige une soumission (action immuable — VF-069-03).
     */
    gradeSubmission(homeworkId, submissionId, grade, comment) {
        const hw = this.homeworks.get(homeworkId);
        if (!hw)
            throw new Error(`DEVOIR_INTROUVABLE: ${homeworkId}`);
        const subs = this.submissions.get(homeworkId);
        const sub = subs.find(s => s.submissionId === submissionId);
        if (!sub)
            throw new Error(`SOUMISSION_INTROUVABLE: ${submissionId}`);
        if (sub.status === 'CORRIGE')
            throw new Error('DEJA_CORRIGE: Une soumission corrigée est immuable (VF-069-03).');
        if (grade < 0 || grade > hw.maxPoints)
            throw new Error(`NOTE_INVALIDE: ${grade} hors limites [0, ${hw.maxPoints}].`);
        sub.grade = grade;
        sub.teacherComment = comment;
        sub.gradedAtUTC = new Date().toISOString();
        sub.status = 'CORRIGE';
        return sub;
    }
    getSubmissions(homeworkId) {
        return this.submissions.get(homeworkId) || [];
    }
}
exports.HomeworkService = HomeworkService;
