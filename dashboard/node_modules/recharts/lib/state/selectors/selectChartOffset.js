"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectChartOffset = void 0;
var _reselect = require("reselect");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var selectChartOffset = exports.selectChartOffset = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal], offsetInternal => {
  return {
    top: offsetInternal.top,
    bottom: offsetInternal.bottom,
    left: offsetInternal.left,
    right: offsetInternal.right
  };
});