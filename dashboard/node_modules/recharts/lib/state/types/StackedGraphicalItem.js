"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStacked = isStacked;
/**
 * Some graphical items allow data stacking. The stacks are optional,
 * so all props here are optional too.
 */

/**
 * Some graphical items allow data stacking.
 * This interface is used to represent the items that are stacked
 * because the user has provided the stackId and dataKey properties.
 */

function isStacked(graphicalItem) {
  return 'stackId' in graphicalItem && graphicalItem.stackId != null && graphicalItem.dataKey != null;
}