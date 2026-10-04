import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { HeaderGroup } from "../../types/HeaderGroup.js";
import { ColumnPinningPosition, ColumnPinningState } from "./columnPinningFeature.types.js";
import { Header } from "../../types/Header.js";
import { Column } from "../../types/Column.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-pinning/columnPinningFeature.utils.d.ts
/**
 * Creates the default column pinning state.
 *
 * Both pinning regions start empty. Reset APIs use this value when
 * `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const pinning = getDefaultColumnPinningState()
 * ```
 */
declare function getDefaultColumnPinningState(): ColumnPinningState;
/**
 * Moves this column's leaf column ids into a pinning region.
 *
 * Pinning a group column pins all of its leaves. The leaf ids are first removed
 * from both regions, then appended to the requested `'start'` or `'end'`
 * region. Passing `false` unpins them back to the center.
 *
 * `start` and `end` are logical positions. In LTR languages/layouts, `start`
 * usually corresponds to left and `end` to right. In RTL languages/layouts,
 * `start` usually corresponds to right and `end` to left.
 *
 * @example
 * ```ts
 * column_pin(column, 'start')
 * ```
 */
declare function column_pin<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, position: ColumnPinningPosition): void;
/**
 * Checks whether this column or any of its leaf columns can be pinned.
 *
 * Column-level `enablePinning` and table `enableColumnPinning` both default to
 * `true`; at least one leaf column must allow pinning.
 *
 * @example
 * ```ts
 * const canPin = column_getCanPin(column)
 * ```
 */
declare function column_getCanPin<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Reads this column's current pinning region.
 *
 * Group columns report `'start'` or `'end'` when any leaf column is pinned in
 * that region. Unpinned columns return `false`.
 *
 * `start` and `end` are logical positions. In LTR languages/layouts, `start`
 * usually corresponds to left and `end` to right. In RTL languages/layouts,
 * `start` usually corresponds to right and `end` to left.
 *
 * @example
 * ```ts
 * const position = column_getIsPinned(column)
 * ```
 */
declare function column_getIsPinned<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): ColumnPinningPosition | false;
/**
 * Finds this column's index within its pinned region.
 *
 * Unpinned columns return `0`; pinned columns return their position in
 * `state.columnPinning.start` or `state.columnPinning.end`.
 *
 * @example
 * ```ts
 * const index = column_getPinnedIndex(column)
 * ```
 */
declare function column_getPinnedIndex<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): number;
/**
 * Collects visible cells whose columns are not pinned start or end.
 *
 * The result preserves the row's visible-cell order for center columns.
 *
 * @example
 * ```ts
 * const centerCells = row_getCenterVisibleCells(row)
 * ```
 */
declare function row_getCenterVisibleCells<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Cell<TFeatures, TData, unknown>[];
/**
 * Collects visible cells for columns pinned to the start region.
 *
 * Cells are returned in `state.columnPinning.start` order and are marked with
 * `cell.position = 'start'`.
 *
 * @example
 * ```ts
 * const startCells = row_getStartVisibleCells(row)
 * ```
 */
declare function row_getStartVisibleCells<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>>;
/**
 * Collects visible cells for columns pinned to the end region.
 *
 * Cells are returned in `state.columnPinning.end` order and are marked with
 * `cell.position = 'end'`.
 *
 * @example
 * ```ts
 * const endCells = row_getEndVisibleCells(row)
 * ```
 */
declare function row_getEndVisibleCells<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Cell<TFeatures, TData, unknown>[];
/**
 * Routes a column pinning updater through the table's pinning change handler.
 *
 * The updater may be a next `{ start, end }` state or a function of the
 * previous state, matching the instance `table.setColumnPinning` behavior.
 *
 * @example
 * ```ts
 * table_setColumnPinning(table, (old) => ({ ...old, start: ['select'] }))
 * ```
 */
declare function table_setColumnPinning<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<ColumnPinningState>): void;
/**
 * Resets `columnPinning` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnPinning` when it
 * exists. Passing `true` ignores initial state and resets to empty start/end
 * arrays.
 *
 * @example
 * ```ts
 * table_resetColumnPinning(table)
 * table_resetColumnPinning(table, true)
 * ```
 */
declare function table_resetColumnPinning<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Checks whether any columns are pinned.
 *
 * Omit `position` to check both sides, or pass `'start'`/`'end'` to inspect a
 * single pinning region.
 *
 * @example
 * ```ts
 * const hasPinnedColumns = table_getIsSomeColumnsPinned(table)
 * ```
 */
declare function table_getIsSomeColumnsPinned<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, position?: ColumnPinningPosition): boolean;
/**
 * Builds header groups for visible columns pinned to the start region.
 *
 * The leaf columns are read in `state.columnPinning.start` order and then passed
 * through the same header-group builder as the unpinned table.
 *
 * @example
 * ```ts
 * const headerGroups = table_getStartHeaderGroups(table)
 * ```
 */
declare function table_getStartHeaderGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): HeaderGroup<TFeatures, TData>[];
/**
 * Builds header groups for visible columns pinned to the end region.
 *
 * The leaf columns are read in `state.columnPinning.end` order and then
 * passed through the same header-group builder as the unpinned table.
 *
 * @example
 * ```ts
 * const headerGroups = table_getEndHeaderGroups(table)
 * ```
 */
declare function table_getEndHeaderGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): HeaderGroup<TFeatures, TData>[];
/**
 * Builds header groups for visible columns that are not pinned.
 *
 * Start- and end-pinned column ids are removed from the visible leaf column
 * list before header groups are built for the center region.
 *
 * @example
 * ```ts
 * const headerGroups = table_getCenterHeaderGroups(table)
 * ```
 */
declare function table_getCenterHeaderGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<HeaderGroup<TFeatures, TData>>;
/**
 * Builds footer groups for the start pinned region.
 *
 * Footer groups reuse the start header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getStartFooterGroups(table)
 * ```
 */
declare function table_getStartFooterGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): HeaderGroup<TFeatures, TData>[];
/**
 * Builds footer groups for the end pinned region.
 *
 * Footer groups reuse the end header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getEndFooterGroups(table)
 * ```
 */
declare function table_getEndFooterGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): HeaderGroup<TFeatures, TData>[];
/**
 * Builds footer groups for the center, unpinned region.
 *
 * Footer groups reuse the center header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getCenterFooterGroups(table)
 * ```
 */
declare function table_getCenterFooterGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): HeaderGroup<TFeatures, TData>[];
/**
 * Flattens every header from the start pinned header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getStartFlatHeaders(table)
 * ```
 */
declare function table_getStartFlatHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
/**
 * Flattens every header from the end pinned header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getEndFlatHeaders(table)
 * ```
 */
declare function table_getEndFlatHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
/**
 * Flattens every header from the center header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getCenterFlatHeaders(table)
 * ```
 */
declare function table_getCenterFlatHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
/**
 * Collects leaf headers for the start pinned region.
 *
 * Parent headers are filtered out from the start flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getStartLeafHeaders(table)
 * ```
 */
declare function table_getStartLeafHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
/**
 * Collects leaf headers for the end pinned region.
 *
 * Parent headers are filtered out from the end flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getEndLeafHeaders(table)
 * ```
 */
declare function table_getEndLeafHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
/**
 * Collects leaf headers for the center, unpinned region.
 *
 * Parent headers are filtered out from the center flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getCenterLeafHeaders(table)
 * ```
 */
declare function table_getCenterLeafHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
/**
 * Resolves leaf columns pinned to the start region.
 *
 * The result follows `state.columnPinning.start` order and skips stale ids that
 * no longer correspond to a leaf column.
 *
 * @example
 * ```ts
 * const columns = table_getStartLeafColumns(table)
 * ```
 */
declare function table_getStartLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Resolves leaf columns pinned to the end region.
 *
 * The result follows `state.columnPinning.end` order and skips stale ids that
 * no longer correspond to a leaf column.
 *
 * @example
 * ```ts
 * const columns = table_getEndLeafColumns(table)
 * ```
 */
declare function table_getEndLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Resolves leaf columns that are not pinned to either logical side.
 *
 * Start- and end-pinned ids are removed from `table.getAllLeafColumns()`.
 *
 * @example
 * ```ts
 * const columns = table_getCenterLeafColumns(table)
 * ```
 */
declare function table_getCenterLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Resolves leaf columns for a requested pinning region.
 *
 * Pass `'start'`, `'center'`, or `'end'` for a partition, or pass `false` to
 * read all leaf columns without partitioning.
 *
 * @example
 * ```ts
 * const columns = table_getPinnedLeafColumns(table, 'center')
 * ```
 */
declare function table_getPinnedLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, position: ColumnPinningPosition | 'center'): Column<TFeatures, TData, unknown>[] | Column<TFeatures, TData, unknown>[];
/**
 * Resolves visible leaf columns pinned to the start region.
 *
 * Hidden pinned columns are filtered out after the start pin order is applied.
 *
 * @example
 * ```ts
 * const columns = table_getStartVisibleLeafColumns(table)
 * ```
 */
declare function table_getStartVisibleLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Resolves visible leaf columns pinned to the end region.
 *
 * Hidden pinned columns are filtered out after the end pin order is applied.
 *
 * @example
 * ```ts
 * const columns = table_getEndVisibleLeafColumns(table)
 * ```
 */
declare function table_getEndVisibleLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Resolves visible leaf columns that are not pinned.
 *
 * This is the center partition used by layouts that render pinned columns
 * separately from the scrollable middle region.
 *
 * @example
 * ```ts
 * const columns = table_getCenterVisibleLeafColumns(table)
 * ```
 */
declare function table_getCenterVisibleLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Resolves visible leaf columns for a requested pinning region.
 *
 * Omit `position` to get all visible leaf columns, or pass `'start'`, `'center'`,
 * or `'end'` to get one partition.
 *
 * @example
 * ```ts
 * const columns = table_getPinnedVisibleLeafColumns(table, 'start')
 * ```
 */
declare function table_getPinnedVisibleLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, position?: ColumnPinningPosition | 'center'): Column<TFeatures, TData, unknown>[] | Column<TFeatures, TData, unknown>[];
//#endregion
export { column_getCanPin, column_getIsPinned, column_getPinnedIndex, column_pin, getDefaultColumnPinningState, row_getCenterVisibleCells, row_getEndVisibleCells, row_getStartVisibleCells, table_getCenterFlatHeaders, table_getCenterFooterGroups, table_getCenterHeaderGroups, table_getCenterLeafColumns, table_getCenterLeafHeaders, table_getCenterVisibleLeafColumns, table_getEndFlatHeaders, table_getEndFooterGroups, table_getEndHeaderGroups, table_getEndLeafColumns, table_getEndLeafHeaders, table_getEndVisibleLeafColumns, table_getIsSomeColumnsPinned, table_getPinnedLeafColumns, table_getPinnedVisibleLeafColumns, table_getStartFlatHeaders, table_getStartFooterGroups, table_getStartHeaderGroups, table_getStartLeafColumns, table_getStartLeafHeaders, table_getStartVisibleLeafColumns, table_resetColumnPinning, table_setColumnPinning };