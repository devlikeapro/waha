import { MessageCappingData } from '@waha/structures/sessions.dto';
import * as lodash from 'lodash';
import { Logger } from 'pino';
import { Observable, Subject } from 'rxjs';

/**
 * WhatsApp new-chat message capping (per-cycle quota).
 * The volume counterpart of the reachout timelock: it caps how many new chats
 * the account may start per cycle. Keeps the latest known state and emits
 * changes. Unlike the timelock there is no client-side expiry - the cycle
 * resets on the server and the state is refreshed by re-fetching.
 */
export class MessageCappingTracker {
  private capping: MessageCappingData | null = null;
  private changes: Subject<MessageCappingData | null> = new Subject();

  constructor(private logger: Logger) {}

  get value(): MessageCappingData | null {
    return this.capping;
  }

  get changes$(): Observable<MessageCappingData | null> {
    return this.changes;
  }

  update(capping: MessageCappingData | null) {
    if (lodash.isEqual(this.capping, capping)) {
      return;
    }
    this.apply(capping);
  }

  private apply(capping: MessageCappingData | null) {
    this.capping = capping;
    this.logger.info({ messageCapping: capping }, 'Message capping updated');
    this.changes.next(capping);
  }
}
