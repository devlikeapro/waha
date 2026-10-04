import { RowData } from "../../types/type-utils.js";
import { RowModel } from "./coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/row-models/coreRowModelsFeature.utils.d.ts
/**
 * Resolves the table's unmodified core row model.
 *
 * The factory is created once per table, either from the `coreRowModel` slot on the `features` option
 * or the built-in `createCoreRowModel()`, then reused for later calls.
 *
 * @example
 * ```ts
 * const coreRows = table_getCoreRowModel(table)
 * ```
 */
declare function table_getCoreRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Reads the row model immediately before column/global filtering.
 *
 * Filtering is the first derived row-model stage, so this currently aliases
 * `table.getCoreRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeFiltering = table_getPreFilteredRowModel(table)
 * ```
 */
declare function table_getPreFilteredRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Resolves the row model after column and global filtering.
 *
 * When `manualFiltering` is enabled, or no filtered row-model factory was
 * registered, this returns the pre-filtered row model because filtering is
 * expected to happen outside the table.
 *
 * @example
 * ```ts
 * const filteredRows = table_getFilteredRowModel(table)
 * ```
 */
declare function table_getFilteredRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Reads the row model immediately before grouping.
 *
 * Grouping runs after filtering, so this aliases `table.getFilteredRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeGrouping = table_getPreGroupedRowModel(table)
 * ```
 */
declare function table_getPreGroupedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Resolves the row model after grouping has produced grouped rows.
 *
 * When `manualGrouping` is enabled, or no grouped row-model factory was
 * registered, this returns the pre-grouped row model unchanged.
 *
 * @example
 * ```ts
 * const groupedRows = table_getGroupedRowModel(table)
 * ```
 */
declare function table_getGroupedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Reads the row model immediately before sorting.
 *
 * Sorting runs after grouping, so this aliases `table.getGroupedRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeSorting = table_getPreSortedRowModel(table)
 * ```
 */
declare function table_getPreSortedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Resolves the row model after sorting has been applied.
 *
 * When `manualSorting` is enabled, or no sorted row-model factory was
 * registered, this returns the pre-sorted row model because sorted data is
 * expected to be supplied by the caller.
 *
 * @example
 * ```ts
 * const sortedRows = table_getSortedRowModel(table)
 * ```
 */
declare function table_getSortedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Reads the row model immediately before row expansion.
 *
 * Expansion runs after sorting, so this aliases `table.getSortedRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforeExpansion = table_getPreExpandedRowModel(table)
 * ```
 */
declare function table_getPreExpandedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Resolves the row model after expanded rows have been flattened into view.
 *
 * When `manualExpanding` is enabled, or no expanded row-model factory was
 * registered, this returns the pre-expanded row model unchanged.
 *
 * @example
 * ```ts
 * const expandedRows = table_getExpandedRowModel(table)
 * ```
 */
declare function table_getExpandedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Reads the row model immediately before pagination.
 *
 * Pagination is the final built-in row-model stage, so this aliases
 * `table.getExpandedRowModel()`.
 *
 * @example
 * ```ts
 * const rowsBeforePagination = table_getPrePaginatedRowModel(table)
 * ```
 */
declare function table_getPrePaginatedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Resolves the row model after pagination has sliced rows for the current page.
 *
 * When `manualPagination` is enabled, or no paginated row-model factory was
 * registered, this returns the pre-paginated row model because pagination is
 * expected to happen before data reaches the table.
 *
 * @example
 * ```ts
 * const pageRows = table_getPaginatedRowModel(table)
 * ```
 */
declare function table_getPaginatedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Resolves the final row model consumed by renderers.
 *
 * This is the end of the built-in row-model pipeline: core -> filtering ->
 * grouping -> sorting -> expanding -> pagination.
 *
 * @example
 * ```ts
 * const visibleRows = table_getRowModel(table)
 * ```
 */
declare function table_getRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
//#endregion
export { table_getCoreRowModel, table_getExpandedRowModel, table_getFilteredRowModel, table_getGroupedRowModel, table_getPaginatedRowModel, table_getPreExpandedRowModel, table_getPreFilteredRowModel, table_getPreGroupedRowModel, table_getPrePaginatedRowModel, table_getPreSortedRowModel, table_getRowModel, table_getSortedRowModel };