import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { parseBool } from '../../helpers';

@Injectable()
export class DashboardConfigServiceCore {
  public dashboardUri = '/dashboard';

  constructor(protected configService: ConfigService) {}

  get enabled(): boolean {
    const value = this.configService.get('WAHA_DASHBOARD_ENABLED', 'true');
    return parseBool(value);
  }
}
