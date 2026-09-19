"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SreMonitoringService = void 0;
/**
 * Moteur d'Observabilité SRE ELLYSIUM — Tome 13
 * VF-225-01 : Disponibilité globale de production ciblée à 99.9% (SLO officiel).
 * VF-225-02 : Latence P95 sur les délibérations et requêtes critiques < 500ms.
 * VF-225-03 : Alerte immédiate si le taux d'erreur 5xx dépasse 1.0% sur 5 minutes.
 */
class SreMonitoringService {
    metrics = [];
    serviceName;
    constructor(serviceName = 'api-gateway') {
        this.serviceName = serviceName;
    }
    /**
     * Enregistre une métrique de requête HTTP.
     */
    recordRequest(metric) {
        this.metrics.push(metric);
    }
    /**
     * Calcule le statut de santé du service et les indicateurs SLI/SLO.
     */
    evaluateHealth() {
        const totalRequests = this.metrics.length;
        if (totalRequests === 0) {
            return {
                serviceName: this.serviceName,
                status: 'HEALTHY',
                uptimePercentage: 100.0,
                p95LatencyMs: 0,
                p99LatencyMs: 0,
                errorRatePercentage: 0,
                sloTargetMet: true,
                activeAlerts: []
            };
        }
        // Calcul des erreurs (5xx)
        const errorRequests = this.metrics.filter(m => m.statusCode >= 500).length;
        const errorRatePercentage = Math.round((errorRequests / totalRequests) * 10000) / 100;
        const uptimePercentage = Math.round((100 - errorRatePercentage) * 100) / 100;
        // Calcul des percentiles de latence (P95, P99)
        const sortedDurations = [...this.metrics.map(m => m.durationMs)].sort((a, b) => a - b);
        const p95Index = Math.min(Math.floor(totalRequests * 0.95), totalRequests - 1);
        const p99Index = Math.min(Math.floor(totalRequests * 0.99), totalRequests - 1);
        const p95LatencyMs = sortedDurations[p95Index];
        const p99LatencyMs = sortedDurations[p99Index];
        // Vérification des SLO officiels (VF-225-01, VF-225-02, VF-225-03)
        const activeAlerts = [];
        if (uptimePercentage < 99.9) {
            activeAlerts.push(`SLO_BREACH: Disponibilité à ${uptimePercentage}% en dessous de la cible contractuelle 99.9% (VF-225-01)`);
        }
        if (p95LatencyMs > 500) {
            activeAlerts.push(`SLO_BREACH: Latence P95 à ${p95LatencyMs}ms supérieure au seuil max de 500ms (VF-225-02)`);
        }
        if (errorRatePercentage > 1.0) {
            activeAlerts.push(`ALERT_CRITICAL: Taux d'erreurs 5xx à ${errorRatePercentage}% > seuil 1.0% (VF-225-03)`);
        }
        let status = 'HEALTHY';
        if (errorRatePercentage >= 5.0 || uptimePercentage < 95.0) {
            status = 'OUTAGE';
        }
        else if (activeAlerts.length > 0) {
            status = 'DEGRADED';
        }
        return {
            serviceName: this.serviceName,
            status,
            uptimePercentage,
            p95LatencyMs,
            p99LatencyMs,
            errorRatePercentage,
            sloTargetMet: activeAlerts.length === 0,
            activeAlerts
        };
    }
    resetMetrics() {
        this.metrics = [];
    }
}
exports.SreMonitoringService = SreMonitoringService;
