import { Contact } from '@adiwajshing/baileys';

export interface IContactRepository {
  getAll(): Promise<Contact[]>;

  getById(id: string): Promise<Contact | null>;

  deleteAll(): Promise<void>;

  deleteById(id: string): Promise<void>;

  save(contact: Contact): Promise<void>;
}
