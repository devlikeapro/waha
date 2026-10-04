import { makeObjectMap } from "../../utils.js";

//#region src/core/rows/constructRow.ts
/**
* Creates or retrieves the row prototype for a table.
* The prototype is cached on the table and shared by all row instances.
*/
function getRowPrototype(table) {
	if (!table._rowPrototype) {
		table._rowPrototype = { table };
		const features = Object.values(table._features);
		for (let i = 0; i < features.length; i++) features[i].assignRowPrototype?.(table._rowPrototype, table);
	}
	return table._rowPrototype;
}
/**
* Constructs a row instance from normalized table internals.
*
* This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
*/
const constructRow = (table, id, original, rowIndex, depth, subRows, parentId) => {
	const rowPrototype = getRowPrototype(table);
	const row = Object.create(rowPrototype);
	row._displayIndexCache = -1;
	row._uniqueValuesCache = makeObjectMap();
	row._valuesCache = makeObjectMap();
	row.depth = depth;
	row.id = id;
	row.index = rowIndex;
	row.original = original;
	row.parentId = parentId;
	row.subRows = subRows ?? [];
	const initFns = table._rowInstanceInitFns;
	for (let i = 0; i < initFns.length; i++) initFns[i](row);
	return row;
};

//#endregion
export { constructRow };