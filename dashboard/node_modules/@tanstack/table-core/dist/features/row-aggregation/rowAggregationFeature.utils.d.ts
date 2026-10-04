import { CellData, RowData } from "../../types/type-utils.js";
import { AggregationFnDef, AggregationValueOptions, ColumnAggregationValue, ResolvedAggregationFn } from "./rowAggregationFeature.types.js";
import { Column } from "../../types/Column.js";
import { Row } from "../../types/Row.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-aggregation/rowAggregationFeature.utils.d.ts
/**
 * Selects unique rows at a maximum relative depth in encounter order.
 * Branches that end before the requested depth contribute their deepest row.
 */
declare function normalizeAggregationRows<TFeatures extends TableFeatures, TData extends RowData>(rows: ReadonlyArray<Row<TFeatures, TData>>, maxDepth?: number): Array<Row<TFeatures, TData>>;
/**
 * Frontier selection for rows that are distinct nodes of a single row tree —
 * the row models the table builds itself. Skips `normalizeAggregationRows`'
 * duplicate-id guard (disjoint subtrees cannot revisit a row) and returns
 * `rows` unchanged when no row descends, so the default `maxDepth: 0` case
 * costs nothing per aggregation.
 */
declare function normalizeUniqueAggregationRows<TFeatures extends TableFeatures, TData extends RowData>(rows: ReadonlyArray<Row<TFeatures, TData>>, maxDepth?: number): ReadonlyArray<Row<TFeatures, TData>>;
/** Resolves the `sum` or `extent` definition inferred from the first core row. */
declare function column_getAutoAggregationFn<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): AggregationFnDef<TFeatures, TData, any, any> | undefined;
/** Resolves and validates a column's scalar or multiple aggregation option. */
declare function column_getAggregationFns<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): ReadonlyArray<ResolvedAggregationFn<TFeatures, TData>>;
/** Executes every configured aggregation over a depth-selected row frontier. */
declare function aggregateColumnValue<TFeatures extends TableFeatures, TData extends RowData>(args: {
  maxDepth?: number;
  subRows?: ReadonlyArray<Row<TFeatures, TData>>;
  column: Column<TFeatures, TData, unknown>;
  groupingRow?: Row<TFeatures, TData>;
  rows: ReadonlyArray<Row<TFeatures, TData>>;
  /**
   * Marks `rows` as distinct nodes of a single row tree (rows the table's own
   * row models produced), enabling frontier selection without the
   * duplicate-id guard. Caller-supplied row arrays must omit this.
   */
  uniqueRows?: boolean;
}): unknown;
/** Implements `column.getAggregationValue(options?)` and its default cache. */
declare function column_getAggregationValue<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>, options?: AggregationValueOptions<TFeatures, TData>): ColumnAggregationValue<TFeatures>;
/** Implements `cell.getIsAggregated()` for synthetic grouped rows. */
declare function cell_getIsAggregated<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): boolean;
/** Formats the default scalar or keyed aggregated-cell representation. */
declare function formatAggregatedCellValue(value: unknown, option: unknown): string | null;
//#endregion
export { aggregateColumnValue, cell_getIsAggregated, column_getAggregationFns, column_getAggregationValue, column_getAutoAggregationFn, formatAggregatedCellValue, normalizeAggregationRows, normalizeUniqueAggregationRows };