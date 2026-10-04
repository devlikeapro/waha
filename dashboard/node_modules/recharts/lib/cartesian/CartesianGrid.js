"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianGrid = CartesianGrid;
exports.defaultCartesianGridProps = void 0;
var React = _interopRequireWildcard(require("react"));
var _LogUtils = require("../util/LogUtils");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _getTicks = require("./getTicks");
var _CartesianAxis = require("./CartesianAxis");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _hooks = require("../state/hooks");
var _PanoramaContext = require("../context/PanoramaContext");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _RechartsThemeContext = require("../theme/RechartsThemeContext");
var _excluded = ["x1", "y1", "x2", "y2", "key"],
  _excluded2 = ["offset"],
  _excluded3 = ["xAxisId", "yAxisId"],
  _excluded4 = ["xAxisId", "yAxisId"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * The <CartesianGrid horizontal
 */

// We exclude strokeDasharray here because Recharts allows array of numbers while DOM does not

var Background = props => {
  var fill = props.fill;
  if (!fill || fill === 'none') {
    return null;
  }
  var fillOpacity = props.fillOpacity,
    x = props.x,
    y = props.y,
    width = props.width,
    height = props.height,
    ry = props.ry;
  return /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y,
    ry: ry,
    width: width,
    height: height,
    stroke: "none",
    fill: fill,
    fillOpacity: fillOpacity,
    className: "recharts-cartesian-grid-bg"
  });
};
function LineItem(_ref) {
  var option = _ref.option,
    lineItemProps = _ref.lineItemProps;
  var lineItem;
  if (/*#__PURE__*/React.isValidElement(option)) {
    // @ts-expect-error typescript does not see the props type when cloning an element
    lineItem = /*#__PURE__*/React.cloneElement(option, lineItemProps);
  } else if (typeof option === 'function') {
    lineItem = option(lineItemProps);
  } else {
    var _svgPropertiesNoEvent;
    var x1 = lineItemProps.x1,
      y1 = lineItemProps.y1,
      x2 = lineItemProps.x2,
      y2 = lineItemProps.y2,
      key = lineItemProps.key,
      others = _objectWithoutProperties(lineItemProps, _excluded);
    var _ref2 = (_svgPropertiesNoEvent = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(others)) !== null && _svgPropertiesNoEvent !== void 0 ? _svgPropertiesNoEvent : {},
      __ = _ref2.offset,
      restOfFilteredProps = _objectWithoutProperties(_ref2, _excluded2);
    var strokeDasharray = Array.isArray(restOfFilteredProps.strokeDasharray) ? restOfFilteredProps.strokeDasharray.join(',') : restOfFilteredProps.strokeDasharray;
    lineItem = /*#__PURE__*/React.createElement("line", _extends({}, restOfFilteredProps, {
      strokeDasharray: strokeDasharray,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      fill: "none",
      key: key
    }));
  }
  return lineItem;
}
function HorizontalGridLines(props) {
  var x = props.x,
    width = props.width,
    _props$horizontal = props.horizontal,
    horizontal = _props$horizontal === void 0 ? true : _props$horizontal,
    horizontalPoints = props.horizontalPoints;
  if (!horizontal || !horizontalPoints || !horizontalPoints.length) {
    return null;
  }
  var xAxisId = props.xAxisId,
    yAxisId = props.yAxisId,
    otherLineItemProps = _objectWithoutProperties(props, _excluded3);
  var items = horizontalPoints.map((entry, i) => {
    var lineItemProps = _objectSpread(_objectSpread({}, otherLineItemProps), {}, {
      x1: x,
      y1: entry,
      x2: x + width,
      y2: entry,
      key: "line-".concat(i),
      index: i
    });
    return /*#__PURE__*/React.createElement(LineItem, {
      key: "line-".concat(i),
      option: horizontal,
      lineItemProps: lineItemProps
    });
  });
  return /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, items);
}
function VerticalGridLines(props) {
  var y = props.y,
    height = props.height,
    _props$vertical = props.vertical,
    vertical = _props$vertical === void 0 ? true : _props$vertical,
    verticalPoints = props.verticalPoints;
  if (!vertical || !verticalPoints || !verticalPoints.length) {
    return null;
  }
  var xAxisId = props.xAxisId,
    yAxisId = props.yAxisId,
    otherLineItemProps = _objectWithoutProperties(props, _excluded4);
  var items = verticalPoints.map((entry, i) => {
    var lineItemProps = _objectSpread(_objectSpread({}, otherLineItemProps), {}, {
      x1: entry,
      y1: y,
      x2: entry,
      y2: y + height,
      key: "line-".concat(i),
      index: i
    });
    return /*#__PURE__*/React.createElement(LineItem, {
      option: vertical,
      lineItemProps: lineItemProps,
      key: "line-".concat(i)
    });
  });
  return /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, items);
}
function HorizontalStripes(props) {
  var horizontalFill = props.horizontalFill,
    fillOpacity = props.fillOpacity,
    x = props.x,
    y = props.y,
    width = props.width,
    height = props.height,
    horizontalPoints = props.horizontalPoints,
    _props$horizontal2 = props.horizontal,
    horizontal = _props$horizontal2 === void 0 ? true : _props$horizontal2;
  if (!horizontal || !horizontalFill || !horizontalFill.length || horizontalPoints == null) {
    return null;
  }
  var roundedSortedHorizontalPoints = horizontalPoints.map(e => Math.round(e + y - y)).sort((a, b) => a - b);
  // Why is this condition `!==` instead of `<=` ?
  if (y !== roundedSortedHorizontalPoints[0]) {
    roundedSortedHorizontalPoints.unshift(0);
  }
  var items = roundedSortedHorizontalPoints.map((entry, i) => {
    // Why do we strip only the last stripe if it is invisible, and not all invisible stripes?
    var nextPoint = roundedSortedHorizontalPoints[i + 1];
    var lastStripe = nextPoint == null;
    var lineHeight = lastStripe ? y + height - entry : nextPoint - entry;
    if (lineHeight <= 0) {
      return null;
    }
    var colorIndex = i % horizontalFill.length;
    return /*#__PURE__*/React.createElement("rect", {
      key: "react-".concat(i),
      y: entry,
      x: x,
      height: lineHeight,
      width: width,
      stroke: "none",
      fill: horizontalFill[colorIndex],
      fillOpacity: fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, items);
}
function VerticalStripes(props) {
  var _props$vertical2 = props.vertical,
    vertical = _props$vertical2 === void 0 ? true : _props$vertical2,
    verticalFill = props.verticalFill,
    fillOpacity = props.fillOpacity,
    x = props.x,
    y = props.y,
    width = props.width,
    height = props.height,
    verticalPoints = props.verticalPoints;
  if (!vertical || !verticalFill || !verticalFill.length) {
    return null;
  }
  var roundedSortedVerticalPoints = verticalPoints.map(e => Math.round(e + x - x)).sort((a, b) => a - b);
  if (x !== roundedSortedVerticalPoints[0]) {
    roundedSortedVerticalPoints.unshift(0);
  }
  var items = roundedSortedVerticalPoints.map((entry, i) => {
    var nextPoint = roundedSortedVerticalPoints[i + 1];
    var lastStripe = nextPoint == null;
    var lineWidth = lastStripe ? x + width - entry : nextPoint - entry;
    if (lineWidth <= 0) {
      return null;
    }
    var colorIndex = i % verticalFill.length;
    return /*#__PURE__*/React.createElement("rect", {
      key: "react-".concat(i),
      x: entry,
      y: y,
      width: lineWidth,
      height: height,
      stroke: "none",
      fill: verticalFill[colorIndex],
      fillOpacity: fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, items);
}
var defaultVerticalCoordinatesGenerator = (_ref3, syncWithTicks) => {
  var xAxis = _ref3.xAxis,
    width = _ref3.width,
    height = _ref3.height,
    offset = _ref3.offset;
  return (0, _ChartUtils.getCoordinatesOfGrid)((0, _getTicks.getTicks)(_objectSpread(_objectSpread(_objectSpread({}, _CartesianAxis.defaultCartesianAxisProps), xAxis), {}, {
    ticks: (0, _ChartUtils.getTicksOfAxis)(xAxis, true),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.left, offset.left + offset.width, syncWithTicks);
};
var defaultHorizontalCoordinatesGenerator = (_ref4, syncWithTicks) => {
  var yAxis = _ref4.yAxis,
    width = _ref4.width,
    height = _ref4.height,
    offset = _ref4.offset;
  return (0, _ChartUtils.getCoordinatesOfGrid)((0, _getTicks.getTicks)(_objectSpread(_objectSpread(_objectSpread({}, _CartesianAxis.defaultCartesianAxisProps), yAxis), {}, {
    ticks: (0, _ChartUtils.getTicksOfAxis)(yAxis, true),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.top, offset.top + offset.height, syncWithTicks);
};
var defaultCartesianGridProps = exports.defaultCartesianGridProps = {
  horizontal: true,
  vertical: true,
  // The ordinates of horizontal grid lines
  horizontalPoints: [],
  // The abscissas of vertical grid lines
  verticalPoints: [],
  // The fill of colors of grid lines
  verticalFill: [],
  horizontalFill: [],
  xAxisId: 0,
  yAxisId: 0,
  syncWithTicks: false,
  zIndex: _DefaultZIndexes.DefaultZIndexes.grid
};

/**
 * Renders background grid with lines and fill colors in a Cartesian chart.
 *
 * @consumes CartesianChartContext
 */
function CartesianGrid(props) {
  var _propsIncludingDefaul, _propsIncludingDefaul2, _propsIncludingDefaul3, _propsIncludingDefaul4, _propsIncludingDefaul5, _propsIncludingDefaul6;
  var chartWidth = (0, _chartLayoutContext.useChartWidth)();
  var chartHeight = (0, _chartLayoutContext.useChartHeight)();
  var offset = (0, _chartLayoutContext.useOffsetInternal)();
  var propsIncludingDefaults = _objectSpread(_objectSpread({}, (0, _resolveDefaultProps.resolveDefaultProps)(props, defaultCartesianGridProps)), {}, {
    x: (0, _DataUtils.isNumber)(props.x) ? props.x : offset.left,
    y: (0, _DataUtils.isNumber)(props.y) ? props.y : offset.top,
    width: (0, _DataUtils.isNumber)(props.width) ? props.width : offset.width,
    height: (0, _DataUtils.isNumber)(props.height) ? props.height : offset.height
  });
  var xAxisId = propsIncludingDefaults.xAxisId,
    yAxisId = propsIncludingDefaults.yAxisId,
    x = propsIncludingDefaults.x,
    y = propsIncludingDefaults.y,
    width = propsIncludingDefaults.width,
    height = propsIncludingDefaults.height,
    syncWithTicks = propsIncludingDefaults.syncWithTicks,
    horizontalValues = propsIncludingDefaults.horizontalValues,
    verticalValues = propsIncludingDefaults.verticalValues;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var xAxis = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisPropsNeededForCartesianGridTicksGenerator)(state, 'xAxis', xAxisId, isPanorama));
  var yAxis = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisPropsNeededForCartesianGridTicksGenerator)(state, 'yAxis', yAxisId, isPanorama));
  var theme = (0, _RechartsThemeContext.useRechartsTheme)();
  var themeProps = {
    stroke: (_propsIncludingDefaul = propsIncludingDefaults.stroke) !== null && _propsIncludingDefaul !== void 0 ? _propsIncludingDefaul : theme.grid.stroke,
    strokeWidth: (_propsIncludingDefaul2 = propsIncludingDefaults.strokeWidth) !== null && _propsIncludingDefaul2 !== void 0 ? _propsIncludingDefaul2 : theme.grid.strokeWidth,
    strokeOpacity: (_propsIncludingDefaul3 = propsIncludingDefaults.strokeOpacity) !== null && _propsIncludingDefaul3 !== void 0 ? _propsIncludingDefaul3 : theme.grid.strokeOpacity,
    strokeDasharray: (_propsIncludingDefaul4 = propsIncludingDefaults.strokeDasharray) !== null && _propsIncludingDefaul4 !== void 0 ? _propsIncludingDefaul4 : theme.grid.strokeDasharray
  };
  if (!(0, _isWellBehavedNumber.isPositiveNumber)(width) || !(0, _isWellBehavedNumber.isPositiveNumber)(height) || !(0, _DataUtils.isNumber)(x) || !(0, _DataUtils.isNumber)(y)) {
    return null;
  }

  /*
   * verticalCoordinatesGenerator and horizontalCoordinatesGenerator are defined
   * outside the propsIncludingDefaults because they were never part of the original props
   * and they were never passed as a prop down to horizontal/vertical custom elements.
   * If we add these two to propsIncludingDefaults then we are changing public API.
   * Not a bad thing per se but also not necessary.
   */
  var verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
  var horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
  var horizontalPoints = propsIncludingDefaults.horizontalPoints,
    verticalPoints = propsIncludingDefaults.verticalPoints;

  // No horizontal points are specified
  if ((!horizontalPoints || !horizontalPoints.length) && typeof horizontalCoordinatesGenerator === 'function') {
    var isHorizontalValues = horizontalValues && horizontalValues.length;
    var generatorResult = horizontalCoordinatesGenerator({
      yAxis: yAxis ? _objectSpread(_objectSpread({}, yAxis), {}, {
        ticks: isHorizontalValues ? horizontalValues : yAxis.ticks
      }) : undefined,
      width: chartWidth !== null && chartWidth !== void 0 ? chartWidth : width,
      height: chartHeight !== null && chartHeight !== void 0 ? chartHeight : height,
      offset
    }, isHorizontalValues ? true : syncWithTicks);
    (0, _LogUtils.warn)(Array.isArray(generatorResult), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof generatorResult, "]"));
    if (Array.isArray(generatorResult)) {
      horizontalPoints = generatorResult;
    }
  }

  // No vertical points are specified
  if ((!verticalPoints || !verticalPoints.length) && typeof verticalCoordinatesGenerator === 'function') {
    var isVerticalValues = verticalValues && verticalValues.length;
    var _generatorResult = verticalCoordinatesGenerator({
      xAxis: xAxis ? _objectSpread(_objectSpread({}, xAxis), {}, {
        ticks: isVerticalValues ? verticalValues : xAxis.ticks
      }) : undefined,
      width: chartWidth !== null && chartWidth !== void 0 ? chartWidth : width,
      height: chartHeight !== null && chartHeight !== void 0 ? chartHeight : height,
      offset
    }, isVerticalValues ? true : syncWithTicks);
    (0, _LogUtils.warn)(Array.isArray(_generatorResult), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof _generatorResult, "]"));
    if (Array.isArray(_generatorResult)) {
      verticalPoints = _generatorResult;
    }
  }
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: propsIncludingDefaults.zIndex
  }, /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /*#__PURE__*/React.createElement(Background, {
    fill: (_propsIncludingDefaul5 = propsIncludingDefaults.fill) !== null && _propsIncludingDefaul5 !== void 0 ? _propsIncludingDefaul5 : theme.grid.fill,
    fillOpacity: (_propsIncludingDefaul6 = propsIncludingDefaults.fillOpacity) !== null && _propsIncludingDefaul6 !== void 0 ? _propsIncludingDefaul6 : theme.grid.fillOpacity,
    x: propsIncludingDefaults.x,
    y: propsIncludingDefaults.y,
    width: propsIncludingDefaults.width,
    height: propsIncludingDefaults.height,
    ry: propsIncludingDefaults.ry
  }), /*#__PURE__*/React.createElement(HorizontalStripes, _extends({}, propsIncludingDefaults, {
    horizontalPoints: horizontalPoints
  })), /*#__PURE__*/React.createElement(VerticalStripes, _extends({}, propsIncludingDefaults, {
    verticalPoints: verticalPoints
  })), /*#__PURE__*/React.createElement(HorizontalGridLines, _extends({}, propsIncludingDefaults, themeProps, {
    offset: offset,
    horizontalPoints: horizontalPoints,
    xAxis: xAxis,
    yAxis: yAxis
  })), /*#__PURE__*/React.createElement(VerticalGridLines, _extends({}, propsIncludingDefaults, themeProps, {
    offset: offset,
    verticalPoints: verticalPoints,
    xAxis: xAxis,
    yAxis: yAxis
  }))));
}
CartesianGrid.displayName = 'CartesianGrid';