import { RowData } from "../../types/type-utils.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-sorting/createSortedRowModel.d.ts
/**
 * Creates a memoized sorted row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 *
 * Register the sorting functions you use with the `sortFns` slot on the
 * `features` option:
 * `tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns: { alphanumeric: sortFn_alphanumeric } })`.
 * Importing individual `sortFn_*` functions keeps unused built-ins out of
 * your bundle; sorting functions passed directly to the `sortFn` column
 * option need no registration at all.
 */
declare function createSortedRowModel<TFeatures extends TableFeatures, TData extends RowData>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>;
//#endregion
export { createSortedRowModel };