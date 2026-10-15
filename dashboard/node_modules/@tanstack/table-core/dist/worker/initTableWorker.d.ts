import { RowData } from "../types/type-utils.js";
import { TableOptions } from "../types/TableOptions.js";
import { TableFeatures } from "../types/TableFeatures.js";
//#region src/worker/initTableWorker.d.ts
type TableWorkerConfig<TFeatures extends TableFeatures, TData extends RowData> = Omit<TableOptions<TFeatures, TData>, 'data'>;
/**
 * Runs a headless "shadow table" inside a dedicated Web Worker.
 *
 * Call this from a user-authored worker entry file, passing the same columns
 * and processing features used on the main thread. The shadow table runs the
 * real table-core row model pipeline (real fns, real Row objects) off the
 * main thread and posts back one payload per stage the main thread requested:
 * a transferable index permutation for flat results, a serialized row tree
 * (with eagerly computed aggregates) when grouping produces synthetic rows.
 *
 * Everything passed here must be thread-portable: `accessorKey` columns or
 * accessors defined in a shared module, and fns from registries or shared
 * modules (no closures over app state).
 *
 * @example
 * ```ts
 * // table.worker.ts
 * import { initTableWorker } from '@tanstack/table-core/experimental-worker-plugin'
 * import { columns, sharedFeatures } from './tableConfig'
 *
 * initTableWorker({ features: sharedFeatures, columns })
 * ```
 */
declare function initTableWorker<TFeatures extends TableFeatures, TData extends RowData>(config: TableWorkerConfig<TFeatures, TData>): void;
//#endregion
export { TableWorkerConfig, initTableWorker };