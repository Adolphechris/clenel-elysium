export interface AdmissionRequest {
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    birthDate: string;
    provinceCode: string;
    schoolId?: string;
    classId?: string;
    isIndependent: boolean;
    parentPhone?: string;
}
export interface StudentTransferRecord {
    transferId: string;
    studentId: string;
    fromSchoolId: string;
    toSchoolId: string;
    reason: string;
    approvedByPrefetId: string;
    timestampUTC: string;
}
