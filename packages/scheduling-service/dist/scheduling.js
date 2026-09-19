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
exports.SchedulingService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Service de Paramétrage Pédagogique et Emplois du Temps
 * VF-063-01 : Tout établissement configure son référentiel de matières avant de saisir des cotes.
 * VF-064-01 : L'emploi du temps valide ne dépasse pas 8h par jour.
 * VF-064-03 : Aucun enseignant ne peut avoir 2 cours simultanés.
 */
class SchedulingService {
    /**
     * Crée la configuration pédagogique d'une classe à partir du référentiel officiel RDC.
     */
    configureClass(params) {
        const disciplines = params.disciplines.map(d => ({
            ...d,
            disciplineId: `DISC-${d.code}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`
        }));
        // Calcul du total des maxima (avec coefficients) — base de la formule RDC
        const totalMaximaAnnuel = disciplines.reduce((acc, d) => acc + (d.pointsMaxima * d.coefficient), 0);
        const totalMaximaSemestriel = Math.round(totalMaximaAnnuel / 2);
        return {
            classId: `CLS-${crypto.randomUUID()}`,
            schoolId: params.schoolId,
            name: params.name,
            level: params.level,
            filiere: params.filiere,
            maxStudents: params.maxStudents || 50,
            disciplines,
            totalMaximaAnnuel,
            totalMaximaSemestriel
        };
    }
    /**
     * Génère et valide un emploi du temps hebdomadaire.
     * VF-064-01 : Max 8h/jour. VF-064-03 : Pas de double affectation enseignant.
     */
    validateSchedule(classId, schoolId, academicYear, slots) {
        const errors = [];
        // VF-064-01 : Vérification du maximum de 8h par jour
        const hoursByDay = new Map();
        for (const slot of slots) {
            const [sh, sm] = slot.startTime.split(':').map(Number);
            const [eh, em] = slot.endTime.split(':').map(Number);
            const duration = (eh * 60 + em - (sh * 60 + sm)) / 60;
            hoursByDay.set(slot.dayOfWeek, (hoursByDay.get(slot.dayOfWeek) || 0) + duration);
        }
        for (const [day, hours] of hoursByDay) {
            if (hours > 8)
                errors.push(`VF-064-01: ${day} dépasse 8h de cours (${hours.toFixed(1)}h).`);
        }
        // VF-064-03 : Détection des conflits horaires par enseignant
        const teacherSlots = new Map();
        for (const slot of slots) {
            if (!teacherSlots.has(slot.teacherId))
                teacherSlots.set(slot.teacherId, []);
            teacherSlots.get(slot.teacherId).push(slot);
        }
        for (const [teacherId, tSlots] of teacherSlots) {
            for (let i = 0; i < tSlots.length; i++) {
                for (let j = i + 1; j < tSlots.length; j++) {
                    const a = tSlots[i], b = tSlots[j];
                    if (a.dayOfWeek === b.dayOfWeek && a.startTime < b.endTime && b.startTime < a.endTime) {
                        errors.push(`VF-064-03: Conflit de l'enseignant ${teacherId} le ${a.dayOfWeek} (${a.startTime}-${a.endTime} vs ${b.startTime}-${b.endTime}).`);
                    }
                }
            }
        }
        const totalHoursPerWeek = Array.from(hoursByDay.values()).reduce((a, b) => a + b, 0);
        return {
            scheduleId: `SCH-${crypto.randomUUID()}`,
            classId, schoolId, academicYear, slots,
            totalHoursPerWeek: Math.round(totalHoursPerWeek * 10) / 10,
            isValid: errors.length === 0,
            validationErrors: errors
        };
    }
}
exports.SchedulingService = SchedulingService;
