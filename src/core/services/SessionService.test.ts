import {
  hideProxyPassword,
  PROXY_PASSWORD_MASK,
  SessionService,
} from './SessionService';
import { WAHASessionStatus } from '../../structures/enums.dto';
import { SessionConfig } from '../../structures/sessions.dto';

const SAVED = {
  name: 'default',
  status: WAHASessionStatus.STOPPED,
  config: {
    proxy: { server: 'proxy.local:3128', username: 'user', password: 'secret' },
  },
};

const MASKED_PROXY = {
  server: 'proxy.local:3128',
  username: 'user',
  password: PROXY_PASSWORD_MASK,
};

function buildService(saved: any = SAVED) {
  const upserted: SessionConfig[] = [];
  const manager = {
    withLock: (name: string, fn: () => Promise<any>) => fn(),
    exists: async () => true,
    isRunning: () => false,
    stop: async () => undefined,
    assign: async () => undefined,
    start: async () => saved,
    upsert: async (name: string, config: SessionConfig) => {
      upserted.push(config);
    },
    getSessionInfo: async () => saved,
  };
  const service = new SessionService(manager as any, {} as any, {} as any);
  return { service: service, upserted: upserted };
}

describe('hideProxyPassword', () => {
  it('masks the proxy password without touching the original', () => {
    const masked = hideProxyPassword(SAVED);
    expect(masked.config.proxy.password).toEqual(PROXY_PASSWORD_MASK);
    expect(masked.config.proxy.username).toEqual('user');
    expect(SAVED.config.proxy.password).toEqual('secret');
  });

  it('leaves sessions without a proxy password as they are', () => {
    const session = { name: 'default', status: WAHASessionStatus.STOPPED };
    expect(hideProxyPassword(session)).toBe(session);
  });
});

describe('SessionService proxy password', () => {
  it('returns the session with the password masked', async () => {
    const { service } = buildService();
    const session = await service.getSession('default');
    expect(session.config.proxy.password).toEqual(PROXY_PASSWORD_MASK);
  });

  it('keeps the saved password when the update sends the mask back', async () => {
    const { service, upserted } = buildService();
    await service.updateSession('default', {
      config: { proxy: { ...MASKED_PROXY } },
    });
    expect(upserted[0].proxy.password).toEqual('secret');
  });

  it('keeps the saved password on the deprecated upsert-and-start too', async () => {
    const { service, upserted } = buildService();
    await service.upsertAndStartSession('default', {
      proxy: { ...MASKED_PROXY },
    });
    expect(upserted[0].proxy.password).toEqual('secret');
  });

  it('refuses the mask when the proxy server changes', async () => {
    const { service, upserted } = buildService();
    await expect(
      service.updateSession('default', {
        config: { proxy: { ...MASKED_PROXY, server: 'other.host:3128' } },
      }),
    ).rejects.toThrow('server or username changed');
    expect(upserted).toHaveLength(0);
  });

  it('refuses the mask when the proxy username changes', async () => {
    const { service, upserted } = buildService();
    await expect(
      service.updateSession('default', {
        config: { proxy: { ...MASKED_PROXY, username: 'someone' } },
      }),
    ).rejects.toThrow('server or username changed');
    expect(upserted).toHaveLength(0);
  });

  it('refuses the mask when there is no saved password to keep', async () => {
    const { service, upserted } = buildService({
      name: 'default',
      status: WAHASessionStatus.STOPPED,
      config: {},
    });
    await expect(
      service.updateSession('default', {
        config: { proxy: { ...MASKED_PROXY } },
      }),
    ).rejects.toThrow('no saved password');
    expect(upserted).toHaveLength(0);
  });

  it('saves a new password as sent', async () => {
    const { service, upserted } = buildService();
    await service.updateSession('default', {
      config: {
        proxy: {
          server: 'proxy.local:3128',
          username: 'user',
          password: 'new',
        },
      },
    });
    expect(upserted[0].proxy.password).toEqual('new');
  });

  it('refuses to create a session with the mask as the password', async () => {
    const { service } = buildService();
    await expect(
      service.createSession({
        name: 'other',
        config: {
          proxy: { server: 'proxy.local:3128', password: PROXY_PASSWORD_MASK },
        },
      }),
    ).rejects.toThrow('send the real password');
  });
});
