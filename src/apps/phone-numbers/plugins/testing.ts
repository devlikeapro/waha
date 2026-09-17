import { PhoneNumbersCorePlugin } from '@waha/apps/phone-numbers/plugins/PhoneNumbersCorePlugin';
import {
  PhoneNumbersBaseConfig,
  PhoneNumbersCacheConfig,
} from '@waha/apps/phone-numbers/dto/config.dto';
import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { RegisterPluginHooks } from '@waha/core/abc/session.plugin.hooks';

/**
 * Helpers for the phone numbers plugin tests - a bare session with hooks and a stubbed lookup
 */
export const testLogger: any = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
testLogger.child = () => testLogger;

const BaseSession = WhatsappSession as unknown as new (params: any) => any;

class TestSession extends BaseSession {}

export function buildSession(): any {
  return new TestSession({
    name: 'test',
    printQR: false,
    loggerBuilder: { child: () => testLogger },
    sessionStore: null,
    mediaManager: null,
    sessionConfig: null,
    engineConfig: null,
    ignore: {},
    media: { events: {} },
  });
}

export function buildConfig(
  overrides: Partial<PhoneNumbersBaseConfig> = {},
): PhoneNumbersBaseConfig {
  const config = new PhoneNumbersBaseConfig();
  config.cache = new PhoneNumbersCacheConfig();
  return Object.assign(config, overrides);
}

export interface BuildOptions {
  rules: PhoneNumberRule[];
  config?: Partial<PhoneNumbersBaseConfig>;
  repository?: any;
  pluginClass?: typeof PhoneNumbersCorePlugin;
}

export function buildPlugin(options: BuildOptions) {
  const session = buildSession();
  const PluginClass = options.pluginClass ?? PhoneNumbersCorePlugin;
  const plugin = new PluginClass(
    session,
    testLogger,
    buildConfig(options.config),
    {
      repository: options.repository ?? null,
      rules: options.rules,
    },
  );
  RegisterPluginHooks(plugin);
  return { session: session, plugin: plugin };
}

export function resolveChat(session: any, wid: string, method = 'sendText') {
  return session.hooks.wid.chat.promise(wid, method);
}

export function stubLookup(session: any, answer: any) {
  session.checkNumberStatus = jest.fn(async () => answer);
}
