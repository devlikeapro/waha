import * as net from 'net';

import { WhatsappSession } from '@waha/core/abc/session.abc';
import {
  ProxyConfig,
  ProxyErrorCode,
  ProxySource,
  SessionConfig,
} from '@waha/structures/sessions.dto';

const logger: any = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
logger.child = () => logger;

const BaseSession = WhatsappSession as unknown as new (params: any) => any;

class TestSession extends BaseSession {}

function buildSession(
  proxyConfig: ProxyConfig | undefined,
  sessionConfig: SessionConfig,
): TestSession {
  return new TestSession({
    name: 'test',
    printQR: false,
    loggerBuilder: { child: () => logger },
    sessionStore: null,
    proxyConfig: proxyConfig,
    mediaManager: null,
    sessionConfig: sessionConfig,
    engineConfig: null,
    ignore: {},
    media: { events: { mimetypes: [] } },
  });
}

const OPTIONS = { timeoutMs: 2000, ipUrl: '' };

async function closedPort(): Promise<number> {
  const server = net.createServer();
  await new Promise<void>((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve()),
  );
  const port = (server.address() as net.AddressInfo).port;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return port;
}

describe('WhatsappSession proxy info', () => {
  it('is null when the session uses no proxy', async () => {
    const session = buildSession(undefined, {});
    expect(session.getProxyInfo()).toBeNull();
    await expect(session.checkProxy(OPTIONS)).rejects.toThrow(
      'does not use a proxy',
    );
  });

  it('shows the session proxy without credentials and no check yet', () => {
    const proxy = { server: 'proxy.local:3128', username: 'u', password: 's' };
    const session = buildSession(proxy, { proxy: proxy });
    expect(session.getProxyInfo()).toEqual({
      server: 'http://proxy.local:3128',
      source: ProxySource.SESSION,
      check: null,
    });
  });

  it('tells a proxy from the environment variables', () => {
    const session = buildSession({ server: 'socks5://proxy.local:1080' }, {});
    expect(session.getProxyInfo().source).toEqual(ProxySource.ENVIRONMENT);
  });

  it('keeps the last check in the info', async () => {
    const port = await closedPort();
    const session = buildSession({ server: `127.0.0.1:${port}` }, {});
    const checked = await session.checkProxy(OPTIONS);
    expect(checked.check.ok).toBe(false);
    expect(checked.check.error.code).toEqual(ProxyErrorCode.CONNECTION_REFUSED);
    expect(session.getProxyInfo().check).toEqual(checked.check);
  });

  it('reports an address that cannot be parsed', async () => {
    const session = buildSession({ server: 'http://user:secret@' }, {});
    const checked = await session.checkProxy(OPTIONS);
    expect(checked.server).toBeNull();
    expect(checked.check.error.code).toEqual(ProxyErrorCode.INVALID);
  });
});
