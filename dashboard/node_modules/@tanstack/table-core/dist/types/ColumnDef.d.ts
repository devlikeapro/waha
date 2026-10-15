import { CellData, RowData, UnionToIntersection } from "./type-utils.js";
import { ColumnDef_CellSelection } from "../features/cell-selection/cellSelectionFeature.types.js";
import { ColumnDef_RowSorting } from "../features/row-sorting/rowSortingFeature.types.js";
import { CellContext } from "../core/cells/coreCellsFeature.types.js";
import { ColumnDef_ColumnPinning } from "../features/column-pinning/columnPinningFeature.types.js";
import { ColumnDef_ColumnSizing } from "../features/column-sizing/columnSizingFeature.types.js";
import { ColumnDef_ColumnResizing } from "../features/column-resizing/columnResizingFeature.types.js";
import { HeaderContext } from "../core/headers/coreHeadersFeature.types.js";
import { ColumnDef_ColumnGrouping } from "../features/column-grouping/columnGroupingFeature.types.js";
import { ColumnDef_GlobalFiltering } from "../features/global-filtering/globalFilteringFeature.types.js";
import { ColumnDef_RowAggregation } from "../features/row-aggregation/rowAggregationFeature.types.js";
import { ColumnDef_ColumnVisibility } from "../features/column-visibility/columnVisibilityFeature.types.js";
import { ColumnDef_ColumnFiltering } from "../features/column-filtering/columnFilteringFeature.types.js";
import { ColumnDef_CellSpanning } from "../features/cell-spanning/cellSpanningFeature.types.js";
import { ExtractFeatureMapTypes, IsAny, TableFeatures } from "./TableFeatures.js";
//#region src/types/ColumnDef.d.ts
interface ColumnMeta<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> {}
/**
 * Resolves the type of `columnDef.meta` for a feature set.
 *
 * When the features object declares a `columnMeta` type-only slot
 * (`tableFeatures({ ..., columnMeta: {} as MyColumnMeta })`), that type wins.
 * Otherwise this falls back to the global declaration-merged `ColumnMeta`
 * interface.
 */
type ExtractColumnMeta<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = IsAny<TFeatures> extends true ? ColumnMeta<TFeatures, TData, TValue> : TFeatures extends {
  columnMeta: infer TMeta extends object;
} ? TMeta : ColumnMeta<TFeatures, TData, TValue>;
/**
 * Reads a cell value from an original row object.
 *
 * The row index is provided for accessors that need stable position-aware
 * derived values.
 */
type AccessorFn<TData extends RowData, TValue extends CellData = CellData> = (originalRow: TData, index: number) => TValue;
/**
 * A renderable column template value.
 *
 * Strings render directly; functions receive the relevant cell/header context
 * and can return framework-specific render output.
 */
type ColumnDefTemplate<TProps extends object> = string | ((props: TProps) => any);
type StringOrTemplateHeader<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = string | ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
interface StringHeaderIdentifier {
  /**
   * Header text used both for rendering and as a fallback column id.
   */
  header: string;
  /**
   * Optional explicit id that overrides the header-derived id.
   */
  id?: string;
}
interface IdIdentifier<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> {
  /**
   * Explicit stable column id.
   */
  id: string;
  /**
   * Header text or template used to render this column's header.
   */
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>;
}
type ColumnIdentifiers<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = IdIdentifier<TFeatures, TData, TValue> | StringHeaderIdentifier;
interface ColumnDefBase_Core<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> {
  /**
   * Produces the values used by faceting/grouping for this column.
   *
   * When omitted, the normal accessor value is wrapped in a single-item array.
   */
  getUniqueValues?: AccessorFn<TData, ReadonlyArray<unknown>>;
  /**
   * Footer template rendered with header context.
   */
  footer?: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>;
  /**
   * Cell template rendered with cell context.
   */
  cell?: ColumnDefTemplate<CellContext<TFeatures, TData, TValue>>;
  /**
   * User-defined metadata available on the resolved column definition.
   *
   * Declare its type per-table via the `columnMeta` type-only slot on the
   * `features` option, or globally via declaration merging on `ColumnMeta`.
   */
  meta?: ExtractColumnMeta<TFeatures, TData, TValue>;
}
interface ColumnDef_FeatureMap<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData> {
  cellSelectionFeature: ColumnDef_CellSelection;
  cellSpanningFeature: ColumnDef_CellSpanning<TFeatures, TData, TValue>;
  columnFilteringFeature: ColumnDef_ColumnFiltering<TFeatures, TData>;
  columnGroupingFeature: ColumnDef_ColumnGrouping<TFeatures, TData>;
  columnPinningFeature: ColumnDef_ColumnPinning;
  columnResizingFeature: ColumnDef_ColumnResizing;
  columnSizingFeature: ColumnDef_ColumnSizing;
  columnVisibilityFeature: ColumnDef_ColumnVisibility;
  globalFilteringFeature: ColumnDef_GlobalFiltering;
  rowAggregationFeature: ColumnDef_RowAggregation<TFeatures, TData, TValue>;
  rowSortingFeature: ColumnDef_RowSorting<TFeatures, TData>;
}
type ColumnDefBase<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = ColumnDefBase_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, ColumnDef_FeatureMap<TFeatures, TData, TValue>>;
type ColumnDefBase_All<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = ColumnDefBase_Core<TFeatures, TData, TValue> & Partial<ColumnDef_RowAggregation<TFeatures, TData, TValue> & ColumnDef_CellSelection & ColumnDef_CellSpanning<TFeatures, TData, TValue> & ColumnDef_ColumnVisibility & ColumnDef_ColumnPinning & ColumnDef_ColumnFiltering<TFeatures, TData> & ColumnDef_GlobalFiltering & ColumnDef_RowSorting<TFeatures, TData> & ColumnDef_ColumnGrouping<TFeatures, TData> & ColumnDef_ColumnSizing & ColumnDef_ColumnResizing>;
type IdentifiedColumnDef<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = ColumnDefBase<TFeatures, TData, TValue> & {
  id?: string;
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>;
};
type DisplayColumnDef<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = ColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
type GroupColumnDefBase<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = ColumnDefBase<TFeatures, TData, TValue> & {
  columns?: ReadonlyArray<ColumnDef<TFeatures, TData, unknown>>;
};
type GroupColumnDef<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = GroupColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
type AccessorFnColumnDefBase<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = ColumnDefBase<TFeatures, TData, TValue> & {
  accessorFn: AccessorFn<TData, TValue>;
};
type AccessorFnColumnDef<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = AccessorFnColumnDefBase<TFeatures, TData, TValue> & ColumnIdentifiers<TFeatures, TData, TValue>;
type AccessorKeyColumnDefBase<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = ColumnDefBase<TFeatures, TData, TValue> & {
  id?: string;
  accessorKey: (string & {}) | keyof TData;
};
type AccessorKeyColumnDef<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = AccessorKeyColumnDefBase<TFeatures, TData, TValue> & Partial<ColumnIdentifiers<TFeatures, TData, TValue>>;
type AccessorColumnDef<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = AccessorKeyColumnDef<TFeatures, TData, TValue> | AccessorFnColumnDef<TFeatures, TData, TValue>;
type ColumnDef<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = DisplayColumnDef<TFeatures, TData, TValue> | GroupColumnDef<TFeatures, TData, TValue> | AccessorColumnDef<TFeatures, TData, TValue>;
type ColumnDefResolved<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = Partial<UnionToIntersection<ColumnDef<TFeatures, TData, TValue>>> & {
  accessorKey?: (string & {}) | keyof TData;
};
//#endregion
export { AccessorColumnDef, AccessorFn, AccessorFnColumnDef, AccessorFnColumnDefBase, AccessorKeyColumnDef, AccessorKeyColumnDefBase, ColumnDef, ColumnDefBase, ColumnDefBase_All, ColumnDefResolved, ColumnDefTemplate, ColumnDef_FeatureMap, ColumnMeta, DisplayColumnDef, ExtractColumnMeta, GroupColumnDef, IdIdentifier, IdentifiedColumnDef, StringHeaderIdentifier, StringOrTemplateHeader };