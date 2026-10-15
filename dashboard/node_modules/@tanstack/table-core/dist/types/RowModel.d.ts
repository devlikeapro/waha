import { RowData } from "./type-utils.js";
import { CachedRowModel_Sorted } from "../features/row-sorting/rowSortingFeature.types.js";
import { CachedRowModel_Grouped } from "../features/column-grouping/columnGroupingFeature.types.js";
import { CachedRowModel_Expanded } from "../features/row-expanding/rowExpandingFeature.types.js";
import { CachedRowModel_Filtered } from "../features/column-filtering/columnFilteringFeature.types.js";
import { CachedRowModel_Paginated } from "../features/row-pagination/rowPaginationFeature.types.js";
import { CachedRowModel_Core } from "../core/row-models/coreRowModelsFeature.types.js";
import { CachedRowModel_Faceted } from "../features/column-faceting/columnFacetingFeature.types.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
//#region src/types/RowModel.d.ts
interface CachedRowModels_FeatureMap<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  columnFacetingFeature: CachedRowModel_Faceted<TFeatures, TData>;
  columnFilteringFeature: CachedRowModel_Filtered<TFeatures, TData>;
  rowExpandingFeature: CachedRowModel_Expanded<TFeatures, TData>;
  columnGroupingFeature: CachedRowModel_Grouped<TFeatures, TData>;
  rowPaginationFeature: CachedRowModel_Paginated<TFeatures, TData>;
  rowSortingFeature: CachedRowModel_Sorted<TFeatures, TData>;
}
type CachedRowModels<TFeatures extends TableFeatures, TData extends RowData> = Partial<CachedRowModel_Core<TFeatures, TData>> & ExtractFeatureMapTypes<TFeatures, CachedRowModels_FeatureMap<TFeatures, TData>>;
interface CachedRowModel_All<in out TFeatures extends TableFeatures, in out TData extends RowData = any> extends Partial<CachedRowModel_Core<TFeatures, TData> & CachedRowModel_Expanded<TFeatures, TData> & CachedRowModel_Faceted<TFeatures, TData> & CachedRowModel_Filtered<TFeatures, TData> & CachedRowModel_Grouped<TFeatures, TData> & CachedRowModel_Paginated<TFeatures, TData> & CachedRowModel_Sorted<TFeatures, TData>> {}
//#endregion
export { CachedRowModel_All, CachedRowModels, CachedRowModels_FeatureMap };