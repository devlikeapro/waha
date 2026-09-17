import { PhoneNumbersCorePlugin } from '@waha/apps/phone-numbers/plugins/PhoneNumbersCorePlugin';
import { toCusFormat, toJID } from '@waha/core/utils/jids';

import type { WhatsappSessionNoWebCore } from '@waha/core/engines/noweb/session.noweb.core';

/**
 * NOWEB local tier: the session's contact store, populated from history sync
 * and received messages. A contact stored under one of the candidate forms is
 * the canonical form - no network call needed.
 */
export class PhoneNumbersNowebPlugin extends PhoneNumbersCorePlugin {
  protected async lookupKnownChatId(
    candidates: string[],
  ): Promise<string | null> {
    const session = this.session as WhatsappSessionNoWebCore;
    const store = session.store;
    if (!store) {
      return null;
    }
    for (const candidate of candidates) {
      const jid = toJID(candidate);
      const contact = await store.getContactById(jid).catch(() => null);
      if (contact?.id) {
        return toCusFormat(contact.id);
      }
    }
    return null;
  }
}
