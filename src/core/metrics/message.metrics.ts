import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SessionManager } from '@waha/core/abc/manager.abc';
import {
  MessageDirection,
  WahaMetrics,
} from '@waha/core/metrics/waha.metrics';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { Subscription } from 'rxjs';

export function messageDirection(event: unknown): MessageDirection | null {
  if (event === null || typeof event !== 'object') {
    return null;
  }
  const record = event as {
    fromMe?: unknown;
    payload?: { fromMe?: unknown };
  };
  let fromMe: unknown = record.fromMe;
  if (typeof fromMe !== 'boolean') {
    const payload = record.payload;
    if (payload && typeof payload === 'object') {
      fromMe = payload.fromMe;
    }
  }
  if (fromMe === true) {
    return 'out';
  }
  if (fromMe === false) {
    return 'in';
  }
  return null;
}

@Injectable()
export class MessageMetricsSubscriber implements OnModuleInit, OnModuleDestroy {
  private subscription: Subscription | null = null;

  constructor(
    private readonly metrics: WahaMetrics,
    private readonly manager: SessionManager,
  ) {}

  onModuleInit(): void {
    if (!this.metrics.isEnabled) {
      return;
    }
    this.subscription = this.manager
      .getSessionEvent('*', WAHAEvents.MESSAGE_ANY)
      .subscribe((event: unknown) => {
        const direction = messageDirection(event);
        if (!direction) {
          return;
        }
        this.metrics.observeMessage(direction);
      });
  }

  onModuleDestroy(): void {
    if (!this.subscription) {
      return;
    }
    this.subscription.unsubscribe();
    this.subscription = null;
  }
}
