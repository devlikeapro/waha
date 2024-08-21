import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';
import type { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';

import { WhatsappConfigService } from '../../config.service';
import { SessionManager } from './manager.abc';

@Injectable()
export abstract class WAHAHealthCheckService {
  protected logger: LoggerService;
  constructor(
    protected sessionManager: SessionManager,
    protected health: HealthCheckService,
    protected config: WhatsappConfigService,
  ) {
    this.logger = new Logger('WAHAHealthCheckService');
  }

  abstract check(): Promise<HealthCheckResult>;
}
