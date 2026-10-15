import { cloneState, hasOwn, setStateSlice } from "../../utils.js";

//#region src/features/column-grouping/columnGroupingFeature.utils.ts
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
function getDefaultGroupingState() {
	return [];
}
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
function column_toggleGrouping(column) {
	table_setGrouping(column.table, (old) => {
		if (old.includes(column.id)) return old.filter((d) => d !== column.id);
		return [...old, column.id];
	});
}
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
function column_getCanGroup(column) {
	return (column.columnDef.enableGrouping ?? true) && (column.table.options.enableGrouping ?? true) && (!!column.accessorFn || !!column.columnDef.getGroupingValue);
}
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
function column_getIsGrouped(column) {
	return !!column.table.atoms.grouping?.get()?.includes(column.id);
}
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
function column_getGroupedIndex(column) {
	return column.table.atoms.grouping?.get()?.indexOf(column.id) ?? -1;
}
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
function column_getToggleGroupingHandler(column) {
	const canGroup = column_getCanGroup(column);
	return () => {
		if (!canGroup) return;
		column_toggleGrouping(column);
	};
}
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
function table_setGrouping(table, updater) {
	setStateSlice(table, "grouping", updater);
}
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
function table_resetGrouping(table, defaultState) {
	table_setGrouping(table, defaultState ? [] : cloneState(table.initialState.grouping ?? []));
}
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
function row_getIsGrouped(row) {
	return !!row.groupingColumnId;
}
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
function row_getGroupingValue(row, columnId) {
	if (row._groupingValuesCache && hasOwn(row._groupingValuesCache, columnId)) return row._groupingValuesCache[columnId];
	const column = row.table.getColumn(columnId);
	if (!column.columnDef.getGroupingValue) return row.getValue(columnId);
	if (row._groupingValuesCache) row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(row.original, row.index, row);
	return row._groupingValuesCache?.[columnId];
}
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
function cell_getIsGrouped(cell) {
	const row = cell.row;
	return column_getIsGrouped(cell.column) && cell.column.id === row.groupingColumnId;
}
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
function cell_getIsPlaceholder(cell) {
	return !cell_getIsGrouped(cell) && column_getIsGrouped(cell.column);
}

//#endregion
export { cell_getIsGrouped, cell_getIsPlaceholder, column_getCanGroup, column_getGroupedIndex, column_getIsGrouped, column_getToggleGroupingHandler, column_toggleGrouping, getDefaultGroupingState, row_getGroupingValue, row_getIsGrouped, table_resetGrouping, table_setGrouping };