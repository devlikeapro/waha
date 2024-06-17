import {
  BaileysEventEmitter,
  Chat,
  Contact,
  proto,
} from '@adiwajshing/baileys';

export interface INowebStore {
  presences: any;

  init(): Promise<void>;

  close(): Promise<void>;

  bind(ev: BaileysEventEmitter, socket: any): void;

  loadMessage(jid: string, id: string): Promise<proto.IWebMessageInfo>;

  getMessagesByJid(chatId: string, limit: number): Promise<any>;

  getChats(limit?: number, offset?: number): Promise<Chat[]>;

  getContacts(): Promise<Contact[]>;

  getContactById(jid: string): Promise<Contact>;
}
