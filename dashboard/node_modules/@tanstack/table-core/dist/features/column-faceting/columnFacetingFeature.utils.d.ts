import { CellData, RowData } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-faceting/columnFacetingFeature.utils.d.ts
/**
 * Computes min and max numeric facet values for one column.
 *
 * The configured `facetedMinMaxValues` row-model factory owns the calculation.
 * If no factory is registered, the result is `undefined`.
 *
 * @example
 * ```ts
 * const range = column_getFacetedMinMaxValues(column, table)
 * ```
 */
declare function column_getFacetedMinMaxValues<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>): [number, number] | undefined;
/**
 * Computes the row model used to derive one column's facet values.
 *
 * The faceted row model normally applies every other active filter while
 * excluding this column's own filter. If no factory is registered, the
 * pre-filtered row model is returned.
 *
 * @example
 * ```ts
 * const rows = column_getFacetedRowModel(column, table)
 * ```
 */
declare function column_getFacetedRowModel<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue> | undefined, table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Computes unique facet values and their occurrence counts for one column.
 *
 * The configured `facetedUniqueValues` row-model factory owns the calculation.
 * If no factory is registered, an empty `Map` is returned.
 *
 * @example
 * ```ts
 * const values = column_getFacetedUniqueValues(column, table)
 * ```
 */
declare function column_getFacetedUniqueValues<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>): Map<any, number>;
/**
 * Computes min and max numeric facet values for the global filter context.
 *
 * The global context is requested with the internal `__global__` column id. If
 * no factory is registered, the result is `undefined`.
 *
 * @example
 * ```ts
 * const range = table_getGlobalFacetedMinMaxValues(table)
 * ```
 */
declare function table_getGlobalFacetedMinMaxValues<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): undefined | [number, number];
/**
 * Computes the row model used to derive global facet values.
 *
 * The global context is requested with the internal `__global__` column id. If
 * no faceted row-model factory is registered, the pre-filtered row model is
 * returned.
 *
 * @example
 * ```ts
 * const rows = table_getGlobalFacetedRowModel(table)
 * ```
 */
declare function table_getGlobalFacetedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Computes unique values and occurrence counts for the global filter context.
 *
 * The global context is requested with the internal `__global__` column id. If
 * no factory is registered, an empty `Map` is returned.
 *
 * @example
 * ```ts
 * const values = table_getGlobalFacetedUniqueValues(table)
 * ```
 */
declare function table_getGlobalFacetedUniqueValues<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Map<any, number>;
//#endregion
export { column_getFacetedMinMaxValues, column_getFacetedRowModel, column_getFacetedUniqueValues, table_getGlobalFacetedMinMaxValues, table_getGlobalFacetedRowModel, table_getGlobalFacetedUniqueValues };