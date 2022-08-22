import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {SessionRequest} from "./all.dto";
import {WhatsappSessionManager} from "../whatsapp.service";


@Controller('api')
@ApiTags('device')
export class DeviceController {

    constructor(private whatsappSessionManager: WhatsappSessionManager) {
    }


    @Post('/killServiceWorker')
    killServiceWorker(@Body() request: SessionRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        return whatsapp.killServiceWorker()
    }

    @Post('/restartService')
    restartService(@Body() request: SessionRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        return whatsapp.restartService()
    }

    @Get('/getHostDevice')
    getHostDevice(@Body() request: SessionRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        return whatsapp.getHostDevice()
    }

    @Get('/getConnectionState')
    getConnectionState(@Body() request: SessionRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        return whatsapp.getConnectionState()
    }

    @Get('/getBatteryLevel')
    getBatteryLevel(@Body() request: SessionRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        return whatsapp.getBatteryLevel()
    }

    @Get('/isConnected')
    isConnected(@Body() request: SessionRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        return whatsapp.isConnected()
    }

    @Get('/getWAVersion')
    getWAVersion(@Body() request: SessionRequest) {
        const whatsapp = this.whatsappSessionManager.getSession(request.sessionName)
        return whatsapp.getWAVersion()
    }

}

