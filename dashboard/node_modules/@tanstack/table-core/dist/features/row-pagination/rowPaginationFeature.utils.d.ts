import { RowData, Updater } from "../../types/type-utils.js";
import { PaginationState } from "./rowPaginationFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-pagination/rowPaginationFeature.utils.d.ts
/**
 * Creates the default pagination state used by the pagination feature.
 *
 * The feature default starts at the first page with a page size of 10. Reset
 * APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const pagination = getDefaultPaginationState()
 * ```
 */
declare function getDefaultPaginationState(): PaginationState;
/**
 * Resets the page index when a page-altering change should return to page 0.
 *
 * The reset runs when `autoResetAll`, `autoResetPageIndex`, or the default
 * client-side pagination behavior allows it. Manual pagination opts out unless
 * the reset options explicitly opt back in.
 *
 * @example
 * ```ts
 * table_autoResetPageIndex(table)
 * ```
 */
declare function table_autoResetPageIndex<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Routes a pagination updater through the table's pagination change handler.
 *
 * The updater may be a next state object or a function of the previous
 * `PaginationState`; controlled state and external atoms observe the same
 * updater path as the instance API.
 *
 * @example
 * ```ts
 * table_setPagination(table, (old) => old)
 * ```
 */
declare function table_setPagination<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<PaginationState>): void;
/**
 * Resets `pagination` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.pagination` when it
 * exists. Passing `true` ignores initial state and resets to
 * `{ pageIndex: 0, pageSize: 10 }`.
 *
 * @example
 * ```ts
 * table_resetPagination(table)
 * table_resetPagination(table, true)
 * ```
 */
declare function table_resetPagination<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Updates `pagination.pageIndex` and clamps it to the known page range.
 *
 * Unknown page counts (`undefined` or `-1`) allow any non-negative page index.
 * Known page counts clamp the index between `0` and `pageCount - 1`.
 *
 * @example
 * ```ts
 * table_setPageIndex(table, (old) => old)
 * ```
 */
declare function table_setPageIndex<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<number>): void;
/**
 * Resets only `pagination.pageIndex`.
 *
 * With no argument, the reset uses `table.initialState.pagination?.pageIndex`
 * or `0`. Passing `true` always resets the page index to `0`.
 *
 * @example
 * ```ts
 * table_resetPageIndex(table)
 * table_resetPageIndex(table, true)
 * ```
 */
declare function table_resetPageIndex<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Resets only `pagination.pageSize`.
 *
 * With no argument, the reset uses `table.initialState.pagination?.pageSize`
 * or `10`. Passing `true` always resets the page size to `10`.
 *
 * @example
 * ```ts
 * table_resetPageSize(table)
 * table_resetPageSize(table, true)
 * ```
 */
declare function table_resetPageSize<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Updates `pagination.pageSize` while preserving the current top row.
 *
 * The new size is clamped to at least `1`, and `pageIndex` is recalculated so
 * the row that was previously at the top of the page remains in view.
 *
 * @example
 * ```ts
 * table_setPageSize(table, (old) => old)
 * ```
 */
declare function table_setPageSize<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<number>): void;
/**
 * Builds the zero-based page indexes available for the current page count.
 *
 * Unknown or empty page counts return an empty array; otherwise the result is
 * `[0, 1, ...pageCount - 1]`.
 *
 * @example
 * ```ts
 * const pageIndexes = table_getPageOptions(table)
 * ```
 */
declare function table_getPageOptions<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number[];
/**
 * Checks whether the current page index can move backward.
 *
 * The first page is page index `0`, so only positive page indexes can navigate
 * to a previous page.
 *
 * @example
 * ```ts
 * const canGoBack = table_getCanPreviousPage(table)
 * ```
 */
declare function table_getCanPreviousPage<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Checks whether the current page index can move forward.
 *
 * A `pageCount` of `-1` means the caller does not know the total page count, so
 * this returns `true`. A page count of `0` returns `false`.
 *
 * @example
 * ```ts
 * const canGoForward = table_getCanNextPage(table)
 * ```
 */
declare function table_getCanNextPage<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Checks whether a known, finite last page exists after the current page.
 *
 * Unknown (`-1`), empty, and non-finite page counts do not have a navigable
 * last page.
 *
 * @example
 * ```ts
 * const canGoToLastPage = table_getCanLastPage(table)
 * ```
 */
declare function table_getCanLastPage<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Moves the table to the previous page.
 *
 * This delegates to `table_setPageIndex` so pagination state ownership and
 * updater semantics remain consistent.
 *
 * @example
 * ```ts
 * table_previousPage(table)
 * ```
 */
declare function table_previousPage<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Moves the table to the next page.
 *
 * This delegates to `table_setPageIndex` so pagination state ownership and
 * updater semantics remain consistent.
 *
 * @example
 * ```ts
 * table_nextPage(table)
 * ```
 */
declare function table_nextPage<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Moves the table to the first page.
 *
 * This is a convenience wrapper around `table_setPageIndex(table, 0)`.
 *
 * @example
 * ```ts
 * table_firstPage(table)
 * ```
 */
declare function table_firstPage<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Moves the table to the last known page.
 *
 * Unknown, empty, and non-finite page counts do not have a navigable last
 * page, so this does nothing for those states.
 *
 * @example
 * ```ts
 * table_lastPage(table)
 * ```
 */
declare function table_lastPage<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Resolves the number of pages for the current pagination state.
 *
 * `options.pageCount` wins for manual pagination. Otherwise the value is
 * calculated from `table_getRowCount(table)` and the current `pageSize`.
 *
 * @example
 * ```ts
 * const pages = table_getPageCount(table)
 * ```
 */
declare function table_getPageCount<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
/**
 * Resolves the total row count used for pagination math.
 *
 * `options.rowCount` wins for manual pagination. Otherwise the count comes
 * from the pre-paginated row model so filtering, grouping, sorting, and
 * expansion are reflected before the page slice is applied.
 *
 * @example
 * ```ts
 * const rows = table_getRowCount(table)
 * ```
 */
declare function table_getRowCount<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
//#endregion
export { getDefaultPaginationState, table_autoResetPageIndex, table_firstPage, table_getCanLastPage, table_getCanNextPage, table_getCanPreviousPage, table_getPageCount, table_getPageOptions, table_getRowCount, table_lastPage, table_nextPage, table_previousPage, table_resetPageIndex, table_resetPageSize, table_resetPagination, table_setPageIndex, table_setPageSize, table_setPagination };