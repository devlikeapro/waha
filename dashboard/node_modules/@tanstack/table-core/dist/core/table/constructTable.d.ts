import { RowData } from "../../types/type-utils.js";
import { TableState } from "../../types/TableState.js";
import { TableOptions } from "../../types/TableOptions.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/table/constructTable.d.ts
/**
 * Builds the initial table state from registered features and user initial state.
 *
 * Each feature contributes its default state before user-provided `initialState` values are merged in.
 */
declare function getInitialTableState<TFeatures extends TableFeatures>(features: TFeatures, initialState?: Partial<TableState<TFeatures>> | undefined): TableState<TFeatures>;
/**
 * Constructs a table instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
declare function constructTable<TFeatures extends TableFeatures, TData extends RowData>(tableOptions: TableOptions<TFeatures, TData>): Table<TFeatures, TData>;
//#endregion
export { constructTable, getInitialTableState };