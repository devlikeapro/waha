"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Area = void 0;
exports.computeArea = computeArea;
exports.getBaseValue = exports.defaultAreaProps = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _Dots = require("../component/Dots");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _ReactUtils = require("../util/ReactUtils");
var _ActivePoints = require("../component/ActivePoints");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _GraphicalItemClipPath = require("./GraphicalItemClipPath");
var _areaSelectors = require("../state/selectors/areaSelectors");
var _PanoramaContext = require("../context/PanoramaContext");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _selectors = require("../state/selectors/selectors");
var _SetLegendPayload = require("../state/SetLegendPayload");
var _hooks = require("../state/hooks");
var _AnimatedItems = require("../animation/AnimatedItems");
var _matchBy = require("../animation/matchBy");
var _useAnimationStartSnapshot = require("../animation/useAnimationStartSnapshot");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _hooks2 = require("../hooks");
var _RegisterGraphicalItemId = require("../context/RegisterGraphicalItemId");
var _SetGraphicalItem = require("../state/SetGraphicalItem");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _getRadiusAndStrokeWidthFromDot = require("../util/getRadiusAndStrokeWidthFromDot");
var _svgPropertiesAndEvents = require("../util/svgPropertiesAndEvents");
var _ActiveShapeUtils = require("../util/ActiveShapeUtils");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _propsAreEqual = require("../util/propsAreEqual");
var _AreaRevealShape = require("./AreaRevealShape");
var _excluded = ["id"],
  _excluded2 = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @inline
 */

/**
 * Our base value array has payload in it, and we expose it externally too.
 */

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

var defaultAreaAnimateItems = (items, animationElapsedTime) => {
  if (items == null) {
    // First render: return items as-is, clip-path animation handles the reveal
    return [];
  }
  if (animationElapsedTime === 1) {
    return items.flatMap(item => item.status === 'removed' ? [] : [item.next]);
  }
  return items.flatMap(item => {
    if (item.status === 'matched') {
      return [_objectSpread(_objectSpread({}, item.next), {}, {
        x: (0, _DataUtils.interpolate)(item.prev.x, item.next.x, animationElapsedTime),
        y: (0, _DataUtils.interpolate)(item.prev.y, item.next.y, animationElapsedTime)
      })];
    }
    if (item.status === 'added') {
      /*
       * Here we just return the final position without interpolating
       * so that we can allow the default initial animation that is done by clipPath in AreaRevealShape.
       * If you want your own custom animations then you may want to interpolate this one as well.
       */
      return [item.next];
    }
    // removed: drop
    return [];
  });
};
var defaultAreaProps = exports.defaultAreaProps = {
  activeDot: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  animationMatchBy: _matchBy.matchByIndex,
  animationInterpolateFn: defaultAreaAnimateItems,
  connectNulls: false,
  dot: false,
  fill: '#3182bd',
  fillOpacity: 0.6,
  hide: false,
  isAnimationActive: 'auto',
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  type: 'linear',
  label: false,
  shape: _AreaRevealShape.AreaRevealShape,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: _DefaultZIndexes.DefaultZIndexes.area
};

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== 'none' ? stroke : fill;
}
var computeLegendPayloadFromAreaData = props => {
  var dataKey = props.dataKey,
    name = props.name,
    stroke = props.stroke,
    fill = props.fill,
    legendType = props.legendType,
    hide = props.hide;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: getLegendItemColor(stroke, fill),
    value: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
    payload: props
  }];
};
var SetAreaTooltipEntrySettings = /*#__PURE__*/React.memo(_ref => {
  var dataKey = _ref.dataKey,
    data = _ref.data,
    stroke = _ref.stroke,
    strokeWidth = _ref.strokeWidth,
    fill = _ref.fill,
    name = _ref.name,
    hide = _ref.hide,
    unit = _ref.unit,
    formatter = _ref.formatter,
    tooltipType = _ref.tooltipType,
    id = _ref.id;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data,
    getPosition: _DataUtils.noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: undefined,
      name: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
      hide,
      type: tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit,
      formatter,
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});
function AreaDotsWrapper(_ref2) {
  var clipPathId = _ref2.clipPathId,
    points = _ref2.points,
    props = _ref2.props;
  var needClip = props.needClip,
    dot = props.dot,
    dataKey = props.dataKey;
  var areaProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(props);
  return /*#__PURE__*/React.createElement(_Dots.Dots, {
    points: points,
    dot: dot,
    className: "recharts-area-dots",
    dotClassName: "recharts-area-dot",
    dataKey: dataKey,
    baseProps: areaProps,
    needClip: needClip,
    clipPathId: clipPathId
  });
}
function AreaLabelListProvider(_ref3) {
  var showLabels = _ref3.showLabels,
    children = _ref3.children,
    points = _ref3.points;
  var labelListEntries = points.map(point => {
    var _point$x, _point$y;
    var viewBox = {
      x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
      y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return _objectSpread(_objectSpread({}, viewBox), {}, {
      value: point.value,
      payload: point.payload,
      parentViewBox: undefined,
      viewBox,
      fill: undefined
    });
  });
  return /*#__PURE__*/React.createElement(_LabelList.CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : undefined
  }, children);
}
function StaticArea(_ref4) {
  var points = _ref4.points,
    baseLine = _ref4.baseLine,
    needClip = _ref4.needClip,
    clipPathId = _ref4.clipPathId,
    props = _ref4.props,
    animationElapsedTime = _ref4.animationElapsedTime,
    isAnimating = _ref4.isAnimating,
    isEntrance = _ref4.isEntrance;
  var layout = props.layout,
    type = props.type,
    stroke = props.stroke,
    connectNulls = props.connectNulls,
    isRange = props.isRange,
    shape = props.shape;
  var id = props.id,
    propsWithoutId = _objectWithoutProperties(props, _excluded);
  var propsWithEvents = (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(propsWithoutId);
  var curveProps = _objectSpread(_objectSpread({}, propsWithEvents), {}, {
    id,
    points,
    connectNulls,
    type,
    baseLine,
    layout,
    stroke,
    isRange,
    animationElapsedTime,
    isAnimating,
    isEntrance
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/React.createElement(_Layer.Layer, {
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : undefined
  }, /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, {
    option: shape,
    DefaultShape: defaultAreaProps.shape,
    shapeProps: curveProps
  })), /*#__PURE__*/React.createElement(AreaDotsWrapper, {
    points: points,
    props: propsWithoutId,
    clipPathId: clipPathId
  }));
}
function interpolateScalarBaseLine(baseLine, prevBaseLine, animationElapsedTime) {
  if ((0, _DataUtils.isNumber)(baseLine)) {
    var previousNumberBaseLine = (0, _DataUtils.isNumber)(prevBaseLine) ? prevBaseLine : undefined;
    return (0, _DataUtils.interpolate)(previousNumberBaseLine, baseLine, animationElapsedTime);
  }
  if ((0, _DataUtils.isNullish)(baseLine) || (0, _DataUtils.isNan)(baseLine)) {
    var _previousNumberBaseLine = (0, _DataUtils.isNumber)(prevBaseLine) ? prevBaseLine : undefined;
    return (0, _DataUtils.interpolate)(_previousNumberBaseLine, 0, animationElapsedTime);
  }
  return baseLine;
}
function AreaWithAnimation(_ref5) {
  var needClip = _ref5.needClip,
    clipPathId = _ref5.clipPathId,
    props = _ref5.props,
    previousPointsRef = _ref5.previousPointsRef,
    previousBaselineRef = _ref5.previousBaselineRef;
  var points = props.points,
    baseLine = props.baseLine,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    animationMatchBy = props.animationMatchBy,
    animationInterpolateFn = props.animationInterpolateFn;
  var animationInput = (0, _react.useMemo)(() => ({
    points,
    baseLine
  }), [points, baseLine]);
  var baseLineAnimationState = (0, _useAnimationStartSnapshot.useAnimationStartSnapshot)(animationInput, previousBaselineRef);
  var layout = (0, _chartLayoutContext.useCartesianChartLayout)();
  var _useAnimationCallback = (0, _AnimatedItems.useAnimationCallbacks)(props.onAnimationStart, props.onAnimationEnd),
    isAnimating = _useAnimationCallback.isAnimating,
    handleAnimationStart = _useAnimationCallback.handleAnimationStart,
    handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
  var prevBaseLine = baseLineAnimationState.startValue;
  if (layout == null) {
    return null;
  }
  var baseLineAnimationItems;
  if (Array.isArray(baseLine) && Array.isArray(prevBaseLine)) {
    baseLineAnimationItems = (0, _matchBy.matchAnimationItems)(prevBaseLine, baseLine, animationMatchBy);
  } else if (Array.isArray(baseLine)) {
    baseLineAnimationItems = (0, _matchBy.matchAnimationItems)(null, baseLine, animationMatchBy);
  } else {
    baseLineAnimationItems = null;
  }
  return /*#__PURE__*/React.createElement(_AnimatedItems.AnimatedItems, {
    animationInput: animationInput,
    animationIdPrefix: "recharts-area-",
    items: points,
    previousItemsRef: previousPointsRef,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    animationInterpolateFn: animationInterpolateFn,
    animationMatchBy: animationMatchBy,
    layout: layout
  }, (stepPoints, animationElapsedTime, isEntrance) => {
    var stepBaseLine;
    if (animationElapsedTime === 1) {
      stepBaseLine = baseLine;
    } else if (Array.isArray(baseLine)) {
      stepBaseLine = animationInterpolateFn(baseLineAnimationItems, animationElapsedTime, layout);
    } else {
      stepBaseLine = isEntrance ? baseLine : interpolateScalarBaseLine(baseLine, prevBaseLine, animationElapsedTime);
    }
    baseLineAnimationState.syncStepValue(stepBaseLine, animationElapsedTime);
    return /*#__PURE__*/React.createElement(AreaLabelListProvider, {
      showLabels: !isAnimating,
      points: points
    }, props.children, /*#__PURE__*/React.createElement(StaticArea, {
      points: stepPoints,
      baseLine: stepBaseLine,
      needClip: needClip,
      clipPathId: clipPathId,
      props: props,
      animationElapsedTime: animationElapsedTime,
      isAnimating: isAnimating || animationElapsedTime < 1,
      isEntrance: isEntrance
    }), /*#__PURE__*/React.createElement(_LabelList.LabelListFromLabelProp, {
      label: props.label
    }));
  });
}

/*
 * This component decides if the area should be animated or not.
 * It also holds the state of the animation.
 */
function RenderArea(_ref6) {
  var needClip = _ref6.needClip,
    clipPathId = _ref6.clipPathId,
    props = _ref6.props;
  /*
   * These two must be refs, not state!
   * Because we want to store the most recent shape of the animation in case we have to interrupt the animation;
   * that happens when user initiates another animation before the current one finishes.
   *
   * If this was a useState, then every step in the animation would trigger a re-render.
   * So, useRef it is.
   */
  var previousPointsRef = (0, _react.useRef)(null);
  var previousBaselineRef = (0, _react.useRef)();
  return /*#__PURE__*/React.createElement(AreaWithAnimation, {
    needClip: needClip,
    clipPathId: clipPathId,
    props: props,
    previousPointsRef: previousPointsRef,
    previousBaselineRef: previousBaselineRef
  });
}
class AreaWithState extends _react.PureComponent {
  render() {
    var _this$props = this.props,
      hide = _this$props.hide,
      dot = _this$props.dot,
      points = _this$props.points,
      className = _this$props.className,
      top = _this$props.top,
      left = _this$props.left,
      needClip = _this$props.needClip,
      xAxisId = _this$props.xAxisId,
      yAxisId = _this$props.yAxisId,
      width = _this$props.width,
      height = _this$props.height,
      id = _this$props.id,
      baseLine = _this$props.baseLine,
      zIndex = _this$props.zIndex;
    if (hide) {
      return null;
    }
    var layerClass = (0, _clsx.clsx)('recharts-area', className);
    var clipPathId = id;
    var _getRadiusAndStrokeWi = (0, _getRadiusAndStrokeWidthFromDot.getRadiusAndStrokeWidthFromDot)(dot),
      r = _getRadiusAndStrokeWi.r,
      strokeWidth = _getRadiusAndStrokeWi.strokeWidth;
    var clipDot = (0, _ReactUtils.isClipDot)(dot);
    var dotSize = r * 2 + strokeWidth;
    var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : undefined;
    return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
      zIndex: zIndex
    }, /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: layerClass
    }, needClip && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(_GraphicalItemClipPath.GraphicalItemClipPath, {
      clipPathId: clipPathId,
      xAxisId: xAxisId,
      yAxisId: yAxisId
    }), !clipDot && /*#__PURE__*/React.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /*#__PURE__*/React.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /*#__PURE__*/React.createElement(RenderArea, {
      needClip: needClip,
      clipPathId: clipPathId,
      props: this.props
    })), /*#__PURE__*/React.createElement(_ActivePoints.ActivePoints, {
      points: points,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: activePointsClipPath
    }), this.props.isRange && Array.isArray(baseLine) && /*#__PURE__*/React.createElement(_ActivePoints.ActivePoints, {
      points: baseLine,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: activePointsClipPath
    }));
  }
}
function AreaImpl(props) {
  var _useAppSelector;
  var activeDot = props.activeDot,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    connectNulls = props.connectNulls,
    dot = props.dot,
    fill = props.fill,
    fillOpacity = props.fillOpacity,
    hide = props.hide,
    isAnimationActive = props.isAnimationActive,
    legendType = props.legendType,
    stroke = props.stroke,
    xAxisId = props.xAxisId,
    yAxisId = props.yAxisId,
    everythingElse = _objectWithoutProperties(props, _excluded2);
  var layout = (0, _chartLayoutContext.useChartLayout)();
  var chartName = (0, _selectors.useChartName)();
  var _useNeedsClip = (0, _GraphicalItemClipPath.useNeedsClip)(xAxisId, yAxisId),
    needClip = _useNeedsClip.needClip;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var _ref7 = (_useAppSelector = (0, _hooks.useAppSelector)(state => (0, _areaSelectors.selectArea)(state, props.id, isPanorama))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {},
    points = _ref7.points,
    isRange = _ref7.isRange,
    baseLine = _ref7.baseLine;
  var plotArea = (0, _hooks2.usePlotArea)();
  if (layout !== 'horizontal' && layout !== 'vertical' || plotArea == null) {
    // Can't render Area in an unsupported layout
    return null;
  }
  if (chartName !== 'AreaChart' && chartName !== 'ComposedChart') {
    // There is nothing stopping us from rendering Area in other charts, except for historical reasons. Do we want to allow that?
    return null;
  }
  var height = plotArea.height,
    width = plotArea.width,
    left = plotArea.x,
    top = plotArea.y;
  if (!points || !points.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement(AreaWithState, _extends({}, everythingElse, {
    activeDot: activeDot,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    baseLine: baseLine,
    connectNulls: connectNulls,
    dot: dot,
    fill: fill,
    fillOpacity: fillOpacity,
    height: height,
    hide: hide,
    layout: layout,
    isAnimationActive: isAnimationActive,
    isRange: isRange,
    legendType: legendType,
    needClip: needClip,
    points: points,
    stroke: stroke,
    width: width,
    left: left,
    top: top,
    xAxisId: xAxisId,
    yAxisId: yAxisId
  }));
}
var getBaseValue = (layout, chartBaseValue, itemBaseValue, xAxis, yAxis) => {
  // The baseValue can be defined both on the AreaChart, and on the Area.
  // The value for the item takes precedence.
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if ((0, _DataUtils.isNumber)(baseValue)) {
    return baseValue;
  }
  var numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  // @ts-expect-error d3scale .domain() returns unknown, Math.max expects number
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === 'number') {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === 'dataMin') {
      return domainMin;
    }
    if (baseValue === 'dataMax') {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === 'dataMin') {
    return domain[0];
  }
  if (baseValue === 'dataMax') {
    return domain[1];
  }
  return domain[0];
};
exports.getBaseValue = getBaseValue;
function computeArea(_ref8) {
  var _ref8$areaSettings = _ref8.areaSettings,
    connectNulls = _ref8$areaSettings.connectNulls,
    itemBaseValue = _ref8$areaSettings.baseValue,
    dataKey = _ref8$areaSettings.dataKey,
    stackedData = _ref8.stackedData,
    layout = _ref8.layout,
    chartBaseValue = _ref8.chartBaseValue,
    xAxis = _ref8.xAxis,
    yAxis = _ref8.yAxis,
    displayedData = _ref8.displayedData,
    dataStartIndex = _ref8.dataStartIndex,
    xAxisTicks = _ref8.xAxisTicks,
    yAxisTicks = _ref8.yAxisTicks,
    bandSize = _ref8.bandSize,
    stackDataKeys = _ref8.stackDataKeys;
  var hasStack = stackedData && stackedData.length;
  var baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
  var isHorizontalLayout = layout === 'horizontal';
  var isRange = false;
  var points = displayedData.map((entry, index) => {
    var _valueAsArray$, _valueAsArray, _xAxis$scale$map;
    var valueAsArray;
    if (hasStack) {
      valueAsArray = stackedData[dataStartIndex + index];
    } else {
      var _rawValue = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
      if (!Array.isArray(_rawValue)) {
        valueAsArray = [baseValue, _rawValue];
      } else {
        valueAsArray = _rawValue;
        isRange = true;
      }
    }
    var value1 = (_valueAsArray$ = (_valueAsArray = valueAsArray) === null || _valueAsArray === void 0 ? void 0 : _valueAsArray[1]) !== null && _valueAsArray$ !== void 0 ? _valueAsArray$ : null;
    var rawValue = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
    /*
     * A null in one series of a stack is rendered as zero contribution so the series above keep their offsets.
     * When every series in the stack is null, there is no offset to preserve,
     * so the point is a gap that connectNulls is allowed to connect across.
     */
    var wholeStackIsNull = hasStack && rawValue == null && stackDataKeys != null && stackDataKeys.length > 0 && stackDataKeys.every(key => (0, _ChartUtils.getValueByDataKey)(entry, key) == null);
    var isBreakPoint = value1 == null || hasStack && !connectNulls && rawValue == null || wholeStackIsNull;
    if (isHorizontalLayout) {
      var _yAxis$scale$map;
      return {
        x: (0, _ChartUtils.getCateCoordinateOfLine)({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : (_yAxis$scale$map = yAxis.scale.map(value1)) !== null && _yAxis$scale$map !== void 0 ? _yAxis$scale$map : null,
        value: valueAsArray,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : (_xAxis$scale$map = xAxis.scale.map(value1)) !== null && _xAxis$scale$map !== void 0 ? _xAxis$scale$map : null,
      y: (0, _ChartUtils.getCateCoordinateOfLine)({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value: valueAsArray,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map(entry => {
      var _xAxis$scale$map2;
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        var _yAxis$scale$map2;
        return {
          x: entry.x,
          y: x != null && entry.y != null ? (_yAxis$scale$map2 = yAxis.scale.map(x)) !== null && _yAxis$scale$map2 !== void 0 ? _yAxis$scale$map2 : null : null,
          payload: entry.payload
        };
      }
      return {
        x: x != null ? (_xAxis$scale$map2 = xAxis.scale.map(x)) !== null && _xAxis$scale$map2 !== void 0 ? _xAxis$scale$map2 : null : null,
        y: entry.y,
        payload: entry.payload
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale.map(baseValue) : xAxis.scale.map(baseValue);
  }
  return {
    points,
    baseLine: baseLine !== null && baseLine !== void 0 ? baseLine : 0,
    isRange
  };
}
function AreaFn(outsideProps) {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, defaultAreaProps);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  // Report all props to Redux store first, before calling hooks, to avoid circular dependencies.
  return /*#__PURE__*/React.createElement(_RegisterGraphicalItemId.RegisterGraphicalItemId, {
    id: props.id,
    type: "area"
  }, id => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SetLegendPayload.SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData(props)
  }), /*#__PURE__*/React.createElement(SetAreaTooltipEntrySettings, {
    dataKey: props.dataKey,
    data: props.data,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    unit: props.unit,
    formatter: props.formatter,
    tooltipType: props.tooltipType,
    id: id
  }), /*#__PURE__*/React.createElement(_SetGraphicalItem.SetCartesianGraphicalItem, {
    type: "area",
    id: id,
    data: props.data,
    dataKey: props.dataKey,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    stackId: (0, _ChartUtils.getNormalizedStackId)(props.stackId),
    hide: props.hide,
    barSize: undefined,
    baseValue: props.baseValue,
    isPanorama: isPanorama,
    connectNulls: props.connectNulls
  }), /*#__PURE__*/React.createElement(AreaImpl, _extends({}, props, {
    id: id
  }))));
}

/**
 * @provides LabelListContext
 * @consumes CartesianChartContext
 */
var Area = exports.Area = /*#__PURE__*/React.memo(AreaFn, _propsAreEqual.propsAreEqual);
// @ts-expect-error we need to set the displayName for debugging purposes
Area.displayName = 'Area';