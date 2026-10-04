import { RowData, Updater } from "../../types/type-utils.js";
import { TableState } from "../../types/TableState.js";
import { TableOptions } from "../../types/TableOptions.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/core/table/coreTablesFeature.utils.d.ts
/**
 * Synchronizes externally controlled state slices into the table's base atoms.
 *
 * This keeps `options.state` values mirrored in the atom graph so derived
 * atoms, stores, and table APIs read a consistent snapshot.
 *
 * Adapters that update options during their host's render phase pass the
 * state snapshot captured by the committed render as `capturedState` — the
 * shared options object may already hold values from a newer render that
 * never commits. Pass `null` to publish nothing (a captured "no controlled
 * state"); omitting the argument reads the current `table.options.state`
 * instead. An optional `compare` suppresses semantically unchanged slice
 * writes; the default remains reference equality.
 *
 * @example
 * ```ts
 * table_syncExternalStateToBaseAtoms(table)
 * table_syncExternalStateToBaseAtoms(table, capturedState ?? null, shallow)
 * ```
 */
declare function table_syncExternalStateToBaseAtoms<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, capturedState?: Partial<TableState<TFeatures>> | null, compare?: (currentState: unknown, externalState: unknown) => boolean): void;
/**
 * Publishes captured controlled state after a host framework commits.
 *
 * Render-phase adapters stage options without synchronizing base atoms, then
 * pass the state captured by the committed render here. The commit signal also
 * invalidates ownership changes when no base atom was written.
 */
declare function table_publishExternalState<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, state: Partial<TableState<TFeatures>> | null, compare?: (currentState: unknown, externalState: unknown) => boolean): void;
/**
 * Resets all internal table base atoms to `table.initialState`, then clears
 * transient instance data through registered feature reset hooks.
 *
 * This resets internally owned state slices in a single reactivity batch. Use
 * feature-specific reset APIs when a slice may be externally owned.
 *
 * @example
 * ```ts
 * table_reset(table)
 * ```
 */
declare function table_reset<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Merges new table options with the current resolved options.
 *
 * If `options.mergeOptions` is provided, it owns the merge behavior; otherwise
 * options are shallow-merged. Static options that should never change after
 * initialization are restored on a fresh object so framework merge helpers may
 * return readonly getter/proxy objects.
 *
 * @example
 * ```ts
 * const options = table_mergeOptions(table, nextOptions)
 * ```
 */
declare function table_mergeOptions<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, newOptions: TableOptions<TFeatures, TData>): TableOptions<TFeatures, TData>;
/**
 * Updates the table options object.
 *
 * The updater receives the current resolved options and the merged result is
 * immediately assigned to the table instance.
 *
 * @example
 * ```ts
 * table_setOptions(table, (old) => old)
 * table_setOptions(table, (old) => old, { syncExternalState: false })
 * ```
 */
declare function table_setOptions<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<TableOptions<TFeatures, TData>>, options?: {
  syncExternalState?: boolean;
}): void;
//#endregion
export { table_mergeOptions, table_publishExternalState, table_reset, table_setOptions, table_syncExternalStateToBaseAtoms };