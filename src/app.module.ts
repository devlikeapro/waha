import {Module} from '@nestjs/common';
import {ChattingController} from './api/chattingController';
import {ApiService} from './api/api.service';
import {DeviceController} from "./api/device.controller";

@Module({
    imports: [],
    controllers: [ChattingController, DeviceController],
    providers: [ApiService],
})
export class AppModule {
}
