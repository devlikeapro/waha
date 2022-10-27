import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {SessionDTO, SessionStartRequest, SessionStopRequest} from "../structures/sessions.dto";
import {SessionManager} from "../core/abc/manager.abc";


@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('sessions')
export class SessionsController {
    constructor(private manager: SessionManager) {
    }


    @Post('/start/')
    start(@Body() request: SessionStartRequest): SessionDTO {
        return this.manager.start(request)
    }

    @Post('/stop/')
    stop(@Body() request: SessionStopRequest): Promise<void> {
        return this.manager.stop(request)
    }

    @Get('/')
    list(): SessionDTO[] {
        return this.manager.getSessions()
    }
}

