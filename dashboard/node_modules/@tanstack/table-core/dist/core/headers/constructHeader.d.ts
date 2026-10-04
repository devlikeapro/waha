import { CellData, RowData } from "../../types/type-utils.js";
import { Header } from "../../types/Header.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/headers/constructHeader.d.ts
/**
 * Constructs a header instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
declare function constructHeader<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(table: Table<TFeatures, TData>, column: Column<TFeatures, TData, TValue>, options: {
  id?: string;
  isPlaceholder?: boolean;
  placeholderId?: string;
  index: number;
  depth: number;
}): Header<TFeatures, TData, TValue>;
//#endregion
export { constructHeader };