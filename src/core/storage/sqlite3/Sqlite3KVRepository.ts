import { Database } from 'better-sqlite3';
import Knex from 'knex';

import { Field, Schema } from './Schema';

/**
 * Key value repository with extra metadata
 */
export class Sqlite3KVRepository<Entity> {
  private UPSERT_BATCH_SIZE = 100;
  protected db: Database;

  private readonly metadata: Map<string, (entity: Entity) => any>;
  protected readonly table: string;
  private readonly columns: Field[];
  private knex: Knex.Knex;

  constructor(
    db: Database,
    schema: Schema,
    metadata: Map<string, (entity: Entity) => any> | null = null,
  ) {
    this.db = db;
    this.columns = schema.columns;
    this.table = schema.name;
    this.metadata = metadata || new Map();

    // sqlite does not support inserting default values. Set the `useNullAsDefault` flag to hide this warning. (see docs https://knexjs.org/guide/query-builder.html#insert).
    this.knex = Knex({ client: 'better-sqlite3', useNullAsDefault: true });
  }

  getAll() {
    return this.all(this.select());
  }

  getAllByIds(ids: string[]) {
    return this.all(this.select().whereIn('id', ids));
  }

  protected getAllBy(filters: any) {
    const query = this.select().where(filters);
    return this.all(query);
  }

  protected async getBy(filters: any) {
    const query = this.select().where(filters).limit(1);
    return this.get(query);
  }

  protected dump(entity: Entity) {
    const data = {};
    const raw = entity;
    for (const field of this.columns) {
      const fn = this.metadata.get(field.fieldName);
      if (fn) {
        data[field.fieldName] = fn(raw);
      } else if (field.fieldName == 'data') {
        data['data'] = this.stringify(raw);
      } else {
        data[field.fieldName] = raw[field.fieldName];
      }
    }
    return data;
  }

  save(entity: Entity) {
    return this.upsertOne(entity);
  }

  async getById(id: string): Promise<Entity | null> {
    return this.getBy({ id: id });
  }

  async upsertOne(entity: Entity): Promise<void> {
    await this.upsertMany([entity]);
  }

  async upsertMany(entities: Entity[]): Promise<void> {
    if (entities.length === 0) {
      return;
    }
    const batchSize = this.UPSERT_BATCH_SIZE;
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      await this.upsertBatch(batch);
    }
  }

  private async upsertBatch(entities: Entity[]): Promise<void> {
    const data = entities.map((entity) => this.dump(entity));
    const keys = this.columns.map((c) => c.fieldName);
    const values = data.map((d) => Object.values(d)).flat();
    try {
      this.db
        .prepare(
          `INSERT INTO ${this.table} (${keys.join(', ')})
           VALUES ${data
             .map(() => `(${keys.map(() => '?').join(', ')})`)
             .join(', ')}
           ON CONFLICT(id) DO UPDATE
               SET ${keys.map((key) => `${key} = excluded.${key}`).join(', ')}`,
        )
        .run(values);
    } catch (err) {
      console.error(`Error upserting data: ${err}, values: ${values}`);
      throw err;
    }
  }

  protected async deleteBy(filters: any) {
    const query = this.delete().where(filters);
    await this.run(query);
  }

  async deleteAll() {
    const query = this.delete();
    await this.run(query);
  }

  async deleteById(id: string) {
    await this.deleteBy({ id: id });
  }

  /**
   * SQL helpers
   */

  protected select() {
    return this.knex.select().from(this.table);
  }

  protected delete() {
    return this.knex.delete().from(this.table);
  }

  protected async all(query: any) {
    const sql = query.toSQL().sql;
    const bind = query.toSQL().bindings;
    const rows: any[] = this.db.prepare(sql).all(bind);
    return rows.map((row) => this.parse(row));
  }

  protected async get(query: any) {
    const sql = query.toSQL().sql;
    const bind = query.toSQL().bindings;
    const row: any = this.db.prepare(sql).get(bind);
    if (!row) {
      return null;
    }
    return this.parse(row);
  }

  protected async run(query: any) {
    const sql = query.toSQL().sql;
    const bind = query.toSQL().bindings;
    return this.db.prepare(sql).run(bind);
  }

  protected stringify(data: any): string {
    return JSON.stringify(data);
  }

  protected parse(row: any) {
    return JSON.parse(row.data);
  }
}
