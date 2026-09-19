/**
 * Journal d'Audit Immuable — Structure Merkle Append-Only
 * VF-155-03 : Append-only Event Store pour l'historique académique
 * VF-155-04 : Hash cryptographique de chaque événement (SHA-256 chaîné)
 * VF-135-03 : Rétention des journaux pendant 3 ans minimum
 */
export type AuditAction = 'STUDENT_ENROLLED' | 'GRADE_SUBMITTED' | 'GRADE_MODIFIED' | 'REPORT_CARD_GENERATED' | 'DIPLOMA_ISSUED' | 'PAYMENT_RECORDED' | 'USER_ROLE_CHANGED' | 'ATTENDANCE_MARKED' | 'STUDENT_TRANSFERRED' | 'DELIBERATION_SEALED';
export interface AuditEvent {
    eventId: string;
    action: AuditAction;
    operatorId: string;
    operatorRole: string;
    targetId: string;
    targetType: string;
    payload: Record<string, unknown>;
    previousHash: string;
    eventHash: string;
    timestampUTC: string;
}
export declare class ImmutableAuditTrail {
    private events;
    private lastHash;
    /**
     * Ajoute un événement immuable dans le journal.
     * Impossible de modifier ou supprimer (append-only).
     */
    log(action: AuditAction, operatorId: string, operatorRole: string, targetId: string, targetType: string, payload: Record<string, unknown>): AuditEvent;
    /**
     * Vérifie l'intégrité de la chaîne d'événements.
     * VF-155-05 : Audit automatisé mensuel détectant toute rupture dans la chaîne.
     */
    verifyChainIntegrity(): {
        isValid: boolean;
        brokenAtIndex?: number;
    };
    getEvents(): ReadonlyArray<AuditEvent>;
    getEventCount(): number;
}
