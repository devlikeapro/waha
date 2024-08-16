import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PingResponse } from '@waha/structures/ping.dto';

@ApiSecurity('api_key')
@Controller('ping')
@ApiTags('🔍 Observability')
export class PingController {
  @Get()
  @ApiOperation({ summary: 'Ping the server, perform no operations.' })
  ping(): PingResponse {
    return { message: 'pong' };
  }
}
