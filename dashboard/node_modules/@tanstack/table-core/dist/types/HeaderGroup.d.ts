import { RowData } from "./type-utils.js";
import { HeaderGroup_Header } from "../core/headers/coreHeadersFeature.types.js";
import { TableFeatures } from "./TableFeatures.js";
//#region src/types/HeaderGroup.d.ts
interface HeaderGroup_Core<in out TFeatures extends TableFeatures, in out TData extends RowData> extends HeaderGroup_Header<TFeatures, TData> {}
interface HeaderGroup<in out TFeatures extends TableFeatures, in out TData extends RowData> extends HeaderGroup_Core<TFeatures, TData> {}
//#endregion
export { HeaderGroup, HeaderGroup_Core };