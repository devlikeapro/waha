import { callMemoOrStaticFn, makeObjectMap } from "../../utils.js";
import { table_getOrderColumnsFn } from "../../features/column-ordering/columnOrderingFeature.utils.js";
import { constructColumn } from "./constructColumn.js";

//#region src/core/columns/coreColumnsFeature.utils.ts
/**
* Flattens this column and every descendant column into a single array.
*
* Group columns appear before their child columns, which matches the normalized
* column hierarchy produced during table construction.
*
* @example
* ```ts
* const flatColumns = column_getFlatColumns(column)
* ```
*/
function column_getFlatColumns(column) {
	return [column, ...column.columns.flatMap((col) => col.getFlatColumns())];
}
/**
* Collects the terminal leaf columns below this column.
*
* Group columns return their ordered descendants. Non-group columns return an
* array containing only the column itself.
*
* @example
* ```ts
* const leafColumns = column_getLeafColumns(column)
* ```
*/
function column_getLeafColumns(column) {
	if (column.columns.length) {
		const leafColumns = column.columns.flatMap((col) => col.getLeafColumns());
		return callMemoOrStaticFn(column.table, "getOrderColumns", table_getOrderColumnsFn)(leafColumns);
	}
	return [column];
}
/**
* Merges built-in, feature, and user default column definitions.
*
* Built-in defaults provide a header and fallback cell renderer, feature
* defaults can add feature-specific column options, and
* `options.defaultColumn` wins last.
*
* @example
* ```ts
* const defaultColumn = table_getDefaultColumnDef(table)
* ```
*/
function table_getDefaultColumnDef(table) {
	return {
		header: (props) => {
			const resolvedColumnDef = props.header.column.columnDef;
			if (resolvedColumnDef.accessorKey) return resolvedColumnDef.accessorKey;
			if (resolvedColumnDef.accessorFn) return resolvedColumnDef.id;
			return null;
		},
		cell: (props) => props.renderValue()?.toString?.() ?? null,
		...Object.values(table._features).reduce((obj, feature) => {
			return Object.assign(obj, feature.getDefaultColumnDef?.());
		}, {}),
		...table.options.defaultColumn
	};
}
function constructColumns(table, columnDefs, parent, depth = 0) {
	const columns = new Array(columnDefs.length);
	for (let i = 0; i < columnDefs.length; i++) {
		if (!(i in columnDefs)) continue;
		const columnDef = columnDefs[i];
		const column = constructColumn(table, columnDef, depth, parent);
		const groupingColumnDef = columnDef;
		column.columns = groupingColumnDef.columns ? constructColumns(table, groupingColumnDef.columns, column, depth + 1) : [];
		columns[i] = column;
	}
	return columns;
}
/**
* Normalizes `options.columns` into the table's nested column tree.
*
* Each column definition is constructed with its parent and depth, and group
* column children are recursively constructed.
*
* @example
* ```ts
* const columns = table_getAllColumns(table)
* ```
*/
function table_getAllColumns(table) {
	return constructColumns(table, table.options.columns);
}
/**
* Flattens every table column, including group columns and leaf columns.
*
* Use this when parent/group columns must be included in addition to data leaf
* columns.
*
* @example
* ```ts
* const flatColumns = table_getAllFlatColumns(table)
* ```
*/
function table_getAllFlatColumns(table) {
	return table.getAllColumns().flatMap((column) => column.getFlatColumns());
}
/**
* Builds an id lookup for every flat column in the table.
*
* Group columns and leaf columns are included. Later columns with the same id
* replace earlier entries.
*
* @example
* ```ts
* const columnsById = table_getAllFlatColumnsById(table)
* ```
*/
function table_getAllFlatColumnsById(table) {
	const result = makeObjectMap();
	const flatColumns = table.getAllFlatColumns();
	for (let i = 0; i < flatColumns.length; i++) {
		const column = flatColumns[i];
		result[column.id] = column;
	}
	return result;
}
/**
* Collects all terminal leaf columns in their current table order.
*
* Column ordering features can reorder the collected leaves before the result
* is returned.
*
* @example
* ```ts
* const leafColumns = table_getAllLeafColumns(table)
* ```
*/
function table_getAllLeafColumns(table) {
	const leafColumns = table.getAllColumns().flatMap((c) => c.getLeafColumns());
	return callMemoOrStaticFn(table, "getOrderColumns", table_getOrderColumnsFn)(leafColumns);
}
/**
* Builds an id lookup for terminal leaf columns only.
*
* Parent/group columns are excluded, making this lookup appropriate for row
* cells and feature state keyed by data columns.
*
* @example
* ```ts
* const leavesById = table_getAllLeafColumnsById(table)
* ```
*/
function table_getAllLeafColumnsById(table) {
	const result = makeObjectMap();
	const leafColumns = table.getAllLeafColumns();
	for (let i = 0; i < leafColumns.length; i++) {
		const column = leafColumns[i];
		result[column.id] = column;
	}
	return result;
}
/**
* Looks up a column by id from the flat column map.
*
* The lookup can return group columns or leaf columns. In development, a
* missing id logs a warning to help catch stale column references.
*
* @example
* ```ts
* const column = table_getColumn(table, 'firstName')
* ```
*/
function table_getColumn(table, columnId) {
	const column = table.getAllFlatColumnsById()[columnId];
	if (process.env.NODE_ENV === "development" && !column) console.warn(`[Table] Column with id '${columnId}' does not exist.`);
	return column;
}

//#endregion
export { column_getFlatColumns, column_getLeafColumns, table_getAllColumns, table_getAllFlatColumns, table_getAllFlatColumnsById, table_getAllLeafColumns, table_getAllLeafColumnsById, table_getColumn, table_getDefaultColumnDef };