import {
  buildContainerRequest,
  classifyRequest,
  getBearerToken,
  getQrToken,
  isUsableToken,
  secureResponse,
  secureTokenEqual,
} from './policy';

// Preserve the live Worker's existing getByName("default") identity. Changing
// this string would create a different Durable Object instead of migrating it.
export const CONTAINER_NAME = 'default';
export const CONTAINER_PORT = 3000;

export interface GatewayEnv {
  ADMIN_TOKEN: string;
  WAHA_CONFIG_REVISION: string;
  WAHA_API_KEY: string;
  WAHA_DISABLED_DASHBOARD_PASSWORD: string;
  WAHA_DISABLED_SWAGGER_PASSWORD: string;
  WAHA_PUBLIC_BASE_URL: string;
  WAHA_QR_ENABLED: string;
  WAHA_QR_TOKEN: string;
  WHATSAPP_SESSIONS_POSTGRESQL_URL: string;
}

export type ContainerForwarder = (request: Request) => Promise<Response>;

export async function handleRequest(
  request: Request,
  env: GatewayEnv,
  forwarder: ContainerForwarder,
): Promise<Response> {
  const decision = classifyRequest(request);
  if (decision.status === 'method-not-allowed') {
    return jsonResponse(405, 'method_not_allowed');
  }
  if (decision.status === 'bad-request') {
    return jsonResponse(400, 'credentials_must_use_headers');
  }
  if (decision.status === 'not-found' || !decision.kind) {
    return jsonResponse(404, 'not_found');
  }
  if (decision.kind === 'liveness') {
    return jsonResponse(200, 'ok');
  }

  if (!isValidRuntimeConfig(env)) {
    return jsonResponse(503, 'service_unavailable');
  }

  const authenticated = await secureTokenEqual(
    getBearerToken(request),
    env.ADMIN_TOKEN,
  );
  if (!authenticated) {
    return jsonResponse(401, 'unauthorized', {
      'www-authenticate': 'Bearer',
    });
  }

  if (decision.kind === 'qr') {
    if (env.WAHA_QR_ENABLED !== 'true') {
      return jsonResponse(404, 'not_found');
    }
    const qrAuthenticated = await secureTokenEqual(
      getQrToken(request),
      env.WAHA_QR_TOKEN,
    );
    if (!qrAuthenticated) {
      return jsonResponse(404, 'not_found');
    }
  }

  const containerRequest = buildContainerRequest(request, env.WAHA_API_KEY);
  try {
    const response = await forwarder(containerRequest);
    return secureResponse(response, decision.kind);
  } catch {
    return jsonResponse(503, 'service_unavailable');
  }
}

export function buildContainerEnvironment(
  env: GatewayEnv,
): Record<string, string> {
  if (!isValidRuntimeConfig(env)) {
    throw new Error('WAHA runtime configuration is incomplete');
  }

  return {
    NODE_OPTIONS: '--max-old-space-size=3072',
    WAHA_API_DOWNLOAD_MEDIA: 'False',
    WAHA_BASE_URL: env.WAHA_PUBLIC_BASE_URL,
    WAHA_API_KEY: env.WAHA_API_KEY,
    WAHA_DASHBOARD_ENABLED: 'False',
    WAHA_DASHBOARD_PASSWORD: env.WAHA_DISABLED_DASHBOARD_PASSWORD,
    WAHA_DASHBOARD_USERNAME: 'disabled',
    WAHA_DEBUG_MODE: 'False',
    WAHA_EVENTS_DOWNLOAD_MEDIA: 'False',
    WAHA_HTTP_STRICT_MODE: '1',
    WAHA_LOG_FORMAT: 'JSON',
    WAHA_LOG_LEVEL: 'warn',
    WAHA_PRINT_QR: 'False',
    WAHA_WORKER_ID: CONTAINER_NAME,
    WAHA_WORKER_RESTART_SESSIONS: 'True',
    WHATSAPP_API_HOSTNAME: '0.0.0.0',
    WHATSAPP_API_PORT: String(CONTAINER_PORT),
    WHATSAPP_DEFAULT_ENGINE: 'GOWS',
    WHATSAPP_SESSIONS_POSTGRESQL_URL:
      env.WHATSAPP_SESSIONS_POSTGRESQL_URL,
    WHATSAPP_SWAGGER_ENABLED: 'False',
    WHATSAPP_SWAGGER_PASSWORD: env.WAHA_DISABLED_SWAGGER_PASSWORD,
    WHATSAPP_SWAGGER_USERNAME: 'disabled',
  };
}

export function jsonResponse(
  status: number,
  code: string,
  extraHeaders: Record<string, string> = {},
): Response {
  const headers = new Headers(extraHeaders);
  headers.set('cache-control', 'no-store');
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('referrer-policy', 'no-referrer');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-frame-options', 'DENY');
  return new Response(JSON.stringify({ status: code }), {
    headers: headers,
    status: status,
  });
}

function isValidRuntimeConfig(env: GatewayEnv): boolean {
  const credentials = [
    env.ADMIN_TOKEN,
    env.WAHA_API_KEY,
    env.WAHA_DISABLED_DASHBOARD_PASSWORD,
    env.WAHA_DISABLED_SWAGGER_PASSWORD,
    env.WAHA_QR_TOKEN,
  ];
  if (!credentials.every((value) => isUsableToken(value))) {
    return false;
  }
  if (
    env.WAHA_API_KEY.toLowerCase().startsWith('sha512:') ||
    new Set(credentials).size !== credentials.length
  ) {
    return false;
  }
  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/i.test(env.WAHA_CONFIG_REVISION)) {
    return false;
  }
  if (env.WAHA_QR_ENABLED !== 'true' && env.WAHA_QR_ENABLED !== 'false') {
    return false;
  }
  if (!isValidPublicBaseUrl(env.WAHA_PUBLIC_BASE_URL)) {
    return false;
  }
  try {
    const url = new URL(env.WHATSAPP_SESSIONS_POSTGRESQL_URL);
    const sslMode = url.searchParams.get('sslmode')?.toLowerCase();
    return (
      (url.protocol === 'postgres:' || url.protocol === 'postgresql:') &&
      Boolean(url.hostname) &&
      Boolean(url.username) &&
      Boolean(url.password) &&
      url.pathname.length > 1 &&
      sslMode === 'require'
    );
  } catch {
    return false;
  }
}

function isValidPublicBaseUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.username === '' &&
      url.password === '' &&
      url.pathname === '/' &&
      url.search === '' &&
      url.hash === '' &&
      value === url.origin
    );
  } catch {
    return false;
  }
}
