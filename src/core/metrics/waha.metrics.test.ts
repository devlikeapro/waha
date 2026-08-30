import { WahaMetrics } from '@waha/core/metrics/waha.metrics';

describe('WahaMetrics', () => {
  test('when enabled exposes waha_up and process cpu', async () => {
    const metrics = new WahaMetrics(true);
    expect(metrics.isEnabled).toBe(true);
    const body = await metrics.render();
    expect(body).toMatch(/waha_up(?:\{[^}]*\})? 1/);
    expect(body).toContain('waha_process_cpu_user_seconds_total');
  });

  test('when disabled does not expose waha_up', async () => {
    const metrics = new WahaMetrics(false);
    expect(metrics.isEnabled).toBe(false);
    const body = await metrics.render();
    expect(body).not.toMatch(/waha_up(?:\{[^}]*\})? 1/);
  });
});
