import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { ColumnVisibilityState } from "./columnVisibilityFeature.types.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
import "../../index.js";
//#region src/features/column-visibility/columnVisibilityFeature.utils.d.ts
/**
 * Creates the default column visibility state.
 *
 * The feature default is an empty object, where missing column ids are treated
 * as visible. Reset APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const visibility = getDefaultColumnVisibilityState()
 * ```
 */
declare function getDefaultColumnVisibilityState(): ColumnVisibilityState;
/**
 * Updates this column's visibility when hiding is allowed.
 *
 * Passing `visible` stores that value. Omitting it flips the column's current
 * visibility state. Group columns update their hideable leaf columns because
 * visibility state is keyed by leaf column ids. Columns that cannot hide stay
 * unchanged.
 *
 * @example
 * ```ts
 * column_toggleVisibility(column)
 * ```
 */
declare function column_toggleVisibility<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, visible?: boolean): void;
/**
 * Checks whether this column is visible.
 *
 * Leaf columns read `state.columnVisibility[column.id]`, where missing entries
 * default to visible. Parent columns are visible when at least one child column
 * is visible.
 *
 * @example
 * ```ts
 * const visible = column_getIsVisible(column)
 * ```
 */
declare function column_getIsVisible<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this column is allowed to be hidden.
 *
 * Both `columnDef.enableHiding` and table `enableHiding` default to `true`.
 *
 * @example
 * ```ts
 * const canHide = column_getCanHide(column)
 * ```
 */
declare function column_getCanHide<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Creates a checkbox-style handler that writes this column's visibility.
 *
 * The handler reads `event.target.checked`, so it is intended for visibility
 * controls whose checked state means "visible".
 *
 * @example
 * ```ts
 * const onChange = column_getToggleVisibilityHandler(column)
 * ```
 */
declare function column_getToggleVisibilityHandler<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): (e: unknown) => void;
/**
 * Collects the cells from this row whose columns are visible.
 *
 * When column pinning is active, the result is ordered as start-pinned cells,
 * center cells, then end-pinned cells.
 *
 * @example
 * ```ts
 * const visibleCells = row_getVisibleCells(row)
 * ```
 */
declare function row_getVisibleCells<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>>;
/**
 * Builds a lookup map of this row's visible cells keyed by column id.
 *
 * Hidden columns are omitted from the map.
 *
 * @example
 * ```ts
 * const visibleCellsById = row_getVisibleCellsByColumnId(row)
 * ```
 */
declare function row_getVisibleCellsByColumnId<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): Record<string, Cell<TFeatures, TData, unknown>>;
/**
 * Filters the flat column list down to visible columns.
 *
 * Parent/group columns are included when `column_getIsVisible` considers them
 * visible.
 *
 * @example
 * ```ts
 * const columns = table_getVisibleFlatColumns(table)
 * ```
 */
declare function table_getVisibleFlatColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Filters leaf columns down to those currently visible.
 *
 * This is the column list most row rendering code uses before pinning-specific
 * partitioning.
 *
 * @example
 * ```ts
 * const columns = table_getVisibleLeafColumns(table)
 * ```
 */
declare function table_getVisibleLeafColumns<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Column<TFeatures, TData, unknown>[];
/**
 * Routes a column visibility updater through the table's visibility change handler.
 *
 * The updater may be a next visibility map or a function of the previous map,
 * matching the instance `table.setColumnVisibility` behavior.
 *
 * @example
 * ```ts
 * table_setColumnVisibility(table, (old) => ({ ...old, age: false }))
 * ```
 */
declare function table_setColumnVisibility<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<ColumnVisibilityState>): void;
/**
 * Resets `columnVisibility` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnVisibility` when
 * it exists. Passing `true` ignores initial state and resets to `{}`.
 *
 * @example
 * ```ts
 * table_resetColumnVisibility(table)
 * table_resetColumnVisibility(table, true)
 * ```
 */
declare function table_resetColumnVisibility<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Shows or hides every hideable leaf column.
 *
 * Columns that cannot hide stay visible when toggling all columns off.
 *
 * @example
 * ```ts
 * table_toggleAllColumnsVisible(table)
 * ```
 */
declare function table_toggleAllColumnsVisible<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, value?: boolean): void;
/**
 * Checks whether every leaf column is currently visible.
 *
 * Non-hideable columns are naturally visible because missing visibility entries
 * default to `true`.
 *
 * @example
 * ```ts
 * const allVisible = table_getIsAllColumnsVisible(table)
 * ```
 */
declare function table_getIsAllColumnsVisible<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Checks whether at least one leaf column is currently visible.
 *
 * This is useful for tri-state "show all columns" controls.
 *
 * @example
 * ```ts
 * const someVisible = table_getIsSomeColumnsVisible(table)
 * ```
 */
declare function table_getIsSomeColumnsVisible<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Creates a checkbox-style handler that shows or hides all columns.
 *
 * The handler reads `event.target.checked`, so it is intended for controls whose
 * checked state means "all columns visible".
 *
 * @example
 * ```ts
 * const onChange = table_getToggleAllColumnsVisibilityHandler(table)
 * ```
 */
declare function table_getToggleAllColumnsVisibilityHandler<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): (e: unknown) => void;
//#endregion
export { column_getCanHide, column_getIsVisible, column_getToggleVisibilityHandler, column_toggleVisibility, getDefaultColumnVisibilityState, row_getVisibleCells, row_getVisibleCellsByColumnId, table_getIsAllColumnsVisible, table_getIsSomeColumnsVisible, table_getToggleAllColumnsVisibilityHandler, table_getVisibleFlatColumns, table_getVisibleLeafColumns, table_resetColumnVisibility, table_setColumnVisibility, table_toggleAllColumnsVisible };