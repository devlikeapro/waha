import {Controller, Get, Inject, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {Whatsapp} from "venom-bot";


@Controller('api')
@ApiTags('device')
export class DeviceController {
    constructor(@Inject('WHATSAPP') private whatsapp: Whatsapp) {
    }

    @Post('/killServiceWorker')
    killServiceWorker() {
        return this.whatsapp.killServiceWorker()
    }

    @Post('/restartService')
    restartService() {
        return this.whatsapp.restartService()
    }

    @Get('/getHostDevice')
    getHostDevice() {
        return this.whatsapp.getHostDevice()
    }

    @Get('/getConnectionState')
    getConnectionState() {
        return this.whatsapp.getConnectionState()
    }

    @Get('/getBatteryLevel')
    getBatteryLevel() {
        return this.whatsapp.getBatteryLevel()
    }

    @Get('/isConnected')
    isConnected() {
        return this.whatsapp.isConnected()
    }

    @Get('/getWAVersion')
    getWAVersion() {
        return this.whatsapp.getWAVersion()
    }

}

