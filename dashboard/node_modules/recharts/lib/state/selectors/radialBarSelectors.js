"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectRadiusAxisWithScale = exports.selectRadiusAxisTicks = exports.selectRadialBarSectors = exports.selectRadialBarLegendPayload = exports.selectPolarBarSizeList = exports.selectPolarBarPosition = exports.selectPolarBarBandSize = exports.selectBaseValue = exports.selectBandSizeOfPolarAxis = exports.selectAngleAxisWithScale = exports.selectAllPolarBarPositions = exports.pickMaxBarSize = void 0;
var _reselect = require("reselect");
var _RadialBar = require("../../polar/RadialBar");
var _dataSelectors = require("./dataSelectors");
var _polarScaleSelectors = require("./polarScaleSelectors");
var _axisSelectors = require("./axisSelectors");
var _polarAxisSelectors = require("./polarAxisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _ChartUtils = require("../../util/ChartUtils");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _polarSelectors = require("./polarSelectors");
var _DataUtils = require("../../util/DataUtils");
var _combineDisplayedStackedData = require("./combiners/combineDisplayedStackedData");
var _StackedGraphicalItem = require("../types/StackedGraphicalItem");
var _combineBarSizeList = require("./combiners/combineBarSizeList");
var _combineAllBarPositions = require("./combiners/combineAllBarPositions");
var _combineStackedData = require("./combiners/combineStackedData");
var _combineBarPosition = require("./combiners/combineBarPosition");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var selectRadiusAxisForRadialBar = (state, radiusAxisId) => (0, _polarAxisSelectors.selectRadiusAxis)(state, radiusAxisId);
var selectRadiusAxisScaleForRadar = (state, radiusAxisId) => (0, _polarScaleSelectors.selectPolarAxisScale)(state, 'radiusAxis', radiusAxisId);
var selectRadiusAxisWithScale = exports.selectRadiusAxisWithScale = (0, _reselect.createSelector)([selectRadiusAxisForRadialBar, selectRadiusAxisScaleForRadar], (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});
var selectRadiusAxisTicks = (state, radiusAxisId) => {
  return (0, _polarScaleSelectors.selectPolarGraphicalItemAxisTicks)(state, 'radiusAxis', radiusAxisId, false);
};
exports.selectRadiusAxisTicks = selectRadiusAxisTicks;
var selectAngleAxisForRadialBar = (state, _radiusAxisId, angleAxisId) => (0, _polarAxisSelectors.selectAngleAxis)(state, angleAxisId);
var selectAngleAxisScaleForRadialBar = (state, _radiusAxisId, angleAxisId) => (0, _polarScaleSelectors.selectPolarAxisScale)(state, 'angleAxis', angleAxisId);
var selectAngleAxisWithScale = exports.selectAngleAxisWithScale = (0, _reselect.createSelector)([selectAngleAxisForRadialBar, selectAngleAxisScaleForRadialBar], (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});
var selectAngleAxisTicks = (state, _radiusAxisId, angleAxisId) => {
  // here we can hardcode isPanorama to false because radialBar does not support panorama mode
  return (0, _polarScaleSelectors.selectPolarAxisTicks)(state, 'angleAxis', angleAxisId, false);
};
var pickRadialBarSettings = (_state, _radiusAxisId, _angleAxisId, radialBarSettings) => radialBarSettings;
var selectSynchronisedRadialBarSettings = (0, _reselect.createSelector)([_polarSelectors.selectUnfilteredPolarItems, pickRadialBarSettings], (graphicalItems, radialBarSettingsFromProps) => {
  if (graphicalItems.some(pgis => pgis.type === 'radialBar' && radialBarSettingsFromProps.dataKey === pgis.dataKey && radialBarSettingsFromProps.stackId === pgis.stackId)) {
    return radialBarSettingsFromProps;
  }
  return undefined;
});
var selectBandSizeOfPolarAxis = exports.selectBandSizeOfPolarAxis = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectRadiusAxisWithScale, selectRadiusAxisTicks, selectAngleAxisWithScale, selectAngleAxisTicks], (layout, radiusAxis, radiusAxisTicks, angleAxis, angleAxisTicks) => {
  if ((0, _ChartUtils.isCategoricalAxis)(layout, 'radiusAxis')) {
    return (0, _ChartUtils.getBandSizeOfAxis)(radiusAxis, radiusAxisTicks, false);
  }
  return (0, _ChartUtils.getBandSizeOfAxis)(angleAxis, angleAxisTicks, false);
});
var selectBaseValue = exports.selectBaseValue = (0, _reselect.createSelector)([selectAngleAxisWithScale, selectRadiusAxisWithScale, _chartLayoutContext.selectChartLayout], (angleAxis, radiusAxis, layout) => {
  var numericAxis = layout === 'radial' ? angleAxis : radiusAxis;
  if (numericAxis == null || numericAxis.scale == null) {
    return undefined;
  }
  return (0, _ChartUtils.getBaseValueOfBar)({
    numericAxis
  });
});
var pickCells = (_state, _radiusAxisId, _angleAxisId, _radialBarSettings, cells) => cells;
var pickAngleAxisId = (_state, _radiusAxisId, angleAxisId, _radialBarSettings, _cells) => angleAxisId;
var pickRadiusAxisId = (_state, radiusAxisId, _angleAxisId, _radialBarSettings, _cells) => radiusAxisId;
var pickMaxBarSize = (_state, _radiusAxisId, _angleAxisId, radialBarSettings, _cells) => radialBarSettings.maxBarSize;
exports.pickMaxBarSize = pickMaxBarSize;
var isRadialBar = item => item.type === 'radialBar';
var selectAllVisibleRadialBars = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _polarSelectors.selectUnfilteredPolarItems, pickAngleAxisId, pickRadiusAxisId], (layout, allItems, angleAxisId, radiusAxisId) => {
  return allItems.filter(i => {
    if (layout === 'centric') {
      return i.angleAxisId === angleAxisId;
    }
    return i.radiusAxisId === radiusAxisId;
  }).filter(i => i.hide === false).filter(isRadialBar);
});

/**
 * The generator never returned the totalSize which means that barSize in polar chart can not support percent values.
 * We can add that if we want to I suppose.
 * @returns undefined - but it should be a total size of numerical axis in polar chart
 */
var selectPolarBarAxisSize = () => undefined;
var selectPolarBarSizeList = exports.selectPolarBarSizeList = (0, _reselect.createSelector)([selectAllVisibleRadialBars, _rootPropsSelectors.selectRootBarSize, selectPolarBarAxisSize], _combineBarSizeList.combineBarSizeList);
var selectPolarBarBandSize = exports.selectPolarBarBandSize = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _rootPropsSelectors.selectRootMaxBarSize, selectAngleAxisWithScale, selectAngleAxisTicks, selectRadiusAxisWithScale, selectRadiusAxisTicks, pickMaxBarSize], (layout, globalMaxBarSize, angleAxis, angleAxisTicks, radiusAxis, radiusAxisTicks, childMaxBarSize) => {
  var _ref2, _getBandSizeOfAxis2;
  var maxBarSize = (0, _DataUtils.isNullish)(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
  if (layout === 'centric') {
    var _ref, _getBandSizeOfAxis;
    return (_ref = (_getBandSizeOfAxis = (0, _ChartUtils.getBandSizeOfAxis)(angleAxis, angleAxisTicks, true)) !== null && _getBandSizeOfAxis !== void 0 ? _getBandSizeOfAxis : maxBarSize) !== null && _ref !== void 0 ? _ref : 0;
  }
  return (_ref2 = (_getBandSizeOfAxis2 = (0, _ChartUtils.getBandSizeOfAxis)(radiusAxis, radiusAxisTicks, true)) !== null && _getBandSizeOfAxis2 !== void 0 ? _getBandSizeOfAxis2 : maxBarSize) !== null && _ref2 !== void 0 ? _ref2 : 0;
});
var selectAllPolarBarPositions = exports.selectAllPolarBarPositions = (0, _reselect.createSelector)([selectPolarBarSizeList, _rootPropsSelectors.selectRootMaxBarSize, _rootPropsSelectors.selectBarGap, _rootPropsSelectors.selectBarCategoryGap, selectPolarBarBandSize, selectBandSizeOfPolarAxis, pickMaxBarSize], _combineAllBarPositions.combineAllBarPositions);
var selectPolarBarPosition = exports.selectPolarBarPosition = (0, _reselect.createSelector)([selectAllPolarBarPositions, selectSynchronisedRadialBarSettings], _combineBarPosition.combineBarPosition);
var selectStackedRadialBars = (0, _reselect.createSelector)([_polarSelectors.selectPolarItemsSettings], allPolarItems => allPolarItems.filter(isRadialBar).filter(_StackedGraphicalItem.isStacked));
var selectPolarCombinedStackedData = (0, _reselect.createSelector)([selectStackedRadialBars, _dataSelectors.selectChartDataAndAlwaysIgnoreIndexes, _axisSelectors.selectTooltipAxis], _combineDisplayedStackedData.combineDisplayedStackedData);
var selectStackGroups = (0, _reselect.createSelector)([selectPolarCombinedStackedData, selectStackedRadialBars, _rootPropsSelectors.selectStackOffsetType, _rootPropsSelectors.selectReverseStackOrder], _axisSelectors.combineStackGroups);
var selectRadialBarStackGroups = (state, radiusAxisId, angleAxisId) => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  if (layout === 'centric') {
    return selectStackGroups(state, 'radiusAxis', radiusAxisId);
  }
  return selectStackGroups(state, 'angleAxis', angleAxisId);
};
var selectPolarStackedData = (0, _reselect.createSelector)([selectRadialBarStackGroups, selectSynchronisedRadialBarSettings], _combineStackedData.combineStackedData);
var selectRadialBarSectors = exports.selectRadialBarSectors = (0, _reselect.createSelector)([selectAngleAxisWithScale, selectAngleAxisTicks, selectRadiusAxisWithScale, selectRadiusAxisTicks, _dataSelectors.selectChartDataWithIndexes, selectSynchronisedRadialBarSettings, selectBandSizeOfPolarAxis, _chartLayoutContext.selectChartLayout, selectBaseValue, _polarAxisSelectors.selectPolarViewBox, pickCells, selectPolarBarPosition, selectPolarStackedData], (angleAxis, angleAxisTicks, radiusAxis, radiusAxisTicks, _ref3, radialBarSettings, bandSize, layout, baseValue, polarViewBox, cells, pos, stackedData) => {
  var chartData = _ref3.chartData,
    dataStartIndex = _ref3.dataStartIndex,
    dataEndIndex = _ref3.dataEndIndex;
  if (radialBarSettings == null || radiusAxis == null || angleAxis == null || chartData == null || bandSize == null || pos == null || layout !== 'centric' && layout !== 'radial' || radiusAxisTicks == null || polarViewBox == null) {
    return [];
  }
  var dataKey = radialBarSettings.dataKey,
    minPointSize = radialBarSettings.minPointSize;
  var cx = polarViewBox.cx,
    cy = polarViewBox.cy,
    startAngle = polarViewBox.startAngle,
    endAngle = polarViewBox.endAngle;
  var displayedData = chartData.slice(dataStartIndex, dataEndIndex + 1);
  var numericAxis = layout === 'centric' ? radiusAxis : angleAxis;
  var stackedDomain = stackedData ? numericAxis.scale.domain() : null;
  return (0, _RadialBar.computeRadialBarDataItems)({
    angleAxis,
    angleAxisTicks,
    bandSize,
    baseValue,
    cells,
    cx,
    cy,
    dataKey,
    dataStartIndex,
    displayedData,
    endAngle,
    layout,
    minPointSize,
    pos,
    radiusAxis,
    radiusAxisTicks,
    stackedData,
    stackedDomain,
    startAngle
  });
});
var selectRadialBarLegendPayload = exports.selectRadialBarLegendPayload = (0, _reselect.createSelector)([_dataSelectors.selectChartDataAndAlwaysIgnoreIndexes, (_s, l) => l], (_ref4, legendType) => {
  var chartData = _ref4.chartData,
    dataStartIndex = _ref4.dataStartIndex,
    dataEndIndex = _ref4.dataEndIndex;
  if (chartData == null) {
    return [];
  }
  var displayedData = chartData.slice(dataStartIndex, dataEndIndex + 1);
  if (displayedData.length === 0) {
    return [];
  }
  return displayedData.map(entry => {
    return {
      type: legendType,
      // @ts-expect-error we need a better typing for our data inputs
      value: entry.name,
      // @ts-expect-error we need a better typing for our data inputs
      color: entry.fill,
      // @ts-expect-error Legend payload.payload says it wants objects but our data can be unknown
      payload: entry
    };
  });
});