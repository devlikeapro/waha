const UTF8 = new TextEncoder();
const MINIMUM_TOKEN_LENGTH = 32;

const ALLOWED_METHODS = new Set([
  'DELETE',
  'GET',
  'HEAD',
  'PATCH',
  'POST',
  'PUT',
]);

const STRIPPED_REQUEST_HEADERS = [
  'authorization',
  'cf-connecting-ip',
  'cf-connecting-ipv6',
  'connection',
  'cookie',
  'forwarded',
  'proxy-authorization',
  'true-client-ip',
  'x-api-key',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-waha-gateway-authenticated',
  'x-waha-gateway-event',
  'x-waha-qr-token',
];

const STRIPPED_RESPONSE_HEADERS = [
  'access-control-allow-credentials',
  'access-control-allow-headers',
  'access-control-allow-methods',
  'access-control-allow-origin',
  'server',
  'set-cookie',
  'x-powered-by',
];

const BLOCKED_EXACT_PATHS = new Set([
  '/api/screenshot',
  '/api/server/environment',
  '/api/server/stop',
]);

const BLOCKED_PATH_PREFIXES = [
  '/api/server/debug',
  '/dashboard',
  '/jobs',
  '/mcp',
  '/metrics',
  '/swagger',
  '/ws',
];

const CREDENTIAL_QUERY_KEYS = new Set([
  'api_key',
  'authorization',
  'token',
  'x-api-key',
]);

export type RouteKind = 'api' | 'health' | 'liveness' | 'qr' | 'readiness';

export interface RouteDecision {
  kind?: RouteKind;
  status: 'allow' | 'bad-request' | 'method-not-allowed' | 'not-found';
}

type TimingSafeSubtleCrypto = SubtleCrypto & {
  timingSafeEqual?: (left: BufferSource, right: BufferSource) => boolean;
};

export function classifyRequest(request: Request): RouteDecision {
  if (!ALLOWED_METHODS.has(request.method.toUpperCase())) {
    return { status: 'method-not-allowed' };
  }

  const rawPath = getRawPath(request.url);
  if (!isCanonicalPath(rawPath)) {
    return { status: 'not-found' };
  }

  const url = new URL(request.url);
  for (const key of url.searchParams.keys()) {
    if (CREDENTIAL_QUERY_KEYS.has(key.toLowerCase())) {
      return { status: 'bad-request' };
    }
  }

  const path = url.pathname;
  const lowerPath = path.toLowerCase();

  if (path === '/healthz') {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return { status: 'method-not-allowed' };
    }
    return { kind: 'liveness', status: 'allow' };
  }

  if (path === '/readyz') {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return { status: 'method-not-allowed' };
    }
    return { kind: 'readiness', status: 'allow' };
  }

  if (
    [...BLOCKED_EXACT_PATHS].some(
      (blocked) =>
        lowerPath === blocked || lowerPath.startsWith(`${blocked}/`),
    )
  ) {
    return { status: 'not-found' };
  }

  if (
    BLOCKED_PATH_PREFIXES.some(
      (prefix) => lowerPath === prefix || lowerPath.startsWith(`${prefix}/`),
    )
  ) {
    return { status: 'not-found' };
  }

  if (/^\/api\/[^/]+\/auth\/qr(?:\/|$)/i.test(path)) {
    return { kind: 'qr', status: 'allow' };
  }

  if (path === '/health') {
    return { kind: 'health', status: 'allow' };
  }

  if (path.startsWith('/api/')) {
    return { kind: 'api', status: 'allow' };
  }

  return { status: 'not-found' };
}

export function getBearerToken(request: Request): string | undefined {
  const authorization = request.headers.get('authorization');
  if (!authorization) {
    return undefined;
  }
  const match = /^Bearer ([^\s,]+)$/.exec(authorization);
  return match?.[1];
}

export function getQrToken(request: Request): string | undefined {
  const token = request.headers.get('x-waha-qr-token');
  if (!token || token.includes(',')) {
    return undefined;
  }
  return token;
}

export function isUsableToken(value: string | undefined): value is string {
  return typeof value === 'string' && value.length >= MINIMUM_TOKEN_LENGTH;
}

export async function secureTokenEqual(
  candidate: string | undefined,
  expected: string,
): Promise<boolean> {
  const candidateValue = candidate ?? '';
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', UTF8.encode(candidateValue)),
    crypto.subtle.digest('SHA-256', UTF8.encode(expected)),
  ]);
  const left = new Uint8Array(candidateHash);
  const right = new Uint8Array(expectedHash);
  const subtle = crypto.subtle as TimingSafeSubtleCrypto;
  if (subtle.timingSafeEqual) {
    return subtle.timingSafeEqual(left, right);
  }

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index]! ^ right[index]!;
  }
  return difference === 0;
}

export function buildContainerRequest(
  request: Request,
  upstreamApiKey: string,
): Request {
  const headers = new Headers(request.headers);
  for (const header of STRIPPED_REQUEST_HEADERS) {
    headers.delete(header);
  }
  headers.set('x-api-key', upstreamApiKey);
  headers.set('x-waha-gateway-authenticated', '1');
  return new Request(request, { headers: headers });
}

export function secureResponse(response: Response, routeKind: RouteKind): Response {
  const headers = new Headers(response.headers);
  for (const header of STRIPPED_RESPONSE_HEADERS) {
    headers.delete(header);
  }
  headers.set('cache-control', 'no-store');
  headers.set('referrer-policy', 'no-referrer');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-frame-options', 'DENY');
  if (routeKind === 'qr') {
    headers.set(
      'content-security-policy',
      "default-src 'none'; frame-ancestors 'none'",
    );
    headers.set('pragma', 'no-cache');
  }
  return new Response(response.body, {
    headers: headers,
    status: response.status,
    statusText: response.statusText,
  });
}

function getRawPath(url: string): string {
  const withoutOrigin = url.replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]+/i, '');
  const queryIndex = withoutOrigin.search(/[?#]/);
  if (queryIndex === -1) {
    return withoutOrigin || '/';
  }
  return withoutOrigin.slice(0, queryIndex) || '/';
}

function isCanonicalPath(path: string): boolean {
  if (!path.startsWith('/') || path.includes('\\') || path.includes('%')) {
    return false;
  }
  if (path.includes('//')) {
    return false;
  }
  return !/(?:^|\/)\.\.?(?:\/|$)/.test(path);
}
