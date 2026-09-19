import { HttpRequestMetric, ServiceHealthStatus } from './types';
/**
 * Moteur d'Observabilité SRE ELLYSIUM — Tome 13
 * VF-225-01 : Disponibilité globale de production ciblée à 99.9% (SLO officiel).
 * VF-225-02 : Latence P95 sur les délibérations et requêtes critiques < 500ms.
 * VF-225-03 : Alerte immédiate si le taux d'erreur 5xx dépasse 1.0% sur 5 minutes.
 */
export declare class SreMonitoringService {
    private metrics;
    private serviceName;
    constructor(serviceName?: string);
    /**
     * Enregistre une métrique de requête HTTP.
     */
    recordRequest(metric: HttpRequestMetric): void;
    /**
     * Calcule le statut de santé du service et les indicateurs SLI/SLO.
     */
    evaluateHealth(): ServiceHealthStatus;
    resetMetrics(): void;
}
