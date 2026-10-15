import { TableState_WorkerRowModels, TableWorkerStage } from "./tableWorkerProtocol.js";
import { Table } from "../types/Table.js";
import { TableFeature } from "../types/TableFeatures.js";
import { TableWorkerDataPayload } from "./rebuildRowModel.js";
//#region src/worker/createTableWorker.d.ts
declare module '../types/TableFeatures' {
  interface Plugins {
    workerRowModelsFeature: TableFeature;
  }
}
declare module '../types/TableState' {
  interface TableState_FeatureMap {
    workerRowModelsFeature: TableState_WorkerRowModels;
  }
}
interface TableWorkerOptions {
  /**
   * Creates the dedicated worker that runs the shadow table. The worker entry
   * must call `initTableWorker` with the same columns and processing config.
   *
   * The `new Worker(new URL(...))` expression must live in your code (not the
   * library) so your bundler can statically discover and bundle the worker
   * entry file.
   *
   * @example
   * ```ts
   * createWorker: () =>
   *   new Worker(new URL('./table.worker.ts', import.meta.url), {
   *     type: 'module',
   *   })
   * ```
   */
  createWorker: () => Worker;
}
interface TableWorkerBridge {
  worker: Worker | null;
  /** The worker errored (load failure or uncaught throw); stop posting. */
  failed: boolean;
  lastData: unknown;
  dataVersion: number;
  requestId: number;
  resultRequestId: number;
  /** A process request has been posted and its result has not arrived yet. */
  inFlight: boolean;
  /** State changed since the last posted request; post when possible. */
  needsProcess: boolean;
  sentAt: number;
  /** The stages registered on this table (grows as factories initialize). */
  stages: Set<TableWorkerStage>;
  /** Snapshot of state refs + stage count captured at the last post. */
  sentState: Record<string, unknown> | null;
  sentStageCount: number;
  /** Latest observed state refs, posted on the trailing edge if in flight. */
  lastState: Record<string, unknown>;
  results: { [K in TableWorkerStage]?: TableWorkerDataPayload; };
  /** Bumped per stage only when that stage's payload actually changed. */
  stageVersions: { [K in TableWorkerStage]?: number; };
  /** The first applied result is not a change; auto-resets skip it. */
  hasAppliedResults: boolean;
}
type AnyTable = Table<any, any>;
/**
 * A handle shared by every worker-backed row model on a table. It owns the
 * worker instance and the per-table request/result bookkeeping, so registering
 * one stage or four costs exactly one worker and one round trip per change.
 */
interface TableWorker {
  _options: TableWorkerOptions;
  _bridges: WeakMap<object, TableWorkerBridge>;
  _liveBridges: Set<TableWorkerBridge>;
  /**
   * Terminates every worker created through this handle and resets the
   * bookkeeping. Safe to call at any time: the next row model read lazily
   * recreates the worker and re-sends the data (self-healing). Note that
   * nothing calls this automatically yet; React StrictMode double-mounts and
   * HMR updates still leak a worker in development until the reactivity
   * bindings grow a real `unmount` hook.
   */
  terminate: () => void;
}
/**
 * Registers the `workerRowModels` state slice
 * (`{ version, isPending, lastComputeMs, lastRoundTripMs }`). Worker results
 * land by bumping `version`, so re-renders flow through the exact same state
 * mechanism as every other table state change.
 */
declare const workerRowModelsFeature: TableFeature;
/**
 * Creates the shared worker handle for a table's worker-backed row models.
 * Pass it to `createWorkerRowModel()` once per stage you want offloaded.
 */
declare function createTableWorker(options: TableWorkerOptions): TableWorker;
declare function getTableWorkerBridge(tableWorker: TableWorker, table: AnyTable): TableWorkerBridge;
/**
 * Pull-based sync, called at the top of every worker-backed row model read
 * (i.e. every render). Posts data on identity change and a single-flight
 * process request on state change; both are cheap no-ops otherwise, and
 * multiple stages sharing the handle dedupe onto one request.
 */
declare function syncTableWorker(tableWorker: TableWorker, table: AnyTable): void;
//#endregion
export { TableWorker, TableWorkerBridge, TableWorkerOptions, createTableWorker, getTableWorkerBridge, syncTableWorker, workerRowModelsFeature };