import { CellData, RowData } from "../../types/type-utils.js";
import { ColumnDef } from "../../types/ColumnDef.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/columns/coreColumnsFeature.utils.d.ts
/**
 * Flattens this column and every descendant column into a single array.
 *
 * Group columns appear before their child columns, which matches the normalized
 * column hierarchy produced during table construction.
 *
 * @example
 * ```ts
 * const flatColumns = column_getFlatColumns(column)
 * ```
 */
declare function column_getFlatColumns<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): Array<Column<TFeatures, TData, TValue>>;
/**
 * Collects the terminal leaf columns below this column.
 *
 * Group columns return their ordered descendants. Non-group columns return an
 * array containing only the column itself.
 *
 * @example
 * ```ts
 * const leafColumns = column_getLeafColumns(column)
 * ```
 */
declare function column_getLeafColumns<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): Array<Column<TFeatures, TData, TValue>>;
/**
 * Merges built-in, feature, and user default column definitions.
 *
 * Built-in defaults provide a header and fallback cell renderer, feature
 * defaults can add feature-specific column options, and
 * `options.defaultColumn` wins last.
 *
 * @example
 * ```ts
 * const defaultColumn = table_getDefaultColumnDef(table)
 * ```
 */
declare function table_getDefaultColumnDef<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Partial<ColumnDef<TFeatures, TData, unknown>>;
/**
 * Normalizes `options.columns` into the table's nested column tree.
 *
 * Each column definition is constructed with its parent and depth, and group
 * column children are recursively constructed.
 *
 * @example
 * ```ts
 * const columns = table_getAllColumns(table)
 * ```
 */
declare function table_getAllColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<Column<TFeatures, TData, unknown>>;
/**
 * Flattens every table column, including group columns and leaf columns.
 *
 * Use this when parent/group columns must be included in addition to data leaf
 * columns.
 *
 * @example
 * ```ts
 * const flatColumns = table_getAllFlatColumns(table)
 * ```
 */
declare function table_getAllFlatColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<Column<TFeatures, TData, unknown>>;
/**
 * Builds an id lookup for every flat column in the table.
 *
 * Group columns and leaf columns are included. Later columns with the same id
 * replace earlier entries.
 *
 * @example
 * ```ts
 * const columnsById = table_getAllFlatColumnsById(table)
 * ```
 */
declare function table_getAllFlatColumnsById<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Record<string, Column<TFeatures, TData, unknown>>;
/**
 * Collects all terminal leaf columns in their current table order.
 *
 * Column ordering features can reorder the collected leaves before the result
 * is returned.
 *
 * @example
 * ```ts
 * const leafColumns = table_getAllLeafColumns(table)
 * ```
 */
declare function table_getAllLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<Column<TFeatures, TData, unknown>>;
/**
 * Builds an id lookup for terminal leaf columns only.
 *
 * Parent/group columns are excluded, making this lookup appropriate for row
 * cells and feature state keyed by data columns.
 *
 * @example
 * ```ts
 * const leavesById = table_getAllLeafColumnsById(table)
 * ```
 */
declare function table_getAllLeafColumnsById<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Record<string, Column<TFeatures, TData, unknown>>;
/**
 * Looks up a column by id from the flat column map.
 *
 * The lookup can return group columns or leaf columns. In development, a
 * missing id logs a warning to help catch stale column references.
 *
 * @example
 * ```ts
 * const column = table_getColumn(table, 'firstName')
 * ```
 */
declare function table_getColumn<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, columnId: string): Column<TFeatures, TData, unknown> | undefined;
//#endregion
export { column_getFlatColumns, column_getLeafColumns, table_getAllColumns, table_getAllFlatColumns, table_getAllFlatColumnsById, table_getAllLeafColumns, table_getAllLeafColumnsById, table_getColumn, table_getDefaultColumnDef };