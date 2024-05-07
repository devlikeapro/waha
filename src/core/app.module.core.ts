import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { join } from 'path';

import { AuthController } from '../api/auth.controller';
import { ChatsController } from '../api/chats.controller';
import { ChattingController } from '../api/chatting.controller';
import { ContactsController } from '../api/contacts.controller';
import { GroupsController } from '../api/groups.controller';
import { HealthController } from '../api/health.controller';
import { PresenceController } from '../api/presence.controller';
import { ScreenshotController } from '../api/screenshot.controller';
import {
  SessionController,
  SessionsController,
} from '../api/sessions.controller';
import { StatusController } from '../api/status.controller';
import { VersionController } from '../api/version.controller';
import { WhatsappConfigService } from '../config.service';
import { SessionManager } from './abc/manager.abc';
import { WAHAHealthCheckService } from './abc/WAHAHealthCheckService';
import { DashboardConfigServiceCore } from './config/DashboardConfigServiceCore';
import { SwaggerConfigServiceCore } from './config/SwaggerConfigServiceCore';
import { WAHAHealthCheckServiceCore } from './health/WAHAHealthCheckServiceCore';
import { SessionManagerCore } from './manager.core';

export const IMPORTS = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  ServeStaticModule.forRootAsync({
    imports: [],
    extraProviders: [WhatsappConfigService, DashboardConfigServiceCore],
    inject: [WhatsappConfigService, DashboardConfigServiceCore],
    useFactory: (
      config: WhatsappConfigService,
      dashboardConfig: DashboardConfigServiceCore,
    ) => {
      const options = [
        // Serve files (media)
        {
          rootPath: config.filesFolder,
          serveRoot: config.filesUri,
        },
      ];
      if (dashboardConfig.enabled) {
        options.push({
          rootPath: join(__dirname, '..', 'dashboard'),
          serveRoot: dashboardConfig.dashboardUri,
        });
      }
      return options;
    },
  }),
  PassportModule,
  TerminusModule,
];
export const CONTROLLERS = [
  AuthController,
  SessionsController,
  SessionController,
  ChattingController,
  ChatsController,
  StatusController,
  ContactsController,
  GroupsController,
  PresenceController,
  ScreenshotController,
  VersionController,
  HealthController,
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
  DashboardConfigServiceCore,
  SwaggerConfigServiceCore,
  WhatsappConfigService,
  ConsoleLogger,
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AppModuleCore {
  constructor(protected config: WhatsappConfigService) {}
}
