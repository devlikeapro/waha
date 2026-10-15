import { makeObjectMap, skipFirstRun, tableMemo } from "../../utils.js";
import { constructRow } from "../rows/constructRow.js";
import { table_autoResetCellSelection } from "../../features/cell-selection/cellSelectionFeature.utils.js";
import { table_autoResetExpanded } from "../../features/row-expanding/rowExpandingFeature.utils.js";
import { table_autoResetPageIndex } from "../../features/row-pagination/rowPaginationFeature.utils.js";
import { table_autoResetSorting } from "../../features/row-sorting/rowSortingFeature.utils.js";

//#region src/core/row-models/createCoreRowModel.ts
/**
* Creates a memoized core row model factory.
*
* The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
*/
function createCoreRowModel() {
	return (table) => {
		return tableMemo({
			feature: "coreRowModelsFeature",
			table,
			fnName: "table.getCoreRowModel",
			memoDeps: () => [table.options.data],
			fn: () => _createCoreRowModel(table, table.options.data),
			onAfterUpdate: skipFirstRun(() => {
				table_autoResetExpanded(table);
				table_autoResetPageIndex(table);
				table_autoResetSorting(table);
				table_autoResetCellSelection(table);
			})
		});
	};
}
function accessRows(table, rowModel, originalRows, depth = 0, parentRow) {
	const rows = [];
	for (let i = 0; i < originalRows.length; i++) {
		const originalRow = originalRows[i];
		const row = constructRow(table, table.getRowId(originalRow, i, parentRow), originalRow, i, depth, void 0, parentRow?.id);
		rowModel.flatRows.push(row);
		rowModel.rowsById[row.id] = row;
		rows.push(row);
		if (table.options.getSubRows) {
			row.originalSubRows = table.options.getSubRows(originalRow, i);
			if (row.originalSubRows?.length) row.subRows = accessRows(table, rowModel, row.originalSubRows, depth + 1, row);
		}
	}
	return rows;
}
function _createCoreRowModel(table, data) {
	const rowModel = {
		rows: [],
		flatRows: [],
		rowsById: makeObjectMap()
	};
	rowModel.rows = accessRows(table, rowModel, data);
	return rowModel;
}

//#endregion
export { createCoreRowModel };