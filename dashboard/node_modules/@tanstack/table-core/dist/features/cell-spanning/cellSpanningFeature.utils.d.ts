import { CellData, RowData } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { CellSpanIndex } from "./cellSpanningFeature.types.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/cell-spanning/cellSpanningFeature.utils.d.ts
/**
 * Checks whether this column takes part in cell spanning.
 *
 * A column def opting out with `enableCellSpanning: false` wins over the table
 * option, matching how the other per-column enable flags resolve.
 *
 * @example
 * ```ts
 * const canSpan = column_getCanSpan(column)
 * ```
 */
declare function column_getCanSpan<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Builds the table's cell span index for the rows that are currently rendered.
 *
 * Spans are always derived from scratch from the final row model, so sorting,
 * filtering, pagination, expansion, and row pinning only change adjacency and
 * the index follows. Nothing is persisted and there is nothing to configure.
 *
 * @example
 * ```ts
 * const spanIndex = table_getCellSpanIndex(table)
 * ```
 */
declare function table_getCellSpanIndex<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): CellSpanIndex<TFeatures, TData>;
/**
 * Returns how many rows this cell spans.
 *
 * `1` when it does not span, and `0` when a spanning cell above it covers it,
 * matching the `header.rowSpan` convention where `0` means "skip this cell".
 *
 * Deliberately not memoized: a per-cell memo would allocate a closure and a
 * dependency array for every cell, costing more than the two lookups this
 * performs against the table-level span index.
 *
 * @example
 * ```ts
 * const rowSpan = cell_getRowSpan(cell)
 * ```
 */
declare function cell_getRowSpan<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): number;
/**
 * Returns how many columns this cell spans.
 *
 * `1` when it does not span, and `0` when another cell's column span covers
 * it.
 *
 * @example
 * ```ts
 * const colSpan = cell_getColSpan(cell)
 * ```
 */
declare function cell_getColSpan<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): number;
/**
 * Checks whether another cell's span covers this cell.
 *
 * Covered cells must not be rendered; the cell that covers them carries the
 * content and the span attributes.
 *
 * @example
 * ```ts
 * const isCovered = cell_getIsCovered(cell)
 * ```
 */
declare function cell_getIsCovered<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): boolean;
//#endregion
export { cell_getColSpan, cell_getIsCovered, cell_getRowSpan, column_getCanSpan, table_getCellSpanIndex };