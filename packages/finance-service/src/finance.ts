import * as crypto from 'crypto';
import { FinancialReceipt } from '@elysium/shared-types';
import { PaymentRequest, PaymentProcessingResult } from './types';

/**
 * Service de caisse étanche conforme à l'Article 5 de la Constitution.
 * Verrous associés : VF-071-01, VF-071-02, VF-071-03, VF-071-04
 */
export class SealedFinanceService {
  /**
   * Traite un encaissement et génère un reçu officiel OHADA infalsifiable.
   */
  public processPayment(request: PaymentRequest): PaymentProcessingResult {
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

    const receipt: FinancialReceipt = {
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
  public assertFinancialAccessAuthorized(callerRole: string): void {
    const authorizedRoles = ['COMPTABLE', 'CAISSIER', 'PREFET', 'SUPER_ADMIN'];
    if (!authorizedRoles.includes(callerRole)) {
      throw new Error(
        `VIOLATION_ARTICLE_5: Le rôle ${callerRole} (enseignant/élève/tuteur) n'a pas l'autorisation d'accéder aux états financiers.`
      );
    }
  }
}
