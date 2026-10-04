import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { ColumnFiltersState, FilterFn } from "./columnFilteringFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-filtering/columnFilteringFeature.utils.d.ts
/**
 * Creates the default column filter state.
 *
 * The feature default is an empty array, meaning no column filters are active.
 * Reset APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const filters = getDefaultColumnFiltersState()
 * ```
 */
declare function getDefaultColumnFiltersState(): ColumnFiltersState;
/**
 * Chooses a built-in filter function from the column's first core row value.
 *
 * Strings use `includesString`, numbers use `inNumberRange`, booleans and
 * objects use `equals`, dates use `inDateRange`, arrays use `arrIncludes`,
 * and unknown values fall back to `weakEquals`.
 *
 * The chosen filter function is looked up in the table's `filterFns`
 * registry. When it is not registered there, this returns `undefined` and
 * warns in development instead of substituting a different filter function.
 *
 * @example
 * ```ts
 * const filterFn = column_getAutoFilterFn(column)
 * ```
 */
declare function column_getAutoFilterFn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): FilterFn<TFeatures, TData> | undefined;
/**
 * Resolves the filter function configured for a column.
 *
 * Function-valued `columnDef.filterFn` is returned directly, `'auto'` delegates
 * to `column_getAutoFilterFn`, and string values are looked up in the table's
 * filter function registry.
 *
 * @example
 * ```ts
 * const filterFn = column_getFilterFn(column)
 * ```
 */
declare function column_getFilterFn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): FilterFn<TFeatures, TData> | undefined;
/**
 * Checks whether column filtering is enabled for this accessor column.
 *
 * The column must have an accessor and filtering must be enabled by the column
 * definition, `enableColumnFilters`, and the table-wide `enableFilters` option.
 *
 * @example
 * ```ts
 * const canFilter = column_getCanFilter(column)
 * ```
 */
declare function column_getCanFilter<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this column currently has an entry in `state.columnFilters`.
 *
 * This only reflects filter state presence; it does not indicate whether the
 * filter removes any rows.
 *
 * @example
 * ```ts
 * const isFiltered = column_getIsFiltered(column)
 * ```
 */
declare function column_getIsFiltered<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Reads this column's current filter value from `state.columnFilters`.
 *
 * Missing filter entries return `undefined`.
 *
 * @example
 * ```ts
 * const value = column_getFilterValue(column)
 * ```
 */
declare function column_getFilterValue<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): unknown;
/**
 * Finds this column's position in the ordered `state.columnFilters` array.
 *
 * The result is `-1` when the column has no active filter.
 *
 * @example
 * ```ts
 * const index = column_getFilterIndex(column)
 * ```
 */
declare function column_getFilterIndex<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): number;
/**
 * Adds, updates, or removes this column's filter value.
 *
 * The incoming value may be an updater. After resolution, `autoRemove` rules
 * decide whether the filter should be removed instead of stored.
 *
 * @example
 * ```ts
 * column_setFilterValue(column, (old) => String(old ?? '').trim())
 * ```
 */
declare function column_setFilterValue<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, value: any): void;
/**
 * Routes a column filter updater through the table's filter change handler.
 *
 * The resolved filters are cleaned before they are emitted: filters for known
 * columns are removed when their filter function says the value should be
 * auto-removed.
 *
 * @example
 * ```ts
 * table_setColumnFilters(table, (old) => old.filter((filter) => filter.id !== 'age'))
 * ```
 */
declare function table_setColumnFilters<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<ColumnFiltersState>): void;
/**
 * Resets `columnFilters` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnFilters` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
 *
 * @example
 * ```ts
 * table_resetColumnFilters(table)
 * table_resetColumnFilters(table, true)
 * ```
 */
declare function table_resetColumnFilters<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Returns whether a filter value should be removed from filter state.
 *
 * `undefined` always removes: it is the universal "clear this filter"
 * sentinel used by `setFilterValue(undefined)` and functional updaters. For
 * any other value, a filter function's `autoRemove` hook is authoritative
 * when provided, so custom filter functions can keep values (such as empty
 * strings) that the default heuristic would drop. Without an `autoRemove`
 * hook, empty strings are removed.
 *
 * @example
 * ```ts
 * const removeFilter = shouldAutoRemoveFilter(filterFn, value, column)
 * ```
 */
declare function shouldAutoRemoveFilter<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(filterFn?: FilterFn<TFeatures, TData>, value?: any, column?: Column<TFeatures, TData, TValue>): boolean;
//#endregion
export { column_getAutoFilterFn, column_getCanFilter, column_getFilterFn, column_getFilterIndex, column_getFilterValue, column_getIsFiltered, column_setFilterValue, getDefaultColumnFiltersState, shouldAutoRemoveFilter, table_resetColumnFilters, table_setColumnFilters };