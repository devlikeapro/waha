import { parseBool } from '@waha/helpers';

export interface SValue {
  param: string;
  value: string | null;
  generated: boolean;
}

function rand() {
  return crypto.randomUUID().toString().replace(/-/g, '');
}
console.log("DEBUG: Attempting to load dotenv manually...");

import * as path from 'path';
import * as dotenv from 'dotenv';

const envPath = path.resolve(__dirname, '..', '.env');
// console.log("DEBUG: Checking expected .env path =", envPath);
// console.log("DEBUG existsSync =", require('fs').existsSync(envPath));

dotenv.config({ path: envPath });

// console.log("DEBUG: After dotenv load, WAHA_API_KEY =", process.env.WAHA_API_KEY);

// Utility: convert value to visible format (hex for hidden chars)
function visible(val: any) {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  return JSON.stringify(val) + " | HEX: " + Buffer.from(String(val)).toString('hex');
}

function FromEnv(
  param: string,
  skip: boolean,
  adefault: string,
  search: any[],
): SValue {
  let value = process.env[param];

  // console.log(`\n================ ENV DEBUG FOR ${param} ================`);
  // console.log("Raw ENV Value:         ", visible(value));
  // console.log("Skip flag:             ", skip);
  // console.log("Search list:           ", search);
  // console.log("Search.contains(value):", search.includes(value));

  const common = search.includes(value);

  if (common && !skip) {
    console.log(`ACTION: Regenerating ${param} → using default:`, visible(adefault));

    return {
      param: param,
      value: adefault,
      generated: true,
    };
  }

  // console.log(`ACTION: ACCEPTING ${param} →`, visible(value));

  return {
    param: param,
    value: value,
    generated: false,
  };
}

const keys = [
  '',
  null,
  undefined,
  '123',
  '321',
  'waha',
  'admin',
  '00000000000000000000000000000000',
  '11111111111111111111111111111111',
  'sha512:98b6d128682e280b74b324ca82a6bae6e8a3f7174e0605bfd52eb9948fad8984854ec08f7652f32055c4a9f12b69add4850481d9503a7f2225501671d6124648',
];

const nulls = ['', null, undefined];

interface UserPassword {
  username: SValue;
  password: SValue;
}

export class AuthConfig {
  public key: SValue;
  public keyplain: SValue;
  public dashboard: UserPassword;
  public swagger: UserPassword;

  constructor() {

    // console.log("\n==================== .ENV DUMP ====================");
    // [
    //   "WAHA_API_KEY",
    //   "WAHA_API_KEY_PLAIN",
    //   "WAHA_DASHBOARD_USERNAME",
    //   "WAHA_DASHBOARD_PASSWORD",
    //   "WHATSAPP_SWAGGER_USERNAME",
    //   "WHATSAPP_SWAGGER_PASSWORD",
    //   "WAHA_NO_API_KEY",
    //   "WAHA_DASHBOARD_NO_PASSWORD",
    //   "WHATSAPP_SWAGGER_NO_PASSWORD"
    // ].forEach(k => {
    //   console.log(`${k} =`, visible(process.env[k]));
    // });
    // console.log("====================================================\n");

    if (process.env.WHATSAPP_API_KEY) {
      process.env.WAHA_API_KEY = process.env.WHATSAPP_API_KEY;
    }

    this.key = FromEnv(
      'WAHA_API_KEY',
      parseBool(process.env.WAHA_NO_API_KEY),
      rand(),
      keys,
    );

    this.keyplain = FromEnv(
      'WAHA_API_KEY_PLAIN',
      false,
      this.key.value?.startsWith('sha512:') ? null : this.key.value,
      [],
    );

    this.dashboard = this.getDashboard();
    this.swagger = this.getSwagger();
  }

  private getDashboard(): UserPassword {
    // console.log("\n------------ DEBUG DASHBOARD CONFIG ---------------");

    const password = FromEnv(
      'WAHA_DASHBOARD_PASSWORD',
      parseBool(process.env.WAHA_DASHBOARD_NO_PASSWORD),
      rand(),
      keys,
    );

    const username = FromEnv(
      'WAHA_DASHBOARD_USERNAME',
      false,
      'admin',
      password.value ? nulls : [],
    );

    return {
      username: username,
      password: password,
    };
  }

  private getSwagger(): UserPassword {
    // console.log("\n------------ DEBUG SWAGGER CONFIG ------------------");

    const password = FromEnv(
      'WHATSAPP_SWAGGER_PASSWORD',
      parseBool(process.env.WHATSAPP_SWAGGER_NO_PASSWORD),
      this.dashboard.password.value,
      keys,
    );

    const username = FromEnv(
      'WHATSAPP_SWAGGER_USERNAME',
      false,
      'admin',
      password.value ? nulls : [],
    );

    return {
      username: username,
      password: password,
    };
  }
}

export const Auth = new AuthConfig();

export function ReportGeneratedValue() {
  let values = [
    Auth.key,
    Auth.dashboard.username,
    Auth.dashboard.password,
    Auth.swagger.username,
    Auth.swagger.password,
  ];

  values = values.filter((key) => key.generated);

  if (values.length === 0) {
    console.warn("\n[DEBUG] No generated values.");
    return;
  }

  console.warn('');
  console.warn('⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ GENERATED CREDS ⬇️ ⬇️ ⬇️ ⬇️ ⬇️');
  console.warn("Save these to .env to reuse next time:\n");

  console.warn("cat <<'EOF' > .env");
  console.warn('');

  for (const key of values) {
    console.warn(`${key.param}=${key.value}`);
  }

  console.warn('EOF');
  console.warn('');
  console.warn('⬆️ ⬆️ ⬆️ ABOVE ARE NEW CREDENTIALS ⬆️ ⬆️ ⬆️');
}
