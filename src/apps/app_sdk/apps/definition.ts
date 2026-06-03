import { AppName } from '@waha/apps/app_sdk/apps/name';

export interface AppDefinition {
  // App name
  name: AppName;
  // If app requires WAHA_API_KEY_PLAIN to work
  plainkey: boolean;
  // If app requires queue to work
  queue: boolean;
  // If app has any migrations
  migrations: boolean;
  // If adding, updating, or removing this app requires a session restart
  restartOnChange: boolean;
}

// All Apps
export const APPS: Record<AppName, AppDefinition> = {
  [AppName.calls]: {
    name: AppName.calls,
    plainkey: false,
    queue: false,
    migrations: false,
    restartOnChange: true,
  },
  [AppName.chatwoot]: {
    name: AppName.chatwoot,
    plainkey: true,
    queue: true,
    migrations: true,
    restartOnChange: true,
  },
  [AppName.mcp]: {
    name: AppName.mcp,
    plainkey: false,
    queue: false,
    migrations: false,
    restartOnChange: false,
  },
};
