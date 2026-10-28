import { tableMemo } from "../../utils.js";
import { row_getIsExpanded } from "./rowExpandingFeature.utils.js";

//#region src/features/row-expanding/createExpandedRowModel.ts
/**
* Creates a memoized expanded row model factory.
*
* The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
*/
function createExpandedRowModel() {
	return (_table) => {
		const table = _table;
		return tableMemo({
			feature: "rowExpandingFeature",
			table,
			fnName: "table.getExpandedRowModel",
			memoDeps: () => [
				table.atoms.expanded?.get(),
				table.getPreExpandedRowModel(),
				table.options.paginateExpandedRows,
				table.options.manualPagination
			],
			fn: () => _createExpandedRowModel(table)
		});
	};
}
function _createExpandedRowModel(table) {
	const rowModel = table.getPreExpandedRowModel();
	const expanded = table.atoms.expanded?.get();
	if (!rowModel.rows.length || expanded !== true && !Object.keys(expanded ?? {}).length) return rowModel;
	if (!table.options.paginateExpandedRows && !table.options.manualPagination) return rowModel;
	return expandRows(rowModel);
}
/**
* Expands a row model according to the current expanded row state.
*
* Expanded sub-rows are inserted into the flattened row order while preserving the original row hierarchy.
*/
function expandRows(rowModel) {
	const expandedRows = [];
	const handleRow = (row) => {
		expandedRows.push(row);
		if (row.subRows.length && row_getIsExpanded(row)) row.subRows.forEach(handleRow);
	};
	rowModel.rows.forEach(handleRow);
	return {
		rows: expandedRows,
		flatRows: rowModel.flatRows,
		rowsById: rowModel.rowsById
	};
}

//#endregion
export { createExpandedRowModel, expandRows };