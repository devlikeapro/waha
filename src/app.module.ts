import {ConsoleLogger, Module} from '@nestjs/common';
import {WhatsappSessionManager} from "./whatsapp.service";
import {ScreenshotController} from "./api/screenshot.controller";
import {ConfigModule} from "@nestjs/config";
import {WhatsappConfigService} from "./config.service";
import {ServeStaticModule} from "@nestjs/serve-static";
import {SessionsController} from "./api/sessions.controller";
import {ChattingController} from "./api/chatting.controller";
import {DeviceController} from "./api/device.controller";

@Module({
    imports: [
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
    ],
    controllers: [
        SessionsController,
        ChattingController,
        DeviceController,
        ScreenshotController,
    ],
    providers: [WhatsappSessionManager, ConsoleLogger, WhatsappConfigService],
})
export class AppModule {
}
