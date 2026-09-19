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
exports.ImmutableAuditTrail = void 0;
const crypto = __importStar(require("crypto"));
class ImmutableAuditTrail {
    events = [];
    lastHash = '0000000000000000000000000000000000000000000000000000000000000000'; // Genesis
    /**
     * Ajoute un événement immuable dans le journal.
     * Impossible de modifier ou supprimer (append-only).
     */
    log(action, operatorId, operatorRole, targetId, targetType, payload) {
        const eventId = `EVT-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
        const timestampUTC = new Date().toISOString();
        const previousHash = this.lastHash;
        // Calcul du hash chaîné (structure Merkle simplifiée)
        const canonical = JSON.stringify({
            eventId,
            action,
            operatorId,
            targetId,
            payload,
            previousHash,
            timestampUTC
        });
        const eventHash = crypto.createHash('sha256').update(canonical).digest('hex');
        const event = {
            eventId,
            action,
            operatorId,
            operatorRole,
            targetId,
            targetType,
            payload,
            previousHash,
            eventHash,
            timestampUTC
        };
        this.events.push(event);
        this.lastHash = eventHash;
        return event;
    }
    /**
     * Vérifie l'intégrité de la chaîne d'événements.
     * VF-155-05 : Audit automatisé mensuel détectant toute rupture dans la chaîne.
     */
    verifyChainIntegrity() {
        let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
        for (let i = 0; i < this.events.length; i++) {
            const event = this.events[i];
            if (event.previousHash !== previousHash) {
                return { isValid: false, brokenAtIndex: i };
            }
            // Recalcul du hash pour vérifier qu'il n'a pas été altéré
            const canonical = JSON.stringify({
                eventId: event.eventId,
                action: event.action,
                operatorId: event.operatorId,
                targetId: event.targetId,
                payload: event.payload,
                previousHash: event.previousHash,
                timestampUTC: event.timestampUTC
            });
            const expectedHash = crypto.createHash('sha256').update(canonical).digest('hex');
            if (event.eventHash !== expectedHash) {
                return { isValid: false, brokenAtIndex: i };
            }
            previousHash = event.eventHash;
        }
        return { isValid: true };
    }
    getEvents() {
        return this.events;
    }
    getEventCount() {
        return this.events.length;
    }
}
exports.ImmutableAuditTrail = ImmutableAuditTrail;
