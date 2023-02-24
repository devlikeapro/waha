import {ConsoleLogger, Module} from '@nestjs/common';
import {ScreenshotController} from "../api/screenshot.controller";
import {ConfigModule} from "@nestjs/config";
import {WhatsappConfigService} from "../config.service";
import {ServeStaticModule} from "@nestjs/serve-static";
import {SessionsController} from "../api/sessions.controller";
import {ChattingController} from "../api/chatting.controller";
import {ContactsController} from "../api/contacts.controller";
import {VersionController} from "../api/version.controller";
import {PassportModule} from "@nestjs/passport";
import {SessionManager} from "./abc/manager.abc";
import {SessionManagerCore} from "./manager.core";
import {GroupsController} from "../api/groups.controller";

export const IMPORTS = [
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
        imports: [],
        extraProviders: [WhatsappConfigService],
        inject: [WhatsappConfigService],
        useFactory: (config: WhatsappConfigService) => {
            return [{
                rootPath: config.filesFolder,
                serveRoot: config.files_uri,
            }]
        },
    }),
    PassportModule,
]
export const CONTROLLERS = [
    SessionsController,
    ChattingController,
    ContactsController,
    GroupsController,
    ScreenshotController,
    VersionController,
]
const PROVIDERS = [
    {
        provide: SessionManager,
        useClass: SessionManagerCore,
    },
    WhatsappConfigService,
    ConsoleLogger,
]


@Module({
    imports: IMPORTS,
    controllers: CONTROLLERS,
    providers: PROVIDERS,
})
export class AppModuleCore {

}
