"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectRadiusAxisForBandSize = exports.selectRadarPoints = exports.selectAngleAxisWithScaleAndViewport = exports.selectAngleAxisForBandSize = void 0;
var _reselect = require("reselect");
var _Radar = require("../../polar/Radar");
var _polarScaleSelectors = require("./polarScaleSelectors");
var _polarAxisSelectors = require("./polarAxisSelectors");
var _dataSelectors = require("./dataSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _ChartUtils = require("../../util/ChartUtils");
var _polarSelectors = require("./polarSelectors");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var selectRadiusAxisScale = (state, radiusAxisId) => (0, _polarScaleSelectors.selectPolarAxisScale)(state, 'radiusAxis', radiusAxisId);
var selectRadiusAxisForRadar = (0, _reselect.createSelector)([selectRadiusAxisScale], scale => {
  if (scale == null) {
    return undefined;
  }
  return {
    scale
  };
});
var selectRadiusAxisForBandSize = exports.selectRadiusAxisForBandSize = (0, _reselect.createSelector)([_polarAxisSelectors.selectRadiusAxis, selectRadiusAxisScale], (axisSettings, scale) => {
  if (axisSettings == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axisSettings), {}, {
    scale
  });
});
var selectRadiusAxisTicks = (state, radiusAxisId, _angleAxisId, isPanorama) => {
  return (0, _polarScaleSelectors.selectPolarAxisTicks)(state, 'radiusAxis', radiusAxisId, isPanorama);
};
var selectAngleAxisForRadar = (state, _radiusAxisId, angleAxisId) => (0, _polarAxisSelectors.selectAngleAxis)(state, angleAxisId);
var selectPolarAxisScaleForRadar = (state, _radiusAxisId, angleAxisId) => (0, _polarScaleSelectors.selectPolarAxisScale)(state, 'angleAxis', angleAxisId);
var selectAngleAxisForBandSize = exports.selectAngleAxisForBandSize = (0, _reselect.createSelector)([selectAngleAxisForRadar, selectPolarAxisScaleForRadar], (axisSettings, scale) => {
  if (axisSettings == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axisSettings), {}, {
    scale
  });
});
var selectAngleAxisTicks = (state, _radiusAxisId, angleAxisId, isPanorama) => {
  return (0, _polarScaleSelectors.selectPolarAxisTicks)(state, 'angleAxis', angleAxisId, isPanorama);
};
var selectAngleAxisWithScaleAndViewport = exports.selectAngleAxisWithScaleAndViewport = (0, _reselect.createSelector)([selectAngleAxisForRadar, selectPolarAxisScaleForRadar, _polarAxisSelectors.selectPolarViewBox], (axisOptions, scale, polarViewBox) => {
  if (polarViewBox == null || scale == null) {
    return undefined;
  }
  return {
    scale,
    type: axisOptions.type,
    dataKey: axisOptions.dataKey,
    cx: polarViewBox.cx,
    cy: polarViewBox.cy
  };
});
var pickId = (_state, _radiusAxisId, _angleAxisId, _isPanorama, radarId) => radarId;
var selectBandSizeOfAxis = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectRadiusAxisForBandSize, selectRadiusAxisTicks, selectAngleAxisForBandSize, selectAngleAxisTicks], (layout, radiusAxis, radiusAxisTicks, angleAxis, angleAxisTicks) => {
  if ((0, _ChartUtils.isCategoricalAxis)(layout, 'radiusAxis')) {
    return (0, _ChartUtils.getBandSizeOfAxis)(radiusAxis, radiusAxisTicks, false);
  }
  return (0, _ChartUtils.getBandSizeOfAxis)(angleAxis, angleAxisTicks, false);
});
var selectSynchronisedRadarDataKey = (0, _reselect.createSelector)([_polarSelectors.selectUnfilteredPolarItems, pickId], (graphicalItems, radarId) => {
  if (graphicalItems == null) {
    return undefined;
  }
  // Find the radar item with the given radarId
  var pgis = graphicalItems.find(item => item.type === 'radar' && radarId === item.id);
  // If found, return its dataKey
  return pgis === null || pgis === void 0 ? void 0 : pgis.dataKey;
});
var selectRadarPoints = exports.selectRadarPoints = (0, _reselect.createSelector)([selectRadiusAxisForRadar, selectAngleAxisWithScaleAndViewport, _dataSelectors.selectChartDataAndAlwaysIgnoreIndexes, selectSynchronisedRadarDataKey, selectBandSizeOfAxis], (radiusAxis, angleAxis, _ref, dataKey, bandSize) => {
  var chartData = _ref.chartData,
    dataStartIndex = _ref.dataStartIndex,
    dataEndIndex = _ref.dataEndIndex;
  if (radiusAxis == null || angleAxis == null || chartData == null || bandSize == null || dataKey == null) {
    return undefined;
  }
  var displayedData = chartData.slice(dataStartIndex, dataEndIndex + 1);
  return (0, _Radar.computeRadarPoints)({
    radiusAxis,
    angleAxis,
    displayedData,
    dataKey,
    bandSize
  });
});