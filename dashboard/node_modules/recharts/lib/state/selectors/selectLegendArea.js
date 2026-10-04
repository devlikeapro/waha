"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectLegendArea = void 0;
var _reselect = require("reselect");
var _containerSelectors = require("./containerSelectors");
var selectLegendArea = exports.selectLegendArea = (0, _reselect.createSelector)([_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, _containerSelectors.selectMargin], (chartWidth, chartHeight, margin) => {
  return {
    x: margin.left || 0,
    y: margin.top || 0,
    width: Math.max(chartWidth - (margin.left || 0) - (margin.right || 0), 0),
    height: Math.max(chartHeight - (margin.top || 0) - (margin.bottom || 0), 0)
  };
});