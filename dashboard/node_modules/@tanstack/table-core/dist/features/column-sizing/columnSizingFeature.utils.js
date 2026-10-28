import { callMemoOrStaticFn, cloneState, hasOwn, makeObjectMap } from "../../utils.js";
import { table_getCenterHeaderGroups, table_getEndHeaderGroups, table_getPinnedVisibleLeafColumns, table_getStartHeaderGroups } from "../column-pinning/columnPinningFeature.utils.js";

//#region src/features/column-sizing/columnSizingFeature.utils.ts
/**
* Creates the default committed column sizing state.
*
* The feature default is an empty map, so columns fall back to their column def
* size or the built-in sizing defaults.
*
* @example
* ```ts
* const sizing = getDefaultColumnSizingState()
* ```
*/
function getDefaultColumnSizingState() {
	return makeObjectMap();
}
/**
* Creates the built-in sizing defaults for column definitions.
*
* Columns default to `size: 150`, `minSize: 20`, and
* `maxSize: Number.MAX_SAFE_INTEGER` unless overridden by column definitions or
* table defaults.
*
* @example
* ```ts
* const defaults = getDefaultColumnSizingColumnDef()
* ```
*/
function getDefaultColumnSizingColumnDef() {
	return {
		size: 150,
		minSize: 20,
		maxSize: Number.MAX_SAFE_INTEGER
	};
}
/**
* Resolves a column's current pixel size.
*
* Committed `state.columnSizing[column.id]` wins over `columnDef.size`, then the
* built-in default size. The result is clamped between min and max size.
*
* @example
* ```ts
* const width = column_getSize(column)
* ```
*/
function column_getSize(column) {
	const defaultSizes = getDefaultColumnSizingColumnDef();
	const columnSizing = column.table.atoms.columnSizing?.get();
	const columnSize = columnSizing && hasOwn(columnSizing, column.id) ? columnSizing[column.id] : void 0;
	return Math.min(Math.max(column.columnDef.minSize ?? defaultSizes.minSize, columnSize ?? column.columnDef.size ?? defaultSizes.size), column.columnDef.maxSize ?? defaultSizes.maxSize);
}
function buildColumnOffsets(columns) {
	const starts = makeObjectMap();
	const afters = makeObjectMap();
	const sizes = new Array(columns.length);
	let start = 0;
	for (let i = 0; i < columns.length; i++) {
		const column = columns[i];
		const size = callMemoOrStaticFn(column, "getSize", column_getSize);
		sizes[i] = size;
		starts[column.id] = start;
		start += size;
	}
	let after = 0;
	for (let i = columns.length - 1; i >= 0; i--) {
		afters[columns[i].id] = after;
		after += sizes[i];
	}
	return {
		starts,
		afters
	};
}
/**
* Builds start and after offset maps for every visible leaf column, computed
* once per pinning region plus the full visible list.
*
* A single table-level memo of this result backs all `column.getStart()` and
* `column.getAfter()` calls with O(1) lookups.
*
* @example
* ```ts
* const offsets = table_getColumnOffsets(table)
* const startOffset = offsets.start.starts[column.id]
* ```
*/
function table_getColumnOffsets(table) {
	return {
		all: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table)),
		center: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table, "center")),
		start: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table, "start")),
		end: buildColumnOffsets(table_getPinnedVisibleLeafColumns(table, "end"))
	};
}
function toOffsetsKey(position) {
	return position === "start" ? "start" : position === "end" ? "end" : position === "center" ? "center" : "all";
}
/**
* Computes the offset from the start edge of a pinning region to this column.
*
* The value is the sum of all previous visible leaf column sizes in the
* requested `'start'`, `'center'`, or `'end'` region.
*
* `start` and `end` are logical positions. In LTR languages/layouts, `start`
* usually corresponds to left and `end` to right. In RTL languages/layouts,
* `start` usually corresponds to right and `end` to left.
*
* @example
* ```ts
* const startOffset = column_getStart(column, 'start')
* ```
*/
function column_getStart(column, position) {
	return callMemoOrStaticFn(column.table, "getColumnOffsets", table_getColumnOffsets)[toOffsetsKey(position)].starts[column.id] ?? 0;
}
/**
* Computes the offset from the end edge of a pinning region after this column.
*
* The value is the sum of all following visible leaf column sizes in the
* requested region.
*
* @example
* ```ts
* const endOffset = column_getAfter(column, 'end')
* ```
*/
function column_getAfter(column, position) {
	return callMemoOrStaticFn(column.table, "getColumnOffsets", table_getColumnOffsets)[toOffsetsKey(position)].afters[column.id] ?? 0;
}
/**
* Removes this column's committed size override.
*
* After reset, the column resolves size from `columnDef.size` or built-in
* defaults again.
*
* @example
* ```ts
* column_resetSize(column)
* ```
*/
function column_resetSize(column) {
	table_setColumnSizing(column.table, (old) => {
		const rest = makeObjectMap();
		const columnIds = Object.keys(old);
		for (let i = 0; i < columnIds.length; i++) {
			const columnId = columnIds[i];
			if (columnId !== column.id) rest[columnId] = old[columnId];
		}
		return rest;
	});
}
function sumHeaderSize(header) {
	if (!header.subHeaders.length) return column_getSize(header.column);
	let sum = 0;
	for (let i = 0; i < header.subHeaders.length; i++) sum += sumHeaderSize(header.subHeaders[i]);
	return sum;
}
/**
* Computes a header's rendered size from its leaf headers.
*
* Group headers sum the sizes of all descendant leaf columns. Leaf headers use
* their column's current size.
*
* @example
* ```ts
* const width = header_getSize(header)
* ```
*/
function header_getSize(header) {
	return sumHeaderSize(header);
}
/**
* Computes a header's offset from the start of its header group.
*
* The offset is the previous sibling header's start plus size, or `0` for the
* first header in the group.
*
* @example
* ```ts
* const offset = header_getStart(header)
* ```
*/
function header_getStart(header) {
	if (header.index > 0) {
		const prevSiblingHeader = header.headerGroup?.headers[header.index - 1];
		if (prevSiblingHeader) return callMemoOrStaticFn(prevSiblingHeader, "getStart", header_getStart) + callMemoOrStaticFn(prevSiblingHeader, "getSize", header_getSize);
	}
	return 0;
}
/**
* Routes a committed column sizing updater through the table's sizing handler.
*
* The updater may be a next size map or a function of the previous map,
* matching the instance `table.setColumnSizing` behavior.
*
* @example
* ```ts
* table_setColumnSizing(table, (old) => ({ ...old, age: 96 }))
* ```
*/
function table_setColumnSizing(table, updater) {
	table.options.onColumnSizingChange?.(updater);
}
/**
* Resets `columnSizing` to the configured initial state or feature default.
*
* With no argument, the reset clones `table.initialState.columnSizing` when it
* exists. Passing `true` ignores initial state and resets to `{}`.
*
* @example
* ```ts
* table_resetColumnSizing(table)
* table_resetColumnSizing(table, true)
* ```
*/
function table_resetColumnSizing(table, defaultState) {
	table_setColumnSizing(table, defaultState ? makeObjectMap() : Object.assign(makeObjectMap(), cloneState(table.initialState.columnSizing ?? {})));
}
/**
* Sums the rendered size of the full table header row.
*
* This includes start, center, and end columns in the main header group.
*
* @example
* ```ts
* const width = table_getTotalSize(table)
* ```
*/
function table_getTotalSize(table) {
	return table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
		return sum + header_getSize(header);
	}, 0) ?? 0;
}
/**
* Sums the rendered size of the logical start pinned header region.
*
* An empty start pinning region returns `0`.
*
* @example
* ```ts
* const width = table_getStartTotalSize(table)
* ```
*/
function table_getStartTotalSize(table) {
	return callMemoOrStaticFn(table, "getStartHeaderGroups", table_getStartHeaderGroups)[0]?.headers.reduce((sum, header) => {
		return sum + header_getSize(header);
	}, 0) ?? 0;
}
/**
* Sums the rendered size of the center, unpinned header region.
*
* An empty center region returns `0`.
*
* @example
* ```ts
* const width = table_getCenterTotalSize(table)
* ```
*/
function table_getCenterTotalSize(table) {
	return callMemoOrStaticFn(table, "getCenterHeaderGroups", table_getCenterHeaderGroups)[0]?.headers.reduce((sum, header) => {
		return sum + header_getSize(header);
	}, 0) ?? 0;
}
/**
* Sums the rendered size of the logical end pinned header region.
*
* An empty end pinning region returns `0`.
*
* @example
* ```ts
* const width = table_getEndTotalSize(table)
* ```
*/
function table_getEndTotalSize(table) {
	return callMemoOrStaticFn(table, "getEndHeaderGroups", table_getEndHeaderGroups)[0]?.headers.reduce((sum, header) => {
		return sum + header_getSize(header);
	}, 0) ?? 0;
}

//#endregion
export { column_getAfter, column_getSize, column_getStart, column_resetSize, getDefaultColumnSizingColumnDef, getDefaultColumnSizingState, header_getSize, header_getStart, table_getCenterTotalSize, table_getColumnOffsets, table_getEndTotalSize, table_getStartTotalSize, table_getTotalSize, table_resetColumnSizing, table_setColumnSizing };