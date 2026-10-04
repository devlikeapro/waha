import { callMemoOrStaticFn, cloneState, copyInstancePropertiesWithoutMemos, hasOwn, makeObjectMap } from "../../utils.js";

//#region src/features/row-selection/rowSelectionFeature.utils.ts
/**
* Creates the default row selection state.
*
* The feature default is an empty map, meaning no rows are selected. Reset APIs
* use this value when `defaultState` is `true`.
*
* @example
* ```ts
* const selection = getDefaultRowSelectionState()
* ```
*/
function getDefaultRowSelectionState() {
	return makeObjectMap();
}
/**
* Routes a row selection updater through the table's selection change handler.
*
* The updater may be a next selection map or a function of the previous map,
* matching the instance `table.setRowSelection` behavior.
*
* @example
* ```ts
* table_setRowSelection(table, (old) => ({ ...old, [rowId]: true }))
* ```
*/
function table_setRowSelection(table, updater) {
	table.options.onRowSelectionChange?.(updater);
}
/**
* Resets `rowSelection` to the configured initial state or feature default.
*
* With no argument, the reset clones `table.initialState.rowSelection` when it
* exists. Passing `true` ignores initial state and resets to `{}`.
*
* @example
* ```ts
* table_resetRowSelection(table)
* table_resetRowSelection(table, true)
* ```
*/
function table_resetRowSelection(table, defaultState) {
	table._lastSelectedRowId = null;
	table_setRowSelection(table, defaultState ? makeObjectMap() : Object.assign(makeObjectMap(), cloneState(table.initialState.rowSelection ?? {})));
}
/**
* Selects or deselects every selectable row before grouping.
*
* Omitting `value` toggles based on `table_getIsAllRowsSelected(table)`.
* Selecting skips sub-rows whose ancestors block descent via
* `enableSubRowSelection`. Deselecting removes matching selectable ids from the
* existing selection map; rows that cannot be selected keep their selection
* unless `opts.deselectAll` is `true`.
*
* @example
* ```ts
* table_toggleAllRowsSelected(table)
* ```
*/
function table_toggleAllRowsSelected(table, value, opts) {
	table._lastSelectedRowId = null;
	table_setRowSelection(table, (old) => {
		value = typeof value !== "undefined" ? value : !callMemoOrStaticFn(table, "getIsAllRowsSelected", table_getIsAllRowsSelected);
		if (opts?.deselectAll && !value) return makeObjectMap();
		const rowSelection = Object.assign(makeObjectMap(), old);
		const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows;
		if (value) {
			const subtreeCache = /* @__PURE__ */ new Map();
			preGroupedFlatRows.forEach((row) => {
				if (isRowSelectableInSelectAll(row, subtreeCache)) rowSelection[row.id] = true;
			});
		} else preGroupedFlatRows.forEach((row) => {
			if (row_getCanSelect(row)) delete rowSelection[row.id];
		});
		return rowSelection;
	});
}
/**
* Selects or deselects every selectable row on the current page.
*
* Omitting `value` toggles based on `table_getIsAllPageRowsSelected(table)`.
* Child rows are included when sub-row selection allows it.
*
* @example
* ```ts
* table_toggleAllPageRowsSelected(table)
* ```
*/
function table_toggleAllPageRowsSelected(table, value, opts) {
	table._lastSelectedRowId = null;
	table_setRowSelection(table, (old) => {
		const resolvedValue = typeof value !== "undefined" ? value : !callMemoOrStaticFn(table, "getIsAllPageRowsSelected", table_getIsAllPageRowsSelected);
		if (opts?.deselectAll && !resolvedValue) return makeObjectMap();
		const rowSelection = Object.assign(makeObjectMap(), old);
		table.getRowModel().rows.forEach((row) => {
			mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table, true);
		});
		return rowSelection;
	});
}
/**
* Reads the row model before row selection is projected into selected rows.
*
* Selection does not alter the base row pipeline, so this returns the core row
* model.
*
* @example
* ```ts
* const rowsBeforeSelection = table_getPreSelectedRowModel(table)
* ```
*/
function table_getPreSelectedRowModel(table) {
	return table.getCoreRowModel();
}
/**
* Builds a row model containing selected rows from the core row model.
*
* If no row ids are selected, an empty row model is returned without walking
* the rows.
*
* @example
* ```ts
* const selectedRows = table_getSelectedRowModel(table)
* ```
*/
function table_getSelectedRowModel(table) {
	const rowModel = table.getCoreRowModel();
	if (!callMemoOrStaticFn(table, "getIsSomeRowsSelected", table_getIsSomeRowsSelected)) return {
		rows: [],
		flatRows: [],
		rowsById: makeObjectMap()
	};
	return selectRowsFn(rowModel, table);
}
/**
* Builds a row model containing selected rows from the filtered row model.
*
* If no row ids are selected, an empty row model is returned without walking
* the rows.
*
* @example
* ```ts
* const selectedRows = table_getFilteredSelectedRowModel(table)
* ```
*/
function table_getFilteredSelectedRowModel(table) {
	const rowModel = table.getFilteredRowModel();
	if (!callMemoOrStaticFn(table, "getIsSomeRowsSelected", table_getIsSomeRowsSelected)) return {
		rows: [],
		flatRows: [],
		rowsById: makeObjectMap()
	};
	return selectRowsFn(rowModel, table);
}
/**
* Builds a row model containing selected rows from the grouped row model.
*
* If no row ids are selected, an empty row model is returned without walking
* the rows.
*
* @example
* ```ts
* const selectedRows = table_getGroupedSelectedRowModel(table)
* ```
*/
function table_getGroupedSelectedRowModel(table) {
	const rowModel = table.getSortedRowModel();
	if (!callMemoOrStaticFn(table, "getIsSomeRowsSelected", table_getIsSomeRowsSelected)) return {
		rows: [],
		flatRows: [],
		rowsById: makeObjectMap()
	};
	return selectRowsFn(rowModel, table);
}
/**
* Returns the ids of all selected rows.
*
* @example
* ```ts
* const selectedRowIds = table_getSelectedRowIds(table)
* ```
*/
function table_getSelectedRowIds(table) {
	return Object.keys(table.atoms.rowSelection?.get() ?? {});
}
/**
* Checks whether every selectable filtered row is selected.
*
* The result is false when there are no filtered rows or when selection state is
* empty. Sub-rows whose ancestors block descent via `enableSubRowSelection` are
* ignored, matching the rows that `table_toggleAllRowsSelected` selects.
*
* @example
* ```ts
* const allSelected = table_getIsAllRowsSelected(table)
* ```
*/
function table_getIsAllRowsSelected(table) {
	const preGroupedFlatRows = table.getFilteredRowModel().flatRows;
	const rowSelection = table.atoms.rowSelection?.get() ?? {};
	let isAllRowsSelected = Boolean(preGroupedFlatRows.length && Object.keys(rowSelection).length);
	if (isAllRowsSelected) {
		const subtreeCache = /* @__PURE__ */ new Map();
		if (preGroupedFlatRows.some((row) => !isRowSelected(row, rowSelection) && isRowSelectableInSelectAll(row, subtreeCache))) isAllRowsSelected = false;
	}
	return isAllRowsSelected;
}
/**
* Checks whether every selectable row on the current page is selected.
*
* Non-selectable rows are ignored for this calculation, as are sub-rows whose
* ancestors block descent via `enableSubRowSelection`.
*
* @example
* ```ts
* const allPageRowsSelected = table_getIsAllPageRowsSelected(table)
* ```
*/
function table_getIsAllPageRowsSelected(table) {
	const paginationFlatRows = table.getPaginatedRowModel().flatRows;
	const rowSelection = table.atoms.rowSelection?.get() ?? {};
	const subtreeCache = /* @__PURE__ */ new Map();
	let sawSelectableRow = false;
	for (let i = 0; i < paginationFlatRows.length; i++) {
		const row = paginationFlatRows[i];
		if (!isRowSelected(row, rowSelection)) {
			if (isRowSelectableInSelectAll(row, subtreeCache)) return false;
		} else if (!sawSelectableRow && isRowSelectableInSelectAll(row, subtreeCache)) sawSelectableRow = true;
	}
	return sawSelectableRow;
}
/**
* Checks whether at least one row id is selected.
*
* The result stays true when every row is selected.
*
* @example
* ```ts
* const someRowsSelected = table_getIsSomeRowsSelected(table)
* ```
*/
function table_getIsSomeRowsSelected(table) {
	return callMemoOrStaticFn(table, "getSelectedRowIds", table_getSelectedRowIds).length > 0;
}
/**
* Checks whether at least one selectable row on the current page is selected.
*
* @example
* ```ts
* const somePageRowsSelected = table_getIsSomePageRowsSelected(table)
* ```
*/
function table_getIsSomePageRowsSelected(table) {
	return table.getPaginatedRowModel().flatRows.filter((row) => row_getCanSelect(row)).some((row) => row_getIsSelected(row) || callMemoOrStaticFn(row, "getIsSomeSelected", row_getIsSomeSelected));
}
/**
* Creates a checkbox-style handler that selects or deselects all rows.
*
* The handler reads `event.target.checked`, so it is intended for controls whose
* checked state means "all rows selected".
*
* @example
* ```ts
* const onChange = table_getToggleAllRowsSelectedHandler(table)
* ```
*/
function table_getToggleAllRowsSelectedHandler(table) {
	return (e) => {
		table_toggleAllRowsSelected(table, e.target.checked);
	};
}
/**
* Creates a checkbox-style handler that selects or deselects current page rows.
*
* The handler reads `event.target.checked`, so it is intended for controls whose
* checked state means "all page rows selected".
*
* @example
* ```ts
* const onChange = table_getToggleAllPageRowsSelectedHandler(table)
* ```
*/
function table_getToggleAllPageRowsSelectedHandler(table) {
	return (e) => {
		table_toggleAllPageRowsSelected(table, e.target.checked);
	};
}
/**
* Selects or deselects this row.
*
* Omitting `value` toggles the row. Child rows are selected recursively unless
* `opts.selectChildren` is `false`, sub-row selection is disabled, or the row
* only supports single selection. Pass `deselectParents: true` to also remove
* ancestor row ids from the selection when this row is deselected.
*
* @example
* ```ts
* row_toggleSelected(row)
* row_toggleSelected(row, true)
* row_toggleSelected(row, false)
* row_toggleSelected(row, true, { selectChildren: false })
* row_toggleSelected(row, false, { deselectParents: true })
* ```
*/
function row_toggleSelected(row, value, opts) {
	const isSelected = row_getIsSelected(row);
	table_setRowSelection(row.table, (old) => {
		value = typeof value !== "undefined" ? value : !isSelected;
		const rowSelection = Object.assign(makeObjectMap(), old);
		mutateRowIsSelected(rowSelection, row.id, value, (opts?.selectChildren ?? true) && row_getCanMultiSelect(row), row.table);
		if (!value && opts?.deselectParents) pruneAncestorRowIds(rowSelection, row);
		return rowSelection;
	});
}
/**
* Checks whether this row id is selected in `state.rowSelection`.
*
* Missing row ids are treated as not selected.
*
* @example
* ```ts
* const selected = row_getIsSelected(row)
* ```
*/
function row_getIsSelected(row) {
	return isRowSelected(row, row.table.atoms.rowSelection?.get() ?? {});
}
/**
* Checks whether some, but not all, selectable descendants are selected.
*
* This supports indeterminate selection UI for parent rows.
*
* @example
* ```ts
* const partial = row_getIsSomeSelected(row)
* ```
*/
function row_getIsSomeSelected(row) {
	return isSubRowSelected(row) === "some";
}
/**
* Checks whether all selectable descendants are selected.
*
* Rows without selectable descendants return false.
*
* @example
* ```ts
* const allChildrenSelected = row_getIsAllSubRowsSelected(row)
* ```
*/
function row_getIsAllSubRowsSelected(row) {
	return isSubRowSelected(row) === "all";
}
/**
* Checks whether this row can be selected.
*
* `options.enableRowSelection` may be a boolean or a row predicate; it defaults
* to `true`.
*
* @example
* ```ts
* const canSelect = row_getCanSelect(row)
* ```
*/
function row_getCanSelect(row) {
	const options = row.table.options;
	if (typeof options.enableRowSelection === "function") return options.enableRowSelection(row);
	return options.enableRowSelection ?? true;
}
/**
* Checks whether selecting this row should also select its subRows.
*
* `options.enableSubRowSelection` may be a boolean or a row predicate; it
* defaults to `true`.
*
* @example
* ```ts
* const canSelectChildren = row_getCanSelectSubRows(row)
* ```
*/
function row_getCanSelectSubRows(row) {
	const options = row.table.options;
	if (typeof options.enableSubRowSelection === "function") return options.enableSubRowSelection(row);
	return options.enableSubRowSelection ?? true;
}
/**
* Checks whether this row can be selected alongside other rows.
*
* `options.enableMultiRowSelection` may be a boolean or a row predicate; it
* defaults to `true`.
*
* @example
* ```ts
* const canMultiSelect = row_getCanMultiSelect(row)
* ```
*/
function row_getCanMultiSelect(row) {
	const options = row.table.options;
	if (typeof options.enableMultiRowSelection === "function") return options.enableMultiRowSelection(row);
	return options.enableMultiRowSelection ?? true;
}
/**
* Creates a checkbox-style handler that selects or deselects this row.
*
* The handler is a no-op when the row cannot be selected and reads
* `event.target.checked`. Shift events select or deselect the inclusive range
* from the most recent selectable row handled by this table. Pass
* `selectChildren: false` to limit changes to rows explicitly present in the
* display-order interval, and `deselectParents: true` to remove ancestor row
* ids from the selection when rows are deselected.
*
* @example
* ```ts
* const onChange = row_getToggleSelectedHandler(row)
* ```
*/
function row_getToggleSelectedHandler(row, opts) {
	const canSelect = row_getCanSelect(row);
	return (e) => {
		if (!canSelect) return;
		const event = e;
		const table = row.table;
		const checked = event.target.checked;
		const anchorId = table._lastSelectedRowId;
		if (!(table.options.enableRowRangeSelection !== false && anchorId !== null && row_getCanMultiSelect(row) && (table.options.isRowRangeSelectionEvent?.(e) ?? false)) || !selectRowRange(row, anchorId, checked, opts)) row_toggleSelected(row, checked, opts);
		table._lastSelectedRowId = row.id;
	};
}
/**
* Resolves and mutates an inclusive interval in the table's latest logical
* display order.
*
* The anchor is resolved without throwing from the pre-pagination row model,
* then the core row model. Both endpoint display indexes must still identify
* those rows in the current order and both endpoints must support
* multi-selection. Eligible interval rows are applied through one row
* selection updater; non-selectable and non-multi-selectable rows are skipped.
* Returns `false` when the interaction should fall back to an ordinary toggle.
*/
function selectRowRange(row, anchorId, value, opts) {
	const includeChildren = opts?.selectChildren ?? true;
	const table = row.table;
	const rows = table.getRowsInDisplayOrder();
	const anchorRow = table.getPrePaginatedRowModel().rowsById[anchorId] ?? table.getCoreRowModel().rowsById[anchorId];
	if (!anchorRow) return false;
	const anchorIndex = anchorRow.getDisplayIndex();
	const rowIndex = row.getDisplayIndex();
	const anchorAtIndex = rows[anchorIndex];
	const rowAtIndex = rows[rowIndex];
	if (anchorIndex < 0 || rowIndex < 0 || anchorIndex >= rows.length || rowIndex >= rows.length || anchorAtIndex?.id !== anchorRow.id || rowAtIndex?.id !== row.id || !row_getCanMultiSelect(anchorRow) || !row_getCanMultiSelect(row)) return false;
	const start = Math.min(anchorIndex, rowIndex);
	const end = Math.max(anchorIndex, rowIndex);
	table_setRowSelection(table, (old) => {
		const rowSelection = Object.assign(makeObjectMap(), old);
		for (let index = start; index <= end; index++) {
			const rangeRow = rows[index];
			if (!row_getCanSelect(rangeRow) || !row_getCanMultiSelect(rangeRow)) continue;
			mutateRowIsSelected(rowSelection, rangeRow.id, value, includeChildren, table);
			if (!value && opts?.deselectParents) pruneAncestorRowIds(rowSelection, rangeRow);
		}
		return rowSelection;
	});
	return true;
}
function mutateRowIsSelected(rowSelection, rowId, value, includeChildren, table, respectCanSelectOnDeselect) {
	const row = table.getRow(rowId, true);
	if (value) {
		if (!row_getCanMultiSelect(row)) Object.keys(rowSelection).forEach((key) => delete rowSelection[key]);
		if (row_getCanSelect(row)) rowSelection[rowId] = true;
	} else if (!respectCanSelectOnDeselect || row_getCanSelect(row)) delete rowSelection[rowId];
	if (includeChildren && row.subRows.length && row_getCanSelectSubRows(row)) row.subRows.forEach((r) => mutateRowIsSelected(rowSelection, r.id, value, includeChildren, table, respectCanSelectOnDeselect));
}
/**
* Returns whether a select-all cascade can reach this row: the row itself is
* selectable and no ancestor blocks descent via `enableSubRowSelection`.
*
* `subtreeCache` memoizes the per-ancestor verdict for one select-all pass, so
* ancestor chains shared by sibling rows are only walked (and the
* `enableSubRowSelection` predicate only invoked) once per unique ancestor.
*/
function isRowSelectableInSelectAll(row, subtreeCache) {
	if (!row_getCanSelect(row)) return false;
	const table = row.table;
	if (table.options.enableSubRowSelection === true) return true;
	const parentId = row.parentId;
	if (parentId === void 0) return true;
	const cached = subtreeCache.get(parentId);
	if (cached !== void 0) return cached;
	const rowsById = table.getCoreRowModel().rowsById;
	const visited = [];
	let selectable = true;
	let currentId = parentId;
	while (currentId !== void 0) {
		const known = subtreeCache.get(currentId);
		if (known !== void 0) {
			selectable = known;
			break;
		}
		visited.push(currentId);
		const parent = rowsById[currentId] ?? table.getRow(currentId, true);
		if (!row_getCanSelectSubRows(parent)) {
			selectable = false;
			break;
		}
		currentId = parent.parentId;
	}
	visited.forEach((id) => subtreeCache.set(id, selectable));
	return selectable;
}
function pruneAncestorRowIds(rowSelection, row) {
	const rowsById = row.table.getCoreRowModel().rowsById;
	let parentId = row.parentId;
	while (parentId !== void 0) {
		delete rowSelection[parentId];
		parentId = (rowsById[parentId] ?? row.table.getRow(parentId, true)).parentId;
	}
}
function selectRowsRecursively(rows, rowSelection, selectedFlatRows, selectedRowsById) {
	const result = [];
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		const isSelected = isRowSelected(row, rowSelection);
		if (isSelected) {
			selectedFlatRows.push(row);
			selectedRowsById[row.id] = row;
		}
		if (row.subRows.length) {
			const newSubRows = selectRowsRecursively(row.subRows, rowSelection, selectedFlatRows, selectedRowsById);
			if (isSelected) {
				const cloned = Object.create(Object.getPrototypeOf(row));
				copyInstancePropertiesWithoutMemos(cloned, row);
				cloned.subRows = newSubRows;
				result.push(cloned);
			}
		} else if (isSelected) result.push(row);
	}
	return result;
}
/**
* Builds a row model containing rows selected by the current row selection state.
*
* The result is derived from the supplied row model, so selected ids absent from
* that model are not materialized as rows.
*
* @example
* ```ts
* const selectedRows = selectRowsFn(rowModel)
* ```
*/
function selectRowsFn(rowModel, table) {
	const newSelectedFlatRows = [];
	const newSelectedRowsById = makeObjectMap();
	const rowSelection = table.atoms.rowSelection?.get() ?? {};
	return {
		rows: selectRowsRecursively(rowModel.rows, rowSelection, newSelectedFlatRows, newSelectedRowsById),
		flatRows: newSelectedFlatRows,
		rowsById: newSelectedRowsById
	};
}
/**
* Returns whether a row id is selected in the current row selection state.
*
* @example
* ```ts
* const selected = isRowSelected(row)
* ```
*/
function isRowSelected(row, rowSelection) {
	return !!(hasOwn(rowSelection, row.id) && rowSelection[row.id]);
}
/**
* Returns whether all, some, or none of a row's selectable descendants are selected.
*
* The result is used to drive indeterminate row selection UI.
*
* @example
* ```ts
* const selectedState = isSubRowSelected(row)
* ```
*/
function isSubRowSelected(row) {
	if (!row.subRows.length) return false;
	const rowSelection = row.table.atoms.rowSelection?.get() ?? {};
	let someSelected = false;
	let allChildrenSelected = true;
	let someSelectable = false;
	for (let i = 0; i < row.subRows.length; i++) {
		const subRow = row.subRows[i];
		if (someSelected && !allChildrenSelected) break;
		if (row_getCanSelect(subRow)) {
			someSelectable = true;
			if (isRowSelected(subRow, rowSelection)) someSelected = true;
			else allChildrenSelected = false;
		}
		if (subRow.subRows.length) {
			const subRowChildrenSelected = isSubRowSelected(subRow);
			if (subRowChildrenSelected === "all") {
				someSelected = true;
				someSelectable = true;
			} else if (subRowChildrenSelected === "some") {
				someSelected = true;
				allChildrenSelected = false;
				someSelectable = true;
			} else allChildrenSelected = false;
		}
	}
	if (!someSelectable) return false;
	return allChildrenSelected ? "all" : someSelected ? "some" : false;
}

//#endregion
export { getDefaultRowSelectionState, isRowSelected, isSubRowSelected, row_getCanMultiSelect, row_getCanSelect, row_getCanSelectSubRows, row_getIsAllSubRowsSelected, row_getIsSelected, row_getIsSomeSelected, row_getToggleSelectedHandler, row_toggleSelected, selectRowsFn, table_getFilteredSelectedRowModel, table_getGroupedSelectedRowModel, table_getIsAllPageRowsSelected, table_getIsAllRowsSelected, table_getIsSomePageRowsSelected, table_getIsSomeRowsSelected, table_getPreSelectedRowModel, table_getSelectedRowIds, table_getSelectedRowModel, table_getToggleAllPageRowsSelectedHandler, table_getToggleAllRowsSelectedHandler, table_resetRowSelection, table_setRowSelection, table_toggleAllPageRowsSelected, table_toggleAllRowsSelected };