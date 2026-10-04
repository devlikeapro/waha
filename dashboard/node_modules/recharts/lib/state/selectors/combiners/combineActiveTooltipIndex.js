"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineActiveTooltipIndex = void 0;
var _isWellBehavedNumber = require("../../../util/isWellBehavedNumber");
var _ChartUtils = require("../../../util/ChartUtils");
var _isDomainSpecifiedByUser = require("../../../util/isDomainSpecifiedByUser");
function toFiniteNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (value instanceof Date) {
    var numericValue = value.valueOf();
    return Number.isFinite(numericValue) ? numericValue : undefined;
  }
  var parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
function isValueWithinNumberDomain(value, domain) {
  var numericValue = toFiniteNumber(value);
  var lowerBound = domain[0];
  var upperBound = domain[1];
  if (numericValue === undefined) {
    return false;
  }
  var min = Math.min(lowerBound, upperBound);
  var max = Math.max(lowerBound, upperBound);
  return numericValue >= min && numericValue <= max;
}
function isValueWithinDomain(entry, axisDataKey, domain) {
  if (domain == null || axisDataKey == null) {
    return true;
  }
  var value = (0, _ChartUtils.getValueByDataKey)(entry, axisDataKey);
  if (value == null) {
    return true;
  }
  if (!(0, _isDomainSpecifiedByUser.isWellFormedNumberDomain)(domain)) {
    return true;
  }
  return isValueWithinNumberDomain(value, domain);
}
var combineActiveTooltipIndex = (tooltipInteraction, chartData, axisDataKey, domain) => {
  var desiredIndex = tooltipInteraction === null || tooltipInteraction === void 0 ? void 0 : tooltipInteraction.index;
  if (desiredIndex == null) {
    return null;
  }
  var indexAsNumber = Number(desiredIndex);
  if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(indexAsNumber)) {
    // this is for charts like Sankey and Treemap that do not support numerical indexes. We need a proper solution for this before we can start supporting keyboard events on these charts.
    return desiredIndex;
  }

  /*
   * Zero is a trivial limit for single-dimensional charts like Line and Area,
   * but this also needs a support for multidimensional charts like Sankey and Treemap! TODO
   */
  var lowerLimit = 0;
  var upperLimit = +Infinity;
  if (chartData.length > 0) {
    upperLimit = chartData.length - 1;
  }

  // now let's clamp the desiredIndex between the limits
  var clampedIndex = Math.max(lowerLimit, Math.min(indexAsNumber, upperLimit));
  var entry = chartData[clampedIndex];
  if (entry == null) {
    return String(clampedIndex);
  }
  if (!isValueWithinDomain(entry, axisDataKey, domain)) {
    return null;
  }
  return String(clampedIndex);
};
exports.combineActiveTooltipIndex = combineActiveTooltipIndex;