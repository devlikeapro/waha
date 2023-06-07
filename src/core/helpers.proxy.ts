import { WhatsappConfigService } from '../config.service';
import { WhatsappSession, ProxyConfig } from './abc/session.abc';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent } from 'https';
import { URL } from 'url';

export function getProxyConfig(
  config: WhatsappConfigService,
  sessions: Record<string, WhatsappSession>,
  sessionName?: string,
): ProxyConfig | undefined {
  // Single proxy server configuration
  if (typeof config.proxyServer === 'string') {
    return {
      proxyServer: config.proxyServer,
      proxyUsername: config.proxyServerUsername,
      proxyPassword: config.proxyServerPassword,
    };
  }

  // Multiple proxy server configuration
  if (Array.isArray(config.proxyServer)) {
    const prefix = config.proxyServerIndexPrefix;
    let indexToUse: number = undefined;
    if (prefix && sessionName.includes(prefix)) {
      // match numbers at the end of the string
      const matches = sessionName.match(/\d+$/);
      indexToUse = matches ? parseInt(matches[0], 10) : undefined;
    }
    let idx = 0;
    idx = Object.keys(sessions).length % config.proxyServer.length;
    const index = indexToUse ? indexToUse % config.proxyServer.length : idx;
    return {
      proxyServer: config.proxyServer[index],
      proxyUsername: config.proxyServerUsername,
      proxyPassword: config.proxyServerPassword,
    };
  }

  // No proxy server configuration
  return undefined;
}

function getAuthenticatedUrl(
  url: string,
  username: string,
  password: string,
): string {
  const parsedUrl = new URL(url);
  parsedUrl.protocol = parsedUrl.protocol || 'http';
  parsedUrl.username = username;
  parsedUrl.password = password;
  return parsedUrl.toString();
}

/**
 * Return https Agent proxy for the config
 * @param proxyConfig
 */
export function createAgentProxy(proxyConfig: ProxyConfig): Agent | undefined {
  const url = getAuthenticatedUrl(
    proxyConfig.proxyServer,
    proxyConfig.proxyUsername,
    proxyConfig.proxyPassword,
  );
  return new HttpsProxyAgent(url);
}
