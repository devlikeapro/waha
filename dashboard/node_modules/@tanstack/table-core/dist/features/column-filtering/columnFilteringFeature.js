import { assignPrototypeAPIs, assignTableAPIs, makeObjectMap, makeStateUpdater } from "../../utils.js";
import { column_getAutoFilterFn, column_getCanFilter, column_getFilterFn, column_getFilterIndex, column_getFilterValue, column_getIsFiltered, column_setFilterValue, getDefaultColumnFiltersState, table_resetColumnFilters, table_setColumnFilters } from "./columnFilteringFeature.utils.js";

//#region src/features/column-filtering/columnFilteringFeature.ts
/**
* Feature that adds per-column filtering state, options, and column/table filter APIs.
*/
const columnFilteringFeature = {
	getInitialState: (initialState) => {
		return {
			columnFilters: getDefaultColumnFiltersState(),
			...initialState
		};
	},
	getDefaultColumnDef: () => {
		return { filterFn: "auto" };
	},
	getDefaultTableOptions: (table) => {
		return {
			onColumnFiltersChange: makeStateUpdater("columnFilters", table),
			filterFromLeafRows: false,
			maxLeafRowFilterDepth: 100
		};
	},
	assignColumnPrototype: (prototype, table) => {
		assignPrototypeAPIs("columnFilteringFeature", prototype, table, {
			column_getAutoFilterFn: { fn: (column) => column_getAutoFilterFn(column) },
			column_getFilterFn: { fn: (column) => column_getFilterFn(column) },
			column_getCanFilter: { fn: (column) => column_getCanFilter(column) },
			column_getIsFiltered: { fn: (column) => column_getIsFiltered(column) },
			column_getFilterValue: { fn: (column) => column_getFilterValue(column) },
			column_getFilterIndex: { fn: (column) => column_getFilterIndex(column) },
			column_setFilterValue: { fn: (column, value) => column_setFilterValue(column, value) }
		});
	},
	initRowInstanceData: (row) => {
		row.columnFilters = makeObjectMap();
		row.columnFiltersMeta = makeObjectMap();
	},
	constructTableAPIs: (table) => {
		assignTableAPIs("columnFilteringFeature", table, {
			table_setColumnFilters: { fn: (updater) => table_setColumnFilters(table, updater) },
			table_resetColumnFilters: { fn: (defaultState) => table_resetColumnFilters(table, defaultState) }
		});
	}
};

//#endregion
export { columnFilteringFeature };