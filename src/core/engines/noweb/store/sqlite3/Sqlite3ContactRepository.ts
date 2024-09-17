import { Contact } from '@adiwajshing/baileys';

import { IContactRepository } from '../IContactRepository';
import { NOWEBSqlite3KVRepository } from './NOWEBSqlite3KVRepository';

export class Sqlite3ContactRepository
  extends NOWEBSqlite3KVRepository<Contact>
  implements IContactRepository {}
