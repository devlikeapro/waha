import { WAHAEngine, WAHASessionStatus } from '@waha/structures/enums.dto';
import { SessionMetricsCollector } from '@waha/core/metrics/session.metrics';
import { WahaMetrics } from '@waha/core/metrics/waha.metrics';

describe('SessionMetricsCollector', () => {
  test('collects runtime sessions without chatId labels', async () => {
    const metrics = new WahaMetrics(true);
    const manager = {
      getSessions: async () => [
        { name: 'default', status: WAHASessionStatus.WORKING },
        { name: 'other', status: WAHASessionStatus.SCAN_QR_CODE },
      ],
      getSession: (name: string) => {
        if (name === 'default') {
          return { engine: WAHAEngine.GOWS };
        }
        return { engine: WAHAEngine.WEBJS };
      },
    };
    const collector = new SessionMetricsCollector(metrics, manager as any);
    await collector.collect();
    const body = await metrics.render();
    expect(body).toContain(
      'waha_sessions{status="WORKING",engine="GOWS"} 1',
    );
    expect(body).toContain(
      'waha_sessions{status="SCAN_QR_CODE",engine="WEBJS"} 1',
    );
    expect(body).not.toContain('default');
    expect(body).not.toContain('chatId');
  });

  test('swallows getSessions failures', async () => {
    const metrics = new WahaMetrics(true);
    const manager = {
      getSessions: async () => {
        throw new Error('db down');
      },
      getSession: () => {
        throw new Error('unused');
      },
    };
    const collector = new SessionMetricsCollector(metrics, manager as any);
    await expect(collector.collect()).resolves.toBeUndefined();
  });
});
