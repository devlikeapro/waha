import { TableFeature } from "../../types/TableFeatures.js";
//#region src/features/column-faceting/columnFacetingFeature.d.ts
/**
 * Feature that derives faceted row models, unique values, and min/max values for filters.
 *
 * These APIs are deliberately not memoized at this layer: the stock
 * `createFaceted*` factories memoize internally (like every other stock row
 * model), and an extra memo layer here would freeze custom factories whose
 * data changes independently of the faceted row model. Custom factories own
 * their memoization.
 */
declare const columnFacetingFeature: TableFeature;
//#endregion
export { columnFacetingFeature };