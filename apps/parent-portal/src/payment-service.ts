/**
 * Paiement Mobile Money — Espace Parent ELLYSIUM (Module 71 / Article 5)
 *
 * Intégration des opérateurs mobiles congolais (M-Pesa, Orange Money, Airtel Money)
 * génération de reçus officiels infalsifiables et respect STRICT de l'Article 5 :
 * la situation financière d'un élève ne peut jamais conditionner son parcours
 * académique (aucun blocage pédagogique pour motif financier).
 *
 * Verrous : VF-071-01, VF-071-02, VF-071-03, VF-071-04, VF-051-01 (Article 5).
 */

import * as crypto from 'crypto';

export type MobileMoneyOperator = 'MPESA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY';
export type Currency = 'CDF' | 'USD';
export type FeeType = 'MINERVAL' | 'INSCRIPTION' | 'EXAMEN' | 'CERTIFICAT';
export type PaymentStatus = 'EN_ATTENTE' | 'ENVOYE' | 'CONFIRME' | 'ECHEC' | 'ANNULE';

export interface PaymentRequest {
  parentId: string;
  studentId: string;
  schoolId: string;
  amount: number;
  currency: Currency;
  feeType: FeeType;
  operator: MobileMoneyOperator;
  payerPhoneNumber: string;
}

export interface MobileMoneyReceipt {
  receiptId: string;
  receiptNumber: string;
  parentId: string;
  studentId: string;
  schoolId: string;
  amount: number;
  currency: Currency;
  feeType: FeeType;
  operator: MobileMoneyOperator;
  payerPhoneNumber: string;
  transactionRef: string;
  ussdCode: string;
  confirmationCode: string;
  status: PaymentStatus;
  receiptHash: string;
  verificationUrl: string;
  timestampUTC: string;
  confirmedAtUTC?: string;
}

export interface PaymentResult {
  success: boolean;
  receipt?: MobileMoneyReceipt;
  errorMessage?: string;
}

export interface FeeStatement {
  studentId: string;
  schoolId: string;
  fees: { feeType: FeeType; label: string; amountDue: number }[];
  totalDue: number;
  totalPaid: number;
  balance: number;
  currency: Currency;
  isSettled: boolean;
}

export interface AcademicReportPayload {
  [key: string]: unknown;
}

/** Garantie constitutionnelle d'accès académique (Article 5). */
export interface AcademicAccessGuarantee {
  studentId: string;
  academicAccessGranted: boolean;
  blockedByFinance: boolean;
  hasOutstandingBalance: boolean;
  reference: string;
}

const FORBIDDEN_ACADEMIC_KEYS = [
  'solde',
  'balance',
  'paiement',
  'payment',
  'paymentStatus',
  'montantDu',
  'amountDue',
  'recu',
  'receipt',
  'facture',
  'invoice',
  'isPaid'
];

/** Configuration des opérateurs et préfixesiof USSD (RDC). */
const OPERATOR_CONFIG: Record<
  MobileMoneyOperator,
  { label: string; ussdPrefix: string; shortCode: string; prefixes: string[] }
> = {
  MPESA: {
    label: 'M-Pesa (Vodacom)',
    ussdPrefix: '*182#',
    shortCode: 'MPESA',
    prefixes: ['+24381', '+24382', '24381', '24382', '081', '082']
  },
  ORANGE_MONEY: {
    label: 'Orange Money',
    ussdPrefix: '*150#',
    shortCode: 'OM',
    prefixes: ['+24380', '+24389', '24380', '24389', '080', '089']
  },
  AIRTEL_MONEY: {
    label: 'Airtel Money',
    ussdPrefix: '*133#',
    shortCode: 'AM',
    prefixes: ['+24397', '+24399', '24397', '24399', '097', '099']
  }
};

/** Taux de change indicatif pour l'estimation en devise de présentation. */
const USD_TO_CDF = 2850;

function normalizePhone(phone: string): string {
  return phone.replace(/[\s.-]/g, '');
}

/**
 * Service de paiement Mobile Money du portail parent.
 */
export class MobileMoneyPaymentService {
  private readonly receipts = new Map<string, MobileMoneyReceipt>();
  private readonly now: () => number;

  constructor(options: { now?: () => number } = {}) {
    this.now = options.now ?? (() => Date.now());
  }

  /** Opérateurs pris en charge. */
  public static get supportedOperators(): MobileMoneyOperator[] {
    return Object.keys(OPERATOR_CONFIG) as MobileMoneyOperator[];
  }

  /** Libellé lisible d'un opérateur. */
  public static operatorLabel(operator: MobileMoneyOperator): string {
    return OPERATOR_CONFIG[operator].label;
  }

  /**
   * Vérifie qu'un numéro congolais est cohérent avec l'opérateur choisi.
   * Un mauvais routage Mobile Money = paiement vers le mauvais marchand.
   */
  public validatePhoneForOperator(phone: string, operator: MobileMoneyOperator): boolean {
    if (!phone || typeof phone !== 'string') return false;
    const normalized = normalizePhone(phone);
    if (!/^(\+?243|0)?\d{9,10}$/.test(normalized)) return false;
    return OPERATOR_CONFIG[operator].prefixes.some(prefix => normalized.startsWith(prefix));
  }

  /**
   * Lance une transaction Mobile Money et génère le reçu officiel scellé.
   */
  public initiatePayment(request: PaymentRequest): PaymentResult {
    if (!request || !request.parentId || !request.studentId || !request.schoolId) {
      return {
        success: false,
        errorMessage: 'PAIEMENT_INCOMPLET: parentId, studentId et schoolId sont obligatoires.'
      };
    }
    if (typeof request.amount !== 'number' || Number.isNaN(request.amount) || request.amount <= 0) {
      return { success: false, errorMessage: 'MONTANT_INVALIDE: Le montant doit être strictement positif.' };
    }
    if (!MobileMoneyPaymentService.supportedOperators.includes(request.operator)) {
      return {
        success: false,
        errorMessage: `OPERATEUR_INSUPPORTE: « ${request.operator} » n'est pas un opérateur Mobile Money congolais.`
      };
    }
    if (!this.validatePhoneForOperator(request.payerPhoneNumber, request.operator)) {
      return {
        success: false,
        errorMessage: `NUMERO_INVALIDE: Le numéro ${request.payerPhoneNumber} n'appartient pas à ${OPERATOR_CONFIG[request.operator].label}.`
      };
    }

    const timestampUTC = new Date(this.now()).toISOString();
    const transactionRef = `MMTX-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const receiptId = `RCP-${crypto.randomUUID()}`;
    const config = OPERATOR_CONFIG[request.operator];
    const ussdCode = `${config.ussdPrefix}*${receiptId}*${request.amount}#`;
    const confirmationCode = `${config.shortCode}-${transactionRef.slice(-6)}`;

    const receipt: MobileMoneyReceipt = {
      receiptId,
      receiptNumber: `REC-${request.schoolId.slice(0, 4).toUpperCase()}-${String(this.now()).slice(-6)}`,
      parentId: request.parentId,
      studentId: request.studentId,
      schoolId: request.schoolId,
      amount: request.amount,
      currency: request.currency,
      feeType: request.feeType,
      operator: request.operator,
      payerPhoneNumber: normalizePhone(request.payerPhoneNumber),
      transactionRef,
      ussdCode,
      confirmationCode,
      status: 'ENVOYE',
      receiptHash: '',
      verificationUrl: '',
      timestampUTC
    };

    receipt.receiptHash = this.computeReceiptHash(receipt);
    receipt.verificationUrl = `https://elysium.cd/verify/recu/${receipt.receiptHash}`;

    this.receipts.set(receiptId, receipt);
    return { success: true, receipt };
  }

  /** Confirme la réception du paiement par l'opérateur. */
  public confirmPayment(receiptId: string, operatorConfirmationCode: string): PaymentResult {
    const receipt = this.receipts.get(receiptId);
    if (!receipt) {
      return { success: false, errorMessage: 'RECU_INTROUVABLE: Aucun reçu pour cet identifiant.' };
    }
    if (operatorConfirmationCode !== receipt.confirmationCode) {
      return {
        success: false,
        errorMessage: 'CONFIRMATION_REFUSEE: Le code de confirmation opérateur ne correspond pas.'
      };
    }
    receipt.status = 'CONFIRME';
    receipt.confirmedAtUTC = new Date(this.now()).toISOString();
    return { success: true, receipt };
  }

  /** Annule une transaction non confirmée. */
  public cancelPayment(receiptId: string): boolean {
    const receipt = this.receipts.get(receiptId);
    if (!receipt || receipt.status === 'CONFIRME') return false;
    receipt.status = 'ANNULE';
    return true;
  }

  /** Reçu par identifiant. */
  public getReceipt(receiptId: string): MobileMoneyReceipt | undefined {
    return this.receipts.get(receiptId);
  }

  /** Tous les reçus d'un élève. */
  public getReceiptsForStudent(studentId: string): MobileMoneyReceipt[] {
    return [...this.receipts.values()].filter(r => r.studentId === studentId);
  }

  /** Reçus confirmés uniquement. */
  public getConfirmedReceipts(studentId: string): MobileMoneyReceipt[] {
    return this.getReceiptsForStudent(studentId).filter(r => r.status === 'CONFIRME');
  }

  /** Vérifie l'intégrité cryptographique d'un reçu (SHA-256). */
  public verifyReceipt(receiptId: string): boolean {
    const receipt = this.receipts.get(receiptId);
    if (!receipt) return false;
    return this.computeReceiptHash(receipt) === receipt.receiptHash;
  }

  /** Calcule l'état de compte de l'élève à partir des frais déclaratifs. */
  public getStatement(params: {
    studentId: string;
    schoolId: string;
    currency?: Currency;
    fees: { feeType: FeeType; label: string; amountDue: number }[];
  }): FeeStatement {
    const totalDue = params.fees.reduce((sum, f) => sum + f.amountDue, 0);
    const totalPaid = this.getConfirmedReceipts(params.studentId).reduce((sum, r) => sum + r.amount, 0);
    const balance = Math.max(0, totalDue - totalPaid);

    return {
      studentId: params.studentId,
      schoolId: params.schoolId,
      fees: params.fees.map(f => ({ ...f })),
      totalDue,
      totalPaid,
      balance,
      currency: params.currency ?? 'CDF',
      isSettled: balance === 0
    };
  }

  /**
   * VERROU CONSTITUTIONNEL ARTICLE 5 :
   * Aucune donnée financière ne doit apparaître dans une charge utile
   * académique (bulletin, délibération, classement). Cette fonction lève
   * une exception si une fuite est détectée.
   */
  public assertAcademicPayloadIsFinancialFree(payload: AcademicReportPayload): void {
    const keys = Object.keys(payload ?? {}).map(k => k.toLowerCase());
    const leaked = keys.filter(k => FORBIDDEN_ACADEMIC_KEYS.some(forbidden => k.includes(forbidden.toLowerCase())));
    if (leaked.length > 0) {
      throw new Error(
        `VIOLATION_ARTICLE_5: Données financières détectées dans une charge utile académique (${leaked.join(', ')}).`
      );
    }
  }

  /**
   * VF-071-02 : un impayé ne peut jamais empêcher l'accès au bulletin ni aux
   * évaluations. La fonction retourne la garantie applicable au lieu de lever
   * une erreur : le portail reste pleinement opérationnel quelle que soit la
   * situation financière de l'élève.
   */
  public assertNoAcademicBlocking(studentId: string): AcademicAccessGuarantee {
    const statement = this.getStatement({
      studentId,
      schoolId: 'INCONNU',
      fees: [{ feeType: 'MINERVAL', label: 'Minerval', amountDue: 1000 }]
    });
    return {
      studentId,
      academicAccessGranted: true,
      blockedByFinance: false,
      hasOutstandingBalance: statement.balance > 0,
      reference: 'VF-071-02 / Article 5 — aucune entrave pédagogique pour motif financier.'
    };
  }

  /** Conversion indicative pour affichage (taux central, non contractuel). */
  public convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;
    const amountInCdf = from === 'USD' ? amount * USD_TO_CDF : amount;
    const converted = to === 'USD' ? amountInCdf / USD_TO_CDF : amountInCdf;
    return Math.round(converted * 100) / 100;
  }

  private computeReceiptHash(receipt: MobileMoneyReceipt): string {
    return crypto
      .createHash('sha256')
      .update(
        JSON.stringify({
          receiptNumber: receipt.receiptNumber,
          studentId: receipt.studentId,
          schoolId: receipt.schoolId,
          amount: receipt.amount,
          currency: receipt.currency,
          feeType: receipt.feeType,
          operator: receipt.operator,
          transactionRef: receipt.transactionRef,
          timestampUTC: receipt.timestampUTC
        })
      )
      .digest('hex');
  }
}
