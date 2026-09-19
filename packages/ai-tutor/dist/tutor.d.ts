import { TutorSession, TutorResponse, TutorRole, TutorTopic } from './types';
export declare class AiTutorService {
    private sessions;
    private dailyUsage;
    /**
     * Démarre une session de tutorat.
     */
    startSession(params: {
        userId: string;
        userRole: TutorRole;
        classId: string;
        schoolId: string;
        topic: TutorTopic;
    }): TutorSession;
    /**
     * Traite une question de l'élève et génère une réponse simulée (stub Vertex AI).
     * En production: appel à Vertex AI Gemini Pro via @google-cloud/vertexai.
     * VF-074-02 : Quota DAILY_QUOTA questions/élève/jour.
     */
    askQuestion(sessionId: string, question: string): Promise<TutorResponse>;
    /**
     * Génère une réponse pédagogique de stub.
     * Production: remplacer par l'appel réel @google-cloud/vertexai avec gemini-2.5-flash-002
     */
    private generateStubResponse;
    getSession(sessionId: string): TutorSession | undefined;
}
