import { SocksProxyAgent } from 'socks-proxy-agent';
import { URL } from 'url';
import { ClientOptions, WebSocket } from 'ws';

import { ProxyScheme } from '@waha/structures/enums.dto';

import { tunnelConnection } from './utils.tunnel';

export interface WebSocketProbeResult {
  // How long the connection stayed open, ms
  alive: number;
  // Number of messages sent while connected
  sent: number;
  // Number of messages echoed back by the server
  received: number;
}

/**
 * The proxy (or the server) closed an open WebSocket before the probe was over
 */
export class ProxyDisconnectedError extends Error {
  constructor(
    public result: WebSocketProbeResult,
    code: number,
  ) {
    super(`The connection closed after ${result.alive} ms (code ${code})`);
  }
}

export interface WebSocketProbeParams {
  // How long to wait for the handshake, ms
  timeout: number;
  // The WebSocket server to hold a connection to, through the proxy
  url: string;
  // How long to keep the connection open, ms
  duration: number;
  // Send a message every that many ms, 0 = idle
  pingInterval: number;
}

/**
 * Opens the WebSocket through the proxy and holds it for the duration,
 * sending a message every pingInterval ms (0 = idle).
 * Some proxies drop long-lived connections after few minutes - ProxyDisconnectedError.
 */
export function probeWebSocket(
  proxy: URL,
  params: WebSocketProbeParams,
): Promise<WebSocketProbeResult> {
  const { url, duration, pingInterval, timeout } = params;
  const destination = new URL(url);
  const secure = destination.protocol === 'wss:';
  const port = Number(destination.port) || (secure ? 443 : 80);
  const options: ClientOptions = {
    handshakeTimeout: timeout,
    perMessageDeflate: false,
  };
  let agent: SocksProxyAgent | null = null;
  if (proxy.protocol === `${ProxyScheme.SOCKS5}:`) {
    agent = new SocksProxyAgent(proxy, { timeout: timeout });
    options.agent = agent;
  } else {
    // ws hands the options to http.request, which calls createConnection(options, oncreate) - the ws typing
    // only knows the net.connect shape
    options.createConnection = tunnelConnection(
      proxy,
      destination.hostname,
      port,
      secure,
      timeout,
    ) as unknown as ClientOptions['createConnection'];
  }

  return new Promise((resolve, reject) => {
    const run: WebSocketProbeResult = { alive: 0, sent: 0, received: 0 };
    let opened: number | null = null;
    let settled = false;
    let holdTimer: NodeJS.Timeout | null = null;
    let pingTimer: NodeJS.Timeout | null = null;
    function finish(err: Error | null) {
      if (settled) {
        return;
      }
      settled = true;
      if (holdTimer) {
        clearTimeout(holdTimer);
      }
      if (pingTimer) {
        clearInterval(pingTimer);
      }
      socket.terminate();
      agent?.destroy();
      if (err) {
        reject(err);
        return;
      }
      resolve(run);
    }

    const socket = new WebSocket(url, options);
    socket.on('open', () => {
      opened = Date.now();
      holdTimer = setTimeout(() => {
        run.alive = Date.now() - opened;
        finish(null);
      }, duration);
      if (pingInterval > 0) {
        pingTimer = setInterval(() => {
          socket.send('ping', (err) => {
            if (!err) {
              run.sent += 1;
            }
          });
        }, pingInterval);
      }
    });
    socket.on('message', () => {
      run.received += 1;
    });
    socket.on('close', (code) => {
      // Closed before the hold was over - the handshake errors arrive through 'error' first
      if (opened === null) {
        finish(
          new Error(`The connection closed before opening (code ${code})`),
        );
        return;
      }
      run.alive = Date.now() - opened;
      finish(new ProxyDisconnectedError(run, code));
    });
    socket.on('error', (err) => finish(err));
  });
}
