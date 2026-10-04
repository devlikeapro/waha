import { RowData } from "./type-utils.js";
import { Column_RowSorting } from "../features/row-sorting/rowSortingFeature.types.js";
import { Column_ColumnPinning } from "../features/column-pinning/columnPinningFeature.types.js";
import { Column_ColumnSizing } from "../features/column-sizing/columnSizingFeature.types.js";
import { Column_ColumnResizing } from "../features/column-resizing/columnResizingFeature.types.js";
import { Column_ColumnGrouping } from "../features/column-grouping/columnGroupingFeature.types.js";
import { Column_GlobalFiltering } from "../features/global-filtering/globalFilteringFeature.types.js";
import { ColumnDefBase_All } from "./ColumnDef.js";
import { Column_RowAggregation } from "../features/row-aggregation/rowAggregationFeature.types.js";
import { Column_ColumnOrdering } from "../features/column-ordering/columnOrderingFeature.types.js";
import { Column_Column } from "../core/columns/coreColumnsFeature.types.js";
import { Column_ColumnVisibility } from "../features/column-visibility/columnVisibilityFeature.types.js";
import { Column_ColumnFiltering } from "../features/column-filtering/columnFilteringFeature.types.js";
import { Column_ColumnFaceting } from "../features/column-faceting/columnFacetingFeature.types.js";
import { Table } from "./Table.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
//#region src/types/Column.d.ts
interface Column_Core<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue = unknown> extends Column_Column<TFeatures, TData, TValue> {}
interface Column_FeatureMap<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  rowAggregationFeature: Column_RowAggregation<TFeatures, TData>;
  columnFacetingFeature: Column_ColumnFaceting<TFeatures, TData>;
  columnFilteringFeature: Column_ColumnFiltering<TFeatures, TData>;
  columnGroupingFeature: Column_ColumnGrouping;
  columnOrderingFeature: Column_ColumnOrdering;
  columnPinningFeature: Column_ColumnPinning;
  columnResizingFeature: Column_ColumnResizing;
  columnSizingFeature: Column_ColumnSizing;
  columnVisibilityFeature: Column_ColumnVisibility;
  globalFilteringFeature: Column_GlobalFiltering;
  rowSortingFeature: Column_RowSorting<TFeatures, TData>;
}
type Column<TFeatures extends TableFeatures, TData extends RowData, TValue = unknown> = Column_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, Column_FeatureMap<TFeatures, TData>>;
//#endregion
export { Column, Column_Core, Column_FeatureMap };