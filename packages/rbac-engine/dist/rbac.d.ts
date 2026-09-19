import { AccessRequest, AccessDecision } from './types';
export declare class RbacEngine {
    /**
     * Évalue une demande d'accès et retourne la décision.
     */
    evaluate(request: AccessRequest): AccessDecision;
}
