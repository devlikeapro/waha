"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolarAngleAxis = PolarAngleAxis;
exports.PolarAngleAxisWrapper = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _Dot = require("../shape/Dot");
var _Polygon = require("../shape/Polygon");
var _Text = require("../component/Text");
var _types = require("../util/types");
var _PolarUtils = require("../util/PolarUtils");
var _polarAxisSlice = require("../state/polarAxisSlice");
var _hooks = require("../state/hooks");
var _polarScaleSelectors = require("../state/selectors/polarScaleSelectors");
var _polarAxisSelectors = require("../state/selectors/polarAxisSelectors");
var _defaultPolarAngleAxisProps = require("./defaultPolarAngleAxisProps");
var _PanoramaContext = require("../context/PanoramaContext");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _DataUtils = require("../util/DataUtils");
var _getAxisTypeBasedOnLayout = require("../util/getAxisTypeBasedOnLayout");
var _getClassNameFromUnknown = require("../util/getClassNameFromUnknown");
var _excluded = ["children", "type"],
  _excluded2 = ["ref"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var eps = 1e-5;
var COS_45 = Math.cos((0, _PolarUtils.degreeToRadian)(45));
var AXIS_TYPE = 'angleAxis';
function SetAngleAxisSettings(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var layout = (0, _chartLayoutContext.usePolarChartLayout)();
  var settings = (0, _react.useMemo)(() => {
    var children = props.children,
      typeFromProps = props.type,
      rest = _objectWithoutProperties(props, _excluded);
    var evaluatedType = (0, _getAxisTypeBasedOnLayout.getAxisTypeBasedOnLayout)(layout, 'angleAxis', typeFromProps);
    if (evaluatedType == null) {
      return undefined;
    }
    return _objectSpread(_objectSpread({}, rest), {}, {
      type: evaluatedType
    });
  }, [props, layout]);
  var synchronizedSettings = (0, _hooks.useAppSelector)(state => (0, _polarAxisSelectors.selectAngleAxis)(state, settings === null || settings === void 0 ? void 0 : settings.id));
  var settingsAreSynchronized = settings === synchronizedSettings;
  (0, _react.useEffect)(() => {
    if (settings == null) {
      return _DataUtils.noop;
    }
    dispatch((0, _polarAxisSlice.addAngleAxis)(settings));
    return () => {
      dispatch((0, _polarAxisSlice.removeAngleAxis)(settings));
    };
  }, [dispatch, settings]);
  if (settingsAreSynchronized) {
    return props.children;
  }
  return null;
}

/**
 * Calculate the coordinate of line endpoint
 * @param data The data if there are ticks
 * @param props axis settings
 * @return (x1, y1): The point close to text,
 *         (x2, y2): The point close to axis
 */
var getTickLineCoord = (data, props) => {
  var cx = props.cx,
    cy = props.cy,
    radius = props.radius,
    orientation = props.orientation,
    tickSize = props.tickSize;
  var tickLineSize = tickSize || 8;
  var p1 = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, data.coordinate);
  var p2 = (0, _PolarUtils.polarToCartesian)(cx, cy, radius + (orientation === 'inner' ? -1 : 1) * tickLineSize, data.coordinate);
  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y
  };
};

/**
 * Get the text-anchor of each tick
 * @param data Data of ticks
 * @param orientation of the axis ticks
 * @return text-anchor
 */
var getTickTextAnchor = (data, orientation) => {
  var cos = Math.cos((0, _PolarUtils.degreeToRadian)(-data.coordinate));
  if (cos > eps) {
    return orientation === 'outer' ? 'start' : 'end';
  }
  if (cos < -eps) {
    return orientation === 'outer' ? 'end' : 'start';
  }
  return 'middle';
};

/**
 * Get the text vertical anchor of each tick
 * @param data Data of a tick
 * @return text vertical anchor
 */
var getTickTextVerticalAnchor = data => {
  var cos = Math.cos((0, _PolarUtils.degreeToRadian)(-data.coordinate));
  var sin = Math.sin((0, _PolarUtils.degreeToRadian)(-data.coordinate));

  // handle top and bottom sectors: 90±45deg and 270±45deg
  if (Math.abs(cos) <= COS_45) {
    // sin > 0: top sector, sin < 0: bottom sector
    return sin > 0 ? 'start' : 'end';
  }
  return 'middle';
};
var AxisLine = props => {
  var cx = props.cx,
    cy = props.cy,
    radius = props.radius,
    axisLineType = props.axisLineType,
    axisLine = props.axisLine,
    ticks = props.ticks;
  if (!axisLine) {
    return null;
  }
  var axisLineProps = _objectSpread(_objectSpread({}, (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(props)), {}, {
    fill: 'none'
  }, (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(axisLine));
  if (axisLineType === 'circle') {
    // @ts-expect-error wrong SVG element type
    return /*#__PURE__*/React.createElement(_Dot.Dot, _extends({
      className: "recharts-polar-angle-axis-line"
    }, axisLineProps, {
      cx: cx,
      cy: cy,
      r: radius
    }));
  }
  var points = ticks.map(entry => (0, _PolarUtils.polarToCartesian)(cx, cy, radius, entry.coordinate));

  // @ts-expect-error wrong SVG element type
  return /*#__PURE__*/React.createElement(_Polygon.Polygon, _extends({
    className: "recharts-polar-angle-axis-line"
  }, axisLineProps, {
    points: points
  }));
};
var TickItemText = _ref => {
  var tick = _ref.tick,
    tickProps = _ref.tickProps,
    value = _ref.value;
  if (!tick) {
    return null;
  }
  if (/*#__PURE__*/React.isValidElement(tick)) {
    return /*#__PURE__*/React.cloneElement(tick, tickProps);
  }
  if (typeof tick === 'function') {
    return tick(tickProps);
  }
  return /*#__PURE__*/React.createElement(_Text.Text, _extends({}, tickProps, {
    className: "recharts-polar-angle-axis-tick-value"
  }), value);
};
var Ticks = props => {
  var tick = props.tick,
    tickLine = props.tickLine,
    tickFormatter = props.tickFormatter,
    stroke = props.stroke,
    ticks = props.ticks;
  var _svgPropertiesNoEvent = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(props),
    ref = _svgPropertiesNoEvent.ref,
    axisProps = _objectWithoutProperties(_svgPropertiesNoEvent, _excluded2);
  var customTickProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEventsFromUnknown)(tick);
  var tickLineProps = _objectSpread(_objectSpread({}, axisProps), {}, {
    fill: 'none'
  }, (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(tickLine));
  var items = ticks.map((entry, i) => {
    var lineCoord = getTickLineCoord(entry, props);
    var textAnchor = getTickTextAnchor(entry, props.orientation);
    var verticalAnchor = getTickTextVerticalAnchor(entry);
    var tickProps = _objectSpread(_objectSpread(_objectSpread({}, axisProps), {}, {
      // @ts-expect-error customTickProps is contributing unknown props
      textAnchor,
      verticalAnchor,
      // @ts-expect-error customTickProps is contributing unknown props
      stroke: 'none',
      // @ts-expect-error customTickProps is contributing unknown props
      fill: stroke
    }, customTickProps), {}, {
      index: i,
      payload: entry,
      x: lineCoord.x2,
      y: lineCoord.y2
    });
    return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
      className: (0, _clsx.clsx)('recharts-polar-angle-axis-tick', (0, _getClassNameFromUnknown.getClassNameFromUnknown)(tick)),
      key: "tick-".concat(entry.coordinate)
    }, (0, _types.adaptEventsOfChild)(props, entry, i)), tickLine && /*#__PURE__*/React.createElement("line", _extends({
      className: "recharts-polar-angle-axis-tick-line"
    }, tickLineProps, lineCoord)), /*#__PURE__*/React.createElement(TickItemText, {
      tick: tick,
      tickProps: tickProps,
      value: tickFormatter ? tickFormatter(entry.value, i) : entry.value
    }));
  });
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: "recharts-polar-angle-axis-ticks"
  }, items);
};
var PolarAngleAxisWrapper = defaultsAndInputs => {
  var angleAxisId = defaultsAndInputs.angleAxisId;
  var viewBox = (0, _hooks.useAppSelector)(_polarAxisSelectors.selectPolarViewBox);
  var scale = (0, _hooks.useAppSelector)(state => (0, _polarScaleSelectors.selectPolarAxisScale)(state, 'angleAxis', angleAxisId));
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var ticks = (0, _hooks.useAppSelector)(state => (0, _polarScaleSelectors.selectPolarAngleAxisTicks)(state, 'angleAxis', angleAxisId, isPanorama));
  if (viewBox == null || !ticks || !ticks.length || scale == null) {
    return null;
  }
  var props = _objectSpread(_objectSpread(_objectSpread({}, defaultsAndInputs), {}, {
    scale
  }, viewBox), {}, {
    radius: viewBox.outerRadius,
    ticks
  });
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: (0, _clsx.clsx)('recharts-polar-angle-axis', AXIS_TYPE, props.className)
  }, /*#__PURE__*/React.createElement(AxisLine, props), /*#__PURE__*/React.createElement(Ticks, props)));
};

/**
 * @provides PolarLabelContext
 * @consumes PolarViewBoxContext
 */
exports.PolarAngleAxisWrapper = PolarAngleAxisWrapper;
function PolarAngleAxis(outsideProps) {
  var _props$niceTicks;
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps);
  return /*#__PURE__*/React.createElement(SetAngleAxisSettings, {
    id: props.angleAxisId,
    scale: props.scale,
    type: props.type,
    dataKey: props.dataKey,
    unit: undefined,
    name: props.name,
    allowDuplicatedCategory: false // Ignoring the prop on purpose because axis calculation behaves as if it was false and Tooltip requires it to be true.
    ,
    allowDataOverflow: false,
    reversed: props.reversed,
    includeHidden: false,
    allowDecimals: props.allowDecimals,
    tickCount: props.tickCount,
    niceTicks: (_props$niceTicks = props.niceTicks) !== null && _props$niceTicks !== void 0 ? _props$niceTicks : 'auto'
    // @ts-expect-error the type does not match. Is RadiusAxis really expecting what it says?
    ,
    ticks: props.ticks,
    tick: props.tick,
    domain: props.domain
  }, /*#__PURE__*/React.createElement(PolarAngleAxisWrapper, props));
}
PolarAngleAxis.displayName = 'PolarAngleAxis';