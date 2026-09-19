export type TutorRole = 'STUDENT' | 'TEACHER';
export type TutorTopic = 'MATHEMATIQUES' | 'FRANCAIS' | 'SCIENCES' | 'HISTOIRE_GEO' | 'CHIMIE' | 'BIOLOGIE' | 'PHYSIQUE' | 'ANGLAIS' | 'PHILOSOPHIE' | 'EDUCATION_CIVIQUE' | 'GENERAL';
export interface TutorSession {
    sessionId: string;
    userId: string;
    userRole: TutorRole;
    classId: string;
    schoolId: string;
    topic: TutorTopic;
    startedAtUTC: string;
    messages: TutorMessage[];
    questionsAsked: number;
    dailyQuotaRemaining: number;
}
export interface TutorMessage {
    messageId: string;
    role: 'USER' | 'TUTOR';
    content: string;
    timestamp: string;
    isFlagged: boolean;
    flagReason?: string;
}
export interface TutorResponse {
    message: TutorMessage;
    isWithinScope: boolean;
    pedagogicalNote?: string;
}
