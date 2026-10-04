import { assignPrototypeAPIs } from "../../utils.js";
import { cell_getIsAggregated, column_getAggregationFns, column_getAggregationValue, column_getAutoAggregationFn, formatAggregatedCellValue } from "./rowAggregationFeature.utils.js";

//#region src/features/row-aggregation/rowAggregationFeature.ts
/**
* Independent aggregation feature for grouped values and root/custom-row totals.
*/
const rowAggregationFeature = {
	getDefaultColumnDef: () => ({
		aggregatedCell: ({ column, getValue }) => formatAggregatedCellValue(getValue(), column.columnDef.aggregationFn),
		aggregationFn: "auto",
		maxAggregationDepth: 0
	}),
	getDefaultTableOptions: () => ({ manualAggregation: false }),
	assignCellPrototype: (prototype, table) => {
		assignPrototypeAPIs("rowAggregationFeature", prototype, table, { cell_getIsAggregated: { fn: (cell) => cell_getIsAggregated(cell) } });
	},
	assignColumnPrototype: (prototype, table) => {
		assignPrototypeAPIs("rowAggregationFeature", prototype, table, {
			column_getAggregationFns: { fn: (column) => column_getAggregationFns(column) },
			column_getAggregationValue: { fn: (column, options) => column_getAggregationValue(column, options) },
			column_getAutoAggregationFn: {
				fn: (column) => column_getAutoAggregationFn(column),
				memoDeps: (column) => [column.table.getCoreRowModel(), column.table._rowModelFns.aggregationFns]
			}
		});
	},
	initColumnInstanceData: (column) => {
		column._aggregationValueCache = void 0;
		column._resolvedAggregationFnsCache = void 0;
	}
};

//#endregion
export { rowAggregationFeature };