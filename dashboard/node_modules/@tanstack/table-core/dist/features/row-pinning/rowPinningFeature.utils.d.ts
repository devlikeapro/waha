import { RowData, Updater } from "../../types/type-utils.js";
import { RowPinningPosition, RowPinningState } from "./rowPinningFeature.types.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-pinning/rowPinningFeature.utils.d.ts
/**
 * Creates the default row pinning state.
 *
 * Both pinning regions start empty. Reset APIs use this value when
 * `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const pinning = getDefaultRowPinningState()
 * ```
 */
declare function getDefaultRowPinningState(): RowPinningState;
/**
 * Routes a row pinning updater through the table's row-pinning change handler.
 *
 * The updater may be a next `{ top, bottom }` state or a function of the
 * previous state, matching the instance `table.setRowPinning` behavior.
 *
 * @example
 * ```ts
 * table_setRowPinning(table, (old) => ({ ...old, top: [rowId] }))
 * ```
 */
declare function table_setRowPinning<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<RowPinningState>): void;
/**
 * Resets `rowPinning` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.rowPinning` when it
 * exists. Passing `true` ignores initial state and resets to empty top/bottom
 * arrays.
 *
 * @example
 * ```ts
 * table_resetRowPinning(table)
 * table_resetRowPinning(table, true)
 * ```
 */
declare function table_resetRowPinning<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Checks whether any rows are pinned.
 *
 * Omit `position` to check both regions, or pass `'top'`/`'bottom'` to inspect
 * one region.
 *
 * @example
 * ```ts
 * const hasPinnedRows = table_getIsSomeRowsPinned(table)
 * ```
 */
declare function table_getIsSomeRowsPinned<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, position?: RowPinningPosition): boolean;
/**
 * Resolves the visible rows pinned to the top region.
 *
 * The result follows `state.rowPinning.top` order and marks each row with
 * `position = 'top'`.
 *
 * @example
 * ```ts
 * const rows = table_getTopRows(table)
 * ```
 */
declare function table_getTopRows<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<Row<TFeatures, TData>>;
/**
 * Resolves the visible rows pinned to the bottom region.
 *
 * The result follows `state.rowPinning.bottom` order and marks each row with
 * `position = 'bottom'`.
 *
 * @example
 * ```ts
 * const rows = table_getBottomRows(table)
 * ```
 */
declare function table_getBottomRows<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<Row<TFeatures, TData>>;
/**
 * Resolves rows that are not pinned to top or bottom.
 *
 * The current row model is filtered by `state.rowPinning.top` and
 * `state.rowPinning.bottom`.
 *
 * @example
 * ```ts
 * const rows = table_getCenterRows(table)
 * ```
 */
declare function table_getCenterRows<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<Row<TFeatures, TData>>;
/**
 * Checks whether this row can be pinned.
 *
 * `options.enableRowPinning` may be a boolean or a row predicate; it defaults
 * to `true`.
 *
 * @example
 * ```ts
 * const canPin = row_getCanPin(row)
 * ```
 */
declare function row_getCanPin<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Reads this row's current pinning region.
 *
 * Rows listed in `state.rowPinning.top` return `'top'`, rows listed in
 * `bottom` return `'bottom'`, and unpinned rows return `false`.
 *
 * @example
 * ```ts
 * const position = row_getIsPinned(row)
 * ```
 */
declare function row_getIsPinned<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): RowPinningPosition;
/**
 * Finds this row's visible index within its pinned region.
 *
 * Unpinned rows return `-1`.
 *
 * @example
 * ```ts
 * const index = row_getPinnedIndex(row)
 * ```
 */
declare function row_getPinnedIndex<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): number;
/**
 * Pins or unpins a row.
 *
 * Optional flags let callers include parent rows or leaf rows when updating
 * the row pinning state.
 *
 * @example
 * ```ts
 * row_pin(row, 'top')
 * ```
 */
declare function row_pin<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, position: RowPinningPosition, includeLeafRows?: boolean, includeParentRows?: boolean): void;
//#endregion
export { getDefaultRowPinningState, row_getCanPin, row_getIsPinned, row_getPinnedIndex, row_pin, table_getBottomRows, table_getCenterRows, table_getIsSomeRowsPinned, table_getTopRows, table_resetRowPinning, table_setRowPinning };