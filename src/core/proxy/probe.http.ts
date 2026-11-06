import * as http from 'http';
import * as https from 'https';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { URL } from 'url';

import { ProxyScheme } from '@waha/structures/enums.dto';

import { ProxyTimeoutError } from './errors.probe';
import { tunnelConnection } from './utils.tunnel';

const MAX_BODY_BYTES = 16 * 1024;

export interface HttpProbeParams {
  // GET or HEAD
  method: string;
  // The server to reach through the proxy
  url: string;
  // How long to wait for the answer, ms
  timeout: number;
}

export interface ProxyResponse {
  statusCode: number;
  body: string;
}

/**
 * One request through the proxy. Always settles within the timeout and closes what it opened.
 */
export function requestThroughProxy(
  proxy: URL,
  request: HttpProbeParams,
): Promise<ProxyResponse> {
  const { method, url, timeout } = request;
  const destination = new URL(url);
  const secure = destination.protocol === 'https:';
  const port = Number(destination.port) || (secure ? 443 : 80);
  const transport = secure ? https : http;
  // curl-like agent + text/plain
  // ifconfig.me, ifconfig.co and friends answer a bare IP, not HTML
  const options: https.RequestOptions = {
    method: method,
    headers: { 'user-agent': 'curl/8.0.0', accept: 'text/plain' },
  };
  let agent: SocksProxyAgent | null = null;
  if (proxy.protocol === `${ProxyScheme.SOCKS5}:`) {
    agent = new SocksProxyAgent(proxy, { timeout: timeout });
    options.agent = agent;
  } else {
    options.createConnection = tunnelConnection(
      proxy,
      destination.hostname,
      port,
      secure,
      timeout,
    );
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    function finish(err: Error | null, response?: ProxyResponse) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      outgoing.destroy();
      agent?.destroy();
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    }

    const outgoing = transport.request(url, options, (response) => {
      const chunks: Buffer[] = [];
      let size = 0;
      response.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size <= MAX_BODY_BYTES) {
          chunks.push(chunk);
        }
      });
      response.on('end', () => {
        finish(null, {
          statusCode: response.statusCode,
          body: Buffer.concat(chunks).toString('utf8'),
        });
      });
      response.on('error', (err) => finish(err));
    });
    // Destroy emits no 'error' while the tunnel is pending
    const timer = setTimeout(() => {
      finish(new ProxyTimeoutError(`No answer in ${timeout} ms`));
    }, timeout);
    outgoing.on('error', (err) => finish(err));
    outgoing.end();
  });
}

export interface HttpProbeResult {
  // The HTTP status the server answered with
  status: number;
  // What the server answered, up to a few KB - empty for HEAD
  body: string;
  // Round trip through the proxy, ms
  latency: number;
}

/**
 * Reaches a server through the proxy. Any HTTP answer means the credentials, the tunnel and the TLS handshake worked.
 */
export async function probeHttp(
  proxy: URL,
  params: HttpProbeParams,
): Promise<HttpProbeResult> {
  const started = Date.now();
  const response = await requestThroughProxy(proxy, params);
  return {
    status: response.statusCode,
    body: response.body,
    latency: Date.now() - started,
  };
}
