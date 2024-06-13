import { IChatRepository } from './IChatRepository';
import { IContactRepository } from './IContactRepository';
import { IMessagesRepository } from './IMessagesRepository';

export interface INowebStorage {
  init(): Promise<void>;

  close(): Promise<void>;

  getContactsRepository(): IContactRepository;

  getChatRepository(): IChatRepository;

  getMessagesRepository(): IMessagesRepository;
}
