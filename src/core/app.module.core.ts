import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { ChannelsController } from '@waha/api/channels.controller';
import { ServerController } from '@waha/api/server.controller';
import { WebsocketGatewayCore } from '@waha/core/api/websocket.gateway.core';
import { MediaLocalStorageConfig } from '@waha/core/media/local/MediaLocalStorageConfig';
import { BufferJsonReplacerInterceptor } from '@waha/nestjs/BufferJsonReplacerInterceptor';
import {
  getPinoHttpUseLevel,
  getPinoLogLevel,
  getPinoTransport,
} from '@waha/utils/logging';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { Logger } from 'pino';

import { AuthController } from '../api/auth.controller';
import { ChatsController } from '../api/chats.controller';
import { ChattingController } from '../api/chatting.controller';
import { ContactsController } from '../api/contacts.controller';
import { GroupsController } from '../api/groups.controller';
import { HealthController } from '../api/health.controller';
import { LabelsController } from '../api/labels.controller';
import { PingController } from '../api/ping.controller';
import { PresenceController } from '../api/presence.controller';
import { ScreenshotController } from '../api/screenshot.controller';
import { SessionsController } from '../api/sessions.controller';
import { StatusController } from '../api/status.controller';
import { VersionController } from '../api/version.controller';
import { WhatsappConfigService } from '../config.service';
import { SessionManager } from './abc/manager.abc';
import { WAHAHealthCheckService } from './abc/WAHAHealthCheckService';
import { DashboardConfigServiceCore } from './config/DashboardConfigServiceCore';
import { EngineConfigService } from './config/EngineConfigService';
import { SwaggerConfigServiceCore } from './config/SwaggerConfigServiceCore';
import { WAHAHealthCheckServiceCore } from './health/WAHAHealthCheckServiceCore';
import { SessionManagerCore } from './manager.core';

export const IMPORTS = [
  LoggerModule.forRoot({
    renameContext: 'name',
    pinoHttp: {
      quietReqLogger: true,
      level: getPinoLogLevel(),
      useLevel: getPinoHttpUseLevel(),
      transport: getPinoTransport(),
      autoLogging: {
        ignore: (req) => {
          return (
            req.url.startsWith('/dashboard/') ||
            req.url.startsWith('/api/files/') ||
            req.url.startsWith('/api/s3/')
          );
        },
      },
      serializers: {
        req: (req) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    },
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      WHATSAPP_API_SCHEMA: Joi.string().valid('http', 'https').default('http'),
    }),
  }),
  ServeStaticModule.forRootAsync({
    imports: [],
    extraProviders: [DashboardConfigServiceCore],
    inject: [DashboardConfigServiceCore],
    useFactory: (dashboardConfig: DashboardConfigServiceCore) => {
      if (!dashboardConfig.enabled) {
        return [];
      }
      return [
        {
          rootPath: join(__dirname, '..', 'dashboard'),
          serveRoot: dashboardConfig.dashboardUri,
        },
      ];
    },
  }),
  PassportModule,
  TerminusModule,
];
export const CONTROLLERS = [
  AuthController,
  SessionsController,
  ChattingController,
  ChatsController,
  ChannelsController,
  StatusController,
  LabelsController,
  ContactsController,
  GroupsController,
  PresenceController,
  ScreenshotController,
  PingController,
  HealthController,
  ServerController,
  VersionController,
];
const PROVIDERS = [
  {
    provide: SessionManager,
    useClass: SessionManagerCore,
  },
  {
    provide: WAHAHealthCheckService,
    useClass: WAHAHealthCheckServiceCore,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: BufferJsonReplacerInterceptor,
  },
  DashboardConfigServiceCore,
  SwaggerConfigServiceCore,
  WhatsappConfigService,
  EngineConfigService,
  WebsocketGatewayCore,
  MediaLocalStorageConfig,
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AppModuleCore {
  public startTimestamp: number;

  constructor(protected config: WhatsappConfigService) {
    this.startTimestamp = Date.now();
  }

  static getHttpsOptions(logger: Logger) {
    return undefined;
  }

  static appReady(app: INestApplication, logger: Logger) {
    return;
  }
}
