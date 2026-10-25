import { describe, expect, it, vi } from 'vitest';

import {
  buildContainerEnvironment,
  CONTAINER_NAME,
  type ContainerForwarder,
  type GatewayEnv,
  handleRequest,
} from '../src/gateway';
import {
  computeRuntimeFingerprint,
  ensureConfiguredContainer,
  keepaliveBackoffMs,
  type ManagedContainer,
  RUNTIME_REVISION_LABEL,
} from '../src/lifecycle';

const ADMIN_TOKEN = 'a'.repeat(48);
const DASHBOARD_PASSWORD = 'd'.repeat(48);
const QR_TOKEN = 'q'.repeat(48);
const SWAGGER_PASSWORD = 's'.repeat(48);
const WAHA_API_KEY = 'w'.repeat(48);

function createEnv(overrides: Partial<GatewayEnv> = {}): GatewayEnv {
  return {
    ADMIN_TOKEN: ADMIN_TOKEN,
    WAHA_CONFIG_REVISION: 'gows-postgresql-v1',
    WAHA_API_KEY: WAHA_API_KEY,
    WAHA_DISABLED_DASHBOARD_PASSWORD: DASHBOARD_PASSWORD,
    WAHA_DISABLED_SWAGGER_PASSWORD: SWAGGER_PASSWORD,
    WAHA_QR_ENABLED: 'false',
    WAHA_QR_TOKEN: QR_TOKEN,
    WHATSAPP_SESSIONS_POSTGRESQL_URL:
      'postgresql://waha:password@db.example.test:5432/waha?sslmode=require',
    ...overrides,
  };
}

function authorizedRequest(path: string, init: RequestInit = {}): Request {
  const headers = new Headers(init.headers);
  headers.set('authorization', `Bearer ${ADMIN_TOKEN}`);
  return new Request(`https://example.test${path}`, {
    ...init,
    headers: headers,
  });
}

describe('gateway policy', () => {
  it('answers liveness without touching the container', async () => {
    const forwarder = vi.fn<ContainerForwarder>();
    const response = await handleRequest(
      new Request('https://example.test/healthz'),
      createEnv(),
      forwarder,
    );

    expect(response.status).toBe(200);
    expect(forwarder).not.toHaveBeenCalled();
  });

  it('rejects an unauthenticated API request before touching the container', async () => {
    const forwarder = vi.fn<ContainerForwarder>();
    const response = await handleRequest(
      new Request('https://example.test/api/sessions'),
      createEnv(),
      forwarder,
    );

    expect(response.status).toBe(401);
    expect(forwarder).not.toHaveBeenCalled();
  });

  it.each([
    '/',
    '/dashboard',
    '/swagger',
    '/ws',
    '/metrics',
    '/api/server/environment',
    '/api/server/environment/',
    '/api/server/debug/status',
    '/api/server/stop',
    '/api/server/stop/',
    '/api/screenshot',
    '/api/screenshot/',
    '/api%2fserver%2fenvironment',
    '/api//sessions',
    '/api/../api/server/environment',
  ])('blocks %s without touching the container', async (path) => {
    const forwarder = vi.fn<ContainerForwarder>();
    const response = await handleRequest(
      authorizedRequest(path),
      createEnv(),
      forwarder,
    );

    expect(response.status).toBe(404);
    expect(forwarder).not.toHaveBeenCalled();
  });

  it('rejects credentials in the query string', async () => {
    const forwarder = vi.fn<ContainerForwarder>();
    const response = await handleRequest(
      new Request('https://example.test/api/sessions?x-api-key=leak'),
      createEnv(),
      forwarder,
    );

    expect(response.status).toBe(400);
    expect(forwarder).not.toHaveBeenCalled();
  });

  it('fails closed when a required runtime secret is missing', async () => {
    const forwarder = vi.fn<ContainerForwarder>();
    const response = await handleRequest(
      authorizedRequest('/api/sessions'),
      createEnv({ WAHA_API_KEY: '' }),
      forwarder,
    );

    expect(response.status).toBe(503);
    expect(forwarder).not.toHaveBeenCalled();
  });

  it.each([
    {
      name: 'PostgreSQL TLS is missing',
      override: {
        WHATSAPP_SESSIONS_POSTGRESQL_URL:
          'postgresql://waha:password@db.example.test:5432/waha',
      },
    },
    {
      name: 'PostgreSQL TLS is disabled',
      override: {
        WHATSAPP_SESSIONS_POSTGRESQL_URL:
          'postgresql://waha:password@db.example.test:5432/waha?sslmode=disable',
      },
    },
    {
      name: 'PostgreSQL verify-full is misleading in the upstream image',
      override: {
        WHATSAPP_SESSIONS_POSTGRESQL_URL:
          'postgresql://waha:password@db.example.test:5432/waha?sslmode=verify-full',
      },
    },
    {
      name: 'edge and upstream credentials are reused',
      override: { WAHA_API_KEY: ADMIN_TOKEN },
    },
    {
      name: 'the upstream key is already hashed',
      override: { WAHA_API_KEY: `sha512:${'a'.repeat(128)}` },
    },
    {
      name: 'QR and edge credentials are reused',
      override: { WAHA_QR_TOKEN: ADMIN_TOKEN },
    },
    {
      name: 'disabled UI and upstream credentials are reused',
      override: { WAHA_DISABLED_DASHBOARD_PASSWORD: WAHA_API_KEY },
    },
  ])('fails closed when $name', async ({ override }) => {
    const forwarder = vi.fn<ContainerForwarder>();
    const response = await handleRequest(
      authorizedRequest('/api/sessions'),
      createEnv(override),
      forwarder,
    );

    expect(response.status).toBe(503);
    expect(forwarder).not.toHaveBeenCalled();
  });

  it('strips edge credentials and injects only the upstream API key', async () => {
    let forwardedRequest: Request | undefined;
    const forwarder: ContainerForwarder = async (request) => {
      forwardedRequest = request;
      return new Response('{"ok":true}', {
        headers: {
          'access-control-allow-origin': '*',
          'set-cookie': 'session=secret',
          'x-powered-by': 'WAHA',
        },
      });
    };
    const response = await handleRequest(
      authorizedRequest('/api/sessions', {
        headers: {
          cookie: 'edge=session',
          'x-api-key': 'attacker-value',
          'x-forwarded-for': '192.0.2.1',
          'x-waha-gateway-event': 'scheduled',
        },
      }),
      createEnv(),
      forwarder,
    );

    expect(forwardedRequest?.headers.get('authorization')).toBeNull();
    expect(forwardedRequest?.headers.get('cookie')).toBeNull();
    expect(forwardedRequest?.headers.get('x-forwarded-for')).toBeNull();
    expect(forwardedRequest?.headers.get('x-waha-gateway-event')).toBeNull();
    expect(forwardedRequest?.headers.get('x-api-key')).toBe(WAHA_API_KEY);
    expect(forwardedRequest?.headers.get('x-waha-gateway-authenticated')).toBe(
      '1',
    );
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('keeps QR blocked until both tokens are valid', async () => {
    const forwarder = vi.fn<ContainerForwarder>(async () => new Response('qr'));
    const path = '/api/default/auth/qr';

    const disabledResponse = await handleRequest(
      authorizedRequest(path),
      createEnv(),
      forwarder,
    );
    expect(disabledResponse.status).toBe(404);
    expect(forwarder).not.toHaveBeenCalled();

    const wrongHeaderResponse = await handleRequest(
      authorizedRequest(path, {
        headers: { 'x-waha-qr-token': 'x'.repeat(48) },
      }),
      createEnv({ WAHA_QR_ENABLED: 'true' }),
      forwarder,
    );
    expect(wrongHeaderResponse.status).toBe(404);
    expect(forwarder).not.toHaveBeenCalled();

    const allowedResponse = await handleRequest(
      authorizedRequest(path, {
        headers: { 'x-waha-qr-token': QR_TOKEN },
      }),
      createEnv({ WAHA_QR_ENABLED: 'true' }),
      forwarder,
    );
    expect(allowedResponse.status).toBe(200);
    expect(allowedResponse.headers.get('cache-control')).toBe('no-store');
    expect(allowedResponse.headers.get('content-security-policy')).toContain(
      "default-src 'none'",
    );
  });

  it('returns a generic error when the upstream fails', async () => {
    const response = await handleRequest(
      authorizedRequest('/api/sessions'),
      createEnv(),
      async () => {
        throw new Error('sensitive upstream detail');
      },
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      status: 'service_unavailable',
    });
  });
});

describe('WAHA runtime environment', () => {
  it('selects GOWS and fail-closed production defaults', () => {
    const environment = buildContainerEnvironment(createEnv());

    expect(environment.WHATSAPP_DEFAULT_ENGINE).toBe('GOWS');
    expect(environment.WAHA_DASHBOARD_ENABLED).toBe('False');
    expect(environment.WAHA_DASHBOARD_USERNAME).toBe('disabled');
    expect(environment.WAHA_DASHBOARD_PASSWORD).toBe(DASHBOARD_PASSWORD);
    expect(environment.WHATSAPP_SWAGGER_ENABLED).toBe('False');
    expect(environment.WHATSAPP_SWAGGER_USERNAME).toBe('disabled');
    expect(environment.WHATSAPP_SWAGGER_PASSWORD).toBe(SWAGGER_PASSWORD);
    expect(environment.WAHA_PRINT_QR).toBe('False');
    expect(environment.WAHA_API_DOWNLOAD_MEDIA).toBe('False');
    expect(environment.WAHA_EVENTS_DOWNLOAD_MEDIA).toBe('False');
    expect(environment.WHATSAPP_API_HOSTNAME).toBe('0.0.0.0');
    expect(environment.WAHA_WORKER_RESTART_SESSIONS).toBe('True');
    expect(CONTAINER_NAME).toBe('default');
  });
});

describe('Container lifecycle', () => {
  function createContainer(
    running: boolean,
    revision?: string,
  ): ManagedContainer {
    const labels: Record<string, string> = {};
    if (revision) {
      labels[RUNTIME_REVISION_LABEL] = revision;
    }
    return {
      running: running,
      destroy: vi.fn(async () => undefined),
      inspect: vi.fn(async () => ({ labels: labels })),
      setInactivityTimeout: vi.fn(async () => undefined),
      start: vi.fn(),
    };
  }

  it('reuses a running Container only when its runtime fingerprint matches', async () => {
    const env = createEnv();
    const fingerprint = await computeRuntimeFingerprint(env);
    const container = createContainer(true, fingerprint);

    await expect(
      ensureConfiguredContainer(container, env, 60_000),
    ).resolves.toBe('reused');
    expect(container.destroy).not.toHaveBeenCalled();
    expect(container.start).not.toHaveBeenCalled();
  });

  it('replaces a running Container when its runtime revision is stale', async () => {
    const env = createEnv();
    const fingerprint = await computeRuntimeFingerprint(env);
    const container = createContainer(true, 'webjs-v0');

    await expect(
      ensureConfiguredContainer(container, env, 60_000),
    ).resolves.toBe('replaced');
    expect(container.destroy).toHaveBeenCalledOnce();
    expect(container.start).toHaveBeenCalledWith(
      expect.objectContaining({
        enableInternet: true,
        labels: {
          [RUNTIME_REVISION_LABEL]: fingerprint,
        },
      }),
    );
  });

  it('starts a stopped Container with the fail-closed environment', async () => {
    const container = createContainer(false);

    await expect(
      ensureConfiguredContainer(container, createEnv(), 60_000),
    ).resolves.toBe('started');
    expect(container.inspect).not.toHaveBeenCalled();
    expect(container.start).toHaveBeenCalledWith(
      expect.objectContaining({
        env: expect.objectContaining({
          WHATSAPP_DEFAULT_ENGINE: 'GOWS',
          WHATSAPP_SESSIONS_POSTGRESQL_URL: expect.stringContaining(
            'sslmode=require',
          ),
        }),
      }),
    );
  });

  it('changes the opaque fingerprint when a runtime secret changes', async () => {
    const original = await computeRuntimeFingerprint(createEnv());
    const changed = await computeRuntimeFingerprint(
      createEnv({ WAHA_API_KEY: 'z'.repeat(48) }),
    );

    expect(original).toMatch(/^[a-f0-9]{64}$/);
    expect(changed).toMatch(/^[a-f0-9]{64}$/);
    expect(changed).not.toBe(original);
  });

  it('keeps the runtime label name within the Cloudflare limit', () => {
    expect(
      new TextEncoder().encode(RUNTIME_REVISION_LABEL).length,
    ).toBeLessThanOrEqual(16);
  });

  it('bounds scheduled recovery backoff between fifteen and sixty minutes', () => {
    expect(keepaliveBackoffMs(1)).toBe(15 * 60 * 1000);
    expect(keepaliveBackoffMs(2)).toBe(30 * 60 * 1000);
    expect(keepaliveBackoffMs(3)).toBe(60 * 60 * 1000);
    expect(keepaliveBackoffMs(8)).toBe(60 * 60 * 1000);
  });
});
