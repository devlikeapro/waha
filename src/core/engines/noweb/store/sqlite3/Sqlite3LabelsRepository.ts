import { Label } from '@adiwajshing/baileys/lib/Types/Label';
import { ILabelsRepository } from '@waha/core/engines/noweb/store/ILabelsRepository';

import { Sqlite3KVRepository } from './Sqlite3KVRepository';

export class Sqlite3LabelsRepository
  extends Sqlite3KVRepository<Label>
  implements ILabelsRepository {}
