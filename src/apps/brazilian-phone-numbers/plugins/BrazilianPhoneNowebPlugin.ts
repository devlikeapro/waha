import { BrazilianPhoneCorePlugin } from '@waha/apps/brazilian-phone-numbers/plugins/BrazilianPhoneCorePlugin';
import { toCusFormat, toJID } from '@waha/core/utils/jids';

import type { WhatsappSessionNoWebCore } from '@waha/core/engines/noweb/session.noweb.core';

/**
 * NOWEB local tier: the session's contact store, populated from history sync
 * and received messages. A contact stored under one of the candidate forms is
 * the canonical 9th-digit variant - no network call needed.
 */
export class BrazilianPhoneNowebPlugin extends BrazilianPhoneCorePlugin {
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
