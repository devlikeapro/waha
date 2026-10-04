import { CellData, RowData } from "./types/type-utils.js";
import { Header } from "./types/Header.js";
import { Cell } from "./types/Cell.js";
import { TableFeatures } from "./types/TableFeatures.js";
//#region src/flex-render.d.ts
/**
 * Renders a static value or render function with the provided props.
 *
 * Framework adapters use this helper to support column definitions that contain either plain values or template functions.
 */
declare function flexRender<TProps extends object>(comp: unknown, props: TProps): unknown | null;
type FlexRenderProps<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> = {
  cell: Cell<TFeatures, TData, TValue>;
  header?: never;
  footer?: never;
} | {
  header: Header<TFeatures, TData, TValue>;
  cell?: never;
  footer?: never;
} | {
  footer: Header<TFeatures, TData, TValue>;
  cell?: never;
  header?: never;
};
/**
 * Renders a static value or render function with the provided props.
 *
 * Framework adapters use this helper to support column definitions that contain either plain values or template functions.
 */
declare function FlexRender<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(props: FlexRenderProps<TFeatures, TData, TValue>): unknown | null;
//#endregion
export { FlexRender, FlexRenderProps, flexRender };