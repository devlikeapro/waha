import {
  Counter,
  Gauge,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';
import {
  WAHA_HTTP_DURATION_BUCKETS,
  WAHA_METRICS_PREFIX,
} from '@waha/core/metrics/prometheus.registry';

export type MessageDirection = 'in' | 'out';

export interface SessionCountRow {
  status: string;
  engine: string;
}

export class WahaMetrics {
  readonly register: Registry;
  private readonly enabled: boolean;
  private readonly httpRequests: Counter | null;
  private readonly httpDuration: Histogram | null;
  private readonly sessions: Gauge | null;
  private readonly messages: Counter | null;

  constructor(enabled: boolean) {
    this.enabled = enabled;
    this.register = new Registry();
    if (!enabled) {
      this.httpRequests = null;
      this.httpDuration = null;
      this.sessions = null;
      this.messages = null;
      return;
    }
    collectDefaultMetrics({
      register: this.register,
      prefix: WAHA_METRICS_PREFIX,
    });
    const up = new Gauge({
      name: 'waha_up',
      help: '1 if the WAHA process is serving Prometheus metrics',
      registers: [this.register],
    });
    up.set(1);
    this.httpRequests = new Counter({
      name: 'waha_http_requests_total',
      help: 'HTTP requests handled by WAHA',
      labelNames: ['method', 'status'],
      registers: [this.register],
    });
    this.httpDuration = new Histogram({
      name: 'waha_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'status'],
      buckets: WAHA_HTTP_DURATION_BUCKETS,
      registers: [this.register],
    });
    this.sessions = new Gauge({
      name: 'waha_sessions',
      help: 'WhatsApp sessions by status and engine',
      labelNames: ['status', 'engine'],
      registers: [this.register],
    });
    this.messages = new Counter({
      name: 'waha_messages_total',
      help: 'WhatsApp messages observed by WAHA',
      labelNames: ['direction'],
      registers: [this.register],
    });
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  observeHttpRequest(
    method: string,
    statusCode: number,
    durationSeconds: number,
  ): void {
    if (!this.httpRequests || !this.httpDuration) {
      return;
    }
    const labels = {
      method: method.toUpperCase(),
      status: String(statusCode),
    };
    this.httpRequests.inc(labels);
    this.httpDuration.observe(labels, durationSeconds);
  }

  setSessionCounts(rows: SessionCountRow[]): void {
    if (!this.sessions) {
      return;
    }
    this.sessions.reset();
    const counts = new Map<string, { status: string; engine: string; count: number }>();
    for (const row of rows) {
      const key = `${row.status}\0${row.engine}`;
      const previous = counts.get(key);
      if (previous) {
        previous.count += 1;
      } else {
        counts.set(key, {
          status: row.status,
          engine: row.engine,
          count: 1,
        });
      }
    }
    for (const value of counts.values()) {
      this.sessions.set(
        { status: value.status, engine: value.engine },
        value.count,
      );
    }
  }

  observeMessage(direction: MessageDirection): void {
    if (!this.messages) {
      return;
    }
    this.messages.inc({ direction: direction });
  }

  render(): Promise<string> {
    return this.register.metrics();
  }
}
