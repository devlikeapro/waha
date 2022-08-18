import {ConsoleLogger, Logger, Module} from '@nestjs/common';
import {ChattingController} from './api/chatting.controller';
import {DeviceController} from "./api/device.controller";
import {whatsappProvider, WhatsappService} from "./whatsapp.service";
import {ScreenshotController} from "./api/screenshot.controller";
import {ConfigModule} from "@nestjs/config";
import {WhatsappConfigService} from "./config.service";
import {ServeStaticModule} from "@nestjs/serve-static";

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
    controllers: [ChattingController, DeviceController, ScreenshotController],
    providers: [whatsappProvider, WhatsappService, ConsoleLogger, WhatsappConfigService],
})
export class AppModule {
}
