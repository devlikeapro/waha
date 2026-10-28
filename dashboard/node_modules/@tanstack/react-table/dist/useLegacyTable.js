'use client';

import { useTable } from "./useTable.js";
import { aggregationFns, createColumnHelper, createExpandedRowModel, createFacetedMinMaxValues, createFacetedRowModel, createFacetedUniqueValues, createFilteredRowModel, createGroupedRowModel, createPaginatedRowModel, createSortedRowModel, filterFns, sortFns, stockFeatures } from "@tanstack/table-core";
import { useCallback, useMemo, useState } from "react";

//#region src/useLegacyTable.ts
/**
* @deprecated Use `createFilteredRowModel()` in the `filteredRowModel` feature slot with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the filtered row model.
*/
function getFilteredRowModel() {
	return (() => () => {});
}
/**
* @deprecated Use `createSortedRowModel()` in the `sortedRowModel` feature slot with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the sorted row model.
*/
function getSortedRowModel() {
	return (() => () => {});
}
/**
* @deprecated Use `createPaginatedRowModel()` with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the paginated row model.
*/
function getPaginationRowModel() {
	return (() => () => {});
}
/**
* @deprecated Use `createExpandedRowModel()` with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the expanded row model.
*/
function getExpandedRowModel() {
	return (() => () => {});
}
/**
* @deprecated Use `createGroupedRowModel()` in the `groupedRowModel` feature slot with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the grouped row model.
*/
function getGroupedRowModel() {
	return (() => () => {});
}
/**
* @deprecated Use `createFacetedRowModel()` with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the faceted row model.
*/
function getFacetedRowModel() {
	return (() => () => {});
}
/**
* @deprecated Use `createFacetedMinMaxValues()` with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the faceted min/max values.
*/
function getFacetedMinMaxValues() {
	return () => () => void 0;
}
/**
* @deprecated Use `createFacetedUniqueValues()` with the new `useTable` hook instead.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It acts as a marker to enable the faceted unique values.
*/
function getFacetedUniqueValues() {
	return () => () => /* @__PURE__ */ new Map();
}
/**
* @deprecated The core row model is always created automatically in v9.
*
* This is a stub function for v8 API compatibility with `useLegacyTable`.
* It does nothing - the core row model is always available.
*/
function getCoreRowModel() {
	return (() => () => {});
}
/**
* @deprecated Use `createColumnHelper<TFeatures, TData>()` with useTable instead.
*
* A column helper with LegacyFeatures pre-bound for use with useLegacyTable.
* Only requires TData—no need to specify TFeatures.
*/
function legacyCreateColumnHelper() {
	return createColumnHelper();
}
/**
* @deprecated This hook is provided as a compatibility layer for migrating from TanStack Table v8.
*
* Use the new `useTable` hook instead with an explicit `features` option:
*
* ```tsx
* // New v9 API
* const features = tableFeatures({
*   columnFilteringFeature,
*   rowSortingFeature,
*   rowPaginationFeature,
*   filteredRowModel: createFilteredRowModel(),
*   sortedRowModel: createSortedRowModel(),
*   paginatedRowModel: createPaginatedRowModel(),
*   filterFns,
*   sortFns,
* })
*
* const table = useTable({
*   features,
*   columns,
*   data,
* })
* ```
*
* Key differences from v8:
* - Features are tree-shakeable - only import what you use
* - Row models and fn registries are explicitly passed on the `features` option
* - Use `table.Subscribe` for fine-grained re-renders
* - State is accessed via `table.state` after selecting with the 2nd argument
*
* @param options - Legacy v8-style table options
* @returns A table instance with the full state subscribed and a `getState()` method
*/
function useLegacyTable(options) {
	const { getCoreRowModel: _getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, getExpandedRowModel, getGroupedRowModel, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues, ...restOptions } = options;
	const [features] = useState(() => {
		const legacyFeatures = {
			...stockFeatures,
			filterFns: {
				...filterFns,
				...options.filterFns
			},
			sortFns: {
				...sortFns,
				...options.sortFns
			},
			aggregationFns: {
				...aggregationFns,
				...options.aggregationFns
			}
		};
		if (getFilteredRowModel) legacyFeatures.filteredRowModel = createFilteredRowModel();
		if (getSortedRowModel) legacyFeatures.sortedRowModel = createSortedRowModel();
		if (getPaginationRowModel) legacyFeatures.paginatedRowModel = createPaginatedRowModel();
		if (getExpandedRowModel) legacyFeatures.expandedRowModel = createExpandedRowModel();
		if (getGroupedRowModel) legacyFeatures.groupedRowModel = createGroupedRowModel();
		if (getFacetedRowModel) legacyFeatures.facetedRowModel = createFacetedRowModel();
		if (getFacetedMinMaxValues) legacyFeatures.facetedMinMaxValues = createFacetedMinMaxValues();
		if (getFacetedUniqueValues) legacyFeatures.facetedUniqueValues = createFacetedUniqueValues();
		return legacyFeatures;
	});
	const table = useTable({
		...restOptions,
		features
	}, (state) => state);
	const getState = useCallback(() => {
		return table.state;
	}, [table]);
	const setState = useCallback((state) => {
		Object.entries(state).forEach(([key, value]) => {
			table.baseAtoms[key].set(value);
		});
	}, [table]);
	return useMemo(() => ({
		...table,
		getState,
		setState
	}), [
		table,
		getState,
		setState
	]);
}

//#endregion
export { getCoreRowModel, getExpandedRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel, legacyCreateColumnHelper, useLegacyTable };