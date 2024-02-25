import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { WAHAHealthCheckService } from '../core/abc/WAHAHealthCheckService';

@Controller('health')
@ApiTags('other')
export class HealthController {
  constructor(private wahaHealth: WAHAHealthCheckService) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.wahaHealth.check();
  }
}
