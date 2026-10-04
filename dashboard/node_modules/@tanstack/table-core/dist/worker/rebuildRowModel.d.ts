import { TableWorkerStagePayload } from "./tableWorkerProtocol.js";
import "../core/row-models/coreRowModelsFeature.types.js";
import "../types/Table.js";
import "../types/TableFeatures.js";
//#region src/worker/rebuildRowModel.d.ts
/** Payloads that carry data; `unchanged` never reaches the rebuilder. */
type TableWorkerDataPayload = Exclude<TableWorkerStagePayload, {
  kind: 'unchanged';
}>;
//#endregion
export { TableWorkerDataPayload };