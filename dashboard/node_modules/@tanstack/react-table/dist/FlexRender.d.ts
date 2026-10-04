import { Cell, CellData, Header, RowData, TableFeatures } from "@tanstack/table-core";
import React, { ComponentType, JSX, ReactNode } from "react";
//#region src/FlexRender.d.ts
type Renderable<TProps> = ReactNode | ComponentType<TProps>;
/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
 * @example flexRender(cell.column.columnDef.cell, cell.getContext())
 */
declare function flexRender<TProps extends object>(Comp: Renderable<TProps>, props: TProps): ReactNode | JSX.Element;
/**
 * Simplified component wrapper of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example <FlexRender cell={cell} />
 * @example <FlexRender header={header} />
 * @example <FlexRender footer={footer} />
 */
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
 * Simplified component wrapper of `flexRender`. Use this utility component to render headers, cells, or footers with custom markup.
 * Only one prop (`cell`, `header`, or `footer`) may be passed.
 * @example
 * ```tsx
 * <FlexRender cell={cell} />
 * <FlexRender header={header} />
 * <FlexRender footer={footer} />
 * ```
 *
 * This replaces calling `flexRender` directly like this:
 * ```tsx
 * flexRender(cell.column.columnDef.cell, cell.getContext())
 * flexRender(header.column.columnDef.header, header.getContext())
 * flexRender(footer.column.columnDef.footer, footer.getContext())
 * ```
 */
declare function FlexRender<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(props: FlexRenderProps<TFeatures, TData, TValue>): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | JSX.Element | null | undefined;
//#endregion
export { FlexRender, FlexRenderProps, Renderable, flexRender };