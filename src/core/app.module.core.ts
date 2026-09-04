import * as process from 'node:process';

import { INestApplication, MiddlewareConsumer, Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import { ChannelsController } from '@waha/api/channels.controller';
import { LidsController } from '@waha/api/lids.controller';
import { ApiKeysController } from '@waha/api/apikeys.controller';
import { ProfileController } from '@waha/api/profile.controller';
import { ServerController } from '@waha/api/server.controller';
import { ServerDebugController } from '@waha/api/server.debug.controller';
import { WebsocketGatewayCore } from '@waha/api/websocket.gateway.core';
import { AppsModuleExports } from '@waha/apps/apps.module';
import { ContactsSessionController } from '@waha/api/contacts.session.controller';
import { ApiKeyStrategy } from '@waha/core/auth/apiKey.strategy';
import { IApiKeyAuth } from '@waha/core/auth/auth';
import { ApiKeyAuthMiddleware } from '@waha/core/auth/api-key-auth.middleware';
import { WebSocketAuth } from '@waha/core/auth/WebSocketAuth';
import { GowsEngineConfigService } from '@waha/core/config/GowsEngineConfigService';
import { NowebEngineConfigService } from '@waha/core/config/NowebEngineConfigService';
import { WPPEngineConfigService } from '@waha/core/config/WPPEngineConfigService';
import { WebJSEngineConfigService } from '@waha/core/config/WebJSEngineConfigService';
import { MediaLocalStorageModule } from '@waha/core/media/local/media.local.storage.module';
import { MediaLocalStorageConfig } from '@waha/core/media/local/MediaLocalStorageConfig';
import { MediaPsqlStorageModule } from '@waha/core/media/psql/media.psql.storage.module';
import { MediaS3StorageModule } from '@waha/core/media/s3/media.s3.storage.module';
import { HttpPathsModule } from '@waha/plugins/http.paths.module';
import { HttpPathsService } from '@waha/plugins/HttpPathsService';
import { AppBootstrapModule } from '@waha/plugins/app.bootstrap.module';
import { SessionPluginsModule } from '@waha/plugins/session.plugins.module';
import { isDashboardEnabled } from '@waha/modules/waha-dashboard/dashboard.config';
import { DashboardModule } from '@waha/modules/waha-dashboard/dashboard.module';
import { isSwaggerEnabled } from '@waha/modules/waha-swagger/swagger.config';
import { SwaggerEnabledModule } from '@waha/modules/waha-swagger/swagger.module.enabled';
import { isPresenceAutoOnlineEnabled } from '@waha/modules/waha-maintain-online-status/maintain-online-status.config';
import { MaintainOnlineStatusModule } from '@waha/modules/waha-maintain-online-status/maintain-online-status.module';
import { isJidEngine } from '@waha/modules/waha-wid-jid/wid-jid.plugins';
import { MessageSourceModule } from '@waha/modules/waha-message-source/message-source.module';
import { isPrometheusEnabled } from '@waha/modules/waha-prometheus/prometheus.config';
import { PrometheusModule } from '@waha/modules/waha-prometheus/prometheus.module';
import { WebhookModule } from '@waha/modules/waha-webhook/webhook.module';
import { SessionRuntimeInfoModule } from '@waha/modules/waha-session-runtime-info/session-runtime-info.module';
import { WidJIDModule } from '@waha/modules/waha-wid-jid/wid-jid.module';
import { WidSuffixModule } from '@waha/modules/waha-wid-suffix/wid-suffix.module';
import { CheckFreeDiskSpaceIndicator } from '@waha/core/health/CheckFreeDiskSpaceIndicator';
import { MongoStoreHealthIndicator } from '@waha/core/health/MongoStoreHealthIndicator';
import { ChannelsInfoServiceCore } from '@waha/core/services/ChannelsInfoServiceCore';
import { parseBool } from '@waha/helpers';
import { BufferJsonReplacerInterceptor } from '@waha/nestjs/BufferJsonReplacerInterceptor';
import { HttpsExpress } from '@waha/nestjs/HttpsExpress';
import {
  getPinoHttpUseLevel,
  getPinoLogLevel,
  getPinoTransport,
  isDebugEnabled,
  redactUrlParams,
} from '@waha/utils/logging';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { Logger as NestJSPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { AuthController } from '../api/auth.controller';
import { CallsController } from '../api/calls.controller';
import { ChatsController } from '../api/chats.controller';
import { ChattingController } from '../api/chatting.controller';
import { ContactsController } from '../api/contacts.controller';
import { EventsController } from '../api/events.controller';
import { GroupsController } from '../api/groups.controller';
import { HealthController } from '../api/health.controller';
import { LabelsController } from '../api/labels.controller';
import { MediaController } from '../api/media.controller';
import { PingController } from '../api/ping.controller';
import { PresenceController } from '../api/presence.controller';
import { ScreenshotController } from '../api/screenshot.controller';
import { SessionsController } from '../api/sessions.controller';
import { StatusController } from '../api/status.controller';
import { VersionController } from '../api/version.controller';
import { WhatsappConfigService } from '../config.service';
import { SessionManager } from './abc/manager.abc';
import { WAHAHealthCheckService } from './abc/WAHAHealthCheckService';
import { ApiKeyAuthFactory } from './auth/ApiKeyAuthFactory';
import { EngineConfigService } from './config/EngineConfigService';
import { WAHAHealthCheckServiceCore } from './health/WAHAHealthCheckServiceCore';
import { SessionManagerCore } from './manager.core';
import { CaslAbilityFactory } from '@waha/core/auth/casl.ability';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { ApiKeyAuthService } from './auth/ApiKeyAuthService';
import { SessionService } from '@waha/core/services/SessionService';

export const IMPORTS_CORE = [
  ...AppsModuleExports.imports,
  LoggerModule.forRootAsync({
    imports: [HttpPathsModule],
    inject: [HttpPathsService],
    useFactory: (httpPaths: HttpPathsService) => {
      return {
        renameContext: 'name',
        pinoHttp: {
          level: getPinoLogLevel(),
          useLevel: getPinoHttpUseLevel(),
          transport: getPinoTransport(),
          autoLogging: {
            ignore: (req) => httpPaths.isAccessLogIgnored(req.url),
          },
          redact: {
            paths: ['req.query["x-api-key"]'],
            censor: '[REDACTED]',
          },
          customAttributeKeys: { req: 'req', res: 'res' },
          serializers: {
            req: (req) => ({
              method: req.method,
              url: redactUrlParams('x-api-key', req.url, req.query),
              query: req.query,
              params: req.params,
            }),
            res: (res) => ({
              statusCode: res.statusCode,
            }),
          },
        },
      };
    },
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      WHATSAPP_API_SCHEMA: Joi.string().valid('http', 'https').default('http'),
    }),
  }),
  PassportModule,
  TerminusModule,
  AppBootstrapModule,
  HttpPathsModule,
  SessionPluginsModule,
  SessionRuntimeInfoModule,
  WebhookModule,
  MessageSourceModule,
  WidSuffixModule,
  ConditionalModule.registerWhen(WidJIDModule, isJidEngine, {
    debug: isDebugEnabled(),
  }),
  ConditionalModule.registerWhen(
    MaintainOnlineStatusModule,
    isPresenceAutoOnlineEnabled,
    { debug: isDebugEnabled() },
  ),
  ConditionalModule.registerWhen(PrometheusModule, isPrometheusEnabled, {
    debug: isDebugEnabled(),
  }),
  ConditionalModule.registerWhen(DashboardModule, isDashboardEnabled, {
    debug: isDebugEnabled(),
  }),
  ConditionalModule.registerWhen(SwaggerEnabledModule, isSwaggerEnabled, {
    debug: isDebugEnabled(),
  }),
];

const IMPORTS_MEDIA = [
  ConfigModule.forRoot({
    validationSchema: Joi.object({
      WAHA_MEDIA_STORAGE: Joi.string()
        .valid('LOCAL', 'S3', 'POSTGRESQL')
        .default('LOCAL'),
    }),
  }),
  ConditionalModule.registerWhen(
    MediaLocalStorageModule,
    (env: NodeJS.ProcessEnv) =>
      !env['WAHA_MEDIA_STORAGE'] || env['WAHA_MEDIA_STORAGE'] == 'LOCAL',
    { debug: isDebugEnabled() },
  ),
  ConditionalModule.registerWhen(
    MediaS3StorageModule,
    (env: NodeJS.ProcessEnv) => env['WAHA_MEDIA_STORAGE'] == 'S3',
    { debug: isDebugEnabled() },
  ),
  ConditionalModule.registerWhen(
    MediaPsqlStorageModule,
    (env: NodeJS.ProcessEnv) => env['WAHA_MEDIA_STORAGE'] == 'POSTGRESQL',
    { debug: isDebugEnabled() },
  ),
];

export const IMPORTS = [...IMPORTS_CORE, ...IMPORTS_MEDIA];

export const CONTROLLERS = [
  AuthController,
  ApiKeysController,
  SessionsController,
  ProfileController,
  ChattingController,
  ChatsController,
  CallsController,
  ChannelsController,
  StatusController,
  LabelsController,
  ContactsController,
  ContactsSessionController,
  LidsController,
  GroupsController,
  PresenceController,
  ScreenshotController,
  EventsController,
  PingController,
  HealthController,
  ServerController,
  ServerDebugController,
  VersionController,
  MediaController,
  ...AppsModuleExports.controllers,
];
export const PROVIDERS_BASE: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: BufferJsonReplacerInterceptor,
  },
  WebJSEngineConfigService,
  WPPEngineConfigService,
  GowsEngineConfigService,
  NowebEngineConfigService,
  WhatsappConfigService,
  EngineConfigService,
  WebsocketGatewayCore,
  MediaLocalStorageConfig,
  MongoStoreHealthIndicator,
  CheckFreeDiskSpaceIndicator,
  WebSocketAuth,
  ApiKeyStrategy,
  ApiKeyAuthService,
  CaslAbilityFactory,
  PoliciesGuard,
  SessionService,
  {
    provide: IApiKeyAuth,
    useFactory: ApiKeyAuthFactory,
    inject: [WhatsappConfigService, NestJSPinoLogger],
  },
  ...AppsModuleExports.providers,
];

export const PROVIDERS = [
  {
    provide: SessionManager,
    useClass: SessionManagerCore,
  },
  {
    provide: WAHAHealthCheckService,
    useClass: WAHAHealthCheckServiceCore,
  },
  ChannelsInfoServiceCore,
  ...PROVIDERS_BASE,
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AppModuleCore {
  public startTimestamp: number;

  constructor(
    protected config: WhatsappConfigService,
    private httpPaths: HttpPathsService,
  ) {
    this.startTimestamp = Date.now();
    this.httpPaths.register(
      { prefix: '/ping', include: { accessLog: false, authBasic: false } },
      { prefix: '/api/', include: { authBasic: false } },
      { prefix: 'api', include: { authApiKey: true } },
      { prefix: '/health', include: { authBasic: false } },
      { prefix: 'health', include: { authApiKey: true } },
      { prefix: '/ws', include: { authBasic: false } },
    );
    // WHATSAPP_API_KEY_EXCLUDE_PATH - env-driven auth exclusions
    for (const path of this.config.getExcludedFullPaths()) {
      this.httpPaths.register({ prefix: path, include: { authBasic: false } });
    }
  }

  static getHttpsOptions(logger: Logger) {
    const httpsEnabled = parseBool(process.env.WAHA_HTTPS_ENABLED);
    if (!httpsEnabled) {
      return undefined;
    }
    const httpsExpress = new HttpsExpress(logger);
    return httpsExpress.readSync();
  }

  static appReady(app: INestApplication, logger: Logger) {
    const httpsEnabled = parseBool(process.env.WAHA_HTTPS_ENABLED);
    if (!httpsEnabled) {
      return;
    }
    const httpd = app.getHttpServer();
    const httpsExpress = new HttpsExpress(logger);
    httpsExpress.watchCertChanges(httpd);
  }

  configure(consumer: MiddlewareConsumer) {
    // Because we use ServeStaticModule, we need to inject a middleware
    // ServeStaticModule does not support @UseGuards
    const exclude = this.config.getExcludedPaths();
    consumer
      .apply(ApiKeyAuthMiddleware)
      .exclude(...exclude)
      .forRoutes(...this.httpPaths.apiKeyRoutes());
  }
}
