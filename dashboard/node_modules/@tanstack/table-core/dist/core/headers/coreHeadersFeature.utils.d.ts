import { RowData } from "../../types/type-utils.js";
import { HeaderGroup } from "../../types/HeaderGroup.js";
import { Header } from "../../types/Header.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
import "../../index.js";
//#region src/core/headers/coreHeadersFeature.utils.d.ts
/**
 * Walks a header tree and collects all descendant leaf headers.
 *
 * The header itself is included after its descendants, matching the recursive
 * shape used by nested header groups.
 *
 * @example
 * ```ts
 * const leafHeaders = header_getLeafHeaders(header)
 * ```
 */
declare function header_getLeafHeaders<TFeatures extends TableFeatures, TData extends RowData, TValue>(header: Header<TFeatures, TData, TValue>): Header<TFeatures, TData, TValue>[];
/**
 * Builds the render context passed to a column's `header` or `footer` template.
 *
 * The context contains the header, its column, and the owning table instance.
 *
 * @example
 * ```ts
 * const context = header_getContext(header)
 * ```
 */
declare function header_getContext<TFeatures extends TableFeatures, TData extends RowData, TValue>(header: Header<TFeatures, TData, TValue>): {
  column: Column<TFeatures, TData, TValue>;
  header: Header<TFeatures, TData, TValue>;
  table: Table<TFeatures, TData>;
};
/**
 * Builds visible header groups for the current column tree.
 *
 * Column visibility and pinning are applied before groups are built. When no
 * columns are pinned, the fast path skips pin partitioning.
 *
 * @example
 * ```ts
 * const headerGroups = table_getHeaderGroups(table)
 * ```
 */
declare function table_getHeaderGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): HeaderGroup<TFeatures, TData>[];
/**
 * Builds footer groups by reversing the current header groups.
 *
 * Footer rendering uses the same header objects and grouping structure, but
 * renders them from leaf level back toward the root.
 *
 * @example
 * ```ts
 * const footerGroups = table_getFooterGroups(table)
 * ```
 */
declare function table_getFooterGroups<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): HeaderGroup<TFeatures, TData>[];
/**
 * Flattens every header from every header group into one array.
 *
 * The result includes parent headers and placeholder headers, in header-group
 * order from top to bottom.
 *
 * @example
 * ```ts
 * const flatHeaders = table_getFlatHeaders(table)
 * ```
 */
declare function table_getFlatHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
/**
 * Collects only the leaf headers from the current header tree.
 *
 * Parent/group headers are skipped, making the result suitable for rendering
 * one header per visible leaf column.
 *
 * @example
 * ```ts
 * const leafHeaders = table_getLeafHeaders(table)
 * ```
 */
declare function table_getLeafHeaders<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Header<TFeatures, TData, unknown>[];
//#endregion
export { header_getContext, header_getLeafHeaders, table_getFlatHeaders, table_getFooterGroups, table_getHeaderGroups, table_getLeafHeaders };