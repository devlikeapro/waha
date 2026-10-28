import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { ColumnPinningPosition } from "../column-pinning/columnPinningFeature.types.js";
import { ColumnOffsetsByPosition, ColumnSizingState } from "./columnSizingFeature.types.js";
import { Header } from "../../types/Header.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-sizing/columnSizingFeature.utils.d.ts
/**
 * Creates the default committed column sizing state.
 *
 * The feature default is an empty map, so columns fall back to their column def
 * size or the built-in sizing defaults.
 *
 * @example
 * ```ts
 * const sizing = getDefaultColumnSizingState()
 * ```
 */
declare function getDefaultColumnSizingState(): ColumnSizingState;
/**
 * Creates the built-in sizing defaults for column definitions.
 *
 * Columns default to `size: 150`, `minSize: 20`, and
 * `maxSize: Number.MAX_SAFE_INTEGER` unless overridden by column definitions or
 * table defaults.
 *
 * @example
 * ```ts
 * const defaults = getDefaultColumnSizingColumnDef()
 * ```
 */
declare function getDefaultColumnSizingColumnDef(): {
  size: number;
  minSize: number;
  maxSize: number;
};
/**
 * Resolves a column's current pixel size.
 *
 * Committed `state.columnSizing[column.id]` wins over `columnDef.size`, then the
 * built-in default size. The result is clamped between min and max size.
 *
 * @example
 * ```ts
 * const width = column_getSize(column)
 * ```
 */
declare function column_getSize<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): number;
/**
 * Builds start and after offset maps for every visible leaf column, computed
 * once per pinning region plus the full visible list.
 *
 * A single table-level memo of this result backs all `column.getStart()` and
 * `column.getAfter()` calls with O(1) lookups.
 *
 * @example
 * ```ts
 * const offsets = table_getColumnOffsets(table)
 * const startOffset = offsets.start.starts[column.id]
 * ```
 */
declare function table_getColumnOffsets<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): ColumnOffsetsByPosition;
/**
 * Computes the offset from the start edge of a pinning region to this column.
 *
 * The value is the sum of all previous visible leaf column sizes in the
 * requested `'start'`, `'center'`, or `'end'` region.
 *
 * `start` and `end` are logical positions. In LTR languages/layouts, `start`
 * usually corresponds to left and `end` to right. In RTL languages/layouts,
 * `start` usually corresponds to right and `end` to left.
 *
 * @example
 * ```ts
 * const startOffset = column_getStart(column, 'start')
 * ```
 */
declare function column_getStart<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, position?: ColumnPinningPosition | 'center'): number;
/**
 * Computes the offset from the end edge of a pinning region after this column.
 *
 * The value is the sum of all following visible leaf column sizes in the
 * requested region.
 *
 * @example
 * ```ts
 * const endOffset = column_getAfter(column, 'end')
 * ```
 */
declare function column_getAfter<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, position?: ColumnPinningPosition | 'center'): number;
/**
 * Removes this column's committed size override.
 *
 * After reset, the column resolves size from `columnDef.size` or built-in
 * defaults again.
 *
 * @example
 * ```ts
 * column_resetSize(column)
 * ```
 */
declare function column_resetSize<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): void;
/**
 * Computes a header's rendered size from its leaf headers.
 *
 * Group headers sum the sizes of all descendant leaf columns. Leaf headers use
 * their column's current size.
 *
 * @example
 * ```ts
 * const width = header_getSize(header)
 * ```
 */
declare function header_getSize<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(header: Header<TFeatures, TData, TValue>): number;
/**
 * Computes a header's offset from the start of its header group.
 *
 * The offset is the previous sibling header's start plus size, or `0` for the
 * first header in the group.
 *
 * @example
 * ```ts
 * const offset = header_getStart(header)
 * ```
 */
declare function header_getStart<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(header: Header<TFeatures, TData, TValue>): number;
/**
 * Routes a committed column sizing updater through the table's sizing handler.
 *
 * The updater may be a next size map or a function of the previous map,
 * matching the instance `table.setColumnSizing` behavior.
 *
 * @example
 * ```ts
 * table_setColumnSizing(table, (old) => ({ ...old, age: 96 }))
 * ```
 */
declare function table_setColumnSizing<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<ColumnSizingState>): void;
/**
 * Resets `columnSizing` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnSizing` when it
 * exists. Passing `true` ignores initial state and resets to `{}`.
 *
 * @example
 * ```ts
 * table_resetColumnSizing(table)
 * table_resetColumnSizing(table, true)
 * ```
 */
declare function table_resetColumnSizing<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Sums the rendered size of the full table header row.
 *
 * This includes start, center, and end columns in the main header group.
 *
 * @example
 * ```ts
 * const width = table_getTotalSize(table)
 * ```
 */
declare function table_getTotalSize<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
/**
 * Sums the rendered size of the logical start pinned header region.
 *
 * An empty start pinning region returns `0`.
 *
 * @example
 * ```ts
 * const width = table_getStartTotalSize(table)
 * ```
 */
declare function table_getStartTotalSize<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
/**
 * Sums the rendered size of the center, unpinned header region.
 *
 * An empty center region returns `0`.
 *
 * @example
 * ```ts
 * const width = table_getCenterTotalSize(table)
 * ```
 */
declare function table_getCenterTotalSize<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
/**
 * Sums the rendered size of the logical end pinned header region.
 *
 * An empty end pinning region returns `0`.
 *
 * @example
 * ```ts
 * const width = table_getEndTotalSize(table)
 * ```
 */
declare function table_getEndTotalSize<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
//#endregion
export { column_getAfter, column_getSize, column_getStart, column_resetSize, getDefaultColumnSizingColumnDef, getDefaultColumnSizingState, header_getSize, header_getStart, table_getCenterTotalSize, table_getColumnOffsets, table_getEndTotalSize, table_getStartTotalSize, table_getTotalSize, table_resetColumnSizing, table_setColumnSizing };