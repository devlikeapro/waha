import { Observable } from 'rxjs';
import { EnginePayload } from '@waha/structures/webhooks.dto';

/**
 * Wraps a WPPConnect `on*` listener method into a lazy RxJS Observable.
 * The listener is registered only when subscribed and disposed on teardown.
 *
 * @param event Event name label stored in EnginePayload, e.g. `'onMessage'`
 * @param fn    Bound wppconnect listener invocation, e.g. `(cb) => wpp.onMessage(cb)`
 */
export function fromWppCallback(
  event: string,
  fn: (callback: (...args: any[]) => void) => { dispose: () => void },
): Observable<EnginePayload> {
  return new Observable<EnginePayload>((subscriber) => {
    const { dispose } = fn((...args: any[]) => {
      // Multi-arg callbacks (e.g. onMessageEdit receives chat, id, msg) are
      // packed into an array so EnginePayload.data is always a single value.
      const data = args.length === 1 ? args[0] : args;
      subscriber.next({ event: event, data: data });
    });
    return () => dispose();
  });
}
