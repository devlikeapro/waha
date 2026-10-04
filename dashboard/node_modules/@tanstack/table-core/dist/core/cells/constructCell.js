//#region src/core/cells/constructCell.ts
/**
* Creates or retrieves the cell prototype for a table.
* The prototype is cached on the table and shared by all cell instances.
*/
function getCellPrototype(table) {
	if (!table._cellPrototype) {
		table._cellPrototype = { table };
		const features = Object.values(table._features);
		for (let i = 0; i < features.length; i++) features[i].assignCellPrototype?.(table._cellPrototype, table);
	}
	return table._cellPrototype;
}
/**
* Constructs a cell instance from normalized table internals.
*
* This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
*/
function constructCell(column, row, table) {
	const cellPrototype = getCellPrototype(table);
	const cell = Object.create(cellPrototype);
	cell.column = column;
	cell.id = `${row.id}_${column.id}`;
	cell.row = row;
	const initFns = table._cellInstanceInitFns;
	for (let i = 0; i < initFns.length; i++) initFns[i](cell);
	return cell;
}

//#endregion
export { constructCell };