"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacEngine = void 0;
/**
 * Matrice de contrôle d'accès RBAC/ABAC — ELLYSIUM
 * VF-080-01 : Principe du moindre privilège — chaque rôle n'accède qu'à ce dont il a besoin.
 * VF-080-02 : Cloisonnement absolu inter-établissements — aucun accès cross-school sans autorisation.
 * VF-080-03 : Article 5 — les enseignants et élèves ne peuvent jamais accéder aux finances.
 * VF-080-04 : Les élèves et parents ne voient que leurs propres données.
 */
// Matrice de permissions : rôle → ressource → actions autorisées
const PERMISSION_MATRIX = {
    SUPER_ADMIN: {
        grades: ['READ'],
        report_cards: ['READ'],
        deliberations: ['READ'],
        attendance: ['READ'],
        students: ['READ'],
        finances: ['READ'],
        audit_logs: ['READ'],
        admin_config: ['READ', 'WRITE'],
        diplomas: ['READ'],
        homeworks: ['READ'],
        notifications: ['READ'],
        ai_tutor: ['READ']
    },
    ADMIN_RESEAU: {
        grades: ['READ'],
        report_cards: ['READ'],
        deliberations: ['READ'],
        students: ['READ', 'WRITE'],
        admin_config: ['READ', 'WRITE'],
        audit_logs: ['READ'],
        diplomas: ['READ'],
        notifications: ['READ', 'WRITE']
    },
    DIRECTEUR: {
        grades: ['READ'],
        report_cards: ['READ', 'PUBLISH'],
        deliberations: ['READ', 'WRITE', 'SEAL'],
        attendance: ['READ'],
        students: ['READ', 'WRITE', 'DELETE'],
        audit_logs: ['READ'],
        admin_config: ['READ', 'WRITE'],
        diplomas: ['READ', 'PUBLISH'],
        homeworks: ['READ'],
        notifications: ['READ', 'WRITE']
        // finances: intentionnellement absent si DIRECTEUR n'est pas COMPTABLE
    },
    PREFET_ETUDES: {
        grades: ['READ', 'WRITE'],
        report_cards: ['READ', 'WRITE', 'PUBLISH', 'SEAL'],
        deliberations: ['READ', 'WRITE', 'SEAL'],
        attendance: ['READ'],
        students: ['READ', 'WRITE'],
        diplomas: ['READ', 'PUBLISH', 'SEAL'],
        homeworks: ['READ'],
        notifications: ['READ', 'WRITE']
    },
    TITULAIRE: {
        grades: ['READ', 'WRITE'],
        report_cards: ['READ'],
        attendance: ['READ', 'WRITE'],
        students: ['READ'],
        homeworks: ['READ', 'WRITE', 'PUBLISH'],
        notifications: ['WRITE'],
        ai_tutor: ['READ']
    },
    ENSEIGNANT: {
        grades: ['WRITE'], // Saisie seulement pour ses matières
        attendance: ['READ', 'WRITE'],
        homeworks: ['READ', 'WRITE', 'PUBLISH'],
        students: ['READ'], // Lecture uniquement de sa classe
        notifications: ['WRITE'],
        ai_tutor: ['READ']
    },
    COMPTABLE: {
        finances: ['READ', 'WRITE'], // Seul rôle autorisé sur finances
        students: ['READ'], // Pour retrouver un élève (juste le nom/identifiant)
        notifications: ['WRITE'] // Rappels de paiement
    },
    ELEVE: {
        grades: ['READ'], // Ses propres cotes uniquement (ABAC)
        report_cards: ['READ'], // Son propre bulletin
        attendance: ['READ'], // Sa propre assiduité
        homeworks: ['READ', 'WRITE'], // Ses devoirs
        ai_tutor: ['READ', 'WRITE']
    },
    PARENT: {
        grades: ['READ'], // Cotes de ses enfants (ABAC)
        report_cards: ['READ'],
        attendance: ['READ'],
        notifications: ['READ'],
        ai_tutor: ['READ']
    }
};
class RbacEngine {
    /**
     * Évalue une demande d'accès et retourne la décision.
     */
    evaluate(request) {
        // VF-080-02 : Cloisonnement inter-établissements
        // Seul SUPER_ADMIN et ADMIN_RESEAU peuvent accéder à d'autres écoles
        if (request.requesterSchoolId !== request.targetSchoolId) {
            const crossSchoolRoles = ['SUPER_ADMIN', 'ADMIN_RESEAU'];
            if (!crossSchoolRoles.includes(request.requesterRole)) {
                return {
                    granted: false,
                    reason: `INTERDIT_CLOISONNEMENT: Le rôle ${request.requesterRole} ne peut pas accéder aux données d'un autre établissement (VF-080-02).`,
                    httpStatus: 403
                };
            }
        }
        // VF-080-03 : Article 5 — blocage absolu enseignants/élèves sur finances
        if (request.resource === 'finances') {
            const forbiddenRoles = ['ENSEIGNANT', 'TITULAIRE', 'ELEVE', 'PARENT', 'PREFET_ETUDES'];
            if (forbiddenRoles.includes(request.requesterRole)) {
                return {
                    granted: false,
                    reason: `FORBIDDEN_ARTICLE_5: Le rôle ${request.requesterRole} n'a aucun droit sur les données financières. Constitution ELLYSIUM Art. 5.`,
                    httpStatus: 403
                };
            }
        }
        // VF-080-04 : ABAC pour élèves et parents (accès uniquement à leurs propres données)
        if (['ELEVE', 'PARENT'].includes(request.requesterRole) && request.targetOwnerId) {
            if (request.targetOwnerId !== request.requesterId) {
                return {
                    granted: false,
                    reason: `FORBIDDEN_ABAC: ${request.requesterRole} ne peut accéder qu'à ses propres données (VF-080-04).`,
                    httpStatus: 403
                };
            }
        }
        // Vérification RBAC de la matrice
        const permissions = PERMISSION_MATRIX[request.requesterRole];
        const allowedActions = permissions[request.resource];
        if (!allowedActions || !allowedActions.includes(request.action)) {
            return {
                granted: false,
                reason: `INSUFFISANT: Le rôle ${request.requesterRole} n'a pas la permission ${request.action} sur ${request.resource}.`,
                httpStatus: 403
            };
        }
        return {
            granted: true,
            reason: `AUTORISE: ${request.requesterRole} peut effectuer ${request.action} sur ${request.resource}.`,
            httpStatus: 200
        };
    }
}
exports.RbacEngine = RbacEngine;
