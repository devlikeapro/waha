import { parseBool } from '@waha/helpers';
import { APPS } from '@waha/apps/app_sdk/apps/definition';

// Apps that don't require queue (Redis) - derived from AppDefinition
const IN_MEMORY_APPS = Object.values(APPS)
  .filter((app) => !app.queue)
  .map((app) => app.name);

function parseCommaSeparatedList(value: string | undefined): string[] {
  if (!value) {
    return null;
  }
  return value.split(',').map((item) => item.trim());
}

function isMongoDB(): boolean {
  return !!process.env.WHATSAPP_SESSIONS_MONGO_URL;
}

function buildAppEnv() {
  const enabled = process.env.WAHA_APPS_ENABLED;
  const on = process.env.WAHA_APPS_ON;
  const off = process.env.WAHA_APPS_OFF;

  // Default if not mongodb
  const isUserConfigured = enabled !== undefined || on !== undefined;
  if (!isUserConfigured && !isMongoDB()) {
    return {
      enabled: true,
      on: IN_MEMORY_APPS,
      off: parseCommaSeparatedList(off),
    };
  }

  return {
    enabled: parseBool(enabled),
    on: parseCommaSeparatedList(on),
    off: parseCommaSeparatedList(off),
  };
}

export const AppEnv = buildAppEnv();
