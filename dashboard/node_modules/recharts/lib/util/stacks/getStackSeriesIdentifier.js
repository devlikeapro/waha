"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStackSeriesIdentifier = getStackSeriesIdentifier;
/**
 * Returns identifier for stack series which is one individual graphical item in the stack.
 * @param graphicalItem - The graphical item representing the series in the stack.
 * @return The identifier for the series in the stack
 */
function getStackSeriesIdentifier(graphicalItem) {
  return graphicalItem === null || graphicalItem === void 0 ? void 0 : graphicalItem.id;
}