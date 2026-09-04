import { PluginEvent } from '@waha/core/abc/session.plugin.events';
import { PluginHook } from '@waha/core/abc/session.plugin.hooks';
import { SessionPlugin } from '@waha/core/abc/session.plugin';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { MessageSource } from '@waha/structures/responses.dto';
import * as NodeCache from 'node-cache';
import { Observable } from 'rxjs';

/**
 * Remembers ids of messages sent via API ("message.sent" hook)
 * and answers "message.source" lookups:
 * - MessageSource.API if the id is in the cache
 * - undefined otherwise, so other taps (or the caller's APP fallback) decide
 */
export class MessageSourceCachePlugin extends SessionPlugin {
  private sentMessageIds: NodeCache = new NodeCache({
    stdTTL: 10 * 60, // 10 minutes
  });

  @PluginEvent(WAHAEvents.SESSION_STATUS)
  onSessionStatus(events$: Observable<any>) {
    events$.subscribe({
      complete: () => {
        this.close();
      },
    });
  }

  @PluginHook((hooks) => hooks.message.sent)
  saveSentMessageId(id: string) {
    if (!id) {
      return;
    }
    this.sentMessageIds.set(id, true);
  }

  @PluginHook((hooks) => hooks.message.source)
  getMessageSource(id: string): MessageSource | undefined {
    if (!id) {
      return undefined;
    }
    const api = this.sentMessageIds.has(id);
    if (api) {
      return MessageSource.API;
    }
    return undefined;
  }

  private close() {
    this.logger.debug('Closing sent message ids cache');
    this.sentMessageIds.flushAll();
    this.sentMessageIds.close();
  }
}
