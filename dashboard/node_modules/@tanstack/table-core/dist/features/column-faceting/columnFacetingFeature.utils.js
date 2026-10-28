import { makeObjectMap } from "../../utils.js";

//#region src/features/column-faceting/columnFacetingFeature.utils.ts
/**
* Computes min and max numeric facet values for one column.
*
* The configured `facetedMinMaxValues` row-model factory owns the calculation.
* If no factory is registered, the result is `undefined`.
*
* @example
* ```ts
* const range = column_getFacetedMinMaxValues(column, table)
* ```
*/
function column_getFacetedMinMaxValues(column, table) {
	const facetedMinMaxValues = table._rowModels.facetedMinMaxValues ??= makeObjectMap();
	let facetedMinMaxValuesFn = facetedMinMaxValues[column.id];
	if (!facetedMinMaxValuesFn) facetedMinMaxValuesFn = facetedMinMaxValues[column.id] = table.options.features.facetedMinMaxValues?.(table, column.id) ?? (() => void 0);
	return facetedMinMaxValuesFn();
}
/**
* Computes the row model used to derive one column's facet values.
*
* The faceted row model normally applies every other active filter while
* excluding this column's own filter. If no factory is registered, the
* pre-filtered row model is returned.
*
* @example
* ```ts
* const rows = column_getFacetedRowModel(column, table)
* ```
*/
function column_getFacetedRowModel(column, table) {
	const columnId = column?.id ?? "";
	const facetedRowModels = table._rowModels.facetedRowModels ??= makeObjectMap();
	let facetedRowModelFn = facetedRowModels[columnId];
	if (!facetedRowModelFn) facetedRowModelFn = facetedRowModels[columnId] = table.options.features.facetedRowModel?.(table, columnId) ?? (() => table.getPreFilteredRowModel());
	return facetedRowModelFn();
}
/**
* Computes unique facet values and their occurrence counts for one column.
*
* The configured `facetedUniqueValues` row-model factory owns the calculation.
* If no factory is registered, an empty `Map` is returned.
*
* @example
* ```ts
* const values = column_getFacetedUniqueValues(column, table)
* ```
*/
function column_getFacetedUniqueValues(column, table) {
	const facetedUniqueValues = table._rowModels.facetedUniqueValues ??= makeObjectMap();
	let facetedUniqueValuesFn = facetedUniqueValues[column.id];
	if (!facetedUniqueValuesFn) facetedUniqueValuesFn = facetedUniqueValues[column.id] = table.options.features.facetedUniqueValues?.(table, column.id) ?? createStableEmptyMapFn();
	return facetedUniqueValuesFn();
}
function createStableEmptyMapFn() {
	const emptyMap = /* @__PURE__ */ new Map();
	return () => emptyMap;
}
/**
* Computes min and max numeric facet values for the global filter context.
*
* The global context is requested with the internal `__global__` column id. If
* no factory is registered, the result is `undefined`.
*
* @example
* ```ts
* const range = table_getGlobalFacetedMinMaxValues(table)
* ```
*/
function table_getGlobalFacetedMinMaxValues(table) {
	if (!table._rowModels.globalFacetedMinMaxValues) table._rowModels.globalFacetedMinMaxValues = table.options.features.facetedMinMaxValues?.(table, "__global__") ?? (() => void 0);
	const facetedMinMaxValuesFn = table._rowModels.globalFacetedMinMaxValues;
	return facetedMinMaxValuesFn();
}
/**
* Computes the row model used to derive global facet values.
*
* The global context is requested with the internal `__global__` column id. If
* no faceted row-model factory is registered, the pre-filtered row model is
* returned.
*
* @example
* ```ts
* const rows = table_getGlobalFacetedRowModel(table)
* ```
*/
function table_getGlobalFacetedRowModel(table) {
	if (!table._rowModels.globalFacetedRowModel) table._rowModels.globalFacetedRowModel = table.options.features.facetedRowModel?.(table, "__global__") ?? (() => table.getPreFilteredRowModel());
	const facetedRowModelFn = table._rowModels.globalFacetedRowModel;
	return facetedRowModelFn();
}
/**
* Computes unique values and occurrence counts for the global filter context.
*
* The global context is requested with the internal `__global__` column id. If
* no factory is registered, an empty `Map` is returned.
*
* @example
* ```ts
* const values = table_getGlobalFacetedUniqueValues(table)
* ```
*/
function table_getGlobalFacetedUniqueValues(table) {
	if (!table._rowModels.globalFacetedUniqueValues) table._rowModels.globalFacetedUniqueValues = table.options.features.facetedUniqueValues?.(table, "__global__") ?? createStableEmptyMapFn();
	const facetedUniqueValuesFn = table._rowModels.globalFacetedUniqueValues;
	return facetedUniqueValuesFn();
}

//#endregion
export { column_getFacetedMinMaxValues, column_getFacetedRowModel, column_getFacetedUniqueValues, table_getGlobalFacetedMinMaxValues, table_getGlobalFacetedRowModel, table_getGlobalFacetedUniqueValues };