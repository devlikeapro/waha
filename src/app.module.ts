import {Logger, Module} from '@nestjs/common';
import {ChattingController} from './api/chatting.controller';
import {DeviceController} from "./api/device.controller";
import {whatsappProvider, WhatsappService} from "./whatsapp.service";
import {ScreenshotController} from "./api/screenshot.controller";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
    })],
    controllers: [ChattingController, DeviceController, ScreenshotController],
    providers: [whatsappProvider, WhatsappService, Logger],
})
export class AppModule {
}
