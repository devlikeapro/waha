import { assignPrototypeAPIs } from "../../utils.js";
import { cell_getContext, cell_getValue, cell_renderValue } from "./coreCellsFeature.utils.js";

//#region src/core/cells/coreCellsFeature.ts
/**
* Core feature that adds cell value, render, and context APIs.
*/
const coreCellsFeature = { assignCellPrototype: (prototype, table) => {
	assignPrototypeAPIs("coreCellsFeature", prototype, table, {
		cell_getValue: { fn: (cell) => cell_getValue(cell) },
		cell_renderValue: { fn: (cell) => cell_renderValue(cell) },
		cell_getContext: {
			fn: (cell) => cell_getContext(cell),
			memoDeps: (cell) => [cell]
		}
	});
} };

//#endregion
export { coreCellsFeature };