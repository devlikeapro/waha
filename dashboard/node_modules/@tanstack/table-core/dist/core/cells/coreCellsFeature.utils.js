//#region src/core/cells/coreCellsFeature.utils.ts
/**
* Reads this cell's accessor value from its owning row and column.
*
* This is the standalone implementation behind `cell.getValue()`, useful when
* importing static APIs instead of calling methods from the cell prototype.
*
* @example
* ```ts
* const value = cell_getValue(cell)
* ```
*/
function cell_getValue(cell) {
	return cell.row.getValue(cell.column.id);
}
/**
* Reads the value that should be rendered for this cell.
*
* Nullish accessor values are replaced with `table.options.renderFallbackValue`,
* matching the behavior of `cell.renderValue()`.
*
* @example
* ```ts
* const rendered = cell_renderValue(cell)
* ```
*/
function cell_renderValue(cell) {
	return cell.getValue() ?? cell.table.options.renderFallbackValue;
}
/**
* Builds the render context passed to a column's `cell` template.
*
* The returned object includes stable references to the table, row, column, and
* cell, plus bound `getValue` and `renderValue` helpers for render functions.
*
* @example
* ```ts
* const context = cell_getContext(cell)
* ```
*/
function cell_getContext(cell) {
	return {
		table: cell.table,
		column: cell.column,
		row: cell.row,
		cell,
		getValue: () => cell.getValue(),
		renderValue: () => cell.renderValue()
	};
}

//#endregion
export { cell_getContext, cell_getValue, cell_renderValue };