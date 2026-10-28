import * as https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { URL } from 'url';

import { WhatsappConfigService } from '../config.service';
import { ProxyConfig } from '../structures/sessions.dto';
import { WhatsappSession } from './abc/session.abc';
import { Agents } from '@waha/core/engines/noweb/types';

export function getProxyConfig(
  config: WhatsappConfigService,
  sessions: Record<string, WhatsappSession>,
  sessionName: string,
): ProxyConfig | undefined {
  // Single proxy server configuration
  if (typeof config.proxyServer === 'string') {
    return {
      server: config.proxyServer,
      username: config.proxyServerUsername,
      password: config.proxyServerPassword,
    };
  }

  // Multiple proxy server configuration
  if (Array.isArray(config.proxyServer)) {
    const prefix = config.proxyServerIndexPrefix;
    let indexToUse: number | undefined = undefined;
    if (prefix && sessionName.includes(prefix)) {
      // match numbers at the end of the string
      const matches = sessionName.match(/\d+$/);
      indexToUse = matches ? parseInt(matches[0], 10) : undefined;
    }
    let idx = 0;
    idx = Object.keys(sessions).length % config.proxyServer.length;
    const index = indexToUse ? indexToUse % config.proxyServer.length : idx;
    return {
      server: config.proxyServer[index],
      username: config.proxyServerUsername,
      password: config.proxyServerPassword,
    };
  }

  // No proxy server configuration
  return undefined;
}

/**
 * The proxy address without the credentials - safe to log and to return.
 */
export function describeProxy(proxyUrl: string): string {
  const url = new URL(proxyUrl);
  return `${url.protocol}//${url.host}`;
}

function createProxyAgent(proxyUrl: string): https.Agent {
  const url = new URL(proxyUrl);
  if (url.protocol.startsWith('socks')) {
    return new SocksProxyAgent(url);
  }
  return new HttpsProxyAgent(url);
}

// Encodes a lone "%" and keeps a %XX already encoded by hand
function escapeLonePercent(value: string): string {
  return value.replace(/%(?![0-9a-fA-F]{2})/g, '%25');
}

/**
 * Proxy URL that keeps the server scheme (http by default) and encodes the credentials
 */
export function buildProxyUrl(config: ProxyConfig): string {
  let server = config.server.trim();
  if (!server.includes('://')) {
    server = `http://${server}`;
  }
  let url: URL;
  try {
    url = new URL(server);
  } catch (err) {
    // Never echo the server: it may carry credentials
    throw new Error('Invalid proxy server address');
  }
  if (config.username) {
    url.username = escapeLonePercent(config.username);
  }
  if (config.password) {
    url.password = escapeLonePercent(config.password);
  }
  return url.toString();
}

/**
 * Return https Agent proxy for the config
 * @param proxyConfig
 */
export function createAgentProxy(proxyConfig: ProxyConfig): Agents | undefined {
  const url = buildProxyUrl(proxyConfig);

  const socketAgent = createProxyAgent(url);
  // Baileys media upload uses Node.js https.request in Node runtime,
  // so fetchAgent must be a Node https.Agent (ProxyAgent from undici won't work).
  const fetchAgent = createProxyAgent(url);

  return { socket: socketAgent, fetch: fetchAgent };
}
