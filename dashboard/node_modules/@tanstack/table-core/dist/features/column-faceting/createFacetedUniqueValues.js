import { callMemoOrStaticFn, tableMemo } from "../../utils.js";
import { column_getFacetedRowModel, table_getGlobalFacetedRowModel } from "./columnFacetingFeature.utils.js";
import { column_getCanGlobalFilter } from "../global-filtering/globalFilteringFeature.utils.js";

//#region src/features/column-faceting/createFacetedUniqueValues.ts
/**
* Creates a memoized faceted unique values helper for faceted filtering.
*
* The returned function derives facet data from the table row model and relevant filter state so filter UIs can display available values.
*/
function createFacetedUniqueValues() {
	return (_table, columnId) => {
		const table = _table;
		return tableMemo({
			feature: "columnFacetingFeature",
			table,
			fnName: "table.getFacetedUniqueValues",
			memoDeps: () => {
				if (columnId === "__global__") return [callMemoOrStaticFn(table, "getGlobalFacetedRowModel", table_getGlobalFacetedRowModel).flatRows];
				const column = table.getColumn(columnId);
				if (!column) return [table.getPreFilteredRowModel().flatRows];
				return [callMemoOrStaticFn(column, "getFacetedRowModel", column_getFacetedRowModel, table).flatRows];
			},
			fn: (flatRows) => _createFacetedUniqueValues(table, columnId, flatRows)
		});
	};
}
function _createFacetedUniqueValues(table, columnId, flatRows) {
	const columnIds = columnId === "__global__" ? table.getAllLeafColumns().filter((column) => column_getCanGlobalFilter(column)).map((column) => column.id) : [columnId];
	const facetedUniqueValues = /* @__PURE__ */ new Map();
	for (let i = 0; i < flatRows.length; i++) for (let c = 0; c < columnIds.length; c++) {
		const values = flatRows[i].getUniqueValues(columnIds[c]);
		if (!values) continue;
		for (let j = 0; j < values.length; j++) {
			const value = values[j];
			const previousValue = facetedUniqueValues.get(value);
			facetedUniqueValues.set(value, previousValue === void 0 ? 1 : previousValue + 1);
		}
	}
	return facetedUniqueValues;
}

//#endregion
export { createFacetedUniqueValues };