import { CellData, RowData } from "./type-utils.js";
import { Cell_CellSelection } from "../features/cell-selection/cellSelectionFeature.types.js";
import { Cell_Cell } from "../core/cells/coreCellsFeature.types.js";
import { Cell_ColumnGrouping } from "../features/column-grouping/columnGroupingFeature.types.js";
import { Cell_RowAggregation } from "../features/row-aggregation/rowAggregationFeature.types.js";
import { Cell_CellSpanning } from "../features/cell-spanning/cellSpanningFeature.types.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
//#region src/types/Cell.d.ts
interface Cell_Core<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> extends Cell_Cell<TFeatures, TData, TValue> {}
interface Cell_FeatureMap {
  cellSelectionFeature: Cell_CellSelection;
  cellSpanningFeature: Cell_CellSpanning;
  columnGroupingFeature: Cell_ColumnGrouping;
  rowAggregationFeature: Cell_RowAggregation;
}
type Cell<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = Cell_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, Cell_FeatureMap>;
//#endregion
export { Cell, Cell_Core, Cell_FeatureMap };