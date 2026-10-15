import { cloneState, functionalUpdate, isFunction, setStateSlice } from "../../utils.js";

//#region src/features/column-filtering/columnFilteringFeature.utils.ts
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
function getDefaultColumnFiltersState() {
	return [];
}
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
function column_getAutoFilterFn(column) {
	const filterFns = column.table._rowModelFns.filterFns;
	const rows = column.table.getCoreRowModel().flatRows;
	let value;
	for (let i = 0; i < rows.length; i++) {
		const rowValue = rows[i].getValue(column.id);
		if (rowValue !== null && rowValue !== void 0) {
			value = rowValue;
			break;
		}
	}
	let filterFnName;
	if (typeof value === "string") filterFnName = "includesString";
	else if (typeof value === "number") filterFnName = "inNumberRange";
	else if (typeof value === "boolean") filterFnName = "equals";
	else if (Array.isArray(value)) filterFnName = "arrIncludes";
	else if (Object.prototype.toString.call(value) === "[object Date]") filterFnName = "inDateRange";
	else if (value !== null && typeof value === "object") filterFnName = "equals";
	else filterFnName = "weakEquals";
	const filterFn = filterFns?.[filterFnName];
	if (process.env.NODE_ENV === "development" && !filterFn) console.warn(`filterFn '${filterFnName}' (auto) for column '${column.id}' is not registered`);
	return filterFn;
}
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
function column_getFilterFn(column) {
	let filterFn = null;
	const filterFns = column.table._rowModelFns.filterFns;
	filterFn = isFunction(column.columnDef.filterFn) ? column.columnDef.filterFn : column.columnDef.filterFn === "auto" ? column_getAutoFilterFn(column) : filterFns?.[column.columnDef.filterFn];
	if (process.env.NODE_ENV === "development" && !filterFn && column.columnDef.filterFn !== "auto") console.warn(`filterFn '${String(column.columnDef.filterFn)}' for column '${column.id}' is not registered`);
	return filterFn ?? void 0;
}
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
function column_getCanFilter(column) {
	return (column.columnDef.enableColumnFilter ?? true) && (column.table.options.enableColumnFilters ?? true) && (column.table.options.enableFilters ?? true) && !!column.accessorFn;
}
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
function column_getIsFiltered(column) {
	return column_getFilterIndex(column) > -1;
}
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
function column_getFilterValue(column) {
	return column.table.atoms.columnFilters?.get()?.find((d) => d.id === column.id)?.value;
}
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
function column_getFilterIndex(column) {
	return column.table.atoms.columnFilters?.get()?.findIndex((d) => d.id === column.id) ?? -1;
}
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
function column_setFilterValue(column, value) {
	table_setColumnFilters(column.table, (old) => {
		const filterFn = column_getFilterFn(column);
		const previousFilter = old.find((d) => d.id === column.id);
		const newFilter = functionalUpdate(value, previousFilter ? previousFilter.value : void 0);
		if (shouldAutoRemoveFilter(filterFn, newFilter, column)) return old.filter((d) => d.id !== column.id);
		const newFilterObj = {
			id: column.id,
			value: newFilter
		};
		if (previousFilter) return old.map((d) => {
			if (d.id === column.id) return newFilterObj;
			return d;
		});
		if (old.length) return [...old, newFilterObj];
		return [newFilterObj];
	});
}
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
function table_setColumnFilters(table, updater) {
	const leafColumnsById = table.getAllLeafColumnsById();
	const updateFn = (old) => {
		return functionalUpdate(updater, old).filter((filter) => {
			const column = leafColumnsById[filter.id];
			if (column) {
				if (shouldAutoRemoveFilter(column_getFilterFn(column), filter.value, column)) return false;
			}
			return true;
		});
	};
	setStateSlice(table, "columnFilters", updateFn);
}
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
function table_resetColumnFilters(table, defaultState) {
	table_setColumnFilters(table, defaultState ? [] : cloneState(table.initialState.columnFilters ?? []));
}
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
function shouldAutoRemoveFilter(filterFn, value, column) {
	if (typeof value === "undefined") return true;
	if (filterFn?.autoRemove) return !!filterFn.autoRemove(value, column);
	return typeof value === "string" && !value;
}

//#endregion
export { column_getAutoFilterFn, column_getCanFilter, column_getFilterFn, column_getFilterIndex, column_getFilterValue, column_getIsFiltered, column_setFilterValue, getDefaultColumnFiltersState, shouldAutoRemoveFilter, table_resetColumnFilters, table_setColumnFilters };