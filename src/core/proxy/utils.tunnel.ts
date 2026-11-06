import * as http from 'http';
import * as https from 'https';
import * as net from 'net';
import * as tls from 'tls';
import { URL } from 'url';

import { ProxyScheme } from '@waha/structures/enums.dto';

import { ProxyAnswerError, ProxyTimeoutError } from './errors.probe';

export function stripBrackets(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, '');
}

/**
 * Plain CONNECT request: https-proxy-agent cannot be cancelled while a proxy holds it unanswered
 */
function openHttpTunnel(
  proxy: URL,
  host: string,
  port: number,
  timeoutMs: number,
): Promise<net.Socket> {
  const secureProxy = proxy.protocol === `${ProxyScheme.HTTPS}:`;
  const transport = secureProxy ? https : http;
  const authority = `${host}:${port}`;
  const headers: http.OutgoingHttpHeaders = { host: authority };
  if (proxy.username || proxy.password) {
    const username = decodeURIComponent(proxy.username);
    const password = decodeURIComponent(proxy.password);
    const credentials = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );
    headers['proxy-authorization'] = `Basic ${credentials}`;
  }
  return new Promise((resolve, reject) => {
    const request = transport.request({
      host: stripBrackets(proxy.hostname),
      port: Number(proxy.port) || (secureProxy ? 443 : 80),
      method: 'CONNECT',
      path: authority,
      headers: headers,
    });
    const timer = setTimeout(() => {
      request.destroy(new ProxyTimeoutError(`No answer in ${timeoutMs} ms`));
    }, timeoutMs);
    // Node emits 'connect' for every answer to a CONNECT; only 2xx opens the tunnel
    request.on('connect', (response, socket) => {
      clearTimeout(timer);
      if (response.statusCode < 200 || response.statusCode >= 300) {
        socket.destroy();
        reject(new ProxyAnswerError(response.statusCode));
        return;
      }
      resolve(socket);
    });
    request.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    request.end();
  });
}

/**
 * createConnection for http.request: the socket comes through the proxy tunnel (TLS on top for https targets).
 * Node skips the agent when createConnection is given, so the request never reuses a pooled socket.
 */
export function tunnelConnection(
  proxy: URL,
  hostname: string,
  port: number,
  secure: boolean,
  timeoutMs: number,
): https.RequestOptions['createConnection'] {
  return (args, oncreate) => {
    openHttpTunnel(proxy, hostname, port, timeoutMs).then(
      (socket) => {
        if (!secure) {
          oncreate(null, socket);
          return;
        }
        const servername = stripBrackets(hostname);
        oncreate(null, tls.connect({ socket: socket, servername: servername }));
      },
      (err) => oncreate(err, null),
    );
    return undefined;
  };
}
