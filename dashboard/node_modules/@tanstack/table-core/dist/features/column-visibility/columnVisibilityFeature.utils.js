import { callMemoOrStaticFn, cloneState, hasOwn, makeObjectMap, setStateSlice } from "../../utils.js";
import { getDefaultColumnPinningState } from "../column-pinning/columnPinningFeature.utils.js";

//#region src/features/column-visibility/columnVisibilityFeature.utils.ts
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
function getDefaultColumnVisibilityState() {
	return makeObjectMap();
}
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
function column_toggleVisibility(column, visible) {
	if (column_getCanHide(column)) table_setColumnVisibility(column.table, (old) => {
		const next = Object.assign(makeObjectMap(), old);
		const nextVisible = visible ?? !callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible);
		const leafColumns = column.getLeafColumns();
		for (let i = 0; i < leafColumns.length; i++) {
			const leafColumn = leafColumns[i];
			if (column_getCanHide(leafColumn)) next[leafColumn.id] = nextVisible;
		}
		return next;
	});
}
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
function column_getIsVisible(column) {
	const columnVisibility = column.table.atoms.columnVisibility?.get();
	if (!columnVisibility) return true;
	const childColumns = column.columns;
	if (childColumns.length) return childColumns.some((childColumn) => callMemoOrStaticFn(childColumn, "getIsVisible", column_getIsVisible));
	return (hasOwn(columnVisibility, column.id) ? columnVisibility[column.id] : void 0) ?? true;
}
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
function column_getCanHide(column) {
	return (column.columnDef.enableHiding ?? true) && (column.table.options.enableHiding ?? true);
}
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
function column_getToggleVisibilityHandler(column) {
	return (e) => {
		column_toggleVisibility(column, e.target.checked);
	};
}
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
function row_getVisibleCells(row) {
	const allCells = row.getAllCells();
	const visibleCells = [];
	for (let i = 0; i < allCells.length; i++) {
		const cell = allCells[i];
		if (callMemoOrStaticFn(cell.column, "getIsVisible", column_getIsVisible)) visibleCells.push(cell);
	}
	const { start, end } = row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
	if (!start.length && !end.length) return visibleCells;
	const visibleCellsByColumnId = callMemoOrStaticFn(row, "getVisibleCellsByColumnId", row_getVisibleCellsByColumnId);
	const startCells = [];
	for (let i = 0; i < start.length; i++) {
		const cell = visibleCellsByColumnId[start[i]];
		if (cell) startCells.push(cell);
	}
	const endCells = [];
	for (let i = 0; i < end.length; i++) {
		const cell = visibleCellsByColumnId[end[i]];
		if (cell) endCells.push(cell);
	}
	const centerCells = [];
	for (let i = 0; i < visibleCells.length; i++) {
		const cell = visibleCells[i];
		const id = cell.column.id;
		if (!start.includes(id) && !end.includes(id)) centerCells.push(cell);
	}
	return [
		...startCells,
		...centerCells,
		...endCells
	];
}
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
function row_getVisibleCellsByColumnId(row) {
	const result = makeObjectMap();
	const allCells = row.getAllCells();
	for (let i = 0; i < allCells.length; i++) {
		const cell = allCells[i];
		if (callMemoOrStaticFn(cell.column, "getIsVisible", column_getIsVisible)) result[cell.column.id] = cell;
	}
	return result;
}
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
function table_getVisibleFlatColumns(table) {
	return table.getAllFlatColumns().filter((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
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
function table_getVisibleLeafColumns(table) {
	return table.getAllLeafColumns().filter((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
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
function table_setColumnVisibility(table, updater) {
	setStateSlice(table, "columnVisibility", updater);
}
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
function table_resetColumnVisibility(table, defaultState) {
	table_setColumnVisibility(table, defaultState ? makeObjectMap() : Object.assign(makeObjectMap(), cloneState(table.initialState.columnVisibility ?? {})));
}
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
function table_toggleAllColumnsVisible(table, value) {
	value = value ?? !table_getIsAllColumnsVisible(table);
	const visibility = makeObjectMap();
	const leafColumns = table.getAllLeafColumns();
	for (let i = 0; i < leafColumns.length; i++) {
		const column = leafColumns[i];
		visibility[column.id] = !value ? !column_getCanHide(column) : value;
	}
	table_setColumnVisibility(table, visibility);
}
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
function table_getIsAllColumnsVisible(table) {
	return !table.getAllLeafColumns().some((column) => !callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
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
function table_getIsSomeColumnsVisible(table) {
	return table.getAllLeafColumns().some((column) => callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible));
}
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
function table_getToggleAllColumnsVisibilityHandler(table) {
	return (e) => {
		table_toggleAllColumnsVisible(table, e.target.checked);
	};
}

//#endregion
export { column_getCanHide, column_getIsVisible, column_getToggleVisibilityHandler, column_toggleVisibility, getDefaultColumnVisibilityState, row_getVisibleCells, row_getVisibleCellsByColumnId, table_getIsAllColumnsVisible, table_getIsSomeColumnsVisible, table_getToggleAllColumnsVisibilityHandler, table_getVisibleFlatColumns, table_getVisibleLeafColumns, table_resetColumnVisibility, table_setColumnVisibility, table_toggleAllColumnsVisible };