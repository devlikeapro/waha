import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { parseBool } from '../../helpers';

@Injectable()
export class DashboardConfigServiceCore {
  public dashboardUri = '/dashboard';

  constructor(
    protected configService: ConfigService,
    @InjectPinoLogger('DashboardConfigService')
    protected logger: PinoLogger,
  ) {}

  get enabled(): boolean {
    const value = this.configService.get('WAHA_DASHBOARD_ENABLED', 'true');
    return parseBool(value);
  }
}
