import { callMemoOrStaticFn, cloneState, makeObjectMap, setStateSlice } from "../../utils.js";
import { table_getPinnedVisibleLeafColumns } from "../column-pinning/columnPinningFeature.utils.js";

//#region src/features/column-ordering/columnOrderingFeature.utils.ts
/**
* Creates the default column order state.
*
* The feature default is an empty array, meaning leaf columns keep their natural
* definition order. Reset APIs use this value when `defaultState` is `true`.
*
* @example
* ```ts
* const order = getDefaultColumnOrderState()
* ```
*/
function getDefaultColumnOrderState() {
	return [];
}
/**
* Builds column-id to index records for each visible pinning region.
*
* All four regions are built in one pass so a single memo entry serves every
* `column_getIndex` lookup without per-column scans.
*
* @example
* ```ts
* const indexes = table_getColumnIndexes(table)
* ```
*/
function table_getColumnIndexes(table) {
	const buildIndexes = (columns) => {
		const indexes = makeObjectMap();
		for (let i = 0; i < columns.length; i++) indexes[columns[i].id] = i;
		return indexes;
	};
	return {
		all: buildIndexes(table_getPinnedVisibleLeafColumns(table)),
		center: buildIndexes(table_getPinnedVisibleLeafColumns(table, "center")),
		start: buildIndexes(table_getPinnedVisibleLeafColumns(table, "start")),
		end: buildIndexes(table_getPinnedVisibleLeafColumns(table, "end"))
	};
}
/**
* Finds this column's index within a visible pinning region.
*
* Pass `'start'`, `'center'`, or `'end'` to search that region; omit the
* position to search the full visible leaf column list.
*
* @example
* ```ts
* const index = column_getIndex(column, 'center')
* ```
*/
function column_getIndex(column, position) {
	return callMemoOrStaticFn(column.table, "getColumnIndexes", table_getColumnIndexes)[position === "start" ? "start" : position === "end" ? "end" : position === "center" ? "center" : "all"][column.id] ?? -1;
}
/**
* Checks whether this column is the first visible column in a pinning region.
*
* The same `position` semantics as `column_getIndex` apply.
*
* @example
* ```ts
* const isFirst = column_getIsFirstColumn(column, 'start')
* ```
*/
function column_getIsFirstColumn(column, position) {
	return table_getPinnedVisibleLeafColumns(column.table, position)[0]?.id === column.id;
}
/**
* Checks whether this column is the last visible column in a pinning region.
*
* The same `position` semantics as `column_getIndex` apply.
*
* @example
* ```ts
* const isLast = column_getIsLastColumn(column, 'end')
* ```
*/
function column_getIsLastColumn(column, position) {
	const columns = table_getPinnedVisibleLeafColumns(column.table, position);
	return columns[columns.length - 1]?.id === column.id;
}
/**
* Routes a column order updater through the table's column-order change handler.
*
* The updater may be a next ordered id array or a function of the previous
* array, matching the instance `table.setColumnOrder` behavior.
*
* @example
* ```ts
* table_setColumnOrder(table, ['firstName', 'lastName', 'age'])
* ```
*/
function table_setColumnOrder(table, updater) {
	setStateSlice(table, "columnOrder", updater);
}
/**
* Resets `columnOrder` to the configured initial state or feature default.
*
* With no argument, the reset clones `table.initialState.columnOrder` when it
* exists. Passing `true` ignores initial state and resets to `[]`.
*
* @example
* ```ts
* table_resetColumnOrder(table)
* table_resetColumnOrder(table, true)
* ```
*/
function table_resetColumnOrder(table, defaultState) {
	table_setColumnOrder(table, defaultState ? [] : cloneState(table.initialState.columnOrder ?? []));
}
/**
* Creates the ordering function used to arrange leaf columns.
*
* The returned function applies `state.columnOrder`, preserves unspecified
* columns in their original order, then delegates to grouping rules.
*
* @example
* ```ts
* const orderColumnsForTable = table_getOrderColumnsFn(table)
* ```
*/
function table_getOrderColumnsFn(table) {
	const columnOrder = table.atoms.columnOrder?.get();
	return (columns) => {
		let orderedColumns = [];
		if (!columnOrder?.length) orderedColumns = columns;
		else {
			const remaining = /* @__PURE__ */ new Map();
			for (let i = 0; i < columns.length; i++) {
				const column = columns[i];
				remaining.set(column.id, column);
			}
			for (let i = 0; i < columnOrder.length; i++) {
				const id = columnOrder[i];
				const column = remaining.get(id);
				if (column) {
					orderedColumns.push(column);
					remaining.delete(id);
				}
			}
			for (let i = 0; i < columns.length; i++) {
				const column = columns[i];
				if (remaining.has(column.id)) orderedColumns.push(column);
			}
		}
		return orderColumns(table, orderedColumns);
	};
}
/**
* Applies grouped-column placement rules to an already ordered leaf-column list.
*
* `groupedColumnMode: 'remove'` drops grouped columns from the list.
* `groupedColumnMode: 'reorder'` moves grouped columns to the front in grouping
* state order.
*
* @example
* ```ts
* const orderedColumns = orderColumns(table, leafColumns)
* ```
*/
function orderColumns(table, leafColumns) {
	const grouping = table.atoms.grouping?.get() ?? [];
	const { groupedColumnMode } = table.options;
	if (!grouping.length || !groupedColumnMode) return leafColumns;
	const nonGroupingColumns = leafColumns.filter((col) => !grouping.includes(col.id));
	if (groupedColumnMode === "remove") return nonGroupingColumns;
	const leafColumnsById = /* @__PURE__ */ new Map();
	for (let i = 0; i < leafColumns.length; i++) {
		const col = leafColumns[i];
		leafColumnsById.set(col.id, col);
	}
	const groupingColumns = [];
	for (let i = 0; i < grouping.length; i++) {
		const col = leafColumnsById.get(grouping[i]);
		if (col) groupingColumns.push(col);
	}
	return [...groupingColumns, ...nonGroupingColumns];
}

//#endregion
export { column_getIndex, column_getIsFirstColumn, column_getIsLastColumn, getDefaultColumnOrderState, orderColumns, table_getColumnIndexes, table_getOrderColumnsFn, table_resetColumnOrder, table_setColumnOrder };