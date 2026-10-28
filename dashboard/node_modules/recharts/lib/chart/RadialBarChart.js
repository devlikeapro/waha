"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultRadialBarChartProps = exports.RadialBarChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _optionsSlice = require("../state/optionsSlice");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _PolarChart = require("./PolarChart");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var allowedTooltipTypes = ['axis', 'item'];
var defaultRadialBarChartProps = exports.defaultRadialBarChartProps = _objectSpread(_objectSpread({}, _PolarChart.defaultPolarChartProps), {}, {
  layout: 'radial',
  startAngle: 0,
  endAngle: 360
});

/**
 * @consumes ResponsiveContainerContext
 * @provides PolarViewBoxContext
 * @provides PolarChartContext
 */
var RadialBarChart = exports.RadialBarChart = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var propsWithDefaults = (0, _resolveDefaultProps.resolveDefaultProps)(props, defaultRadialBarChartProps);
  return /*#__PURE__*/React.createElement(_PolarChart.PolarChart, {
    chartName: "RadialBarChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: _optionsSlice.arrayTooltipSearcher,
    categoricalChartProps: propsWithDefaults,
    ref: ref
  });
});