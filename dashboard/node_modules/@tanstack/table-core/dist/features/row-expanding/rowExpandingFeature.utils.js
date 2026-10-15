import { cloneState, hasOwn, makeObjectMap, setStateSlice } from "../../utils.js";

//#region src/features/row-expanding/rowExpandingFeature.utils.ts
/**
* Creates the default expanded state.
*
* The feature default is an empty map, meaning no rows are expanded. Reset APIs
* use this value when `defaultState` is `true`.
*
* @example
* ```ts
* const expanded = getDefaultExpandedState()
* ```
*/
function getDefaultExpandedState() {
	return makeObjectMap();
}
/**
* Schedules an expanded-state reset after row-structure changes.
*
* The reset runs when `autoResetAll`, `autoResetExpanded`, or the default
* client-side expanding behavior allows it. Manual expanding opts out unless
* the reset options explicitly opt back in.
*
* @example
* ```ts
* table_autoResetExpanded(table)
* ```
*/
function table_autoResetExpanded(table) {
	if (!table.atoms.expanded) return;
	if (table.options.autoResetAll ?? table.options.autoResetExpanded ?? !table.options.manualExpanding) table._reactivity.schedule(() => table_resetExpanded(table));
}
/**
* Routes an expanded-state updater through the table's expanded change handler.
*
* The updater may be `true`, a row-id map, or a function of the previous
* expanded state, matching the instance `table.setExpanded` behavior.
*
* @example
* ```ts
* table_setExpanded(table, (old) => ({ ...old, [rowId]: true }))
* ```
*/
function table_setExpanded(table, updater) {
	table.options.onExpandedChange?.(updater);
}
/**
* Expands or collapses every row.
*
* Passing `true` stores the special expanded-all state. Passing `false` stores
* an empty map. Omitting the value toggles based on whether all rows are
* currently expanded.
*
* The call is a no-op (no `onExpandedChange`) when no row can expand or when
* the requested state matches the current state exactly.
*
* @example
* ```ts
* table_toggleAllRowsExpanded(table)
* ```
*/
function table_toggleAllRowsExpanded(table, expanded) {
	const currentExpanded = table.atoms.expanded?.get() ?? {};
	if (expanded ?? !table_getIsAllRowsExpanded(table)) {
		if (currentExpanded === true) return;
		if (!table_getCanSomeRowsExpand(table)) return;
		table_setExpanded(table, true);
	} else {
		if (currentExpanded !== true && !Object.keys(currentExpanded).length) return;
		table_setExpanded(table, makeObjectMap());
	}
}
/**
* Resets `expanded` to the configured initial state or feature default.
*
* With no argument, the reset clones `table.initialState.expanded` when it
* exists. Passing `true` ignores initial state and resets to `{}`.
*
* @example
* ```ts
* table_resetExpanded(table)
* table_resetExpanded(table, true)
* ```
*/
function table_resetExpanded(table, defaultState) {
	const initialExpanded = table.initialState.expanded;
	setStateSlice(table, "expanded", defaultState ? makeObjectMap() : initialExpanded === true ? true : Object.assign(makeObjectMap(), cloneState(initialExpanded ?? {})));
}
/**
* Checks whether at least one pre-paginated row can expand.
*
* Pagination is intentionally ignored so controls can reflect expandable rows
* that may not be on the current page.
*
* @example
* ```ts
* const canExpand = table_getCanSomeRowsExpand(table)
* ```
*/
function table_getCanSomeRowsExpand(table) {
	return table.getPrePaginatedRowModel().flatRows.some((row) => row_getCanExpand(row));
}
/**
* Creates an event handler that toggles all rows expanded.
*
* @example
* ```ts
* const onClick = table_getToggleAllRowsExpandedHandler(table)
* ```
*/
function table_getToggleAllRowsExpandedHandler(table) {
	return (_e) => {
		table_toggleAllRowsExpanded(table);
	};
}
/**
* Checks whether any row is expanded.
*
* The special expanded-all value `true` counts as some rows expanded.
*
* @example
* ```ts
* const someExpanded = table_getIsSomeRowsExpanded(table)
* ```
*/
function table_getIsSomeRowsExpanded(table) {
	const expanded = table.atoms.expanded?.get() ?? {};
	return expanded === true || Object.values(expanded).some(Boolean);
}
/**
* Checks whether every expandable row in the current row model is expanded.
*
* The special expanded-all value `true` returns true immediately. Empty
* expanded state returns false. Rows that cannot expand are ignored, so a
* materialized expanded-all map (which only contains expandable row ids)
* still counts as all rows expanded.
*
* @example
* ```ts
* const allExpanded = table_getIsAllRowsExpanded(table)
* ```
*/
function table_getIsAllRowsExpanded(table) {
	const expanded = table.atoms.expanded?.get() ?? {};
	if (expanded === true) return true;
	if (!Object.keys(expanded).length) return false;
	const expandableRows = table.getRowModel().flatRows.filter((row) => row_getCanExpand(row));
	if (!expandableRows.length) return false;
	if (expandableRows.some((row) => !row_getIsExpanded(row))) return false;
	return true;
}
/**
* Computes the deepest expanded row id depth.
*
* Row ids are split on `.`; expanded-all state scans the current row model's
* expandable rows, while explicit expanded state scans its expanded id keys.
*
* @example
* ```ts
* const depth = table_getExpandedDepth(table)
* ```
*/
function table_getExpandedDepth(table) {
	let maxDepth = 0;
	const expanded = table.atoms.expanded?.get();
	(expanded === true ? Object.values(table.getRowModel().rowsById).filter((row) => row_getCanExpand(row)).map((row) => row.id) : Object.keys(expanded ?? {})).forEach((id) => {
		const splitId = id.split(".");
		maxDepth = Math.max(maxDepth, splitId.length);
	});
	return maxDepth;
}
/**
* Expands or collapses this row.
*
* Omitting `expanded` toggles the row. If the current state is expanded-all,
* the function first materializes that state into a row-id map (containing
* only expandable row ids) before applying the row-specific change.
*
* The call is a no-op (no `onExpandedChange`) when the requested state matches
* the current state, or when expanding a row that cannot expand. Collapsing is
* always allowed so stale expanded ids can be cleaned up.
*
* @example
* ```ts
* row_toggleExpanded(row)
* ```
*/
function row_toggleExpanded(row, expanded) {
	const currentExpanded = row.table.atoms.expanded?.get() ?? {};
	const currentExists = currentExpanded === true || isExpandedRowId(currentExpanded, row.id);
	const targetExpanded = expanded ?? !currentExists;
	if (targetExpanded === currentExists) return;
	if (targetExpanded && !row_getCanExpand(row)) return;
	table_setExpanded(row.table, (old) => {
		const exists = old === true ? true : isExpandedRowId(old, row.id);
		let oldExpanded = makeObjectMap();
		if (old === true) Object.values(row.table.getRowModel().rowsById).forEach((rowModelRow) => {
			if (row_getCanExpand(rowModelRow)) oldExpanded[rowModelRow.id] = true;
		});
		else oldExpanded = Object.assign(makeObjectMap(), old);
		if (!exists && targetExpanded) {
			oldExpanded[row.id] = true;
			return oldExpanded;
		}
		if (exists && !targetExpanded) {
			const rest = makeObjectMap();
			const rowIds = Object.keys(oldExpanded);
			for (let i = 0; i < rowIds.length; i++) {
				const rowId = rowIds[i];
				if (rowId !== row.id && oldExpanded[rowId]) rest[rowId] = true;
			}
			return rest;
		}
		return old;
	});
}
/**
* Checks whether this row is expanded.
*
* `options.getIsRowExpanded` can override state-derived behavior. Otherwise
* the row is expanded when expanded state is `true` or contains this row id.
*
* @example
* ```ts
* const expanded = row_getIsExpanded(row)
* ```
*/
function row_getIsExpanded(row) {
	const expanded = row.table.atoms.expanded?.get() ?? {};
	return !!(row.table.options.getIsRowExpanded?.(row) ?? (expanded === true || isExpandedRowId(expanded, row.id)));
}
function isExpandedRowId(expanded, rowId) {
	return !!(expanded && expanded !== true && hasOwn(expanded, rowId) && expanded[rowId]);
}
/**
* Checks whether this row can be expanded.
*
* `options.getRowCanExpand` wins when provided. Otherwise rows can expand when
* expanding is enabled and the row has subRows.
*
* @example
* ```ts
* const canExpand = row_getCanExpand(row)
* ```
*/
function row_getCanExpand(row) {
	return row.table.options.getRowCanExpand?.(row) ?? ((row.table.options.enableExpanding ?? true) && !!row.subRows.length);
}
/**
* Checks whether every ancestor of this row is expanded.
*
* The current row is not considered; only its parent chain is walked.
*
* @example
* ```ts
* const parentsExpanded = row_getIsAllParentsExpanded(row)
* ```
*/
function row_getIsAllParentsExpanded(row) {
	let isFullyExpanded = true;
	let currentRow = row;
	while (isFullyExpanded && currentRow.parentId) {
		currentRow = row.table.getRow(currentRow.parentId, true);
		isFullyExpanded = row_getIsExpanded(currentRow);
	}
	return isFullyExpanded;
}
/**
* Creates a row control handler that toggles this row's expanded state.
*
* The handler is a no-op when the row cannot expand.
*
* @example
* ```ts
* const onClick = row_getToggleExpandedHandler(row)
* ```
*/
function row_getToggleExpandedHandler(row) {
	const canExpand = row_getCanExpand(row);
	return () => {
		if (!canExpand) return;
		row_toggleExpanded(row);
	};
}

//#endregion
export { getDefaultExpandedState, row_getCanExpand, row_getIsAllParentsExpanded, row_getIsExpanded, row_getToggleExpandedHandler, row_toggleExpanded, table_autoResetExpanded, table_getCanSomeRowsExpand, table_getExpandedDepth, table_getIsAllRowsExpanded, table_getIsSomeRowsExpanded, table_getToggleAllRowsExpandedHandler, table_resetExpanded, table_setExpanded, table_toggleAllRowsExpanded };