import { public_contact_create_update_payload } from '@figuro/chatwoot-sdk';
import { ContactInfo } from '@waha/apps/chatwoot/client/ContactConversationService';
import { AttributeKey, INBOX_CONTACT_CHAT_ID } from '@waha/apps/chatwoot/const';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';

/**
 * Inbox Notifications Contact
 */
export class InboxContactInfo implements ContactInfo {
  constructor(private l: Locale) {}

  ChatId(): string {
    return INBOX_CONTACT_CHAT_ID;
  }

  async LidId(): Promise<string | null> {
    return null;
  }

  async JidId(): Promise<string | null> {
    return null;
  }

  async PhoneNumberE164(): Promise<string | null> {
    return null;
  }

  async AvatarUrl() {
    return this.l.key(TKey.APP_INBOX_CONTACT_AVATAR_URL).render();
  }

  async Attributes(): Promise<any> {
    return {
      [AttributeKey.WA_CHAT_ID]: INBOX_CONTACT_CHAT_ID,
    };
  }

  async PublicContactCreate(): Promise<public_contact_create_update_payload> {
    return {
      identifier: INBOX_CONTACT_CHAT_ID,
      name: this.l.key(TKey.APP_INBOX_CONTACT_NAME).render(),
      avatar_url: await this.AvatarUrl(),
      custom_attributes: await this.Attributes(),
    };
  }
}
