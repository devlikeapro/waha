import { parseBool } from '@waha/helpers';

//
// Presence
//

// Automatically mark session as ONLINE on any messages activity
export const PRESENCE_AUTO_ONLINE = process.env.WAHA_PRESENCE_AUTO_ONLINE
  ? parseBool(process.env.WAHA_PRESENCE_AUTO_ONLINE)
  : true;

// Duration (in seconds) to keep session ONLINE after activity
// 25 seconds is default web timeout with no activity
export const PRESENCE_AUTO_ONLINE_DURATION_SECONDS =
  parseInt(process.env.WAHA_PRESENCE_AUTO_ONLINE_DURATION_SECONDS) || 25;

//
// Local - sqlite3 engine
//
let KNEX_SQLITE_CLIENT = process.env.WAHA_SQLITE_ENGINE;
if (KNEX_SQLITE_CLIENT != 'sqlite3' && KNEX_SQLITE_CLIENT != 'better-sqlite3') {
  KNEX_SQLITE_CLIENT = 'sqlite3';
}
export { KNEX_SQLITE_CLIENT };

//
// Client config
//
export const WAHA_CLIENT_DEVICE_NAME =
  process.env.WAHA_CLIENT_DEVICE_NAME || null;
export const WAHA_CLIENT_BROWSER_NAME =
  process.env.WAHA_CLIENT_BROWSER_NAME || null;
