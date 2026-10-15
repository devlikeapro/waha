import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { ColumnPinningPosition } from "../column-pinning/columnPinningFeature.types.js";
import { ColumnIndexes, ColumnOrderState } from "./columnOrderingFeature.types.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-ordering/columnOrderingFeature.utils.d.ts
/**
 * Creates the default column order state.
 *
 * The feature default is an empty array, meaning leaf columns keep their natural
 * definition order. Reset APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const order = getDefaultColumnOrderState()
 * ```
 */
declare function getDefaultColumnOrderState(): ColumnOrderState;
/**
 * Builds column-id to index records for each visible pinning region.
 *
 * All four regions are built in one pass so a single memo entry serves every
 * `column_getIndex` lookup without per-column scans.
 *
 * @example
 * ```ts
 * const indexes = table_getColumnIndexes(table)
 * ```
 */
declare function table_getColumnIndexes<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): ColumnIndexes;
/**
 * Finds this column's index within a visible pinning region.
 *
 * Pass `'start'`, `'center'`, or `'end'` to search that region; omit the
 * position to search the full visible leaf column list.
 *
 * @example
 * ```ts
 * const index = column_getIndex(column, 'center')
 * ```
 */
declare function column_getIndex<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, position?: ColumnPinningPosition | 'center'): number;
/**
 * Checks whether this column is the first visible column in a pinning region.
 *
 * The same `position` semantics as `column_getIndex` apply.
 *
 * @example
 * ```ts
 * const isFirst = column_getIsFirstColumn(column, 'start')
 * ```
 */
declare function column_getIsFirstColumn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, position?: ColumnPinningPosition | 'center'): boolean;
/**
 * Checks whether this column is the last visible column in a pinning region.
 *
 * The same `position` semantics as `column_getIndex` apply.
 *
 * @example
 * ```ts
 * const isLast = column_getIsLastColumn(column, 'end')
 * ```
 */
declare function column_getIsLastColumn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, position?: ColumnPinningPosition | 'center'): boolean;
/**
 * Routes a column order updater through the table's column-order change handler.
 *
 * The updater may be a next ordered id array or a function of the previous
 * array, matching the instance `table.setColumnOrder` behavior.
 *
 * @example
 * ```ts
 * table_setColumnOrder(table, ['firstName', 'lastName', 'age'])
 * ```
 */
declare function table_setColumnOrder<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<ColumnOrderState>): void;
/**
 * Resets `columnOrder` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnOrder` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
 *
 * @example
 * ```ts
 * table_resetColumnOrder(table)
 * table_resetColumnOrder(table, true)
 * ```
 */
declare function table_resetColumnOrder<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Creates the ordering function used to arrange leaf columns.
 *
 * The returned function applies `state.columnOrder`, preserves unspecified
 * columns in their original order, then delegates to grouping rules.
 *
 * @example
 * ```ts
 * const orderColumnsForTable = table_getOrderColumnsFn(table)
 * ```
 */
declare function table_getOrderColumnsFn<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): (columns: Array<Column<TFeatures, TData, unknown>>) => Column<TFeatures, TData, unknown>[];
/**
 * Applies grouped-column placement rules to an already ordered leaf-column list.
 *
 * `groupedColumnMode: 'remove'` drops grouped columns from the list.
 * `groupedColumnMode: 'reorder'` moves grouped columns to the front in grouping
 * state order.
 *
 * @example
 * ```ts
 * const orderedColumns = orderColumns(table, leafColumns)
 * ```
 */
declare function orderColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, leafColumns: Array<Column<TFeatures, TData, unknown>>): Column<TFeatures, TData, unknown>[];
//#endregion
export { column_getIndex, column_getIsFirstColumn, column_getIsLastColumn, getDefaultColumnOrderState, orderColumns, table_getColumnIndexes, table_getOrderColumnsFn, table_resetColumnOrder, table_setColumnOrder };