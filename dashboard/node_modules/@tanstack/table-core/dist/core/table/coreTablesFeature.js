import { assignTableAPIs } from "../../utils.js";
import { table_reset, table_setOptions } from "./coreTablesFeature.utils.js";

//#region src/core/table/coreTablesFeature.ts
/**
* Core feature that adds base table instance APIs such as reset and setOptions.
*/
const coreTablesFeature = { constructTableAPIs: (table) => {
	assignTableAPIs("coreTablesFeature", table, {
		table_reset: { fn: () => table_reset(table) },
		table_setOptions: { fn: (updater) => table_setOptions(table, updater) }
	});
} };

//#endregion
export { coreTablesFeature };