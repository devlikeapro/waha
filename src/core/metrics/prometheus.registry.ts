import { Gauge, Registry, collectDefaultMetrics } from 'prom-client';

export const WAHA_METRICS_REGISTRY = 'WAHA_METRICS_REGISTRY';

export function prometheusEnabled(): boolean {
  return parsePrometheusFlag(process.env.WAHA_PROMETHEUS_ENABLED);
}

export function parsePrometheusFlag(value: string | undefined): boolean {
  if (value === undefined || value === '') {
    return false;
  }
  const lowered = value.toLowerCase();
  if (lowered === 'true' || lowered === '1') {
    return true;
  }
  if (lowered === 'false' || lowered === '0') {
    return false;
  }
  return false;
}

export function createWahaMetricsRegistry(): Registry {
  const register = new Registry();
  collectDefaultMetrics({
    register: register,
    prefix: 'waha_',
  });
  const up = new Gauge({
    name: 'waha_up',
    help: '1 if the WAHA process is serving Prometheus metrics',
    registers: [register],
  });
  up.set(1);
  return register;
}
