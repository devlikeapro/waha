"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectActivePropsFromChartPointer = void 0;
var _reselect = require("reselect");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _tooltipSelectors = require("./tooltipSelectors");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _selectors = require("./selectors");
var _polarAxisSelectors = require("./polarAxisSelectors");
var _selectTooltipAxisType = require("./selectTooltipAxisType");
var pickChartPointer = (_state, chartPointer) => chartPointer;
var selectActivePropsFromChartPointer = exports.selectActivePropsFromChartPointer = (0, _reselect.createSelector)([pickChartPointer, _chartLayoutContext.selectChartLayout, _polarAxisSelectors.selectPolarViewBox, _selectTooltipAxisType.selectTooltipAxisType, _tooltipSelectors.selectTooltipAxisRangeWithReverse, _tooltipSelectors.selectTooltipAxisTicks, _selectors.selectOrderedTooltipTicks, _selectChartOffsetInternal.selectChartOffsetInternal], _selectors.combineActiveProps);