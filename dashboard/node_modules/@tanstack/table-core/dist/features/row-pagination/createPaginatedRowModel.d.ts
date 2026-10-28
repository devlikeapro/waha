import { RowData } from "../../types/type-utils.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-pagination/createPaginatedRowModel.d.ts
/**
 * Creates a memoized paginated row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
declare function createPaginatedRowModel<TFeatures extends TableFeatures, TData extends RowData = any>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>;
//#endregion
export { createPaginatedRowModel };