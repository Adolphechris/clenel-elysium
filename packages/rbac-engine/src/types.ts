/**
 * Rôles officiels de la plateforme ELLYSIUM
 * Hiérarchie stricte : SUPER_ADMIN > ADMIN_RESEAU > DIRECTEUR > PREFET > ENSEIGNANT > ELEVE > PARENT
 */
export type UserRole =
  | 'SUPER_ADMIN'       // CNEL — accès lecture totale, pas d'écriture pédagogique
  | 'ADMIN_RESEAU'      // Réseau d'écoles : gère les établissements du réseau
  | 'DIRECTEUR'         // Etablissement : tous les modules sauf Article 5 financier
  | 'PREFET_ETUDES'     // Délibérations, bulletins, transferts
  | 'TITULAIRE'         // Enseignant titulaire de classe
  | 'ENSEIGNANT'        // Saisie des cotes de ses disciplines uniquement
  | 'COMPTABLE'         // Article 5 : caisse, paiements, reçus — JAMAIS pédagogie
  | 'ELEVE'             // Ses propres données uniquement
  | 'PARENT';           // Données de ses enfants uniquement

export type Resource =
  | 'grades'            // Cotes
  | 'report_cards'      // Bulletins
  | 'deliberations'     // Délibérations
  | 'attendance'        // Présences
  | 'students'          // Dossiers élèves
  | 'finances'          // Données financières (Article 5 — accès restreint)
  | 'audit_logs'        // Journal d'audit
  | 'admin_config'      // Configuration établissement
  | 'diplomas'          // Diplômes et registre
  | 'homeworks'         // Devoirs
  | 'notifications'     // Notifications
  | 'ai_tutor';         // Tuteur IA

export type Action = 'READ' | 'WRITE' | 'DELETE' | 'PUBLISH' | 'SEAL';

export interface AccessRequest {
  requesterId: string;
  requesterRole: UserRole;
  requesterSchoolId: string;
  targetSchoolId: string;   // L'établissement cible (pour le cloisonnement inter-écoles)
  resource: Resource;
  action: Action;
  targetOwnerId?: string;   // Propriétaire de la donnée (pour ABAC élève/parent)
}

export interface AccessDecision {
  granted: boolean;
  reason: string;
  httpStatus: 200 | 403 | 404;
}
