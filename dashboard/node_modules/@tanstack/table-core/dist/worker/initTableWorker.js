import { makeObjectMap } from "../utils.js";
import { constructTable } from "../core/table/constructTable.js";
import { storeReactivityBindings } from "../store-reactivity-bindings.js";
import { serializeRowModel } from "./serializeRowModel.js";

//#region src/worker/initTableWorker.ts
function capitalize(stage) {
	return stage.charAt(0).toUpperCase() + stage.slice(1);
}
/** Flatten column-group defs to leaf defs (mirrors core's id resolution). */
function flattenColumnDefs(defs) {
	return defs.flatMap((def) => def.columns ? flattenColumnDefs(def.columns) : [def]);
}
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
function initTableWorker(config) {
	let table;
	let dataVersion = 0;
	let coreIndexById = makeObjectMap();
	let aggregateColumnIds = [];
	let lastSentModels = {};
	self.onmessage = (event) => {
		const message = event.data;
		if (message.type === "data") {
			dataVersion = message.dataVersion;
			lastSentModels = {};
			if (!table) {
				table = constructTable({
					...config,
					features: {
						coreReactivityFeature: storeReactivityBindings(),
						...config.features
					},
					data: message.data
				});
				aggregateColumnIds = flattenColumnDefs(config.columns).filter((def) => def.aggregationFn != null || def.aggregatedCell != null).map((def) => def.id ?? (def.accessorKey === void 0 ? void 0 : String(def.accessorKey).replaceAll(".", "_"))).filter((id) => id != null);
			} else table.setOptions((prev) => ({
				...prev,
				data: message.data
			}));
			const coreFlatRows = table.getCoreRowModel().flatRows;
			coreIndexById = makeObjectMap();
			for (let i = 0; i < coreFlatRows.length; i++) coreIndexById[coreFlatRows[i].id] = i;
			return;
		}
		if (!table) return;
		const start = performance.now();
		table._reactivity.batch(() => {
			for (const [key, value] of Object.entries(message.state)) {
				const baseAtom = table.baseAtoms[key];
				if (baseAtom && value !== void 0) baseAtom.set(value);
			}
		});
		const stages = {};
		const transfer = [];
		for (const stage of message.stages) {
			if (!config.features[`${stage}RowModel`]) continue;
			const model = table[`get${capitalize(stage)}RowModel`]();
			if (lastSentModels[stage] === model) {
				stages[stage] = { kind: "unchanged" };
				continue;
			}
			lastSentModels[stage] = model;
			stages[stage] = serializeRowModel(model, coreIndexById, table.getCoreRowModel().flatRows, aggregateColumnIds, transfer, stage);
		}
		const response = {
			type: "result",
			requestId: message.requestId,
			dataVersion,
			stages,
			computeMs: performance.now() - start
		};
		postMessage(response, { transfer });
	};
}

//#endregion
export { initTableWorker };