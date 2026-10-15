import { hasOwn, makeObjectMap } from "../../utils.js";

//#region src/features/row-aggregation/rowAggregationFeature.utils.ts
function isAggregationFnDef(value) {
	return !!value && typeof value === "object" && "aggregate" in value;
}
function isAggregationFnDescriptor(value) {
	return !!value && typeof value === "object" && "id" in value && "aggregationFn" in value;
}
function warn(message) {
	if (process.env.NODE_ENV === "development") console.warn(message);
}
function resolveMaxAggregationDepth(maxDepth) {
	return maxDepth === void 0 || Number.isNaN(maxDepth) ? 0 : Math.max(0, Math.floor(maxDepth));
}
function collectNormalizedAggregationRow(row, depth, maxDepth, seen, result) {
	if (row.subRows.length && depth < maxDepth) {
		for (let i = 0; i < row.subRows.length; i++) collectNormalizedAggregationRow(row.subRows[i], depth + 1, maxDepth, seen, result);
		return;
	}
	if (!seen.has(row.id)) {
		seen.add(row.id);
		result.push(row);
	}
}
function collectUniqueAggregationRow(row, depth, maxDepth, result) {
	if (row.subRows.length && depth < maxDepth) {
		for (let i = 0; i < row.subRows.length; i++) collectUniqueAggregationRow(row.subRows[i], depth + 1, maxDepth, result);
		return;
	}
	result.push(row);
}
/**
* Selects unique rows at a maximum relative depth in encounter order.
* Branches that end before the requested depth contribute their deepest row.
*/
function normalizeAggregationRows(rows, maxDepth = 0) {
	const result = [];
	const seen = /* @__PURE__ */ new Set();
	const normalizedMaxDepth = resolveMaxAggregationDepth(maxDepth);
	for (let i = 0; i < rows.length; i++) collectNormalizedAggregationRow(rows[i], 0, normalizedMaxDepth, seen, result);
	return result;
}
/**
* Frontier selection for rows that are distinct nodes of a single row tree —
* the row models the table builds itself. Skips `normalizeAggregationRows`'
* duplicate-id guard (disjoint subtrees cannot revisit a row) and returns
* `rows` unchanged when no row descends, so the default `maxDepth: 0` case
* costs nothing per aggregation.
*/
function normalizeUniqueAggregationRows(rows, maxDepth = 0) {
	const normalizedMaxDepth = resolveMaxAggregationDepth(maxDepth);
	let needsDescent = false;
	if (normalizedMaxDepth > 0) {
		for (let i = 0; i < rows.length; i++) if (rows[i].subRows.length) {
			needsDescent = true;
			break;
		}
	}
	if (!needsDescent) return rows;
	const result = [];
	for (let i = 0; i < rows.length; i++) collectUniqueAggregationRow(rows[i], 0, normalizedMaxDepth, result);
	return result;
}
function getAutoAggregationFnName(value) {
	if (typeof value === "number") return "sum";
	if (value instanceof Date && !Number.isNaN(value.getTime())) return "extent";
}
/** Resolves the `sum` or `extent` definition inferred from the first core row. */
function column_getAutoAggregationFn(column) {
	const value = column.table.getCoreRowModel().flatRows[0]?.getValue(column.id);
	const name = getAutoAggregationFnName(value);
	if (!name) return void 0;
	const aggregationFn = column.table._rowModelFns.aggregationFns?.[name];
	if (!aggregationFn) warn(`aggregationFn '${name}' (auto) for column '${column.id}' is not registered`);
	return aggregationFn;
}
function resolveAggregationFn(column, ref) {
	if (isAggregationFnDef(ref)) return ref;
	if (ref === "auto") return column_getAutoAggregationFn(column);
	const aggregationFn = column.table._rowModelFns.aggregationFns?.[ref];
	if (!aggregationFn) warn(`aggregationFn '${String(ref)}' for column '${column.id}' is not registered`);
	return aggregationFn;
}
/** Resolves and validates a column's scalar or multiple aggregation option. */
function column_getAggregationFns(column) {
	const option = column.columnDef.aggregationFn;
	const registry = column.table._rowModelFns.aggregationFns;
	const coreRowModel = column.table.getCoreRowModel();
	const previous = column._resolvedAggregationFnsCache;
	if (previous && previous.option === option && previous.registry === registry && previous.coreRowModel === coreRowModel) return previous.value;
	const finish = (value) => {
		column._resolvedAggregationFnsCache = {
			coreRowModel,
			option,
			registry,
			value
		};
		return value;
	};
	if (option == null) return finish([]);
	if (!Array.isArray(option)) return finish([{
		aggregationFn: resolveAggregationFn(column, option),
		id: typeof option === "string" ? option : void 0
	}]);
	const ids = makeObjectMap();
	for (let i = 0; i < option.length; i++) {
		const item = option[i];
		const id = typeof item === "string" ? item : isAggregationFnDescriptor(item) ? item.id : void 0;
		if (id !== void 0) ids[id] = (ids[id] ?? 0) + 1;
	}
	const resolved = [];
	for (let i = 0; i < option.length; i++) {
		const item = option[i];
		const id = typeof item === "string" ? item : isAggregationFnDescriptor(item) ? item.id : void 0;
		if (id === void 0) {
			warn(`aggregationFn at index ${i} for column '${column.id}' needs a stable id`);
			resolved.push({
				aggregationFn: void 0,
				id: void 0
			});
			continue;
		}
		if (ids[id] > 1) {
			warn(`aggregationFn id '${id}' for column '${column.id}' is duplicated`);
			resolved.push({
				aggregationFn: void 0,
				id
			});
			continue;
		}
		const ref = isAggregationFnDescriptor(item) ? item.aggregationFn : item;
		resolved.push({
			aggregationFn: resolveAggregationFn(column, ref),
			id
		});
	}
	return finish(resolved);
}
function getSubRowResult(subRowValue, isMultiple, id) {
	if (!isMultiple) return subRowValue;
	if (!id || !subRowValue || typeof subRowValue !== "object") return void 0;
	return hasOwn(subRowValue, id) ? subRowValue[id] : void 0;
}
/** Executes every configured aggregation over a depth-selected row frontier. */
function aggregateColumnValue(args) {
	const { subRows, column, groupingRow, rows, uniqueRows } = args;
	const internalColumn = column;
	const maxDepth = resolveMaxAggregationDepth(args.maxDepth ?? internalColumn.columnDef.maxAggregationDepth);
	const aggregationRows = uniqueRows ? normalizeUniqueAggregationRows(rows, maxDepth) : normalizeAggregationRows(rows, maxDepth);
	const entries = column_getAggregationFns(internalColumn);
	const isMultiple = Array.isArray(internalColumn.columnDef.aggregationFn);
	const canMerge = !!subRows?.length && subRows.every((row) => !!row.groupingColumnId && row.groupingColumnId !== column.id);
	const getValue = (row) => row.getValue(column.id);
	const execute = (entry) => {
		const definition = entry.aggregationFn;
		if (!definition) return void 0;
		const context = {
			...subRows ? { subRows } : {},
			column,
			columnId: column.id,
			getValue,
			...groupingRow ? { groupingRow } : {},
			maxDepth,
			rows: aggregationRows,
			table: column.table
		};
		if (canMerge && definition.merge) return definition.merge({
			...context,
			subRowResults: subRows.map((row) => getSubRowResult(row.getValue(column.id), isMultiple, entry.id)),
			subRows
		});
		return definition.aggregate(context);
	};
	if (!isMultiple) return entries[0] ? execute(entries[0]) : void 0;
	const result = makeObjectMap();
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		if (entry.id !== void 0) result[entry.id] = execute(entry);
	}
	return result;
}
/** Implements `column.getAggregationValue(options?)` and its default cache. */
function column_getAggregationValue(column, options) {
	const rows = options?.rows;
	const resolvedMaxDepth = resolveMaxAggregationDepth(options?.maxDepth ?? column.columnDef.maxAggregationDepth);
	const providedResult = column.columnDef.getAggregationValue?.({
		column,
		maxDepth: resolvedMaxDepth,
		rows,
		table: column.table
	});
	if (providedResult) return providedResult.value;
	if (column.table.options.manualAggregation) return void 0;
	if (rows !== void 0) return aggregateColumnValue({
		column,
		maxDepth: resolvedMaxDepth,
		rows
	});
	const model = column.table.getPreGroupedRowModel();
	const previous = column._aggregationValueCache;
	const registry = column.table._rowModelFns.aggregationFns;
	const aggregationFnOption = column.columnDef.aggregationFn;
	if (previous && previous.dependency === model && previous.maxDepth === resolvedMaxDepth && previous.registry === registry && previous.aggregationFnOption === aggregationFnOption) return previous.value;
	const value = aggregateColumnValue({
		column,
		maxDepth: resolvedMaxDepth,
		rows: model.rows,
		uniqueRows: true
	});
	column._aggregationValueCache = {
		aggregationFnOption,
		dependency: model,
		maxDepth: resolvedMaxDepth,
		registry,
		value
	};
	return value;
}
/** Implements `cell.getIsAggregated()` for synthetic grouped rows. */
function cell_getIsAggregated(cell) {
	const groupingColumnId = cell.row.groupingColumnId;
	if (!groupingColumnId || groupingColumnId === cell.column.id) return false;
	if ((cell.column.table.atoms.grouping?.get?.())?.includes(cell.column.id)) return false;
	return column_getAggregationFns(cell.column).some((entry) => !!entry.aggregationFn);
}
/** Formats the default scalar or keyed aggregated-cell representation. */
function formatAggregatedCellValue(value, option) {
	if (value == null) return null;
	if (Array.isArray(option) && typeof value === "object") return Object.keys(value).map((key) => `${key}: ${String(value[key])}`).join(", ");
	return String(value);
}

//#endregion
export { aggregateColumnValue, cell_getIsAggregated, column_getAggregationFns, column_getAggregationValue, column_getAutoAggregationFn, formatAggregatedCellValue, normalizeAggregationRows, normalizeUniqueAggregationRows };