"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDomainDefinition = exports.filterReferenceElements = exports.filterGraphicalNotStackedItems = exports.defaultNumericDomain = exports.combineStackGroups = exports.combineNumericalDomain = exports.combineNumericTicksDomain = exports.combineNiceTicks = exports.combineLinesDomain = exports.combineGraphicalItemsSettings = exports.combineGraphicalItemsData = exports.combineGraphicalItemTicks = exports.combineDuplicateDomain = exports.combineDotsDomain = exports.combineDomainOfStackGroups = exports.combineDomainOfAllAppliedNumericalValuesIncludingErrorValues = exports.combineDisplayedData = exports.combineCategoricalDomain = exports.combineAxisTicks = exports.combineAxisDomainWithNiceTicks = exports.combineAxisDomain = exports.combineAreasDomain = exports.combineAppliedValues = exports.combineAllAppliedValues = void 0;
exports.getErrorDomainByDataKey = getErrorDomainByDataKey;
exports.implicitZAxis = exports.implicitYAxis = exports.implicitXAxis = void 0;
exports.isErrorBarRelevantForAxisType = isErrorBarRelevantForAxisType;
exports.itemAxisPredicate = itemAxisPredicate;
exports.selectZAxisWithScale = exports.selectZAxisSettings = exports.selectYAxisSize = exports.selectYAxisSettingsNoDefaults = exports.selectYAxisSettings = exports.selectYAxisRange = exports.selectYAxisPosition = exports.selectXAxisSize = exports.selectXAxisSettingsNoDefaults = exports.selectXAxisSettings = exports.selectXAxisRange = exports.selectXAxisPosition = exports.selectUnfilteredCartesianItems = exports.selectTooltipAxisDataKey = exports.selectTooltipAxis = exports.selectTicksOfGraphicalItem = exports.selectTicksOfAxis = exports.selectStackedCartesianItemsSettings = exports.selectStackGroups = exports.selectSortedDataPoints = exports.selectSmallestDistanceBetweenValues = exports.selectRenderedTicksOfAxis = exports.selectRenderableAxisSettings = exports.selectReferenceLinesByAxis = exports.selectReferenceLines = exports.selectReferenceDotsByAxis = exports.selectReferenceDots = exports.selectReferenceAreasByAxis = exports.selectReferenceAreas = exports.selectRealScaleType = exports.selectNumericalDomain = exports.selectNumericTicksDomain = exports.selectNiceTicks = exports.selectHasBar = exports.selectErrorBarsSettings = exports.selectDuplicateDomain = exports.selectDomainOfStackGroups = exports.selectDomainFromUserPreference = exports.selectDomainDefinition = exports.selectDisplayedStackedData = exports.selectDisplayedData = exports.selectCheckedAxisDomain = exports.selectChartDirection = exports.selectCategoricalDomain = exports.selectCartesianItemsSettings = exports.selectCartesianGraphicalItemsData = exports.selectCartesianAxisSize = exports.selectCalculatedYAxisPadding = exports.selectCalculatedXAxisPadding = exports.selectBaseAxis = exports.selectAxisWithScale = exports.selectAxisScale = exports.selectAxisRangeWithReverse = exports.selectAxisRange = exports.selectAxisPropsNeededForCartesianGridTicksGenerator = exports.selectAxisInverseTickSnapScale = exports.selectAxisInverseScale = exports.selectAxisInverseDataSnapScale = exports.selectAxisDomainIncludingNiceTicks = exports.selectAxisDomain = exports.selectAnyCartesianItemsUsesChartData = exports.selectAllYAxesOffsetSteps = exports.selectAllXAxesOffsetSteps = exports.selectAllErrorBarSettings = exports.selectAllAppliedValues = exports.mergeDomains = void 0;
var _reselect = require("reselect");
var _range = _interopRequireDefault(require("es-toolkit/compat/range"));
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _ChartUtils = require("../../util/ChartUtils");
var _dataSelectors = require("./dataSelectors");
var _isDomainSpecifiedByUser = require("../../util/isDomainSpecifiedByUser");
var _DataUtils = require("../../util/DataUtils");
var _isWellBehavedNumber = require("../../util/isWellBehavedNumber");
var _scale = require("../../util/scale");
var _containerSelectors = require("./containerSelectors");
var _selectAllAxes = require("./selectAllAxes");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _brushSelectors = require("./brushSelectors");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _polarAxisSelectors = require("./polarAxisSelectors");
var _pickAxisType = require("./pickAxisType");
var _pickAxisId = require("./pickAxisId");
var _combineAxisRangeWithReverse = require("./combiners/combineAxisRangeWithReverse");
var _Constants = require("../../util/Constants");
var _getStackSeriesIdentifier = require("../../util/stacks/getStackSeriesIdentifier");
var _combineDisplayedStackedData = require("./combiners/combineDisplayedStackedData");
var _StackedGraphicalItem = require("../types/StackedGraphicalItem");
var _numberDomainEqualityCheck = require("./numberDomainEqualityCheck");
var _arrayEqualityCheck = require("./arrayEqualityCheck");
var _selectTooltipAxisType = require("./selectTooltipAxisType");
var _selectTooltipAxisId = require("./selectTooltipAxisId");
var _RechartsScale = require("../../util/scale/RechartsScale");
var _combineCheckedDomain = require("./combiners/combineCheckedDomain");
var _combineConfiguredScale = require("./combiners/combineConfiguredScale");
var _combineRealScaleType = require("./combiners/combineRealScaleType");
var _createCategoricalInverse = require("../../util/scale/createCategoricalInverse");
var _combineInverseScaleFunction = require("./combiners/combineInverseScaleFunction");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var defaultNumericDomain = exports.defaultNumericDomain = [0, 'auto'];
/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
var implicitXAxis = exports.implicitXAxis = {
  allowDataOverflow: false,
  allowDecimals: true,
  allowDuplicatedCategory: true,
  angle: 0,
  dataKey: undefined,
  domain: undefined,
  height: 30,
  hide: true,
  id: 0,
  includeHidden: false,
  interval: 'preserveEnd',
  minTickGap: 5,
  mirror: false,
  name: undefined,
  orientation: 'bottom',
  padding: {
    left: 0,
    right: 0
  },
  reversed: false,
  scale: 'auto',
  tick: true,
  tickCount: 5,
  tickFormatter: undefined,
  ticks: undefined,
  type: 'category',
  unit: undefined,
  niceTicks: 'auto'
};
var selectXAxisSettingsNoDefaults = (state, axisId) => {
  return state.cartesianAxis.xAxis[axisId];
};
exports.selectXAxisSettingsNoDefaults = selectXAxisSettingsNoDefaults;
var selectXAxisSettings = (state, axisId) => {
  var axis = selectXAxisSettingsNoDefaults(state, axisId);
  if (axis == null) {
    return implicitXAxis;
  }
  return axis;
};

/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
exports.selectXAxisSettings = selectXAxisSettings;
var implicitYAxis = exports.implicitYAxis = {
  allowDataOverflow: false,
  allowDecimals: true,
  allowDuplicatedCategory: true,
  angle: 0,
  dataKey: undefined,
  domain: defaultNumericDomain,
  hide: true,
  id: 0,
  includeHidden: false,
  interval: 'preserveEnd',
  minTickGap: 5,
  mirror: false,
  name: undefined,
  orientation: 'left',
  padding: {
    top: 0,
    bottom: 0
  },
  reversed: false,
  scale: 'auto',
  tick: true,
  tickCount: 5,
  tickFormatter: undefined,
  ticks: undefined,
  type: 'number',
  unit: undefined,
  niceTicks: 'auto',
  width: _Constants.DEFAULT_Y_AXIS_WIDTH
};
var selectYAxisSettingsNoDefaults = (state, axisId) => {
  return state.cartesianAxis.yAxis[axisId];
};
exports.selectYAxisSettingsNoDefaults = selectYAxisSettingsNoDefaults;
var selectYAxisSettings = (state, axisId) => {
  var axis = selectYAxisSettingsNoDefaults(state, axisId);
  if (axis == null) {
    return implicitYAxis;
  }
  return axis;
};
exports.selectYAxisSettings = selectYAxisSettings;
var implicitZAxis = exports.implicitZAxis = {
  domain: [0, 'auto'],
  includeHidden: false,
  reversed: false,
  allowDataOverflow: false,
  allowDuplicatedCategory: false,
  dataKey: undefined,
  id: 0,
  name: '',
  range: [64, 64],
  scale: 'auto',
  type: 'number',
  unit: ''
};
var selectZAxisSettings = (state, axisId) => {
  var axis = state.cartesianAxis.zAxis[axisId];
  if (axis == null) {
    return implicitZAxis;
  }
  return axis;
};
exports.selectZAxisSettings = selectZAxisSettings;
var selectBaseAxis = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    case 'zAxis':
      {
        return selectZAxisSettings(state, axisId);
      }
    case 'angleAxis':
      {
        return (0, _polarAxisSelectors.selectAngleAxis)(state, axisId);
      }
    case 'radiusAxis':
      {
        return (0, _polarAxisSelectors.selectRadiusAxis)(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};
exports.selectBaseAxis = selectBaseAxis;
var selectCartesianAxisSettings = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};

/**
 * Selects either an X or Y axis. Doesn't work with Z axis - for that, instead use selectBaseAxis.
 * @param state Root state
 * @param axisType xAxis | yAxis
 * @param axisId xAxisId | yAxisId
 * @returns axis settings object
 */
var selectRenderableAxisSettings = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    case 'angleAxis':
      {
        return (0, _polarAxisSelectors.selectAngleAxis)(state, axisId);
      }
    case 'radiusAxis':
      {
        return (0, _polarAxisSelectors.selectRadiusAxis)(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};

/**
 * @param state RechartsRootState
 * @return boolean true if there is at least one Bar or RadialBar
 */
exports.selectRenderableAxisSettings = selectRenderableAxisSettings;
var selectHasBar = state => state.graphicalItems.cartesianItems.some(item => item.type === 'bar') || state.graphicalItems.polarItems.some(item => item.type === 'radialBar');

/**
 * Filters CartesianGraphicalItemSettings by the relevant axis ID
 * @param axisType 'xAxis' | 'yAxis' | 'zAxis' | 'radiusAxis' | 'angleAxis'
 * @param axisId from props, defaults to 0
 *
 * @returns Predicate function that return true for CartesianGraphicalItemSettings that are relevant to the specified axis
 */
exports.selectHasBar = selectHasBar;
function itemAxisPredicate(axisType, axisId) {
  return item => {
    switch (axisType) {
      case 'xAxis':
        // This is sensitive to the data type, as 0 !== '0'. I wonder if we should be more flexible. How does 2.x branch behave? TODO write test for that
        return 'xAxisId' in item && item.xAxisId === axisId;
      case 'yAxis':
        return 'yAxisId' in item && item.yAxisId === axisId;
      case 'zAxis':
        return 'zAxisId' in item && item.zAxisId === axisId;
      case 'angleAxis':
        return 'angleAxisId' in item && item.angleAxisId === axisId;
      case 'radiusAxis':
        return 'radiusAxisId' in item && item.radiusAxisId === axisId;
      default:
        return false;
    }
  };
}

// TODO appears there is a bug where this selector is called from polar context, find and fix it.
var selectUnfilteredCartesianItems = state => state.graphicalItems.cartesianItems;
exports.selectUnfilteredCartesianItems = selectUnfilteredCartesianItems;
var selectAxisPredicate = (0, _reselect.createSelector)([_pickAxisType.pickAxisType, _pickAxisId.pickAxisId], itemAxisPredicate);
var combineGraphicalItemsSettings = (graphicalItems, axisSettings, axisPredicate) => graphicalItems.filter(axisPredicate).filter(item => {
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.includeHidden) === true) {
    return true;
  }
  return !item.hide;
});
exports.combineGraphicalItemsSettings = combineGraphicalItemsSettings;
var selectCartesianItemsSettings = exports.selectCartesianItemsSettings = (0, _reselect.createSelector)([selectUnfilteredCartesianItems, selectBaseAxis, selectAxisPredicate], combineGraphicalItemsSettings, {
  memoizeOptions: {
    resultEqualityCheck: _arrayEqualityCheck.emptyArraysAreEqualCheck
  }
});
var selectStackedCartesianItemsSettings = exports.selectStackedCartesianItemsSettings = (0, _reselect.createSelector)([selectCartesianItemsSettings], cartesianItems => {
  return cartesianItems.filter(item => item.type === 'area' || item.type === 'bar').filter(_StackedGraphicalItem.isStacked);
});
var filterGraphicalNotStackedItems = cartesianItems => cartesianItems.filter(item => !('stackId' in item) || item.stackId === undefined);
exports.filterGraphicalNotStackedItems = filterGraphicalNotStackedItems;
var selectCartesianItemsSettingsExceptStacked = (0, _reselect.createSelector)([selectCartesianItemsSettings], filterGraphicalNotStackedItems);
var combineGraphicalItemsData = cartesianItems => cartesianItems.map(item => item.data).filter(Boolean).flat(1);

/**
 * Returns true if at least one graphical item does not define its own `data` prop
 * and therefore relies on the chart-level data.
 * This is used to decide whether to merge chart-level data into the axis domain calculation.
 */
exports.combineGraphicalItemsData = combineGraphicalItemsData;
var selectAnyCartesianItemsUsesChartData = exports.selectAnyCartesianItemsUsesChartData = (0, _reselect.createSelector)([selectCartesianItemsSettings], items => items.some(item => !item.data));

/**
 * This is a "cheap" selector - it returns the data but doesn't iterate them, so it is not sensitive on the array length.
 * Also does not apply dataKey yet.
 * @param state RechartsRootState
 * @returns data defined on the chart graphical items, such as Line or Scatter or Pie, and filtered with appropriate dataKey
 */
var selectCartesianGraphicalItemsData = exports.selectCartesianGraphicalItemsData = (0, _reselect.createSelector)([selectCartesianItemsSettings], combineGraphicalItemsData, {
  memoizeOptions: {
    resultEqualityCheck: _arrayEqualityCheck.emptyArraysAreEqualCheck
  }
});
var combineDisplayedData = (graphicalItemsData, _ref) => {
  var _ref$chartData = _ref.chartData,
    chartData = _ref$chartData === void 0 ? [] : _ref$chartData,
    dataStartIndex = _ref.dataStartIndex,
    dataEndIndex = _ref.dataEndIndex;
  if (graphicalItemsData.length > 0) {
    /*
     * There is no slicing when data is defined on graphical items. Why?
     * Because Brush ignores data defined on graphical items,
     * and does not render.
     * So Brush will never show up in a Scatter chart for example.
     * This is something we will need to fix.
     *
     * Now, when the root chart data is not defined, the dataEndIndex is 0,
     * which means the itemsData will be sliced to an empty array anyway.
     * But that's an implementation detail, and we can fix that too.
     *
     * Also, in absence of Axis dataKey, we use the dataKey from each item, respectively.
     * This is the usual pattern for numerical axis, that is the one where bars go up:
     * users don't specify any dataKey by default and expect the axis to "just match the data".
     */
    return graphicalItemsData;
  }
  return chartData.slice(dataStartIndex, dataEndIndex + 1);
};

/**
 * This selector will return all data there is in the chart: graphical items, chart root, all together.
 * Useful for figuring out an axis domain (because that needs to know of everything),
 * not useful for rendering individual graphical elements (because they need to know which data is theirs and which is not).
 *
 * This function will discard the original indexes, so it is also not useful for anything that depends on ordering.
 */
exports.combineDisplayedData = combineDisplayedData;
var selectDisplayedData = exports.selectDisplayedData = (0, _reselect.createSelector)([selectCartesianGraphicalItemsData, _dataSelectors.selectChartDataWithIndexesIfNotInPanoramaPosition4], combineDisplayedData);
var combineAppliedValues = (data, axisSettings, items) => {
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: (0, _ChartUtils.getValueByDataKey)(item, axisSettings.dataKey)
    }));
  }
  if (items.length > 0) {
    return items.map(item => item.dataKey).flatMap(dataKey => data.map(entry => ({
      value: (0, _ChartUtils.getValueByDataKey)(entry, dataKey)
    })));
  }
  return data.map(entry => ({
    value: entry
  }));
};

/**
 * Computes applied values from graphical items data plus, when needed, chart-level data.
 *
 * When at least one graphical item has no own `data` (it relies on chart root data) AND the axis has a `dataKey`,
 * AND there are other items that do have their own data (meaning `displayedData` only contains graphical items data,
 * not chart root data), we also include chart root data values so the axis domain covers all categories,
 * including those only present in the chart root data but not in any graphical item's own data.
 *
 * Values from chart root data that don't match the axis dataKey (undefined) are excluded.
 */
exports.combineAppliedValues = combineAppliedValues;
var combineAllAppliedValues = (displayedData, axisSettings, items, _ref2, anyItemUsesChartData, graphicalItemsData) => {
  var _ref2$chartData = _ref2.chartData,
    chartData = _ref2$chartData === void 0 ? [] : _ref2$chartData,
    dataStartIndex = _ref2.dataStartIndex,
    dataEndIndex = _ref2.dataEndIndex;
  var appliedValues = combineAppliedValues(displayedData, axisSettings, items);
  if (anyItemUsesChartData && (axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null && graphicalItemsData.length > 0) {
    var chartDataSlice = chartData.slice(dataStartIndex, dataEndIndex + 1);
    var chartAppliedValues = chartDataSlice.map(item => ({
      value: (0, _ChartUtils.getValueByDataKey)(item, axisSettings.dataKey)
    })).filter(av => av.value != null);
    return [...chartAppliedValues, ...appliedValues];
  }
  return appliedValues;
};

/**
 * This selector will return all values with the appropriate dataKey applied on them.
 * Which dataKey is appropriate depends on where it is defined.
 *
 * This is an expensive selector - it will iterate all data and compute their value using the provided dataKey.
 */
exports.combineAllAppliedValues = combineAllAppliedValues;
var selectAllAppliedValues = exports.selectAllAppliedValues = (0, _reselect.createSelector)([selectDisplayedData, selectBaseAxis, selectCartesianItemsSettings, _dataSelectors.selectChartDataWithIndexesIfNotInPanoramaPosition4, selectAnyCartesianItemsUsesChartData, selectCartesianGraphicalItemsData], combineAllAppliedValues);
function makeNumber(val) {
  if ((0, _DataUtils.isNumOrStr)(val) || val instanceof Date) {
    var n = Number(val);
    if ((0, _isWellBehavedNumber.isWellBehavedNumber)(n)) {
      return n;
    }
  }
  return undefined;
}
function makeDomain(val) {
  if (Array.isArray(val)) {
    var attempt = [makeNumber(val[0]), makeNumber(val[1])];
    if ((0, _isDomainSpecifiedByUser.isWellFormedNumberDomain)(attempt)) {
      return attempt;
    }
    return undefined;
  }
  var n = makeNumber(val);
  if (n == null) {
    return undefined;
  }
  return [n, n];
}
function onlyAllowNumbers(data) {
  return data.map(makeNumber).filter(_DataUtils.isNotNil);
}
function sortBy(a, b) {
  var aNum = makeNumber(a);
  var bNum = makeNumber(b);
  if (aNum == null && bNum == null) {
    return 0;
  }
  if (aNum == null) {
    return -1;
  }
  if (bNum == null) {
    return 1;
  }
  return aNum - bNum;
}
var selectSortedDataPoints = exports.selectSortedDataPoints = (0, _reselect.createSelector)([selectAllAppliedValues], appliedData => {
  return appliedData === null || appliedData === void 0 ? void 0 : appliedData.map(item => item.value).sort(sortBy);
});
function isErrorBarRelevantForAxisType(axisType, errorBar) {
  switch (axisType) {
    case 'xAxis':
      return errorBar.direction === 'x';
    case 'yAxis':
      return errorBar.direction === 'y';
    default:
      return false;
  }
}
/**
 * @param entry One item in the 'data' array. Could be anything really - this is defined externally. This is the raw, before dataKey application
 * @param appliedValue This is the result of applying the 'main' dataKey on the `entry`.
 * @param relevantErrorBars Error bars that are relevant for the current axis and layout and all that.
 * @return either undefined or an array of ErrorValue
 */
function getErrorDomainByDataKey(entry, appliedValue, relevantErrorBars) {
  if (!relevantErrorBars) {
    return [];
  }
  if (!relevantErrorBars.length) {
    return [];
  }
  var appliedNumericValue;
  if (typeof appliedValue === 'number' && !(0, _DataUtils.isNan)(appliedValue)) {
    appliedNumericValue = appliedValue;
  } else if (Array.isArray(appliedValue)) {
    var numericRangeValues = onlyAllowNumbers(appliedValue);
    if (numericRangeValues.length > 0) {
      appliedNumericValue = Math.max(...numericRangeValues);
    }
  }
  if (appliedNumericValue == null) {
    return [];
  }
  return onlyAllowNumbers(relevantErrorBars.flatMap(eb => {
    var errorValue = (0, _ChartUtils.getValueByDataKey)(entry, eb.dataKey);
    var lowBound, highBound;
    if (Array.isArray(errorValue)) {
      var _errorValue = _slicedToArray(errorValue, 2);
      lowBound = _errorValue[0];
      highBound = _errorValue[1];
    } else {
      lowBound = highBound = errorValue;
    }
    if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(lowBound) || !(0, _isWellBehavedNumber.isWellBehavedNumber)(highBound)) {
      return undefined;
    }
    return [appliedNumericValue - lowBound, appliedNumericValue + highBound];
  }));
}
var selectTooltipAxis = state => {
  var axisType = (0, _selectTooltipAxisType.selectTooltipAxisType)(state);
  var axisId = (0, _selectTooltipAxisId.selectTooltipAxisId)(state);
  return selectRenderableAxisSettings(state, axisType, axisId);
};
exports.selectTooltipAxis = selectTooltipAxis;
var selectTooltipAxisDataKey = exports.selectTooltipAxisDataKey = (0, _reselect.createSelector)([selectTooltipAxis], axis => axis === null || axis === void 0 ? void 0 : axis.dataKey);
var selectDisplayedStackedData = exports.selectDisplayedStackedData = (0, _reselect.createSelector)([selectStackedCartesianItemsSettings, _dataSelectors.selectChartDataWithIndexesIfNotInPanoramaPosition4, selectTooltipAxis], _combineDisplayedStackedData.combineDisplayedStackedData);
var combineStackGroups = (displayedData, items, stackOffsetType, reverseStackOrder) => {
  var initialItemsGroups = {};
  var itemsGroup = items.reduce((acc, item) => {
    if (item.stackId == null) {
      return acc;
    }
    var stack = acc[item.stackId];
    if (stack == null) {
      stack = [];
    }
    stack.push(item);
    acc[item.stackId] = stack;
    return acc;
  }, initialItemsGroups);
  return Object.fromEntries(Object.entries(itemsGroup).map(_ref3 => {
    var _ref4 = _slicedToArray(_ref3, 2),
      stackId = _ref4[0],
      graphicalItems = _ref4[1];
    var orderedGraphicalItems = reverseStackOrder ? [...graphicalItems].reverse() : graphicalItems;
    var dataKeys = orderedGraphicalItems.map(_getStackSeriesIdentifier.getStackSeriesIdentifier);
    return [stackId, {
      // @ts-expect-error getStackedData requires that the input is array of objects, Recharts does not test for that
      stackedData: (0, _ChartUtils.getStackedData)(displayedData, dataKeys, stackOffsetType),
      graphicalItems: orderedGraphicalItems
    }];
  }));
};

/**
 * Stack groups are groups of graphical items that stack on each other.
 * Stack is a function of axis type (X, Y), axis ID, and stack ID.
 * Graphical items that do not have a stack ID are not going to be present in stack groups.
 */
exports.combineStackGroups = combineStackGroups;
var selectStackGroups = exports.selectStackGroups = (0, _reselect.createSelector)([selectDisplayedStackedData, selectStackedCartesianItemsSettings, _rootPropsSelectors.selectStackOffsetType, _rootPropsSelectors.selectReverseStackOrder], combineStackGroups);
var combineDomainOfStackGroups = (stackGroups, _ref5, axisType, domainFromUserPreference) => {
  var dataStartIndex = _ref5.dataStartIndex,
    dataEndIndex = _ref5.dataEndIndex;
  if (domainFromUserPreference != null) {
    // User has specified a domain, so we respect that and we can skip computing anything else
    return undefined;
  }
  if (axisType === 'zAxis') {
    // ZAxis ignores stacks
    return undefined;
  }
  return (0, _ChartUtils.getDomainOfStackGroups)(stackGroups, dataStartIndex, dataEndIndex);
};
exports.combineDomainOfStackGroups = combineDomainOfStackGroups;
var selectAllowsDataOverflow = (0, _reselect.createSelector)([selectBaseAxis], axisSettings => axisSettings.allowDataOverflow);
var getDomainDefinition = axisSettings => {
  var _axisSettings$domain;
  if (axisSettings == null || !('domain' in axisSettings)) {
    return defaultNumericDomain;
  }
  if (axisSettings.domain != null) {
    return axisSettings.domain;
  }
  if ('ticks' in axisSettings && axisSettings.ticks != null) {
    if (axisSettings.type === 'number') {
      var allValues = onlyAllowNumbers(axisSettings.ticks);
      return [Math.min(...allValues), Math.max(...allValues)];
    }
    if (axisSettings.type === 'category') {
      return axisSettings.ticks.map(String);
    }
  }
  return (_axisSettings$domain = axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.domain) !== null && _axisSettings$domain !== void 0 ? _axisSettings$domain : defaultNumericDomain;
};
exports.getDomainDefinition = getDomainDefinition;
var selectDomainDefinition = exports.selectDomainDefinition = (0, _reselect.createSelector)([selectBaseAxis], getDomainDefinition);

/**
 * Under certain circumstances, we can determine the domain without looking at the data at all.
 * This is the case when the domain is explicitly specified as numbers, or when it is specified
 * as 'auto' or 'dataMin'/'dataMax' and data overflow is not allowed.
 *
 * In that case, this function will return the domain, otherwise it returns undefined.
 *
 * This is an optimization to avoid unnecessary data processing.
 * @param state
 * @param axisType
 * @param axisId
 * @param isPanorama
 */
var selectDomainFromUserPreference = exports.selectDomainFromUserPreference = (0, _reselect.createSelector)([selectDomainDefinition, selectAllowsDataOverflow], _isDomainSpecifiedByUser.numericalDomainSpecifiedWithoutRequiringData);
var selectDomainOfStackGroups = exports.selectDomainOfStackGroups = (0, _reselect.createSelector)([selectStackGroups, _dataSelectors.selectChartDataWithIndexes, _pickAxisType.pickAxisType, selectDomainFromUserPreference], combineDomainOfStackGroups, {
  memoizeOptions: {
    resultEqualityCheck: _numberDomainEqualityCheck.numberDomainEqualityCheck
  }
});
var selectAllErrorBarSettings = state => state.errorBars;
exports.selectAllErrorBarSettings = selectAllErrorBarSettings;
var combineRelevantErrorBarSettings = (cartesianItemsSettings, allErrorBarSettings, axisType) => {
  return cartesianItemsSettings.flatMap(item => {
    return allErrorBarSettings[item.id];
  }).filter(Boolean).filter(e => {
    return isErrorBarRelevantForAxisType(axisType, e);
  });
};
var mergeDomains = exports.mergeDomains = function mergeDomains() {
  for (var _len = arguments.length, domains = new Array(_len), _key = 0; _key < _len; _key++) {
    domains[_key] = arguments[_key];
  }
  var allDomains = domains.filter(Boolean);
  if (allDomains.length === 0) {
    return undefined;
  }
  var allValues = allDomains.flat();
  var min = Math.min(...allValues);
  var max = Math.max(...allValues);
  return [min, max];
};
var combineDomainOfAllAppliedNumericalValuesIncludingErrorValues = exports.combineDomainOfAllAppliedNumericalValuesIncludingErrorValues = function combineDomainOfAllAppliedNumericalValuesIncludingErrorValues(displayedData, axisSettings, items, errorBars, axisType) {
  var chartDataSlice = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var lowerEnd, upperEnd;
  if (items.length > 0) {
    /*
     * Iterate item-first so each item can use its own `data` prop when present,
     * falling back to the chart-level data slice for items that rely on it.
     * This ensures that mixing items with and without own data (e.g. Bar reading
     * chart-level data alongside a Scatter with its own outlier data) produces a
     * domain that covers all values from all sources.
     */
    items.forEach(item => {
      var _errorBars$item$id;
      var itemData = item.data != null ? [...item.data] : chartDataSlice;
      var relevantErrorBars = (_errorBars$item$id = errorBars[item.id]) === null || _errorBars$item$id === void 0 ? void 0 : _errorBars$item$id.filter(errorBar => isErrorBarRelevantForAxisType(axisType, errorBar));
      itemData.forEach(entry => {
        var _axisSettings$dataKey;
        var valueByDataKey = (0, _ChartUtils.getValueByDataKey)(entry, (_axisSettings$dataKey = axisSettings.dataKey) !== null && _axisSettings$dataKey !== void 0 ? _axisSettings$dataKey : item.dataKey);
        var errorDomain = getErrorDomainByDataKey(entry, valueByDataKey, relevantErrorBars);
        if (errorDomain.length >= 2) {
          var localLower = Math.min(...errorDomain);
          var localUpper = Math.max(...errorDomain);
          if (lowerEnd == null || localLower < lowerEnd) {
            lowerEnd = localLower;
          }
          if (upperEnd == null || localUpper > upperEnd) {
            upperEnd = localUpper;
          }
        }
        var dataValueDomain = makeDomain(valueByDataKey);
        if (dataValueDomain != null) {
          lowerEnd = lowerEnd == null ? dataValueDomain[0] : Math.min(lowerEnd, dataValueDomain[0]);
          upperEnd = upperEnd == null ? dataValueDomain[1] : Math.max(upperEnd, dataValueDomain[1]);
        }
      });
    });
  }
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null && items.length === 0) {
    // When there are no items, fall back to the displayed data (chart-level or graphical item data).
    displayedData.forEach(item => {
      var dataValueDomain = makeDomain((0, _ChartUtils.getValueByDataKey)(item, axisSettings.dataKey));
      if (dataValueDomain != null) {
        lowerEnd = lowerEnd == null ? dataValueDomain[0] : Math.min(lowerEnd, dataValueDomain[0]);
        upperEnd = upperEnd == null ? dataValueDomain[1] : Math.max(upperEnd, dataValueDomain[1]);
      }
    });
  }
  if ((0, _isWellBehavedNumber.isWellBehavedNumber)(lowerEnd) && (0, _isWellBehavedNumber.isWellBehavedNumber)(upperEnd)) {
    return [lowerEnd, upperEnd];
  }
  return undefined;
};
var selectDomainOfAllAppliedNumericalValuesIncludingErrorValues = (0, _reselect.createSelector)([selectDisplayedData, selectBaseAxis, selectCartesianItemsSettingsExceptStacked, selectAllErrorBarSettings, _pickAxisType.pickAxisType, _dataSelectors.selectChartDataSliceIfNotInPanorama], combineDomainOfAllAppliedNumericalValuesIncludingErrorValues, {
  memoizeOptions: {
    resultEqualityCheck: _numberDomainEqualityCheck.numberDomainEqualityCheck
  }
});
function onlyAllowNumbersAndStringsAndDates(item) {
  var value = item.value;
  if ((0, _DataUtils.isNumOrStr)(value) || value instanceof Date) {
    return value;
  }
  return undefined;
}
var computeDomainOfTypeCategory = (allDataSquished, axisSettings, isCategorical) => {
  var categoricalDomain = allDataSquished.map(onlyAllowNumbersAndStringsAndDates).filter(v => v != null);
  if (isCategorical && (axisSettings.dataKey == null || axisSettings.allowDuplicatedCategory && (0, _DataUtils.hasDuplicate)(categoricalDomain))) {
    /*
     * 1. In an absence of dataKey, Recharts will use array indexes as its categorical domain
     * 2. When category axis has duplicated text, serial numbers are used to generate scale
     */
    return (0, _range.default)(0, allDataSquished.length);
  }
  if (axisSettings.allowDuplicatedCategory) {
    return categoricalDomain;
  }
  return Array.from(new Set(categoricalDomain));
};
var selectReferenceDots = state => state.referenceElements.dots;
exports.selectReferenceDots = selectReferenceDots;
var filterReferenceElements = (elements, axisType, axisId) => {
  return elements.filter(el => el.ifOverflow === 'extendDomain').filter(el => {
    if (axisType === 'xAxis') {
      return el.xAxisId === axisId;
    }
    return el.yAxisId === axisId;
  });
};
exports.filterReferenceElements = filterReferenceElements;
var selectReferenceDotsByAxis = exports.selectReferenceDotsByAxis = (0, _reselect.createSelector)([selectReferenceDots, _pickAxisType.pickAxisType, _pickAxisId.pickAxisId], filterReferenceElements);
var selectReferenceAreas = state => state.referenceElements.areas;
exports.selectReferenceAreas = selectReferenceAreas;
var selectReferenceAreasByAxis = exports.selectReferenceAreasByAxis = (0, _reselect.createSelector)([selectReferenceAreas, _pickAxisType.pickAxisType, _pickAxisId.pickAxisId], filterReferenceElements);
var selectReferenceLines = state => state.referenceElements.lines;
exports.selectReferenceLines = selectReferenceLines;
var selectReferenceLinesByAxis = exports.selectReferenceLinesByAxis = (0, _reselect.createSelector)([selectReferenceLines, _pickAxisType.pickAxisType, _pickAxisId.pickAxisId], filterReferenceElements);
var combineDotsDomain = (dots, axisType) => {
  if (dots == null) {
    return undefined;
  }
  var allCoords = onlyAllowNumbers(dots.map(dot => axisType === 'xAxis' ? dot.x : dot.y));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
exports.combineDotsDomain = combineDotsDomain;
var selectReferenceDotsDomain = (0, _reselect.createSelector)(selectReferenceDotsByAxis, _pickAxisType.pickAxisType, combineDotsDomain);
var combineAreasDomain = (areas, axisType) => {
  if (areas == null) {
    return undefined;
  }
  var allCoords = onlyAllowNumbers(areas.flatMap(area => [axisType === 'xAxis' ? area.x1 : area.y1, axisType === 'xAxis' ? area.x2 : area.y2]));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
exports.combineAreasDomain = combineAreasDomain;
var selectReferenceAreasDomain = (0, _reselect.createSelector)([selectReferenceAreasByAxis, _pickAxisType.pickAxisType], combineAreasDomain);
function extractXCoordinates(line) {
  var _line$segment;
  if (line.x != null) {
    return onlyAllowNumbers([line.x]);
  }
  var segmentCoordinates = (_line$segment = line.segment) === null || _line$segment === void 0 ? void 0 : _line$segment.map(s => s.x);
  if (segmentCoordinates == null || segmentCoordinates.length === 0) {
    return [];
  }
  return onlyAllowNumbers(segmentCoordinates);
}
function extractYCoordinates(line) {
  var _line$segment2;
  if (line.y != null) {
    return onlyAllowNumbers([line.y]);
  }
  var segmentCoordinates = (_line$segment2 = line.segment) === null || _line$segment2 === void 0 ? void 0 : _line$segment2.map(s => s.y);
  if (segmentCoordinates == null || segmentCoordinates.length === 0) {
    return [];
  }
  return onlyAllowNumbers(segmentCoordinates);
}
var combineLinesDomain = (lines, axisType) => {
  if (lines == null) {
    return undefined;
  }
  var allCoords = lines.flatMap(line => axisType === 'xAxis' ? extractXCoordinates(line) : extractYCoordinates(line));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
exports.combineLinesDomain = combineLinesDomain;
var selectReferenceLinesDomain = (0, _reselect.createSelector)([selectReferenceLinesByAxis, _pickAxisType.pickAxisType], combineLinesDomain);
var selectReferenceElementsDomain = (0, _reselect.createSelector)(selectReferenceDotsDomain, selectReferenceLinesDomain, selectReferenceAreasDomain, (dotsDomain, linesDomain, areasDomain) => {
  return mergeDomains(dotsDomain, areasDomain, linesDomain);
});
var combineNumericalDomain = (axisSettings, domainDefinition, domainFromUserPreference, domainOfStackGroups, dataAndErrorBarsDomain, referenceElementsDomain, layout, axisType, numericTicksDomain) => {
  if (domainFromUserPreference != null) {
    // We're done! No need to compute anything else.
    return domainFromUserPreference;
  }
  var shouldIncludeDomainOfStackGroups = layout === 'vertical' && axisType === 'xAxis' || layout === 'horizontal' && axisType === 'yAxis';
  var mergedDomains = shouldIncludeDomainOfStackGroups ? mergeDomains(domainOfStackGroups, referenceElementsDomain, dataAndErrorBarsDomain) : mergeDomains(referenceElementsDomain, dataAndErrorBarsDomain);
  var parsedDomain = (0, _isDomainSpecifiedByUser.parseNumericalUserDomain)(domainDefinition, mergedDomains, axisSettings.allowDataOverflow);
  if (parsedDomain != null) {
    return parsedDomain;
  }

  /*
   * https://github.com/recharts/recharts/issues/7362
   * The user-provided domain could not be resolved without data - it's a function
   * bound or one of 'auto'/'dataMin'/'dataMax' - and there is no data domain to
   * resolve it from: empty or all-null data, and no domain-extending reference
   * elements (only reference dots/lines/areas with ifOverflow="extendDomain"
   * contribute to mergedDomains). If the
   * axis opted into data overflow and supplied an explicit numeric `ticks` array,
   * fall back to the ticks' [min, max] extent so the explicit tick ladder still
   * renders, mirroring what a literal numeric domain already does.
   */
  if (axisSettings.allowDataOverflow && mergedDomains == null && numericTicksDomain != null) {
    return numericTicksDomain;
  }
  return parsedDomain;
};

/**
 * https://github.com/recharts/recharts/issues/7362
 * Derives the [min, max] extent of an axis's explicit numeric `ticks`. Used by
 * {@link combineNumericalDomain} as a last-resort domain when a non-literal domain
 * cannot be resolved without data. Returns undefined for non-number axes, or when
 * no numeric ticks were supplied.
 */
exports.combineNumericalDomain = combineNumericalDomain;
var combineNumericTicksDomain = axisSettings => {
  if (axisSettings == null || axisSettings.type !== 'number' || !('ticks' in axisSettings) || axisSettings.ticks == null) {
    return undefined;
  }
  var numericTicks = onlyAllowNumbers(axisSettings.ticks);
  if (numericTicks.length === 0) {
    return undefined;
  }
  return [Math.min(...numericTicks), Math.max(...numericTicks)];
};
exports.combineNumericTicksDomain = combineNumericTicksDomain;
var selectNumericTicksDomain = exports.selectNumericTicksDomain = (0, _reselect.createSelector)([selectBaseAxis], combineNumericTicksDomain, {
  memoizeOptions: {
    resultEqualityCheck: _numberDomainEqualityCheck.numberDomainEqualityCheck
  }
});
var selectNumericalDomain = exports.selectNumericalDomain = (0, _reselect.createSelector)([selectBaseAxis, selectDomainDefinition, selectDomainFromUserPreference, selectDomainOfStackGroups, selectDomainOfAllAppliedNumericalValuesIncludingErrorValues, selectReferenceElementsDomain, _chartLayoutContext.selectChartLayout, _pickAxisType.pickAxisType, selectNumericTicksDomain], combineNumericalDomain, {
  memoizeOptions: {
    resultEqualityCheck: _numberDomainEqualityCheck.numberDomainEqualityCheck
  }
});

/**
 * Expand by design maps everything between 0 and 1,
 * there is nothing to compute.
 * See https://d3js.org/d3-shape/stack#stack-offsets
 */
var expandDomain = [0, 1];
var combineAxisDomain = (axisSettings, layout, displayedData, allAppliedValues, stackOffsetType, axisType, numericalDomain) => {
  if ((axisSettings == null || displayedData == null || displayedData.length === 0) && numericalDomain === undefined) {
    return undefined;
  }
  var dataKey = axisSettings.dataKey,
    type = axisSettings.type;
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  if (isCategorical && dataKey == null) {
    var _displayedData$length;
    return (0, _range.default)(0, (_displayedData$length = displayedData === null || displayedData === void 0 ? void 0 : displayedData.length) !== null && _displayedData$length !== void 0 ? _displayedData$length : 0);
  }
  if (type === 'category') {
    return computeDomainOfTypeCategory(allAppliedValues, axisSettings, isCategorical);
  }
  if (stackOffsetType === 'expand' && !isCategorical) {
    return expandDomain;
  }
  return numericalDomain;
};
exports.combineAxisDomain = combineAxisDomain;
var selectAxisDomain = exports.selectAxisDomain = (0, _reselect.createSelector)([selectBaseAxis, _chartLayoutContext.selectChartLayout, selectDisplayedData, selectAllAppliedValues, _rootPropsSelectors.selectStackOffsetType, _pickAxisType.pickAxisType, selectNumericalDomain], combineAxisDomain);
var selectRealScaleType = exports.selectRealScaleType = (0, _reselect.createSelector)([selectBaseAxis, selectHasBar, _rootPropsSelectors.selectChartName], _combineRealScaleType.combineRealScaleType);
var combineNiceTicks = (axisDomain, axisSettings, realScaleType) => {
  var niceTicks = axisSettings.niceTicks;
  if (niceTicks === 'none') {
    return undefined;
  }
  var domainDefinition = getDomainDefinition(axisSettings);
  var hasDomainAutoKeyword = Array.isArray(domainDefinition) && (domainDefinition[0] === 'auto' || domainDefinition[1] === 'auto');
  if ((niceTicks === 'snap125' || niceTicks === 'adaptive') && axisSettings != null && axisSettings.tickCount && (0, _isDomainSpecifiedByUser.isWellFormedNumberDomain)(axisDomain)) {
    if (hasDomainAutoKeyword) {
      return (0, _scale.getNiceTickValues)(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals, niceTicks);
    }
    if (axisSettings.type === 'number') {
      return (0, _scale.getTickValuesFixedDomain)(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals, niceTicks);
    }
  }
  if (niceTicks === 'auto' && realScaleType === 'linear' && axisSettings != null && axisSettings.tickCount) {
    // Current magic-selector behaviour: apply nice ticks when the domain contains
    // an 'auto' keyword (may extend the domain), or for any fixed number-type axis.
    // Always uses the space-efficient algorithm (adaptive).
    if (hasDomainAutoKeyword && (0, _isDomainSpecifiedByUser.isWellFormedNumberDomain)(axisDomain)) {
      return (0, _scale.getNiceTickValues)(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals, 'adaptive');
    }
    if (axisSettings.type === 'number' && (0, _isDomainSpecifiedByUser.isWellFormedNumberDomain)(axisDomain)) {
      return (0, _scale.getTickValuesFixedDomain)(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals, 'adaptive');
    }
  }
  return undefined;
};
exports.combineNiceTicks = combineNiceTicks;
var selectNiceTicks = exports.selectNiceTicks = (0, _reselect.createSelector)([selectAxisDomain, selectRenderableAxisSettings, selectRealScaleType], combineNiceTicks);
var combineAxisDomainWithNiceTicks = (axisSettings, domain, niceTicks, axisType) => {
  if (
  /*
   * Angle axis for some reason uses nice ticks when rendering axis tick labels,
   * but doesn't use nice ticks for extending domain like all the other axes do.
   * Not really sure why? Is there a good reason,
   * or is it just because someone added support for nice ticks to the other axes and forgot this one?
   */
  axisType !== 'angleAxis' && (axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.type) === 'number' && (0, _isDomainSpecifiedByUser.isWellFormedNumberDomain)(domain) && Array.isArray(niceTicks) && niceTicks.length > 0) {
    var _niceTicks$, _niceTicks;
    var minFromDomain = domain[0];
    var minFromTicks = (_niceTicks$ = niceTicks[0]) !== null && _niceTicks$ !== void 0 ? _niceTicks$ : 0;
    var maxFromDomain = domain[1];
    var maxFromTicks = (_niceTicks = niceTicks[niceTicks.length - 1]) !== null && _niceTicks !== void 0 ? _niceTicks : 0;
    return [Math.min(minFromDomain, minFromTicks), Math.max(maxFromDomain, maxFromTicks)];
  }
  return domain;
};
exports.combineAxisDomainWithNiceTicks = combineAxisDomainWithNiceTicks;
var selectAxisDomainIncludingNiceTicks = exports.selectAxisDomainIncludingNiceTicks = (0, _reselect.createSelector)([selectBaseAxis, selectAxisDomain, selectNiceTicks, _pickAxisType.pickAxisType], combineAxisDomainWithNiceTicks);

/**
 * Returns the smallest gap, between two numbers in the data, as a ratio of the whole range (max - min).
 * Ignores domain provided by user and only considers domain from data.
 *
 * The result is a number between 0 and 1.
 */
var selectSmallestDistanceBetweenValues = exports.selectSmallestDistanceBetweenValues = (0, _reselect.createSelector)(selectAllAppliedValues, selectBaseAxis, (allDataSquished, axisSettings) => {
  if (!axisSettings || axisSettings.type !== 'number') {
    return undefined;
  }
  var smallestDistanceBetweenValues = Infinity;
  var sortedValues = Array.from(onlyAllowNumbers(allDataSquished.map(d => d.value))).sort((a, b) => a - b);
  var first = sortedValues[0];
  var last = sortedValues[sortedValues.length - 1];
  if (first == null || last == null) {
    return Infinity;
  }
  var diff = last - first;
  if (diff === 0) {
    return Infinity;
  }
  // Only do n - 1 distance calculations because there's only n - 1 distances between n values.
  for (var i = 0; i < sortedValues.length - 1; i++) {
    var curr = sortedValues[i];
    var next = sortedValues[i + 1];
    if (curr == null || next == null) {
      continue;
    }
    var distance = next - curr;
    smallestDistanceBetweenValues = Math.min(smallestDistanceBetweenValues, distance);
  }
  return smallestDistanceBetweenValues / diff;
});
var selectCalculatedPadding = (0, _reselect.createSelector)(selectSmallestDistanceBetweenValues, _chartLayoutContext.selectChartLayout, _rootPropsSelectors.selectBarCategoryGap, _selectChartOffsetInternal.selectChartOffsetInternal, (_1, _2, _3, _4, padding) => padding, (smallestDistanceInPercent, layout, barCategoryGap, offset, padding) => {
  if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(smallestDistanceInPercent)) {
    return 0;
  }
  var rangeWidth = layout === 'vertical' ? offset.height : offset.width;
  if (padding === 'gap') {
    return smallestDistanceInPercent * rangeWidth / 2;
  }
  if (padding === 'no-gap') {
    var gap = (0, _DataUtils.getPercentValue)(barCategoryGap, smallestDistanceInPercent * rangeWidth);
    var halfBand = smallestDistanceInPercent * rangeWidth / 2;
    return halfBand - gap - (halfBand - gap) / rangeWidth * gap;
  }
  return 0;
});
var selectCalculatedXAxisPadding = (state, axisId, isPanorama) => {
  var xAxisSettings = selectXAxisSettings(state, axisId);
  if (xAxisSettings == null || typeof xAxisSettings.padding !== 'string') {
    return 0;
  }
  return selectCalculatedPadding(state, 'xAxis', axisId, isPanorama, xAxisSettings.padding);
};
exports.selectCalculatedXAxisPadding = selectCalculatedXAxisPadding;
var selectCalculatedYAxisPadding = (state, axisId, isPanorama) => {
  var yAxisSettings = selectYAxisSettings(state, axisId);
  if (yAxisSettings == null || typeof yAxisSettings.padding !== 'string') {
    return 0;
  }
  return selectCalculatedPadding(state, 'yAxis', axisId, isPanorama, yAxisSettings.padding);
};
exports.selectCalculatedYAxisPadding = selectCalculatedYAxisPadding;
var selectXAxisPadding = (0, _reselect.createSelector)(selectXAxisSettings, selectCalculatedXAxisPadding, (xAxisSettings, calculated) => {
  var _padding$left, _padding$right;
  if (xAxisSettings == null) {
    return {
      left: 0,
      right: 0
    };
  }
  var padding = xAxisSettings.padding;
  if (typeof padding === 'string') {
    return {
      left: calculated,
      right: calculated
    };
  }
  return {
    left: ((_padding$left = padding.left) !== null && _padding$left !== void 0 ? _padding$left : 0) + calculated,
    right: ((_padding$right = padding.right) !== null && _padding$right !== void 0 ? _padding$right : 0) + calculated
  };
});
var selectYAxisPadding = (0, _reselect.createSelector)(selectYAxisSettings, selectCalculatedYAxisPadding, (yAxisSettings, calculated) => {
  var _padding$top, _padding$bottom;
  if (yAxisSettings == null) {
    return {
      top: 0,
      bottom: 0
    };
  }
  var padding = yAxisSettings.padding;
  if (typeof padding === 'string') {
    return {
      top: calculated,
      bottom: calculated
    };
  }
  return {
    top: ((_padding$top = padding.top) !== null && _padding$top !== void 0 ? _padding$top : 0) + calculated,
    bottom: ((_padding$bottom = padding.bottom) !== null && _padding$bottom !== void 0 ? _padding$bottom : 0) + calculated
  };
});
var selectXAxisRange = exports.selectXAxisRange = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal, selectXAxisPadding, _brushSelectors.selectBrushDimensions, _brushSelectors.selectBrushSettings, (_state, _axisId, isPanorama) => isPanorama], (offset, padding, brushDimensions, _ref6, isPanorama) => {
  var brushPadding = _ref6.padding;
  if (isPanorama) {
    return [brushPadding.left, brushDimensions.width - brushPadding.right];
  }
  return [offset.left + padding.left, offset.left + offset.width - padding.right];
});
var selectYAxisRange = exports.selectYAxisRange = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal, _chartLayoutContext.selectChartLayout, selectYAxisPadding, _brushSelectors.selectBrushDimensions, _brushSelectors.selectBrushSettings, (_state, _axisId, isPanorama) => isPanorama], (offset, layout, padding, brushDimensions, _ref7, isPanorama) => {
  var brushPadding = _ref7.padding;
  if (isPanorama) {
    return [brushDimensions.height - brushPadding.bottom, brushPadding.top];
  }
  if (layout === 'horizontal') {
    return [offset.top + offset.height - padding.bottom, offset.top + padding.top];
  }
  return [offset.top + padding.top, offset.top + offset.height - padding.bottom];
});
var selectAxisRange = (state, axisType, axisId, isPanorama) => {
  var _selectZAxisSettings;
  switch (axisType) {
    case 'xAxis':
      return selectXAxisRange(state, axisId, isPanorama);
    case 'yAxis':
      return selectYAxisRange(state, axisId, isPanorama);
    case 'zAxis':
      return (_selectZAxisSettings = selectZAxisSettings(state, axisId)) === null || _selectZAxisSettings === void 0 ? void 0 : _selectZAxisSettings.range;
    case 'angleAxis':
      return (0, _polarAxisSelectors.selectAngleAxisRange)(state);
    case 'radiusAxis':
      return (0, _polarAxisSelectors.selectRadiusAxisRange)(state, axisId);
    default:
      return undefined;
  }
};
exports.selectAxisRange = selectAxisRange;
var selectAxisRangeWithReverse = exports.selectAxisRangeWithReverse = (0, _reselect.createSelector)([selectBaseAxis, selectAxisRange], _combineAxisRangeWithReverse.combineAxisRangeWithReverse);
var selectCheckedAxisDomain = exports.selectCheckedAxisDomain = (0, _reselect.createSelector)([selectRealScaleType, selectAxisDomainIncludingNiceTicks], _combineCheckedDomain.combineCheckedDomain);
var selectConfiguredScale = (0, _reselect.createSelector)([selectBaseAxis, selectRealScaleType, selectCheckedAxisDomain, selectAxisRangeWithReverse], _combineConfiguredScale.combineConfiguredScale);
var combineCategoricalDomain = (layout, appliedValues, axis, axisType) => {
  if (axis == null || axis.dataKey == null) {
    return undefined;
  }
  var type = axis.type,
    scale = axis.scale;
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  if (isCategorical && (type === 'number' || scale !== 'auto')) {
    return appliedValues.map(d => d.value);
  }
  return undefined;
};
exports.combineCategoricalDomain = combineCategoricalDomain;
var selectCategoricalDomain = exports.selectCategoricalDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectAllAppliedValues, selectRenderableAxisSettings, _pickAxisType.pickAxisType], combineCategoricalDomain);
var selectAxisScale = exports.selectAxisScale = (0, _reselect.createSelector)([selectConfiguredScale], _RechartsScale.rechartsScaleFactory);
var selectAxisInverseScale = exports.selectAxisInverseScale = (0, _reselect.createSelector)([selectConfiguredScale], _combineInverseScaleFunction.combineInverseScaleFunction);
var selectAxisInverseDataSnapScale = exports.selectAxisInverseDataSnapScale = (0, _reselect.createSelector)([selectConfiguredScale, selectSortedDataPoints], _createCategoricalInverse.createCategoricalInverse);
var selectErrorBarsSettings = exports.selectErrorBarsSettings = (0, _reselect.createSelector)([selectCartesianItemsSettings, selectAllErrorBarSettings, _pickAxisType.pickAxisType], combineRelevantErrorBarSettings);
function compareIds(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}
var pickAxisOrientation = (_state, orientation) => orientation;
var pickMirror = (_state, _orientation, mirror) => mirror;
var selectAllXAxesWithOffsetType = (0, _reselect.createSelector)(_selectAllAxes.selectAllXAxes, pickAxisOrientation, pickMirror, (allAxes, orientation, mirror) => allAxes.filter(axis => axis.orientation === orientation).filter(axis => axis.mirror === mirror).sort(compareIds));
var selectAllYAxesWithOffsetType = (0, _reselect.createSelector)(_selectAllAxes.selectAllYAxes, pickAxisOrientation, pickMirror, (allAxes, orientation, mirror) => allAxes.filter(axis => axis.orientation === orientation).filter(axis => axis.mirror === mirror).sort(compareIds));
var getXAxisSize = (offset, axisSettings) => {
  var height = typeof axisSettings.height === 'number' ? axisSettings.height : _Constants.DEFAULT_X_AXIS_HEIGHT;
  return {
    width: offset.width,
    height
  };
};
var getYAxisSize = (offset, axisSettings) => {
  var width = typeof axisSettings.width === 'number' ? axisSettings.width : _Constants.DEFAULT_Y_AXIS_WIDTH;
  return {
    width,
    height: offset.height
  };
};
var selectXAxisSize = exports.selectXAxisSize = (0, _reselect.createSelector)(_selectChartOffsetInternal.selectChartOffsetInternal, selectXAxisSettings, getXAxisSize);
var combineXAxisPositionStartingPoint = (offset, orientation, chartHeight) => {
  switch (orientation) {
    case 'top':
      return offset.top;
    case 'bottom':
      return chartHeight - offset.bottom;
    default:
      return 0;
  }
};
var combineYAxisPositionStartingPoint = (offset, orientation, chartWidth) => {
  switch (orientation) {
    case 'left':
      return offset.left;
    case 'right':
      return chartWidth - offset.right;
    default:
      return 0;
  }
};
var selectAllXAxesOffsetSteps = exports.selectAllXAxesOffsetSteps = (0, _reselect.createSelector)(_containerSelectors.selectChartHeight, _selectChartOffsetInternal.selectChartOffsetInternal, selectAllXAxesWithOffsetType, pickAxisOrientation, pickMirror, (chartHeight, offset, allAxesWithSameOffsetType, orientation, mirror) => {
  var steps = {};
  var position;
  allAxesWithSameOffsetType.forEach(axis => {
    var axisSize = getXAxisSize(offset, axis);
    if (position == null) {
      position = combineXAxisPositionStartingPoint(offset, orientation, chartHeight);
    }
    var needSpace = orientation === 'top' && !mirror || orientation === 'bottom' && mirror;
    steps[axis.id] = position - Number(needSpace) * axisSize.height;
    position += (needSpace ? -1 : 1) * axisSize.height;
  });
  return steps;
});
var selectAllYAxesOffsetSteps = exports.selectAllYAxesOffsetSteps = (0, _reselect.createSelector)(_containerSelectors.selectChartWidth, _selectChartOffsetInternal.selectChartOffsetInternal, selectAllYAxesWithOffsetType, pickAxisOrientation, pickMirror, (chartWidth, offset, allAxesWithSameOffsetType, orientation, mirror) => {
  var steps = {};
  var position;
  allAxesWithSameOffsetType.forEach(axis => {
    var axisSize = getYAxisSize(offset, axis);
    if (position == null) {
      position = combineYAxisPositionStartingPoint(offset, orientation, chartWidth);
    }
    var needSpace = orientation === 'left' && !mirror || orientation === 'right' && mirror;
    steps[axis.id] = position - Number(needSpace) * axisSize.width;
    position += (needSpace ? -1 : 1) * axisSize.width;
  });
  return steps;
});
var selectXAxisOffsetSteps = (state, axisId) => {
  var axisSettings = selectXAxisSettings(state, axisId);
  if (axisSettings == null) {
    return undefined;
  }
  return selectAllXAxesOffsetSteps(state, axisSettings.orientation, axisSettings.mirror);
};
var selectXAxisPosition = exports.selectXAxisPosition = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal, selectXAxisSettings, selectXAxisOffsetSteps, (_, axisId) => axisId], (offset, axisSettings, allSteps, axisId) => {
  if (axisSettings == null) {
    return undefined;
  }
  var stepOfThisAxis = allSteps === null || allSteps === void 0 ? void 0 : allSteps[axisId];
  if (stepOfThisAxis == null) {
    return {
      x: offset.left,
      y: 0
    };
  }
  return {
    x: offset.left,
    y: stepOfThisAxis
  };
});
var selectYAxisOffsetSteps = (state, axisId) => {
  var axisSettings = selectYAxisSettings(state, axisId);
  if (axisSettings == null) {
    return undefined;
  }
  return selectAllYAxesOffsetSteps(state, axisSettings.orientation, axisSettings.mirror);
};
var selectYAxisPosition = exports.selectYAxisPosition = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal, selectYAxisSettings, selectYAxisOffsetSteps, (_, axisId) => axisId], (offset, axisSettings, allSteps, axisId) => {
  if (axisSettings == null) {
    return undefined;
  }
  var stepOfThisAxis = allSteps === null || allSteps === void 0 ? void 0 : allSteps[axisId];
  if (stepOfThisAxis == null) {
    return {
      x: 0,
      y: offset.top
    };
  }
  return {
    x: stepOfThisAxis,
    y: offset.top
  };
});
var selectYAxisSize = exports.selectYAxisSize = (0, _reselect.createSelector)(_selectChartOffsetInternal.selectChartOffsetInternal, selectYAxisSettings, (offset, axisSettings) => {
  var width = typeof axisSettings.width === 'number' ? axisSettings.width : _Constants.DEFAULT_Y_AXIS_WIDTH;
  return {
    width,
    height: offset.height
  };
});
var selectCartesianAxisSize = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSize(state, axisId).width;
      }
    case 'yAxis':
      {
        return selectYAxisSize(state, axisId).height;
      }
    default:
      {
        return undefined;
      }
  }
};
exports.selectCartesianAxisSize = selectCartesianAxisSize;
var combineDuplicateDomain = (chartLayout, appliedValues, axis, axisType) => {
  if (axis == null) {
    return undefined;
  }
  var allowDuplicatedCategory = axis.allowDuplicatedCategory,
    type = axis.type,
    dataKey = axis.dataKey;
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(chartLayout, axisType);
  var allData = appliedValues.map(av => av.value);
  var validData = allData.filter(v => v != null);
  if (dataKey && isCategorical && type === 'category' && allowDuplicatedCategory && (0, _DataUtils.hasDuplicate)(validData)) {
    return allData;
  }
  return undefined;
};
exports.combineDuplicateDomain = combineDuplicateDomain;
var selectDuplicateDomain = exports.selectDuplicateDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectAllAppliedValues, selectBaseAxis, _pickAxisType.pickAxisType], combineDuplicateDomain);
var selectAxisPropsNeededForCartesianGridTicksGenerator = exports.selectAxisPropsNeededForCartesianGridTicksGenerator = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectCartesianAxisSettings, selectRealScaleType, selectAxisScale, selectDuplicateDomain, selectCategoricalDomain, selectAxisRange, selectNiceTicks, _pickAxisType.pickAxisType], (layout, axis, realScaleType, scale, duplicateDomain, categoricalDomain, axisRange, niceTicks, axisType) => {
  if (axis == null) {
    return undefined;
  }
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  return {
    angle: axis.angle,
    interval: axis.interval,
    minTickGap: axis.minTickGap,
    orientation: axis.orientation,
    tick: axis.tick,
    tickCount: axis.tickCount,
    tickFormatter: axis.tickFormatter,
    ticks: axis.ticks,
    type: axis.type,
    unit: axis.unit,
    axisType,
    categoricalDomain,
    duplicateDomain,
    isCategorical,
    niceTicks,
    range: axisRange,
    realScaleType,
    scale
  };
});

/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
var combineAxisTicks = (layout, axis, realScaleType, scale, niceTicks, axisRange, duplicateDomain, categoricalDomain, axisType) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  var type = axis.type,
    ticks = axis.ticks,
    tickCount = axis.tickCount;
  var offsetForBand =
  // @ts-expect-error This is testing for `scaleBand` but for band axis the type is reported as `band` so this looks like a dead code with a workaround elsewhere?
  realScaleType === 'scaleBand' && typeof scale.bandwidth === 'function' ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && axisRange != null && axisRange.length >= 2 ? (0, _DataUtils.mathSign)(axisRange[0] - axisRange[1]) * 2 * offset : offset;

  // The ticks set by user should only affect the ticks adjacent to axis line
  var ticksOrNiceTicks = ticks || niceTicks;
  if (ticksOrNiceTicks) {
    return ticksOrNiceTicks.map((entry, index) => {
      var scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
      var scaled = scale.map(scaleContent);
      if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
        return null;
      }
      return {
        index,
        coordinate: scaled + offset,
        value: entry,
        offset
      };
    }).filter(_DataUtils.isNotNil);
  }

  // When axis is a categorical axis, but the type of axis is not number and scale is not "auto"
  // For type='number' with linear scale (where niceTicks are available), skip this branch
  // so ticks are evenly spaced instead of placed at data positions (GitHub issue #4271)
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => {
      var scaled = scale.map(entry);
      if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(_DataUtils.isNotNil);
  }
  if (scale.ticks) {
    return scale.ticks(tickCount).map((entry, index) => {
      var scaled = scale.map(entry);
      if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(_DataUtils.isNotNil);
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => {
    var scaled = scale.map(entry);
    if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
      return null;
    }
    return {
      coordinate: scaled + offset,
      // @ts-expect-error can't use Date as index
      value: duplicateDomain ? duplicateDomain[entry] : entry,
      index,
      offset
    };
  }).filter(_DataUtils.isNotNil);
};
exports.combineAxisTicks = combineAxisTicks;
var selectTicksOfAxis = exports.selectTicksOfAxis = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectRenderableAxisSettings, selectRealScaleType, selectAxisScale, selectNiceTicks, selectAxisRange, selectDuplicateDomain, selectCategoricalDomain, _pickAxisType.pickAxisType], combineAxisTicks);

/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
var combineGraphicalItemTicks = (layout, axis, scale, axisRange, duplicateDomain, categoricalDomain, axisType) => {
  if (axis == null || scale == null || axisRange == null || axisRange[0] === axisRange[1]) {
    return undefined;
  }
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  var tickCount = axis.tickCount;
  var offset = 0;
  offset = axisType === 'angleAxis' && (axisRange === null || axisRange === void 0 ? void 0 : axisRange.length) >= 2 ? (0, _DataUtils.mathSign)(axisRange[0] - axisRange[1]) * 2 * offset : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => {
      var scaled = scale.map(entry);
      if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(_DataUtils.isNotNil);
  }
  if (scale.ticks) {
    return scale.ticks(tickCount).map((entry, index) => {
      var scaled = scale.map(entry);
      if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(_DataUtils.isNotNil);
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => {
    var scaled = scale.map(entry);
    if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
      return null;
    }
    return {
      coordinate: scaled + offset,
      // @ts-expect-error can't use unknown as index
      value: duplicateDomain ? duplicateDomain[entry] : entry,
      index,
      offset
    };
  }).filter(_DataUtils.isNotNil);
};
exports.combineGraphicalItemTicks = combineGraphicalItemTicks;
var selectTicksOfGraphicalItem = exports.selectTicksOfGraphicalItem = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectRenderableAxisSettings, selectAxisScale, selectAxisRange, selectDuplicateDomain, selectCategoricalDomain, _pickAxisType.pickAxisType], combineGraphicalItemTicks);

/**
 * This is the internal representation of an axis along with its scale function.
 * Here we have already computed the scale function for the axis,
 * and replaced the union type of scale (string | function) with just the function type.
 */

var selectAxisWithScale = exports.selectAxisWithScale = (0, _reselect.createSelector)(selectBaseAxis, selectAxisScale, (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});
var selectZAxisConfiguredScale = (0, _reselect.createSelector)([selectBaseAxis, selectRealScaleType, selectAxisDomain, selectAxisRangeWithReverse], _combineConfiguredScale.combineConfiguredScale);
var selectZAxisScale = (0, _reselect.createSelector)([selectZAxisConfiguredScale], _RechartsScale.rechartsScaleFactory);
var selectZAxisWithScale = exports.selectZAxisWithScale = (0, _reselect.createSelector)((state, _axisType, axisId) => selectZAxisSettings(state, axisId), selectZAxisScale, (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});

/**
 * We are also going to need to implement polar chart directions if we want to support keyboard controls for those.
 */

var selectChartDirection = exports.selectChartDirection = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _selectAllAxes.selectAllXAxes, _selectAllAxes.selectAllYAxes], (layout, allXAxes, allYAxes) => {
  switch (layout) {
    case 'horizontal':
      {
        return allXAxes.some(axis => axis.reversed) ? 'right-to-left' : 'left-to-right';
      }
    case 'vertical':
      {
        return allYAxes.some(axis => axis.reversed) ? 'bottom-to-top' : 'top-to-bottom';
      }
    // TODO: make this better. For now, right arrow triggers "forward", left arrow "back"
    // however, the tooltip moves an unintuitive direction because of how the indices are rendered
    case 'centric':
    case 'radial':
      {
        return 'left-to-right';
      }
    default:
      {
        return undefined;
      }
  }
});
var selectRenderedTicksOfAxis = (state, axisType, axisId) => {
  var _state$renderedTicks$;
  return (_state$renderedTicks$ = state.renderedTicks[axisType]) === null || _state$renderedTicks$ === void 0 ? void 0 : _state$renderedTicks$[axisId];
};
exports.selectRenderedTicksOfAxis = selectRenderedTicksOfAxis;
var selectAxisInverseTickSnapScale = exports.selectAxisInverseTickSnapScale = (0, _reselect.createSelector)([selectRenderedTicksOfAxis], ticks => {
  if (!ticks || ticks.length === 0) {
    return undefined;
  }
  return pixelValue => {
    var _closestTick;
    // Find the tick with the closest coordinate to pixelValue
    var minDistance = Infinity;
    var closestTick = ticks[0];
    for (var tick of ticks) {
      var distance = Math.abs(tick.coordinate - pixelValue);
      if (distance < minDistance) {
        minDistance = distance;
        closestTick = tick;
      }
    }
    return (_closestTick = closestTick) === null || _closestTick === void 0 ? void 0 : _closestTick.value;
  };
});