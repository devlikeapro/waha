import {
  isMetricsPath,
  WAHA_METRICS_PATH,
  WAHA_METRICS_PREFIX,
} from '@waha/core/metrics/prometheus.registry';

describe('isMetricsPath', () => {
  test('matches the scrape path', () => {
    expect(WAHA_METRICS_PATH).toBe('/metrics');
    expect(WAHA_METRICS_PREFIX).toBe('waha_');
    expect(isMetricsPath('/metrics')).toBe(true);
    expect(isMetricsPath('/metrics?foo=1')).toBe(true);
    expect(isMetricsPath('/ping')).toBe(false);
    expect(isMetricsPath('/api/sessions')).toBe(false);
  });
});
