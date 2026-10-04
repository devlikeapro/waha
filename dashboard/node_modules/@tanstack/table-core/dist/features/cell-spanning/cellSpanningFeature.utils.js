import { callMemoOrStaticFn, isFunction, makeObjectMap } from "../../utils.js";

//#region src/features/cell-spanning/cellSpanningFeature.utils.ts
const EMPTY_ROW_SPANS = makeObjectMap();
const EMPTY_COLUMN_INDEXES = makeObjectMap();
const EMPTY_COL_SPANS = [];
const NO_SECTION_STARTS = [];
/**
* Resolves the rows in the order a renderer actually draws them, plus the
* positions at which a new visual section begins.
*
* Without row pinning this is the final row model itself, returned by
* reference so the common path allocates nothing. With row pinning it is the
* concatenation the three-list renderer walks: `getTopRows()`,
* `getCenterRows()`, `getBottomRows()`. `getCenterRows()` filters the row
* model by the pinned ids, so no row appears in two sections and every row
* gets exactly one position; with `keepPinnedRows` a pinned row that filtering
* removed from the row model still appears exactly once, in its pinned
* section.
*
* The pinning reads are optional-chained so the feature stays correct when
* `rowPinningFeature` is not registered.
*/
function getRenderedRows(table) {
	const rows = table.getRowModel().rows;
	const rowPinning = table.atoms.rowPinning?.get();
	if (!rowPinning || !rowPinning.top.length && !rowPinning.bottom.length) return {
		rows,
		sectionStarts: NO_SECTION_STARTS
	};
	const pinnedTable = table;
	const top = pinnedTable.getTopRows?.() ?? [];
	const center = pinnedTable.getCenterRows?.() ?? rows;
	const bottom = pinnedTable.getBottomRows?.() ?? [];
	return {
		rows: [
			...top,
			...center,
			...bottom
		],
		sectionStarts: [top.length, top.length + center.length]
	};
}
/**
* Resolves the visible columns in the order cells render, plus the two
* boundaries between the start-pinned, center, and end-pinned regions.
*
* Read off a rendered row's visible cells rather than re-derived, so the
* ordering is the renderer's own by construction. `getVisibleCells` only
* exists when `columnVisibilityFeature` is registered; without it renderers
* walk `row.getAllCells()`, whose order is `table.getAllLeafColumns()`.
*/
function getRenderedColumns(table, firstRow) {
	const cells = firstRow.getVisibleCells?.() ?? firstRow.getAllCells();
	const columns = new Array(cells.length);
	for (let i = 0; i < cells.length; i++) columns[i] = cells[i].column;
	const pinning = table.atoms.columnPinning?.get();
	let centerStart = 0;
	let centerEnd = columns.length;
	if (pinning) {
		while (centerStart < centerEnd && pinning.start.includes(columns[centerStart].id)) centerStart++;
		while (centerEnd > centerStart && pinning.end.includes(columns[centerEnd - 1].id)) centerEnd--;
	}
	return {
		columns,
		centerStart,
		centerEnd
	};
}
/**
* Checks whether this column takes part in cell spanning.
*
* A column def opting out with `enableCellSpanning: false` wins over the table
* option, matching how the other per-column enable flags resolve.
*
* @example
* ```ts
* const canSpan = column_getCanSpan(column)
* ```
*/
function column_getCanSpan(column) {
	if (column.columnDef.enableCellSpanning === false) return false;
	return column.table.options.enableCellSpanning ?? true;
}
/**
* Builds the table's cell span index for the rows that are currently rendered.
*
* Spans are always derived from scratch from the final row model, so sorting,
* filtering, pagination, expansion, and row pinning only change adjacency and
* the index follows. Nothing is persisted and there is nothing to configure.
*
* @example
* ```ts
* const spanIndex = table_getCellSpanIndex(table)
* ```
*/
function table_getCellSpanIndex(table) {
	const { rows, sectionStarts } = getRenderedRows(table);
	const rowCount = rows.length;
	const empty = {
		colSpans: EMPTY_COL_SPANS,
		columnIndexes: EMPTY_COLUMN_INDEXES,
		rowSpans: EMPTY_ROW_SPANS,
		rows
	};
	if (!rowCount || table.options.enableCellSpanning === false) return empty;
	const { columns, centerStart, centerEnd } = getRenderedColumns(table, rows[0]);
	const columnCount = columns.length;
	if (!columnCount) return empty;
	const columnIndexes = makeObjectMap();
	for (let c = 0; c < columnCount; c++) columnIndexes[columns[c].id] = c;
	const breaks = new Uint8Array(rowCount);
	for (let s = 0; s < sectionStarts.length; s++) {
		const start = sectionStarts[s];
		if (start < rowCount) breaks[start] = 1;
	}
	for (let r = 0; r < rowCount; r++) {
		const row = rows[r];
		row._cellSpanRowIndex = r;
		const prev = r > 0 ? rows[r - 1] : void 0;
		if (prev && (row.depth !== prev.depth || row.parentId !== prev.parentId) || row.getIsGrouped?.() === true) breaks[r] = 1;
	}
	const colSpans = [];
	let anyColSpan = false;
	for (let c = 0; c < columnCount; c++) {
		const column = columns[c];
		const spanColumns = column.columnDef.spanColumns;
		if (spanColumns === void 0 || !column_getCanSpan(column)) continue;
		const regionEnd = c < centerStart ? centerStart : c < centerEnd ? centerEnd : columnCount;
		for (let r = 0; r < rowCount; r++) {
			const existing = colSpans[r];
			if (existing && existing[c] === 0) continue;
			const requested = isFunction(spanColumns) ? spanColumns({
				column,
				row: rows[r],
				table
			}) : spanColumns;
			if (!(requested > 1)) continue;
			const span = Math.min(requested, regionEnd - c);
			if (span < 2) continue;
			const target = existing ?? (colSpans[r] = new Int32Array(columnCount).fill(1));
			target[c] = span;
			for (let k = c + 1; k < c + span; k++) target[k] = 0;
			anyColSpan = true;
		}
	}
	const rowSpans = makeObjectMap();
	for (let c = 0; c < columnCount; c++) {
		const column = columns[c];
		const spanRows = column.columnDef.spanRows;
		if (!spanRows || !column_getCanSpan(column)) continue;
		if (column.getIsGrouped?.() === true) continue;
		const columnId = column.id;
		const predicate = isFunction(spanRows) ? spanRows : void 0;
		const spans = new Int32Array(rowCount).fill(1);
		let anyRun = false;
		let anchorIndex = -1;
		let anchorValue;
		let anchorColSpan = 1;
		for (let r = 0; r < rowCount; r++) {
			const row = rows[r];
			const rowColSpans = anyColSpan ? colSpans[r] : void 0;
			const cellColSpan = rowColSpans ? rowColSpans[c] : 1;
			if (cellColSpan === 0) {
				anchorIndex = -1;
				continue;
			}
			const value = row.getValue(columnId);
			if (anchorIndex !== -1 && !breaks[r] && cellColSpan === anchorColSpan && (predicate ? predicate({
				anchorRow: rows[anchorIndex],
				anchorValue,
				column,
				previousRow: rows[r - 1],
				row,
				table,
				value
			}) : value != null && Object.is(value, anchorValue))) {
				spans[r] = 0;
				spans[anchorIndex] = spans[anchorIndex] + 1;
				anyRun = true;
				continue;
			}
			anchorIndex = r;
			anchorValue = value;
			anchorColSpan = cellColSpan;
		}
		if (anyRun) rowSpans[columnId] = spans;
	}
	return {
		colSpans,
		columnIndexes,
		rowSpans,
		rows
	};
}
function resolveRowIndex(index, cell) {
	const rowIndex = cell.row._cellSpanRowIndex;
	if (rowIndex === void 0 || index.rows[rowIndex] !== cell.row) return -1;
	return rowIndex;
}
/**
* Returns how many rows this cell spans.
*
* `1` when it does not span, and `0` when a spanning cell above it covers it,
* matching the `header.rowSpan` convention where `0` means "skip this cell".
*
* Deliberately not memoized: a per-cell memo would allocate a closure and a
* dependency array for every cell, costing more than the two lookups this
* performs against the table-level span index.
*
* @example
* ```ts
* const rowSpan = cell_getRowSpan(cell)
* ```
*/
function cell_getRowSpan(cell) {
	const table = cell.row.table;
	const index = callMemoOrStaticFn(table, "getCellSpanIndex", table_getCellSpanIndex);
	const spans = index.rowSpans[cell.column.id];
	if (!spans) return 1;
	const rowIndex = resolveRowIndex(index, cell);
	if (rowIndex === -1) return 1;
	return spans[rowIndex];
}
/**
* Returns how many columns this cell spans.
*
* `1` when it does not span, and `0` when another cell's column span covers
* it.
*
* @example
* ```ts
* const colSpan = cell_getColSpan(cell)
* ```
*/
function cell_getColSpan(cell) {
	const table = cell.row.table;
	const index = callMemoOrStaticFn(table, "getCellSpanIndex", table_getCellSpanIndex);
	const rowIndex = resolveRowIndex(index, cell);
	if (rowIndex === -1) return 1;
	const spans = index.colSpans[rowIndex];
	if (!spans) return 1;
	const columnIndex = index.columnIndexes[cell.column.id];
	return columnIndex === void 0 ? 1 : spans[columnIndex];
}
/**
* Checks whether another cell's span covers this cell.
*
* Covered cells must not be rendered; the cell that covers them carries the
* content and the span attributes.
*
* @example
* ```ts
* const isCovered = cell_getIsCovered(cell)
* ```
*/
function cell_getIsCovered(cell) {
	return cell_getRowSpan(cell) === 0 || cell_getColSpan(cell) === 0;
}

//#endregion
export { cell_getColSpan, cell_getIsCovered, cell_getRowSpan, column_getCanSpan, table_getCellSpanIndex };