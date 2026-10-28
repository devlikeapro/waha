import { cloneState, isFunction, setStateSlice } from "../../utils.js";
import { reSplitAlphaNumeric, sortFn_basic } from "./sortFns.js";

//#region src/features/row-sorting/rowSortingFeature.utils.ts
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
function getDefaultSortingState() {
	return [];
}
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
function table_setSorting(table, updater) {
	setStateSlice(table, "sorting", updater);
}
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
function table_resetSorting(table, defaultState) {
	table_setSorting(table, defaultState ? [] : cloneState(table.initialState.sorting ?? []));
}
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
function table_autoResetSorting(table) {
	if (!table.atoms.sorting) return;
	if (table.options.autoResetAll ?? table.options.autoResetSorting ?? false) table_resetSorting(table);
}
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
function column_getAutoSortFn(column) {
	const sortFns = column.table._rowModelFns.sortFns;
	const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10);
	let sortFnName;
	let isString = false;
	for (let i = 0; i < firstRows.length; i++) {
		const value = firstRows[i].getValue(column.id);
		if (Object.prototype.toString.call(value) === "[object Date]") {
			sortFnName = "datetime";
			break;
		}
		if (typeof value === "string") {
			isString = true;
			if (value.split(reSplitAlphaNumeric).length > 1) {
				sortFnName = "alphanumeric";
				break;
			}
		}
	}
	if (!sortFnName && isString) sortFnName = "text";
	if (sortFnName) {
		let sortFn = sortFns?.[sortFnName];
		if (!sortFn) {
			if (process.env.NODE_ENV === "development") console.warn(`sortFn '${sortFnName}' (auto) for column '${column.id}' is not registered`);
			if (sortFnName === "alphanumeric") sortFn = sortFns?.text;
		}
		if (sortFn) return sortFn;
	}
	return sortFn_basic;
}
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
function column_getAutoSortDir(column) {
	const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10);
	for (let i = 0; i < firstRows.length; i++) {
		const value = firstRows[i].getValue(column.id);
		if (value == null) continue;
		return typeof value === "string" ? "asc" : "desc";
	}
	return "desc";
}
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
function column_getSortFn(column) {
	const sortFns = column.table._rowModelFns.sortFns;
	if (isFunction(column.columnDef.sortFn)) return column.columnDef.sortFn;
	if (column.columnDef.sortFn === "auto") return column_getAutoSortFn(column);
	const sortFn = sortFns?.[column.columnDef.sortFn];
	if (process.env.NODE_ENV === "development" && !sortFn) console.warn(`sortFn '${String(column.columnDef.sortFn)}' for column '${column.id}' is not registered`);
	return sortFn ?? sortFn_basic;
}
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
function column_toggleSorting(column, desc, multi) {
	const nextSortingOrder = column_getNextSortingOrder(column, multi && column_getCanMultiSort(column));
	const hasManualValue = typeof desc !== "undefined";
	table_setSorting(column.table, (old) => {
		const existingIndex = old.findIndex((d) => d.id === column.id);
		const existingSorting = existingIndex === -1 ? void 0 : old[existingIndex];
		let newSorting = [];
		let sortAction;
		const nextDesc = hasManualValue ? desc : nextSortingOrder === "desc";
		const isMultiMode = !!(old.length && column_getCanMultiSort(column) && multi);
		if (isMultiMode) if (existingSorting) sortAction = "toggle";
		else sortAction = "add";
		else if (existingSorting) sortAction = "toggle";
		else sortAction = "replace";
		if (sortAction === "toggle") {
			if (!hasManualValue) {
				if (!nextSortingOrder) sortAction = "remove";
			}
		}
		if (sortAction === "add") {
			newSorting = [...old, {
				id: column.id,
				desc: nextDesc
			}];
			newSorting.splice(0, newSorting.length - (column.table.options.maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER));
		} else if (sortAction === "toggle") newSorting = isMultiMode ? old.map((d) => {
			if (d.id === column.id) return {
				...d,
				desc: nextDesc
			};
			return d;
		}) : [{
			id: column.id,
			desc: nextDesc
		}];
		else if (sortAction === "remove") newSorting = isMultiMode ? old.filter((d) => d.id !== column.id) : [];
		else newSorting = [{
			id: column.id,
			desc: nextDesc
		}];
		return newSorting;
	});
}
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
function column_getFirstSortDir(column) {
	return column.columnDef.sortDescFirst ?? column.table.options.sortDescFirst ?? column_getAutoSortDir(column) === "desc" ? "desc" : "asc";
}
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
function column_getNextSortingOrder(column, multi) {
	const firstSortDirection = column_getFirstSortDir(column);
	const isSorted = column_getIsSorted(column);
	if (!isSorted) return firstSortDirection;
	if (isSorted !== firstSortDirection && (column.table.options.enableSortingRemoval ?? true) && (multi ? column.table.options.enableMultiRemove ?? true : true)) return false;
	return isSorted === "desc" ? "asc" : "desc";
}
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
function column_getCanSort(column) {
	return (column.columnDef.enableSorting ?? true) && (column.table.options.enableSorting ?? true) && !!column.accessorFn;
}
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
function column_getCanMultiSort(column) {
	return column.columnDef.enableMultiSort ?? column.table.options.enableMultiSort ?? !!column.accessorFn;
}
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
function column_getIsSorted(column) {
	const columnSort = column.table.atoms.sorting?.get()?.find((d) => d.id === column.id);
	return !columnSort ? false : columnSort.desc ? "desc" : "asc";
}
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
function column_getSortIndex(column) {
	return column.table.atoms.sorting?.get()?.findIndex((d) => d.id === column.id) ?? -1;
}
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
function column_clearSorting(column) {
	table_setSorting(column.table, (old) => old.length ? old.filter((d) => d.id !== column.id) : []);
}
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
function column_getToggleSortingHandler(column) {
	const canSort = column_getCanSort(column);
	return (e) => {
		if (!canSort) return;
		column_toggleSorting(column, void 0, column_getCanMultiSort(column) ? column.table.options.isMultiSortEvent?.(e) : false);
	};
}

//#endregion
export { column_clearSorting, column_getAutoSortDir, column_getAutoSortFn, column_getCanMultiSort, column_getCanSort, column_getFirstSortDir, column_getIsSorted, column_getNextSortingOrder, column_getSortFn, column_getSortIndex, column_getToggleSortingHandler, column_toggleSorting, getDefaultSortingState, table_autoResetSorting, table_resetSorting, table_setSorting };