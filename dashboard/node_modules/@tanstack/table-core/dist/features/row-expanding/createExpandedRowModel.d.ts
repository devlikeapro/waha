import { RowData } from "../../types/type-utils.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-expanding/createExpandedRowModel.d.ts
/**
 * Creates a memoized expanded row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
declare function createExpandedRowModel<TFeatures extends TableFeatures, TData extends RowData = any>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>;
/**
 * Expands a row model according to the current expanded row state.
 *
 * Expanded sub-rows are inserted into the flattened row order while preserving the original row hierarchy.
 */
declare function expandRows<TFeatures extends TableFeatures, TData extends RowData = any>(rowModel: RowModel<TFeatures, TData>): RowModel<TFeatures, TData>;
//#endregion
export { createExpandedRowModel, expandRows };