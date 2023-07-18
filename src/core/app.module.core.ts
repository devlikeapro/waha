import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ChattingController } from '../api/chatting.controller';
import { ContactsController } from '../api/contacts.controller';
import { GroupsController } from '../api/groups.controller';
import { PresenceController } from '../api/presence.controller';
import { ScreenshotController } from '../api/screenshot.controller';
import { SessionsController } from '../api/sessions.controller';
import { VersionController } from '../api/version.controller';
import { WhatsappConfigService } from '../config.service';
import { SessionManager } from './abc/manager.abc';
import { SessionManagerCore } from './manager.core';
import { ChatsController } from '../api/chats.controller';

export const IMPORTS = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  ServeStaticModule.forRootAsync({
    imports: [],
    extraProviders: [WhatsappConfigService],
    inject: [WhatsappConfigService],
    useFactory: (config: WhatsappConfigService) => {
      return [
        {
          rootPath: config.filesFolder,
          serveRoot: config.files_uri,
        },
      ];
    },
  }),
  PassportModule,
];
export const CONTROLLERS = [
  SessionsController,
  ChattingController,
  ChatsController,
  ContactsController,
  GroupsController,
  PresenceController,
  ScreenshotController,
  VersionController,
];
const PROVIDERS = [
  {
    provide: SessionManager,
    useClass: SessionManagerCore,
  },
  WhatsappConfigService,
  ConsoleLogger,
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AppModuleCore {}
