import { FinancialReceipt } from '@elysium/shared-types';
export interface PaymentRequest {
    schoolId: string;
    studentId: string;
    amount: number;
    currency: 'USD' | 'CDF';
    feeType: 'MINERVAL' | 'INSCRIPTION' | 'EXAMEN' | 'CERTIFICAT';
    paymentChannel: 'MPESA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'CASH';
    payerPhoneNumber?: string;
    cashierId: string;
}
export interface PaymentProcessingResult {
    success: boolean;
    receipt?: FinancialReceipt;
    errorMessage?: string;
    transactionRef: string;
}
