// eslint-disable-next-line @typescript-eslint/no-var-requires
import { getBrowserExecutablePath } from './core/abc/session.abc';
import { WAHAEngine } from './structures/enums.dto';
import { WAHAEnvironment } from './structures/environment.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export enum WAHAVersion {
  PLUS = 'PLUS',
  CORE = 'CORE',
}

export function getWAHAVersion(): WAHAVersion {
  // force core version if env variables set
  const waha_version = process.env.WAHA_VERSION;
  if (waha_version && waha_version === WAHAVersion.CORE) {
    return WAHAVersion.CORE;
  }

  // Check the plus directory exists
  const plusExists = fs.existsSync(`${__dirname}/plus`);
  if (plusExists) {
    return WAHAVersion.PLUS;
  }

  return WAHAVersion.CORE;
}
export function getEngineName(): string {
  //   Load engine name from WHATSAPP_DEFAULT_ENGINE environment variable
  //   If not set - use WEBJS
  return process.env.WHATSAPP_DEFAULT_ENGINE || WAHAEngine.WEBJS;
}

export const VERSION: WAHAEnvironment = {
  version: '2023.12.3',
  engine: getEngineName(),
  tier: getWAHAVersion(),
  browser: getBrowserExecutablePath(),
};
