import { assignPrototypeAPIs, assignTableAPIs } from "../../utils.js";
import { cell_getColSpan, cell_getIsCovered, cell_getRowSpan, table_getCellSpanIndex } from "./cellSpanningFeature.utils.js";

//#region src/features/cell-spanning/cellSpanningFeature.ts
/**
* Feature that merges adjacent cells that share a value into row-spanning
* cells, and lets a column def declare column-spanning cells per row.
*
* Stateless: spans are always derived from the rows that are currently
* rendered, so there is nothing to persist and nothing to configure beyond the
* column defs.
*/
const cellSpanningFeature = {
	getDefaultTableOptions: () => {
		return { enableCellSpanning: true };
	},
	initRowInstanceData: (row) => {
		row._cellSpanRowIndex = -1;
	},
	assignCellPrototype: (prototype, table) => {
		assignPrototypeAPIs("cellSpanningFeature", prototype, table, {
			cell_getColSpan: { fn: (cell) => cell_getColSpan(cell) },
			cell_getIsCovered: { fn: (cell) => cell_getIsCovered(cell) },
			cell_getRowSpan: { fn: (cell) => cell_getRowSpan(cell) }
		});
	},
	constructTableAPIs: (table) => {
		assignTableAPIs("cellSpanningFeature", table, { table_getCellSpanIndex: {
			fn: () => table_getCellSpanIndex(table),
			memoDeps: () => [
				table.getRowModel().rows,
				table.atoms.rowPinning?.get(),
				table.options.keepPinnedRows,
				table.atoms.columnVisibility?.get(),
				table.atoms.columnOrder?.get(),
				table.atoms.columnPinning?.get(),
				table.atoms.grouping?.get(),
				table.options.columns,
				table.options.groupedColumnMode,
				table.options.enableCellSpanning
			]
		} });
	}
};

//#endregion
export { cellSpanningFeature };