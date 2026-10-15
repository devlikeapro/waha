function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import sortBy from 'es-toolkit/compat/sortBy';
import get from 'es-toolkit/compat/get';
import { stack as shapeStack, stackOffsetExpand, stackOffsetNone, stackOffsetSilhouette, stackOffsetWiggle, stackOrderNone } from 'victory-vendor/d3-shape';
import { findEntryInArray, isNan, isNotNil, isNullish, isNumber, isNumOrStr, mathSign } from './DataUtils';
import { getSliced } from './getSliced';
import { isWellBehavedNumber } from './isWellBehavedNumber';
import { isOutsidePosition } from '../cartesian/getCartesianPosition';
export function getValueByDataKey(obj, dataKey, defaultValue) {
  if (isNullish(obj) || isNullish(dataKey)) {
    return defaultValue;
  }
  if (isNumOrStr(dataKey)) {
    return get(obj, dataKey, defaultValue);
  }
  if (typeof dataKey === 'function') {
    return dataKey(obj);
  }
  return defaultValue;
}
export var appendOffsetOfLegend = (offset, legendSettings, legendSize) => {
  if (legendSettings && legendSize) {
    var boxWidth = legendSize.width,
      boxHeight = legendSize.height;
    var align = legendSettings.align,
      verticalAlign = legendSettings.verticalAlign,
      layout = legendSettings.layout,
      position = legendSettings.position,
      _legendSettings$offse = legendSettings.offset,
      legendOffset = _legendSettings$offse === void 0 ? 0 : _legendSettings$offse;
    if (position != null) {
      // Position-based legends are absolutely placed. They only move the plot area if they are positioned outside.
      if (isOutsidePosition(position)) {
        if (position === 'top' && isNumber(offset.top)) {
          return _objectSpread(_objectSpread({}, offset), {}, {
            top: offset.top + (boxHeight || 0) + legendOffset
          });
        }
        if (position === 'bottom' && isNumber(offset.bottom)) {
          return _objectSpread(_objectSpread({}, offset), {}, {
            bottom: offset.bottom + (boxHeight || 0) + legendOffset
          });
        }
        if (position === 'left' && isNumber(offset.left)) {
          return _objectSpread(_objectSpread({}, offset), {}, {
            left: offset.left + (boxWidth || 0) + legendOffset
          });
        }
        if (position === 'right' && isNumber(offset.right)) {
          return _objectSpread(_objectSpread({}, offset), {}, {
            right: offset.right + (boxWidth || 0) + legendOffset
          });
        }
      }
      return offset;
    }
    if ((layout === 'vertical' || layout === 'horizontal' && verticalAlign === 'middle') && align !== 'center' && isNumber(offset[align])) {
      return _objectSpread(_objectSpread({}, offset), {}, {
        [align]: offset[align] + (boxWidth || 0)
      });
    }
    if ((layout === 'horizontal' || layout === 'vertical' && align === 'center') && verticalAlign !== 'middle' && isNumber(offset[verticalAlign])) {
      return _objectSpread(_objectSpread({}, offset), {}, {
        [verticalAlign]: offset[verticalAlign] + (boxHeight || 0)
      });
    }
  }
  return offset;
};
export var isCategoricalAxis = (layout, axisType) => layout === 'horizontal' && axisType === 'xAxis' || layout === 'vertical' && axisType === 'yAxis' || layout === 'centric' && axisType === 'angleAxis' || layout === 'radial' && axisType === 'radiusAxis';

/**
 * Calculate the Coordinates of grid
 * @param  {Array} ticks           The ticks in axis
 * @param {Number} minValue        The minimum value of axis
 * @param {Number} maxValue        The maximum value of axis
 * @param {boolean} syncWithTicks  Synchronize grid lines with ticks or not
 * @return {Array}                 Coordinates
 */
export var getCoordinatesOfGrid = (ticks, minValue, maxValue, syncWithTicks) => {
  if (syncWithTicks) {
    return ticks.map(entry => entry.coordinate);
  }
  var hasMin, hasMax;
  var values = ticks.map(entry => {
    if (entry.coordinate === minValue) {
      hasMin = true;
    }
    if (entry.coordinate === maxValue) {
      hasMax = true;
    }
    return entry.coordinate;
  });
  if (!hasMin) {
    values.push(minValue);
  }
  if (!hasMax) {
    values.push(maxValue);
  }
  return values;
};
/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
export var getTicksOfAxis = (axis, isGrid, isAll) => {
  if (!axis) {
    return null;
  }
  var duplicateDomain = axis.duplicateDomain,
    type = axis.type,
    range = axis.range,
    scale = axis.scale,
    realScaleType = axis.realScaleType,
    isCategorical = axis.isCategorical,
    categoricalDomain = axis.categoricalDomain,
    tickCount = axis.tickCount,
    ticks = axis.ticks,
    niceTicks = axis.niceTicks,
    axisType = axis.axisType;
  if (!scale) {
    return null;
  }
  var offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  var offset = (isGrid || isAll) && type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && range && range.length >= 2 ? mathSign(range[0] - range[1]) * 2 * offset : offset;

  // The ticks set by user should only affect the ticks adjacent to axis line
  if (isGrid && (ticks || niceTicks)) {
    var result = (ticks || niceTicks || []).map((entry, index) => {
      var scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
      var scaled = scale.map(scaleContent);
      if (!isWellBehavedNumber(scaled)) {
        return null;
      }
      return {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: scaled + offset,
        value: entry,
        offset,
        index
      };
    }).filter(isNotNil);
    return result;
  }

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  // For type='number' with niceTicks available, skip this branch so ticks are evenly spaced (GitHub issue #4271)
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => {
      var scaled = scale.map(entry);
      if (!isWellBehavedNumber(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(isNotNil);
  }
  if (scale.ticks && !isAll && tickCount != null) {
    return scale.ticks(tickCount).map((entry, index) => {
      var scaled = scale.map(entry);
      if (!isWellBehavedNumber(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(isNotNil);
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => {
    var scaled = scale.map(entry);
    if (!isWellBehavedNumber(scaled)) {
      return null;
    }
    return {
      coordinate: scaled + offset,
      // @ts-expect-error can't use Date as an index
      value: duplicateDomain ? duplicateDomain[entry] : entry,
      index,
      offset
    };
  }).filter(isNotNil);
};

/**
 * Both value and domain are tuples of two numbers
 * - but the type stays as array of numbers until we have better support in rest of the app
 * @param value input that will be truncated
 * @param domain boundaries
 * @returns tuple of two numbers
 */
export var truncateByDomain = (value, domain) => {
  if (!domain || domain.length !== 2 || !isNumber(domain[0]) || !isNumber(domain[1])) {
    return value;
  }
  var minValue = Math.min(domain[0], domain[1]);
  var maxValue = Math.max(domain[0], domain[1]);
  var result = [value[0], value[1]];
  if (!isNumber(value[0]) || value[0] < minValue) {
    result[0] = minValue;
  }
  if (!isNumber(value[1]) || value[1] > maxValue) {
    result[1] = maxValue;
  }
  if (result[0] > maxValue) {
    result[0] = maxValue;
  }
  if (result[1] < minValue) {
    result[1] = minValue;
  }
  return result;
};

/**
 * Stacks all positive numbers above zero and all negative numbers below zero.
 *
 * If all values in the series are positive then this behaves the same as 'none' stacker.
 *
 * @param {Array} series from d3-shape Stack
 * @return {Array} series with applied offset
 */
export var offsetSign = series => {
  var _series$;
  var n = series.length;
  if (n <= 0) {
    return;
  }
  var m = (_series$ = series[0]) === null || _series$ === void 0 ? void 0 : _series$.length;
  if (m == null || m <= 0) {
    return;
  }
  for (var j = 0; j < m; ++j) {
    var positive = 0;
    var negative = 0;
    for (var i = 0; i < n; ++i) {
      var row = series[i];
      var col = row === null || row === void 0 ? void 0 : row[j];
      if (col == null) {
        continue;
      }
      var series1 = col[1];
      var series0 = col[0];
      var value = isNan(series1) ? series0 : series1;
      if (value >= 0) {
        col[0] = positive;
        positive += value;
        col[1] = positive;
      } else {
        col[0] = negative;
        negative += value;
        col[1] = negative;
      }
    }
  }
};

/**
 * Replaces all negative values with zero when stacking data.
 *
 * If all values in the series are positive then this behaves the same as 'none' stacker.
 *
 * @param {Array} series from d3-shape Stack
 * @return {Array} series with applied offset
 */
export var offsetPositive = series => {
  var _series$2;
  var n = series.length;
  if (n <= 0) {
    return;
  }
  var m = (_series$2 = series[0]) === null || _series$2 === void 0 ? void 0 : _series$2.length;
  if (m == null || m <= 0) {
    return;
  }
  for (var j = 0; j < m; ++j) {
    var positive = 0;
    for (var i = 0; i < n; ++i) {
      var row = series[i];
      var col = row === null || row === void 0 ? void 0 : row[j];
      if (col == null) {
        continue;
      }
      var value = isNan(col[1]) ? col[0] : col[1];
      if (value >= 0) {
        col[0] = positive;
        positive += value;
        col[1] = positive;
      } else {
        col[0] = 0;
        col[1] = 0;
      }
    }
  }
};

/**
 * Function type to compute offset for stacked data.
 *
 * d3-shape has something fishy going on with its types.
 * In @definitelytyped/d3-shape, this function (the offset accessor) is typed as Series<> => void.
 * However! When I actually open the storybook I can see that the offset accessor actually receives Array<Series<>>.
 * The same I can see in the source code itself:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/66042
 * That one unfortunately has no types but we can tell it passes three-dimensional array.
 *
 * Which leads me to believe that definitelytyped is wrong on this one.
 * There's open discussion on this topic without much attention:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/66042
 */

var STACK_OFFSET_MAP = {
  sign: offsetSign,
  // @ts-expect-error definitelytyped types are incorrect
  expand: stackOffsetExpand,
  // @ts-expect-error definitelytyped types are incorrect
  none: stackOffsetNone,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: stackOffsetSilhouette,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: stackOffsetWiggle,
  positive: offsetPositive
};
export var getStackedData = (data, dataKeys, offsetType) => {
  var _STACK_OFFSET_MAP$off;
  var offsetAccessor = (_STACK_OFFSET_MAP$off = STACK_OFFSET_MAP[offsetType]) !== null && _STACK_OFFSET_MAP$off !== void 0 ? _STACK_OFFSET_MAP$off : stackOffsetNone;
  var stack = shapeStack().keys(dataKeys).value((d, key) => Number(getValueByDataKey(d, key, 0))).order(stackOrderNone)
  // @ts-expect-error definitelytyped types are incorrect
  .offset(offsetAccessor);
  var result = stack(data);

  // Post-process ranged data: if value is an array of two numbers, use them directly without stacking
  result.forEach((series, seriesIndex) => {
    series.forEach((point, pointIndex) => {
      var value = getValueByDataKey(data[pointIndex], dataKeys[seriesIndex], 0);
      if (Array.isArray(value) && value.length === 2 && isNumber(value[0]) && isNumber(value[1])) {
        // eslint-disable-next-line prefer-destructuring,no-param-reassign
        point[0] = value[0];
        // eslint-disable-next-line prefer-destructuring,no-param-reassign
        point[1] = value[1];
      }
    });
  });
  return result;
};

/**
 * Externally, we accept both strings and numbers as stack IDs
 * @inline
 */

/**
 * Stack IDs in the external props allow numbers; but internally we use it as an object key
 * and object keys are always strings. Also, it would be kinda confusing if stackId=8 and stackId='8' were different stacks
 * so let's just force a string.
 */

export function getNormalizedStackId(publicStackId) {
  return publicStackId == null ? undefined : String(publicStackId);
}
export function getCateCoordinateOfLine(_ref) {
  var axis = _ref.axis,
    ticks = _ref.ticks,
    bandSize = _ref.bandSize,
    entry = _ref.entry,
    index = _ref.index,
    dataKey = _ref.dataKey;
  if (axis.type === 'category') {
    // find coordinate of category axis by the value of category
    // @ts-expect-error why does this use direct object access instead of getValueByDataKey?
    if (!axis.allowDuplicatedCategory && axis.dataKey && !isNullish(entry[axis.dataKey])) {
      // @ts-expect-error why does this use direct object access instead of getValueByDataKey?
      var matchedTick = findEntryInArray(ticks, 'value', entry[axis.dataKey]);
      if (matchedTick) {
        return matchedTick.coordinate + bandSize / 2;
      }
    }
    return ticks !== null && ticks !== void 0 && ticks[index] ? ticks[index].coordinate + bandSize / 2 : null;
  }
  var value = getValueByDataKey(entry, !isNullish(dataKey) ? dataKey : axis.dataKey);
  var scaled = axis.scale.map(value);
  if (!isNumber(scaled)) {
    return null;
  }
  return scaled;
}
export var getCateCoordinateOfBar = _ref2 => {
  var axis = _ref2.axis,
    ticks = _ref2.ticks,
    offset = _ref2.offset,
    bandSize = _ref2.bandSize,
    entry = _ref2.entry,
    index = _ref2.index;
  if (axis.type === 'category') {
    return ticks[index] ? ticks[index].coordinate + offset : null;
  }
  // getValueByDataKey does not validate the output type
  var value = getValueByDataKey(entry, axis.dataKey, axis.scale.domain()[index]);
  if (isNullish(value)) {
    return null;
  }
  var scaled = axis.scale.map(value);
  if (!isNumber(scaled)) {
    return null;
  }
  return scaled - bandSize / 2 + offset;
};
export var getBaseValueOfBar = _ref3 => {
  var numericAxis = _ref3.numericAxis;
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === 'number') {
    // @ts-expect-error type number means the domain has numbers in it but this relationship is not known to typescript
    var minValue = Math.min(domain[0], domain[1]);
    // @ts-expect-error type number means the domain has numbers in it but this relationship is not known to typescript
    var maxValue = Math.max(domain[0], domain[1]);
    if (minValue <= 0 && maxValue >= 0) {
      return 0;
    }
    if (maxValue < 0) {
      return maxValue;
    }
    return minValue;
  }
  return domain[0];
};
var getDomainOfSingle = data => {
  var flat = data.flat(2).filter(isNumber);
  return [Math.min(...flat), Math.max(...flat)];
};
var makeDomainFinite = domain => {
  return [domain[0] === Infinity ? 0 : domain[0], domain[1] === -Infinity ? 0 : domain[1]];
};
export var getDomainOfStackGroups = (stackGroups, startIndex, endIndex) => {
  if (stackGroups == null || Object.keys(stackGroups).length === 0) {
    return undefined;
  }
  return makeDomainFinite(Object.keys(stackGroups).reduce((result, stackId) => {
    var group = stackGroups[stackId];
    if (!group) {
      return result;
    }
    var stackedData = group.stackedData;
    var domain = stackedData.reduce((res, entry) => {
      var sliced = getSliced(entry, startIndex, endIndex);
      var s = getDomainOfSingle(sliced);
      if (!isWellBehavedNumber(s[0]) || !isWellBehavedNumber(s[1])) {
        return res;
      }
      return [Math.min(res[0], s[0]), Math.max(res[1], s[1])];
    }, [Infinity, -Infinity]);
    return [Math.min(domain[0], result[0]), Math.max(domain[1], result[1])];
  }, [Infinity, -Infinity]));
};
export var MIN_VALUE_REG = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
export var MAX_VALUE_REG = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;

/**
 * Calculate the size between two category
 * @param  {Object} axis  The options of axis
 * @param  {Array}  ticks The ticks of axis
 * @param  {Boolean} isBar if items in axis are bars
 * @return {Number} Size
 */
export var getBandSizeOfAxis = (axis, ticks, isBar) => {
  if (axis && axis.scale && axis.scale.bandwidth) {
    var bandWidth = axis.scale.bandwidth();
    if (!isBar || bandWidth > 0) {
      return bandWidth;
    }
  }
  if (axis && ticks && ticks.length >= 2) {
    var orderedTicks = sortBy(ticks, o => o.coordinate);

    // Collect the pixel gaps between adjacent category positions and track the
    // widest one.
    var gaps = [];
    var maxGap = 0;
    for (var i = 1, len = orderedTicks.length; i < len; i++) {
      var _orderedTicks$i, _orderedTicks;
      var gap = (((_orderedTicks$i = orderedTicks[i]) === null || _orderedTicks$i === void 0 ? void 0 : _orderedTicks$i.coordinate) || 0) - (((_orderedTicks = orderedTicks[i - 1]) === null || _orderedTicks === void 0 ? void 0 : _orderedTicks.coordinate) || 0);
      gaps.push(gap);
      maxGap = Math.max(gap, maxGap);
    }

    // High-precision float values can place two ticks at (almost) the same pixel,
    // producing a spurious sub-pixel gap. Such near-coincident positions are the
    // same category slot for rendering purposes and must not define the band
    // size, otherwise every bar collapses to ~0px wide (issue #4043). Ignore gaps
    // that are a negligible fraction of the widest gap so a single near-duplicate
    // value cannot dictate the spacing.
    var minMeaningfulGap = maxGap * 1e-4;
    var bandSize = Infinity;
    for (var _gap of gaps) {
      if (_gap > minMeaningfulGap) {
        bandSize = Math.min(_gap, bandSize);
      }
    }
    return bandSize === Infinity ? 0 : bandSize;
  }
  return isBar ? undefined : 0;
};
export function getTooltipEntry(_ref4) {
  var tooltipEntrySettings = _ref4.tooltipEntrySettings,
    dataKey = _ref4.dataKey,
    payload = _ref4.payload,
    value = _ref4.value,
    name = _ref4.name;
  return _objectSpread(_objectSpread({}, tooltipEntrySettings), {}, {
    dataKey,
    payload,
    value,
    name
  });
}
export function getTooltipNameProp(nameFromItem, dataKey) {
  if (nameFromItem != null) {
    return String(nameFromItem);
  }
  if (typeof dataKey === 'string') {
    return dataKey;
  }
  return undefined;
}
export var calculateCartesianTooltipPos = (coordinate, layout) => {
  if (layout === 'horizontal') {
    return coordinate.relativeX;
  }
  if (layout === 'vertical') {
    return coordinate.relativeY;
  }
  return undefined;
};
export var calculatePolarTooltipPos = (rangeObj, layout) => {
  if (layout === 'centric') {
    return rangeObj.angle;
  }
  return rangeObj.radius;
};