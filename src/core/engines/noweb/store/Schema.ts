import { Field, Index, Schema } from '@waha/core/storage/sqlite3/Schema';

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
  new Schema(
    'labels',
    [new Field('id', 'TEXT'), new Field('data', 'TEXT')],
    [new Index('labels_id_index', ['id'])],
  ),
  new Schema(
    'labelAssociations',
    [
      new Field('id', 'TEXT'),
      new Field('type', 'TEXT'),
      new Field('labelId', 'TEXT'),
      new Field('chatId', 'TEXT'),
      new Field('messageId', 'TEXT'),
      new Field('data', 'TEXT'),
    ],
    [
      new Index('label_assoc_id_index', ['id']),
      new Index('label_assoc_type_label_index', ['type', 'labelId']),
      new Index('label_assoc_type_chat_index', ['type', 'chatId']),
      new Index('label_assoc_type_message_index', ['type', 'messageId']),
    ],
  ),
];
