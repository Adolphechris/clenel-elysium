import { StudentProfile } from '@elysium/shared-types';

export interface AdmissionRequest {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string; // YYYY-MM-DD
  provinceCode: string; // ex: KIN, HKT, NKV
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
