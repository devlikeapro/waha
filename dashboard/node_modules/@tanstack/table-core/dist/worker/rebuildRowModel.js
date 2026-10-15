import { copyInstancePropertiesWithoutMemos, hasOwn } from "../utils.js";
import { constructRow } from "../core/rows/constructRow.js";

//#region src/worker/rebuildRowModel.ts
function applyFilterData(row, filterData) {
	if (filterData) {
		row.columnFilters = filterData.columnFilters;
		row.columnFiltersMeta = filterData.columnFiltersMeta;
	}
}
function applyFilterDataToCoreRows(coreFlatRows, payload) {
	if (payload.kind === "flat") {
		if (!payload.filterData) return;
		for (let i = 0; i < payload.indices.length; i++) applyFilterData(coreFlatRows[payload.indices[i]], payload.filterData[i]);
		return;
	}
	const applyToNodes = (nodes) => {
		for (const node of nodes) {
			if (typeof node === "number") continue;
			if (!("groupingColumnId" in node)) applyFilterData(coreFlatRows[node.index], node.filterData);
			applyToNodes(node.children);
		}
	};
	applyToNodes(payload.children);
}
function collectLeafRows(subRows, out) {
	for (let i = 0; i < subRows.length; i++) {
		const row = subRows[i];
		if (row.groupingColumnId == null) out.push(row);
		else collectLeafRows(row.subRows, out);
	}
}
function rebuildRowModel(table, payload, stage) {
	const core = table.getCoreRowModel();
	const resetDepths = stage !== "filtered";
	const flattenParentsFirst = stage === "filtered" || stage === "grouped" || stage === "sorted";
	if (payload.kind === "flat") {
		const { indices } = payload;
		const rows = [];
		for (let i = 0; i < indices.length; i++) {
			const row = core.flatRows[indices[i]];
			if (!row) continue;
			if (resetDepths) {
				row.depth = 0;
				row.parentId = void 0;
			}
			applyFilterData(row, payload.filterData?.[i]);
			rows.push(row);
		}
		return {
			rows,
			flatRows: rows,
			rowsById: core.rowsById
		};
	}
	const flatRows = [];
	const rowsById = Object.create(core.rowsById);
	const rebuildRows = (nodes, depth, parentId) => {
		const rows = new Array(nodes.length);
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (typeof node === "number") {
				const row = core.flatRows[node];
				if (!row) continue;
				row.depth = depth;
				row.parentId = parentId;
				flatRows.push(row);
				rows[i] = row;
				continue;
			}
			if (!("groupingColumnId" in node)) {
				const coreRow = core.flatRows[node.index];
				if (!coreRow) continue;
				const flatIndex = flattenParentsFirst ? flatRows.length : -1;
				if (flattenParentsFirst) flatRows.push(void 0);
				const subRows = rebuildRows(node.children, depth + 1, coreRow.id);
				let row = coreRow;
				const subRowsChanged = subRows.length !== coreRow.subRows.length || subRows.some((subRow, index) => subRow !== coreRow.subRows[index]);
				if (stage === "filtered" && coreRow.subRows.length) {
					row = constructRow(table, coreRow.id, coreRow.original, coreRow.index, coreRow.depth, void 0, coreRow.parentId);
					row.subRows = subRows;
				} else if (subRowsChanged) {
					row = Object.create(Object.getPrototypeOf(coreRow));
					copyInstancePropertiesWithoutMemos(row, coreRow);
					row.subRows = subRows;
				}
				applyFilterData(row, node.filterData);
				row.depth = depth;
				row.parentId = parentId;
				if (flattenParentsFirst) flatRows[flatIndex] = row;
				else flatRows.push(row);
				if (row !== coreRow) rowsById[row.id] = row;
				rows[i] = row;
				continue;
			}
			const flatIndex = flattenParentsFirst ? flatRows.length : -1;
			if (flattenParentsFirst) flatRows.push(void 0);
			const subRows = rebuildRows(node.children, depth + 1, node.id);
			const leafRows = [];
			collectLeafRows(subRows, leafRows);
			const row = constructRow(table, node.id, leafRows[0]?.original, node.index, depth, void 0, parentId);
			const aggregates = node.aggregates;
			Object.assign(row, {
				groupingColumnId: node.groupingColumnId,
				groupingValue: node.groupingValue,
				subRows,
				leafRows,
				getValue: (columnId) => hasOwn(aggregates, columnId) ? aggregates[columnId] : void 0
			});
			if (flattenParentsFirst) flatRows[flatIndex] = row;
			else flatRows.push(row);
			rowsById[node.id] = row;
			rows[i] = row;
		}
		return rows.filter((row) => row != null);
	};
	const rows = rebuildRows(payload.children, 0, void 0);
	if (stage === "expanded") {
		flatRows.length = 0;
		const seen = /* @__PURE__ */ new Set();
		const flattenRows = (nestedRows) => {
			for (let i = 0; i < nestedRows.length; i++) {
				const row = nestedRows[i];
				if (seen.has(row.id)) continue;
				seen.add(row.id);
				flatRows.push(row);
				flattenRows(row.subRows);
			}
		};
		flattenRows(rows);
	}
	return {
		rows,
		flatRows,
		rowsById
	};
}

//#endregion
export { applyFilterDataToCoreRows, rebuildRowModel };