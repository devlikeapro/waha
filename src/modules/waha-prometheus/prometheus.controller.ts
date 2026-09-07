import { Controller, Get, Header, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getPrometheusPath } from '@waha/modules/waha-prometheus/prometheus.config';
import { WahaMetrics } from '@waha/modules/waha-prometheus/prometheus.metrics';
import { SessionMetricsCollector } from '@waha/modules/waha-prometheus/prometheus.sessions.collector';
import { Response } from 'express';

@Controller(getPrometheusPath())
@ApiTags('🔍 Observability')
export class PrometheusController {
  constructor(
    private metrics: WahaMetrics,
    private collector: SessionMetricsCollector,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Prometheus metrics',
    description:
      'Prometheus text exposition format. ' +
      'Enable with WAHA_PROMETHEUS_ENABLED=True, configure with WAHA_PROMETHEUS_* environment variables.',
  })
  async get(@Res() response: Response): Promise<void> {
    await this.collector.collect();
    const body = await this.metrics.render();
    response.set('Content-Type', this.metrics.contentType);
    response.send(body);
  }
}
