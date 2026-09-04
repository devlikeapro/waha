import ChatwootClient, {
  contact_update,
  public_contact_create_update_payload,
} from '@figuro/chatwoot-sdk';
import type { contact } from '@figuro/chatwoot-sdk/dist/models/contact';
import type { generic_id } from '@figuro/chatwoot-sdk/dist/models/generic_id';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import {
  ChatWootAPIConfig,
  ChatWootInboxAPI,
} from '@waha/apps/chatwoot/client/interfaces';
import { isJidCusFormat } from '@waha/utils/wa';
import * as lodash from 'lodash';

import { AttributeKey } from '../const';
import { E164Parser } from '@waha/core/utils/PhoneJidNormalizer';
import { ContactInfo } from '@waha/apps/chatwoot/client/ContactConversationService';

export interface ContactResponse {
  data: generic_id & contact;
  sourceId: string;
}

export enum AvatarUpdateMode {
  IF_MISSING,
  ALWAYS,
}

export function sanitizeName(name: string) {
  // 255 chars max
  const limit = 255;
  if (!name) {
    return name;
  }
  if (name.length < limit) {
    return name;
  }
  // remove only bidi controls
  const clean = name.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
  return clean.slice(0, 255).trim();
}

function SearchClauseEqualTo(key: string, values: string[]) {
  // equal_to with multiple values acts as IN
  return {
    attribute_key: key,
    filter_operator: 'equal_to',
    values: values,
    attribute_model: 'standard',
    custom_attribute_type: '',
    query_operator: 'OR',
  };
}

export class ContactService {
  constructor(
    private config: ChatWootAPIConfig,
    private accountAPI: ChatwootClient,
    protected inboxAPI: ChatWootInboxAPI,
    private logger: ILogger,
  ) {}

  async findOrCreateContact(
    contactInfo: ContactInfo,
  ): Promise<[ContactResponse, boolean]> {
    const chatId = contactInfo.ChatId();
    const lid = await contactInfo.LidId();
    const jid = await contactInfo.JidId();
    let contact = await this.search(chatId, lid, jid);
    if (contact) {
      await this.upsertPhoneNumber(contact, contactInfo);
      return [contact, false];
    }

    const request = await contactInfo.PublicContactCreate();
    contact = await this.create(chatId, request);
    return [contact, true];
  }

  async search(
    chatId: string,
    lid: string | null,
    jid: string | null,
  ): Promise<ContactResponse | null> {
    // The chat id attribute holds the latest used address, so match any known form there
    const chatIds = lodash.uniq(lodash.compact([chatId, jid, lid]));
    if (chatIds.length == 0) {
      return null;
    }

    const payload: any[] = [
      SearchClauseEqualTo(AttributeKey.WA_CHAT_ID, chatIds),
      SearchClauseEqualTo('identifier', chatIds),
    ];
    if (jid) {
      payload.push(SearchClauseEqualTo(AttributeKey.WA_JID, [jid]));
    }
    if (lid) {
      payload.push(SearchClauseEqualTo(AttributeKey.WA_LID, [lid]));
    }
    if (jid && isJidCusFormat(jid)) {
      // Search by phone - both with and without the leading '+'
      const phoneNumberE164 = E164Parser.fromJid(jid);
      let phones = [phoneNumberE164, phoneNumberE164.replace('+', '')];
      payload.push(SearchClauseEqualTo('phone_number', phones));
    }
    // The terminal clause must have no query_operator
    delete payload[payload.length - 1].query_operator;

    const response: any = await this.accountAPI.contacts.filter({
      accountId: this.config.accountId,
      payload: payload as any,
    });

    const contacts = response.payload;
    const candidates: ContactResponse[] = [];
    for (const contact of contacts) {
      const inboxes = lodash.filter(contact.contact_inboxes, {
        inbox: { id: this.config.inboxId },
      });
      if (inboxes.length == 0) {
        continue;
      }
      candidates.push({
        data: contact,
        sourceId: inboxes[0].source_id,
      });
    }
    if (candidates.length == 0) {
      return null;
    }
    // Prefer a contact with a phone number over a phone-less duplicate
    const withPhone = candidates.find((candidate) =>
      Boolean(candidate.data.phone_number),
    );
    return withPhone ?? candidates[0];
  }

  private async upsertPhoneNumber(
    contact: ContactResponse,
    contactInfo: ContactInfo,
  ): Promise<void> {
    if (contact.data.phone_number) {
      return;
    }
    const phoneNumberE164 = await contactInfo.PhoneNumberE164();
    if (!phoneNumberE164) {
      return;
    }
    try {
      await this.accountAPI.contacts.update({
        id: contact.data.id,
        accountId: this.config.accountId,
        data: { phone_number: phoneNumberE164 },
      });
      contact.data.phone_number = phoneNumberE164;
      this.logger.info(
        `Set phone_number for contact.id: ${
          contact.data.id
        }, chat.id: ${contactInfo.ChatId()}`,
      );
    } catch (err) {
      // Chatwoot returns 422 when another contact already owns the phone number
      this.logger.warn(
        `Error updating phone_number for contact.id: ${contact.data.id} - ${err}`,
      );
    }
  }

  public async upsertCustomAttributes(
    contact: generic_id & contact,
    attributes: any,
  ): Promise<boolean> {
    if (lodash.isEqual(attributes, contact.custom_attributes)) {
      return false;
    }
    const update: contact_update = {
      custom_attributes: { ...contact.custom_attributes, ...attributes },
    };
    await this.accountAPI.contacts.update({
      id: contact.id,
      accountId: this.config.accountId,
      data: update,
    });
    return true;
  }

  public async create(
    chatId: string,
    payload: public_contact_create_update_payload,
  ): Promise<ContactResponse> {
    payload.name = sanitizeName(payload.name);
    const contact = await this.inboxAPI.contacts.create({
      inboxIdentifier: this.config.inboxIdentifier,
      data: payload,
    });
    this.logger.info(
      `Created contact for chat.id: ${chatId}, contact.id: ${contact.source_id}`,
    );
    const response: any = await this.accountAPI.contacts.get({
      accountId: this.config.accountId,
      id: contact.id,
    });
    return {
      data: response.payload,
      sourceId: contact.source_id,
    };
  }

  public async updateAvatar(
    contact: ContactResponse,
    contactInfo: ContactInfo,
    mode: AvatarUpdateMode,
  ): Promise<boolean> {
    // Update Avatar if nothing, but keep the original one if any
    if (contact.data.thumbnail && mode == AvatarUpdateMode.IF_MISSING) {
      return false;
    }
    const chatId = contactInfo.ChatId();
    const avatarUrl = await contactInfo.AvatarUrl().catch((err) => {
      this.logger.warn(
        `Error getting avatar for chat.id from WhatsApp: ${chatId}`,
      );
      this.logger.warn(err);
      return null;
    });
    if (!avatarUrl) {
      return false;
    }
    const success = await this.updateAvatarUrlSafe(contact.data.id, avatarUrl);
    return success;
  }

  public updateAvatarUrlSafe(contactId, avatarUrl: string): Promise<boolean> {
    return this.accountAPI.contacts
      .update({
        accountId: this.config.accountId,
        id: contactId,
        data: {
          avatar_url: avatarUrl,
        },
      })
      .then(() => {
        return true;
      })
      .catch((e) => {
        this.logger.warn(
          `Error updating avatar_url for contact.id: ${contactId}`,
        );
        this.logger.warn(e);
        return true;
      });
  }
}
