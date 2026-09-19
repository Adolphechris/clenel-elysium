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
exports.StudentService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Service de gestion des élèves et de l'IUNE (Identifiant Unique National ELLYSIUM)
 * Verrous associés : VF-058-01, VF-060-01, VF-060-03
 */
class StudentService {
    /**
     * Génère un IUNE officiel respectant le format standard congolais :
     * IUNE-CD-[PROVINCE]-[ANNEE]-[6_HEX]
     */
    generateIUNE(provinceCode, year = 2026) {
        const cleanProvince = provinceCode.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
        const entropy = crypto.randomBytes(3).toString('hex').toUpperCase();
        return `IUNE-CD-${cleanProvince || 'KIN'}-${year}-${entropy}`;
    }
    /**
     * Crée un dossier numérique unifié d'élève.
     */
    registerStudent(request) {
        if (!request.firstName || !request.lastName) {
            throw new Error("DONNEES_MANQUANTES: Le nom et le prénom de l'élève sont obligatoires.");
        }
        const studentId = `STU-${crypto.randomUUID()}`;
        const iune = this.generateIUNE(request.provinceCode);
        const enrollmentDateUTC = new Date().toISOString();
        return {
            studentId,
            iune,
            firstName: request.firstName.trim(),
            lastName: request.lastName.trim().toUpperCase(),
            gender: request.gender,
            birthDate: request.birthDate,
            schoolId: request.schoolId,
            classId: request.classId,
            isIndependent: request.isIndependent,
            parentPhone: request.parentPhone,
            enrollmentDateUTC
        };
    }
    /**
     * Enregistre un transfert d'établissement avec traçabilité immuable (VF-060-03)
     */
    recordTransfer(student, toSchoolId, prefetId, reason) {
        if (!student.schoolId) {
            throw new Error("TRANSFERT_IMPOSSIBLE: L'élève n'est rattaché à aucun établissement d'origine.");
        }
        if (student.schoolId === toSchoolId) {
            throw new Error("TRANSFERT_INVALIDE: L'établissement de destination est identique à l'origine.");
        }
        const transferRecord = {
            transferId: `TRF-${crypto.randomUUID()}`,
            studentId: student.studentId,
            fromSchoolId: student.schoolId,
            toSchoolId,
            reason,
            approvedByPrefetId: prefetId,
            timestampUTC: new Date().toISOString()
        };
        const updatedStudent = {
            ...student,
            schoolId: toSchoolId
        };
        return { updatedStudent, transferRecord };
    }
}
exports.StudentService = StudentService;
