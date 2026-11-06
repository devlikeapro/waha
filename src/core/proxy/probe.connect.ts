import * as net from 'net';
import * as tls from 'tls';
import { URL } from 'url';

import { ProxyScheme } from '@waha/structures/enums.dto';

import { ProxyTimeoutError } from './errors.probe';
import { stripBrackets } from './utils.tunnel';

export interface ConnectProbeParams {
  // How long to wait for the socket, ms
  timeout: number;
}

export interface ConnectProbeResult {
  // Time to open the socket, ms
  latency: number;
  // The IP address the socket was opened to
  address: string;
  // The port the socket was opened to
  port: number;
}

function proxyPort(proxy: URL): number {
  if (proxy.port) {
    return Number(proxy.port);
  }
  if (proxy.protocol === `${ProxyScheme.HTTPS}:`) {
    return 443;
  }
  if (proxy.protocol === `${ProxyScheme.SOCKS5}:`) {
    return 1080;
  }
  return 80;
}

/**
 * Opens a socket to the proxy itself (TLS handshake too for https) - no tunnel, no credentials
 */
function connectToProxy(proxy: URL, timeoutMs: number): Promise<net.Socket> {
  const host = stripBrackets(proxy.hostname);
  const port = proxyPort(proxy);
  return new Promise((resolve, reject) => {
    let socket: net.Socket;
    const done = () => {
      clearTimeout(timer);
      resolve(socket);
    };
    if (proxy.protocol === `${ProxyScheme.HTTPS}:`) {
      socket = tls.connect({ host: host, port: port, servername: host }, done);
    } else {
      socket = net.connect({ host: host, port: port }, done);
    }
    const timer = setTimeout(() => {
      socket.destroy(new ProxyTimeoutError(`No answer in ${timeoutMs} ms`));
    }, timeoutMs);
    socket.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/**
 * Is the proxy server reachable at all - DNS, TCP and (for https) TLS. The credentials are not checked here.
 */
export async function probeConnect(
  proxy: URL,
  params: ConnectProbeParams,
): Promise<ConnectProbeResult> {
  const started = Date.now();
  const socket = await connectToProxy(proxy, params.timeout);
  const latency = Date.now() - started;
  const address = socket.remoteAddress;
  const port = socket.remotePort;
  socket.destroy();
  return { latency: latency, address: address, port: port };
}
