import { Controller, Get, Header, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SessionMetricsCollector } from '@waha/core/metrics/session.metrics';
import { WahaMetrics } from '@waha/core/metrics/waha.metrics';

@Controller('metrics')
@ApiTags('🔍 Observability')
export class MetricsController {
  constructor(
    private readonly metrics: WahaMetrics,
    private readonly sessions: SessionMetricsCollector,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Prometheus metrics',
    description:
      'Prometheus text exposition. Disabled by default (404). Set WAHA_PROMETHEUS_ENABLED=true. Unauthenticated so in-cluster scrapers can collect it.',
  })
  async metricsEndpoint(@Res() response: Response): Promise<void> {
    if (!this.metrics.isEnabled) {
      response.status(404).send();
      return;
    }
    await this.sessions.collect();
    const body = await this.metrics.render();
    response
      .status(200)
      .set('Content-Type', this.metrics.register.contentType)
      .send(body);
  }
}
