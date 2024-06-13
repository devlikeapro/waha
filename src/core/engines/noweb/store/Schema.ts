export class Field {
  constructor(
    public fieldName: string,
    public type: string,
  ) {}
}

export class Index {
  constructor(
    public name: string,
    public columns: string[],
  ) {}
}

export class Schema {
  constructor(
    public name: string,
    public columns: Field[],
    public indexes: Index[],
  ) {}
}

export const NOWEB_STORE_SCHEMA = [
  new Schema(
    'contacts',
    [new Field('id', 'TEXT'), new Field('data', 'TEXT')],
    [new Index('contacts_id_index', ['id'])],
  ),
  new Schema(
    'chats',
    [
      new Field('id', 'TEXT'),
      new Field('conversationTimestamp', 'INTEGER'),
      new Field('data', 'TEXT'),
    ],
    [
      new Index('chats_id_index', ['id']),
      new Index('chats_conversationTimestamp_index', ['conversationTimestamp']),
    ],
  ),
  new Schema(
    'messages',
    [
      new Field('jid', 'TEXT'),
      new Field('id', 'TEXT'),
      new Field('messageTimestamp', 'INTEGER'),
      new Field('data', 'TEXT'),
    ],
    [
      new Index('messages_id_index', ['id']),
      new Index('messages_jid_id_index', ['jid', 'id']),
      new Index('messages_jid_timestamp_index', ['jid', 'messageTimestamp']),
      new Index('timestamp_index', ['messageTimestamp']),
    ],
  ),
];
