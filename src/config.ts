import { WAHAEngine } from '@waha/structures/enums.dto';

export function getEngineName(): string {
  //   Load engine name from WHATSAPP_DEFAULT_ENGINE environment variable
  //   If not set - use WEBJS
  return process.env.WHATSAPP_DEFAULT_ENGINE || WAHAEngine.WEBJS;
}

export function getNamespace(): string {
  //   Controls the prefix used for the main database and folder (non-session data)
  //   If not set - falls back to engine name for backward compatibility
  return (process.env.WAHA_NAMESPACE || getEngineName()).toLowerCase();
}

export function getSessionNamespace(): string {
  //   Controls the prefix used for session databases and folders
  //   If not set - falls back to engine name for backward compatibility
  return (process.env.WAHA_SESSION_NAMESPACE || getEngineName()).toLowerCase();
}
