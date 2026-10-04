import { table_autoResetExpanded } from "../features/row-expanding/rowExpandingFeature.utils.js";
import { table_autoResetPageIndex } from "../features/row-pagination/rowPaginationFeature.utils.js";
import { tableWorkerPipeline, tableWorkerStageStateDeps } from "./tableWorkerProtocol.js";
import { applyFilterDataToCoreRows } from "./rebuildRowModel.js";

//#region src/worker/createTableWorker.ts
/**
* Registers the `workerRowModels` state slice
* (`{ version, isPending, lastComputeMs, lastRoundTripMs }`). Worker results
* land by bumping `version`, so re-renders flow through the exact same state
* mechanism as every other table state change.
*/
const workerRowModelsFeature = { getInitialState: (initialState) => ({
	workerRowModels: {
		version: 0,
		isPending: false
	},
	...initialState
}) };
/**
* Creates the shared worker handle for a table's worker-backed row models.
* Pass it to `createWorkerRowModel()` once per stage you want offloaded.
*/
function createTableWorker(options) {
	const liveBridges = /* @__PURE__ */ new Set();
	return {
		_options: options,
		_bridges: /* @__PURE__ */ new WeakMap(),
		_liveBridges: liveBridges,
		terminate: () => {
			for (const bridge of liveBridges) {
				bridge.worker?.terminate();
				bridge.worker = null;
				bridge.failed = false;
				bridge.lastData = void 0;
				bridge.inFlight = false;
				bridge.needsProcess = true;
				bridge.sentState = null;
				bridge.sentStageCount = 0;
			}
			liveBridges.clear();
		}
	};
}
function getTableWorkerBridge(tableWorker, table) {
	let bridge = tableWorker._bridges.get(table);
	if (!bridge) {
		bridge = {
			worker: null,
			failed: false,
			lastData: void 0,
			dataVersion: 0,
			requestId: 0,
			resultRequestId: 0,
			inFlight: false,
			needsProcess: true,
			sentAt: 0,
			stages: /* @__PURE__ */ new Set(),
			sentState: null,
			sentStageCount: 0,
			lastState: {},
			results: {},
			stageVersions: {},
			hasAppliedResults: false
		};
		tableWorker._bridges.set(table, bridge);
	}
	return bridge;
}
/** Shallow reference comparison; atoms return stable refs when unchanged. */
function statesEqual(a, b) {
	if (a === null) return false;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;
	for (const key of bKeys) if (a[key] !== b[key]) return false;
	return true;
}
function setWorkerRowModelsState(table, update) {
	table.baseAtoms.workerRowModels?.set((prev) => update(prev ?? { version: 0 }));
}
function postProcess(table, bridge) {
	const stages = tableWorkerPipeline.filter((stage) => bridge.stages.has(stage));
	bridge.needsProcess = false;
	bridge.sentState = bridge.lastState;
	bridge.sentStageCount = bridge.stages.size;
	bridge.inFlight = true;
	bridge.sentAt = performance.now();
	const requestId = ++bridge.requestId;
	bridge.worker.postMessage({
		type: "process",
		requestId,
		dataVersion: bridge.dataVersion,
		stages,
		state: bridge.lastState
	});
	table._reactivity.schedule(() => {
		if (bridge.requestId === requestId && bridge.resultRequestId < requestId) setWorkerRowModelsState(table, (prev) => ({
			...prev,
			isPending: true
		}));
	});
}
function handleResult(table, bridge, message) {
	if (message.requestId !== bridge.requestId) return;
	bridge.inFlight = false;
	bridge.resultRequestId = message.requestId;
	if (message.dataVersion !== bridge.dataVersion) {
		postProcess(table, bridge);
		return;
	}
	let anyChanged = false;
	let groupedChanged = false;
	for (const [stage, payload] of Object.entries(message.stages)) {
		if (payload.kind === "unchanged") continue;
		if (stage === "filtered") applyFilterDataToCoreRows(table.getCoreRowModel().flatRows, payload);
		bridge.results[stage] = payload;
		bridge.stageVersions[stage] = (bridge.stageVersions[stage] ?? 0) + 1;
		anyChanged = true;
		if (stage === "grouped") groupedChanged = true;
	}
	const roundTripMs = performance.now() - bridge.sentAt;
	setWorkerRowModelsState(table, (prev) => ({
		version: (prev.version ?? 0) + 1,
		isPending: false,
		lastComputeMs: message.computeMs,
		lastRoundTripMs: roundTripMs
	}));
	const isFirstAppliedResult = !bridge.hasAppliedResults;
	bridge.hasAppliedResults = true;
	if (anyChanged && !isFirstAppliedResult) table._reactivity.schedule(() => table._reactivity.untrack(() => {
		if (groupedChanged) table_autoResetExpanded(table);
		table_autoResetPageIndex(table);
	}));
	if (bridge.needsProcess) postProcess(table, bridge);
}
function handleError(table, bridge, event) {
	if (bridge.failed) return;
	bridge.failed = true;
	bridge.inFlight = false;
	console.error("[table-worker] The table worker failed; worker row models will keep their last results and stop updating. Check that the worker entry loads and that its initTableWorker() config is thread-portable.", event);
	bridge.worker?.terminate();
	bridge.worker = null;
	setWorkerRowModelsState(table, (prev) => ({
		...prev,
		isPending: false
	}));
}
function ensureWorker(tableWorker, table, bridge) {
	if (bridge.worker) return;
	bridge.worker = tableWorker._options.createWorker();
	tableWorker._liveBridges.add(bridge);
	bridge.worker.onmessage = (event) => {
		handleResult(table, bridge, event.data);
	};
	bridge.worker.onerror = (event) => handleError(table, bridge, event);
	bridge.worker.onmessageerror = (event) => handleError(table, bridge, event);
}
/**
* Pull-based sync, called at the top of every worker-backed row model read
* (i.e. every render). Posts data on identity change and a single-flight
* process request on state change; both are cheap no-ops otherwise, and
* multiple stages sharing the handle dedupe onto one request.
*/
function syncTableWorker(tableWorker, table) {
	if (typeof Worker === "undefined") return;
	const bridge = getTableWorkerBridge(tableWorker, table);
	if (bridge.failed) return;
	ensureWorker(tableWorker, table, bridge);
	const data = table.options.data;
	if (data !== bridge.lastData) {
		bridge.lastData = data;
		bridge.dataVersion++;
		bridge.worker.postMessage({
			type: "data",
			dataVersion: bridge.dataVersion,
			data
		});
		bridge.needsProcess = true;
	}
	const atoms = table.atoms;
	const state = {};
	for (const stage of bridge.stages) for (const key of tableWorkerStageStateDeps[stage]) state[key] = atoms[key]?.get();
	bridge.lastState = state;
	if (!bridge.needsProcess && (!statesEqual(bridge.sentState, state) || bridge.stages.size !== bridge.sentStageCount)) bridge.needsProcess = true;
	if (bridge.needsProcess && !bridge.inFlight) postProcess(table, bridge);
}

//#endregion
export { createTableWorker, getTableWorkerBridge, syncTableWorker, workerRowModelsFeature };