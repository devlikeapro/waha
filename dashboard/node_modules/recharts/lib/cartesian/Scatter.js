"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scatter = void 0;
exports.computeScatterPoints = computeScatterPoints;
exports.defaultScatterProps = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _ReactUtils = require("../util/ReactUtils");
var _Curve = require("../shape/Curve");
var _Cell = require("../component/Cell");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _ScatterUtils = require("../util/ScatterUtils");
var _tooltipContext = require("../context/tooltipContext");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _ErrorBarContext = require("../context/ErrorBarContext");
var _GraphicalItemClipPath = require("./GraphicalItemClipPath");
var _scatterSelectors = require("../state/selectors/scatterSelectors");
var _hooks = require("../state/hooks");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _PanoramaContext = require("../context/PanoramaContext");
var _tooltipSelectors = require("../state/selectors/tooltipSelectors");
var _SetLegendPayload = require("../state/SetLegendPayload");
var _Constants = require("../util/Constants");
var _resolveDefaultProps2 = require("../util/resolveDefaultProps");
var _RegisterGraphicalItemId = require("../context/RegisterGraphicalItemId");
var _SetGraphicalItem = require("../state/SetGraphicalItem");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _AnimatedItems = require("../animation/AnimatedItems");
var _matchBy = require("../animation/matchBy");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _propsAreEqual = require("../util/propsAreEqual");
var _excluded = ["id"],
  _excluded2 = ["onMouseEnter", "onClick", "onMouseLeave"],
  _excluded3 = ["animationBegin", "animationDuration", "animationEasing", "hide", "isAnimationActive", "legendType", "lineJointType", "lineType", "shape", "xAxisId", "yAxisId", "zAxisId"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Scatter coordinates are nullable because sometimes the point value is out of the domain,
 * and we can't compute a valid coordinate for it.
 *
 * Scatter -> Symbol ignores points with null cx or cy so those won't render if using the default shapes.
 * However: the points are exposed via various props and can be used in custom shapes so we keep them around.
 */

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

var computeLegendPayloadFromScatterProps = props => {
  var dataKey = props.dataKey,
    name = props.name,
    fill = props.fill,
    legendType = props.legendType,
    hide = props.hide;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: fill,
    value: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
    payload: props
  }];
};
var SetScatterTooltipEntrySettings = /*#__PURE__*/React.memo(_ref => {
  var dataKey = _ref.dataKey,
    points = _ref.points,
    stroke = _ref.stroke,
    strokeWidth = _ref.strokeWidth,
    fill = _ref.fill,
    name = _ref.name,
    hide = _ref.hide,
    formatter = _ref.formatter,
    tooltipType = _ref.tooltipType,
    id = _ref.id;
  var tooltipEntrySettings = {
    dataDefinedOnItem: points === null || points === void 0 ? void 0 : points.map(p => p.tooltipPayload),
    getPosition: index => {
      var _points$Number;
      return points === null || points === void 0 || (_points$Number = points[Number(index)]) === null || _points$Number === void 0 ? void 0 : _points$Number.tooltipPosition;
    },
    settings: {
      stroke,
      strokeWidth,
      fill,
      nameKey: undefined,
      dataKey,
      name: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
      hide,
      type: tooltipType,
      color: fill,
      unit: '',
      // why doesn't Scatter support unit?
      formatter,
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});
function ScatterLine(_ref2) {
  var points = _ref2.points,
    props = _ref2.props;
  var line = props.line,
    lineType = props.lineType,
    lineJointType = props.lineJointType;
  if (!line) {
    return null;
  }
  var scatterProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(props);
  var customLineProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEventsFromUnknown)(line);
  var linePoints, lineItem;
  if (lineType === 'joint') {
    linePoints = points.map(entry => {
      var _entry$cx, _entry$cy;
      return {
        x: (_entry$cx = entry.cx) !== null && _entry$cx !== void 0 ? _entry$cx : null,
        y: (_entry$cy = entry.cy) !== null && _entry$cy !== void 0 ? _entry$cy : null
      };
    });
  } else if (lineType === 'fitting') {
    var _getLinearRegression = (0, _DataUtils.getLinearRegression)(points),
      xmin = _getLinearRegression.xmin,
      xmax = _getLinearRegression.xmax,
      a = _getLinearRegression.a,
      b = _getLinearRegression.b;
    var linearExp = x => a * x + b;
    linePoints = [{
      x: xmin,
      y: linearExp(xmin)
    }, {
      x: xmax,
      y: linearExp(xmax)
    }];
  }
  var lineProps = _objectSpread(_objectSpread(_objectSpread({}, scatterProps), {}, {
    // @ts-expect-error customLineProps is contributing unknown props
    fill: 'none',
    // @ts-expect-error customLineProps is contributing unknown props
    stroke: scatterProps && scatterProps.fill
  }, customLineProps), {}, {
    // @ts-expect-error linePoints is used before it is assigned (???)
    points: linePoints
  });
  if (/*#__PURE__*/React.isValidElement(line)) {
    lineItem = /*#__PURE__*/React.cloneElement(line, lineProps);
  } else if (typeof line === 'function') {
    lineItem = line(lineProps);
  } else {
    lineItem = /*#__PURE__*/React.createElement(_Curve.Curve, _extends({}, lineProps, {
      type: lineJointType
    }));
  }
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: "recharts-scatter-line",
    key: "recharts-scatter-line"
  }, lineItem);
}
function ScatterLabelListProvider(_ref3) {
  var showLabels = _ref3.showLabels,
    points = _ref3.points,
    children = _ref3.children;
  var chartViewBox = (0, _chartLayoutContext.useViewBox)();
  var labelListEntries = (0, _react.useMemo)(() => {
    return points === null || points === void 0 ? void 0 : points.map(point => {
      var _point$x, _point$y;
      var viewBox = {
        /*
         * Scatter label uses x and y as the reference point for the label,
         * not cx and cy.
         */
        x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
        /*
         * Scatter label uses x and y as the reference point for the label,
         * not cx and cy.
         */
        y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
        width: point.width,
        height: point.height,
        lowerWidth: point.width,
        upperWidth: point.width
      };
      return _objectSpread(_objectSpread({}, viewBox), {}, {
        /*
         * Here we put undefined because Scatter shows two values usually, one for X and one for Y.
         * LabelList will see this undefined and will use its own `dataKey` prop to determine which value to show,
         * using the payload below.
         */
        value: undefined,
        payload: point.payload,
        viewBox,
        parentViewBox: chartViewBox,
        fill: undefined
      });
    });
  }, [chartViewBox, points]);
  return /*#__PURE__*/React.createElement(_LabelList.CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : undefined
  }, children);
}

/**
 * Individual scatter point component that subscribes to its own isActive state.
 * This avoids re-rendering all points when the active index changes —
 * only the point becoming active and the point becoming inactive re-render.
 *
 * @param entry The scatter point data including coordinates, size, and tooltip payload
 * @param index The index of this point in the points array
 * @param shape The default shape to render for inactive points
 * @param activeShape The shape to render when this point is active, or undefined if no active shape
 * @param baseProps SVG presentation attributes (fill, stroke, etc.) shared across all points
 * @param id The graphical item ID of the parent Scatter component
 * @param restOfAllOtherProps Remaining Scatter props for user-provided event handlers via adaptEventsOfChild
 * @param onMouseEnterFromContext Curried mouse enter handler that dispatches tooltip activation
 * @param onMouseLeaveFromContext Curried mouse leave handler that dispatches tooltip deactivation
 * @param onClickFromContext Curried click handler that dispatches tooltip click activation
 */
function ScatterPoint(_ref4) {
  var _useAppSelector;
  var entry = _ref4.entry,
    index = _ref4.index,
    shape = _ref4.shape,
    activeShape = _ref4.activeShape,
    baseProps = _ref4.baseProps,
    id = _ref4.id,
    restOfAllOtherProps = _ref4.restOfAllOtherProps,
    animationElapsedTime = _ref4.animationElapsedTime,
    isAnimating = _ref4.isAnimating,
    isEntrance = _ref4.isEntrance,
    onMouseEnterFromContext = _ref4.onMouseEnterFromContext,
    onMouseLeaveFromContext = _ref4.onMouseLeaveFromContext,
    onClickFromContext = _ref4.onClickFromContext;
  var hasActiveShape = activeShape != null && activeShape !== false;
  var selectIsActive = (0, _react.useMemo)(() => {
    var strIndex = String(index);
    return state => hasActiveShape && (0, _tooltipSelectors.selectActiveTooltipIndex)(state) === strIndex;
  }, [hasActiveShape, index]);
  var isActive = (_useAppSelector = (0, _hooks.useAppSelector)(selectIsActive)) !== null && _useAppSelector !== void 0 ? _useAppSelector : false;

  // isActive is only true when hasActiveShape is true, so activeShape is defined here
  var option = isActive && activeShape != null && activeShape !== false ? activeShape : shape;
  var symbolProps = _objectSpread(_objectSpread(_objectSpread({}, baseProps), entry), {}, {
    isActive,
    index,
    animationElapsedTime,
    isAnimating,
    isEntrance,
    [_Constants.DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: String(id)
  });
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer
  /*
   * inactive Scatters use the parent zIndex, which is represented by undefined here.
   * ZIndexLayer will render undefined zIndex as-is, as regular children, without portals.
   * Active Scatters use the activeDot zIndex so they render above other elements.
   */, {
    zIndex: isActive ? _DefaultZIndexes.DefaultZIndexes.activeDot : undefined
  }, /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
    className: "recharts-scatter-symbol"
  }, (0, _types.adaptEventsOfChild)(restOfAllOtherProps, entry, index), {
    onMouseEnter: onMouseEnterFromContext(entry, index),
    onMouseLeave: onMouseLeaveFromContext(entry, index),
    onClick: onClickFromContext(entry, index)
  }), /*#__PURE__*/React.createElement(_ScatterUtils.ScatterSymbol, _extends({
    option: option
  }, symbolProps))));
}
function ScatterSymbols(props) {
  var points = props.points,
    allOtherScatterProps = props.allOtherScatterProps,
    animationElapsedTime = props.animationElapsedTime,
    isAnimating = props.isAnimating,
    isEntrance = props.isEntrance;
  var shape = allOtherScatterProps.shape,
    activeShape = allOtherScatterProps.activeShape,
    dataKey = allOtherScatterProps.dataKey;
  var id = allOtherScatterProps.id,
    allOtherPropsWithoutId = _objectWithoutProperties(allOtherScatterProps, _excluded);
  var onMouseEnterFromProps = allOtherScatterProps.onMouseEnter,
    onItemClickFromProps = allOtherScatterProps.onClick,
    onMouseLeaveFromProps = allOtherScatterProps.onMouseLeave,
    restOfAllOtherProps = _objectWithoutProperties(allOtherScatterProps, _excluded2);
  var onMouseEnterFromContext = (0, _tooltipContext.useMouseEnterItemDispatch)(onMouseEnterFromProps, dataKey, id);
  var onMouseLeaveFromContext = (0, _tooltipContext.useMouseLeaveItemDispatch)(onMouseLeaveFromProps);
  var onClickFromContext = (0, _tooltipContext.useMouseClickItemDispatch)(onItemClickFromProps, dataKey, id);
  if (!(0, _types.isNonEmptyArray)(points)) {
    return null;
  }
  var baseProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(allOtherPropsWithoutId);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ScatterLine, {
    points: points,
    props: allOtherPropsWithoutId
  }), points.map((entry, i) => /*#__PURE__*/React.createElement(ScatterPoint, {
    key: "symbol-".concat(entry === null || entry === void 0 ? void 0 : entry.cx, "-").concat(entry === null || entry === void 0 ? void 0 : entry.cy, "-").concat(entry === null || entry === void 0 ? void 0 : entry.size, "-").concat(i),
    entry: entry,
    index: i,
    shape: shape,
    activeShape: activeShape,
    baseProps: baseProps,
    id: id,
    restOfAllOtherProps: restOfAllOtherProps,
    animationElapsedTime: animationElapsedTime,
    isAnimating: isAnimating,
    isEntrance: isEntrance,
    onMouseEnterFromContext: onMouseEnterFromContext,
    onMouseLeaveFromContext: onMouseLeaveFromContext,
    onClickFromContext: onClickFromContext
  })));
}
var defaultScatterAnimateItems = (items, animationElapsedTime) => {
  if (items == null) return [];
  if (animationElapsedTime === 1) {
    return items.flatMap(item => item.status === 'removed' ? [] : [item.next]);
  }
  return items.flatMap(item => {
    if (item.status === 'removed') return [];
    if (item.status === 'matched') {
      return [_objectSpread(_objectSpread({}, item.next), {}, {
        cx: item.next.cx == null ? undefined : (0, _DataUtils.interpolate)(item.prev.cx, item.next.cx, animationElapsedTime),
        cy: item.next.cy == null ? undefined : (0, _DataUtils.interpolate)(item.prev.cy, item.next.cy, animationElapsedTime),
        size: (0, _DataUtils.interpolate)(item.prev.size, item.next.size, animationElapsedTime)
      })];
    }
    // added
    return [_objectSpread(_objectSpread({}, item.next), {}, {
      size: (0, _DataUtils.interpolate)(0, item.next.size, animationElapsedTime)
    })];
  });
};
function SymbolsWithAnimation(_ref5) {
  var previousPointsRef = _ref5.previousPointsRef,
    props = _ref5.props;
  var points = props.points,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    animationInterpolateFn = props.animationInterpolateFn;
  var _useAnimationCallback = (0, _AnimatedItems.useAnimationCallbacks)(),
    isAnimating = _useAnimationCallback.isAnimating,
    handleAnimationStart = _useAnimationCallback.handleAnimationStart,
    handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
  var layout = (0, _chartLayoutContext.useCartesianChartLayout)();
  if (layout == null) return null;
  return /*#__PURE__*/React.createElement(ScatterLabelListProvider, {
    showLabels: !isAnimating,
    points: points
  }, /*#__PURE__*/React.createElement(_AnimatedItems.AnimatedItems, {
    animationInput: props,
    animationIdPrefix: "recharts-scatter-",
    items: points,
    previousItemsRef: previousPointsRef,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    animationInterpolateFn: animationInterpolateFn,
    animationMatchBy: props.animationMatchBy,
    layout: layout
  }, (stepData, animationElapsedTime, isEntrance) => /*#__PURE__*/React.createElement(_Layer.Layer, null, /*#__PURE__*/React.createElement(ScatterSymbols, {
    points: stepData,
    allOtherScatterProps: props,
    showLabels: !isAnimating,
    animationElapsedTime: animationElapsedTime,
    isAnimating: isAnimating || animationElapsedTime < 1,
    isEntrance: isEntrance
  }))), props.children, /*#__PURE__*/React.createElement(_LabelList.LabelListFromLabelProp, {
    label: props.label
  }));
}
function computeScatterPoints(_ref6) {
  var displayedData = _ref6.displayedData,
    xAxis = _ref6.xAxis,
    yAxis = _ref6.yAxis,
    zAxis = _ref6.zAxis,
    scatterSettings = _ref6.scatterSettings,
    xAxisTicks = _ref6.xAxisTicks,
    yAxisTicks = _ref6.yAxisTicks,
    cells = _ref6.cells;
  var xAxisDataKey = (0, _DataUtils.isNullish)(xAxis.dataKey) ? scatterSettings.dataKey : xAxis.dataKey;
  var yAxisDataKey = (0, _DataUtils.isNullish)(yAxis.dataKey) ? scatterSettings.dataKey : yAxis.dataKey;
  var zAxisDataKey = zAxis && zAxis.dataKey;
  var defaultRangeZ = zAxis ? zAxis.range : _axisSelectors.implicitZAxis.range;
  var defaultZ = defaultRangeZ && defaultRangeZ[0];
  var xBandSize = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 0;
  var yBandSize = yAxis.scale.bandwidth ? yAxis.scale.bandwidth() : 0;
  return displayedData.map((entry, index) => {
    var x = (0, _ChartUtils.getValueByDataKey)(entry, xAxisDataKey);
    var y = (0, _ChartUtils.getValueByDataKey)(entry, yAxisDataKey);
    var z = !(0, _DataUtils.isNullish)(zAxisDataKey) && (0, _ChartUtils.getValueByDataKey)(entry, zAxisDataKey) || '-';
    var tooltipPayload = [{
      name: (0, _DataUtils.isNullish)(xAxis.dataKey) ? scatterSettings.name : xAxis.name || String(xAxis.dataKey),
      unit: xAxis.unit || '',
      // @ts-expect-error getValueByDataKey does not validate the output type
      value: x,
      payload: entry,
      dataKey: xAxisDataKey,
      type: scatterSettings.tooltipType,
      graphicalItemId: scatterSettings.id
    }, {
      name: (0, _DataUtils.isNullish)(yAxis.dataKey) ? scatterSettings.name : yAxis.name || String(yAxis.dataKey),
      unit: yAxis.unit || '',
      // @ts-expect-error getValueByDataKey does not validate the output type
      value: y,
      payload: entry,
      dataKey: yAxisDataKey,
      type: scatterSettings.tooltipType,
      graphicalItemId: scatterSettings.id
    }];
    if (z !== '-' && zAxis != null) {
      tooltipPayload.push({
        // @ts-expect-error name prop should not have dataKey in it
        name: zAxis.name || zAxis.dataKey,
        unit: zAxis.unit || '',
        // @ts-expect-error getValueByDataKey does not validate the output type
        value: z,
        payload: entry,
        dataKey: zAxisDataKey,
        type: scatterSettings.tooltipType,
        graphicalItemId: scatterSettings.id
      });
    }
    var cx = (0, _ChartUtils.getCateCoordinateOfLine)({
      axis: xAxis,
      ticks: xAxisTicks,
      bandSize: xBandSize,
      entry,
      index,
      dataKey: xAxisDataKey
    });
    var cy = (0, _ChartUtils.getCateCoordinateOfLine)({
      axis: yAxis,
      ticks: yAxisTicks,
      bandSize: yBandSize,
      entry,
      index,
      dataKey: yAxisDataKey
    });
    var size = z !== '-' && zAxis != null ? zAxis.scale.map(z) : defaultZ;
    var radius = size == null ? 0 : Math.sqrt(Math.max(size, 0) / Math.PI);
    return _objectSpread(_objectSpread({}, entry), {}, {
      cx,
      cy,
      x: cx == null ? undefined : cx - radius,
      y: cy == null ? undefined : cy - radius,
      width: 2 * radius,
      height: 2 * radius,
      size,
      node: {
        x,
        y,
        z
      },
      tooltipPayload,
      tooltipPosition: {
        x: cx,
        y: cy
      },
      payload: entry
    }, cells && cells[index] && cells[index].props);
  });
}
var errorBarDataPointFormatter = (dataPoint, dataKey, direction) => {
  return {
    x: dataPoint.cx,
    y: dataPoint.cy,
    value: direction === 'x' ? Number(dataPoint.node.x) : Number(dataPoint.node.y),
    // @ts-expect-error getValueByDataKey does not validate the output type
    errorVal: (0, _ChartUtils.getValueByDataKey)(dataPoint, dataKey)
  };
};
function ScatterWithId(props) {
  var hide = props.hide,
    points = props.points,
    className = props.className,
    needClip = props.needClip,
    xAxisId = props.xAxisId,
    yAxisId = props.yAxisId,
    id = props.id;
  var previousPointsRef = (0, _react.useRef)(null);
  if (hide) {
    return null;
  }
  var layerClass = (0, _clsx.clsx)('recharts-scatter', className);
  var clipPathId = id;
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: layerClass,
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : undefined,
    id: id
  }, needClip && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(_GraphicalItemClipPath.GraphicalItemClipPath, {
    clipPathId: clipPathId,
    xAxisId: xAxisId,
    yAxisId: yAxisId
  })), /*#__PURE__*/React.createElement(_ErrorBarContext.SetErrorBarContext, {
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    data: points,
    dataPointFormatter: errorBarDataPointFormatter,
    errorBarOffset: 0
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    key: "recharts-scatter-symbols"
  }, /*#__PURE__*/React.createElement(SymbolsWithAnimation, {
    props: props,
    previousPointsRef: previousPointsRef
  })))));
}
var defaultScatterProps = exports.defaultScatterProps = {
  xAxisId: 0,
  yAxisId: 0,
  zAxisId: 0,
  label: false,
  line: false,
  legendType: 'circle',
  lineType: 'joint',
  lineJointType: 'linear',
  shape: 'circle',
  hide: false,
  isAnimationActive: 'auto',
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'linear',
  animationMatchBy: _matchBy.matchAppend,
  animationInterpolateFn: defaultScatterAnimateItems,
  zIndex: _DefaultZIndexes.DefaultZIndexes.scatter
};
function ScatterImpl(props) {
  var _resolveDefaultProps = (0, _resolveDefaultProps2.resolveDefaultProps)(props, defaultScatterProps),
    animationBegin = _resolveDefaultProps.animationBegin,
    animationDuration = _resolveDefaultProps.animationDuration,
    animationEasing = _resolveDefaultProps.animationEasing,
    hide = _resolveDefaultProps.hide,
    isAnimationActive = _resolveDefaultProps.isAnimationActive,
    legendType = _resolveDefaultProps.legendType,
    lineJointType = _resolveDefaultProps.lineJointType,
    lineType = _resolveDefaultProps.lineType,
    shape = _resolveDefaultProps.shape,
    xAxisId = _resolveDefaultProps.xAxisId,
    yAxisId = _resolveDefaultProps.yAxisId,
    zAxisId = _resolveDefaultProps.zAxisId,
    everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded3);
  var _useNeedsClip = (0, _GraphicalItemClipPath.useNeedsClip)(xAxisId, yAxisId),
    needClip = _useNeedsClip.needClip;
  var cells = (0, _react.useMemo)(() => (0, _ReactUtils.findAllByType)(props.children, _Cell.Cell), [props.children]);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var points = (0, _hooks.useAppSelector)(state => {
    return (0, _scatterSelectors.selectScatterPoints)(state, xAxisId, yAxisId, zAxisId, props.id, cells, isPanorama);
  });
  if (needClip == null) {
    return null;
  }
  if (points == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetScatterTooltipEntrySettings, {
    dataKey: props.dataKey,
    points: points,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    formatter: props.formatter,
    tooltipType: props.tooltipType,
    id: props.id
  }), /*#__PURE__*/React.createElement(ScatterWithId, _extends({}, everythingElse, {
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    zAxisId: zAxisId,
    lineType: lineType,
    lineJointType: lineJointType,
    legendType: legendType,
    shape: shape,
    hide: hide,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    points: points,
    needClip: needClip
  })));
}
function ScatterFn(outsideProps) {
  var props = (0, _resolveDefaultProps2.resolveDefaultProps)(outsideProps, defaultScatterProps);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return /*#__PURE__*/React.createElement(_RegisterGraphicalItemId.RegisterGraphicalItemId, {
    id: props.id,
    type: "scatter"
  }, id => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SetLegendPayload.SetLegendPayload, {
    legendPayload: computeLegendPayloadFromScatterProps(props)
  }), /*#__PURE__*/React.createElement(_SetGraphicalItem.SetCartesianGraphicalItem, {
    type: "scatter",
    id: id,
    data: props.data,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: props.zAxisId,
    dataKey: props.dataKey,
    hide: props.hide,
    name: props.name,
    tooltipType: props.tooltipType,
    isPanorama: isPanorama
  }), /*#__PURE__*/React.createElement(ScatterImpl, _extends({}, props, {
    id: id
  }))));
}

/**
 * @provides LabelListContext
 * @provides ErrorBarContext
 * @provides CellReader
 * @consumes CartesianChartContext
 */
var Scatter = exports.Scatter = /*#__PURE__*/React.memo(ScatterFn, _propsAreEqual.propsAreEqual);
// @ts-expect-error we need to set the displayName for debugging purposes

Scatter.displayName = 'Scatter';