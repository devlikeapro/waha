import { Injectable } from '@nestjs/common';
import { Auth } from '@waha/core/auth/config';
import { parseBool } from '@waha/helpers';
import * as Joi from 'joi';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

enum Env {
  WAHA_DASHBOARD_ENABLED = 'WAHA_DASHBOARD_ENABLED',
  WAHA_DASHBOARD_USERNAME = 'WAHA_DASHBOARD_USERNAME',
  WAHA_DASHBOARD_PASSWORD = 'WAHA_DASHBOARD_PASSWORD',
}

const DASHBOARD_URI = '/dashboard';

export const DashboardEnvSchema = Joi.object({
  [Env.WAHA_DASHBOARD_ENABLED]: Joi.boolean()
    .truthy('1', 'yes')
    .falsy('0', 'no'),
  [Env.WAHA_DASHBOARD_USERNAME]: Joi.string().allow(''),
  [Env.WAHA_DASHBOARD_PASSWORD]: Joi.string().allow(''),
});

export function isDashboardEnabled(env: NodeJS.ProcessEnv): boolean {
  const value = env[Env.WAHA_DASHBOARD_ENABLED];
  if (!value) {
    return true;
  }
  return parseBool(value);
}

export function getDashboardUri(): string {
  return DASHBOARD_URI;
}

@Injectable()
export class DashboardConfigService {
  public dashboardUri = getDashboardUri();

  constructor(
    @InjectPinoLogger('DashboardConfigService')
    protected logger: PinoLogger,
  ) {}

  get credentials(): [string, string] | null {
    const user = Auth.dashboard.username.value || '';
    const password = Auth.dashboard.password.value || '';
    if (!user && !password) {
      return null;
    }
    if ((user && !password) || (!user && password)) {
      this.logger.warn(
        'Set up both WAHA_DASHBOARD_USERNAME and WAHA_DASHBOARD_PASSWORD ' +
          'to enable dashboard authentication.',
      );
      return null;
    }
    return [user, password];
  }
}
