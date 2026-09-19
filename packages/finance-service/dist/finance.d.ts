import { PaymentRequest, PaymentProcessingResult } from './types';
/**
 * Service de caisse étanche conforme à l'Article 5 de la Constitution.
 * Verrous associés : VF-071-01, VF-071-02, VF-071-03, VF-071-04
 */
export declare class SealedFinanceService {
    /**
     * Traite un encaissement et génère un reçu officiel OHADA infalsifiable.
     */
    processPayment(request: PaymentRequest): PaymentProcessingResult;
    /**
     * VERROU CONSTITUTIONNEL ARTICLE 5 (VF-071-01) :
     * L'API académique ne doit JAMAIS pouvoir interroger le solde d'un élève.
     * Cette méthode lève une exception bloquante si un rôle non-financier tente d'accéder aux données comptables.
     */
    assertFinancialAccessAuthorized(callerRole: string): void;
}
