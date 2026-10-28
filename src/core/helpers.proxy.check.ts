import * as http from 'http';
import * as https from 'https';
import * as net from 'net';
import * as tls from 'tls';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { URL } from 'url';

import { ProxyCheckError, ProxyErrorCode } from '@waha/structures/sessions.dto';

// The schemes every engine can dial (whatsmeow in GOWS accepts only these)
const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'socks5:'];

const WHATSAPP_URL = 'https://web.whatsapp.com/';

const MAX_BODY_BYTES = 16 * 1024;

export interface ProxyCheckOptions {
  timeoutMs: number;
  // Where to read the exit IP through the proxy - empty skips the lookup
  ipUrl: string;
}

export interface ProxyCheckResult {
  ok: boolean;
  latency: number | null;
  ip: string | null;
  error: ProxyCheckError | null;
  // Why the exit IP is missing while WhatsApp was reachable
  ipError: string | null;
}

class ProxyTimeoutError extends Error {}

/**
 * The proxy answered the CONNECT itself (407, 403, 502...) instead of opening the tunnel.
 */
class ProxyAnswerError extends Error {
  constructor(public statusCode: number) {
    super(`The proxy answered ${statusCode}`);
  }
}

interface ProxyResponse {
  statusCode: number;
  body: string;
}

function stripBrackets(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, '');
}

// Plain CONNECT request: https-proxy-agent cannot be cancelled while a proxy holds it unanswered
function openHttpTunnel(
  proxy: URL,
  host: string,
  port: number,
  timeoutMs: number,
): Promise<net.Socket> {
  const secureProxy = proxy.protocol === 'https:';
  const transport = secureProxy ? https : http;
  const authority = `${host}:${port}`;
  const headers: http.OutgoingHttpHeaders = { host: authority };
  if (proxy.username || proxy.password) {
    const credentials = `${decodeURIComponent(
      proxy.username,
    )}:${decodeURIComponent(proxy.password)}`;
    headers['proxy-authorization'] = `Basic ${Buffer.from(credentials).toString(
      'base64',
    )}`;
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
 * One request through the proxy. Always settles in timeoutMs and closes what it opened.
 */
function requestThroughProxy(
  proxyUrl: string,
  target: string,
  method: string,
  timeoutMs: number,
): Promise<ProxyResponse> {
  const proxy = new URL(proxyUrl);
  const destination = new URL(target);
  const secure = destination.protocol === 'https:';
  const port = Number(destination.port) || (secure ? 443 : 80);
  const transport = secure ? https : http;
  const options: https.RequestOptions = { method: method };
  let agent: SocksProxyAgent | null = null;
  if (proxy.protocol === 'socks5:') {
    agent = new SocksProxyAgent(proxy, { timeout: timeoutMs });
    options.agent = agent;
  } else {
    options.createConnection = (args, oncreate) => {
      openHttpTunnel(proxy, destination.hostname, port, timeoutMs).then(
        (socket) => {
          if (!secure) {
            oncreate(null, socket);
            return;
          }
          const servername = stripBrackets(destination.hostname);
          oncreate(
            null,
            tls.connect({ socket: socket, servername: servername }),
          );
        },
        (err) => oncreate(err, null),
      );
      return undefined;
    };
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    function finish(err: Error | null, response?: ProxyResponse) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      request.destroy();
      agent?.destroy();
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    }

    const request = transport.request(target, options, (response) => {
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
      finish(new ProxyTimeoutError(`No answer in ${timeoutMs} ms`));
    }, timeoutMs);
    request.on('error', (err) => finish(err));
    request.end();
  });
}

function toProxyCheckError(err: any): ProxyCheckError {
  if (err instanceof ProxyAnswerError) {
    if (err.statusCode === 407) {
      return {
        code: ProxyErrorCode.AUTH_FAILED,
        message: 'The proxy refused the username or password (407)',
      };
    }
    return {
      code: ProxyErrorCode.REJECTED,
      message: `The proxy refused to connect to WhatsApp (${err.statusCode})`,
    };
  }
  if (err instanceof ProxyTimeoutError) {
    return { code: ProxyErrorCode.TIMEOUT, message: err.message };
  }
  const code = err?.code;
  const message = String(err?.message ?? err);
  if (code === 'ECONNREFUSED') {
    return {
      code: ProxyErrorCode.CONNECTION_REFUSED,
      message: `The proxy refused the connection: ${message}`,
    };
  }
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
    return {
      code: ProxyErrorCode.HOST_NOT_FOUND,
      message: `Could not resolve the host: ${message}`,
    };
  }
  if (code === 'ETIMEDOUT' || /timed? ?out/i.test(message)) {
    return { code: ProxyErrorCode.TIMEOUT, message: message };
  }
  // SOCKS reports these as plain errors
  if (/authentication/i.test(message)) {
    return {
      code: ProxyErrorCode.AUTH_FAILED,
      message: `The proxy refused the username or password: ${message}`,
    };
  }
  if (/socks/i.test(message)) {
    return { code: ProxyErrorCode.REJECTED, message: message };
  }
  return { code: ProxyErrorCode.FAILED, message: message };
}

/**
 * Pulls the IP from a Cloudflare trace ("ip=1.2.3.4" line) or a plain-text IP answer.
 */
export function parseExitIp(body: string): string | null {
  const line = body.split('\n').find((row) => row.startsWith('ip='));
  let value = body;
  if (line) {
    value = line.slice('ip='.length);
  }
  value = value.trim();
  if (!net.isIP(value)) {
    return null;
  }
  return value;
}

/**
 * Reaches WhatsApp through the proxy, then reads the exit IP the way the rest of the internet sees it.
 */
export async function checkProxy(
  proxyUrl: string,
  options: ProxyCheckOptions,
): Promise<ProxyCheckResult> {
  const protocol = new URL(proxyUrl).protocol;
  if (!SUPPORTED_PROTOCOLS.includes(protocol)) {
    return {
      ok: false,
      latency: null,
      ip: null,
      error: {
        code: ProxyErrorCode.INVALID,
        message: `Unsupported proxy scheme '${protocol}' - use http://, https:// or socks5://`,
      },
      ipError: null,
    };
  }

  const started = Date.now();
  try {
    // Any HTTP answer means the tunnel and the TLS handshake with WhatsApp worked
    await requestThroughProxy(
      proxyUrl,
      WHATSAPP_URL,
      'HEAD',
      options.timeoutMs,
    );
  } catch (err) {
    return {
      ok: false,
      latency: null,
      ip: null,
      error: toProxyCheckError(err),
      ipError: null,
    };
  }
  const latency = Date.now() - started;

  if (!options.ipUrl) {
    return { ok: true, latency: latency, ip: null, error: null, ipError: null };
  }
  let ip: string | null = null;
  let ipError: string | null = null;
  try {
    const response = await requestThroughProxy(
      proxyUrl,
      options.ipUrl,
      'GET',
      options.timeoutMs,
    );
    ip = parseExitIp(response.body);
    if (!ip) {
      ipError = `No IP in the answer from ${options.ipUrl} (${response.statusCode})`;
    }
  } catch (err) {
    ipError = toProxyCheckError(err).message;
  }
  return { ok: true, latency: latency, ip: ip, error: null, ipError: ipError };
}
