import { RowData } from "../../types/type-utils.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/rows/constructRow.d.ts
/**
 * Constructs a row instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
declare const constructRow: <TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, id: string, original: TData, rowIndex: number, depth: number, subRows?: Array<Row<TFeatures, TData>>, parentId?: string) => Row<TFeatures, TData>;
//#endregion
export { constructRow };