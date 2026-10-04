import { makeObjectMap } from "../../utils.js";
import { constructRow } from "../../core/rows/constructRow.js";

//#region src/features/column-filtering/filterRowsUtils.ts
/**
* Filters a row model with the supplied row predicate.
*
* The helper supports both filtering from leaf rows upward and filtering parents before descendants, depending on table options.
*/
function filterRows(rows, filterRowImpl, table) {
	if (table.options.filterFromLeafRows) return filterRowModelFromLeafs(rows, filterRowImpl, table);
	return filterRowModelFromRoot(rows, filterRowImpl, table);
}
function filterRowModelFromLeafs(rowsToFilter, filterRow, table) {
	const newFilteredFlatRows = [];
	const newFilteredRowsById = makeObjectMap();
	const maxDepth = table.options.maxLeafRowFilterDepth ?? 100;
	const recurseFilterRows = (rowsToFilter, depth = 0) => {
		const filteredRows = [];
		for (const row of rowsToFilter) {
			const newRow = constructRow(table, row.id, row.original, row.index, row.depth, void 0, row.parentId);
			newRow.columnFilters = row.columnFilters;
			newRow.columnFiltersMeta = row.columnFiltersMeta;
			if (row.subRows.length && depth < maxDepth) {
				newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
				if (newRow.subRows.length || filterRow(newRow)) filteredRows.push(newRow);
			} else if (filterRow(newRow)) {
				newRow.subRows = row.subRows;
				filteredRows.push(newRow);
			}
		}
		return filteredRows;
	};
	const rows = recurseFilterRows(rowsToFilter);
	addSubRowsToFlatArrays(rows, newFilteredFlatRows, newFilteredRowsById);
	return {
		rows,
		flatRows: newFilteredFlatRows,
		rowsById: newFilteredRowsById
	};
}
function filterRowModelFromRoot(rowsToFilter, filterRow, table) {
	const newFilteredFlatRows = [];
	const newFilteredRowsById = makeObjectMap();
	const maxDepth = table.options.maxLeafRowFilterDepth ?? 100;
	const recurseFilterRows = (rowsToFilter, depth = 0) => {
		const filteredRows = [];
		for (const row of rowsToFilter) if (filterRow(row)) if (row.subRows.length && depth < maxDepth) {
			const newRow = constructRow(table, row.id, row.original, row.index, row.depth, void 0, row.parentId);
			const filterData = row;
			newRow.columnFilters = filterData.columnFilters;
			newRow.columnFiltersMeta = filterData.columnFiltersMeta;
			filteredRows.push(newRow);
			newFilteredFlatRows.push(newRow);
			newFilteredRowsById[newRow.id] = newRow;
			newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
		} else {
			filteredRows.push(row);
			newFilteredFlatRows.push(row);
			newFilteredRowsById[row.id] = row;
			if (row.subRows.length && depth >= maxDepth) addSubRowsToFlatArrays(row.subRows, newFilteredFlatRows, newFilteredRowsById);
		}
		return filteredRows;
	};
	return {
		rows: recurseFilterRows(rowsToFilter),
		flatRows: newFilteredFlatRows,
		rowsById: newFilteredRowsById
	};
}
function addSubRowsToFlatArrays(subRows, flatRows, rowsById) {
	for (const subRow of subRows) {
		flatRows.push(subRow);
		rowsById[subRow.id] = subRow;
		if (subRow.subRows.length) addSubRowsToFlatArrays(subRow.subRows, flatRows, rowsById);
	}
}

//#endregion
export { filterRows };