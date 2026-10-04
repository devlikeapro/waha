//#region src/worker/serializeRowModel.ts
function isCloneSafe(value) {
	return typeof value !== "function" && typeof value !== "symbol";
}
function serializeRows(rows, coreIndexById, coreFlatRows, aggregateColumnIds, stage) {
	const nodes = new Array(rows.length);
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		if (row.groupingColumnId == null) {
			const index = coreIndexById[row.id];
			const coreRow = coreFlatRows[index];
			nodes[i] = stage === "filtered" || row.subRows.length || coreRow.subRows.length ? {
				index,
				children: serializeRows(row.subRows, coreIndexById, coreFlatRows, aggregateColumnIds, stage),
				...stage === "filtered" ? { filterData: serializeFilterData(row) } : {}
			} : index;
			continue;
		}
		const aggregates = {};
		for (let c = 0; c < aggregateColumnIds.length; c++) {
			const columnId = aggregateColumnIds[c];
			const value = row.getValue(columnId);
			if (value !== void 0 && isCloneSafe(value)) aggregates[columnId] = value;
		}
		if (!(row.groupingColumnId in aggregates)) {
			const value = row.getValue(row.groupingColumnId);
			if (value !== void 0 && isCloneSafe(value)) aggregates[row.groupingColumnId] = value;
		}
		nodes[i] = {
			id: row.id,
			groupingColumnId: row.groupingColumnId,
			groupingValue: row.groupingValue,
			index: row.index,
			aggregates,
			children: serializeRows(row.subRows, coreIndexById, coreFlatRows, aggregateColumnIds, stage)
		};
	}
	return nodes;
}
function serializeRowModel(model, coreIndexById, coreFlatRows, aggregateColumnIds, transfer, stage) {
	if (model.flatRows.length === model.rows.length && model.rows.every((row) => {
		const coreRow = coreFlatRows[coreIndexById[row.id]];
		return row.groupingColumnId == null && !coreRow.subRows.length;
	})) {
		const indices = new Uint32Array(model.rows.length);
		const filterData = stage === "filtered" ? new Array(model.rows.length) : void 0;
		for (let i = 0; i < indices.length; i++) {
			indices[i] = coreIndexById[model.rows[i].id];
			if (filterData) filterData[i] = serializeFilterData(model.rows[i]);
		}
		transfer.push(indices.buffer);
		return {
			kind: "flat",
			indices,
			filterData
		};
	}
	return {
		kind: "tree",
		children: serializeRows(model.rows, coreIndexById, coreFlatRows, aggregateColumnIds, stage)
	};
}
function serializeFilterData(row) {
	return {
		columnFilters: row.columnFilters,
		columnFiltersMeta: row.columnFiltersMeta
	};
}

//#endregion
export { serializeRowModel };