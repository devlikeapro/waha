import { RowData, Updater } from "../../types/type-utils.js";
import { ExpandedState } from "./rowExpandingFeature.types.js";
import { Row } from "../../types/Row.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-expanding/rowExpandingFeature.utils.d.ts
/**
 * Creates the default expanded state.
 *
 * The feature default is an empty map, meaning no rows are expanded. Reset APIs
 * use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const expanded = getDefaultExpandedState()
 * ```
 */
declare function getDefaultExpandedState(): ExpandedState;
/**
 * Schedules an expanded-state reset after row-structure changes.
 *
 * The reset runs when `autoResetAll`, `autoResetExpanded`, or the default
 * client-side expanding behavior allows it. Manual expanding opts out unless
 * the reset options explicitly opt back in.
 *
 * @example
 * ```ts
 * table_autoResetExpanded(table)
 * ```
 */
declare function table_autoResetExpanded<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Routes an expanded-state updater through the table's expanded change handler.
 *
 * The updater may be `true`, a row-id map, or a function of the previous
 * expanded state, matching the instance `table.setExpanded` behavior.
 *
 * @example
 * ```ts
 * table_setExpanded(table, (old) => ({ ...old, [rowId]: true }))
 * ```
 */
declare function table_setExpanded<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<ExpandedState>): void;
/**
 * Expands or collapses every row.
 *
 * Passing `true` stores the special expanded-all state. Passing `false` stores
 * an empty map. Omitting the value toggles based on whether all rows are
 * currently expanded.
 *
 * The call is a no-op (no `onExpandedChange`) when no row can expand or when
 * the requested state matches the current state exactly.
 *
 * @example
 * ```ts
 * table_toggleAllRowsExpanded(table)
 * ```
 */
declare function table_toggleAllRowsExpanded<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, expanded?: boolean): void;
/**
 * Resets `expanded` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.expanded` when it
 * exists. Passing `true` ignores initial state and resets to `{}`.
 *
 * @example
 * ```ts
 * table_resetExpanded(table)
 * table_resetExpanded(table, true)
 * ```
 */
declare function table_resetExpanded<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Checks whether at least one pre-paginated row can expand.
 *
 * Pagination is intentionally ignored so controls can reflect expandable rows
 * that may not be on the current page.
 *
 * @example
 * ```ts
 * const canExpand = table_getCanSomeRowsExpand(table)
 * ```
 */
declare function table_getCanSomeRowsExpand<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Creates an event handler that toggles all rows expanded.
 *
 * @example
 * ```ts
 * const onClick = table_getToggleAllRowsExpandedHandler(table)
 * ```
 */
declare function table_getToggleAllRowsExpandedHandler<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): (_e: unknown) => void;
/**
 * Checks whether any row is expanded.
 *
 * The special expanded-all value `true` counts as some rows expanded.
 *
 * @example
 * ```ts
 * const someExpanded = table_getIsSomeRowsExpanded(table)
 * ```
 */
declare function table_getIsSomeRowsExpanded<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Checks whether every expandable row in the current row model is expanded.
 *
 * The special expanded-all value `true` returns true immediately. Empty
 * expanded state returns false. Rows that cannot expand are ignored, so a
 * materialized expanded-all map (which only contains expandable row ids)
 * still counts as all rows expanded.
 *
 * @example
 * ```ts
 * const allExpanded = table_getIsAllRowsExpanded(table)
 * ```
 */
declare function table_getIsAllRowsExpanded<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Computes the deepest expanded row id depth.
 *
 * Row ids are split on `.`; expanded-all state scans the current row model's
 * expandable rows, while explicit expanded state scans its expanded id keys.
 *
 * @example
 * ```ts
 * const depth = table_getExpandedDepth(table)
 * ```
 */
declare function table_getExpandedDepth<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
/**
 * Expands or collapses this row.
 *
 * Omitting `expanded` toggles the row. If the current state is expanded-all,
 * the function first materializes that state into a row-id map (containing
 * only expandable row ids) before applying the row-specific change.
 *
 * The call is a no-op (no `onExpandedChange`) when the requested state matches
 * the current state, or when expanding a row that cannot expand. Collapsing is
 * always allowed so stale expanded ids can be cleaned up.
 *
 * @example
 * ```ts
 * row_toggleExpanded(row)
 * ```
 */
declare function row_toggleExpanded<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, expanded?: boolean): void;
/**
 * Checks whether this row is expanded.
 *
 * `options.getIsRowExpanded` can override state-derived behavior. Otherwise
 * the row is expanded when expanded state is `true` or contains this row id.
 *
 * @example
 * ```ts
 * const expanded = row_getIsExpanded(row)
 * ```
 */
declare function row_getIsExpanded<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Checks whether this row can be expanded.
 *
 * `options.getRowCanExpand` wins when provided. Otherwise rows can expand when
 * expanding is enabled and the row has subRows.
 *
 * @example
 * ```ts
 * const canExpand = row_getCanExpand(row)
 * ```
 */
declare function row_getCanExpand<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Checks whether every ancestor of this row is expanded.
 *
 * The current row is not considered; only its parent chain is walked.
 *
 * @example
 * ```ts
 * const parentsExpanded = row_getIsAllParentsExpanded(row)
 * ```
 */
declare function row_getIsAllParentsExpanded<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Creates a row control handler that toggles this row's expanded state.
 *
 * The handler is a no-op when the row cannot expand.
 *
 * @example
 * ```ts
 * const onClick = row_getToggleExpandedHandler(row)
 * ```
 */
declare function row_getToggleExpandedHandler<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): () => void;
//#endregion
export { getDefaultExpandedState, row_getCanExpand, row_getIsAllParentsExpanded, row_getIsExpanded, row_getToggleExpandedHandler, row_toggleExpanded, table_autoResetExpanded, table_getCanSomeRowsExpand, table_getExpandedDepth, table_getIsAllRowsExpanded, table_getIsSomeRowsExpanded, table_getToggleAllRowsExpandedHandler, table_resetExpanded, table_setExpanded, table_toggleAllRowsExpanded };