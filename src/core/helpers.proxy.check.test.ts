import * as http from 'http';
import * as net from 'net';

import { checkProxy, parseExitIp } from '@waha/core/helpers.proxy.check';
import { ProxyErrorCode } from '@waha/structures/sessions.dto';

function listen(server: net.Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve((server.address() as net.AddressInfo).port);
    });
  });
}

function close(server: net.Server): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}

// Answers every CONNECT with the status, or never (null); hungUp = the client closed it
async function startProxy(status: number | null) {
  const server = http.createServer();
  let onHangUp: () => void;
  const hungUp = new Promise<void>((resolve) => {
    onHangUp = resolve;
  });
  server.on('connect', (req, socket) => {
    if (status !== null) {
      socket.end(`HTTP/1.1 ${status} Nope\r\nContent-Length: 0\r\n\r\n`);
      return;
    }
    socket.resume();
    socket.on('end', () => {
      onHangUp();
      // http.Server keeps half-open sockets: close our side too
      socket.end();
    });
  });
  const port = await listen(server);
  return {
    server: server,
    url: `http://127.0.0.1:${port}`,
    hungUp: hungUp,
  };
}

const OPTIONS = { timeoutMs: 2000, ipUrl: '' };

describe('parseExitIp', () => {
  it('reads the ip line of a Cloudflare trace', () => {
    const trace = 'fl=123\nh=www.cloudflare.com\nip=203.0.113.10\nts=1\n';
    expect(parseExitIp(trace)).toEqual('203.0.113.10');
  });

  it('reads a plain-text answer, IPv6 included', () => {
    expect(parseExitIp('2001:db8::1\n')).toEqual('2001:db8::1');
  });

  it('returns null when there is no IP', () => {
    expect(parseExitIp('<html>blocked</html>')).toBeNull();
  });
});

describe('checkProxy', () => {
  it('refuses a scheme the engines cannot dial', async () => {
    const result = await checkProxy('socks4://127.0.0.1:1080', OPTIONS);
    expect(result.ok).toBe(false);
    expect(result.error.code).toEqual(ProxyErrorCode.INVALID);
  });

  it('reports a proxy that is not listening', async () => {
    const server = net.createServer();
    const port = await listen(server);
    await close(server);
    const result = await checkProxy(`http://127.0.0.1:${port}`, OPTIONS);
    expect(result.ok).toBe(false);
    expect(result.error.code).toEqual(ProxyErrorCode.CONNECTION_REFUSED);
  });

  it('reports wrong credentials (407)', async () => {
    const proxy = await startProxy(407);
    try {
      const result = await checkProxy(proxy.url, OPTIONS);
      expect(result.ok).toBe(false);
      expect(result.error.code).toEqual(ProxyErrorCode.AUTH_FAILED);
    } finally {
      await close(proxy.server);
    }
  });

  it('reports a proxy that refuses to reach WhatsApp', async () => {
    const proxy = await startProxy(403);
    try {
      const result = await checkProxy(proxy.url, OPTIONS);
      expect(result.ok).toBe(false);
      expect(result.error.code).toEqual(ProxyErrorCode.REJECTED);
      expect(result.error.message).toContain('403');
    } finally {
      await close(proxy.server);
    }
  });

  it('gives up on a proxy that never answers, and closes the connection', async () => {
    const proxy = await startProxy(null);
    try {
      const result = await checkProxy(proxy.url, {
        timeoutMs: 300,
        ipUrl: '',
      });
      expect(result.ok).toBe(false);
      expect(result.error.code).toEqual(ProxyErrorCode.TIMEOUT);
      const closed = await Promise.race([
        proxy.hungUp.then(() => true),
        new Promise<boolean>((resolve) =>
          setTimeout(() => resolve(false), 1000),
        ),
      ]);
      expect(closed).toBe(true);
    } finally {
      await close(proxy.server);
    }
  });
});
