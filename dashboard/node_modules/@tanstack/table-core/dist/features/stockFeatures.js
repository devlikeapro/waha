import { cellSelectionFeature } from "./cell-selection/cellSelectionFeature.js";
import { cellSpanningFeature } from "./cell-spanning/cellSpanningFeature.js";
import { columnFacetingFeature } from "./column-faceting/columnFacetingFeature.js";
import { rowAggregationFeature } from "./row-aggregation/rowAggregationFeature.js";
import { columnFilteringFeature } from "./column-filtering/columnFilteringFeature.js";
import { columnGroupingFeature } from "./column-grouping/columnGroupingFeature.js";
import { columnOrderingFeature } from "./column-ordering/columnOrderingFeature.js";
import { columnPinningFeature } from "./column-pinning/columnPinningFeature.js";
import { columnResizingFeature } from "./column-resizing/columnResizingFeature.js";
import { columnSizingFeature } from "./column-sizing/columnSizingFeature.js";
import { columnVisibilityFeature } from "./column-visibility/columnVisibilityFeature.js";
import { globalFilteringFeature } from "./global-filtering/globalFilteringFeature.js";
import { rowExpandingFeature } from "./row-expanding/rowExpandingFeature.js";
import { rowPaginationFeature } from "./row-pagination/rowPaginationFeature.js";
import { rowPinningFeature } from "./row-pinning/rowPinningFeature.js";
import { rowSelectionFeature } from "./row-selection/rowSelectionFeature.js";
import { rowSortingFeature } from "./row-sorting/rowSortingFeature.js";

//#region src/features/stockFeatures.ts
/**
* The complete set of stock optional table features.
*
* Use individual feature exports for tree-shaking, or this aggregate when a table should include every built-in feature.
*/
const stockFeatures = {
	cellSelectionFeature,
	cellSpanningFeature,
	columnFacetingFeature,
	columnFilteringFeature,
	columnGroupingFeature,
	columnOrderingFeature,
	columnPinningFeature,
	columnResizingFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	globalFilteringFeature,
	rowAggregationFeature,
	rowExpandingFeature,
	rowPaginationFeature,
	rowPinningFeature,
	rowSelectionFeature,
	rowSortingFeature
};

//#endregion
export { stockFeatures };