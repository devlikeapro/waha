import { tableMemo } from "../utils.js";
import { tableWorkerPipeline } from "./tableWorkerProtocol.js";
import { rebuildRowModel } from "./rebuildRowModel.js";
import { getTableWorkerBridge, syncTableWorker } from "./createTableWorker.js";

//#region src/worker/createWorkerRowModel.ts
function capitalize(stage) {
	return stage.charAt(0).toUpperCase() + stage.slice(1);
}
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
function createWorkerRowModel(tableWorker, stage) {
	return (_table) => {
		const table = _table;
		getTableWorkerBridge(tableWorker, table).stages.add(stage);
		let warned = false;
		const warnOnce = (message) => {
			if (process.env.NODE_ENV === "development" && !warned) {
				warned = true;
				console.warn(`[table-worker] ${message}`);
			}
		};
		const memoized = tableMemo({
			table,
			fnName: `table.get${capitalize(stage)}RowModel`,
			memoDeps: () => [table.getCoreRowModel(), getTableWorkerBridge(tableWorker, table).stageVersions[stage]],
			fn: () => {
				const bridge = getTableWorkerBridge(tableWorker, table);
				const payload = bridge.results[stage];
				if (!payload) {
					if (bridge.resultRequestId > 0) warnOnce(`The worker returned no '${stage}' result. Make sure the worker's initTableWorker() config registers a ${stage}RowModel factory.`);
					return table[`getPre${capitalize(stage)}RowModel`]();
				}
				if (bridge.resultRequestId > 0) for (const upstream of tableWorkerPipeline) {
					if (upstream === stage) break;
					if (table.options.features[`${upstream}RowModel`] && !bridge.results[upstream]) warnOnce(`This table has a ${upstream}RowModel, but the worker result for '${stage}' was computed without an offloaded '${upstream}' stage, so it is bypassed. Offload it too with createWorkerRowModel(tableWorker, '${upstream}').`);
				}
				return rebuildRowModel(table, payload, stage);
			}
		});
		return () => {
			syncTableWorker(tableWorker, table);
			return memoized();
		};
	};
}

//#endregion
export { createWorkerRowModel };