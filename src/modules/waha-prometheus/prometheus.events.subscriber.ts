import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { PrometheusConfigService } from '@waha/modules/waha-prometheus/prometheus.config';
import { WahaMetrics } from '@waha/modules/waha-prometheus/prometheus.metrics';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { Subscription } from 'rxjs';

@Injectable()
export class EventMetricsSubscriber
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private subscriptions: Subscription[] = [];

  constructor(
    private moduleRef: ModuleRef,
    private metrics: WahaMetrics,
    private config: PrometheusConfigService,
  ) {}

  onApplicationBootstrap(): void {
    const manager = this.moduleRef.get(SessionManager, { strict: false });
    for (const eventName of this.config.events) {
      this.subscriptions.push(
        manager.getSessionEvent('*', eventName).subscribe((event) => {
          const session = event?.session;
          if (!session) {
            return;
          }
          this.metrics.incrementEvent(session, eventName);
          const fromMe = event?.payload?.fromMe;
          if (
            eventName === WAHAEvents.MESSAGE_ANY &&
            typeof fromMe === 'boolean'
          ) {
            this.metrics.incrementMessage(session, fromMe);
          }
        }),
      );
    }
    this.subscriptions.push(
      manager
        .getSessionEvent('*', WAHAEvents.SESSION_STATUS)
        .subscribe((event) => {
          const session = event?.session;
          if (!session) {
            return;
          }
          const timestampMs = event.timestamp ?? Date.now();
          this.metrics.observeSessionStatusChange(session, timestampMs);
        }),
    );
  }

  onModuleDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }
}
