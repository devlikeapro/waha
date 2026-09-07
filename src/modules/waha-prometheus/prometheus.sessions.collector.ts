import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SessionManager } from '@waha/core/abc/manager.abc';
import {
  SessionCountRow,
  WahaMetrics,
} from '@waha/modules/waha-prometheus/prometheus.metrics';
import { getEngineName } from '@waha/version';

@Injectable()
export class SessionMetricsCollector {
  private manager: SessionManager | null = null;

  constructor(
    private moduleRef: ModuleRef,
    private metrics: WahaMetrics,
  ) {}

  private getManager(): SessionManager {
    if (!this.manager) {
      this.manager = this.moduleRef.get(SessionManager, { strict: false });
    }
    return this.manager;
  }

  async collect(): Promise<void> {
    const manager = this.getManager();
    const sessions = await manager.getSessions(true);
    const rows: SessionCountRow[] = [];
    for (const info of sessions) {
      let engine: string;
      try {
        engine = String(manager.getSession(info.name).engine);
      } catch {
        engine = String(getEngineName());
      }
      rows.push({
        name: info.name,
        status: String(info.status),
        engine: engine,
        activityTimestampMs: info.timestamps?.activity ?? null,
      });
    }
    this.metrics.setSessionCounts(rows);
  }
}
