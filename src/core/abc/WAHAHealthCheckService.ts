import { ConsoleLogger, Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheckService } from '@nestjs/terminus';
import type { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';

import { WhatsappConfigService } from '../../config.service';
import { SessionManager } from './manager.abc';

@Injectable()
export abstract class WAHAHealthCheckService {
  constructor(
    protected sessionManager: SessionManager,
    protected health: HealthCheckService,
    protected log: ConsoleLogger,
    protected config: WhatsappConfigService,
  ) {}

  abstract check(): Promise<HealthCheckResult>;
}
