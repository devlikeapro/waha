import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseBool } from '@waha/helpers';

/**
 * Automatically mark session as ONLINE on any messages activity.
 * Used as the ConditionalModule.registerWhen predicate for MaintainOnlineStatusModule.
 */
export function isPresenceAutoOnlineEnabled(env: NodeJS.ProcessEnv): boolean {
  const value = env['WAHA_PRESENCE_AUTO_ONLINE'];
  if (!value) {
    return true;
  }
  return parseBool(value);
}

@Injectable()
export class MaintainOnlineStatusConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * Duration (in milliseconds) to keep session ONLINE after activity.
   * Web goes "unavailable" after ~90s of no user activity (60s idle grace + 30s timer).
   */
  get duration(): number {
    const seconds =
      parseInt(
        this.configService.get('WAHA_PRESENCE_AUTO_ONLINE_DURATION_SECONDS'),
      ) || 90;
    return seconds * 1000;
  }
}
