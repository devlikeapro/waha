import { callMemoOrStaticFn, cloneState, makeObjectMap, setStateSlice } from "../../utils.js";
import { table_getVisibleLeafColumns } from "../column-visibility/columnVisibilityFeature.utils.js";
import { applyCellSelectionBoundsOperations, expandCellSelectionBounds } from "./cellSelectionGeometry.js";

//#region src/features/cell-selection/cellSelectionFeature.utils.ts
/**
* Creates the default cell selection state.
*
* The feature default is an empty selection. Reset APIs use this value when
* `defaultState` is `true`.
*
* @example
* ```ts
* const selection = getDefaultCellSelectionState()
* ```
*/
function getDefaultCellSelectionState() {
	return [];
}
/**
* Routes a cell selection updater through the table's selection change handler.
*
* @example
* ```ts
* table_setCellSelection(table, (old) => old.slice(0, -1))
* ```
*/
function table_setCellSelection(table, updater) {
	table.options.onCellSelectionChange?.(updater);
}
/**
* Resets `cellSelection` to the configured initial state or feature default.
*
* With no argument, the reset clones `table.initialState.cellSelection` when it
* exists. Passing `true` ignores initial state and resets to an empty selection.
*
* @example
* ```ts
* table_resetCellSelection(table, true)
* ```
*/
function table_resetCellSelection(table, defaultState) {
	setStateSlice(table, "cellSelection", defaultState ? getDefaultCellSelectionState() : cloneState(table.initialState.cellSelection) ?? getDefaultCellSelectionState());
}
/**
* Schedules a cell selection reset after `data` changes.
*
* Ranges are stored as row and column ids, so without this a data swap would
* leave a selection pointing at rows that no longer exist, or silently
* re-select cells whenever new data reuses ids. The reset runs when
* `autoResetAll` or `autoResetCellSelection` allows it, defaulting to on.
*
* Resetting to `initialState.cellSelection` rather than to empty means the
* first row-model computation is a no-op, matching `table_autoResetExpanded`.
*
* @example
* ```ts
* table_autoResetCellSelection(table)
* ```
*/
function table_autoResetCellSelection(table) {
	if (!table.atoms.cellSelection) return;
	if (table.options.autoResetAll ?? table.options.autoResetCellSelection ?? true) table._reactivity.schedule(() => table_resetCellSelection(table));
}
/**
* Returns the visible leaf columns in the order their cells actually render.
*
* This is deliberately not `getVisibleLeafColumns()`, which is
* visibility-filtered but *not* pinning-reordered, and not `column_getIndex()`,
* which indexes that same unpinned list. Cells render start-pinned first, then
* center, then end (see `row_getVisibleCells`), so indexing a selection in the
* unpinned order would make a dragged rectangle contiguous in index space but
* visually scattered the moment a column is pinned.
*
* The pinning read is inlined rather than delegated to the column pinning
* utils so this stays correct when that feature is absent, and so the ordering
* provably matches `row_getVisibleCells`.
*/
function getDisplayOrderedColumns(table) {
	const columns = callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns);
	const pinning = table.atoms.columnPinning?.get();
	if (!pinning || !pinning.start.length && !pinning.end.length) return columns;
	const byId = makeObjectMap();
	for (let i = 0; i < columns.length; i++) byId[columns[i].id] = columns[i];
	const start = [];
	for (let i = 0; i < pinning.start.length; i++) {
		const column = byId[pinning.start[i]];
		if (column) start.push(column);
	}
	const end = [];
	for (let i = 0; i < pinning.end.length; i++) {
		const column = byId[pinning.end[i]];
		if (column) end.push(column);
	}
	const center = [];
	for (let i = 0; i < columns.length; i++) {
		const column = columns[i];
		if (!pinning.start.includes(column.id) && !pinning.end.includes(column.id)) center.push(column);
	}
	return [
		...start,
		...center,
		...end
	];
}
/**
* Builds a column id to render-order index map.
*
* Registered by this feature so the lookup stays memoized even when
* `columnOrderingFeature` is absent, since that feature's `getColumnIndexes`
* static rebuilds all four maps on every call, which would make per-cell reads
* O(columns).
*
* @example
* ```ts
* const index = table_getCellSelectionColumnIndexes(table)[columnId]
* ```
*/
function table_getCellSelectionColumnIndexes(table) {
	const columns = getDisplayOrderedColumns(table);
	const indexes = makeObjectMap();
	for (let i = 0; i < columns.length; i++) indexes[columns[i].id] = i;
	return indexes;
}
const EMPTY_MERGE_BOUNDS = [];
function probeCellSpanIndex(table) {
	return table.getCellSpanIndex?.();
}
/**
* Resolves the merged-cell rectangles of the rendered rows into selection's
* own index space.
*
* The span index positions rows by their paginated render order while
* selection positions them by pre-paginated display order, so each merge is
* mapped through `row.getDisplayIndex()`. A merge whose rows do not map to a
* contiguous display range is skipped defensively; it then behaves like
* unmerged cells instead of corrupting the geometry.
*
* Returns an empty array when `cellSpanningFeature` is not registered, which
* keeps every selection code path identical to the span-unaware behavior.
*
* @example
* ```ts
* const merges = table_getCellSelectionMergeBounds(table)
* ```
*/
function table_getCellSelectionMergeBounds(table) {
	const spanIndex = probeCellSpanIndex(table);
	if (!spanIndex) return EMPTY_MERGE_BOUNDS;
	const columnIndexes = callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes);
	const merges = [];
	for (const columnId in spanIndex.rowSpans) {
		const columnIndex = columnIndexes[columnId];
		if (columnIndex === void 0) continue;
		const spans = spanIndex.rowSpans[columnId];
		const spanColumnIndex = spanIndex.columnIndexes[columnId];
		for (let r = 0; r < spans.length; r++) {
			const span = spans[r];
			if (span <= 1) continue;
			const startRow = spanIndex.rows[r].getDisplayIndex();
			const endRow = spanIndex.rows[r + span - 1].getDisplayIndex();
			if (startRow < 0 || endRow - startRow !== span - 1) continue;
			const colSpan = spanColumnIndex === void 0 ? 1 : Math.max(spanIndex.colSpans[r]?.[spanColumnIndex] ?? 1, 1);
			merges.push({
				minRowIndex: startRow,
				maxRowIndex: endRow,
				minColumnIndex: columnIndex,
				maxColumnIndex: columnIndex + colSpan - 1
			});
		}
	}
	if (spanIndex.colSpans.length) {
		const columnIdBySpanIndex = [];
		for (const columnId in spanIndex.columnIndexes) columnIdBySpanIndex[spanIndex.columnIndexes[columnId]] = columnId;
		for (let r = 0; r < spanIndex.colSpans.length; r++) {
			const rowColSpans = spanIndex.colSpans[r];
			if (!rowColSpans) continue;
			const displayRow = spanIndex.rows[r]?.getDisplayIndex() ?? -1;
			if (displayRow < 0) continue;
			for (let c = 0; c < rowColSpans.length; c++) {
				const span = rowColSpans[c];
				if (span <= 1) continue;
				const columnId = columnIdBySpanIndex[c];
				if (columnId === void 0) continue;
				const vertical = spanIndex.rowSpans[columnId];
				if (vertical && vertical[r] !== 1) continue;
				const columnIndex = columnIndexes[columnId];
				if (columnIndex === void 0) continue;
				merges.push({
					minRowIndex: displayRow,
					maxRowIndex: displayRow,
					minColumnIndex: columnIndex,
					maxColumnIndex: columnIndex + span - 1
				});
			}
		}
	}
	return merges;
}
function findMergeBoundsAt(merges, rowIndex, columnIndex) {
	for (let i = 0; i < merges.length; i++) {
		const merge = merges[i];
		if (rowIndex >= merge.minRowIndex && rowIndex <= merge.maxRowIndex && columnIndex >= merge.minColumnIndex && columnIndex <= merge.maxColumnIndex) return merge;
	}
}
/**
* Resolves a row id to its display-order index, or `-1` when it no longer
* identifies a row in the current order.
*
* Callers must have already called `table.getRowsInDisplayOrder()`, which is
* what populates the display index cache each row reads.
*/
function resolveRowIndex(table, rows, rowId) {
	const row = table.getPrePaginatedRowModel().rowsById[rowId] ?? table.getCoreRowModel().rowsById[rowId];
	if (!row) return -1;
	const index = row.getDisplayIndex();
	if (index < 0 || index >= rows.length || rows[index]?.id !== rowId) return -1;
	return index;
}
/**
* Resolves ordered range operations into disjoint, positive display-order
* index rectangles.
*
* This is the single cache every per-cell read goes through, so index lookups
* happen once per invalidation rather than once per cell. A range whose corners
* no longer resolve, for example because its anchor row was filtered out, is
* omitted rather than clamped, so it contributes nothing while remaining in
* state and returns intact when the filter clears.
*
* @example
* ```ts
* const bounds = table_getCellSelectionBounds(table)
* ```
*/
function table_getCellSelectionBounds(table) {
	const ranges = table.atoms.cellSelection?.get();
	if (!ranges?.length) return [];
	const rows = table.getRowsInDisplayOrder();
	const columnIndexes = callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes);
	const operations = [];
	for (let i = 0; i < ranges.length; i++) {
		const range = ranges[i];
		const anchorRowIndex = resolveRowIndex(table, rows, range.anchorRowId);
		const focusRowIndex = resolveRowIndex(table, rows, range.focusRowId);
		const anchorColumnIndex = columnIndexes[range.anchorColumnId] ?? -1;
		const focusColumnIndex = columnIndexes[range.focusColumnId] ?? -1;
		if (anchorRowIndex < 0 || focusRowIndex < 0 || anchorColumnIndex < 0 || focusColumnIndex < 0) continue;
		operations.push({
			minRowIndex: Math.min(anchorRowIndex, focusRowIndex),
			maxRowIndex: Math.max(anchorRowIndex, focusRowIndex),
			minColumnIndex: Math.min(anchorColumnIndex, focusColumnIndex),
			maxColumnIndex: Math.max(anchorColumnIndex, focusColumnIndex),
			operation: range.operation ?? "include"
		});
	}
	const merges = callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
	if (merges.length) for (let i = 0; i < operations.length; i++) {
		const operation = operations[i];
		const expanded = expandCellSelectionBounds(operation, merges);
		operation.minRowIndex = expanded.minRowIndex;
		operation.maxRowIndex = expanded.maxRowIndex;
		operation.minColumnIndex = expanded.minColumnIndex;
		operation.maxColumnIndex = expanded.maxColumnIndex;
	}
	return applyCellSelectionBoundsOperations(operations);
}
/**
* Tests whether an index pair falls inside any resolved rectangle.
*/
function isWithinBounds(bounds, rowIndex, columnIndex) {
	for (let i = 0; i < bounds.length; i++) {
		const bound = bounds[i];
		if (rowIndex >= bound.minRowIndex && rowIndex <= bound.maxRowIndex && columnIndex >= bound.minColumnIndex && columnIndex <= bound.maxColumnIndex) return true;
	}
	return false;
}
/**
* Checks whether this cell can currently be selected.
*
* A column def opting out with `enableCellSelection: false` wins over the table
* option, matching how the other per-column enable flags resolve.
*
* @example
* ```ts
* const canSelect = cell_getCanSelect(cell)
* ```
*/
function cell_getCanSelect(cell) {
	if (cell.column.columnDef.enableCellSelection === false) return false;
	const enabled = cell.table.options.enableCellSelection;
	if (typeof enabled === "function") return enabled(cell);
	return enabled ?? true;
}
/**
* Resolves a cell to the coordinates every selection read needs.
*
* Shared by `getIsSelected` and `getSelectionEdges` so a render pass resolves
* each cell once. Resolving in both meant every cell paid for the bounds memo,
* the display index, and the column index map twice over.
*
* Returns `null` when the cell cannot participate in a selection at all.
*/
function resolveCellPosition(cell) {
	const table = cell.table;
	const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
	if (!bounds.length) return null;
	if (!callMemoOrStaticFn(cell, "getCanSelect", cell_getCanSelect)) return null;
	const rowIndex = cell.row.getDisplayIndex();
	if (rowIndex < 0) return null;
	const columnIndex = callMemoOrStaticFn(table, "getCellSelectionColumnIndexes", table_getCellSelectionColumnIndexes)[cell.column.id] ?? -1;
	if (columnIndex < 0) return null;
	return {
		bounds,
		rowIndex,
		columnIndex
	};
}
/**
* Checks whether this cell falls inside the final positive selection.
*
* Deliberately not memoized. Registering this through `assignPrototypeAPIs`
* with `memoDeps` would allocate a memo closure and dependency array per cell,
* which costs more than the handful of integer comparisons it would save.
*
* @example
* ```ts
* const isSelected = cell_getIsSelected(cell)
* ```
*/
function cell_getIsSelected(cell) {
	const position = resolveCellPosition(cell);
	if (!position) return false;
	return isWithinBounds(position.bounds, position.rowIndex, position.columnIndex);
}
/**
* Checks whether this cell is the active cell.
*
* @example
* ```ts
* const isFocused = cell_getIsFocused(cell)
* ```
*/
function cell_getIsFocused(cell) {
	const ranges = cell.table.atoms.cellSelection?.get();
	const active = ranges?.[ranges.length - 1];
	if (!active) return false;
	return active.anchorRowId === cell.row.id && active.anchorColumnId === cell.column.id;
}
/**
* Returns `0` for the focused cell and `-1` otherwise, for roving tabindex.
*
* @example
* ```ts
* const tabIndex = cell_getTabIndex(cell)
* ```
*/
function cell_getTabIndex(cell) {
	return callMemoOrStaticFn(cell, "getIsFocused", cell_getIsFocused) ? 0 : -1;
}
/**
* Returns which sides of this cell sit on the outer boundary of the selection.
*
* A side is an edge when the neighbouring cell in that direction is not itself
* covered by a range, which is what lets a consumer draw a single outline
* around an arbitrary union of rectangles.
*
* @example
* ```ts
* const { top, right, bottom, left } = cell_getSelectionEdges(cell)
* ```
*/
function cell_getSelectionEdges(cell) {
	const none = {
		top: false,
		right: false,
		bottom: false,
		left: false
	};
	const position = resolveCellPosition(cell);
	if (!position) return none;
	const { bounds, rowIndex, columnIndex } = position;
	if (!isWithinBounds(bounds, rowIndex, columnIndex)) return none;
	const merges = callMemoOrStaticFn(cell.table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
	const merge = merges.length ? findMergeBoundsAt(merges, rowIndex, columnIndex) : void 0;
	if (!merge) return {
		top: !isWithinBounds(bounds, rowIndex - 1, columnIndex),
		right: !isWithinBounds(bounds, rowIndex, columnIndex + 1),
		bottom: !isWithinBounds(bounds, rowIndex + 1, columnIndex),
		left: !isWithinBounds(bounds, rowIndex, columnIndex - 1)
	};
	return {
		top: isStripOutside(bounds, merge.minRowIndex - 1, merge.minColumnIndex, merge.maxColumnIndex, true),
		right: isStripOutside(bounds, merge.maxColumnIndex + 1, merge.minRowIndex, merge.maxRowIndex, false),
		bottom: isStripOutside(bounds, merge.maxRowIndex + 1, merge.minColumnIndex, merge.maxColumnIndex, true),
		left: isStripOutside(bounds, merge.minColumnIndex - 1, merge.minRowIndex, merge.maxRowIndex, false)
	};
}
function isStripOutside(bounds, fixedIndex, from, to, fixedIsRow) {
	for (let i = from; i <= to; i++) if (!isWithinBounds(bounds, fixedIsRow ? fixedIndex : i, fixedIsRow ? i : fixedIndex)) return true;
	return false;
}
/**
* Returns the active cell, i.e. the anchor of the most recent operation.
*
* Focus is derived rather than stored: in spreadsheet semantics, dragging from
* A1 to C5 leaves the active cell at A1, so the active range's anchor already
* is the active cell.
*
* @example
* ```ts
* const cell = table_getFocusedCell(table)
* ```
*/
function table_getFocusedCell(table) {
	const ranges = table.atoms.cellSelection?.get();
	const active = ranges?.[ranges.length - 1];
	if (!active) return void 0;
	return (table.getPrePaginatedRowModel().rowsById[active.anchorRowId] ?? table.getCoreRowModel().rowsById[active.anchorRowId])?.getAllCellsByColumnId()[active.anchorColumnId];
}
/**
* Collapses the selection to a single cell at the given coordinates.
*
* @example
* ```ts
* table_setFocusedCell(table, '3', 'firstName')
* ```
*/
function table_setFocusedCell(table, rowId, columnId) {
	table_selectCellRange(table, {
		anchorRowId: rowId,
		anchorColumnId: columnId,
		focusRowId: rowId,
		focusColumnId: columnId
	});
}
/**
* Selects a rectangle using replace, include, or exclude semantics.
*
* @example
* ```ts
* table_selectCellRange(table, range, { mode: 'exclude' })
* ```
*/
function table_selectCellRange(table, range, opts) {
	const mode = opts?.mode ?? (opts?.additive ? "include" : "replace");
	const { operation: _operation, ...coordinates } = range;
	const nextRange = mode === "exclude" ? {
		...coordinates,
		operation: "exclude"
	} : coordinates;
	table_setCellSelection(table, (old) => mode === "replace" ? [nextRange] : [...old, nextRange]);
}
/**
* Returns the visible leaf columns that permit selection, in display order.
*
* A column-level opt-out is enough to exclude a column here; a per-cell
* predicate is not consulted, since navigation and select-all work in column
* space rather than cell space.
*/
function getSelectableColumns(table) {
	const columns = getDisplayOrderedColumns(table);
	if (table.options.enableCellSelection === false) return [];
	return columns.filter((column) => column.columnDef.enableCellSelection !== false);
}
/**
* Selects every selectable cell in the table as one range.
*
* @example
* ```ts
* table_selectAllCells(table)
* ```
*/
function table_selectAllCells(table) {
	const rows = table.getRowsInDisplayOrder();
	const columns = getSelectableColumns(table);
	if (!rows.length || !columns.length) return;
	table_selectCellRange(table, {
		anchorRowId: rows[0].id,
		anchorColumnId: columns[0].id,
		focusRowId: rows[rows.length - 1].id,
		focusColumnId: columns[columns.length - 1].id
	});
}
/**
* Resolves a direction into row and column deltas.
*/
function getDirectionDelta(direction) {
	switch (direction) {
		case "up": return {
			rowDelta: -1,
			columnDelta: 0
		};
		case "down": return {
			rowDelta: 1,
			columnDelta: 0
		};
		case "left": return {
			rowDelta: 0,
			columnDelta: -1
		};
		default: return {
			rowDelta: 0,
			columnDelta: 1
		};
	}
}
/**
* Steps one cell in a direction from a starting coordinate.
*
* Columns that cannot be selected are skipped over rather than landed on, so
* arrow navigation never parks on an opted-out column. Returns `null` when the
* step would leave the grid or find no selectable column.
*/
function stepCoordinate(table, rowId, columnId, direction) {
	const rows = table.getRowModel().rows;
	const columns = getDisplayOrderedColumns(table);
	if (!rows.length || !columns.length) return null;
	const { rowDelta, columnDelta } = getDirectionDelta(direction);
	const rowIndex = rows.findIndex((row) => row.id === rowId);
	const columnIndex = columns.findIndex((column) => column.id === columnId);
	if (rowIndex < 0 || columnIndex < 0) return null;
	const merges = callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
	let fromRowIndex = rows[rowIndex].getDisplayIndex();
	let fromColumnIndex = columnIndex;
	if (merges.length) {
		const startMerge = findMergeBoundsAt(merges, rowIndex, columnIndex);
		if (startMerge) {
			if (rowDelta > 0) fromRowIndex = startMerge.maxRowIndex;
			if (rowDelta < 0) fromRowIndex = startMerge.minRowIndex;
			if (columnDelta > 0) fromColumnIndex = startMerge.maxColumnIndex;
			if (columnDelta < 0) fromColumnIndex = startMerge.minColumnIndex;
		}
	}
	let nextRowIndex = rowIndex + rowDelta;
	if (rowDelta && fromRowIndex !== rows[rowIndex].getDisplayIndex()) {
		const edgeRowIndex = rows.findIndex((row) => row.getDisplayIndex() === fromRowIndex);
		if (edgeRowIndex < 0) return null;
		nextRowIndex = edgeRowIndex + rowDelta;
	}
	if (nextRowIndex < 0 || nextRowIndex >= rows.length) return null;
	const selectableColumnIds = new Set(getSelectableColumns(table).map((column) => column.id));
	if (!selectableColumnIds.size) return null;
	let nextColumnIndex = fromColumnIndex;
	if (columnDelta) do
		nextColumnIndex += columnDelta;
	while (nextColumnIndex >= 0 && nextColumnIndex < columns.length && !selectableColumnIds.has(columns[nextColumnIndex].id));
	else if (!selectableColumnIds.has(columnId)) for (let distance = 1; distance < columns.length; distance++) {
		const before = columns[columnIndex - distance];
		const after = columns[columnIndex + distance];
		if (before && selectableColumnIds.has(before.id)) {
			nextColumnIndex = columnIndex - distance;
			break;
		}
		if (after && selectableColumnIds.has(after.id)) {
			nextColumnIndex = columnIndex + distance;
			break;
		}
	}
	if (nextColumnIndex < 0 || nextColumnIndex >= columns.length || !selectableColumnIds.has(columns[nextColumnIndex].id)) return null;
	let landingRowIndex = nextRowIndex;
	let landingColumnIndex = nextColumnIndex;
	if (merges.length) {
		const landingMerge = findMergeBoundsAt(merges, rows[nextRowIndex].getDisplayIndex(), nextColumnIndex);
		if (landingMerge) {
			landingRowIndex = rows.findIndex((row) => row.getDisplayIndex() === landingMerge.minRowIndex);
			if (landingRowIndex < 0) return null;
			landingColumnIndex = landingMerge.minColumnIndex;
		}
	}
	const landingRow = rows[landingRowIndex];
	const landingColumn = columns[landingColumnIndex];
	if (!landingRow || !landingColumn) return null;
	return {
		rowId: landingRow.id,
		columnId: landingColumn.id
	};
}
/**
* Moves the selection one step in a direction, collapsing it to a single cell.
*
* With nothing selected, this selects the first selectable cell so keyboard
* navigation has somewhere to start.
*
* @example
* ```ts
* table_moveCellSelection(table, 'down')
* ```
*/
function table_moveCellSelection(table, direction) {
	const ranges = table.atoms.cellSelection?.get();
	const active = ranges?.[ranges.length - 1];
	if (!active) {
		const rows = table.getRowModel().rows;
		const columns = getSelectableColumns(table);
		if (!rows.length || !columns.length) return;
		table_setFocusedCell(table, rows[0].id, columns[0].id);
		return;
	}
	const next = stepCoordinate(table, active.anchorRowId, active.anchorColumnId, direction);
	if (!next) return;
	table_setFocusedCell(table, next.rowId, next.columnId);
}
/**
* Extends the active range one step in a direction, keeping its anchor fixed.
*
* @example
* ```ts
* table_extendCellSelection(table, 'right')
* ```
*/
function table_extendCellSelection(table, direction) {
	const ranges = table.atoms.cellSelection?.get();
	const active = ranges?.[ranges.length - 1];
	if (!active) {
		table_moveCellSelection(table, direction);
		return;
	}
	const next = stepCoordinate(table, active.focusRowId, active.focusColumnId, direction);
	if (!next) return;
	table_setCellSelection(table, (old) => {
		if (!old.length) return old;
		const nextRanges = old.slice(0, -1);
		nextRanges.push({
			...old[old.length - 1],
			focusRowId: next.rowId,
			focusColumnId: next.columnId
		});
		return nextRanges;
	});
}
/**
* Walks each final positive region, invoking a visitor per selectable cell.
*
* Every expansion API shares this so the per-cell enable predicate is applied
* in exactly one place.
*/
function forEachSelectedCell(table, visit, skipCovered = false) {
	const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
	if (!bounds.length) return;
	const rows = table.getRowsInDisplayOrder();
	const columns = getDisplayOrderedColumns(table);
	for (let i = 0; i < bounds.length; i++) {
		const bound = bounds[i];
		for (let rowIndex = bound.minRowIndex; rowIndex <= bound.maxRowIndex; rowIndex++) {
			const row = rows[rowIndex];
			if (!row) continue;
			const cellsByColumnId = row.getAllCellsByColumnId();
			for (let columnIndex = bound.minColumnIndex; columnIndex <= bound.maxColumnIndex; columnIndex++) {
				const column = columns[columnIndex];
				if (!column) continue;
				const cell = cellsByColumnId[column.id];
				if (!cell) continue;
				if (!callMemoOrStaticFn(cell, "getCanSelect", cell_getCanSelect)) continue;
				if (skipCovered && cell.getIsCovered?.()) continue;
				visit(cell, i, rowIndex - bound.minRowIndex, columnIndex - bound.minColumnIndex);
			}
		}
	}
}
/**
* Returns the ids of all selected cells, in row-major order.
*
* Cells covered by overlapping ranges are returned once, at their first
* occurrence.
*
* @example
* ```ts
* const ids = table_getSelectedCellIds(table)
* ```
*/
function table_getSelectedCellIds(table) {
	const ids = [];
	const seen = /* @__PURE__ */ new Set();
	forEachSelectedCell(table, (cell) => {
		if (seen.has(cell.id)) return;
		seen.add(cell.id);
		ids.push(cell.id);
	}, true);
	return ids;
}
/**
* Returns each final positive region's values as a row-major grid.
*
* This is the raw material for clipboard export. Serializing it to text is left
* to userland, since the delimiter, the null representation, and whether values
* containing delimiters get quoted are all application decisions.
*
* @example
* ```ts
* const [firstRange] = table_getSelectedCellRangesData(table)
* ```
*/
function table_getSelectedCellRangesData(table) {
	const grids = [];
	forEachSelectedCell(table, (cell, rangeIndex, rowOffset) => {
		const grid = grids[rangeIndex] ??= [];
		(grid[rowOffset] ??= []).push(cell.getValue());
	});
	return grids;
}
/**
* Returns the number of selected cells.
*
* Uses rectangle arithmetic over the normalized, disjoint positive regions.
* A per-cell `enableCellSelection` predicate requires enumeration.
*
* @example
* ```ts
* const count = table_getSelectedCellCount(table)
* ```
*/
function table_getSelectedCellCount(table) {
	if (table.options.enableCellSelection === false) return 0;
	const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
	if (!bounds.length) return 0;
	const merges = callMemoOrStaticFn(table, "getCellSelectionMergeBounds", table_getCellSelectionMergeBounds);
	if (typeof table.options.enableCellSelection === "function" || merges.length) {
		const ids = /* @__PURE__ */ new Set();
		forEachSelectedCell(table, (cell) => ids.add(cell.id), true);
		return ids.size;
	}
	const columns = getDisplayOrderedColumns(table);
	let count = 0;
	for (const bound of bounds) {
		let selectableColumns = 0;
		for (let columnIndex = bound.minColumnIndex; columnIndex <= bound.maxColumnIndex; columnIndex++) {
			const column = columns[columnIndex];
			if (!column) continue;
			if (column.columnDef.enableCellSelection !== false) selectableColumns++;
		}
		count += (bound.maxRowIndex - bound.minRowIndex + 1) * selectableColumns;
	}
	return count;
}
/**
* Returns the ids of all rows intersected by the selection.
*
* @example
* ```ts
* const rowIds = table_getCellSelectionRowIds(table)
* ```
*/
function table_getCellSelectionRowIds(table) {
	const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
	if (!bounds.length) return [];
	const rows = table.getRowsInDisplayOrder();
	const seen = /* @__PURE__ */ new Set();
	const ids = [];
	for (let i = 0; i < bounds.length; i++) {
		const bound = bounds[i];
		for (let index = bound.minRowIndex; index <= bound.maxRowIndex; index++) {
			const row = rows[index];
			if (!row || seen.has(row.id)) continue;
			seen.add(row.id);
			ids.push(row.id);
		}
	}
	return ids;
}
/**
* Returns the ids of all columns intersected by the selection.
*
* @example
* ```ts
* const columnIds = table_getCellSelectionColumnIds(table)
* ```
*/
function table_getCellSelectionColumnIds(table) {
	const bounds = callMemoOrStaticFn(table, "getCellSelectionBounds", table_getCellSelectionBounds);
	if (!bounds.length) return [];
	const columns = getDisplayOrderedColumns(table);
	const seen = /* @__PURE__ */ new Set();
	const ids = [];
	for (let i = 0; i < bounds.length; i++) {
		const bound = bounds[i];
		for (let index = bound.minColumnIndex; index <= bound.maxColumnIndex; index++) {
			const column = columns[index];
			if (!column || seen.has(column.id)) continue;
			if (column.columnDef.enableCellSelection === false) continue;
			seen.add(column.id);
			ids.push(column.id);
		}
	}
	return ids;
}
/**
* Creates a handler that begins a selection at this cell.
*
* Follows `header_getResizeHandler`: the enable check is resolved once outside
* the returned closure and guarded again inside it, the document is injectable
* for SSR and cross-document rendering, and the document-level `mouseup`
* listener is attached here so a drag released outside the table still ends.
*
* @example
* ```tsx
* <td onMouseDown={cell.getSelectionStartHandler()} />
* ```
*/
function cell_getSelectionStartHandler(cell, _contextDocument) {
	const canSelect = cell_getCanSelect(cell);
	return (e) => {
		if (!canSelect) return;
		const table = cell.table;
		const options = table.options;
		const contextDocument = _contextDocument ?? (typeof document !== "undefined" ? document : null);
		const isRangeEvent = options.enableCellRangeSelection !== false && (options.isCellRangeSelectionEvent?.(e) ?? false);
		const isMultiRangeEvent = options.enableMultiCellRangeSelection !== false && (options.isMultiCellRangeSelectionEvent?.(e) ?? false);
		if (options.enableCellSelectionDrag !== false && options.enableCellRangeSelection !== false && contextDocument) {
			table._isSelectingCells = true;
			const upHandler = () => {
				contextDocument.removeEventListener("mouseup", upHandler);
				table._isSelectingCells = false;
			};
			contextDocument.addEventListener("mouseup", upHandler);
		}
		const rowId = cell.row.id;
		const columnId = cell.column.id;
		const shouldExclude = isMultiRangeEvent && callMemoOrStaticFn(cell, "getIsSelected", cell_getIsSelected);
		table_setCellSelection(table, (old) => {
			const active = old[old.length - 1];
			if (isRangeEvent && active) {
				const ranges = old.slice(0, -1);
				ranges.push({
					...active,
					focusRowId: rowId,
					focusColumnId: columnId
				});
				return ranges;
			}
			const range = {
				anchorRowId: rowId,
				anchorColumnId: columnId,
				focusRowId: rowId,
				focusColumnId: columnId,
				...shouldExclude ? { operation: "exclude" } : {}
			};
			return isMultiRangeEvent ? [...old, range] : [range];
		});
	};
}
/**
* Creates a handler that extends the active range to this cell during a drag.
*
* No rAF coalescing is needed here, unlike the resize handler: `mouseenter`
* fires once per cell boundary crossed rather than continuously, and deferring
* it by a frame would only delay the highlight.
*
* @example
* ```tsx
* <td onMouseEnter={cell.getSelectionExtendHandler()} />
* ```
*/
function cell_getSelectionExtendHandler(cell) {
	const canSelect = cell_getCanSelect(cell);
	return (_e) => {
		if (!canSelect) return;
		const table = cell.table;
		if (!table._isSelectingCells) return;
		const ranges = table.atoms.cellSelection?.get();
		const active = ranges?.[ranges.length - 1];
		if (!active) return;
		const rowId = cell.row.id;
		const columnId = cell.column.id;
		if (active.focusRowId === rowId && active.focusColumnId === columnId) return;
		table_setCellSelection(table, (old) => {
			if (!old.length) return old;
			const next = old.slice(0, -1);
			next.push({
				...old[old.length - 1],
				focusRowId: rowId,
				focusColumnId: columnId
			});
			return next;
		});
	};
}

//#endregion
export { cell_getCanSelect, cell_getIsFocused, cell_getIsSelected, cell_getSelectionEdges, cell_getSelectionExtendHandler, cell_getSelectionStartHandler, cell_getTabIndex, getDefaultCellSelectionState, table_autoResetCellSelection, table_extendCellSelection, table_getCellSelectionBounds, table_getCellSelectionColumnIds, table_getCellSelectionColumnIndexes, table_getCellSelectionMergeBounds, table_getCellSelectionRowIds, table_getFocusedCell, table_getSelectedCellCount, table_getSelectedCellIds, table_getSelectedCellRangesData, table_moveCellSelection, table_resetCellSelection, table_selectAllCells, table_selectCellRange, table_setCellSelection, table_setFocusedCell };