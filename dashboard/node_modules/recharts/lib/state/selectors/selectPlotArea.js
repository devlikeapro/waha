"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectPlotArea = void 0;
var _reselect = require("reselect");
var _selectChartOffset = require("./selectChartOffset");
var _containerSelectors = require("./containerSelectors");
var selectPlotArea = exports.selectPlotArea = (0, _reselect.createSelector)([_selectChartOffset.selectChartOffset, _containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight], (offset, chartWidth, chartHeight) => {
  if (!offset || chartWidth == null || chartHeight == null) {
    return undefined;
  }
  return {
    x: offset.left,
    y: offset.top,
    width: Math.max(0, chartWidth - offset.left - offset.right),
    height: Math.max(0, chartHeight - offset.top - offset.bottom)
  };
});