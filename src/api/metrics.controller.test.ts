import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { MetricsController } from '@waha/api/metrics.controller';
import { WhatsappConfigService } from '@waha/config.service';
import { SessionMetricsCollector } from '@waha/core/metrics/session.metrics';
import { WahaMetrics } from '@waha/core/metrics/waha.metrics';

describe('MetricsController', () => {
  async function buildApp(enabled: boolean): Promise<INestApplication> {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: WahaMetrics,
          useValue: new WahaMetrics(enabled),
        },
        {
          provide: SessionMetricsCollector,
          useValue: { collect: async () => undefined },
        },
        {
          provide: WhatsappConfigService,
          useValue: { prometheusEnabled: enabled },
        },
      ],
    }).compile();
    const app = moduleRef.createNestApplication();
    await app.init();
    return app;
  }

  test('returns 404 when disabled', async () => {
    const app = await buildApp(false);
    const response = await request(app.getHttpServer()).get('/metrics');
    expect(response.status).toBe(404);
    await app.close();
  });

  test('returns prometheus text when enabled', async () => {
    const app = await buildApp(true);
    const response = await request(app.getHttpServer()).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toMatch(/text\/plain/);
    expect(response.text).toMatch(/waha_up(?:\{[^}]*\})? 1/);
    await app.close();
  });
});
