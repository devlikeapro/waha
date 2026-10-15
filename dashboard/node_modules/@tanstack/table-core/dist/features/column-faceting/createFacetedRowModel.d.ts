import { RowData } from "../../types/type-utils.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-faceting/createFacetedRowModel.d.ts
/**
 * Creates a memoized faceted row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
declare function createFacetedRowModel<TFeatures extends TableFeatures, TData extends RowData = any>(): (table: Table<TFeatures, TData>, columnId: string) => () => RowModel<TFeatures, TData>;
//#endregion
export { createFacetedRowModel };