import {Controller, Get} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";

@Controller('api')
@ApiTags('device')
export class DeviceController {
    @Get('/getHostDevice')
    getHostDevice(): string {
        return 'hostDevice'
    }

    @Get('/getConnectionState')
    getConnectionState(): string {
        return 'getConnectionState'
    }

    @Get('/getWAVersion')
    getWAVersion(): string {
        return 'getWAVersion'
    }
}
