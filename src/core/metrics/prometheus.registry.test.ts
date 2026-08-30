import {
  createWahaMetricsRegistry,
  parsePrometheusFlag,
} from '@waha/core/metrics/prometheus.registry';

describe('parsePrometheusFlag', () => {
  test('defaults to false', () => {
    expect(parsePrometheusFlag(undefined)).toBe(false);
    expect(parsePrometheusFlag('')).toBe(false);
  });

  test('accepts true and 1', () => {
    expect(parsePrometheusFlag('true')).toBe(true);
    expect(parsePrometheusFlag('1')).toBe(true);
    expect(parsePrometheusFlag('TRUE')).toBe(true);
  });

  test('rejects other values', () => {
    expect(parsePrometheusFlag('false')).toBe(false);
    expect(parsePrometheusFlag('0')).toBe(false);
    expect(parsePrometheusFlag('yes')).toBe(false);
  });
});

describe('createWahaMetricsRegistry', () => {
  test('exposes waha_up and default process metrics', async () => {
    const register = createWahaMetricsRegistry();
    const body = await register.metrics();
    expect(body).toMatch(/waha_up(?:\{[^}]*\})? 1/);
    expect(body).toContain('waha_process_cpu_user_seconds_total');
  });
});
