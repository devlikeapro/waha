import {Module} from '@nestjs/common';
import {ChattingController} from './api/chatting.controller';
import {DeviceController} from "./api/device.controller";
import {whatsappProvider, WhatsappService} from "./whatsapp.service";
import {ScreenshotController} from "./api/screenshot.controller";

@Module({
    imports: [],
    controllers: [ChattingController, DeviceController, ScreenshotController],
    providers: [whatsappProvider, WhatsappService],
})
export class AppModule {
}
