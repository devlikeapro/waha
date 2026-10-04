import { RowData } from "./type-utils.js";
import { RowModelFns_RowSorting } from "../features/row-sorting/rowSortingFeature.types.js";
import { RowModelFns_RowAggregation } from "../features/row-aggregation/rowAggregationFeature.types.js";
import { RowModelFns_ColumnFiltering } from "../features/column-filtering/columnFilteringFeature.types.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
//#region src/types/RowModelFns.d.ts
interface RowModelFns_Core {}
interface RowModelFns_FeatureMap<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  rowAggregationFeature: RowModelFns_RowAggregation<TFeatures, TData>;
  columnFilteringFeature: RowModelFns_ColumnFiltering<TFeatures, TData>;
  rowSortingFeature: RowModelFns_RowSorting<TFeatures, TData>;
}
type RowModelFns<TFeatures extends TableFeatures, TData extends RowData> = Partial<ExtractFeatureMapTypes<TFeatures, RowModelFns_FeatureMap<TFeatures, TData>>>;
interface RowModelFns_All<in out TFeatures extends TableFeatures, in out TData extends RowData> extends Partial<RowModelFns_ColumnFiltering<TFeatures, TData> & RowModelFns_RowAggregation<TFeatures, TData> & RowModelFns_RowSorting<TFeatures, TData>> {}
//#endregion
export { RowModelFns, RowModelFns_All, RowModelFns_Core, RowModelFns_FeatureMap };