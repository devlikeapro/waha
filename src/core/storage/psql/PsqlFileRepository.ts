import { createReadStream, createWriteStream } from 'fs';
import { stat } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { Transform, TransformCallback } from 'stream';
import Knex from 'knex';
import { Logger } from 'pino';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { from: copyFrom, to: copyTo } = require('pg-copy-streams');

/**
 * Strips PostgreSQL binary COPY framing and emits the raw bytes of the first
 * column from every tuple.
 *
 * Binary COPY layout:
 *   [11-byte signature][4-byte flags][4-byte ext_len][ext_data?]
 *   per-tuple: [int16 field_count][int32 field_len][field_bytes]
 *   trailer:   [int16 = -1]
 */
class PgBinaryFirstColumnStream extends Transform {
  private state:
    | 'signature'
    | 'flags'
    | 'ext_len'
    | 'ext_data'
    | 'field_count'
    | 'field_len'
    | 'field_data'
    | 'done' = 'signature';

  private needed = 11;
  private accumulator = Buffer.alloc(0);
  private fieldBytesLeft = 0;

  _transform(incoming: Buffer, _enc: string, cb: TransformCallback) {
    let pos = 0;
    while (pos < incoming.length) {
      if (this.state === 'done') break;

      if (this.state === 'field_data') {
        const take = Math.min(incoming.length - pos, this.fieldBytesLeft);
        this.push(incoming.slice(pos, pos + take));
        this.fieldBytesLeft -= take;
        pos += take;
        if (this.fieldBytesLeft === 0) {
          this.state = 'field_count';
          this.needed = 2;
          this.accumulator = Buffer.alloc(0);
        }
        continue;
      }

      const take = Math.min(
        incoming.length - pos,
        this.needed - this.accumulator.length,
      );
      this.accumulator = Buffer.concat([
        this.accumulator,
        incoming.slice(pos, pos + take),
      ]);
      pos += take;
      if (this.accumulator.length < this.needed) {
        continue;
      }

      const acc = this.accumulator;
      this.accumulator = Buffer.alloc(0);

      switch (this.state) {
        case 'signature':
          this.state = 'flags';
          this.needed = 4;
          break;
        case 'flags':
          this.state = 'ext_len';
          this.needed = 4;
          break;
        case 'ext_len': {
          const extLen = acc.readUInt32BE(0);
          if (extLen > 0) {
            this.state = 'ext_data';
            this.needed = extLen;
          } else {
            this.state = 'field_count';
            this.needed = 2;
          }
          break;
        }
        case 'ext_data':
          this.state = 'field_count';
          this.needed = 2;
          break;
        case 'field_count': {
          const count = acc.readInt16BE(0);
          if (count === -1) {
            this.state = 'done';
          } else {
            this.state = 'field_len';
            this.needed = 4;
          }
          break;
        }
        case 'field_len': {
          const len = acc.readInt32BE(0);
          if (len === -1) {
            this.state = 'field_count';
            this.needed = 2;
          } else {
            this.state = 'field_data';
            this.fieldBytesLeft = len;
          }
          break;
        }
      }
    }
    cb();
  }

  _flush(cb: TransformCallback) {
    cb();
  }
}

/**
 * Wraps a raw binary stream in PostgreSQL binary COPY framing so it can be fed
 * to `COPY … FROM STDIN (FORMAT BINARY)`.
 *
 * Binary COPY layout written:
 *   [11-byte signature][4-byte flags=0][4-byte ext_len=0]
 *   [int16 field_count=1][int32 field_len=fileSize][raw bytes…]
 *   [int16 trailer=-1]
 *
 * The total field size must be known upfront (pass via constructor).
 */
class PgBinaryWriteFrameStream extends Transform {
  private headerSent = false;
  private readonly fieldLen: number;

  constructor(fieldLen: number) {
    super();
    this.fieldLen = fieldLen;
  }

  _transform(chunk: Buffer, _enc: string, cb: TransformCallback) {
    if (!this.headerSent) {
      this.push(this.buildFrameHeader());
      this.headerSent = true;
    }
    this.push(chunk);
    cb();
  }

  _flush(cb: TransformCallback) {
    if (!this.headerSent) {
      this.push(this.buildFrameHeader());
    }
    const trailer = Buffer.alloc(2);
    trailer.writeInt16BE(-1, 0);
    this.push(trailer);
    cb();
  }

  private buildFrameHeader(): Buffer {
    // [11-byte signature][4-byte flags][4-byte ext_len][2-byte field_count][4-byte field_len]
    const buf = Buffer.alloc(25);
    let offset = 0;

    // Signature: PGCOPY\n\xff\r\n\0
    buf.write('PGCOPY\n', offset, 'ascii');
    offset += 7;
    buf[offset++] = 0xff;
    buf[offset++] = 0x0d;
    buf[offset++] = 0x0a;
    buf[offset++] = 0x00;

    // flags (int32): 0
    offset += 4;
    // header extension area length (int32): 0
    offset += 4;

    // field_count (int16): 1
    buf.writeInt16BE(1, offset);
    offset += 2;

    // field_len (int32): total byte size of the column value
    buf.writeInt32BE(this.fieldLen, offset);

    return buf;
  }
}

const FILE_NAMES_BATCH = 1000;

// The full path without its extension: "AAA.0.jpeg" => "AAA.0", NULL without one
const FILE_NAME_WITHOUT_EXTENSION = "substring(fullpath from '^(.+)\\.[^.]+$')";

function Migrations(table: string): string[] {
  return [
    `CREATE TABLE IF NOT EXISTS ${table}
     (
         id               SERIAL PRIMARY KEY,
         fullpath         TEXT  NOT NULL,
         content          BYTEA NOT NULL,
         created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         last_accessed_at TIMESTAMP DEFAULT NULL,
         metadata         JSONB
     )`,
    // fullpath is unique constraint
    `CREATE UNIQUE INDEX IF NOT EXISTS ${table}_fullpath_index ON ${table} (fullpath)`,
    // index on created
    `CREATE INDEX IF NOT EXISTS ${table}_created_at_index ON ${table} (created_at)`,
    // index on last_accessed_at
    `CREATE INDEX IF NOT EXISTS ${table}_last_accessed_at_index ON ${table} (last_accessed_at)`,
    // index on metadata (JSONB)
    `CREATE INDEX IF NOT EXISTS ${table}_metadata_index ON ${table} USING GIN (metadata)`,
  ];
}

export interface FileData {
  fullpath: string;
  content: Buffer;
  created_at: number;
  metadata: any;
}

/**
 * General purpose file repository for storing files in a PostgreSQL database.
 */
export class PsqlFileRepository {
  get tableName() {
    return 'files';
  }

  constructor(
    private knex: Knex.Knex,
    private logger: Logger,
  ) {}

  protected table() {
    return this.knex(this.tableName);
  }

  /**
   * Stream a local file directly into the database without loading it into
   * memory.  Uses PostgreSQL binary COPY into a temporary table, then upserts
   * into the real table — safe for arbitrarily large files.
   */
  async saveFromFile(fullpath: string, inputPath: string, metadata: any = {}) {
    const { size } = await stat(inputPath);
    const now = new Date().toISOString();

    const conn = await (this.knex.client as any).acquireConnection();
    try {
      await conn.query('BEGIN');
      try {
        // Reuse the same temp table across pool connections; ON COMMIT DELETE ROWS
        // clears it automatically at every successful COMMIT.
        await conn.query(
          'CREATE TEMP TABLE IF NOT EXISTS _waha_copy_tmp (content BYTEA) ON COMMIT DELETE ROWS',
        );
        // Guard against leftover rows from a previously rolled-back transaction.
        await conn.query('TRUNCATE _waha_copy_tmp');

        const copyStream = conn.query(
          copyFrom('COPY _waha_copy_tmp FROM STDIN (FORMAT BINARY)'),
        );
        await pipeline(
          createReadStream(inputPath),
          new PgBinaryWriteFrameStream(size),
          copyStream,
        );

        await conn.query(
          `INSERT INTO ${this.tableName} (fullpath, content, created_at, metadata)
           SELECT $1, content, $2, $3 FROM _waha_copy_tmp
           ON CONFLICT (fullpath) DO UPDATE SET
             content     = EXCLUDED.content,
             created_at  = EXCLUDED.created_at,
             metadata    = EXCLUDED.metadata`,
          [fullpath, now, metadata],
        );

        await conn.query('COMMIT');
      } catch (err) {
        await conn.query('ROLLBACK').catch(() => {});
        throw err;
      }
    } finally {
      (this.knex.client as any).releaseConnection(conn);
    }
  }

  async save(fullpath: string, content: Buffer, metadata: any = {}) {
    const now = new Date().toISOString();
    await this.table()
      .insert({
        fullpath: fullpath,
        content: content,
        created_at: now,
        metadata: metadata,
      })
      .onConflict('fullpath')
      .merge({
        content: this.knex.raw('EXCLUDED.content'),
        created_at: this.knex.raw('EXCLUDED.created_at'),
        metadata: this.knex.raw('EXCLUDED.metadata'),
      });
  }

  async exists(fullpath: string): Promise<boolean> {
    const result = await this.table().where('fullpath', fullpath);
    return result.length > 0;
  }

  async delete(fullpath: string) {
    await this.table().where('fullpath', fullpath).del();
  }

  /**
   * Deletes the files "{name}.{extension}" of the names, returns their full paths.
   * No index on the name: a table scan, fine for rare deletions.
   */
  async deleteByNames(names: string[]): Promise<string[]> {
    const deleted: string[] = [];
    for (let i = 0; i < names.length; i += FILE_NAMES_BATCH) {
      const batch = names.slice(i, i + FILE_NAMES_BATCH);
      const rows = await this.table()
        .whereRaw(`${FILE_NAME_WITHOUT_EXTENSION} = ANY(?::text[])`, [batch])
        .del()
        .returning('fullpath');
      deleted.push(...rows.map((row) => row.fullpath));
    }
    return deleted;
  }

  /**
   * Stream the content of a stored file directly to disk without materialising
   * it in memory.  Uses PostgreSQL binary COPY so the data never passes through
   * Node's string layer — safe for arbitrarily large blobs.
   *
   * @returns true when the file was found and written; false when it does not exist.
   */
  async fetchToFile(fullpath: string, outputPath: string): Promise<boolean> {
    const exists = await this.exists(fullpath);
    if (!exists) {
      return false;
    }

    // Single-quote escaping is sufficient: fullpath values are session-derived
    // filenames that never contain single quotes, but we escape defensively.
    const escaped = fullpath.replace(/'/g, "''");
    const sql = `COPY (SELECT content FROM ${this.tableName} WHERE fullpath = '${escaped}') TO STDOUT (FORMAT BINARY)`;

    const conn = await (this.knex.client as any).acquireConnection();
    try {
      const copyStream = conn.query(copyTo(sql));
      const writeStream = createWriteStream(outputPath);
      await pipeline(copyStream, new PgBinaryFirstColumnStream(), writeStream);
    } finally {
      (this.knex.client as any).releaseConnection(conn);
    }

    this.touch(fullpath).catch((err) => {
      this.logger.error(`Failed to update last_accessed_at: ${err}`);
    });
    return true;
  }

  async fetch(fullpath: string): Promise<FileData | null> {
    const result = await this.table().where('fullpath', fullpath);
    const data = result.length > 0 ? result[0] : null;
    if (!data) {
      return null;
    }
    data.created_at = new Date(data.created_at).getTime();
    this.touch(fullpath).catch((err) => {
      this.logger.error(`Failed to save last accessed time: ${err}`);
    });
    return data;
  }

  async init() {
    for (const migration of this.migrations()) await this.knex.raw(migration);
  }

  protected async touch(fullpath: string) {
    const now = new Date().toISOString();
    await this.table()
      .where('fullpath', fullpath)
      .update({ last_accessed_at: now });
  }

  protected migrations() {
    return Migrations(this.tableName);
  }
}
