//#region src/core/columns/constructColumn.ts
/**
* Creates or retrieves the column prototype for a table.
* The prototype is cached on the table and shared by all column instances.
*/
function getColumnPrototype(table) {
	if (!table._columnPrototype) {
		table._columnPrototype = { table };
		const features = Object.values(table._features);
		for (let i = 0; i < features.length; i++) features[i].assignColumnPrototype?.(table._columnPrototype, table);
	}
	return table._columnPrototype;
}
/**
* Constructs a column instance from normalized table internals.
*
* This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
*/
function constructColumn(table, columnDef, depth, parent) {
	const resolvedColumnDef = {
		...table.getDefaultColumnDef(),
		...columnDef
	};
	const accessorKey = resolvedColumnDef.accessorKey;
	const accessorKeyString = accessorKey === void 0 ? void 0 : String(accessorKey);
	const id = resolvedColumnDef.id ?? accessorKeyString?.replaceAll(".", "_") ?? (typeof resolvedColumnDef.header === "string" ? resolvedColumnDef.header : void 0);
	let accessorFn;
	if (resolvedColumnDef.accessorFn) accessorFn = resolvedColumnDef.accessorFn;
	else if (accessorKey !== void 0) if (typeof accessorKey === "string" && accessorKey.includes(".")) {
		const keys = accessorKey.split(".");
		accessorFn = (originalRow) => {
			let result = originalRow;
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				result = result?.[key];
				if (process.env.NODE_ENV === "development" && result === void 0) console.warn(`"${key}" in deeply nested key "${accessorKey}" returned undefined.`);
			}
			return result;
		};
	} else accessorFn = (originalRow) => originalRow[resolvedColumnDef.accessorKey];
	if (!id) {
		if (process.env.NODE_ENV === "development") throw new Error(resolvedColumnDef.accessorFn ? `coreColumnsFeature require an id when using an accessorFn` : `coreColumnsFeature require an id when using a non-string header`);
		throw new Error();
	}
	const columnPrototype = getColumnPrototype(table);
	const column = Object.create(columnPrototype);
	column.accessorFn = accessorFn;
	column.columnDef = resolvedColumnDef;
	column.columns = [];
	column.depth = depth;
	column.id = `${String(id)}`;
	column.parent = parent;
	const initFns = table._columnInstanceInitFns;
	for (let i = 0; i < initFns.length; i++) initFns[i](column);
	return column;
}

//#endregion
export { constructColumn };