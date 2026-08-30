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

  test('observeHttpRequest increments counter and histogram without path labels', async () => {
    const metrics = new WahaMetrics(true);
    metrics.observeHttpRequest('get', 200, 0.02);
    metrics.observeHttpRequest('POST', 500, 0.4);
    const body = await metrics.render();
    expect(body).toContain('waha_http_requests_total{method="GET",status="200"} 1');
    expect(body).toContain('waha_http_requests_total{method="POST",status="500"} 1');
    expect(body).toContain('waha_http_request_duration_seconds_bucket');
    expect(body).not.toContain('chatId');
    expect(body).not.toContain('path=');
  });

  test('observeHttpRequest is a no-op when disabled', async () => {
    const metrics = new WahaMetrics(false);
    metrics.observeHttpRequest('GET', 200, 0.01);
    const body = await metrics.render();
    expect(body).not.toContain('waha_http_requests_total');
  });

  test('setSessionCounts writes status and engine labels and resets', async () => {
    const metrics = new WahaMetrics(true);
    metrics.setSessionCounts([
      { status: 'WORKING', engine: 'GOWS' },
      { status: 'WORKING', engine: 'GOWS' },
      { status: 'FAILED', engine: 'WEBJS' },
    ]);
    let body = await metrics.render();
    expect(body).toContain('waha_sessions{status="WORKING",engine="GOWS"} 2');
    expect(body).toContain('waha_sessions{status="FAILED",engine="WEBJS"} 1');
    metrics.setSessionCounts([{ status: 'WORKING', engine: 'GOWS' }]);
    body = await metrics.render();
    expect(body).toContain('waha_sessions{status="WORKING",engine="GOWS"} 1');
    expect(body).not.toContain('waha_sessions{status="FAILED",engine="WEBJS"}');
  });

  test('observeMessage counts in and out only', async () => {
    const metrics = new WahaMetrics(true);
    metrics.observeMessage('in');
    metrics.observeMessage('in');
    metrics.observeMessage('out');
    const body = await metrics.render();
    expect(body).toContain('waha_messages_total{direction="in"} 2');
    expect(body).toContain('waha_messages_total{direction="out"} 1');
    expect(body).not.toContain('chatId');
  });
});
