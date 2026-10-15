import axios from 'axios';
import { Agent as HttpsAgent } from 'https';
// @ts-ignore
import * as UserAgent from 'user-agents';

const SecureHttpsAgent = new HttpsAgent({
  rejectUnauthorized: true,
});

// Private IP ranges and blocked hosts for SSRF prevention
const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '169.254.169.254', // Cloud metadata endpoint
  '::1',
  '0.0.0.0',
];

const ALLOWED_SCHEMES = ['http', 'https'];

function isPrivateIP(hostname: string): boolean {
  // IPv4 private ranges
  if (hostname.startsWith('10.')) return true;
  if (hostname.startsWith('192.168.')) return true;
  if (hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) return true;

  // Link-local
  if (hostname.startsWith('169.254.')) return true;

  // Loopback
  if (hostname.startsWith('127.')) return true;

  // IPv6 private ranges (simplified)
  if (hostname.startsWith('fc') || hostname.startsWith('fd')) return true;
  if (hostname === '::1') return true;

  return false;
}

function validateUrl(urlString: string): void {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlString);
  } catch {
    throw new Error('Invalid URL format');
  }

  // Check scheme
  const scheme = parsedUrl.protocol.replace(':', '');
  if (!ALLOWED_SCHEMES.includes(scheme)) {
    throw new Error(`Invalid URL scheme: ${scheme}. Only http and https are allowed.`);
  }

  // Check for blocked hosts
  const hostname = parsedUrl.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    throw new Error('Access to internal resources is forbidden');
  }

  // Check for private IP ranges
  if (isPrivateIP(hostname)) {
    throw new Error('Access to private networks is forbidden');
  }

  // Additional check for IP address format to prevent bypasses
  if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    const parts = hostname.split('.').map(Number);
    if (parts.some(p => p > 255)) {
      throw new Error('Invalid IP address');
    }
  }
}

export async function fetchBuffer(url: string): Promise<Buffer> {
  // Validate URL before making request
  validateUrl(url);

  const userAgent = new UserAgent();
  return axios
    .get(url, {
      responseType: 'arraybuffer',
      httpsAgent: SecureHttpsAgent,
      maxRedirects: 0, // Disable redirects to prevent SSRF bypasses
      headers: {
        'User-Agent': userAgent.toString(),
      },
      timeout: 30000, // 30 second timeout
    })
    .then((res) => {
      return Buffer.from(res.data);
    });
}
