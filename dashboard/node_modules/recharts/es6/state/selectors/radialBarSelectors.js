function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { createSelector } from 'reselect';
import { computeRadialBarDataItems } from '../../polar/RadialBar';
import { selectChartDataAndAlwaysIgnoreIndexes, selectChartDataWithIndexes } from './dataSelectors';
import { selectPolarAxisScale, selectPolarAxisTicks, selectPolarGraphicalItemAxisTicks } from './polarScaleSelectors';
import { combineStackGroups, selectTooltipAxis } from './axisSelectors';
import { selectAngleAxis, selectPolarViewBox, selectRadiusAxis } from './polarAxisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { getBandSizeOfAxis, getBaseValueOfBar, isCategoricalAxis } from '../../util/ChartUtils';
import { selectBarCategoryGap, selectBarGap, selectReverseStackOrder, selectRootBarSize, selectRootMaxBarSize, selectStackOffsetType } from './rootPropsSelectors';
import { selectPolarItemsSettings, selectUnfilteredPolarItems } from './polarSelectors';
import { isNullish } from '../../util/DataUtils';
import { combineDisplayedStackedData } from './combiners/combineDisplayedStackedData';
import { isStacked } from '../types/StackedGraphicalItem';
import { combineBarSizeList } from './combiners/combineBarSizeList';
import { combineAllBarPositions } from './combiners/combineAllBarPositions';
import { combineStackedData } from './combiners/combineStackedData';
import { combineBarPosition } from './combiners/combineBarPosition';
var selectRadiusAxisForRadialBar = (state, radiusAxisId) => selectRadiusAxis(state, radiusAxisId);
var selectRadiusAxisScaleForRadar = (state, radiusAxisId) => selectPolarAxisScale(state, 'radiusAxis', radiusAxisId);
export var selectRadiusAxisWithScale = createSelector([selectRadiusAxisForRadialBar, selectRadiusAxisScaleForRadar], (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});
export var selectRadiusAxisTicks = (state, radiusAxisId) => {
  return selectPolarGraphicalItemAxisTicks(state, 'radiusAxis', radiusAxisId, false);
};
var selectAngleAxisForRadialBar = (state, _radiusAxisId, angleAxisId) => selectAngleAxis(state, angleAxisId);
var selectAngleAxisScaleForRadialBar = (state, _radiusAxisId, angleAxisId) => selectPolarAxisScale(state, 'angleAxis', angleAxisId);
export var selectAngleAxisWithScale = createSelector([selectAngleAxisForRadialBar, selectAngleAxisScaleForRadialBar], (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});
var selectAngleAxisTicks = (state, _radiusAxisId, angleAxisId) => {
  // here we can hardcode isPanorama to false because radialBar does not support panorama mode
  return selectPolarAxisTicks(state, 'angleAxis', angleAxisId, false);
};
var pickRadialBarSettings = (_state, _radiusAxisId, _angleAxisId, radialBarSettings) => radialBarSettings;
var selectSynchronisedRadialBarSettings = createSelector([selectUnfilteredPolarItems, pickRadialBarSettings], (graphicalItems, radialBarSettingsFromProps) => {
  if (graphicalItems.some(pgis => pgis.type === 'radialBar' && radialBarSettingsFromProps.dataKey === pgis.dataKey && radialBarSettingsFromProps.stackId === pgis.stackId)) {
    return radialBarSettingsFromProps;
  }
  return undefined;
});
export var selectBandSizeOfPolarAxis = createSelector([selectChartLayout, selectRadiusAxisWithScale, selectRadiusAxisTicks, selectAngleAxisWithScale, selectAngleAxisTicks], (layout, radiusAxis, radiusAxisTicks, angleAxis, angleAxisTicks) => {
  if (isCategoricalAxis(layout, 'radiusAxis')) {
    return getBandSizeOfAxis(radiusAxis, radiusAxisTicks, false);
  }
  return getBandSizeOfAxis(angleAxis, angleAxisTicks, false);
});
export var selectBaseValue = createSelector([selectAngleAxisWithScale, selectRadiusAxisWithScale, selectChartLayout], (angleAxis, radiusAxis, layout) => {
  var numericAxis = layout === 'radial' ? angleAxis : radiusAxis;
  if (numericAxis == null || numericAxis.scale == null) {
    return undefined;
  }
  return getBaseValueOfBar({
    numericAxis
  });
});
var pickCells = (_state, _radiusAxisId, _angleAxisId, _radialBarSettings, cells) => cells;
var pickAngleAxisId = (_state, _radiusAxisId, angleAxisId, _radialBarSettings, _cells) => angleAxisId;
var pickRadiusAxisId = (_state, radiusAxisId, _angleAxisId, _radialBarSettings, _cells) => radiusAxisId;
export var pickMaxBarSize = (_state, _radiusAxisId, _angleAxisId, radialBarSettings, _cells) => radialBarSettings.maxBarSize;
var isRadialBar = item => item.type === 'radialBar';
var selectAllVisibleRadialBars = createSelector([selectChartLayout, selectUnfilteredPolarItems, pickAngleAxisId, pickRadiusAxisId], (layout, allItems, angleAxisId, radiusAxisId) => {
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
export var selectPolarBarSizeList = createSelector([selectAllVisibleRadialBars, selectRootBarSize, selectPolarBarAxisSize], combineBarSizeList);
export var selectPolarBarBandSize = createSelector([selectChartLayout, selectRootMaxBarSize, selectAngleAxisWithScale, selectAngleAxisTicks, selectRadiusAxisWithScale, selectRadiusAxisTicks, pickMaxBarSize], (layout, globalMaxBarSize, angleAxis, angleAxisTicks, radiusAxis, radiusAxisTicks, childMaxBarSize) => {
  var _ref2, _getBandSizeOfAxis2;
  var maxBarSize = isNullish(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
  if (layout === 'centric') {
    var _ref, _getBandSizeOfAxis;
    return (_ref = (_getBandSizeOfAxis = getBandSizeOfAxis(angleAxis, angleAxisTicks, true)) !== null && _getBandSizeOfAxis !== void 0 ? _getBandSizeOfAxis : maxBarSize) !== null && _ref !== void 0 ? _ref : 0;
  }
  return (_ref2 = (_getBandSizeOfAxis2 = getBandSizeOfAxis(radiusAxis, radiusAxisTicks, true)) !== null && _getBandSizeOfAxis2 !== void 0 ? _getBandSizeOfAxis2 : maxBarSize) !== null && _ref2 !== void 0 ? _ref2 : 0;
});
export var selectAllPolarBarPositions = createSelector([selectPolarBarSizeList, selectRootMaxBarSize, selectBarGap, selectBarCategoryGap, selectPolarBarBandSize, selectBandSizeOfPolarAxis, pickMaxBarSize], combineAllBarPositions);
export var selectPolarBarPosition = createSelector([selectAllPolarBarPositions, selectSynchronisedRadialBarSettings], combineBarPosition);
var selectStackedRadialBars = createSelector([selectPolarItemsSettings], allPolarItems => allPolarItems.filter(isRadialBar).filter(isStacked));
var selectPolarCombinedStackedData = createSelector([selectStackedRadialBars, selectChartDataAndAlwaysIgnoreIndexes, selectTooltipAxis], combineDisplayedStackedData);
var selectStackGroups = createSelector([selectPolarCombinedStackedData, selectStackedRadialBars, selectStackOffsetType, selectReverseStackOrder], combineStackGroups);
var selectRadialBarStackGroups = (state, radiusAxisId, angleAxisId) => {
  var layout = selectChartLayout(state);
  if (layout === 'centric') {
    return selectStackGroups(state, 'radiusAxis', radiusAxisId);
  }
  return selectStackGroups(state, 'angleAxis', angleAxisId);
};
var selectPolarStackedData = createSelector([selectRadialBarStackGroups, selectSynchronisedRadialBarSettings], combineStackedData);
export var selectRadialBarSectors = createSelector([selectAngleAxisWithScale, selectAngleAxisTicks, selectRadiusAxisWithScale, selectRadiusAxisTicks, selectChartDataWithIndexes, selectSynchronisedRadialBarSettings, selectBandSizeOfPolarAxis, selectChartLayout, selectBaseValue, selectPolarViewBox, pickCells, selectPolarBarPosition, selectPolarStackedData], (angleAxis, angleAxisTicks, radiusAxis, radiusAxisTicks, _ref3, radialBarSettings, bandSize, layout, baseValue, polarViewBox, cells, pos, stackedData) => {
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
  return computeRadialBarDataItems({
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
export var selectRadialBarLegendPayload = createSelector([selectChartDataAndAlwaysIgnoreIndexes, (_s, l) => l], (_ref4, legendType) => {
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