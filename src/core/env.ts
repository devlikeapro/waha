//
// Presence
//

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
