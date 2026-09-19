export type HomeworkStatus = 'BROUILLON' | 'PUBLIE' | 'CLOS' | 'CORRIGE';
export type SubmissionStatus = 'EN_ATTENTE' | 'SOUMIS' | 'RETARD' | 'CORRIGE' | 'ABSENT';

export interface Homework {
  homeworkId: string;
  classId: string;
  schoolId: string;
  disciplineId: string;
  disciplineName: string;
  teacherId: string;
  title: string;
  instructions: string;
  maxPoints: number;
  dueDateUTC: string;
  publishedAtUTC: string;
  status: HomeworkStatus;
  attachmentUrls?: string[]; // Cloud Storage GCS URLs
}

export interface StudentSubmission {
  submissionId: string;
  homeworkId: string;
  studentId: string;
  content?: string;
  attachmentUrls?: string[];
  submittedAtUTC?: string;
  status: SubmissionStatus;
  grade?: number;
  teacherComment?: string;
  gradedAtUTC?: string;
}
