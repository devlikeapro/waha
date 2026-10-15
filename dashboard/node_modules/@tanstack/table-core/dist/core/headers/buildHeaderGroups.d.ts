import { CellData, RowData } from "../../types/type-utils.js";
import { HeaderGroup } from "../../types/HeaderGroup.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/headers/buildHeaderGroups.d.ts
/**
 * Builds the nested header group structure for a table.
 *
 * The result accounts for visible leaf columns, pinned column groups, and placeholder headers needed to render multi-level headers.
 */
declare function buildHeaderGroups<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(allColumns: Array<Column<TFeatures, TData, TValue>>, columnsToGroup: Array<Column<TFeatures, TData, TValue>>, table: Table<TFeatures, TData>, headerFamily?: 'center' | 'start' | 'end'): HeaderGroup<TFeatures, TData>[];
//#endregion
export { buildHeaderGroups };