import {
  BaileysEventEmitter,
  Chat,
  ChatUpdate,
  Contact,
  isRealMessage,
  jidNormalizedUser,
  proto,
  updateMessageWithReaction,
  updateMessageWithReceipt,
} from '@adiwajshing/baileys';
import { ConsoleLogger } from '@nestjs/common';
import { toNumber } from 'lodash';

import { toJID } from '../session.noweb.core';
import { IChatRepository } from './IChatRepository';
import { IContactRepository } from './IContactRepository';
import { IMessagesRepository } from './IMessagesRepository';
import { INowebStorage } from './INowebStorage';
import { INowebStore } from './INowebStore';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncLock = require('async-lock');

export class NowebPersistentStore implements INowebStore {
  private socket: any;
  private chatRepo: IChatRepository;
  private contactRepo: IContactRepository;
  private messagesRepo: IMessagesRepository;
  public presences: any;
  private lock: any;

  constructor(
    private log: ConsoleLogger,
    public storage: INowebStorage,
  ) {
    this.socket = null;
    this.chatRepo = storage.getChatRepository();
    this.contactRepo = storage.getContactsRepository();
    this.messagesRepo = storage.getMessagesRepository();
    this.presences = {};
    this.lock = new AsyncLock({ maxPending: Infinity });
  }

  init(): Promise<void> {
    return this.storage.init();
  }

  bind(ev: BaileysEventEmitter, socket: any) {
    // All
    ev.on('messaging-history.set', (data) => this.onMessagingHistorySet(data));
    // Messages
    ev.on('messages.upsert', (data) =>
      this.withLock('messages', () => this.onMessagesUpsert(data)),
    );
    ev.on('messages.update', (data) =>
      this.withLock('messages', () => this.onMessageUpdate(data)),
    );
    ev.on('messages.delete', (data) =>
      this.withLock('messages', () => this.onMessageDelete(data)),
    );
    ev.on('messages.reaction', (data) =>
      this.withLock('messages', () => this.onMessageReaction(data)),
    );
    ev.on('message-receipt.update', (data) =>
      this.withLock('messages', () => this.onMessageReceiptUpdate(data)),
    );
    // Chats
    ev.on('chats.upsert', (data) =>
      this.withLock('chats', () => this.onChatUpsert(data)),
    );
    ev.on('chats.update', (data) =>
      this.withLock('chats', () => this.onChatUpdate(data)),
    );
    ev.on('chats.delete', (data) =>
      this.withLock('chats', () => this.onChatDelete(data)),
    );
    // Contacts
    ev.on('contacts.upsert', (data) =>
      this.withLock('contacts', () => this.onContactsUpsert(data)),
    );
    ev.on('contacts.update', (data) =>
      this.withLock('contacts', () => this.onContactUpdate(data)),
    );
    // Presence
    ev.on('presence.update', (data) => this.onPresenceUpdate(data));
    this.socket = socket;
  }

  async close(): Promise<void> {
    await this.storage?.close().catch((error) => {
      this.log.warn(`Failed to close storage: ${error}`);
    });
    return;
  }

  private async onMessagingHistorySet(history) {
    const { contacts, chats, messages, isLatest } = history;
    if (isLatest) {
      this.log.debug(
        'history sync - clearing all entities, got latest history',
      );
      await Promise.all([
        this.withLock('contacts', () => this.contactRepo.deleteAll()),
        this.withLock('chats', () => this.chatRepo.deleteAll()),
        this.withLock('messages', () => this.messagesRepo.deleteAll()),
      ]);
    }

    await Promise.all([
      this.withLock('contacts', async () => {
        await this.onContactsUpsert(contacts);
        this.log.log(`history sync - '${contacts.length}' synced contacts`);
      }),
      this.withLock('chats', () => this.onChatUpsert(chats)),
      this.withLock('messages', () => this.syncMessagesHistory(messages)),
    ]);
  }

  private async syncMessagesHistory(messages) {
    const realMessages = messages.filter(isRealMessage);
    await this.messagesRepo.upsert(realMessages);
    this.log.log(
      `history sync - '${messages.length}' got messages, '${realMessages.length}' real messages`,
    );
  }

  private async onMessagesUpsert(update) {
    const { messages, type } = update;
    if (type !== 'notify' && type !== 'append') {
      this.log.debug(`unexpected type for messages.upsert: '${type}'`);
      return;
    }
    const realMessages = messages.filter(isRealMessage);
    await this.messagesRepo.upsert(realMessages);
    this.log.debug(
      `messages.upsert - ${messages.length} got messages, ${realMessages.length} real messages`,
    );
  }

  private async onMessageUpdate(updates) {
    for (const update of updates) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const jid = jidNormalizedUser(update.key.remoteJid!);
      const message = await this.messagesRepo.getByJidById(jid, update.key.id);
      if (!message) {
        continue;
      }
      const fields = { ...update.update };
      // It can overwrite the key, so we need to delete it
      delete fields['key'];
      Object.assign(message, fields);
      // In case of revoked messages - remove it
      // TODO: May be we should save the flag instead of completely removing the message
      const isYetRealMessage =
        isRealMessage(message, this.socket?.authState?.creds?.me?.id) || false;
      if (isYetRealMessage) {
        await this.messagesRepo.upsertOne(message);
      } else {
        await this.messagesRepo.deleteByJidByIds(jid, [update.key.id]);
      }
    }
  }

  private async onMessageDelete(item) {
    if ('all' in item) {
      await this.messagesRepo.deleteAllByJid(item.jid);
      return;
    }
    const jid = jidNormalizedUser(item.keys[0].remoteJid);
    const ids = item.keys.map((key) => key.id);
    await this.messagesRepo.deleteByJidByIds(jid, ids);
  }

  private async onChatUpsert(chats: Chat[]) {
    for (const chat of chats) {
      delete chat['messages'];
      chat.conversationTimestamp = toNumber(chat.conversationTimestamp);
      await this.chatRepo.save(chat);
    }
    this.log.log(`history sync - '${chats.length}' synced chats`);
  }

  private async onChatUpdate(updates: ChatUpdate[]) {
    for (const update of updates) {
      const chat = (await this.chatRepo.getById(update.id)) || ({} as Chat);
      Object.assign(chat, update);
      chat.conversationTimestamp = toNumber(chat.conversationTimestamp);
      delete chat['messages'];
      await this.chatRepo.save(chat);
    }
  }

  private async onChatDelete(ids: string[]) {
    for (const id of ids) {
      await this.chatRepo.deleteById(id);
      await this.messagesRepo.deleteAllByJid(id);
    }
  }

  private withLock(key, fn) {
    return this.lock.acquire(key, fn);
  }

  private async onContactsUpsert(contacts: Contact[]) {
    for (const update of contacts) {
      const contact = await this.contactRepo.getById(update.id);
      // remove undefined from data
      Object.keys(update).forEach(
        (key) => update[key] === undefined && delete update[key],
      );
      const result = { ...(contact || {}), ...update };
      await this.contactRepo.save(result);
    }
  }

  private async onContactUpdate(updates: Partial<Contact>[]) {
    for (const update of updates) {
      const contact = await this.contactRepo.getById(update.id);

      if (!contact) {
        this.log.warn(
          `got update for non-existent contact. update: '${JSON.stringify(
            update,
          )}'`,
        );
        continue;
        // TODO: Find contact by hash if not found
        //  find contact by attrs.hash, when user is not saved as a contact
        //  check the in-memory for that
      }
      Object.assign(contact, update);

      if (update.imgUrl === 'changed') {
        contact.imgUrl = this.socket
          ? await this.socket?.profilePictureUrl(contact.id)
          : undefined;
      } else if (update.imgUrl === 'removed') {
        delete contact.imgUrl;
      }
      await this.onContactsUpsert([contact]);
    }
  }

  private async onMessageReaction(reactions) {
    for (const { key, reaction } of reactions) {
      const msg = await this.messagesRepo.getByJidById(key.remoteJid, key.id);
      if (!msg) {
        this.log.warn(
          `got reaction update for non-existent message. key: '${JSON.stringify(
            key,
          )}'`,
        );
        continue;
      }
      updateMessageWithReaction(msg, reaction);
      await this.messagesRepo.upsertOne(msg);
    }
  }

  private async onMessageReceiptUpdate(updates) {
    for (const { key, receipt } of updates) {
      const msg = await this.messagesRepo.getByJidById(key.remoteJid, key.id);
      if (!msg) {
        this.log.warn(
          `got receipt update for non-existent message. key: '${JSON.stringify(
            key,
          )}'`,
        );
        continue;
      }
      updateMessageWithReceipt(msg, receipt);
      await this.messagesRepo.upsertOne(msg);
    }
  }

  private async onPresenceUpdate({ id, presences: update }) {
    this.presences[id] = this.presences[id] || {};
    Object.assign(this.presences[id], update);
  }

  async loadMessage(jid: string, id: string) {
    const data = await this.messagesRepo.getByJidById(jid, id);
    if (!data) {
      return null;
    }
    return proto.WebMessageInfo.fromObject(data);
  }

  getMessagesByJid(chatId: string, limit: number) {
    return this.messagesRepo.getAllByJid(toJID(chatId), toNumber(limit));
  }

  getChats() {
    return this.chatRepo.getAllWithMessages();
  }

  getContactById(jid) {
    return this.contactRepo.getById(jid);
  }

  getContacts() {
    return this.contactRepo.getAll();
  }
}
