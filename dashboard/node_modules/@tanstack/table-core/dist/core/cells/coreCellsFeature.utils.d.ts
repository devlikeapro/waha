import { CellData, NoInfer, RowData } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
import "../../index.js";
//#region src/core/cells/coreCellsFeature.utils.d.ts
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
declare function cell_getValue<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): TValue;
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
declare function cell_renderValue<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): any;
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
declare function cell_getContext<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): {
  table: Table<TFeatures, TData>;
  column: Column<TFeatures, TData, TValue>;
  row: Row<TFeatures, TData>;
  cell: Cell<TFeatures, TData, TValue>;
  getValue: () => NoInfer<TValue>;
  renderValue: () => NoInfer<TValue | null>;
};
//#endregion
export { cell_getContext, cell_getValue, cell_renderValue };