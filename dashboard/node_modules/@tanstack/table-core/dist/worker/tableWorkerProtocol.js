//#region src/worker/tableWorkerProtocol.ts
/**
* Row model stages that can be offloaded to the worker, in pipeline order.
* Everything else in this module is derived from this list; adding a stage
* means adding an entry here and to `tableWorkerStageStateDeps`.
*/
const tableWorkerPipeline = [
	"filtered",
	"grouped",
	"sorted",
	"expanded"
];
/**
* The state slices each stage's computation depends on. The main thread sends
* the union of deps for its registered stages; a change to any of them
* triggers one worker round trip.
*/
const tableWorkerStageStateDeps = {
	filtered: ["columnFilters", "globalFilter"],
	grouped: ["grouping"],
	sorted: ["sorting"],
	expanded: ["expanded"]
};

//#endregion
export { tableWorkerPipeline, tableWorkerStageStateDeps };