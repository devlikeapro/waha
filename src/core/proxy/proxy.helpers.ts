import { Agent } from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { URL } from 'url';

import { WhatsappConfigService } from '@waha/config.service';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { Agents } from '@waha/core/engines/noweb/types';
import { ProxyError, UnsupportedProxySchemeError } from '@waha/core/exceptions';
import { ProxyScheme } from '@waha/structures/enums.dto';
import { ProxyConfig } from '@waha/structures/sessions.dto';

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
 * Build the proxy URL from the config: scheme (http by default) and credentials.
 * A server that already carries a scheme is kept as is.
 */
export function getProxyUrl(config: ProxyConfig): URL {
  let server = config.server.trim();
  if (!server.includes('://')) {
    const scheme = config.scheme || ProxyScheme.HTTP;
    server = `${scheme}://${server}`;
  }
  let url: URL;
  try {
    url = new URL(server);
  } catch (err) {
    throw new ProxyError(server, err);
  }
  const scheme = url.protocol.replace(/:$/, '');
  if (!Object.values(ProxyScheme).includes(scheme as ProxyScheme)) {
    throw new UnsupportedProxySchemeError(scheme);
  }
  if (config.username) {
    url.username = encodeURIComponent(config.username);
  }
  if (config.password) {
    url.password = encodeURIComponent(config.password);
  }
  return url;
}

/**
 * A copy of the URL without credentials.
 */
export function NoCredsURL(url: URL): URL {
  const copy = new URL(url.href);
  copy.username = '';
  copy.password = '';
  return copy;
}

function createProxyAgent(url: URL): Agent {
  if (url.protocol === `${ProxyScheme.SOCKS5}:`) {
    return new SocksProxyAgent(url);
  }
  return new HttpsProxyAgent(url);
}

/**
 * Return Agent proxy for the URL
 */
export function createAgentProxy(url: URL): Agents {
  const socketAgent = createProxyAgent(url);
  // Baileys media upload uses Node.js https.request in Node runtime,
  // so fetchAgent must be a Node https.Agent (ProxyAgent from undici won't work).
  const fetchAgent = createProxyAgent(url);
  return { socket: socketAgent, fetch: fetchAgent };
}
