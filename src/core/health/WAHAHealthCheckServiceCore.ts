import { Injectable } from '@nestjs/common';
import { HealthCheckResult } from '@nestjs/terminus';

import { WAHAHealthCheckService } from '../abc/WAHAHealthCheckService';
import { AvailableInPlusVersion } from '../exceptions';

@Injectable()
export class WAHAHealthCheckServiceCore extends WAHAHealthCheckService {
  check(): Promise<HealthCheckResult> {
    throw new AvailableInPlusVersion();
  }
}
