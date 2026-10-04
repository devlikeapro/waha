import { callMemoOrStaticFn } from "../../utils.js";
import { column_getIsVisible, table_getVisibleLeafColumns } from "../../features/column-visibility/columnVisibilityFeature.utils.js";
import { buildHeaderGroups } from "./buildHeaderGroups.js";
import { getDefaultColumnPinningState } from "../../features/column-pinning/columnPinningFeature.utils.js";

//#region src/core/headers/coreHeadersFeature.utils.ts
function collectLeafHeaders(header, leafHeaders) {
	for (let i = 0; i < header.subHeaders.length; i++) collectLeafHeaders(header.subHeaders[i], leafHeaders);
	leafHeaders.push(header);
}
/**
* Walks a header tree and collects all descendant leaf headers.
*
* The header itself is included after its descendants, matching the recursive
* shape used by nested header groups.
*
* @example
* ```ts
* const leafHeaders = header_getLeafHeaders(header)
* ```
*/
function header_getLeafHeaders(header) {
	const leafHeaders = [];
	collectLeafHeaders(header, leafHeaders);
	return leafHeaders;
}
/**
* Builds the render context passed to a column's `header` or `footer` template.
*
* The context contains the header, its column, and the owning table instance.
*
* @example
* ```ts
* const context = header_getContext(header)
* ```
*/
function header_getContext(header) {
	return {
		column: header.column,
		header,
		table: header.column.table
	};
}
/**
* Builds visible header groups for the current column tree.
*
* Column visibility and pinning are applied before groups are built. When no
* columns are pinned, the fast path skips pin partitioning.
*
* @example
* ```ts
* const headerGroups = table_getHeaderGroups(table)
* ```
*/
function table_getHeaderGroups(table) {
	const { start, end } = table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState();
	const allColumns = table.getAllColumns();
	const leafColumns = callMemoOrStaticFn(table, "getVisibleLeafColumns", table_getVisibleLeafColumns);
	if (!start.length && !end.length) return buildHeaderGroups(allColumns, leafColumns, table);
	const leafColumnsById = table.getAllLeafColumnsById();
	const leftColumns = [];
	for (let i = 0; i < start.length; i++) {
		const column = leafColumnsById[start[i]];
		if (column && callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible)) leftColumns.push(column);
	}
	const rightColumns = [];
	for (let i = 0; i < end.length; i++) {
		const column = leafColumnsById[end[i]];
		if (column && callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible)) rightColumns.push(column);
	}
	const centerColumns = leafColumns.filter((column) => !start.includes(column.id) && !end.includes(column.id));
	return buildHeaderGroups(allColumns, [
		...leftColumns,
		...centerColumns,
		...rightColumns
	], table);
}
/**
* Builds footer groups by reversing the current header groups.
*
* Footer rendering uses the same header objects and grouping structure, but
* renders them from leaf level back toward the root.
*
* @example
* ```ts
* const footerGroups = table_getFooterGroups(table)
* ```
*/
function table_getFooterGroups(table) {
	return [...table.getHeaderGroups()].reverse();
}
/**
* Flattens every header from every header group into one array.
*
* The result includes parent headers and placeholder headers, in header-group
* order from top to bottom.
*
* @example
* ```ts
* const flatHeaders = table_getFlatHeaders(table)
* ```
*/
function table_getFlatHeaders(table) {
	const headerGroups = table.getHeaderGroups();
	const result = [];
	for (let i = 0; i < headerGroups.length; i++) {
		const headers = headerGroups[i].headers;
		for (let j = 0; j < headers.length; j++) result.push(headers[j]);
	}
	return result;
}
/**
* Collects only the leaf headers from the current header tree.
*
* Parent/group headers are skipped, making the result suitable for rendering
* one header per visible leaf column.
*
* @example
* ```ts
* const leafHeaders = table_getLeafHeaders(table)
* ```
*/
function table_getLeafHeaders(table) {
	const topHeaders = table.getHeaderGroups()[0]?.headers ?? [];
	const result = [];
	for (let i = 0; i < topHeaders.length; i++) {
		const leafHeaders = topHeaders[i].getLeafHeaders();
		for (let j = 0; j < leafHeaders.length; j++) result.push(leafHeaders[j]);
	}
	return result;
}

//#endregion
export { header_getContext, header_getLeafHeaders, table_getFlatHeaders, table_getFooterGroups, table_getHeaderGroups, table_getLeafHeaders };