import * as net from 'net';
import { URL } from 'url';

import { requestThroughProxy } from './probe.http';

export interface ExitIpProbeParams {
  // How long to wait for the answer, ms
  timeout: number;
  // Where to read the exit IP from, through the proxy
  url: string;
}

/**
 * Pulls the exit IP out of the answer of the lookup server
 */
export function parseExitIp(body: string): string | null {
  // JSON with a top-level "ip" (https://ipinfo.io/json)
  const json = jsonIp(body);
  if (json && net.isIP(json)) {
    return json;
  }
  // A trace with an "ip=1.2.3.4" line (https://www.cloudflare.com/cdn-cgi/trace)
  const line = body.split('\n').find((row) => row.startsWith('ip='));
  if (line) {
    const traced = line.slice('ip='.length).trim();
    if (net.isIP(traced)) {
      return traced;
    }
  }

  // The plain IP (https://ifconfig.me/ip)
  const plain = body.trim();
  if (net.isIP(plain)) {
    return plain;
  }
  return null;
}

function jsonIp(body: string): string | null {
  let data: any;
  try {
    data = JSON.parse(body);
  } catch {
    return null;
  }
  if (typeof data?.ip !== 'string') {
    return null;
  }
  return data.ip;
}

/**
 * Reads the exit IP through the proxy - the address the rest of the internet sees.
 */
export async function probeExitIp(
  proxy: URL,
  params: ExitIpProbeParams,
): Promise<string> {
  const response = await requestThroughProxy(proxy, {
    method: 'GET',
    url: params.url,
    timeout: params.timeout,
  });
  const ip = parseExitIp(response.body);
  if (!ip) {
    throw new Error(
      `No IP in the answer from ${params.url} (${response.statusCode})`,
    );
  }
  return ip;
}
