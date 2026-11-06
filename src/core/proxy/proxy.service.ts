import { Injectable } from '@nestjs/common';
import { ProxyError, UnsupportedProxySchemeError } from '@waha/core/exceptions';
import { ProxyConfig } from '@waha/structures/sessions.dto';

import {
  ProxyConnectResult,
  ProxyErrorCode,
  ProxyExitIpResult,
  ProxyHttpMethod,
  ProxyHttpResult,
  ProxyInfo,
  ProxyProbeError,
  ProxySource,
  ProxyWebSocketResult,
} from '@waha/structures/proxy.dto';
import { ProxyAnswerError, ProxyTimeoutError } from './errors.probe';
import { ConnectProbeParams, probeConnect } from './probe.connect';
import { ExitIpProbeParams, probeExitIp } from './probe.exit-ip';
import { HttpProbeParams, probeHttp } from './probe.http';
import {
  probeWebSocket,
  ProxyDisconnectedError,
  WebSocketProbeParams,
  WebSocketProbeResult,
} from './probe.websocket';
import { getProxyUrl, NoCredsURL } from './proxy.helpers';

/**
 * Proxy info and probes on a proxy config, shaped into the API results: the probes measure or throw,
 * this is where a throw becomes ok=false with a typed error. Nothing here touches a running session.
 */
@Injectable()
export class ProxyService {
  /**
   * The proxy URL without credentials, with where the config came from
   */
  info(proxy: ProxyConfig, source: ProxySource): ProxyInfo {
    const url = getProxyUrl(proxy);
    return {
      source: source,
      url: NoCredsURL(url).href,
      username: proxy.username || null,
    };
  }

  /**
   * Is the proxy server reachable at all - the credentials are not checked here
   */
  async connect(
    proxy: ProxyConfig,
    params: ConnectProbeParams,
  ): Promise<ProxyConnectResult> {
    try {
      const url = getProxyUrl(proxy);
      const result = await probeConnect(url, params);
      return {
        ok: true,
        latency: result.latency,
        address: result.address,
        port: result.port,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        latency: null,
        address: null,
        port: null,
        error: toProbeError(err),
      };
    }
  }

  /**
   * Can a website be reached through the proxy - the credentials are checked here, and the way out to the internet
   */
  async http(
    proxy: ProxyConfig,
    params: HttpProbeParams,
  ): Promise<ProxyHttpResult> {
    try {
      const url = getProxyUrl(proxy);
      const result = await probeHttp(url, params);
      return {
        ok: true,
        url: params.url,
        method: params.method as ProxyHttpMethod,
        status: result.status,
        latency: result.latency,
        body: result.body,
        error: null,
      };
    } catch (err) {
      return {
        ok: false,
        url: params.url,
        method: params.method as ProxyHttpMethod,
        status: null,
        latency: null,
        body: null,
        error: toProbeError(err),
      };
    }
  }

  /**
   * Which IP address the internet sees behind the proxy
   */
  async exitIp(
    proxy: ProxyConfig,
    params: ExitIpProbeParams,
  ): Promise<ProxyExitIpResult> {
    try {
      const url = getProxyUrl(proxy);
      const ip = await probeExitIp(url, params);
      return { ok: true, ip: ip, url: params.url, error: null };
    } catch (err) {
      return { ok: false, ip: null, url: params.url, error: toProbeError(err) };
    }
  }

  /**
   * Does the proxy keep a WebSocket connection open for the whole duration, idle or with periodic messages
   */
  async websocket(
    proxy: ProxyConfig,
    params: WebSocketProbeParams,
  ): Promise<ProxyWebSocketResult> {
    try {
      const url = getProxyUrl(proxy);
      const result = await probeWebSocket(url, params);
      return {
        ok: true,
        url: params.url,
        duration: result.alive,
        sent: result.sent,
        received: result.received,
        error: null,
      };
    } catch (err) {
      // A drop mid-way still tells how long the connection lived
      let result: WebSocketProbeResult | null = null;
      if (err instanceof ProxyDisconnectedError) {
        result = err.result;
      }
      return {
        ok: false,
        url: params.url,
        duration: result?.alive ?? null,
        sent: result?.sent ?? 0,
        received: result?.received ?? 0,
        error: toProbeError(err),
      };
    }
  }
}

/**
 * What a probe threw, as the typed error of a failed result
 */
export function toProbeError(err: any): ProxyProbeError {
  if (err instanceof ProxyError || err instanceof UnsupportedProxySchemeError) {
    return { code: ProxyErrorCode.INVALID, message: err.message };
  }
  if (err instanceof ProxyAnswerError) {
    if (err.statusCode === 407) {
      return {
        code: ProxyErrorCode.AUTH_FAILED,
        message: 'The proxy refused the username or password (407)',
      };
    }
    return {
      code: ProxyErrorCode.REJECTED,
      message: `The proxy refused to connect to the target (${err.statusCode})`,
    };
  }
  if (err instanceof ProxyTimeoutError) {
    return { code: ProxyErrorCode.TIMEOUT, message: err.message };
  }
  if (err instanceof ProxyDisconnectedError) {
    return { code: ProxyErrorCode.DISCONNECTED, message: err.message };
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
