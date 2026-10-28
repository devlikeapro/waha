import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { SortDirection, SortFn, SortingState } from "./rowSortingFeature.types.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-sorting/rowSortingFeature.utils.d.ts
/**
 * Creates the default sorting state.
 *
 * The feature default is an empty array, meaning no columns are sorted. Reset
 * APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const sorting = getDefaultSortingState()
 * ```
 */
declare function getDefaultSortingState(): SortingState;
/**
 * Routes a sorting updater through the table's sorting change handler.
 *
 * The updater may be a next `SortingState` array or a function of the previous
 * sorting state, matching the instance `table.setSorting` behavior. State
 * owners receive an equality-guarded updater so structurally equal sorting
 * values preserve the owner's existing reference.
 *
 * @example
 * ```ts
 * table_setSorting(table, (old) => [...old, { id: 'age', desc: true }])
 * ```
 */
declare function table_setSorting<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<SortingState>): void;
/**
 * Resets `sorting` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.sorting` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
 *
 * @example
 * ```ts
 * table_resetSorting(table)
 * table_resetSorting(table, true)
 * ```
 */
declare function table_resetSorting<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Resets sorting after the table data changes when explicitly enabled.
 *
 * Unlike other auto-reset behaviors, sorting is preserved by default. An
 * explicit `autoResetAll` value takes precedence over `autoResetSorting`.
 *
 * @example
 * ```ts
 * table_autoResetSorting(table)
 * ```
 */
declare function table_autoResetSorting<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Chooses a built-in sorting function from sampled filtered row values.
 *
 * Date-like values use `datetime`, mixed text/numeric strings use
 * `alphanumeric`, plain strings use `text`, and unknown values fall back to
 * `basic`.
 *
 * @example
 * ```ts
 * const sortFn = column_getAutoSortFn(column)
 * ```
 */
declare function column_getAutoSortFn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): SortFn<TFeatures, TData>;
/**
 * Chooses the default first sort direction from sampled filtered row values.
 *
 * The first non-nullish value among the sampled rows decides: string columns
 * start ascending so alphabetical order is natural; other value types (or
 * columns with no non-nullish sample) start descending. Sampling past leading
 * nullish values keeps the toggle cycle stable when sorting or a data swap
 * moves an empty value into the first row.
 *
 * @example
 * ```ts
 * const direction = column_getAutoSortDir(column)
 * ```
 */
declare function column_getAutoSortDir<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): "asc" | "desc";
/**
 * Resolves the sorting function configured for a column.
 *
 * Function-valued `columnDef.sortFn` is returned directly, `'auto'` delegates
 * to `column_getAutoSortFn`, and string values are looked up in the table's
 * sorting function registry before falling back to `basic`.
 *
 * @example
 * ```ts
 * const sortFn = column_getSortFn(column)
 * ```
 */
declare function column_getSortFn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): SortFn<TFeatures, TData>;
/**
 * Applies the next sorting state for this column.
 *
 * The toggle can add, replace, flip, or remove this column's sort entry. Multi
 * sorting respects `enableMultiSort`, `enableMultiRemove`,
 * `maxMultiSortColCount`, and the `multi` argument.
 *
 * @example
 * ```ts
 * column_toggleSorting(column, undefined, true)
 * ```
 */
declare function column_toggleSorting<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, desc?: boolean, multi?: boolean): void;
/**
 * Resolves the first direction used when this column begins sorting.
 *
 * Column-level `sortDescFirst` wins, then table-level `sortDescFirst`, then the
 * auto direction inferred from sampled values.
 *
 * @example
 * ```ts
 * const firstDirection = column_getFirstSortDir(column)
 * ```
 */
declare function column_getFirstSortDir<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): "asc" | "desc";
/**
 * Resolves the next sort order for this column's toggle cycle.
 *
 * The cycle starts with the first sort direction, flips between `asc` and
 * `desc`, and can return `false` when sorting removal is enabled.
 *
 * @example
 * ```ts
 * const nextOrder = column_getNextSortingOrder(column)
 * ```
 */
declare function column_getNextSortingOrder<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, multi?: boolean): false | "asc" | "desc";
/**
 * Checks whether this accessor column can participate in sorting.
 *
 * The column must have an accessor and sorting must be enabled by both the
 * column definition and table options.
 *
 * @example
 * ```ts
 * const canSort = column_getCanSort(column)
 * ```
 */
declare function column_getCanSort<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this column can be added to a multi-sort state.
 *
 * Column-level `enableMultiSort` wins over table-level `enableMultiSort`; if
 * neither is set, accessor columns can multi-sort by default.
 *
 * @example
 * ```ts
 * const canMultiSort = column_getCanMultiSort(column)
 * ```
 */
declare function column_getCanMultiSort<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Reads this column's current sort direction.
 *
 * The result is `false` when the column is not sorted, otherwise `'asc'` or
 * `'desc'` based on the column's entry in `state.sorting`.
 *
 * @example
 * ```ts
 * const direction = column_getIsSorted(column)
 * ```
 */
declare function column_getIsSorted<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): false | SortDirection;
/**
 * Finds this column's position in the ordered `state.sorting` array.
 *
 * The result is `-1` when the column is not sorted.
 *
 * @example
 * ```ts
 * const index = column_getSortIndex(column)
 * ```
 */
declare function column_getSortIndex<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): number;
/**
 * Removes this column from the sorting state.
 *
 * Other sorted columns are preserved, including their relative order.
 *
 * @example
 * ```ts
 * column_clearSorting(column)
 * ```
 */
declare function column_clearSorting<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): void;
/**
 * Creates a header event handler that toggles this column's sorting.
 *
 * The handler ignores events when the column cannot sort, and asks
 * `options.isMultiSortEvent` whether the event should add to a multi-sort.
 *
 * @example
 * ```ts
 * const onClick = column_getToggleSortingHandler(column)
 * ```
 */
declare function column_getToggleSortingHandler<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): (e: unknown) => void;
//#endregion
export { column_clearSorting, column_getAutoSortDir, column_getAutoSortFn, column_getCanMultiSort, column_getCanSort, column_getFirstSortDir, column_getIsSorted, column_getNextSortingOrder, column_getSortFn, column_getSortIndex, column_getToggleSortingHandler, column_toggleSorting, getDefaultSortingState, table_autoResetSorting, table_resetSorting, table_setSorting };