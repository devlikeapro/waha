import { UnprocessableEntityException } from '@nestjs/common';
import { BrazilianPhoneGowsPlugin } from '@waha/apps/brazilian-phone-numbers/plugins/BrazilianPhoneGowsPlugin';
import { BrazilianPhoneNowebPlugin } from '@waha/apps/brazilian-phone-numbers/plugins/BrazilianPhoneNowebPlugin';
import { BrazilianPhoneCorePlugin } from '@waha/apps/brazilian-phone-numbers/plugins/BrazilianPhoneCorePlugin';
import {
  BrazilianPhoneNumbersAppConfig,
  BrazilianPhoneNumbersCacheConfig,
} from '@waha/apps/brazilian-phone-numbers/dto/config.dto';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { RegisterPluginHooks } from '@waha/core/abc/session.plugin.hooks';

const logger: any = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
logger.child = () => logger;

const BaseSession = WhatsappSession as unknown as new (params: any) => any;

class TestSession extends BaseSession {}

function buildSession(): any {
  return new TestSession({
    name: 'test',
    printQR: false,
    loggerBuilder: { child: () => logger },
    sessionStore: null,
    mediaManager: null,
    sessionConfig: null,
    engineConfig: null,
    ignore: {},
  });
}

function buildConfig(
  overrides: Partial<BrazilianPhoneNumbersAppConfig> = {},
): BrazilianPhoneNumbersAppConfig {
  const config = new BrazilianPhoneNumbersAppConfig();
  config.cache = new BrazilianPhoneNumbersCacheConfig();
  return Object.assign(config, overrides);
}

interface BuildOptions {
  config?: Partial<BrazilianPhoneNumbersAppConfig>;
  repository?: any;
  pluginClass?: typeof BrazilianPhoneCorePlugin;
}

function buildPlugin(options: BuildOptions = {}) {
  const session = buildSession();
  const PluginClass = options.pluginClass ?? BrazilianPhoneCorePlugin;
  const plugin = new PluginClass(session, logger, buildConfig(options.config), {
    repository: options.repository ?? null,
  });
  RegisterPluginHooks(plugin);
  return { session: session, plugin: plugin };
}

function resolveChat(session: any, wid: string, method = 'sendText') {
  return session.hooks.wid.chat.promise(wid, method);
}

function stubLookup(session: any, answer: any) {
  session.checkNumberStatus = jest.fn(async () => answer);
}

describe('BrazilianPhonePlugin - wid.chat', () => {
  it('resolves and caches the canonical phone when the engine answers with a PN', async () => {
    // '558591203123' is the real number: DDD 85 with an 8-digit local part.
    const { session } = buildPlugin();
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });

    const first = await resolveChat(session, '5585991203123@c.us');
    const second = await resolveChat(session, '5585991203123@c.us');

    expect(first).toBe('558591203123@c.us');
    expect(second).toBe('558591203123@c.us');
    // Second call is served from cache - no extra WhatsApp lookup.
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
    expect(session.checkNumberStatus).toHaveBeenCalledWith({
      phone: '558591203123',
      session: 'test',
    });
  });

  it('prefers the pn form when the engine answers with both pn and a LID', async () => {
    const { session } = buildPlugin();
    stubLookup(session, {
      numberExists: true,
      chatId: '77820596330581@lid',
      pn: '558591203123@c.us',
    });

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('558591203123@c.us');
  });

  it('caches a LID answer as-is instead of stapling a phone suffix on it', async () => {
    // Engines answer with a LID only when the account has no phone form. The
    // LID is routable, but '77820596330581@c.us' - its digits with a phone
    // suffix - addresses nobody.
    const { session } = buildPlugin();
    stubLookup(session, {
      numberExists: true,
      chatId: '77820596330581@lid',
    });

    const first = await resolveChat(session, '5585991203123@c.us');
    const second = await resolveChat(session, '5585991203123@c.us');

    expect(first).toBe('77820596330581@lid');
    expect(second).toBe('77820596330581@lid');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('reuses the cache across both forms of the same number', async () => {
    const { session } = buildPlugin();
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });

    // Wrong form first, then the already-correct one: same target, one lookup.
    const wrongForm = await resolveChat(session, '5585991203123@c.us');
    const rightForm = await resolveChat(session, '558591203123@c.us');

    expect(wrongForm).toBe('558591203123@c.us');
    expect(rightForm).toBe('558591203123@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('shares one in-flight lookup between concurrent sends (single-flight)', async () => {
    const { session } = buildPlugin();
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });

    const [first, second] = await Promise.all([
      resolveChat(session, '5585991203123@c.us'),
      resolveChat(session, '558591203123@c.us'),
    ]);

    expect(first).toBe('558591203123@c.us');
    expect(second).toBe('558591203123@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('rewrites a dialed toll-free (0800) to the stored form, no lookup', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    // Dialed forms with and without the country code, plus the already-stored
    // form, all address the same chat id - and none hits the WhatsApp lookup.
    expect(await resolveChat(session, '08000464636@c.us')).toBe(
      '558000464636@c.us',
    );
    expect(await resolveChat(session, '5508000464636@c.us')).toBe(
      '558000464636@c.us',
    );
    expect(await resolveChat(session, '558000464636@c.us')).toBe(
      '558000464636@c.us',
    );
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });

  it('applies the static 9th-digit rule for DDD below the lookup range, no lookup', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    const resolved = await resolveChat(session, '551198765432@c.us');

    expect(resolved).toBe('5511998765432@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });

  it('leaves non-Brazilian numbers untouched', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    const resolved = await resolveChat(session, '12132132130@c.us');

    expect(resolved).toBe('12132132130@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });

  it('passes recursion-sensitive methods through untouched', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    const viaCheck = await resolveChat(
      session,
      '5585991203123@c.us',
      'checkNumberStatus',
    );
    const viaLidMap = await resolveChat(
      session,
      '5585991203123@c.us',
      'findLIDByPhoneNumber',
    );

    expect(viaCheck).toBe('5585991203123@c.us');
    expect(viaLidMap).toBe('5585991203123@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });

  it('resolves non-send methods locally only - no lookup, cache still honored', async () => {
    const { session } = buildPlugin();
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });

    // Cache miss on a local-only method: input goes through unresolved.
    const cold = await resolveChat(
      session,
      '5585991203123@c.us',
      'startTyping',
    );
    expect(cold).toBe('5585991203123@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();

    // A send resolves and caches; the local-only method now sees the cache.
    await resolveChat(session, '5585991203123@c.us', 'sendText');
    const warm = await resolveChat(
      session,
      '5585991203123@c.us',
      'startTyping',
    );
    expect(warm).toBe('558591203123@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(1);
  });

  it('throws 422 for a malformed number on send, passes it through otherwise', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    await expect(resolveChat(session, '55859912@c.us')).rejects.toThrow(
      UnprocessableEntityException,
    );
    const readOp = await resolveChat(session, '55859912@c.us', 'getPresence');
    expect(readOp).toBe('55859912@c.us');
  });

  it('soft mode: sends the best-guess when the number is confirmed not to exist', async () => {
    const { session } = buildPlugin();
    stubLookup(session, { numberExists: false });

    const resolved = await resolveChat(session, '558591203123@c.us');

    // DDD 85 keeps the 8-digit heuristic as the best-guess.
    expect(resolved).toBe('558591203123@c.us');
    // Both candidates were tried before giving up.
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(2);
  });

  it('strict mode: rejects a confirmed-nonexistent number and caches the negative', async () => {
    const { session } = buildPlugin({ config: { strict: true } });
    stubLookup(session, { numberExists: false });

    await expect(resolveChat(session, '5585991203123@c.us')).rejects.toThrow(
      UnprocessableEntityException,
    );
    const lookups = session.checkNumberStatus.mock.calls.length;

    // The negative is cached - the retry rejects without a new lookup...
    await expect(resolveChat(session, '5585991203123@c.us')).rejects.toThrow(
      UnprocessableEntityException,
    );
    expect(session.checkNumberStatus).toHaveBeenCalledTimes(lookups);
    // ...and local-only methods still pass the number through.
    const readOp = await resolveChat(
      session,
      '5585991203123@c.us',
      'getPresence',
    );
    expect(readOp).toBe('5585991203123@c.us');
  });

  it('sends as-is without caching when the lookup fails', async () => {
    const { session } = buildPlugin();
    session.checkNumberStatus = jest.fn(async () => {
      throw new Error('engine down');
    });

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('5585991203123@c.us');
    const lookups = session.checkNumberStatus.mock.calls.length;
    // Not cached: the next send retries the lookup.
    await resolveChat(session, '5585991203123@c.us');
    expect(session.checkNumberStatus.mock.calls.length).toBeGreaterThan(
      lookups,
    );
  });

  it('lookup: false disables the WhatsApp tier', async () => {
    const { session } = buildPlugin({ config: { lookup: false } });
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('5585991203123@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });
});

describe('BrazilianPhonePlugin - wid.mention', () => {
  it('resolves mentions best-effort and never breaks the send', async () => {
    const { session } = buildPlugin({ config: { strict: true } });
    stubLookup(session, { numberExists: false });

    // Strict mode rejects the number on the chat hook, but a mention falls
    // back to the input instead of failing the whole message.
    const mention = await session.hooks.wid.mention.promise(
      '5585991203123@c.us',
      'sendText',
    );

    expect(mention).toBe('5585991203123@c.us');
  });
});

describe('BrazilianPhonePlugin - persistent cache tier', () => {
  function buildRepository() {
    return {
      get: jest.fn().mockResolvedValue(null),
      setMany: jest.fn().mockResolvedValue(undefined),
    };
  }

  it('serves a persisted resolution without any lookup and warms the memory tier', async () => {
    const repository = buildRepository();
    repository.get.mockResolvedValue({
      key: '5585991203123',
      chatId: '558591203123@c.us',
      verified: true,
      resolvedAt: new Date(),
    });
    const { session } = buildPlugin({ repository: repository });
    stubLookup(session, { numberExists: false });

    const first = await resolveChat(session, '5585991203123@c.us');
    const second = await resolveChat(session, '5585991203123@c.us');

    expect(first).toBe('558591203123@c.us');
    expect(second).toBe('558591203123@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
    // Second call hits the memory tier - the database is read once.
    expect(repository.get).toHaveBeenCalledTimes(1);
  });

  it('persists verified resolutions under both forms of the number', async () => {
    const repository = buildRepository();
    const { session } = buildPlugin({ repository: repository });
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });

    await resolveChat(session, '5585991203123@c.us');

    expect(repository.setMany).toHaveBeenCalledTimes(1);
    const [keys, chatId, verified] = repository.setMany.mock.calls[0];
    expect([...keys].sort()).toEqual(['558591203123', '5585991203123']);
    expect(chatId).toBe('558591203123@c.us');
    expect(verified).toBe(true);
  });

  it('does not persist best-guesses or static-rule rewrites', async () => {
    const repository = buildRepository();
    const { session } = buildPlugin({ repository: repository });
    stubLookup(session, { numberExists: false });

    // Static rule (DDD 11) and a confirmed-nonexistent best-guess (DDD 85).
    await resolveChat(session, '551198765432@c.us');
    await resolveChat(session, '558591203123@c.us');

    expect(repository.setMany).not.toHaveBeenCalled();
  });

  it('resolves normally when the persistent tier errors out', async () => {
    const repository = buildRepository();
    repository.get.mockRejectedValue(new Error('db down'));
    const { session } = buildPlugin({ repository: repository });
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('558591203123@c.us');
  });
});

describe('BrazilianPhoneGowsPlugin - local LID map tier', () => {
  it('resolves via the LID map with no WhatsApp lookup', async () => {
    const { session } = buildPlugin({ pluginClass: BrazilianPhoneGowsPlugin });
    stubLookup(session, { numberExists: false });
    session.findLIDByPhoneNumber = jest.fn(async (phone: string) => {
      if (phone === '558591203123') {
        return { lid: '77820596330581@lid', pn: '558591203123@c.us' };
      }
      return { lid: null, pn: null };
    });

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('558591203123@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });

  it('falls through to the WhatsApp lookup for unknown numbers', async () => {
    const { session } = buildPlugin({ pluginClass: BrazilianPhoneGowsPlugin });
    stubLookup(session, {
      numberExists: true,
      chatId: '5585991203123@c.us',
    });
    session.findLIDByPhoneNumber = jest.fn(async () => {
      return { lid: null, pn: null };
    });

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('5585991203123@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalled();
  });
});

describe('BrazilianPhoneNowebPlugin - local contact store tier', () => {
  it('resolves via the contact store with no WhatsApp lookup', async () => {
    const { session } = buildPlugin({ pluginClass: BrazilianPhoneNowebPlugin });
    stubLookup(session, { numberExists: false });
    session.store = {
      getContactById: jest.fn(async (jid: string) => {
        if (jid === '558591203123@s.whatsapp.net') {
          return { id: '558591203123@s.whatsapp.net' };
        }
        return null;
      }),
    };

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('558591203123@c.us');
    expect(session.checkNumberStatus).not.toHaveBeenCalled();
  });

  it('falls through to the WhatsApp lookup when the store has no match', async () => {
    const { session } = buildPlugin({ pluginClass: BrazilianPhoneNowebPlugin });
    stubLookup(session, {
      numberExists: true,
      chatId: '558591203123@c.us',
    });
    session.store = {
      getContactById: jest.fn(async () => null),
    };

    const resolved = await resolveChat(session, '5585991203123@c.us');

    expect(resolved).toBe('558591203123@c.us');
    expect(session.checkNumberStatus).toHaveBeenCalled();
  });
});
