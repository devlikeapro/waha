import { cloneState, isFunction } from "../../utils.js";
import { filterFn_includesString } from "../column-filtering/filterFns.js";

//#region src/features/global-filtering/globalFilteringFeature.utils.ts
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
function column_getCanGlobalFilter(column) {
	return (column.columnDef.enableGlobalFilter ?? true) && (column.table.options.enableGlobalFilter ?? true) && (column.table.options.enableFilters ?? true) && (column.table.options.getColumnCanGlobalFilter?.(column) ?? true) && !!column.accessorFn;
}
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
function table_getGlobalAutoFilterFn() {
	return filterFn_includesString;
}
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
function table_getGlobalFilterFn(table) {
	const { globalFilterFn } = table.options;
	const filterFns = table._rowModelFns.filterFns;
	const filterFn = isFunction(globalFilterFn) ? globalFilterFn : globalFilterFn === "auto" ? table_getGlobalAutoFilterFn() : filterFns?.[globalFilterFn];
	if (process.env.NODE_ENV === "development" && !filterFn && globalFilterFn != null) console.warn(`globalFilterFn '${String(globalFilterFn)}' is not registered`);
	return filterFn;
}
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
function table_setGlobalFilter(table, updater) {
	table.options.onGlobalFilterChange?.(updater);
}
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
function table_resetGlobalFilter(table, defaultState) {
	table_setGlobalFilter(table, defaultState ? void 0 : cloneState(table.initialState.globalFilter));
}

//#endregion
export { column_getCanGlobalFilter, table_getGlobalAutoFilterFn, table_getGlobalFilterFn, table_resetGlobalFilter, table_setGlobalFilter };