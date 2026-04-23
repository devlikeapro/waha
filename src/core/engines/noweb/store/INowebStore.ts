import type {
  BaileysEventEmitter,
  Chat,
  Contact,
  proto,
} from '@adiwajshing/baileys';
import type { GroupMetadata } from '@adiwajshing/baileys/lib/Types/GroupMetadata';
import type { Label } from '@adiwajshing/baileys/lib/Types/Label';
import {
  GetChatMessagesFilter,
  OverviewFilter,
} from '@waha/structures/chats.dto';
import { LidToPhoneNumber } from '@waha/structures/lids.dto';
import {
  LimitOffsetParams,
  PaginationParams,
} from '@waha/structures/pagination.dto';

export interface INowebStore {
  presences: any;

  init(): Promise<void>;

  close(): Promise<void>;

  bind(ev: BaileysEventEmitter, socket: any): void;

  loadMessage(jid: string, id: string): Promise<proto.IWebMessageInfo>;

  getMessagesByJid(
    chatId: string,
    filter: GetChatMessagesFilter,
    pagination: PaginationParams,
    merge?: boolean,
  ): Promise<any>;

  getMessageById(
    chatId: string,
    messageId: string,
    merge?: boolean,
  ): Promise<any>;

  getChats(
    pagination: PaginationParams,
    broadcast: boolean,
    filter?: OverviewFilter,
    merge?: boolean,
  ): Promise<Chat[]>;

  getChat(jid: string): Promise<Chat | null>;

  getContacts(pagination: PaginationParams): Promise<Contact[]>;

  getContactById(jid: string): Promise<Contact>;

  getLabels(): Promise<Label[]>;

  getLabelById(labelId: string): Promise<Label | null>;

  getChatsByLabelId(labelId: string): Promise<Chat[]>;

  getChatLabels(chatId: string): Promise<Label[]>;

  getGroups(pagination: PaginationParams): Promise<GroupMetadata[]>;

  resetGroupsCache(): void;

  // Lid Repository methods
  getAllLids(pagination?: LimitOffsetParams): Promise<LidToPhoneNumber[]>;

  getLidsCount(): Promise<number>;

  findPNByLid(lid: string): Promise<string | null>;

  findLidByPN(pn: string): Promise<string | null>;
}
