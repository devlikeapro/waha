import { hasOwn, makeObjectMap, tableMemo } from "../../utils.js";
import { table_getColumn } from "../../core/columns/coreColumnsFeature.utils.js";
import { constructRow } from "../../core/rows/constructRow.js";
import { table_autoResetExpanded } from "../row-expanding/rowExpandingFeature.utils.js";
import { table_autoResetPageIndex } from "../row-pagination/rowPaginationFeature.utils.js";
import { aggregateColumnValue, normalizeUniqueAggregationRows } from "../row-aggregation/rowAggregationFeature.utils.js";

//#region src/features/column-grouping/createGroupedRowModel.ts
/**
* Creates a memoized grouped row model factory.
*
* The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
*
* When rowAggregationFeature is also registered, grouped rows use its shared
* executor for non-group values. Grouping remains useful without aggregation.
*/
function createGroupedRowModel() {
	return (_table) => {
		const table = _table;
		let hasAutoResetDependencies = false;
		let previousGrouping;
		let previousPreGroupedRowModel;
		return tableMemo({
			feature: "columnGroupingFeature",
			table,
			fnName: "table.getGroupedRowModel",
			memoDeps: () => [
				table.atoms.grouping?.get(),
				table.getPreGroupedRowModel(),
				table.options.columns
			],
			fn: () => _createGroupedRowModel(table),
			onAfterUpdate: () => {
				const grouping = table.atoms.grouping?.get();
				const preGroupedRowModel = table.getPreGroupedRowModel();
				const rowInputsChanged = hasAutoResetDependencies && (grouping !== previousGrouping || preGroupedRowModel !== previousPreGroupedRowModel);
				previousGrouping = grouping;
				previousPreGroupedRowModel = preGroupedRowModel;
				hasAutoResetDependencies = true;
				if (rowInputsChanged) {
					table_autoResetExpanded(table);
					table_autoResetPageIndex(table);
				}
			}
		});
	};
}
function _createGroupedRowModel(table) {
	const rowModel = table.getPreGroupedRowModel();
	const grouping = table.atoms.grouping?.get();
	if (!rowModel.rows.length || !grouping?.length) {
		resetRowRelationships(rowModel.rows, 0, void 0);
		return rowModel;
	}
	const existingGrouping = grouping.filter((columnId) => table_getColumn(table, columnId));
	const groupedFlatRows = [];
	const groupedRowsById = makeObjectMap();
	const groupUpRecursively = (rows, depth = 0, parentId) => {
		if (depth >= existingGrouping.length) return rows.map((row) => {
			row.depth = depth;
			groupedFlatRows.push(row);
			groupedRowsById[row.id] = row;
			if (row.subRows.length) row.subRows = groupUpRecursively(row.subRows, depth + 1, row.id);
			return row;
		});
		const columnId = existingGrouping[depth];
		const rowGroupsMap = groupBy(table, rows, columnId);
		return Array.from(rowGroupsMap.entries()).map(([groupingValue, groupedRows], index) => {
			let id = `${columnId}:${groupingValue}`;
			id = parentId ? `${parentId}>${id}` : id;
			const flatIndex = groupedFlatRows.length;
			groupedFlatRows.push(void 0);
			const subRows = groupUpRecursively(groupedRows, depth + 1, id);
			subRows.forEach((subRow) => {
				subRow.parentId = id;
			});
			const leafRows = normalizeUniqueAggregationRows(groupedRows, Infinity);
			const row = constructRow(table, id, leafRows[0].original, index, depth, void 0, parentId);
			Object.assign(row, {
				groupingColumnId: columnId,
				groupingValue,
				subRows,
				leafRows,
				getValue: (colId) => {
					const groupingIndex = existingGrouping.indexOf(colId);
					if (groupingIndex !== -1 && groupingIndex <= depth) {
						if (hasOwn(row._valuesCache, colId)) return row._valuesCache[colId];
						if (groupedRows[0]) row._valuesCache[colId] = groupedRows[0].getValue(colId) ?? void 0;
						return row._valuesCache[colId];
					}
					const aggregationCache = row._aggregationValuesCache;
					if (aggregationCache && hasOwn(aggregationCache, colId)) return aggregationCache[colId];
					const column = table.getColumn(colId);
					if (typeof column.getAggregationFns !== "function") return void 0;
					const cache = row._aggregationValuesCache ??= makeObjectMap();
					cache[colId] = aggregateColumnValue({
						subRows,
						column,
						groupingRow: row,
						rows: groupedRows,
						uniqueRows: true
					});
					return cache[colId];
				}
			});
			groupedFlatRows[flatIndex] = row;
			groupedRowsById[id] = row;
			return row;
		});
	};
	return {
		rows: groupUpRecursively(rowModel.rows, 0),
		flatRows: groupedFlatRows,
		rowsById: groupedRowsById
	};
}
function resetRowRelationships(rows, depth, parentId) {
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		row.depth = depth;
		row.parentId = parentId;
		if (row.subRows.length) resetRowRelationships(row.subRows, depth + 1, row.id);
	}
}
function groupBy(table, rows, columnId) {
	const groupMap = /* @__PURE__ */ new Map();
	const getGroupingValue = table_getColumn(table, columnId)?.columnDef.getGroupingValue;
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		let groupingValue;
		if (getGroupingValue) {
			const cache = row._groupingValuesCache;
			if (cache && hasOwn(cache, columnId)) groupingValue = cache[columnId];
			else if (cache) groupingValue = cache[columnId] = getGroupingValue(row.original, row.index, row);
		} else groupingValue = row.getValue(columnId);
		const resKey = `${groupingValue}`;
		const previous = groupMap.get(resKey);
		if (!previous) groupMap.set(resKey, [row]);
		else previous.push(row);
	}
	return groupMap;
}

//#endregion
export { createGroupedRowModel };