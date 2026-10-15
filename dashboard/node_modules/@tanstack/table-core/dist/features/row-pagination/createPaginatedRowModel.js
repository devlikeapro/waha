import { tableMemo } from "../../utils.js";
import { getDefaultPaginationState } from "./rowPaginationFeature.utils.js";
import { expandRows } from "../row-expanding/createExpandedRowModel.js";

//#region src/features/row-pagination/createPaginatedRowModel.ts
/**
* Creates a memoized paginated row model factory.
*
* The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
*/
function createPaginatedRowModel() {
	return (_table) => {
		const table = _table;
		return tableMemo({
			feature: "rowPaginationFeature",
			table,
			fnName: "table.getPaginatedRowModel",
			memoDeps: () => [
				table.getPrePaginatedRowModel(),
				table.atoms.pagination?.get(),
				!table.options.paginateExpandedRows ? table.atoms.expanded?.get() : void 0
			],
			fn: () => _createPaginatedRowModel(table)
		});
	};
}
function _createPaginatedRowModel(table) {
	const prePaginatedRowModel = table.getPrePaginatedRowModel();
	const pagination = table.atoms.pagination?.get();
	if (!prePaginatedRowModel.rows.length) return prePaginatedRowModel;
	const { pageSize, pageIndex } = pagination ?? getDefaultPaginationState();
	const { rows, flatRows, rowsById } = prePaginatedRowModel;
	let paginatedRows = rows;
	if (pageSize !== Infinity || pageIndex !== 0) {
		const pageStart = pageSize * pageIndex;
		const pageEnd = pageStart + pageSize;
		paginatedRows = rows.slice(pageStart, pageEnd);
	}
	let paginatedRowModel;
	if (!table.options.paginateExpandedRows) paginatedRowModel = expandRows({
		rows: paginatedRows,
		flatRows,
		rowsById
	});
	else paginatedRowModel = {
		rows: paginatedRows,
		flatRows,
		rowsById
	};
	paginatedRowModel.flatRows = [];
	const seenFlatRows = /* @__PURE__ */ new Set();
	const handleRow = (row) => {
		if (seenFlatRows.has(row.id)) return;
		seenFlatRows.add(row.id);
		paginatedRowModel.flatRows.push(row);
		if (row.subRows.length) row.subRows.forEach(handleRow);
	};
	paginatedRowModel.rows.forEach(handleRow);
	return paginatedRowModel;
}

//#endregion
export { createPaginatedRowModel };