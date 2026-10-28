import { coreCellsFeature } from "./cells/coreCellsFeature.js";
import { coreColumnsFeature } from "./columns/coreColumnsFeature.js";
import { coreHeadersFeature } from "./headers/coreHeadersFeature.js";
import { coreRowModelsFeature } from "./row-models/coreRowModelsFeature.js";
import { coreRowsFeature } from "./rows/coreRowsFeature.js";
import { coreTablesFeature } from "./table/coreTablesFeature.js";
import { TableReactivityBindings } from "./reactivity/coreReactivityFeature.types.js";
import "../reactivity.js";
//#region src/core/coreFeatures.d.ts
interface CoreFeatures {
  coreReactivityFeature?: TableReactivityBindings;
  coreCellsFeature: typeof coreCellsFeature;
  coreColumnsFeature: typeof coreColumnsFeature;
  coreHeadersFeature: typeof coreHeadersFeature;
  coreRowModelsFeature: typeof coreRowModelsFeature;
  coreRowsFeature: typeof coreRowsFeature;
  coreTablesFeature: typeof coreTablesFeature;
}
/**
 * The built-in core feature set required by every table.
 *
 * These features provide table, column, row, header, cell, and core row-model behavior before optional feature plugins are added.
 */
declare const coreFeatures: CoreFeatures;
//#endregion
export { CoreFeatures, coreFeatures };