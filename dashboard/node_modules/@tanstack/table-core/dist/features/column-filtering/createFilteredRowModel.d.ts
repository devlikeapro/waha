import { RowData } from "../../types/type-utils.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-filtering/createFilteredRowModel.d.ts
/**
 * Creates a memoized filtered row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 *
 * Register the filter functions you use with the `filterFns` slot on the
 * `features` option:
 * `tableFeatures({ columnFilteringFeature, filteredRowModel: createFilteredRowModel(), filterFns: { includesString: filterFn_includesString } })`.
 * Importing individual `filterFn_*` functions keeps unused built-ins out of
 * your bundle; filter functions passed directly to the `filterFn` column
 * option need no registration at all.
 */
declare function createFilteredRowModel<TFeatures extends TableFeatures, TData extends RowData = any>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>;
//#endregion
export { createFilteredRowModel };