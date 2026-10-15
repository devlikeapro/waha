"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectBrushSettings = exports.selectBrushDimensions = void 0;
var _reselect = require("reselect");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _containerSelectors = require("./containerSelectors");
var _DataUtils = require("../../util/DataUtils");
var selectBrushSettings = state => state.brush;
exports.selectBrushSettings = selectBrushSettings;
var selectBrushDimensions = exports.selectBrushDimensions = (0, _reselect.createSelector)([selectBrushSettings, _selectChartOffsetInternal.selectChartOffsetInternal, _containerSelectors.selectMargin], (brushSettings, offset, margin) => ({
  height: brushSettings.height,
  x: (0, _DataUtils.isNumber)(brushSettings.x) ? brushSettings.x : offset.left,
  y: (0, _DataUtils.isNumber)(brushSettings.y) ? brushSettings.y : offset.top + offset.height + offset.brushBottom - ((margin === null || margin === void 0 ? void 0 : margin.bottom) || 0),
  width: (0, _DataUtils.isNumber)(brushSettings.width) ? brushSettings.width : offset.width
}));