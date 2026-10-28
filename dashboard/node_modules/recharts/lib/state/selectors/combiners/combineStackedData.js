"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineStackedData = void 0;
var _getStackSeriesIdentifier = require("../../../util/stacks/getStackSeriesIdentifier");
var combineStackedData = (stackGroups, barSettings) => {
  var stackSeriesIdentifier = (0, _getStackSeriesIdentifier.getStackSeriesIdentifier)(barSettings);
  if (!stackGroups || stackSeriesIdentifier == null || barSettings == null) {
    return undefined;
  }
  var stackId = barSettings.stackId;
  if (stackId == null) {
    return undefined;
  }
  var stackGroup = stackGroups[stackId];
  if (!stackGroup) {
    return undefined;
  }
  var stackedData = stackGroup.stackedData;
  if (!stackedData) {
    return undefined;
  }
  return stackedData.find(sd => sd.key === stackSeriesIdentifier);
};
exports.combineStackedData = combineStackedData;