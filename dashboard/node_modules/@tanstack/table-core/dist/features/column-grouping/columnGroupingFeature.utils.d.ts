import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { GroupingState, Row_ColumnGrouping } from "./columnGroupingFeature.types.js";
import { Column } from "../../types/Column.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-grouping/columnGroupingFeature.utils.d.ts
/**
 * Creates the default grouping state.
 *
 * The feature default is an empty array, meaning no columns are grouped. Reset
 * APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const grouping = getDefaultGroupingState()
 * ```
 */
declare function getDefaultGroupingState(): GroupingState;
/**
 * Adds or removes this column id from the grouping state.
 *
 * Existing grouped columns keep their order. A column already present in
 * `state.grouping` is removed; otherwise it is appended.
 *
 * @example
 * ```ts
 * column_toggleGrouping(column)
 * ```
 */
declare function column_toggleGrouping<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): void;
/**
 * Checks whether this column can be used for grouping.
 *
 * Grouping must be enabled at the column and table level, and the column must
 * either have an accessor or provide `getGroupingValue`.
 *
 * @example
 * ```ts
 * const canGroup = column_getCanGroup(column)
 * ```
 */
declare function column_getCanGroup<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this column id is present in `state.grouping`.
 *
 * The result only reflects grouping state, not whether the grouped row model has
 * been calculated yet.
 *
 * @example
 * ```ts
 * const isGrouped = column_getIsGrouped(column)
 * ```
 */
declare function column_getIsGrouped<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Finds this column's position in the ordered grouping state.
 *
 * The result is `-1` when the column is not grouped.
 *
 * @example
 * ```ts
 * const index = column_getGroupedIndex(column)
 * ```
 */
declare function column_getGroupedIndex<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): number;
/**
 * Creates a header/control handler that toggles grouping for this column.
 *
 * The handler is a no-op when `column_getCanGroup(column)` is false.
 *
 * @example
 * ```ts
 * const onClick = column_getToggleGroupingHandler(column)
 * ```
 */
declare function column_getToggleGroupingHandler<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): () => void;
/**
 * Routes a grouping updater through the table's grouping change handler.
 *
 * The updater may be a next `GroupingState` array or a function of the previous
 * grouping state, matching the instance `table.setGrouping` behavior.
 *
 * @example
 * ```ts
 * table_setGrouping(table, (old) => [...old, 'status'])
 * ```
 */
declare function table_setGrouping<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<GroupingState>): void;
/**
 * Resets `grouping` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.grouping` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
 *
 * @example
 * ```ts
 * table_resetGrouping(table)
 * table_resetGrouping(table, true)
 * ```
 */
declare function table_resetGrouping<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Checks whether this row was created as a grouped row.
 *
 * Grouped rows carry a `groupingColumnId`; ordinary leaf rows do not.
 *
 * @example
 * ```ts
 * const isGrouped = row_getIsGrouped(row)
 * ```
 */
declare function row_getIsGrouped<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>): boolean;
/**
 * Reads and caches this row's grouping value for a column.
 *
 * `columnDef.getGroupingValue` wins when provided; otherwise the normal row
 * accessor value is used.
 *
 * @example
 * ```ts
 * const groupValue = row_getGroupingValue(row, 'status')
 * ```
 */
declare function row_getGroupingValue<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>, columnId: string): any;
/**
 * Checks whether this cell represents the grouped column for a grouped row.
 *
 * This is the cell that usually renders the grouped value and expansion control.
 *
 * @example
 * ```ts
 * const isGroupedCell = cell_getIsGrouped(cell)
 * ```
 */
declare function cell_getIsGrouped<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this cell is a placeholder hidden by grouping.
 *
 * Placeholder cells belong to grouped columns other than the row's active
 * grouping column.
 *
 * @example
 * ```ts
 * const isPlaceholder = cell_getIsPlaceholder(cell)
 * ```
 */
declare function cell_getIsPlaceholder<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): boolean;
//#endregion
export { cell_getIsGrouped, cell_getIsPlaceholder, column_getCanGroup, column_getGroupedIndex, column_getIsGrouped, column_getToggleGroupingHandler, column_toggleGrouping, getDefaultGroupingState, row_getGroupingValue, row_getIsGrouped, table_resetGrouping, table_setGrouping };