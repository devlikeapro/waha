import { Subject } from 'rxjs';
import { WAHAEvents } from '@waha/structures/enums.dto';
import {
  messageDirection,
  MessageMetricsSubscriber,
} from '@waha/core/metrics/message.metrics';
import { WahaMetrics } from '@waha/core/metrics/waha.metrics';

describe('messageDirection', () => {
  test('reads wrapped payload.fromMe', () => {
    expect(messageDirection({ payload: { fromMe: true } })).toBe('out');
    expect(messageDirection({ payload: { fromMe: false } })).toBe('in');
  });

  test('reads raw fromMe', () => {
    expect(messageDirection({ fromMe: true })).toBe('out');
    expect(messageDirection({ fromMe: false })).toBe('in');
  });

  test('skips unknown shapes', () => {
    expect(messageDirection(null)).toBeNull();
    expect(messageDirection({})).toBeNull();
    expect(messageDirection({ payload: {} })).toBeNull();
  });
});

describe('MessageMetricsSubscriber', () => {
  test('increments on MESSAGE_ANY and ignores bad events', async () => {
    const metrics = new WahaMetrics(true);
    const subject = new Subject<unknown>();
    const manager = {
      getSessionEvent: (session: string, event: WAHAEvents) => {
        expect(session).toBe('*');
        expect(event).toBe(WAHAEvents.MESSAGE_ANY);
        return subject.asObservable();
      },
    };
    const subscriber = new MessageMetricsSubscriber(metrics, manager as any);
    subscriber.onModuleInit();
    subject.next({ payload: { fromMe: false } });
    subject.next({ payload: { fromMe: true } });
    subject.next({ payload: {} });
    const body = await metrics.render();
    expect(body).toContain('waha_messages_total{direction="in"} 1');
    expect(body).toContain('waha_messages_total{direction="out"} 1');
    subscriber.onModuleDestroy();
  });
});
