import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BasicAuthFunction } from '@waha/core/auth/basicAuth';
import {
  PrometheusConfigService,
  PrometheusEnvSchema,
} from '@waha/modules/waha-prometheus/prometheus.config';
import { PrometheusController } from '@waha/modules/waha-prometheus/prometheus.controller';
import { EventMetricsSubscriber } from '@waha/modules/waha-prometheus/prometheus.events.subscriber';
import { HttpMetricsMiddleware } from '@waha/modules/waha-prometheus/prometheus.http.middleware';
import { WahaMetrics } from '@waha/modules/waha-prometheus/prometheus.metrics';
import { SessionMetricsCollector } from '@waha/modules/waha-prometheus/prometheus.sessions.collector';
import { HttpPathsModule } from '@waha/plugins/http.paths.module';
import { HttpPathsService } from '@waha/plugins/HttpPathsService';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: PrometheusEnvSchema,
    }),
    HttpPathsModule,
  ],
  providers: [
    PrometheusConfigService,
    WahaMetrics,
    HttpMetricsMiddleware,
    SessionMetricsCollector,
    EventMetricsSubscriber,
  ],
  controllers: [PrometheusController],
})
/**
 * Prometheus metrics endpoint (WAHA_PROMETHEUS_ENABLED=True).
 * Serves GET /metrics (WAHA_PROMETHEUS_PATH) with process, HTTP, session and message metrics;
 * optional basic auth via WAHA_PROMETHEUS_USERNAME and WAHA_PROMETHEUS_PASSWORD.
 */
export class PrometheusModule implements NestModule {
  constructor(
    private config: PrometheusConfigService,
    httpPaths: HttpPathsService,
  ) {
    httpPaths.register({
      prefix: this.config.path,
      include: { accessLog: false, authBasic: false, metrics: false },
    });
  }

  configure(consumer: MiddlewareConsumer) {
    const credentials = this.config.credentials;
    if (credentials) {
      const username = credentials[0];
      const password = credentials[1];
      consumer
        .apply(BasicAuthFunction(username, password))
        .forRoutes(this.config.path);
    }
    consumer.apply(HttpMetricsMiddleware).forRoutes('api', 'mcp');
  }
}
