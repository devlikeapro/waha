import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PingResponse } from '@waha/structures/ping.dto';

@Controller('ping')
@ApiTags('other')
export class PingController {
  @Get()
  @ApiOperation({ summary: 'Ping the server, perform no operations.' })
  ping(): PingResponse {
    return { message: 'pong' };
  }
}
