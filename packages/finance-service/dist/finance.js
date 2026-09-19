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
exports.SealedFinanceService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Service de caisse étanche conforme à l'Article 5 de la Constitution.
 * Verrous associés : VF-071-01, VF-071-02, VF-071-03, VF-071-04
 */
class SealedFinanceService {
    /**
     * Traite un encaissement et génère un reçu officiel OHADA infalsifiable.
     */
    processPayment(request) {
        if (request.amount <= 0) {
            return {
                success: false,
                transactionRef: 'NONE',
                errorMessage: 'MONTANT_INVALIDE: Le montant doit être strictement positif.'
            };
        }
        const timestampUTC = new Date().toISOString();
        const transactionRef = `TX-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const receiptNumber = `REC-${request.schoolId.slice(0, 4)}-${Date.now().toString().slice(-6)}`;
        const receipt = {
            receiptId: `RCP-${crypto.randomUUID()}`,
            schoolId: request.schoolId,
            studentId: request.studentId,
            amount: request.amount,
            currency: request.currency,
            feeType: request.feeType,
            paymentChannel: request.paymentChannel,
            externalTransactionRef: transactionRef,
            recordedByCashierId: request.cashierId,
            timestampUTC,
            receiptNumber
        };
        return {
            success: true,
            receipt,
            transactionRef
        };
    }
    /**
     * VERROU CONSTITUTIONNEL ARTICLE 5 (VF-071-01) :
     * L'API académique ne doit JAMAIS pouvoir interroger le solde d'un élève.
     * Cette méthode lève une exception bloquante si un rôle non-financier tente d'accéder aux données comptables.
     */
    assertFinancialAccessAuthorized(callerRole) {
        const authorizedRoles = ['COMPTABLE', 'CAISSIER', 'PREFET', 'SUPER_ADMIN'];
        if (!authorizedRoles.includes(callerRole)) {
            throw new Error(`VIOLATION_ARTICLE_5: Le rôle ${callerRole} (enseignant/élève/tuteur) n'a pas l'autorisation d'accéder aux états financiers.`);
        }
    }
}
exports.SealedFinanceService = SealedFinanceService;
