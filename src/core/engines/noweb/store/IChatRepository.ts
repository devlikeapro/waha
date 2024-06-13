import { Chat } from '@adiwajshing/baileys';

export interface IChatRepository {
  getAll(): Promise<Chat[]>;

  getAllWithMessages(): Promise<Chat[]>;

  getById(id: string): Promise<Chat | null>;

  deleteAll(): Promise<void>;

  deleteById(id: string): Promise<void>;

  save(chat: Chat): Promise<void>;
}
