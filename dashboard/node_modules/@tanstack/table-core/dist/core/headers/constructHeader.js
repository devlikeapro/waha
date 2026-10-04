//#region src/core/headers/constructHeader.ts
/**
* Creates or retrieves the header prototype for a table.
* The prototype is cached on the table and shared by all header instances.
*/
function getHeaderPrototype(table) {
	if (!table._headerPrototype) {
		table._headerPrototype = { table };
		const features = Object.values(table._features);
		for (let i = 0; i < features.length; i++) features[i].assignHeaderPrototype?.(table._headerPrototype, table);
	}
	return table._headerPrototype;
}
/**
* Constructs a header instance from normalized table internals.
*
* This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
*/
function constructHeader(table, column, options) {
	const headerPrototype = getHeaderPrototype(table);
	const header = Object.create(headerPrototype);
	header.colSpan = 0;
	header.column = column;
	header.depth = options.depth;
	header.headerGroup = null;
	header.id = options.id ?? column.id;
	header.index = options.index;
	header.isPlaceholder = !!options.isPlaceholder;
	header.placeholderId = options.placeholderId;
	header.rowSpan = 0;
	header.subHeaders = [];
	const initFns = table._headerInstanceInitFns;
	for (let i = 0; i < initFns.length; i++) initFns[i](header);
	return header;
}

//#endregion
export { constructHeader };