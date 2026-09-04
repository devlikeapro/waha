import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BasicAuthFunction } from '@waha/core/auth/basicAuth';
import {
  DashboardConfigService,
  DashboardEnvSchema,
  getDashboardUri,
} from '@waha/modules/waha-dashboard/dashboard.config';
import { HttpPathsModule } from '@waha/plugins/http.paths.module';
import { HttpPathsService } from '@waha/plugins/HttpPathsService';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: DashboardEnvSchema,
    }),
    ServeStaticModule.forRoot({
      // compiled to dist/modules/waha-dashboard; assets are copied to dist/dashboard by nest-cli.json
      rootPath: join(__dirname, '..', '..', 'dashboard'),
      serveRoot: getDashboardUri(),
    }),
    HttpPathsModule,
  ],
  providers: [DashboardConfigService],
  exports: [DashboardConfigService],
})
/**
 * Dashboard UI (WAHA_DASHBOARD_ENABLED, default true).
 * Serves the dashboard static files at /dashboard;
 * optional basic auth via WAHA_DASHBOARD_USERNAME and WAHA_DASHBOARD_PASSWORD.
 */
export class DashboardModule implements NestModule {
  constructor(
    private config: DashboardConfigService,
    httpPaths: HttpPathsService,
  ) {
    httpPaths.register(
      { prefix: this.config.dashboardUri, include: { authBasic: false } },
      { prefix: this.config.dashboardUri + '/', include: { accessLog: false } },
    );
  }

  configure(consumer: MiddlewareConsumer) {
    const credentials = this.config.credentials;
    if (credentials) {
      const username = credentials[0];
      const password = credentials[1];
      consumer
        .apply(BasicAuthFunction(username, password))
        .forRoutes('dashboard');
    }
  }
}
