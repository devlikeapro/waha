import { WAMessage } from '@adiwajshing/baileys';

import { INowebStorage } from '../INowebStorage';
import { Field, Index, NOWEB_STORE_SCHEMA, Schema } from '../Schema';
import { Sqlite3ChatRepository } from './Sqlite3ChatRepository';
import { Sqlite3ContactRepository } from './Sqlite3ContactRepository';
import { Sqlite3MessagesRepository } from './Sqlite3MessagesRepository';
import { Sqlite3SchemaValidation } from './Sqlite3SchemaValidation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3');

export class Sqlite3Storage implements INowebStorage {
  private readonly db: any;
  private readonly tables: Schema[];

  constructor(filePath: string) {
    this.db = new Database(filePath);
    this.tables = NOWEB_STORE_SCHEMA;
  }

  async init() {
    this.db.pragma('journal_mode = WAL;');
    this.migrate();
    this.validateSchema();
  }

  private migrate() {
    this.migration0001init();
  }

  private validateSchema() {
    for (const table of this.tables) {
      new Sqlite3SchemaValidation(table, this.db).validate();
    }
  }

  private migration0001init() {
    // Contacts
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY, data TEXT)',
    );
    this.db.exec(
      'CREATE UNIQUE INDEX IF NOT EXISTS contacts_id_index ON contacts (id)',
    );

    // Chats
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, conversationTimestamp INTEGER, data TEXT)',
    );
    this.db.exec(
      'CREATE UNIQUE INDEX IF NOT EXISTS chats_id_index ON chats (id)',
    );
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS chats_conversationTimestamp_index ON chats (conversationTimestamp)',
    );

    // Messages
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS messages (jid TEXT, id TEXT, messageTimestamp INTEGER, data TEXT)',
    );
    this.db.exec(
      'CREATE UNIQUE INDEX IF NOT EXISTS messages_id_index ON messages (id)',
    );
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS messages_jid_id_index ON messages (jid, id)',
    );
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS messages_jid_timestamp_index ON messages (jid, messageTimestamp)',
    );
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS timestamp_index ON messages (messageTimestamp)',
    );
  }

  async close() {
    this.db.close();
  }

  getContactsRepository() {
    return new Sqlite3ContactRepository(this.db, this.getSchema('contacts'));
  }

  getChatRepository() {
    return new Sqlite3ChatRepository(this.db, this.getSchema('chats'));
  }

  getMessagesRepository() {
    const metadata = new Map()
      .set('jid', (msg: WAMessage) => msg.key.remoteJid)
      .set('id', (msg: WAMessage) => msg.key.id)
      .set('messageTimestamp', (msg: WAMessage) => msg.messageTimestamp);
    return new Sqlite3MessagesRepository(
      this.db,
      this.getSchema('messages'),
      metadata,
    );
  }

  getSchema(name: string) {
    const schema = this.tables.find((table) => table.name === name);
    if (!schema) {
      throw new Error(`Schema not found: ${name}`);
    }
    return schema;
  }
}
