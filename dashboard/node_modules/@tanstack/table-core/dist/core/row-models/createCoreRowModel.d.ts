import { RowData } from "../../types/type-utils.js";
import { RowModel } from "./coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/row-models/createCoreRowModel.d.ts
/**
 * Creates a memoized core row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
declare function createCoreRowModel<TFeatures extends TableFeatures, TData extends RowData>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>;
//#endregion
export { createCoreRowModel };