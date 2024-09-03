import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PingResponse } from '@waha/structures/ping.dto';

@ApiSecurity('api_key')
@Controller('ping')
@ApiTags('🔍 Observability')
export class PingController {
  @Get()
  @ApiOperation({
    summary: 'Ping the server',
    description: 'Check if the server is alive and responding to requests.',
  })
  ping(): PingResponse {
    return { message: 'pong' };
  }
}
