import { DurableObject } from 'cloudflare:workers';

import {
  CONTAINER_NAME,
  CONTAINER_PORT,
  type GatewayEnv,
  handleRequest,
  jsonResponse,
} from './gateway';
import {
  ensureConfiguredContainer,
  keepaliveBackoffMs,
} from './lifecycle';
import { type RouteKind } from './policy';

const INACTIVITY_TIMEOUT_MS = 6 * 60 * 60 * 1000;
const BACKUP_ALARM_INTERVAL_MS = 15 * 60 * 1000;
const READINESS_ATTEMPTS = 30;
const READINESS_INTERVAL_MS = 500;
const READINESS_REQUEST_TIMEOUT_MS = 1_000;
const KEEPALIVE_FAILURES_KEY = 'keepaliveFailures';
const KEEPALIVE_RETRY_AT_KEY = 'keepaliveRetryAt';
const INTERNAL_KEEPALIVE_PATH = '/__internal/keepalive';

export interface Env extends GatewayEnv {
  WAHA: DurableObjectNamespace<WahaContainer>;
}

export class WahaContainer extends DurableObject<Env> {
  private readinessPromise?: Promise<void>;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    const container = ctx.container;
    if (container?.running) {
      void ctx.blockConcurrencyWhile(async () => {
        await container.setInactivityTimeout(INACTIVITY_TIMEOUT_MS);
        await this.scheduleAlarm(BACKUP_ALARM_INTERVAL_MS);
      });
    }
  }

  override async fetch(request: Request): Promise<Response> {
    if (request.headers.get('x-waha-gateway-authenticated') !== '1') {
      return jsonResponse(403, 'forbidden');
    }

    const url = new URL(request.url);
    if (
      url.pathname === INTERNAL_KEEPALIVE_PATH &&
      request.headers.get('x-waha-gateway-event') === 'scheduled'
    ) {
      return this.runKeepalive();
    }

    await this.ensureReady();
    await this.noteReady();
    if (url.pathname === '/readyz') {
      return jsonResponse(200, 'ready');
    }

    let routeKind: RouteKind = 'api';
    if (url.pathname === '/health') {
      routeKind = 'health';
    } else if (/^\/api\/[^/]+\/auth\/qr(?:\/|$)/i.test(url.pathname)) {
      routeKind = 'qr';
    }

    const upstreamUrl = new URL(url.pathname + url.search, 'http://waha.local');
    const upstreamHeaders = new Headers(request.headers);
    upstreamHeaders.set('x-api-key', this.env.WAHA_API_KEY);
    const upstreamRequest = new Request(upstreamUrl, {
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : request.body,
      headers: upstreamHeaders,
      method: request.method,
      redirect: 'manual',
    });
    const response = await this.getContainer()
      .getTcpPort(CONTAINER_PORT)
      .fetch(upstreamRequest);

    return response;
  }

  override async alarm(): Promise<void> {
    await this.runKeepalive();
  }

  private async runKeepalive(): Promise<Response> {
    const now = Date.now();
    const retryAt =
      (await this.ctx.storage.get<number>(KEEPALIVE_RETRY_AT_KEY)) ?? 0;
    if (retryAt > now) {
      await this.scheduleAlarm(retryAt - now);
      return new Response(null, { status: 204 });
    }

    try {
      await this.ensureReady();
      await this.noteReady();
      return new Response(null, { status: 204 });
    } catch {
      const failures =
        (await this.ctx.storage.get<number>(KEEPALIVE_FAILURES_KEY)) ?? 0;
      const nextFailures = Math.min(failures + 1, 8);
      const delay = keepaliveBackoffMs(nextFailures);
      await this.ctx.storage.put(KEEPALIVE_FAILURES_KEY, nextFailures);
      await this.ctx.storage.put(
        KEEPALIVE_RETRY_AT_KEY,
        Date.now() + delay,
      );
      await this.scheduleAlarm(delay);
      return jsonResponse(503, 'not_ready');
    }
  }

  private async ensureReady(): Promise<void> {
    if (!this.readinessPromise) {
      this.readinessPromise = this.startAndWaitUntilReady();
    }
    try {
      await this.readinessPromise;
    } finally {
      this.readinessPromise = undefined;
    }
  }

  private async startAndWaitUntilReady(): Promise<void> {
    const container = this.getContainer();
    await ensureConfiguredContainer(
      container,
      this.env,
      INACTIVITY_TIMEOUT_MS,
    );
    for (let attempt = 0; attempt < READINESS_ATTEMPTS; attempt += 1) {
      try {
        const response = await container.getTcpPort(CONTAINER_PORT).fetch(
          new Request('http://waha.local/health', {
            headers: { 'x-api-key': this.env.WAHA_API_KEY },
            signal: AbortSignal.timeout(READINESS_REQUEST_TIMEOUT_MS),
          }),
        );
        const ready = response.ok;
        if (response.body) {
          await response.body.cancel();
        }
        if (ready) {
          return;
        }
      } catch {
        // The port is not ready yet. Retry without exposing the runtime error.
      }
      await wait(READINESS_INTERVAL_MS);
    }
    throw new Error('WAHA did not become ready before the timeout');
  }

  private getContainer(): NonNullable<DurableObjectState['container']> {
    const container = this.ctx.container;
    if (!container) {
      throw new Error('No container is configured for this Durable Object');
    }
    return container;
  }

  private async scheduleAlarm(delay: number): Promise<void> {
    await this.ctx.storage.setAlarm(Date.now() + delay);
  }

  private async noteReady(): Promise<void> {
    await this.ctx.storage.delete(KEEPALIVE_FAILURES_KEY);
    await this.ctx.storage.delete(KEEPALIVE_RETRY_AT_KEY);
    await this.scheduleAlarm(BACKUP_ALARM_INTERVAL_MS);
  }
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env, async (containerRequest) => {
      const id = env.WAHA.idFromName(CONTAINER_NAME);
      const stub = env.WAHA.get(id);
      return stub.fetch(containerRequest);
    });
  },
  scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): void {
    const id = env.WAHA.idFromName(CONTAINER_NAME);
    const stub = env.WAHA.get(id);
    const keepaliveRequest = new Request(
      `https://internal.invalid${INTERNAL_KEEPALIVE_PATH}`,
      {
        headers: {
          'x-waha-gateway-authenticated': '1',
          'x-waha-gateway-event': 'scheduled',
        },
      },
    );
    ctx.waitUntil(stub.fetch(keepaliveRequest).then(() => undefined));
  },
} satisfies ExportedHandler<Env>;
