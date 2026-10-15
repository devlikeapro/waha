import { CellData, RowData } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { CreatedFilterFn, FilterFn } from "../column-filtering/columnFilteringFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
import "../../index.js";
//#region src/features/global-filtering/globalFilteringFeature.utils.d.ts
/**
 * Checks whether this accessor column participates in global filtering.
 *
 * The column must have an accessor and pass column-level, table-level, and
 * optional `getColumnCanGlobalFilter` checks.
 *
 * @example
 * ```ts
 * const canGlobalFilter = column_getCanGlobalFilter(column)
 * ```
 */
declare function column_getCanGlobalFilter<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Provides the built-in automatic global filter function.
 *
 * Global filtering defaults to `includesString`, which gives search-box style
 * matching across globally filterable columns.
 *
 * @example
 * ```ts
 * const filterFn = table_getGlobalAutoFilterFn()
 * ```
 */
declare function table_getGlobalAutoFilterFn(): CreatedFilterFn<any, any>;
/**
 * Resolves the filter function used for global filtering.
 *
 * Function-valued `options.globalFilterFn` is returned directly, `'auto'`
 * delegates to `table_getGlobalAutoFilterFn`, and string values are looked up in
 * the table's filter function registry.
 *
 * @example
 * ```ts
 * const filterFn = table_getGlobalFilterFn(table)
 * ```
 */
declare function table_getGlobalFilterFn<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): FilterFn<TFeatures, TData> | undefined;
/**
 * Routes a global filter updater through the table's global filter handler.
 *
 * The updater may be a next value or a function of the previous value, matching
 * the instance `table.setGlobalFilter` behavior.
 *
 * @example
 * ```ts
 * table_setGlobalFilter(table, 'search text')
 * ```
 */
declare function table_setGlobalFilter<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: any): void;
/**
 * Resets `globalFilter` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.globalFilter`. Passing
 * `true` ignores initial state and resets to `undefined`.
 *
 * @example
 * ```ts
 * table_resetGlobalFilter(table)
 * table_resetGlobalFilter(table, true)
 * ```
 */
declare function table_resetGlobalFilter<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
//#endregion
export { column_getCanGlobalFilter, table_getGlobalAutoFilterFn, table_getGlobalFilterFn, table_resetGlobalFilter, table_setGlobalFilter };