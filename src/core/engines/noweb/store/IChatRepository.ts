import { Chat } from '@adiwajshing/baileys';

export interface IChatRepository {
  getAll(): Promise<Chat[]>;

  getAllWithMessages(limit?: number, offset?: number): Promise<Chat[]>;

  getById(id: string): Promise<Chat | null>;

  deleteAll(): Promise<void>;

  deleteById(id: string): Promise<void>;

  save(chat: Chat): Promise<void>;
}
