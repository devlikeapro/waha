import { callMemoOrStaticFn } from "../../utils.js";
import { column_getIsVisible } from "../../features/column-visibility/columnVisibilityFeature.utils.js";
import { constructHeader } from "./constructHeader.js";

//#region src/core/headers/buildHeaderGroups.ts
function getMaxHeaderDepth(columns, depth = 1) {
	let maxDepth = depth;
	for (let i = 0; i < columns.length; i++) {
		const column = columns[i];
		if (callMemoOrStaticFn(column, "getIsVisible", column_getIsVisible) && column.columns.length) maxDepth = Math.max(maxDepth, getMaxHeaderDepth(column.columns, depth + 1));
	}
	return maxDepth;
}
function formatHeaderGroupId(headerFamily, depth) {
	return headerFamily ? `${headerFamily}_${depth}` : String(depth);
}
function formatHeaderId(headerFamily, depth, columnId, childHeaderId) {
	let id = headerFamily ?? "";
	if (depth) id = id ? `${id}_${depth}` : String(depth);
	if (columnId) id = id ? `${id}_${columnId}` : columnId;
	if (childHeaderId) id = id ? `${id}_${childHeaderId}` : childHeaderId;
	return id;
}
function countPendingHeadersForColumn(headers, column) {
	let count = 0;
	for (let i = 0; i < headers.length; i++) if (headers[i].column === column) count++;
	return count;
}
function constructHeaderGroup(headersToGroup, depth, table, headerFamily, headerGroups, headerGroupInitFns) {
	const headerGroup = {
		depth,
		id: formatHeaderGroupId(headerFamily, depth),
		headers: []
	};
	const pendingParentHeaders = [];
	for (let i = 0; i < headersToGroup.length; i++) {
		if (!(i in headersToGroup)) continue;
		const headerToGroup = headersToGroup[i];
		const latestPendingParentHeader = pendingParentHeaders[pendingParentHeaders.length - 1];
		const isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
		let column;
		let isPlaceholder = false;
		if (isLeafHeader && headerToGroup.column.parent) column = headerToGroup.column.parent;
		else {
			column = headerToGroup.column;
			isPlaceholder = true;
		}
		if (latestPendingParentHeader && latestPendingParentHeader.column === column) latestPendingParentHeader.subHeaders.push(headerToGroup);
		else {
			const header = constructHeader(table, column, {
				id: formatHeaderId(headerFamily, depth, column.id, headerToGroup.id),
				isPlaceholder,
				placeholderId: isPlaceholder ? String(countPendingHeadersForColumn(pendingParentHeaders, column)) : void 0,
				depth,
				index: pendingParentHeaders.length
			});
			header.subHeaders.push(headerToGroup);
			pendingParentHeaders.push(header);
		}
		headerGroup.headers.push(headerToGroup);
		headerToGroup.headerGroup = headerGroup;
	}
	for (let i = 0; i < headerGroupInitFns.length; i++) headerGroupInitFns[i](headerGroup);
	headerGroups.push(headerGroup);
	if (depth > 0) constructHeaderGroup(pendingParentHeaders, depth - 1, table, headerFamily, headerGroups, headerGroupInitFns);
}
function updateHeaderSpans(headers) {
	for (let i = 0; i < headers.length; i++) {
		const header = headers[i];
		if (!callMemoOrStaticFn(header.column, "getIsVisible", column_getIsVisible)) continue;
		let colSpan = 0;
		if (header.subHeaders.length) {
			updateHeaderSpans(header.subHeaders);
			for (let j = 0; j < header.subHeaders.length; j++) {
				const child = header.subHeaders[j];
				if (!callMemoOrStaticFn(child.column, "getIsVisible", column_getIsVisible)) continue;
				colSpan += child.colSpan;
			}
		} else colSpan = 1;
		header.colSpan = colSpan;
		if (header.isPlaceholder && header.subHeaders.length === 1 && header.subHeaders[0].column === header.column) {
			let rowSpan = 1;
			let chainChild = header.subHeaders[0];
			while (chainChild) {
				chainChild.rowSpan = 0;
				rowSpan++;
				chainChild = chainChild.subHeaders.length === 1 && chainChild.subHeaders[0].column === header.column ? chainChild.subHeaders[0] : void 0;
			}
			header.rowSpan = rowSpan;
		} else header.rowSpan = 1;
	}
}
/**
* Builds the nested header group structure for a table.
*
* The result accounts for visible leaf columns, pinned column groups, and placeholder headers needed to render multi-level headers.
*/
function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
	const maxDepth = getMaxHeaderDepth(allColumns);
	const headerGroups = [];
	const headerGroupInitFns = table._headerGroupInstanceInitFns;
	const bottomHeaders = new Array(columnsToGroup.length);
	for (let i = 0; i < columnsToGroup.length; i++) {
		if (!(i in columnsToGroup)) continue;
		bottomHeaders[i] = constructHeader(table, columnsToGroup[i], {
			depth: maxDepth,
			index: i
		});
	}
	constructHeaderGroup(bottomHeaders, maxDepth - 1, table, headerFamily, headerGroups, headerGroupInitFns);
	headerGroups.reverse();
	updateHeaderSpans(headerGroups[0]?.headers ?? []);
	return headerGroups;
}

//#endregion
export { buildHeaderGroups };