import { makeObjectMap, skipFirstRun, tableMemo } from "../../utils.js";
import { table_getColumn } from "../../core/columns/coreColumnsFeature.utils.js";
import { table_autoResetPageIndex } from "../row-pagination/rowPaginationFeature.utils.js";
import { column_getFilterFn } from "./columnFilteringFeature.utils.js";
import { column_getCanGlobalFilter, table_getGlobalFilterFn } from "../global-filtering/globalFilteringFeature.utils.js";
import { filterRows } from "./filterRowsUtils.js";

//#region src/features/column-filtering/createFilteredRowModel.ts
/**
* Creates a memoized filtered row model factory.
*
* The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
*
* Register the filter functions you use with the `filterFns` slot on the
* `features` option:
* `tableFeatures({ columnFilteringFeature, filteredRowModel: createFilteredRowModel(), filterFns: { includesString: filterFn_includesString } })`.
* Importing individual `filterFn_*` functions keeps unused built-ins out of
* your bundle; filter functions passed directly to the `filterFn` column
* option need no registration at all.
*/
function createFilteredRowModel() {
	return (_table) => {
		const table = _table;
		return tableMemo({
			feature: "columnFilteringFeature",
			table,
			fnName: "table.getFilteredRowModel",
			memoDeps: () => [
				table.getPreFilteredRowModel(),
				table.atoms.columnFilters?.get(),
				table.atoms.globalFilter?.get()
			],
			fn: () => _createFilteredRowModel(table),
			onAfterUpdate: skipFirstRun(() => table_autoResetPageIndex(table))
		});
	};
}
function _createFilteredRowModel(table) {
	const rowModel = table.getPreFilteredRowModel();
	const columnFilters = table.atoms.columnFilters?.get();
	const globalFilter = table.atoms.globalFilter?.get();
	const hasGlobalFilter = globalFilter !== void 0 && globalFilter !== null && globalFilter !== "";
	if (!rowModel.rows.length || !columnFilters?.length && !hasGlobalFilter) {
		const flatRows = rowModel.flatRows;
		for (let i = 0; i < flatRows.length; i++) {
			const row = flatRows[i];
			row.columnFilters = makeObjectMap();
			row.columnFiltersMeta = makeObjectMap();
		}
		return rowModel;
	}
	const resolvedColumnFilters = [];
	const resolvedGlobalFilters = [];
	columnFilters?.forEach((columnFilter) => {
		const column = table_getColumn(table, columnFilter.id);
		if (!column) return;
		const filterFn = column_getFilterFn(column);
		if (!filterFn) return;
		resolvedColumnFilters.push({
			id: columnFilter.id,
			filterFn,
			resolvedValue: filterFn.resolveFilterValue?.(columnFilter.value) ?? columnFilter.value
		});
	});
	const filterableIds = columnFilters?.map((d) => d.id) ?? [];
	const globalFilterFn = table_getGlobalFilterFn(table);
	const globallyFilterableColumns = table.getAllLeafColumns().filter((column) => column_getCanGlobalFilter(column));
	if (hasGlobalFilter && globalFilterFn && globallyFilterableColumns.length) {
		filterableIds.push("__global__");
		globallyFilterableColumns.forEach((column) => {
			resolvedGlobalFilters.push({
				id: column.id,
				filterFn: globalFilterFn,
				resolvedValue: globalFilterFn.resolveFilterValue?.(globalFilter) ?? globalFilter
			});
		});
	}
	const flatRows = rowModel.flatRows;
	for (let i = 0; i < flatRows.length; i++) {
		const row = flatRows[i];
		row.columnFilters = makeObjectMap();
		row.columnFiltersMeta = makeObjectMap();
		if (resolvedColumnFilters.length) for (let j = 0; j < resolvedColumnFilters.length; j++) {
			const currentColumnFilter = resolvedColumnFilters[j];
			const id = currentColumnFilter.id;
			row.columnFilters[id] = currentColumnFilter.filterFn(row, id, currentColumnFilter.resolvedValue, (filterMeta) => {
				if (!row.columnFiltersMeta) row.columnFiltersMeta = makeObjectMap();
				row.columnFiltersMeta[id] = filterMeta;
			});
		}
		if (resolvedGlobalFilters.length) {
			for (let j = 0; j < resolvedGlobalFilters.length; j++) {
				const currentGlobalFilter = resolvedGlobalFilters[j];
				const id = currentGlobalFilter.id;
				if (currentGlobalFilter.filterFn(row, id, currentGlobalFilter.resolvedValue, (filterMeta) => {
					if (!row.columnFiltersMeta) row.columnFiltersMeta = makeObjectMap();
					row.columnFiltersMeta[id] = filterMeta;
				})) {
					row.columnFilters.__global__ = true;
					break;
				}
			}
			if (row.columnFilters.__global__ !== true) row.columnFilters.__global__ = false;
		}
	}
	const filterRowsImpl = (row) => {
		for (let i = 0; i < filterableIds.length; i++) if (row.columnFilters[filterableIds[i]] === false) return false;
		return true;
	};
	return filterRows(rowModel.rows, filterRowsImpl, table);
}

//#endregion
export { createFilteredRowModel };