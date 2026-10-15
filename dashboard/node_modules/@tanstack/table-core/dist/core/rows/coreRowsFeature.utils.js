import { flattenBy, hasOwn, makeObjectMap } from "../../utils.js";
import { constructCell } from "../cells/constructCell.js";

//#region src/core/rows/coreRowsFeature.utils.ts
/**
* Returns this row's zero-based position in the current pre-pagination row
* model. Rows outside that model return `-1`.
*/
function row_getDisplayIndex(row) {
	const rows = row.table.getRowsInDisplayOrder();
	const displayIndex = row._displayIndexCache;
	return rows[displayIndex] === row ? displayIndex : -1;
}
/**
* Returns the rows in the current display order after assigning their
* zero-based display indexes.
*
* When expanded rows bypass pagination, expanded descendants are inserted into
* the returned order even though they are absent from the pre-pagination row
* model.
*/
function table_getRowsInDisplayOrder(table) {
	const rows = table.getPrePaginatedRowModel().rows;
	if (table.options.paginateExpandedRows === false) {
		const displayRows = [];
		const handleRow = (row) => {
			row._displayIndexCache = displayRows.length;
			displayRows.push(row);
			if (row.subRows.length && row.getIsExpanded?.()) row.subRows.forEach(handleRow);
		};
		rows.forEach(handleRow);
		return displayRows;
	}
	for (let i = 0; i < rows.length; i++) rows[i]._displayIndexCache = i;
	return rows;
}
/**
* Reads and caches this row's value for a column.
*
* The value is produced by the column accessor. Missing columns or display
* columns without an accessor return `undefined`.
*
* @example
* ```ts
* const firstName = row_getValue(row, 'firstName')
* ```
*/
function row_getValue(row, columnId) {
	if (hasOwn(row._valuesCache, columnId)) return row._valuesCache[columnId];
	const column = row.table.getColumn(columnId);
	if (!column?.accessorFn) return;
	row._valuesCache[columnId] = column.accessorFn(row.original, row.index);
	return row._valuesCache[columnId];
}
/**
* Reads and caches the values used by faceting/grouping for a column.
*
* If the column defines `getUniqueValues`, that result is used. Otherwise the
* row's accessor value is wrapped in a single-item array.
*
* @example
* ```ts
* const values = row_getUniqueValues(row, 'tags')
* ```
*/
function row_getUniqueValues(row, columnId) {
	if (hasOwn(row._uniqueValuesCache, columnId)) return row._uniqueValuesCache[columnId];
	const column = row.table.getColumn(columnId);
	if (!column?.accessorFn) return;
	if (!column.columnDef.getUniqueValues) {
		row._uniqueValuesCache[columnId] = [row.getValue(columnId)];
		return row._uniqueValuesCache[columnId];
	}
	row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(row.original, row.index);
	return row._uniqueValuesCache[columnId];
}
/**
* Returns a renderable row value for a column.
*
* If the accessor value is nullish, the table's `renderFallbackValue` is used
* instead.
*
* @example
* ```ts
* const value = row_renderValue(row, 'firstName')
* ```
*/
function row_renderValue(row, columnId) {
	return row.getValue(columnId) ?? row.table.options.renderFallbackValue;
}
/**
* Flattens this row's descendant tree into leaf rows.
*
* The row itself is not included; only nested `subRows` are walked.
*
* @example
* ```ts
* const descendants = row_getLeafRows(row)
* ```
*/
function row_getLeafRows(row) {
	return flattenBy(row.subRows, (d) => d.subRows);
}
/**
* Returns the deepest structural row depth in the core row model.
* Root rows are depth `0`, their direct sub-rows are depth `1`, and so on.
*/
function table_getMaxSubRowDepth(table) {
	const rows = table.getCoreRowModel().flatRows;
	let maxDepth = 0;
	for (let i = 0; i < rows.length; i++) maxDepth = Math.max(maxDepth, rows[i].depth);
	return maxDepth;
}
/**
* Looks up this row's direct parent, if it has one.
*
* Parent lookup prefers the core row model for structural parents, then falls
* back to the pre-pagination row model for generated parent rows.
*
* @example
* ```ts
* const parent = row_getParentRow(row)
* ```
*/
function row_getParentRow(row) {
	if (!row.parentId) return;
	return row.table.getCoreRowModel().rowsById[row.parentId] ?? row.table.getRow(row.parentId, true);
}
/**
* Collects this row's ancestor chain from root to direct parent.
*
* The current row is not included. Rows without a parent return an empty array.
*
* @example
* ```ts
* const ancestors = row_getParentRows(row)
* ```
*/
function row_getParentRows(row) {
	const parentRows = [];
	let currentRow = row;
	while (true) {
		const parentRow = currentRow.getParentRow();
		if (!parentRow) break;
		parentRows.push(parentRow);
		currentRow = parentRow;
	}
	return parentRows.reverse();
}
/**
* Constructs one cell for each leaf column in this row.
*
* The result follows `table.getAllLeafColumns()` order and includes hidden
* columns; visibility-specific APIs filter this list later.
*
* @example
* ```ts
* const cells = row_getAllCells(row)
* ```
*/
function row_getAllCells(row) {
	const columns = row.table.getAllLeafColumns();
	let cache = row._cellsCache;
	if (!cache) cache = row._cellsCache = /* @__PURE__ */ new WeakMap();
	const cells = new Array(columns.length);
	for (let i = 0; i < columns.length; i++) {
		const column = columns[i];
		let cell = cache.get(column);
		if (!cell) {
			cell = constructCell(column, row, row.table);
			cache.set(column, cell);
		}
		cells[i] = cell;
	}
	return cells;
}
/**
* Builds a lookup map of this row's cells keyed by column id.
*
* This is the static implementation behind `row.getAllCellsByColumnId()`.
*
* @example
* ```ts
* const cellsById = row_getAllCellsByColumnId(row)
* ```
*/
function row_getAllCellsByColumnId(row) {
	const result = makeObjectMap();
	const cells = row.getAllCells();
	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];
		result[cell.column.id] = cell;
	}
	return result;
}
/**
* Resolves the stable id for a row.
*
* `options.getRowId` wins when provided. Otherwise root rows use their index
* and child rows append their index to the parent id, such as `0.2`.
*
* @example
* ```ts
* const id = table_getRowId(originalRow, table, index, parentRow)
* ```
*/
function table_getRowId(originalRow, table, index, parent) {
	return table.options.getRowId?.(originalRow, index, parent) ?? (parent ? `${parent.id}.${index}` : String(index));
}
/**
* Looks up a row by id from the current or full row model.
*
* By default this searches `table.getRowModel()`. Passing `searchAll` searches
* the pre-pagination model first, then falls back to the core model.
*
* @example
* ```ts
* const row = table_getRow(table, rowId, true)
* ```
*/
function table_getRow(table, rowId, searchAll) {
	let row = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel()).rowsById[rowId];
	if (!row) {
		row = table.getCoreRowModel().rowsById[rowId];
		if (!row) {
			if (process.env.NODE_ENV === "development") throw new Error(`getRow could not find row with ID: ${rowId}`);
			throw new Error();
		}
	}
	return row;
}

//#endregion
export { row_getAllCells, row_getAllCellsByColumnId, row_getDisplayIndex, row_getLeafRows, row_getParentRow, row_getParentRows, row_getUniqueValues, row_getValue, row_renderValue, table_getMaxSubRowDepth, table_getRow, table_getRowId, table_getRowsInDisplayOrder };