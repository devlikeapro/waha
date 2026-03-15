import type { Chat, Contact, GroupMetadata, proto } from '@adiwajshing/baileys';
import type makeWASocket from '@adiwajshing/baileys';
import type { Label } from '@adiwajshing/baileys/lib/Types/Label';
import { BadRequestException } from '@nestjs/common';
import {
  GetChatMessagesFilter,
  OverviewFilter,
} from '@waha/structures/chats.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import {
  LimitOffsetParams,
  PaginationParams,
} from '@waha/structures/pagination.dto';
import { PaginatorInMemory } from '@waha/utils/Paginator';

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

  getMessagesByJid(
    chatId: string,
    filter: GetChatMessagesFilter,
    pagination: PaginationParams,
    merge?: boolean,
  ): Promise<any> {
    throw new BadRequestException(this.errorMessage);
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
