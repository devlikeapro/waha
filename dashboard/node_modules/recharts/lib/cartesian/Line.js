"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Line = void 0;
exports.computeLinePoints = computeLinePoints;
exports.defaultLineProps = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _LineDrawShape = require("./LineDrawShape");
var _useAnimatedLineLength = require("./useAnimatedLineLength");
var _LabelList = require("../component/LabelList");
var _Dots = require("../component/Dots");
var _DataUtils = require("../util/DataUtils");
var _ReactUtils = require("../util/ReactUtils");
var _ChartUtils = require("../util/ChartUtils");
var _ActivePoints = require("../component/ActivePoints");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _ErrorBarContext = require("../context/ErrorBarContext");
var _GraphicalItemClipPath = require("./GraphicalItemClipPath");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _PanoramaContext = require("../context/PanoramaContext");
var _lineSelectors = require("../state/selectors/lineSelectors");
var _hooks = require("../state/hooks");
var _SetLegendPayload = require("../state/SetLegendPayload");
var _AnimatedItems = require("../animation/AnimatedItems");
var _matchBy = require("../animation/matchBy");
var _resolveDefaultProps2 = require("../util/resolveDefaultProps");
var _hooks2 = require("../hooks");
var _RegisterGraphicalItemId = require("../context/RegisterGraphicalItemId");
var _SetGraphicalItem = require("../state/SetGraphicalItem");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _svgPropertiesAndEvents = require("../util/svgPropertiesAndEvents");
var _getRadiusAndStrokeWidthFromDot = require("../util/getRadiusAndStrokeWidthFromDot");
var _ActiveShapeUtils = require("../util/ActiveShapeUtils");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _propsAreEqual = require("../util/propsAreEqual");
var _excluded = ["id"],
  _excluded2 = ["type", "layout", "connectNulls", "needClip", "shape", "strokeDasharray"],
  _excluded3 = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];
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
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

function getTotalLength(mainCurve) {
  try {
    return mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength() || 0;
  } catch (_unused) {
    return 0;
  }
}

/**
 * Compute the average x-shift between matched pairs (prev → next).
 * This tells us the overall direction and magnitude of the data movement.
 */
function averageShift(items) {
  var total = 0;
  var count = 0;
  for (var item of items) {
    if (item.status === 'matched' && item.prev.x != null && item.next.x != null) {
      total += item.next.x - item.prev.x;
      count++;
    }
  }
  return count > 0 ? total / count : 0;
}
var defaultLineAnimateItems = (items, animationElapsedTime) => {
  if (items == null) {
    // First render: return empty, stroke-dasharray handles the reveal
    return [];
  }
  // At animationElapsedTime=1 return only the non-removed items
  if (animationElapsedTime === 1) return items.flatMap(item => item.status === 'removed' ? [] : [item.next]);
  var shift = averageShift(items);
  var result = [];
  for (var item of items) {
    if (item.status === 'matched') {
      result.push(_objectSpread(_objectSpread({}, item.next), {}, {
        x: (0, _DataUtils.interpolate)(item.prev.x, item.next.x, animationElapsedTime),
        y: (0, _DataUtils.interpolate)(item.prev.y, item.next.y, animationElapsedTime)
      }));
    } else if (item.status === 'added') {
      if (item.next.x != null) {
        // Extrapolate entry position: the point starts where it "would have been"
        var entryX = item.next.x - shift;
        result.push(_objectSpread(_objectSpread({}, item.next), {}, {
          x: (0, _DataUtils.interpolate)(entryX, item.next.x, animationElapsedTime),
          y: item.next.y
        }));
      } else {
        result.push(item.next);
      }
    } else if (item.status === 'removed') {
      if (item.prev.x != null) {
        var exitX = item.prev.x + shift;
        result.push(_objectSpread(_objectSpread({}, item.prev), {}, {
          x: (0, _DataUtils.interpolate)(item.prev.x, exitX, animationElapsedTime),
          y: item.prev.y
        }));
      }
      // else: removed items are simply dropped
    }
  }
  return result;
};
var defaultLineProps = exports.defaultLineProps = {
  activeDot: true,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  animationInterpolateFn: defaultLineAnimateItems,
  animationMatchBy: _matchBy.matchByIndex,
  connectNulls: false,
  dot: true,
  fill: '#fff',
  hide: false,
  isAnimationActive: 'auto',
  label: false,
  legendType: 'line',
  shape: _LineDrawShape.LineDrawShape,
  stroke: '#3182bd',
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: _DefaultZIndexes.DefaultZIndexes.line,
  type: 'linear'
};

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

var computeLegendPayloadFromAreaData = props => {
  var dataKey = props.dataKey,
    name = props.name,
    stroke = props.stroke,
    legendType = props.legendType,
    hide = props.hide;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: stroke,
    value: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
    payload: props
  }];
};
var SetLineTooltipEntrySettings = /*#__PURE__*/React.memo(_ref => {
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
      color: stroke,
      unit,
      formatter,
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});
function LineDotsWrapper(_ref2) {
  var clipPathId = _ref2.clipPathId,
    points = _ref2.points,
    props = _ref2.props;
  var dot = props.dot,
    dataKey = props.dataKey,
    needClip = props.needClip;

  /*
   * Exclude ID from the props passed to the Dots component
   * because then the ID would be applied to multiple dots, and it would no longer be unique.
   */
  var id = props.id,
    propsWithoutId = _objectWithoutProperties(props, _excluded);
  var lineProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(propsWithoutId);
  return /*#__PURE__*/React.createElement(_Dots.Dots, {
    points: points,
    dot: dot,
    className: "recharts-line-dots",
    dotClassName: "recharts-line-dot",
    dataKey: dataKey,
    baseProps: lineProps,
    needClip: needClip,
    clipPathId: clipPathId
  });
}
function LineLabelListProvider(_ref3) {
  var showLabels = _ref3.showLabels,
    children = _ref3.children,
    points = _ref3.points;
  var labelListEntries = (0, _react.useMemo)(() => {
    return points === null || points === void 0 ? void 0 : points.map(point => {
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
        viewBox,
        /*
         * Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
         * Or should this just be the root chart viewBox?
         */
        parentViewBox: undefined,
        fill: undefined
      });
    });
  }, [points]);
  return /*#__PURE__*/React.createElement(_LabelList.CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : undefined
  }, children);
}
function StaticCurve(_ref4) {
  var clipPathId = _ref4.clipPathId,
    pathRef = _ref4.pathRef,
    points = _ref4.points,
    props = _ref4.props,
    animationElapsedTime = _ref4.animationElapsedTime,
    isAnimating = _ref4.isAnimating,
    isEntrance = _ref4.isEntrance,
    visibleLength = _ref4.visibleLength;
  var type = props.type,
    layout = props.layout,
    connectNulls = props.connectNulls,
    needClip = props.needClip,
    shape = props.shape,
    strokeDasharray = props.strokeDasharray,
    others = _objectWithoutProperties(props, _excluded2);
  var curveProps = _objectSpread(_objectSpread({}, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(others)), {}, {
    fill: 'none',
    className: 'recharts-line-curve',
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : undefined,
    points,
    type,
    layout,
    connectNulls,
    strokeDasharray: strokeDasharray !== null && strokeDasharray !== void 0 ? strokeDasharray : props.strokeDasharray,
    pathRef,
    animationElapsedTime,
    isAnimating,
    isEntrance: props.animateNewValues ? isEntrance : false,
    visibleLength
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, {
    option: shape,
    DefaultShape: defaultLineProps.shape,
    shapeProps: curveProps
  }), /*#__PURE__*/React.createElement(LineDotsWrapper, {
    points: points,
    clipPathId: clipPathId,
    props: props
  }));
}
function CurveWithAnimation(_ref5) {
  var clipPathId = _ref5.clipPathId,
    props = _ref5.props,
    pathRef = _ref5.pathRef,
    previousPointsRef = _ref5.previousPointsRef;
  var points = props.points,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    animationMatchBy = props.animationMatchBy,
    animationInterpolateFn = props.animationInterpolateFn,
    layout = props.layout;
  var totalLength = getTotalLength(pathRef.current);
  var _useAnimationCallback = (0, _AnimatedItems.useAnimationCallbacks)(props.onAnimationStart, props.onAnimationEnd),
    isAnimating = _useAnimationCallback.isAnimating,
    handleAnimationStart = _useAnimationCallback.handleAnimationStart,
    handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
  var showLabels = !isAnimating;
  var getVisibleLength = (0, _useAnimatedLineLength.useAnimatedLineLength)(points);

  // Guard for totalLength: don't update previousPointsRef before SVG path is measured
  var shouldUpdatePreviousRef = (0, _react.useCallback)(animationElapsedTime => animationElapsedTime > 0 && totalLength > 0, [totalLength]);
  return /*#__PURE__*/React.createElement(LineLabelListProvider, {
    points: points,
    showLabels: showLabels
  }, props.children, /*#__PURE__*/React.createElement(_AnimatedItems.AnimatedItems, {
    animationInput: points,
    animationIdPrefix: "recharts-line-",
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
    shouldUpdatePreviousRef: shouldUpdatePreviousRef,
    layout: layout
  }, (stepData, animationElapsedTime, isEntrance) => {
    var animationActive = isAnimating || animationElapsedTime < 1;
    var visibleLength = animationActive ? getVisibleLength(animationElapsedTime, totalLength) : null;
    return /*#__PURE__*/React.createElement(StaticCurve, {
      props: props,
      points: stepData,
      clipPathId: clipPathId,
      pathRef: pathRef,
      animationElapsedTime: animationElapsedTime,
      isAnimating: animationActive,
      isEntrance: isEntrance,
      visibleLength: visibleLength
    });
  }), /*#__PURE__*/React.createElement(_LabelList.LabelListFromLabelProp, {
    label: props.label
  }));
}
function RenderCurve(_ref6) {
  var clipPathId = _ref6.clipPathId,
    props = _ref6.props;
  var previousPointsRef = (0, _react.useRef)(null);
  var pathRef = (0, _react.useRef)(null);
  return /*#__PURE__*/React.createElement(CurveWithAnimation, {
    props: props,
    clipPathId: clipPathId,
    previousPointsRef: previousPointsRef,
    pathRef: pathRef
  });
}
var errorBarDataPointFormatter = (dataPoint, dataKey) => {
  var _dataPoint$x, _dataPoint$y;
  return {
    x: (_dataPoint$x = dataPoint.x) !== null && _dataPoint$x !== void 0 ? _dataPoint$x : undefined,
    y: (_dataPoint$y = dataPoint.y) !== null && _dataPoint$y !== void 0 ? _dataPoint$y : undefined,
    value: dataPoint.value,
    // getValueByDataKey does not validate the output type
    errorVal: (0, _ChartUtils.getValueByDataKey)(dataPoint.payload, dataKey)
  };
};

// eslint-disable-next-line react/prefer-stateless-function
class LineWithState extends _react.Component {
  render() {
    var _this$props = this.props,
      hide = _this$props.hide,
      dot = _this$props.dot,
      points = _this$props.points,
      className = _this$props.className,
      xAxisId = _this$props.xAxisId,
      yAxisId = _this$props.yAxisId,
      top = _this$props.top,
      left = _this$props.left,
      width = _this$props.width,
      height = _this$props.height,
      id = _this$props.id,
      needClip = _this$props.needClip,
      zIndex = _this$props.zIndex;
    if (hide) {
      return null;
    }
    var layerClass = (0, _clsx.clsx)('recharts-line', className);
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
    }))), /*#__PURE__*/React.createElement(_ErrorBarContext.SetErrorBarContext, {
      xAxisId: xAxisId,
      yAxisId: yAxisId,
      data: points,
      dataPointFormatter: errorBarDataPointFormatter,
      errorBarOffset: 0
    }, /*#__PURE__*/React.createElement(RenderCurve, {
      props: this.props,
      clipPathId: clipPathId
    }))), /*#__PURE__*/React.createElement(_ActivePoints.ActivePoints, {
      activeDot: this.props.activeDot,
      points: points,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey,
      clipPath: activePointsClipPath
    }));
  }
}
function LineImpl(props) {
  var _resolveDefaultProps = (0, _resolveDefaultProps2.resolveDefaultProps)(props, defaultLineProps),
    activeDot = _resolveDefaultProps.activeDot,
    animateNewValues = _resolveDefaultProps.animateNewValues,
    animationBegin = _resolveDefaultProps.animationBegin,
    animationDuration = _resolveDefaultProps.animationDuration,
    animationEasing = _resolveDefaultProps.animationEasing,
    connectNulls = _resolveDefaultProps.connectNulls,
    dot = _resolveDefaultProps.dot,
    hide = _resolveDefaultProps.hide,
    isAnimationActive = _resolveDefaultProps.isAnimationActive,
    label = _resolveDefaultProps.label,
    legendType = _resolveDefaultProps.legendType,
    xAxisId = _resolveDefaultProps.xAxisId,
    yAxisId = _resolveDefaultProps.yAxisId,
    id = _resolveDefaultProps.id,
    everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded3);
  var _useNeedsClip = (0, _GraphicalItemClipPath.useNeedsClip)(xAxisId, yAxisId),
    needClip = _useNeedsClip.needClip;
  var plotArea = (0, _hooks2.usePlotArea)();
  var layout = (0, _chartLayoutContext.useChartLayout)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var points = (0, _hooks.useAppSelector)(state => (0, _lineSelectors.selectLinePoints)(state, xAxisId, yAxisId, isPanorama, id));
  if (layout !== 'horizontal' && layout !== 'vertical' || points == null || plotArea == null) {
    // Cannot render Line in an unsupported layout
    return null;
  }
  var height = plotArea.height,
    width = plotArea.width,
    left = plotArea.x,
    top = plotArea.y;
  return /*#__PURE__*/React.createElement(LineWithState, _extends({}, everythingElse, {
    id: id,
    connectNulls: connectNulls,
    dot: dot,
    activeDot: activeDot,
    animateNewValues: animateNewValues,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    hide: hide,
    label: label,
    legendType: legendType,
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    points: points,
    layout: layout,
    height: height,
    width: width,
    left: left,
    top: top,
    needClip: needClip
  }));
}
function computeLinePoints(_ref7) {
  var layout = _ref7.layout,
    xAxis = _ref7.xAxis,
    yAxis = _ref7.yAxis,
    xAxisTicks = _ref7.xAxisTicks,
    yAxisTicks = _ref7.yAxisTicks,
    dataKey = _ref7.dataKey,
    bandSize = _ref7.bandSize,
    displayedData = _ref7.displayedData;
  return displayedData.map((entry, index) => {
    // getValueByDataKey does not validate the output type
    var value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
    if (layout === 'horizontal') {
      var _x = (0, _ChartUtils.getCateCoordinateOfLine)({
        axis: xAxis,
        ticks: xAxisTicks,
        bandSize,
        entry,
        index
      });
      var _y = (0, _DataUtils.isNullish)(value) ? null : yAxis.scale.map(value);
      return {
        x: _x,
        y: _y !== null && _y !== void 0 ? _y : null,
        value,
        payload: entry
      };
    }
    var x = (0, _DataUtils.isNullish)(value) ? null : xAxis.scale.map(value);
    var y = (0, _ChartUtils.getCateCoordinateOfLine)({
      axis: yAxis,
      ticks: yAxisTicks,
      bandSize,
      entry,
      index
    });
    if (x == null || y == null) {
      return null;
    }
    return {
      x,
      y,
      value,
      payload: entry
    };
  }).filter(Boolean);
}
function LineFn(outsideProps) {
  var props = (0, _resolveDefaultProps2.resolveDefaultProps)(outsideProps, defaultLineProps);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return /*#__PURE__*/React.createElement(_RegisterGraphicalItemId.RegisterGraphicalItemId, {
    id: props.id,
    type: "line"
  }, id => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SetLegendPayload.SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData(props)
  }), /*#__PURE__*/React.createElement(SetLineTooltipEntrySettings, {
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
    type: "line",
    id: id,
    data: props.data,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    dataKey: props.dataKey,
    hide: props.hide,
    isPanorama: isPanorama
  }), /*#__PURE__*/React.createElement(LineImpl, _extends({}, props, {
    id: id
  }))));
}

/**
 * @provides LabelListContext
 * @provides ErrorBarContext
 * @consumes CartesianChartContext
 */
var Line = exports.Line = /*#__PURE__*/React.memo(LineFn, _propsAreEqual.propsAreEqual);
// @ts-expect-error we need to set the displayName for debugging purposes
Line.displayName = 'Line';