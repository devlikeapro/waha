import {Module} from '@nestjs/common';
import {ChattingController} from './api/chattingController';
import {DeviceController} from "./api/device.controller";
import {whatsappProvider, WhatsappService} from "./whatsapp.service";

@Module({
    imports: [],
    controllers: [ChattingController, DeviceController],
    providers: [whatsappProvider, WhatsappService],
})
export class AppModule {
}
