import { RowData } from "../types/type-utils.js";
import { TableWorkerStage } from "./tableWorkerProtocol.js";
import { RowModel } from "../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../types/Table.js";
import { TableFeatures } from "../types/TableFeatures.js";
import { TableWorker } from "./createTableWorker.js";
//#region src/worker/createWorkerRowModel.d.ts
/**
 * Turns any row model stage into a worker-backed one. The returned factory
 * plugs into the standard feature slot for that stage, so it composes with
 * the rest of the pipeline exactly like the sync factory it replaces.
 *
 * Register only the stages you want offloaded; each import is independent and
 * tree-shakable. All stages on a table share one worker and one round trip
 * per state change via the `tableWorker` handle. Until a result lands, the
 * stage returns its pre-stage model (stale-while-revalidate).
 *
 * Offloaded stages must form a contiguous prefix of the pipeline
 * (filtered -> grouped -> sorted -> expanded): a stage's worker result encodes
 * everything upstream as computed in the worker, so any upstream stage
 * registered on the main thread must be offloaded too. A dev warning fires on
 * mismatches.
 *
 * @example
 * ```ts
 * const tableWorker = createTableWorker({ createWorker })
 *
 * const features = tableFeatures({
 *   rowSortingFeature,
 *   columnGroupingFeature,
 *   workerRowModelsFeature,
 *   filteredRowModel: createWorkerRowModel(tableWorker, 'filtered'),
 *   groupedRowModel: createWorkerRowModel(tableWorker, 'grouped'),
 *   sortedRowModel: createWorkerRowModel(tableWorker, 'sorted'),
 * })
 * ```
 */
declare function createWorkerRowModel(tableWorker: TableWorker, stage: TableWorkerStage): <TFeatures extends TableFeatures, TData extends RowData>(_table: Table<TFeatures, TData>) => (() => RowModel<TFeatures, TData>);
//#endregion
export { createWorkerRowModel };