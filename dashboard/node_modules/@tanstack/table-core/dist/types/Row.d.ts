import { RowData } from "./type-utils.js";
import { Row_ColumnPinning } from "../features/column-pinning/columnPinningFeature.types.js";
import { Row_ColumnGrouping } from "../features/column-grouping/columnGroupingFeature.types.js";
import { Row_RowAggregation } from "../features/row-aggregation/rowAggregationFeature.types.js";
import { Row_ColumnVisibility } from "../features/column-visibility/columnVisibilityFeature.types.js";
import { Row_RowExpanding } from "../features/row-expanding/rowExpandingFeature.types.js";
import { Row_RowPinning } from "../features/row-pinning/rowPinningFeature.types.js";
import { Row_RowSelection } from "../features/row-selection/rowSelectionFeature.types.js";
import { Row_Row } from "../core/rows/coreRowsFeature.types.js";
import { Row_ColumnFiltering } from "../features/column-filtering/columnFilteringFeature.types.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
//#region src/types/Row.d.ts
interface Row_Core<in out TFeatures extends TableFeatures, in out TData extends RowData> extends Row_Row<TFeatures, TData> {}
interface Row_FeatureMap<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  rowAggregationFeature: Row_RowAggregation;
  columnFilteringFeature: Row_ColumnFiltering<TFeatures, TData>;
  columnGroupingFeature: Row_ColumnGrouping;
  columnPinningFeature: Row_ColumnPinning<TFeatures, TData>;
  columnVisibilityFeature: Row_ColumnVisibility<TFeatures, TData>;
  rowExpandingFeature: Row_RowExpanding;
  rowPinningFeature: Row_RowPinning;
  rowSelectionFeature: Row_RowSelection;
}
type Row<TFeatures extends TableFeatures, TData extends RowData> = Row_Core<TFeatures, TData> & ExtractFeatureMapTypes<TFeatures, Row_FeatureMap<TFeatures, TData>>;
//#endregion
export { Row, Row_Core, Row_FeatureMap };