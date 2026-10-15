import { ReactTable } from "./useTable.js";
import { AggregationFns, Cell, Column, ColumnDef, ColumnHelper, FilterFns, Header, HeaderGroup, Prettify, Row, RowData, RowModel, SortFns, StockFeatures, Table, TableOptions, TableState, aggregationFns, filterFns, sortFns } from "@tanstack/table-core";
//#region src/useLegacyTable.d.ts
/**
 * @deprecated Use `createFilteredRowModel()` in the `filteredRowModel` feature slot with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the filtered row model.
 */
declare function getFilteredRowModel<TData extends RowData>(): RowModelFactory<TData>;
/**
 * @deprecated Use `createSortedRowModel()` in the `sortedRowModel` feature slot with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the sorted row model.
 */
declare function getSortedRowModel<TData extends RowData>(): RowModelFactory<TData>;
/**
 * @deprecated Use `createPaginatedRowModel()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the paginated row model.
 */
declare function getPaginationRowModel<TData extends RowData>(): RowModelFactory<TData>;
/**
 * @deprecated Use `createExpandedRowModel()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the expanded row model.
 */
declare function getExpandedRowModel<TData extends RowData>(): RowModelFactory<TData>;
/**
 * @deprecated Use `createGroupedRowModel()` in the `groupedRowModel` feature slot with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the grouped row model.
 */
declare function getGroupedRowModel<TData extends RowData>(): RowModelFactory<TData>;
/**
 * @deprecated Use `createFacetedRowModel()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the faceted row model.
 */
declare function getFacetedRowModel<TData extends RowData>(): FacetedRowModelFactory<TData>;
/**
 * @deprecated Use `createFacetedMinMaxValues()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the faceted min/max values.
 */
declare function getFacetedMinMaxValues<TData extends RowData>(): FacetedMinMaxValuesFactory<TData>;
/**
 * @deprecated Use `createFacetedUniqueValues()` with the new `useTable` hook instead.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It acts as a marker to enable the faceted unique values.
 */
declare function getFacetedUniqueValues<TData extends RowData>(): FacetedUniqueValuesFactory<TData>;
/**
 * @deprecated The core row model is always created automatically in v9.
 *
 * This is a stub function for v8 API compatibility with `useLegacyTable`.
 * It does nothing - the core row model is always available.
 */
declare function getCoreRowModel<TData extends RowData>(): RowModelFactory<TData>;
/**
 * Feature set registered by `useLegacyTable`.
 *
 * Extends the stock features with the built-in filter, sort, and aggregation
 * registries so column definitions accept the v8 string identifiers such as
 * `'mean'` and `'includesString'`.
 */
interface LegacyFeatures extends StockFeatures {
  aggregationFns: Prettify<AggregationFns & typeof aggregationFns>;
  filterFns: Prettify<FilterFns & typeof filterFns>;
  sortFns: Prettify<SortFns & typeof sortFns>;
}
/**
 * Row model factory function type from v8 API
 */
type RowModelFactory<TData extends RowData> = (table: Table<LegacyFeatures, TData>) => () => RowModel<LegacyFeatures, TData>;
/**
 * Faceted row model factory function type from v8 API
 */
type FacetedRowModelFactory<TData extends RowData> = (table: Table<LegacyFeatures, TData>, columnId: string) => () => RowModel<LegacyFeatures, TData>;
/**
 * Faceted min/max values factory function type from v8 API
 */
type FacetedMinMaxValuesFactory<TData extends RowData> = (table: Table<LegacyFeatures, TData>, columnId: string) => () => undefined | [number, number];
/**
 * Faceted unique values factory function type from v8 API
 */
type FacetedUniqueValuesFactory<TData extends RowData> = (table: Table<LegacyFeatures, TData>, columnId: string) => () => Map<any, number>;
/**
 * Legacy v8-style row model options
 */
interface LegacyRowModelOptions<TData extends RowData> {
  /**
   * Returns the core row model for the table.
   * @deprecated This option is no longer needed in v9. The core row model is always created automatically.
   */
  getCoreRowModel?: RowModelFactory<TData>;
  /**
   * Returns the filtered row model for the table.
   * @deprecated Use the `filteredRowModel`/`filterFns` slots on the `features` option with `createFilteredRowModel()` instead.
   */
  getFilteredRowModel?: RowModelFactory<TData>;
  /**
   * Returns the sorted row model for the table.
   * @deprecated Use the `sortedRowModel`/`sortFns` slots on the `features` option with `createSortedRowModel()` instead.
   */
  getSortedRowModel?: RowModelFactory<TData>;
  /**
   * Returns the paginated row model for the table.
   * @deprecated Use the `paginatedRowModel` slot on the `features` option with `createPaginatedRowModel()` instead.
   */
  getPaginationRowModel?: RowModelFactory<TData>;
  /**
   * Returns the expanded row model for the table.
   * @deprecated Use the `expandedRowModel` slot on the `features` option with `createExpandedRowModel()` instead.
   */
  getExpandedRowModel?: RowModelFactory<TData>;
  /**
   * Returns the grouped row model for the table.
   * @deprecated Use `columnGroupingFeature` with the `groupedRowModel` slot and `createGroupedRowModel()` instead. Add `rowAggregationFeature` separately when grouped rows aggregate values.
   */
  getGroupedRowModel?: RowModelFactory<TData>;
  /**
   * Returns the faceted row model for a column.
   * @deprecated Use the `facetedRowModel` slot on the `features` option with `createFacetedRowModel()` instead.
   */
  getFacetedRowModel?: FacetedRowModelFactory<TData>;
  /**
   * Returns the faceted min/max values for a column.
   * @deprecated Use the `facetedMinMaxValues` slot on the `features` option with `createFacetedMinMaxValues()` instead.
   */
  getFacetedMinMaxValues?: FacetedMinMaxValuesFactory<TData>;
  /**
   * Returns the faceted unique values for a column.
   * @deprecated Use the `facetedUniqueValues` slot on the `features` option with `createFacetedUniqueValues()` instead.
   */
  getFacetedUniqueValues?: FacetedUniqueValuesFactory<TData>;
  /**
   * Additional filter functions to apply to the table.
   * @deprecated Use the `filteredRowModel`/`filterFns` slots on the `features` option with `createFilteredRowModel()` instead.
   */
  filterFns?: FilterFns;
  /**
   * Additional sort functions to apply to the table.
   * @deprecated Use the `sortedRowModel`/`sortFns` slots on the `features` option with `createSortedRowModel()` instead.
   */
  sortFns?: SortFns;
  /**
   * Additional aggregation functions to apply to the table.
   * @deprecated Use `rowAggregationFeature` with the `aggregationFns` slot instead. Add `columnGroupingFeature` and `groupedRowModel` only when grouping rows.
   */
  aggregationFns?: AggregationFns;
}
/**
 * Legacy v8-style table options that work with useLegacyTable.
 *
 * This type omits `features` and instead accepts the v8-style
 * `get*RowModel` function options.
 *
 * @deprecated This is a compatibility layer for migrating from v8. Use `useTable` with an explicit `features` option instead.
 */
type LegacyTableOptions<TData extends RowData> = Omit<TableOptions<LegacyFeatures, TData>, 'features'> & LegacyRowModelOptions<TData>;
/**
 * Legacy table instance type that includes the v8-style `getState()` method.
 *
 * @deprecated Use `useTable` with explicit state selection instead.
 */
type LegacyReactTable<TData extends RowData> = ReactTable<LegacyFeatures, TData, TableState<LegacyFeatures>> & {
  /**
   * Returns the current table state.
   * @deprecated In v9, access state directly via `table.state` or use `table.state` for the full state.
   */
  getState: () => TableState<LegacyFeatures>;
  /**
   * Sets the current table state.
   * @deprecated In v9, access state directly via `table.baseAtoms`
   */
  setState: (state: TableState<LegacyFeatures>) => void;
};
/** @deprecated Use Column<TFeatures, TData, TValue> with useTable instead. */
type LegacyColumn<TData extends RowData, TValue = unknown> = Column<LegacyFeatures, TData, TValue>;
/** @deprecated Use Row<TFeatures, TData> with useTable instead. */
type LegacyRow<TData extends RowData> = Row<LegacyFeatures, TData>;
/** @deprecated Use Cell<TFeatures, TData, TValue> with useTable instead. */
type LegacyCell<TData extends RowData, TValue = unknown> = Cell<LegacyFeatures, TData, TValue>;
/** @deprecated Use Header<TFeatures, TData, TValue> with useTable instead. */
type LegacyHeader<TData extends RowData, TValue = unknown> = Header<LegacyFeatures, TData, TValue>;
/** @deprecated Use HeaderGroup<TFeatures, TData> with useTable instead. */
type LegacyHeaderGroup<TData extends RowData> = HeaderGroup<LegacyFeatures, TData>;
/** @deprecated Use ColumnDef<TFeatures, TData, TValue> with useTable instead. */
type LegacyColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<LegacyFeatures, TData, TValue>;
/** @deprecated Use Table<TFeatures, TData> with useTable instead. */
type LegacyTable<TData extends RowData> = Table<LegacyFeatures, TData>;
/**
 * @deprecated Use `createColumnHelper<TFeatures, TData>()` with useTable instead.
 *
 * A column helper with LegacyFeatures pre-bound for use with useLegacyTable.
 * Only requires TData—no need to specify TFeatures.
 */
declare function legacyCreateColumnHelper<TData extends RowData>(): ColumnHelper<LegacyFeatures, TData>;
/**
 * @deprecated This hook is provided as a compatibility layer for migrating from TanStack Table v8.
 *
 * Use the new `useTable` hook instead with an explicit `features` option:
 *
 * ```tsx
 * // New v9 API
 * const features = tableFeatures({
 *   columnFilteringFeature,
 *   rowSortingFeature,
 *   rowPaginationFeature,
 *   filteredRowModel: createFilteredRowModel(),
 *   sortedRowModel: createSortedRowModel(),
 *   paginatedRowModel: createPaginatedRowModel(),
 *   filterFns,
 *   sortFns,
 * })
 *
 * const table = useTable({
 *   features,
 *   columns,
 *   data,
 * })
 * ```
 *
 * Key differences from v8:
 * - Features are tree-shakeable - only import what you use
 * - Row models and fn registries are explicitly passed on the `features` option
 * - Use `table.Subscribe` for fine-grained re-renders
 * - State is accessed via `table.state` after selecting with the 2nd argument
 *
 * @param options - Legacy v8-style table options
 * @returns A table instance with the full state subscribed and a `getState()` method
 */
declare function useLegacyTable<TData extends RowData>(options: LegacyTableOptions<TData>): LegacyReactTable<TData>;
//#endregion
export { FacetedMinMaxValuesFactory, FacetedRowModelFactory, FacetedUniqueValuesFactory, LegacyCell, LegacyColumn, LegacyColumnDef, LegacyFeatures, LegacyHeader, LegacyHeaderGroup, LegacyReactTable, LegacyRow, LegacyRowModelOptions, LegacyTable, LegacyTableOptions, RowModelFactory, getCoreRowModel, getExpandedRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel, legacyCreateColumnHelper, useLegacyTable };