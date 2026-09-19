/**
 * Rôles officiels de la plateforme ELLYSIUM
 * Hiérarchie stricte : SUPER_ADMIN > ADMIN_RESEAU > DIRECTEUR > PREFET > ENSEIGNANT > ELEVE > PARENT
 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN_RESEAU' | 'DIRECTEUR' | 'PREFET_ETUDES' | 'TITULAIRE' | 'ENSEIGNANT' | 'COMPTABLE' | 'ELEVE' | 'PARENT';
export type Resource = 'grades' | 'report_cards' | 'deliberations' | 'attendance' | 'students' | 'finances' | 'audit_logs' | 'admin_config' | 'diplomas' | 'homeworks' | 'notifications' | 'ai_tutor';
export type Action = 'READ' | 'WRITE' | 'DELETE' | 'PUBLISH' | 'SEAL';
export interface AccessRequest {
    requesterId: string;
    requesterRole: UserRole;
    requesterSchoolId: string;
    targetSchoolId: string;
    resource: Resource;
    action: Action;
    targetOwnerId?: string;
}
export interface AccessDecision {
    granted: boolean;
    reason: string;
    httpStatus: 200 | 403 | 404;
}
