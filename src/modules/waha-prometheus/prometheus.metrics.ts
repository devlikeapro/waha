import { Injectable } from '@nestjs/common';
import { PrometheusConfigService } from '@waha/modules/waha-prometheus/prometheus.config';
import { VERSION } from '@waha/version';
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
} from '@prometheus-io/client';

export interface SessionCountRow {
  name: string;
  status: string;
  engine: string;
  activityTimestampMs: number | null;
}

@Injectable()
export class WahaMetrics {
  readonly registry: Registry;
  private readonly httpRequests: Counter<'method' | 'status'>;
  private readonly httpDuration: Histogram<'method' | 'status'>;
  private readonly sessions: Gauge<'status' | 'engine'>;
  private readonly sessionStatus: Gauge<'session' | 'status' | 'engine'>;
  private readonly sessionActivity: Gauge<'session'>;
  private readonly sessionStatusChange: Gauge<'session'>;
  private readonly messages: Counter<'session' | 'fromMe'>;
  private readonly events: Counter<'session' | 'event'>;

  constructor(config: PrometheusConfigService) {
    this.registry = new Registry();
    // always keep the worker label, even if it's empty (set an empty string, otherwise it renders as worker="null")
    this.registry.setDefaultLabels({ worker: VERSION.worker.id || '' });
    const prefix = config.metricPrefix;
    collectDefaultMetrics({ register: this.registry, prefix: prefix });
    const up = new Gauge({
      name: `${prefix}up`,
      help: '1 if the WAHA process is serving Prometheus metrics',
      registers: [this.registry],
    });
    up.set(1);
    const info = new Gauge({
      name: `${prefix}info`,
      help: 'WAHA build information',
      labelNames: ['version', 'tier', 'engine', 'platform'],
      registers: [this.registry],
    });
    info.set(
      {
        version: VERSION.version,
        tier: VERSION.tier,
        engine: VERSION.engine,
        platform: VERSION.platform,
      },
      1,
    );
    this.httpRequests = new Counter({
      name: `${prefix}http_requests_total`,
      help: 'API HTTP requests handled by WAHA',
      labelNames: ['method', 'status'],
      registers: [this.registry],
    });
    this.httpDuration = new Histogram({
      name: `${prefix}http_request_duration_seconds`,
      help: 'API HTTP request duration in seconds',
      labelNames: ['method', 'status'],
      buckets: config.httpDurationBuckets,
      registers: [this.registry],
    });
    this.sessions = new Gauge({
      name: `${prefix}sessions`,
      help: 'WhatsApp sessions by status and engine',
      labelNames: ['status', 'engine'],
      registers: [this.registry],
    });
    this.sessionStatus = new Gauge({
      name: `${prefix}session_status`,
      help: 'Current status per session (1 = session is in this status)',
      labelNames: ['session', 'status', 'engine'],
      registers: [this.registry],
    });
    this.sessionActivity = new Gauge({
      name: `${prefix}session_activity_timestamp_seconds`,
      help: 'Unix timestamp of the last session activity',
      labelNames: ['session'],
      registers: [this.registry],
    });
    this.sessionStatusChange = new Gauge({
      name: `${prefix}session_status_change_timestamp_seconds`,
      help: 'Unix timestamp of the last session status change',
      labelNames: ['session'],
      registers: [this.registry],
    });
    this.messages = new Counter({
      name: `${prefix}messages_total`,
      help: 'WhatsApp messages observed by WAHA',
      labelNames: ['session', 'fromMe'],
      registers: [this.registry],
    });
    this.events = new Counter({
      name: `${prefix}events_total`,
      help: 'WAHA events observed by WAHA (WAHA_PROMETHEUS_TRACK_EVENTS)',
      labelNames: ['session', 'event'],
      registers: [this.registry],
    });
  }

  get contentType(): string {
    return this.registry.contentType;
  }

  observeHttpRequest(
    method: string,
    statusCode: number,
    durationSeconds: number,
  ): void {
    const labels = {
      method: method.toUpperCase(),
      status: String(statusCode),
    };
    this.httpRequests.inc(labels);
    this.httpDuration.observe(labels, durationSeconds);
  }

  incrementMessage(session: string, fromMe: boolean): void {
    this.messages.inc({ session: session, fromMe: String(fromMe) });
  }

  incrementEvent(session: string, event: string): void {
    this.events.inc({ session: session, event: event });
  }

  observeSessionStatusChange(session: string, timestampMs: number): void {
    this.sessionStatusChange.set({ session: session }, timestampMs / 1000);
  }

  setSessionCounts(rows: SessionCountRow[]): void {
    this.sessions.reset();
    this.sessionStatus.reset();
    this.sessionActivity.reset();
    for (const row of rows) {
      this.sessions.inc({ status: row.status, engine: row.engine });
      this.sessionStatus.set(
        { session: row.name, status: row.status, engine: row.engine },
        1,
      );
      if (row.activityTimestampMs) {
        this.sessionActivity.set(
          { session: row.name },
          row.activityTimestampMs / 1000,
        );
      }
    }
  }

  render(): Promise<string> {
    return this.registry.metrics();
  }
}
