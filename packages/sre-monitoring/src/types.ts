export interface HttpRequestMetric {
  route: string;
  method: string;
  statusCode: number;
  durationMs: number;
  timestampUTC: string;
}

export interface ServiceHealthStatus {
  serviceName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'OUTAGE';
  uptimePercentage: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRatePercentage: number;
  sloTargetMet: boolean;        // SLO : 99.9% disponibilité, P95 < 500ms
  activeAlerts: string[];
}

export interface AlertRule {
  ruleId: string;
  name: string;
  condition: 'ERROR_RATE_HIGH' | 'LATENCY_P95_HIGH' | 'AVAILABILITY_LOW';
  threshold: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}
