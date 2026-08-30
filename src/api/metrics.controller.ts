import { Controller, Get, Header, Inject, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Registry } from 'prom-client';
import {
  prometheusEnabled,
  WAHA_METRICS_REGISTRY,
} from '@waha/core/metrics/prometheus.registry';

@Controller('metrics')
@ApiTags('🔍 Observability')
export class MetricsController {
  constructor(
    @Inject(WAHA_METRICS_REGISTRY) private readonly register: Registry,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Prometheus metrics',
    description:
      'Prometheus text exposition. Disabled by default (404). Set WAHA_PROMETHEUS_ENABLED=true. Unauthenticated so in-cluster scrapers can collect it.',
  })
  async metrics(@Res() response: Response): Promise<void> {
    if (!prometheusEnabled()) {
      response.status(404).send();
      return;
    }
    const body = await this.register.metrics();
    response
      .status(200)
      .set('Content-Type', this.register.contentType)
      .send(body);
  }
}
