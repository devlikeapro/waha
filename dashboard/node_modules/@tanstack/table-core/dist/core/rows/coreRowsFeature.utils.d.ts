import { RowData } from "../../types/type-utils.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/rows/coreRowsFeature.utils.d.ts
/**
 * Returns this row's zero-based position in the current pre-pagination row
 * model. Rows outside that model return `-1`.
 */
declare function row_getDisplayIndex<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): number;
/**
 * Returns the rows in the current display order after assigning their
 * zero-based display indexes.
 *
 * When expanded rows bypass pagination, expanded descendants are inserted into
 * the returned order even though they are absent from the pre-pagination row
 * model.
 */
declare function table_getRowsInDisplayOrder<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Row<TFeatures, TData>[];
/**
 * Reads and caches this row's value for a column.
 *
 * The value is produced by the column accessor. Missing columns or display
 * columns without an accessor return `undefined`.
 *
 * @example
 * ```ts
 * const firstName = row_getValue(row, 'firstName')
 * ```
 */
declare function row_getValue<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, columnId: string): unknown;
/**
 * Reads and caches the values used by faceting/grouping for a column.
 *
 * If the column defines `getUniqueValues`, that result is used. Otherwise the
 * row's accessor value is wrapped in a single-item array.
 *
 * @example
 * ```ts
 * const values = row_getUniqueValues(row, 'tags')
 * ```
 */
declare function row_getUniqueValues<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, columnId: string): unknown;
/**
 * Returns a renderable row value for a column.
 *
 * If the accessor value is nullish, the table's `renderFallbackValue` is used
 * instead.
 *
 * @example
 * ```ts
 * const value = row_renderValue(row, 'firstName')
 * ```
 */
declare function row_renderValue<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, columnId: string): any;
/**
 * Flattens this row's descendant tree into leaf rows.
 *
 * The row itself is not included; only nested `subRows` are walked.
 *
 * @example
 * ```ts
 * const descendants = row_getLeafRows(row)
 * ```
 */
declare function row_getLeafRows<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Array<Row<TFeatures, TData>>;
/**
 * Returns the deepest structural row depth in the core row model.
 * Root rows are depth `0`, their direct sub-rows are depth `1`, and so on.
 */
declare function table_getMaxSubRowDepth<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
/**
 * Looks up this row's direct parent, if it has one.
 *
 * Parent lookup prefers the core row model for structural parents, then falls
 * back to the pre-pagination row model for generated parent rows.
 *
 * @example
 * ```ts
 * const parent = row_getParentRow(row)
 * ```
 */
declare function row_getParentRow<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Row<TFeatures, TData> | undefined;
/**
 * Collects this row's ancestor chain from root to direct parent.
 *
 * The current row is not included. Rows without a parent return an empty array.
 *
 * @example
 * ```ts
 * const ancestors = row_getParentRows(row)
 * ```
 */
declare function row_getParentRows<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Row<TFeatures, TData>[];
/**
 * Constructs one cell for each leaf column in this row.
 *
 * The result follows `table.getAllLeafColumns()` order and includes hidden
 * columns; visibility-specific APIs filter this list later.
 *
 * @example
 * ```ts
 * const cells = row_getAllCells(row)
 * ```
 */
declare function row_getAllCells<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>>;
/**
 * Builds a lookup map of this row's cells keyed by column id.
 *
 * This is the static implementation behind `row.getAllCellsByColumnId()`.
 *
 * @example
 * ```ts
 * const cellsById = row_getAllCellsByColumnId(row)
 * ```
 */
declare function row_getAllCellsByColumnId<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Record<string, Cell<TFeatures, TData, unknown>>;
/**
 * Resolves the stable id for a row.
 *
 * `options.getRowId` wins when provided. Otherwise root rows use their index
 * and child rows append their index to the parent id, such as `0.2`.
 *
 * @example
 * ```ts
 * const id = table_getRowId(originalRow, table, index, parentRow)
 * ```
 */
declare function table_getRowId<TFeatures extends TableFeatures, TData extends RowData>(originalRow: TData, table: Table<TFeatures, TData>, index: number, parent?: Row<TFeatures, TData>): string;
/**
 * Looks up a row by id from the current or full row model.
 *
 * By default this searches `table.getRowModel()`. Passing `searchAll` searches
 * the pre-pagination model first, then falls back to the core model.
 *
 * @example
 * ```ts
 * const row = table_getRow(table, rowId, true)
 * ```
 */
declare function table_getRow<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, rowId: string, searchAll?: boolean): Row<TFeatures, TData>;
//#endregion
export { row_getAllCells, row_getAllCellsByColumnId, row_getDisplayIndex, row_getLeafRows, row_getParentRow, row_getParentRows, row_getUniqueValues, row_getValue, row_renderValue, table_getMaxSubRowDepth, table_getRow, table_getRowId, table_getRowsInDisplayOrder };