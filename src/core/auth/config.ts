import { parseBool } from '@waha/helpers';

export interface SValue {
  param: string;
  value: string | null;
  generated: boolean;
}

export function rand() {
  return crypto.randomUUID().toString().replace(/-/g, '');
}

function FromEnv(
  param: string,
  skip: boolean,
  adefault: string,
  search: any[],
): SValue {
  let value = process.env[param];
  const common = search.includes(value);
  if (common && !skip) {
    // Use generated value for the setting
    return {
      param: param,
      value: adefault,
      generated: true,
    };
  }

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
    return;
  }
  console.warn('');
  console.warn('⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️ ⬇️');
  console.warn('Generated credentials (persist to .env or WAHA_* env vars)');
  console.warn(
    'Save these values to your environment (.env or WAHA_*) to reuse them; new keys are generated on every start otherwise.',
  );
  console.warn('');
  console.warn("cat <<'EOF' >> .env");
  console.warn('');
  for (const key of values) {
    console.warn(`${key.param}=${key.value}`);
  }
  console.warn('EOF');
  console.warn('');
  console.warn('Generated credentials ready to copy');
  console.warn('⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️ ⬆️');
}
