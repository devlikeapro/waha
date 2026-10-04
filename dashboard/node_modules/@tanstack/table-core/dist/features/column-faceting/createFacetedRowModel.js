import { tableMemo } from "../../utils.js";
import { filterRows } from "../column-filtering/filterRowsUtils.js";

//#region src/features/column-faceting/createFacetedRowModel.ts
/**
* Creates a memoized faceted row model factory.
*
* The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
*/
function createFacetedRowModel() {
	return (_table, columnId) => {
		const table = _table;
		return tableMemo({
			feature: "columnFacetingFeature",
			table,
			fnName: "createFacetedRowModel",
			memoDeps: () => [
				table.getPreFilteredRowModel(),
				table.atoms.columnFilters?.get(),
				table.atoms.globalFilter?.get(),
				table.getFilteredRowModel()
			],
			fn: (preRowModel, columnFilters, globalFilter) => _createFacetedRowModel(table, columnId, preRowModel, columnFilters, globalFilter)
		});
	};
}
function _createFacetedRowModel(table, columnId, preRowModel, columnFilters, globalFilter) {
	const hasGlobalFilter = globalFilter !== void 0 && globalFilter !== null && globalFilter !== "";
	if (!preRowModel.rows.length || !columnFilters?.length && !hasGlobalFilter) return preRowModel;
	const filterableIds = [];
	if (columnFilters) for (let i = 0; i < columnFilters.length; i++) {
		const id = columnFilters[i].id;
		if (id !== columnId) filterableIds.push(id);
	}
	if (hasGlobalFilter && columnId !== "__global__") filterableIds.push("__global__");
	if (!filterableIds.length) return preRowModel;
	const filterRowsImpl = (row) => {
		for (let i = 0; i < filterableIds.length; i++) if (row.columnFilters?.[filterableIds[i]] === false) return false;
		return true;
	};
	return filterRows(preRowModel.rows, filterRowsImpl, table);
}

//#endregion
export { createFacetedRowModel };