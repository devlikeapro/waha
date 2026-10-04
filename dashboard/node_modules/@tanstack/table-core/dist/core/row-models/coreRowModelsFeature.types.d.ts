import { RowData } from "../../types/type-utils.js";
import { Table_RowModels_Sorted } from "../../features/row-sorting/rowSortingFeature.types.js";
import { Table_RowModels_Grouped } from "../../features/column-grouping/columnGroupingFeature.types.js";
import { Table_RowModels_Expanded } from "../../features/row-expanding/rowExpandingFeature.types.js";
import { Row } from "../../types/Row.js";
import { Table_RowModels_Filtered } from "../../features/column-filtering/columnFilteringFeature.types.js";
import { Table_RowModels_Paginated } from "../../features/row-pagination/rowPaginationFeature.types.js";
import { Table_RowModels_Faceted } from "../../features/column-faceting/columnFacetingFeature.types.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/row-models/coreRowModelsFeature.types.d.ts
interface RowModel<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  rows: Array<Row<TFeatures, TData>>;
  flatRows: Array<Row<TFeatures, TData>>;
  rowsById: Record<string, Row<TFeatures, TData>>;
}
interface CachedRowModel_Core<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  coreRowModel: () => RowModel<TFeatures, TData>;
}
interface Table_RowModels_Core<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  /**
   * Returns the core row model before any processing has been applied.
   */
  getCoreRowModel: () => RowModel<TFeatures, TData>;
  /**
   * Returns the final model after all processing from other used features has been applied. This is the row model that is most commonly used for rendering.
   */
  getRowModel: () => RowModel<TFeatures, TData>;
}
type Table_RowModels<TFeatures extends TableFeatures, TData extends RowData> = Table_RowModels_Core<TFeatures, TData> & Table_RowModels_Faceted<TFeatures, TData> & Table_RowModels_Filtered<TFeatures, TData> & Table_RowModels_Grouped<TFeatures, TData> & Table_RowModels_Expanded<TFeatures, TData> & Table_RowModels_Paginated<TFeatures, TData> & Table_RowModels_Sorted<TFeatures, TData>;
//#endregion
export { CachedRowModel_Core, RowModel, Table_RowModels, Table_RowModels_Core };