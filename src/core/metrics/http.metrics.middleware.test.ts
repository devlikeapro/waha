import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Controller, Get } from '@nestjs/common';
import { HttpMetricsMiddleware } from '@waha/core/metrics/http.metrics.middleware';
import { WahaMetrics } from '@waha/core/metrics/waha.metrics';

@Controller()
class ProbeController {
  @Get('ping')
  ping(): string {
    return 'pong';
  }

  @Get('metrics')
  metrics(): string {
    return 'scrape';
  }
}

describe('HttpMetricsMiddleware', () => {
  let app: INestApplication;
  let metrics: WahaMetrics;

  beforeAll(async () => {
    metrics = new WahaMetrics(true);
    const moduleRef = await Test.createTestingModule({
      controllers: [ProbeController],
      providers: [
        {
          provide: WahaMetrics,
          useValue: metrics,
        },
        HttpMetricsMiddleware,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    const middleware = app.get(HttpMetricsMiddleware);
    app.use(middleware.use.bind(middleware));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('records ping and ignores metrics path', async () => {
    await request(app.getHttpServer()).get('/ping').expect(200);
    await request(app.getHttpServer()).get('/metrics').expect(200);
    const body = await metrics.render();
    expect(body).toMatch(
      /waha_http_requests_total\{method="GET",status="200"\} 1/,
    );
  });
});
