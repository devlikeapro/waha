import { CellData, RowData } from "../../types/type-utils.js";
import { ColumnDef } from "../../types/ColumnDef.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/columns/constructColumn.d.ts
/**
 * Constructs a column instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
declare function constructColumn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(table: Table<TFeatures, TData>, columnDef: ColumnDef<TFeatures, TData, TValue>, depth: number, parent?: Column<TFeatures, TData, TValue>): Column<TFeatures, TData, TValue>;
//#endregion
export { constructColumn };