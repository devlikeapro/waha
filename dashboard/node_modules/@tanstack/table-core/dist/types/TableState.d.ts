import { TableState_CellSelection } from "../features/cell-selection/cellSelectionFeature.types.js";
import { TableState_RowSorting } from "../features/row-sorting/rowSortingFeature.types.js";
import { TableState_ColumnPinning } from "../features/column-pinning/columnPinningFeature.types.js";
import { TableState_ColumnSizing } from "../features/column-sizing/columnSizingFeature.types.js";
import { TableState_ColumnResizing } from "../features/column-resizing/columnResizingFeature.types.js";
import { TableState_ColumnGrouping } from "../features/column-grouping/columnGroupingFeature.types.js";
import { TableState_GlobalFiltering } from "../features/global-filtering/globalFilteringFeature.types.js";
import { TableState_ColumnOrdering } from "../features/column-ordering/columnOrderingFeature.types.js";
import { TableState_ColumnVisibility } from "../features/column-visibility/columnVisibilityFeature.types.js";
import { TableState_RowExpanding } from "../features/row-expanding/rowExpandingFeature.types.js";
import { TableState_RowPinning } from "../features/row-pinning/rowPinningFeature.types.js";
import { TableState_RowSelection } from "../features/row-selection/rowSelectionFeature.types.js";
import { TableState_ColumnFiltering } from "../features/column-filtering/columnFilteringFeature.types.js";
import { TableState_RowPagination } from "../features/row-pagination/rowPaginationFeature.types.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
//#region src/types/TableState.d.ts
interface TableState_FeatureMap {
  cellSelectionFeature: TableState_CellSelection;
  columnFilteringFeature: TableState_ColumnFiltering;
  columnGroupingFeature: TableState_ColumnGrouping;
  columnOrderingFeature: TableState_ColumnOrdering;
  columnPinningFeature: TableState_ColumnPinning;
  columnResizingFeature: TableState_ColumnResizing;
  columnSizingFeature: TableState_ColumnSizing;
  columnVisibilityFeature: TableState_ColumnVisibility;
  globalFilteringFeature: TableState_GlobalFiltering;
  rowExpandingFeature: TableState_RowExpanding;
  rowPaginationFeature: TableState_RowPagination;
  rowPinningFeature: TableState_RowPinning;
  rowSelectionFeature: TableState_RowSelection;
  rowSortingFeature: TableState_RowSorting;
}
/**
 * Complete table state for a specific feature set.
 *
 * State slices are included only when their feature is present in `TFeatures`,
 * then custom feature/plugin state is mixed in.
 */
type TableState<TFeatures extends TableFeatures> = ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>;
/**
 * Internal broad state shape containing every registered feature state slice.
 *
 * Feature internals use this when they may need to inspect optional slices owned
 * by other features.
 */
interface TableState_All extends Partial<TableState_CellSelection & TableState_ColumnFiltering & TableState_ColumnGrouping & TableState_ColumnOrdering & TableState_ColumnPinning & TableState_ColumnResizing & TableState_ColumnSizing & TableState_ColumnVisibility & TableState_GlobalFiltering & TableState_RowExpanding & TableState_RowPagination & TableState_RowPinning & TableState_RowSelection & TableState_RowSorting> {}
//#endregion
export { TableState, TableState_All, TableState_FeatureMap };