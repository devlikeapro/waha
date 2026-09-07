import type { SessionPlugin } from '@waha/core/abc/session.plugin';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { Observable } from 'rxjs';

type EventFn = (events$: Observable<any>) => void;

interface EventSubscriptionMetadata {
  event: WAHAEvents;
  propertyKey: string;
}

const EVENT_SUBSCRIPTIONS = Symbol('PluginEventSubscriptions');

function getOwnEventSubscriptions(ctor: any): EventSubscriptionMetadata[] {
  if (!Object.prototype.hasOwnProperty.call(ctor, EVENT_SUBSCRIPTIONS)) {
    ctor[EVENT_SUBSCRIPTIONS] = [];
  }
  return ctor[EVENT_SUBSCRIPTIONS];
}

function collectEventSubscriptions(ctor: any): EventSubscriptionMetadata[] {
  const subscriptions: EventSubscriptionMetadata[] = [];
  let current = ctor;
  while (current) {
    if (Object.prototype.hasOwnProperty.call(current, EVENT_SUBSCRIPTIONS)) {
      subscriptions.push(...current[EVENT_SUBSCRIPTIONS]);
    }
    current = Object.getPrototypeOf(current);
  }
  return subscriptions;
}

/**
 * Passes the session event observable to the decorated (public) method once, the method subscribes itself:
 *
 * @PluginEvent(WAHAEvents.SESSION_STATUS)
 * onSessionStatus(events$: Observable<WASessionStatusBody>) {
 *   events$.subscribe({ next: ..., complete: ... });
 * }
 */
export function PluginEvent(event: WAHAEvents) {
  return function <K extends string, T extends Record<K, EventFn>>(
    target: T,
    propertyKey: K,
    descriptor: PropertyDescriptor,
  ): void {
    getOwnEventSubscriptions(target.constructor).push({
      event: event,
      propertyKey: propertyKey,
    });
  };
}

/**
 * Calls all @PluginEvent methods of the plugin's class with the session event observables.
 */
export function RegisterPluginEvents(plugin: SessionPlugin<any, any>) {
  for (const meta of collectEventSubscriptions(plugin.constructor)) {
    const method = (plugin as any)[meta.propertyKey].bind(plugin);
    method(plugin.session.getEventObservable(meta.event));
  }
}
