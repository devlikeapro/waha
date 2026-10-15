function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { createSelector } from 'reselect';
import { computeRadarPoints } from '../../polar/Radar';
import { selectPolarAxisScale, selectPolarAxisTicks } from './polarScaleSelectors';
import { selectAngleAxis, selectPolarViewBox, selectRadiusAxis } from './polarAxisSelectors';
import { selectChartDataAndAlwaysIgnoreIndexes } from './dataSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { getBandSizeOfAxis, isCategoricalAxis } from '../../util/ChartUtils';
import { selectUnfilteredPolarItems } from './polarSelectors';
var selectRadiusAxisScale = (state, radiusAxisId) => selectPolarAxisScale(state, 'radiusAxis', radiusAxisId);
var selectRadiusAxisForRadar = createSelector([selectRadiusAxisScale], scale => {
  if (scale == null) {
    return undefined;
  }
  return {
    scale
  };
});
export var selectRadiusAxisForBandSize = createSelector([selectRadiusAxis, selectRadiusAxisScale], (axisSettings, scale) => {
  if (axisSettings == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axisSettings), {}, {
    scale
  });
});
var selectRadiusAxisTicks = (state, radiusAxisId, _angleAxisId, isPanorama) => {
  return selectPolarAxisTicks(state, 'radiusAxis', radiusAxisId, isPanorama);
};
var selectAngleAxisForRadar = (state, _radiusAxisId, angleAxisId) => selectAngleAxis(state, angleAxisId);
var selectPolarAxisScaleForRadar = (state, _radiusAxisId, angleAxisId) => selectPolarAxisScale(state, 'angleAxis', angleAxisId);
export var selectAngleAxisForBandSize = createSelector([selectAngleAxisForRadar, selectPolarAxisScaleForRadar], (axisSettings, scale) => {
  if (axisSettings == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axisSettings), {}, {
    scale
  });
});
var selectAngleAxisTicks = (state, _radiusAxisId, angleAxisId, isPanorama) => {
  return selectPolarAxisTicks(state, 'angleAxis', angleAxisId, isPanorama);
};
export var selectAngleAxisWithScaleAndViewport = createSelector([selectAngleAxisForRadar, selectPolarAxisScaleForRadar, selectPolarViewBox], (axisOptions, scale, polarViewBox) => {
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
var selectBandSizeOfAxis = createSelector([selectChartLayout, selectRadiusAxisForBandSize, selectRadiusAxisTicks, selectAngleAxisForBandSize, selectAngleAxisTicks], (layout, radiusAxis, radiusAxisTicks, angleAxis, angleAxisTicks) => {
  if (isCategoricalAxis(layout, 'radiusAxis')) {
    return getBandSizeOfAxis(radiusAxis, radiusAxisTicks, false);
  }
  return getBandSizeOfAxis(angleAxis, angleAxisTicks, false);
});
var selectSynchronisedRadarDataKey = createSelector([selectUnfilteredPolarItems, pickId], (graphicalItems, radarId) => {
  if (graphicalItems == null) {
    return undefined;
  }
  // Find the radar item with the given radarId
  var pgis = graphicalItems.find(item => item.type === 'radar' && radarId === item.id);
  // If found, return its dataKey
  return pgis === null || pgis === void 0 ? void 0 : pgis.dataKey;
});
export var selectRadarPoints = createSelector([selectRadiusAxisForRadar, selectAngleAxisWithScaleAndViewport, selectChartDataAndAlwaysIgnoreIndexes, selectSynchronisedRadarDataKey, selectBandSizeOfAxis], (radiusAxis, angleAxis, _ref, dataKey, bandSize) => {
  var chartData = _ref.chartData,
    dataStartIndex = _ref.dataStartIndex,
    dataEndIndex = _ref.dataEndIndex;
  if (radiusAxis == null || angleAxis == null || chartData == null || bandSize == null || dataKey == null) {
    return undefined;
  }
  var displayedData = chartData.slice(dataStartIndex, dataEndIndex + 1);
  return computeRadarPoints({
    radiusAxis,
    angleAxis,
    displayedData,
    dataKey,
    bandSize
  });
});