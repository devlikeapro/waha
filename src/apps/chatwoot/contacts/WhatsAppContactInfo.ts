import { public_contact_create_update_payload as Contact } from '@figuro/chatwoot-sdk';
import { ContactInfo } from '@waha/apps/chatwoot/client/ContactConversationService';
import { AttributeKey } from '@waha/apps/chatwoot/const';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { Channel } from '@waha/structures/channels.dto';
import { CacheAsync } from '@waha/utils/Cache';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import {
  isJidBroadcast,
  isJidGroup,
  isJidNewsletter,
  isJidStatusBroadcast,
  isLidUser,
  isPnUser,
  normalizeJid,
} from '@waha/core/utils/jids';
import { UnknownJIDFormat } from '@waha/apps/chatwoot/errors';
import { E164Parser } from '@waha/core/utils/PhoneJidNormalizer';

/**
 * Base WhatsApp contact info class
 */
abstract class ChatContactInfo implements ContactInfo {
  constructor(
    protected session: WAHASessionAPI,
    protected chatId: string,
    protected locale: Locale,
  ) {}

  ChatId(): string {
    return this.chatId;
  }

  abstract AvatarUrl(): Promise<string | null>;

  abstract Attributes(): Promise<any>;

  abstract PublicContactCreate(): Promise<Contact>;
}

/**
 * The display name for a chat, in the order that degrades best for an agent:
 * the saved contact name, then the push name WhatsApp sends with every message,
 * and only then the raw chat id.
 *
 * Shared by JID and LID contacts on purpose. It used to live inline in
 * `JidContactInfo` only, so a LID with no phone number behind it — the normal
 * case for anyone not in the address book — was named after its own id.
 */
async function resolveContactName(
  session: WAHASessionAPI,
  chatId: string,
): Promise<string> {
  let contact: any = null;
  try {
    contact = await session.getContact(chatId);
  } catch (error) {
    // A contact that cannot be read is no reason to fail creating it: the
    // conversation is already arriving and it has to land somewhere.
    contact = null;
  }
  return contact?.name || contact?.pushName || contact?.pushname || chatId;
}

/**
 * Regular JID contact info
 */
class JidContactInfo extends ChatContactInfo {
  @CacheAsync()
  async AvatarUrl(): Promise<string> {
    return await this.session.getChatPicture(this.chatId);
  }

  @CacheAsync()
  async fetchLid() {
    return await this.session.findLIDByPN(this.chatId);
  }

  @CacheAsync()
  async Attributes() {
    const attributes = {
      [AttributeKey.WA_CHAT_ID]: this.chatId,
      [AttributeKey.WA_JID]: this.chatId,
    };
    const lid = await this.fetchLid();
    if (lid) {
      attributes[AttributeKey.WA_LID] = lid;
    }
    return attributes;
  }

  async PublicContactCreate(): Promise<Contact> {
    const name = await resolveContactName(this.session, this.chatId);
    const phoneNumberE164 = E164Parser.fromJid(this.chatId);

    const result: Contact = {
      name: name,
      custom_attributes: {
        [AttributeKey.WA_CHAT_ID]: this.chatId,
        [AttributeKey.WA_JID]: this.chatId,
      },
      phone_number: phoneNumberE164,
    };
    result.custom_attributes = await this.Attributes();
    return result;
  }
}

/**
 * LID contact info
 */
class LidContactInfo extends ChatContactInfo {
  constructor(
    session: WAHASessionAPI,
    chatId: string,
    locale: Locale,
    private pn: string | null = null,
  ) {
    super(session, chatId, locale);
  }

  @CacheAsync()
  async jid() {
    let pn = this.pn;
    if (!pn) {
      pn = await this.session.findPNByLid(this.chatId);
    }
    if (!pn) {
      return null;
    }
    return new JidContactInfo(this.session, pn, this.locale);
  }

  async AvatarUrl(): Promise<string | null> {
    const jid = await this.jid();
    if (jid) {
      return await jid.AvatarUrl();
    }
    return await this.session.getChatPicture(this.chatId);
  }

  @CacheAsync()
  async Attributes() {
    const jid = await this.jid();
    let attributes = {};
    if (jid) {
      attributes = await jid.Attributes();
    }
    attributes[AttributeKey.WA_LID] = this.chatId;
    return attributes;
  }

  async PublicContactCreate(): Promise<Contact> {
    const jid = await this.jid();
    let result;
    if (jid) {
      result = await jid.PublicContactCreate();
    } else {
      // No phone number for this LID: WhatsApp only maps a LID to a phone number
      // for contacts already in the address book, so `findPNByLid` returns null
      // for anyone else — and that is by design, not a failure.
      //
      // The push name, however, IS available. It travels on every incoming
      // message (`_data.Info.PushName`) and WAHA already exposes it through
      // `getContact`. Falling straight through to the raw chat id made every
      // unknown sender arrive in Chatwoot named `1234567890@lid`, with no name
      // and no number — unusable for an agent answering the conversation.
      result = {
        inbox_id: 0,
        identifier: this.chatId,
        name: await resolveContactName(this.session, this.chatId),
      };
    }
    result.custom_attributes = await this.Attributes();
    return result;
  }
}

/**
 * Group contact info
 */
class GroupContactInfo extends ChatContactInfo {
  @CacheAsync()
  async AvatarUrl(): Promise<string> {
    return await this.session.getChatPicture(this.chatId);
  }

  async Attributes() {
    return {
      [AttributeKey.WA_CHAT_ID]: this.chatId,
    };
  }

  async PublicContactCreate(): Promise<Contact> {
    let name = this.chatId;
    const group: any = await this.session?.getGroup(this.chatId);
    if (group) {
      name = group.subject || group.name || group.topic || name;
      name = group.Name || name;
      const suffix = this.locale
        .key(TKey.WHATSAPP_CONTACT_GROUP_SUFFIX)
        .render();
      name = `${name} (${suffix})`;
    }

    return {
      identifier: this.chatId,
      name: name,
      custom_attributes: await this.Attributes(),
    };
  }
}

/**
 * Channel (newsletter) contact info
 */
class ChannelContactInfo extends ChatContactInfo {
  @CacheAsync()
  async AvatarUrl(): Promise<string> {
    return await this.session.getChatPicture(this.chatId);
  }

  async Attributes() {
    return {
      [AttributeKey.WA_CHAT_ID]: this.chatId,
    };
  }

  async PublicContactCreate(): Promise<Contact> {
    let name = this.chatId;
    const channel: Channel = await this.session.getChannel(this.chatId);
    if (channel) {
      name = channel.name || name;
      const suffix = this.locale
        .key(TKey.WHATSAPP_CONTACT_CHANNEL_SUFFIX)
        .render();
      name = `${name} (${suffix})`;
    }
    return {
      identifier: this.chatId,
      name: name,
      custom_attributes: await this.Attributes(),
    };
  }
}

/**
 * Status broadcast contact info
 */
class StatusContactInfo extends ChatContactInfo {
  @CacheAsync()
  async AvatarUrl(): Promise<string | null> {
    return null;
  }

  async Attributes() {
    return {
      [AttributeKey.WA_CHAT_ID]: this.chatId,
    };
  }

  async PublicContactCreate(): Promise<Contact> {
    const name = this.locale.key(TKey.WHATSAPP_CONTACT_STATUS_NAME).render();

    return {
      identifier: this.chatId,
      name: `🟢 ${name}`,
      custom_attributes: await this.Attributes(),
    };
  }
}

class BroadcastContactInfo extends ChatContactInfo {
  async Attributes() {
    return {
      [AttributeKey.WA_CHAT_ID]: this.chatId,
    };
  }

  @CacheAsync()
  async AvatarUrl(): Promise<string | null> {
    return null;
  }

  async PublicContactCreate(): Promise<Contact> {
    const name = this.locale
      .key(TKey.WHATSAPP_CONTACT_BROADCAST_SUFFIX)
      .render();

    return {
      identifier: this.chatId,
      name: `${name} (${this.chatId})`,
      custom_attributes: await this.Attributes(),
    };
  }
}

/**
 * Factory function to get the appropriate ContactInfo implementation
 * based on the chat ID type
 */
export function WhatsAppContactInfo(
  session: WAHASessionAPI,
  chatId: string,
  locale: Locale,
  pn: string | null = null,
): ContactInfo {
  if (isJidGroup(chatId)) {
    return new GroupContactInfo(session, chatId, locale);
  } else if (isJidNewsletter(chatId)) {
    return new ChannelContactInfo(session, chatId, locale);
  } else if (isJidStatusBroadcast(chatId)) {
    return new StatusContactInfo(session, chatId, locale);
  } else if (isJidBroadcast(chatId)) {
    return new BroadcastContactInfo(session, chatId, locale);
  } else if (isLidUser(chatId)) {
    return new LidContactInfo(session, normalizeJid(chatId), locale, pn);
  } else if (isPnUser(chatId)) {
    return new JidContactInfo(session, chatId, locale);
  } else {
    throw new UnknownJIDFormat(chatId);
  }
}
