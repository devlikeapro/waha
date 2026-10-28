import { coreCellsFeature } from "./cells/coreCellsFeature.js";
import { coreColumnsFeature } from "./columns/coreColumnsFeature.js";
import { coreHeadersFeature } from "./headers/coreHeadersFeature.js";
import { coreRowModelsFeature } from "./row-models/coreRowModelsFeature.js";
import { coreRowsFeature } from "./rows/coreRowsFeature.js";
import { coreTablesFeature } from "./table/coreTablesFeature.js";

//#region src/core/coreFeatures.ts
/**
* The built-in core feature set required by every table.
*
* These features provide table, column, row, header, cell, and core row-model behavior before optional feature plugins are added.
*/
const coreFeatures = {
	coreCellsFeature,
	coreColumnsFeature,
	coreHeadersFeature,
	coreRowModelsFeature,
	coreRowsFeature,
	coreTablesFeature
};

//#endregion
export { coreFeatures };