import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { MetricsController } from '@waha/api/metrics.controller';
import {
  createWahaMetricsRegistry,
  WAHA_METRICS_REGISTRY,
} from '@waha/core/metrics/prometheus.registry';

describe('MetricsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: WAHA_METRICS_REGISTRY,
          useFactory: createWahaMetricsRegistry,
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    delete process.env.WAHA_PROMETHEUS_ENABLED;
  });

  test('returns 404 when disabled', async () => {
    const response = await request(app.getHttpServer()).get('/metrics');
    expect(response.status).toBe(404);
  });

  test('returns prometheus text when enabled', async () => {
    process.env.WAHA_PROMETHEUS_ENABLED = 'true';
    const response = await request(app.getHttpServer()).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toMatch(/text\/plain/);
    expect(response.text).toMatch(/waha_up(?:\{[^}]*\})? 1/);
  });
});
