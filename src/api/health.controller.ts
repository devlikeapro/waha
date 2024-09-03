import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { WAHAHealthCheckService } from '../core/abc/WAHAHealthCheckService';

@ApiSecurity('api_key')
@Controller('health')
@ApiTags('🔍 Observability')
export class HealthController {
  constructor(private wahaHealth: WAHAHealthCheckService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check the health of the server',
    description:
      "Perform all health checks and return the server's health status.",
  })
  async check() {
    return this.wahaHealth.check();
  }
}
