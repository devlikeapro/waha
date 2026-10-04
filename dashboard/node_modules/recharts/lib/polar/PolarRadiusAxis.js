"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolarRadiusAxis = PolarRadiusAxis;
exports.PolarRadiusAxisWrapper = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _maxBy = _interopRequireDefault(require("es-toolkit/compat/maxBy"));
var _minBy = _interopRequireDefault(require("es-toolkit/compat/minBy"));
var _clsx = require("clsx");
var _Text = require("../component/Text");
var _Label = require("../component/Label");
var _Layer = require("../container/Layer");
var _PolarUtils = require("../util/PolarUtils");
var _types = require("../util/types");
var _polarAxisSlice = require("../state/polarAxisSlice");
var _hooks = require("../state/hooks");
var _polarScaleSelectors = require("../state/selectors/polarScaleSelectors");
var _polarAxisSelectors = require("../state/selectors/polarAxisSelectors");
var _defaultPolarRadiusAxisProps = require("./defaultPolarRadiusAxisProps");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _DataUtils = require("../util/DataUtils");
var _getAxisTypeBasedOnLayout = require("../util/getAxisTypeBasedOnLayout");
var _getClassNameFromUnknown = require("../util/getClassNameFromUnknown");
var _excluded = ["type"],
  _excluded2 = ["cx", "cy", "angle", "axisLine"],
  _excluded3 = ["angle", "tickFormatter", "stroke", "tick"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var AXIS_TYPE = 'radiusAxis';
function SetRadiusAxisSettings(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var layout = (0, _chartLayoutContext.usePolarChartLayout)();
  var settings = (0, _react.useMemo)(() => {
    var typeFromProps = props.type,
      rest = _objectWithoutProperties(props, _excluded);
    var evaluatedType = (0, _getAxisTypeBasedOnLayout.getAxisTypeBasedOnLayout)(layout, 'radiusAxis', typeFromProps);
    if (evaluatedType == null) {
      return undefined;
    }
    return _objectSpread(_objectSpread({}, rest), {}, {
      type: evaluatedType
    });
  }, [props, layout]);
  (0, _react.useEffect)(() => {
    if (settings == null) {
      return _DataUtils.noop;
    }
    dispatch((0, _polarAxisSlice.addRadiusAxis)(settings));
    return () => {
      dispatch((0, _polarAxisSlice.removeRadiusAxis)(settings));
    };
  }, [dispatch, settings]);
  return null;
}

/**
 * Calculate the coordinate of tick
 * @param coordinate The radius of tick
 * @param angle from props
 * @param cx from chart
 * @param cy from chart
 * @return (x, y)
 */
var getTickValueCoord = (_ref, angle, cx, cy) => {
  var coordinate = _ref.coordinate;
  return (0, _PolarUtils.polarToCartesian)(cx, cy, coordinate, angle);
};
var getTickTextAnchor = orientation => {
  var textAnchor;
  switch (orientation) {
    case 'left':
      textAnchor = 'end';
      break;
    case 'right':
      textAnchor = 'start';
      break;
    default:
      textAnchor = 'middle';
      break;
  }
  return textAnchor;
};
var getViewBox = (angle, cx, cy, ticks) => {
  var maxRadiusTick = (0, _maxBy.default)(ticks, entry => entry.coordinate || 0);
  var minRadiusTick = (0, _minBy.default)(ticks, entry => entry.coordinate || 0);
  return {
    cx,
    cy,
    startAngle: angle,
    endAngle: angle,
    innerRadius: (minRadiusTick === null || minRadiusTick === void 0 ? void 0 : minRadiusTick.coordinate) || 0,
    outerRadius: (maxRadiusTick === null || maxRadiusTick === void 0 ? void 0 : maxRadiusTick.coordinate) || 0,
    clockWise: false
  };
};
var renderAxisLine = (props, ticks) => {
  var cx = props.cx,
    cy = props.cy,
    angle = props.angle,
    axisLine = props.axisLine,
    others = _objectWithoutProperties(props, _excluded2);
  var extent = ticks.reduce((result, entry) => [Math.min(result[0], entry.coordinate), Math.max(result[1], entry.coordinate)], [Infinity, -Infinity]);
  var point0 = (0, _PolarUtils.polarToCartesian)(cx, cy, extent[0], angle);
  var point1 = (0, _PolarUtils.polarToCartesian)(cx, cy, extent[1], angle);
  var axisLineProps = _objectSpread(_objectSpread(_objectSpread({}, (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(others)), {}, {
    fill: 'none'
  }, (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(axisLine)), {}, {
    x1: point0.x,
    y1: point0.y,
    x2: point1.x,
    y2: point1.y
  });

  // @ts-expect-error wrong SVG element type
  return /*#__PURE__*/React.createElement("line", _extends({
    className: "recharts-polar-radius-axis-line"
  }, axisLineProps));
};
var renderTickItem = (option, tickProps, value) => {
  var tickItem;
  if (/*#__PURE__*/React.isValidElement(option)) {
    tickItem = /*#__PURE__*/React.cloneElement(option, tickProps);
  } else if (typeof option === 'function') {
    tickItem = option(tickProps);
  } else {
    tickItem = /*#__PURE__*/React.createElement(_Text.Text, _extends({}, tickProps, {
      className: "recharts-polar-radius-axis-tick-value"
    }), value);
  }
  return tickItem;
};
var renderTicks = (props, ticks) => {
  var angle = props.angle,
    tickFormatter = props.tickFormatter,
    stroke = props.stroke,
    tick = props.tick,
    others = _objectWithoutProperties(props, _excluded3);
  var textAnchor = getTickTextAnchor(props.orientation);
  var axisProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(others);
  var customTickProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEventsFromUnknown)(tick);
  var items = ticks.map((entry, i) => {
    var coord = getTickValueCoord(entry, props.angle, props.cx, props.cy);
    var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
      textAnchor,
      transform: "rotate(".concat(90 - angle, ", ").concat(coord.x, ", ").concat(coord.y, ")")
    }, axisProps), {}, {
      stroke: 'none',
      fill: stroke
    }, customTickProps), {}, {
      index: i
    }, coord), {}, {
      payload: entry
    });
    return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
      className: (0, _clsx.clsx)('recharts-polar-radius-axis-tick', (0, _getClassNameFromUnknown.getClassNameFromUnknown)(tick)),
      key: "tick-".concat(entry.coordinate)
    }, (0, _types.adaptEventsOfChild)(props, entry, i)), renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i) : entry.value));
  });
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: "recharts-polar-radius-axis-ticks"
  }, items);
};
var PolarRadiusAxisWrapper = defaultsAndInputs => {
  var radiusAxisId = defaultsAndInputs.radiusAxisId;
  var viewBox = (0, _hooks.useAppSelector)(_polarAxisSelectors.selectPolarViewBox);
  var scale = (0, _hooks.useAppSelector)(state => (0, _polarScaleSelectors.selectPolarAxisScale)(state, 'radiusAxis', radiusAxisId));
  var ticks = (0, _hooks.useAppSelector)(state => (0, _polarScaleSelectors.selectPolarAxisTicks)(state, 'radiusAxis', radiusAxisId, false));
  if (viewBox == null || !ticks || !ticks.length || scale == null) {
    return null;
  }
  var props = _objectSpread(_objectSpread({}, defaultsAndInputs), {}, {
    scale
  }, viewBox);
  var tick = props.tick,
    axisLine = props.axisLine;
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: (0, _clsx.clsx)('recharts-polar-radius-axis', AXIS_TYPE, props.className)
  }, axisLine && renderAxisLine(props, ticks), tick && renderTicks(props, ticks), /*#__PURE__*/React.createElement(_Label.PolarLabelContextProvider, getViewBox(props.angle, props.cx, props.cy, ticks), /*#__PURE__*/React.createElement(_Label.PolarLabelFromLabelProp, {
    label: props.label
  }), props.children)));
};

/**
 * @provides PolarLabelContext
 * @consumes PolarViewBoxContext
 */
exports.PolarRadiusAxisWrapper = PolarRadiusAxisWrapper;
function PolarRadiusAxis(outsideProps) {
  var _props$niceTicks;
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetRadiusAxisSettings, {
    domain: props.domain,
    id: props.radiusAxisId,
    scale: props.scale,
    type: props.type,
    dataKey: props.dataKey,
    unit: undefined,
    name: props.name,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDataOverflow: props.allowDataOverflow,
    reversed: props.reversed,
    includeHidden: props.includeHidden,
    allowDecimals: props.allowDecimals,
    niceTicks: (_props$niceTicks = props.niceTicks) !== null && _props$niceTicks !== void 0 ? _props$niceTicks : 'auto',
    ticks: props.ticks,
    tickCount: props.tickCount,
    tick: props.tick
  }), /*#__PURE__*/React.createElement(PolarRadiusAxisWrapper, props));
}
PolarRadiusAxis.displayName = 'PolarRadiusAxis';