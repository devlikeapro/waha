import { Agent } from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { URL } from 'url';

import { WhatsappConfigService } from '../config.service';
import { ProxyScheme } from '../structures/enums.dto';
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
      scheme: config.proxyServerScheme as ProxyScheme,
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
      scheme: config.proxyServerScheme as ProxyScheme,
      server: config.proxyServer[index],
      username: config.proxyServerUsername,
      password: config.proxyServerPassword,
    };
  }

  // No proxy server configuration
  return undefined;
}

/**
 * Proxy server URL with the configured scheme (http by default).
 */
export function getProxyServerUrl(config: ProxyConfig): string {
  const server = config.server.trim();
  if (server.includes('://')) {
    return server;
  }
  const scheme = config.scheme || ProxyScheme.HTTP;
  return `${scheme}://${server}`;
}

/**
 * Proxy URL with the credentials, percent-encoded
 */
export function getAuthenticatedUrl(proxyConfig: ProxyConfig): string {
  const parsedUrl = new URL(getProxyServerUrl(proxyConfig));
  parsedUrl.username = proxyConfig.username || '';
  parsedUrl.password = proxyConfig.password || '';
  return parsedUrl.toString();
}

function createProxyAgent(url: string): Agent {
  if (url.startsWith(`${ProxyScheme.SOCKS5}://`)) {
    return new SocksProxyAgent(url);
  }
  return new HttpsProxyAgent(url);
}

/**
 * Return Agent proxy for the config
 * @param proxyConfig
 */
export function createAgentProxy(proxyConfig: ProxyConfig): Agents | undefined {
  const url = getAuthenticatedUrl(proxyConfig);
  const socketAgent = createProxyAgent(url);
  // Baileys media upload uses Node.js https.request in Node runtime,
  // so fetchAgent must be a Node https.Agent (ProxyAgent from undici won't work).
  const fetchAgent = createProxyAgent(url);
  return { socket: socketAgent, fetch: fetchAgent };
}
