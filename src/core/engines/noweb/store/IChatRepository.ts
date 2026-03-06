import type { Chat } from '@adiwajshing/baileys';
import { OverviewFilter } from '@waha/structures/chats.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';

export interface IChatRepository {
  getAll(): Promise<Chat[]>;

  getAllByIds(ids: string[]): Promise<Chat[]>;

  getAllWithMessages(
    pagination: PaginationParams,
    broadcast: boolean,
    filter?: OverviewFilter,
    merge?: boolean,
  ): Promise<Chat[]>;

  getById(id: string): Promise<Chat | null>;

  deleteAll(): Promise<void>;

  deleteById(id: string): Promise<void>;

  save(chat: Chat): Promise<void>;

  upsertMany(chats: Chat[]): Promise<void>;
}
