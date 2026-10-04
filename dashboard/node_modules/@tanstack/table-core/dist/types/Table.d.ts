import { RowData } from "./type-utils.js";
import { Table_CellSelection } from "../features/cell-selection/cellSelectionFeature.types.js";
import { Table_RowSorting } from "../features/row-sorting/rowSortingFeature.types.js";
import { Table_ColumnPinning } from "../features/column-pinning/columnPinningFeature.types.js";
import { Table_ColumnSizing } from "../features/column-sizing/columnSizingFeature.types.js";
import { Table_ColumnResizing } from "../features/column-resizing/columnResizingFeature.types.js";
import { Table_Headers } from "../core/headers/coreHeadersFeature.types.js";
import { Table_ColumnGrouping } from "../features/column-grouping/columnGroupingFeature.types.js";
import { Table_GlobalFiltering } from "../features/global-filtering/globalFilteringFeature.types.js";
import { Table_ColumnOrdering } from "../features/column-ordering/columnOrderingFeature.types.js";
import { Table_Columns } from "../core/columns/coreColumnsFeature.types.js";
import { Table_ColumnVisibility } from "../features/column-visibility/columnVisibilityFeature.types.js";
import { Table_RowExpanding } from "../features/row-expanding/rowExpandingFeature.types.js";
import { Table_RowPinning } from "../features/row-pinning/rowPinningFeature.types.js";
import { Table_RowSelection } from "../features/row-selection/rowSelectionFeature.types.js";
import { Table_Rows } from "../core/rows/coreRowsFeature.types.js";
import { Table_ColumnFiltering } from "../features/column-filtering/columnFilteringFeature.types.js";
import { Table_RowPagination } from "../features/row-pagination/rowPaginationFeature.types.js";
import { Table_RowModels } from "../core/row-models/coreRowModelsFeature.types.js";
import { Table_ColumnFaceting } from "../features/column-faceting/columnFacetingFeature.types.js";
import { CachedRowModel_All } from "./RowModel.js";
import { RowModelFns_All } from "./RowModelFns.js";
import { TableState, TableState_All } from "./TableState.js";
import { DebugOptions, TableOptions_All } from "./TableOptions.js";
import { Atoms, Atoms_All, BaseAtoms, BaseAtoms_All, ExternalAtoms_All, Table_Table } from "../core/table/coreTablesFeature.types.js";
import { Table_CellSpanning } from "../features/cell-spanning/cellSpanningFeature.types.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
import { ReadonlyStore } from "@tanstack/store";
//#region src/types/Table.d.ts
/**
 * The core table object that only includes the core table functionality such as column, header, row, and table APIS.
 * No features are included.
 */
interface Table_Core<in out TFeatures extends TableFeatures, in out TData extends RowData> extends Table_Table<TFeatures, TData>, Table_Columns<TFeatures, TData>, Table_Rows<TFeatures, TData>, Table_RowModels<TFeatures, TData>, Table_Headers<TFeatures, TData> {}
interface Table_FeatureMap<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  cellSelectionFeature: Table_CellSelection<TFeatures, TData>;
  cellSpanningFeature: Table_CellSpanning<TFeatures, TData>;
  columnFacetingFeature: Table_ColumnFaceting<TFeatures, TData>;
  columnFilteringFeature: Table_ColumnFiltering;
  columnGroupingFeature: Table_ColumnGrouping<TFeatures, TData>;
  columnOrderingFeature: Table_ColumnOrdering<TFeatures, TData>;
  columnPinningFeature: Table_ColumnPinning<TFeatures, TData>;
  columnResizingFeature: Table_ColumnResizing;
  columnSizingFeature: Table_ColumnSizing;
  columnVisibilityFeature: Table_ColumnVisibility<TFeatures, TData>;
  globalFilteringFeature: Table_GlobalFiltering<TFeatures, TData>;
  rowExpandingFeature: Table_RowExpanding<TFeatures, TData>;
  rowPaginationFeature: Table_RowPagination<TFeatures, TData>;
  rowPinningFeature: Table_RowPinning<TFeatures, TData>;
  rowSelectionFeature: Table_RowSelection<TFeatures, TData>;
  rowSortingFeature: Table_RowSorting<TFeatures, TData>;
}
/**
 * The table object that includes both the core table functionality and the features that are enabled via the `features` table option.
 */
type Table<TFeatures extends TableFeatures, TData extends RowData> = Table_Core<TFeatures, TData> & ExtractFeatureMapTypes<TFeatures, Table_FeatureMap<TFeatures, TData>>;
/**
 * `Table_Table` members that `Table` re-declares with broadened
 * (all-features) types so internal code can read any feature's slots and
 * construction code can assign them.
 */

/**
 * Internal broad table shape used by feature implementations.
 */
//#endregion
export { Table, Table_Core, Table_FeatureMap };