export type UserRole = 'SUPER_ADMIN' | 'DIRECTEUR' | 'PREFET' | 'ENSEIGNANT' | 'COMPTABLE' | 'CAISSIER' | 'ELEVE_AFFILIE' | 'APPRENANT_INDEPENDANT' | 'PARENT' | 'INSPECTEUR';
export interface School {
    schoolId: string;
    name: string;
    codeNationalEPST?: string;
    province: string;
    city: string;
    address: string;
    directorName: string;
    phoneNumber: string;
    email: string;
    isPilot: boolean;
    createdAtUTC: string;
}
export interface StudentProfile {
    studentId: string;
    iune: string;
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    birthDate: string;
    schoolId?: string;
    classId?: string;
    isIndependent: boolean;
    parentPhone?: string;
    enrollmentDateUTC: string;
}
export interface AttendanceEntry {
    attendanceId: string;
    schoolId: string;
    classId: string;
    studentId: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';
    markedByTeacherId: string;
    timestampUTC: string;
    parentNotified: boolean;
}
export interface FinancialReceipt {
    receiptId: string;
    schoolId: string;
    studentId: string;
    amount: number;
    currency: 'USD' | 'CDF';
    feeType: 'MINERVAL' | 'INSCRIPTION' | 'EXAMEN' | 'CERTIFICAT';
    paymentChannel: 'MPESA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'CASH';
    externalTransactionRef?: string;
    recordedByCashierId: string;
    timestampUTC: string;
    receiptNumber: string;
}
export interface AuditLog {
    logId: string;
    operatorId: string;
    operatorRole: UserRole;
    action: string;
    targetCollection: string;
    targetDocumentId: string;
    beforePayloadHash?: string;
    afterPayloadHash?: string;
    timestampUTC: string;
    ipAddressHash: string;
}
