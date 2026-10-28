import { CellData, RowData } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/cells/constructCell.d.ts
/**
 * Constructs a cell instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
declare function constructCell<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, row: Row<TFeatures, TData>, table: Table<TFeatures, TData>): Cell<TFeatures, TData, TValue>;
//#endregion
export { constructCell };