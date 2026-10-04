import { TableFeature } from "../../types/TableFeatures.js";
//#region src/features/column-pinning/columnPinningFeature.d.ts
/**
 * Feature that adds column pinning state and APIs for logical start, center,
 * and end regions.
 *
 * In LTR languages/layouts, start usually corresponds to left and end to
 * right. In RTL languages/layouts, start usually corresponds to right and end
 * to left.
 */
declare const columnPinningFeature: TableFeature;
//#endregion
export { columnPinningFeature };