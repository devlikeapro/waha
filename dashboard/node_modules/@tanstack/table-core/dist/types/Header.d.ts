import { CellData, RowData } from "./type-utils.js";
import { Header_ColumnSizing } from "../features/column-sizing/columnSizingFeature.types.js";
import { Header_ColumnResizing } from "../features/column-resizing/columnResizingFeature.types.js";
import { Header_Header } from "../core/headers/coreHeadersFeature.types.js";
import { ExtractFeatureMapTypes, TableFeatures } from "./TableFeatures.js";
//#region src/types/Header.d.ts
interface Header_Core<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> extends Header_Header<TFeatures, TData, TValue> {}
interface Header_FeatureMap {
  columnSizingFeature: Header_ColumnSizing;
  columnResizingFeature: Header_ColumnResizing;
}
type Header<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = Header_Core<TFeatures, TData, TValue> & ExtractFeatureMapTypes<TFeatures, Header_FeatureMap>;
//#endregion
export { Header, Header_Core, Header_FeatureMap };