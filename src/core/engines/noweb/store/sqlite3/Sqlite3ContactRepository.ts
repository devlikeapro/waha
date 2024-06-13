import { Contact } from '@adiwajshing/baileys';

import { IContactRepository } from '../IContactRepository';
import { Sqlite3KVRepository } from './Sqlite3KVRepository';

export class Sqlite3ContactRepository
  extends Sqlite3KVRepository<Contact>
  implements IContactRepository {}
