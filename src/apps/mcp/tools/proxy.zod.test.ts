import {
  ProxyHttpInput,
  ProxyInfoInput,
  ProxyWebSocketInput,
} from './proxy.zod';

describe('proxy MCP inputs', () => {
  it('fills the probe defaults and keeps the session optional', () => {
    const websocket = ProxyWebSocketInput.parse({ session: 'default' });
    expect(websocket).toEqual({
      session: 'default',
      timeout: 10_000,
      url: 'wss://echo.websocket.org',
      duration: 40_000,
      pingInterval: 0,
    });
    const http = ProxyHttpInput.parse({
      proxy: { server: 'proxy.example.com:3128', username: 'u' },
      method: 'GET',
    });
    expect(http.proxy).toEqual({
      server: 'proxy.example.com:3128',
      username: 'u',
    });
    expect(http.method).toEqual('GET');
    expect(http.url).toEqual('https://web.whatsapp.com/');
  });

  it('rejects a bad method and a proxy without a server', () => {
    expect(ProxyHttpInput.safeParse({ method: 'POST' }).success).toBe(false);
    expect(ProxyInfoInput.safeParse({ proxy: {} }).success).toBe(false);
    expect(ProxyInfoInput.safeParse({ session: 'default' }).success).toBe(true);
  });
});
