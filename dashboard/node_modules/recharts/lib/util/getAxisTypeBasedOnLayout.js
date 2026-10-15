"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAxisTypeBasedOnLayout = getAxisTypeBasedOnLayout;
var _ChartUtils = require("./ChartUtils");
/**
 * This function evaluates the "auto" axis domain type based on the chart layout and axis type.
 * It outputs a definitive axis domain type that can be used for further processing.
 */
function getAxisTypeBasedOnLayout(layout, axisType, axisDomainType) {
  if (axisDomainType !== 'auto') {
    return axisDomainType;
  }
  if (layout == null) {
    return undefined;
  }
  return (0, _ChartUtils.isCategoricalAxis)(layout, axisType) ? 'category' : 'number';
}