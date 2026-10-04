"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectAllYAxes = exports.selectAllXAxes = void 0;
var _reselect = require("reselect");
var selectAllXAxes = exports.selectAllXAxes = (0, _reselect.createSelector)(state => state.cartesianAxis.xAxis, xAxisMap => {
  return Object.values(xAxisMap);
});
var selectAllYAxes = exports.selectAllYAxes = (0, _reselect.createSelector)(state => state.cartesianAxis.yAxis, yAxisMap => {
  return Object.values(yAxisMap);
});