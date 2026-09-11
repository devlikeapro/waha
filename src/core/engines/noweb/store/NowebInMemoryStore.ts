import type { Chat, Contact, GroupMetadata, proto } from '@adiwajshing/baileys';
import type makeWASocket from '@adiwajshing/baileys';
import type { Label } from '@adiwajshing/baileys/lib/Types/Label';
import { BadRequestException } from '@nestjs/common';
import { AckToStatus } from '@waha/core/utils/acks';
import {
  GetChatMessagesFilter,
  OverviewFilter,
} from '@waha/structures/chats.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import {
  LimitOffsetParams,
  PaginationParams,
  SortOrder,
} from '@waha/structures/pagination.dto';
import { PaginatorInMemory } from '@waha/utils/Paginator';
import * as lodash from 'lodash';

import { INowebStore } from './INowebStore';
import makeInMemoryStore from './memory/make-in-memory-store';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require('pino')();

export class NowebInMemoryStore implements INowebStore {
  private socket: ReturnType<typeof makeWASocket>;

  private store: ReturnType<typeof makeInMemoryStore>;
  errorMessage =
    'Enable NOWEB store "config.noweb.store.enabled=True" and "config.noweb.store.full_sync=True" when starting a new session. ' +
    'Read more: https://waha.devlike.pro/docs/engines/noweb#store';

  constructor() {
    this.store = makeInMemoryStore({ logger: logger });
    const presences = {};
    this.store.presences = presences;
    // Adjust inline even handler
    this.store.setPresences(presences);
  }

  init(): Promise<void> {
    return;
  }

  close(): Promise<void> {
    return;
  }

  get presences() {
    return this.store.presences;
  }

  bind(ev: any, socket: any) {
    this.store.bind(ev);
    this.socket = socket;
  }

  loadMessage(jid: string, id: string): Promise<proto.IWebMessageInfo> {
    return this.store.loadMessage(jid, id);
  }

  async getMessagesByJid(
    chatId: string,
    filter: GetChatMessagesFilter,
    pagination: PaginationParams,
    merge?: boolean,
  ): Promise<any> {
    let messages = await this.store.loadMessages(
      chatId,
      Number.MAX_SAFE_INTEGER,
      undefined,
    );
    const lte = filter['filter.timestamp.lte'];
    const gte = filter['filter.timestamp.gte'];
    const fromMe = filter['filter.fromMe'];
    const ack = filter['filter.ack'];
    messages = messages.filter((msg) => {
      const timestamp = lodash.toNumber(msg.messageTimestamp as any);
      if (lte != null && timestamp > lte) {
        return false;
      }
      if (gte != null && timestamp < gte) {
        return false;
      }
      if (fromMe != null && msg.key.fromMe !== fromMe) {
        return false;
      }
      if (ack != null && msg.status !== AckToStatus(ack)) {
        return false;
      }
      return true;
    });
    // Newest first by default, same as the persistent store
    const order = pagination.sortOrder || SortOrder.DESC;
    messages = lodash.orderBy(
      messages,
      [(msg) => lodash.toNumber(msg.messageTimestamp as any)],
      [order],
    );
    const paginator = new PaginatorInMemory({
      limit: pagination.limit,
      offset: pagination.offset,
    });
    return paginator.apply(messages);
  }

  getMessageById(
    chatId: string,
    messageId: string,
    merge?: boolean,
  ): Promise<any> {
    throw new BadRequestException(this.errorMessage);
  }

  getChats(
    pagination: PaginationParams,
    broadcast: boolean,
    filter?: OverviewFilter,
    merge?: boolean,
  ): Promise<Chat[]> {
    throw new BadRequestException(this.errorMessage);
  }

  getChat(jid: string): Promise<Chat | null> {
    return null;
  }

  getContacts(pagination: PaginationParams): Promise<Contact[]> {
    throw new BadRequestException(this.errorMessage);
  }

  getContactById(jid: string): Promise<Contact> {
    throw new BadRequestException(this.errorMessage);
  }

  getLabels(): Promise<Label[]> {
    throw new BadRequestException(this.errorMessage);
  }

  getLabelById(labelId: string): Promise<Label | null> {
    throw new BadRequestException(this.errorMessage);
  }

  getChatsByLabelId(labelId: string): Promise<Chat[]> {
    throw new BadRequestException(this.errorMessage);
  }

  getChatLabels(chatId: string): Promise<Label[]> {
    throw new BadRequestException(this.errorMessage);
  }

  async getGroups(pagination: PaginationParams): Promise<GroupMetadata[]> {
    const response = await this.socket?.groupFetchAllParticipating();
    const groups: any[] = Object.values(response);
    const paginator = new PaginatorInMemory(pagination);
    return paginator.apply(groups);
  }

  resetGroupsCache() {
    return;
  }

  //
  // Lids methods
  //
  getAllLids(pagination?: LimitOffsetParams): Promise<LidToPhoneNumber[]> {
    throw new BadRequestException(this.errorMessage);
  }

  findLidByPN(pn: string): Promise<string | null> {
    throw new BadRequestException(this.errorMessage);
  }

  findPNByLid(lid: string): Promise<string | null> {
    throw new BadRequestException(this.errorMessage);
  }

  getLidsCount(): Promise<number> {
    throw new BadRequestException(this.errorMessage);
  }
}
