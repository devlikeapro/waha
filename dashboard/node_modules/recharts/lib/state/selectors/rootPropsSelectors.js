"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectSyncMethod = exports.selectSyncId = exports.selectStackOffsetType = exports.selectRootMaxBarSize = exports.selectRootBarSize = exports.selectReverseStackOrder = exports.selectEventEmitter = exports.selectChartName = exports.selectChartBaseValue = exports.selectBarGap = exports.selectBarCategoryGap = void 0;
var selectRootMaxBarSize = state => state.rootProps.maxBarSize;
exports.selectRootMaxBarSize = selectRootMaxBarSize;
var selectBarGap = state => state.rootProps.barGap;
exports.selectBarGap = selectBarGap;
var selectBarCategoryGap = state => state.rootProps.barCategoryGap;
exports.selectBarCategoryGap = selectBarCategoryGap;
var selectRootBarSize = state => state.rootProps.barSize;
exports.selectRootBarSize = selectRootBarSize;
var selectStackOffsetType = state => state.rootProps.stackOffset;
exports.selectStackOffsetType = selectStackOffsetType;
var selectReverseStackOrder = state => state.rootProps.reverseStackOrder;
exports.selectReverseStackOrder = selectReverseStackOrder;
var selectChartName = state => state.options.chartName;
exports.selectChartName = selectChartName;
var selectSyncId = state => state.rootProps.syncId;
exports.selectSyncId = selectSyncId;
var selectSyncMethod = state => state.rootProps.syncMethod;
exports.selectSyncMethod = selectSyncMethod;
var selectEventEmitter = state => state.options.eventEmitter;
exports.selectEventEmitter = selectEventEmitter;
var selectChartBaseValue = state => state.rootProps.baseValue;
exports.selectChartBaseValue = selectChartBaseValue;