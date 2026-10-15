import { RowData } from "../../types/type-utils.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-grouping/createGroupedRowModel.d.ts
/**
 * Creates a memoized grouped row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 *
 * When rowAggregationFeature is also registered, grouped rows use its shared
 * executor for non-group values. Grouping remains useful without aggregation.
 */
declare function createGroupedRowModel<TFeatures extends TableFeatures, TData extends RowData = any>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>;
//#endregion
export { createGroupedRowModel };