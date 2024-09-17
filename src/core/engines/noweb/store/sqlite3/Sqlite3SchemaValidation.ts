import { Schema } from '@waha/core/storage/sqlite3/Schema';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3');

export class Sqlite3SchemaValidation {
  constructor(
    private table: Schema,
    private db,
  ) {}

  validate() {
    const table = this.table;

    // Check table has the columns
    const columns = this.db.prepare(`PRAGMA table_info(${table.name})`).all();
    // Check exact number of columns
    if (columns.length !== table.columns.length) {
      throw new Error(
        `Table '${table.name}' does not have expected number of columns. Expected ${table.columns.length}, got ${columns.length}`,
      );
    }

    // Check column + type
    for (const column of table.columns) {
      const columnInfo = columns.find((c) => c.name === column.fieldName);
      if (!columnInfo) {
        throw new Error(
          `Table '${table.name}' does not have column '${column.fieldName}'`,
        );
      }
      if (columnInfo.type !== column.type) {
        throw new Error(
          `Table '${table.name}' column '${column.fieldName}' has type '${columnInfo.type}' but expected '${column.type}'`,
        );
      }
    }

    // Check table has expected indexes
    const indexes = this.db.prepare(`PRAGMA index_list(${table.name})`).all();
    const indexNames = indexes.map((index) => index.name);
    for (const index of table.indexes) {
      if (!indexNames.includes(index.name)) {
        throw new Error(
          `Table '${table.name}' does not have index '${index.name}'`,
        );
      }
    }
  }
}
