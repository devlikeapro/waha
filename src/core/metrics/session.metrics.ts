import { Injectable, Logger } from '@nestjs/common';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { SessionCountRow, WahaMetrics } from '@waha/core/metrics/waha.metrics';
import { getEngineName } from '@waha/version';

@Injectable()
export class SessionMetricsCollector {
  private readonly logger = new Logger(SessionMetricsCollector.name);

  constructor(
    private readonly metrics: WahaMetrics,
    private readonly manager: SessionManager,
  ) {}

  async collect(): Promise<void> {
    if (!this.metrics.isEnabled) {
      return;
    }
    try {
      const sessions = await this.manager.getSessions(false);
      const rows: SessionCountRow[] = [];
      for (const info of sessions) {
        let engine = '';
        try {
          const session = this.manager.getSession(info.name);
          if (session.engine) {
            engine = String(session.engine);
          }
        } catch (error) {
          this.logger.debug(
            `Could not read engine for session metrics: ${error}`,
          );
        }
        if (!engine) {
          engine = getEngineName();
        }
        rows.push({
          status: String(info.status),
          engine: engine,
        });
      }
      this.metrics.setSessionCounts(rows);
    } catch (error) {
      this.logger.warn(`Failed to collect session metrics: ${error}`);
    }
  }
}
