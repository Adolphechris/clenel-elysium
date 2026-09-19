const test = require('node:test');
const assert = require('node:assert');
const { SreMonitoringService } = require('../dist/monitoring');

test('SRE Monitoring: Healthy service meets 99.9% SLO (VF-225-01/02)', () => {
  const sre = new SreMonitoringService('cnel-elysium-api');

  // 1 000 requêtes normales (latence 10-50ms, 200 OK)
  for (let i = 0; i < 1000; i++) {
    sre.recordRequest({
      route: '/api/deliberations',
      method: 'POST',
      statusCode: 200,
      durationMs: 15 + (i % 20),
      timestampUTC: new Date().toISOString()
    });
  }

  const health = sre.evaluateHealth();
  assert.strictEqual(health.status, 'HEALTHY');
  assert.strictEqual(health.uptimePercentage, 100.0);
  assert.strictEqual(health.errorRatePercentage, 0.0);
  assert.strictEqual(health.sloTargetMet, true);
  assert.strictEqual(health.activeAlerts.length, 0);
  assert.strictEqual(health.p95LatencyMs < 100, true);
});

test('SRE Monitoring: Triggers alert when 5xx error rate exceeds 1% (VF-225-03)', () => {
  const sre = new SreMonitoringService('cnel-elysium-api');

  // 95 requêtes OK, 5 erreurs 500 (taux d'erreur 5%)
  for (let i = 0; i < 95; i++) {
    sre.recordRequest({
      route: '/api/report-cards/generate',
      method: 'POST',
      statusCode: 200,
      durationMs: 40,
      timestampUTC: new Date().toISOString()
    });
  }
  for (let i = 0; i < 5; i++) {
    sre.recordRequest({
      route: '/api/report-cards/generate',
      method: 'POST',
      statusCode: 500,
      durationMs: 45,
      timestampUTC: new Date().toISOString()
    });
  }

  const health = sre.evaluateHealth();
  assert.strictEqual(health.errorRatePercentage, 5.0);
  assert.strictEqual(health.sloTargetMet, false);
  assert.strictEqual(health.activeAlerts.some(a => a.includes('VF-225-03')), true);
});

test('SRE Monitoring: Detects high P95 latency violation (> 500ms - VF-225-02)', () => {
  const sre = new SreMonitoringService('cnel-elysium-api');

  // 90 requêtes rapides (20ms) et 10 requêtes très lentes (800ms) -> P95 > 500ms
  for (let i = 0; i < 90; i++) {
    sre.recordRequest({ route: '/api/health', method: 'GET', statusCode: 200, durationMs: 20, timestampUTC: new Date().toISOString() });
  }
  for (let i = 0; i < 10; i++) {
    sre.recordRequest({ route: '/api/health', method: 'GET', statusCode: 200, durationMs: 800, timestampUTC: new Date().toISOString() });
  }

  const health = sre.evaluateHealth();
  assert.strictEqual(health.p95LatencyMs, 800);
  assert.strictEqual(health.sloTargetMet, false);
  assert.strictEqual(health.activeAlerts.some(a => a.includes('VF-225-02')), true);
});
