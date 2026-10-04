"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPolarChartProps = exports.PolarChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _RechartsStoreProvider = require("../state/RechartsStoreProvider");
var _chartDataContext = require("../context/chartDataContext");
var _ReportMainChartProps = require("../state/ReportMainChartProps");
var _ReportChartProps = require("../state/ReportChartProps");
var _ReportEventSettings = require("../state/ReportEventSettings");
var _ReportPolarOptions = require("../state/ReportPolarOptions");
var _CategoricalChart = require("./CategoricalChart");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _eventSettingsSlice = require("../state/eventSettingsSlice");
var _excluded = ["layout"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var defaultMargin = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
};

/**
 * These default props are the same for all PolarChart components.
 */
var defaultPolarChartProps = exports.defaultPolarChartProps = _objectSpread({
  accessibilityLayer: true,
  stackOffset: 'none',
  barCategoryGap: '10%',
  barGap: 4,
  margin: defaultMargin,
  reverseStackOrder: false,
  syncMethod: 'index',
  layout: 'radial',
  responsive: false,
  cx: '50%',
  cy: '50%',
  innerRadius: 0,
  outerRadius: '80%'
}, _eventSettingsSlice.initialEventSettingsState);

/**
 * These props are required for the PolarChart to function correctly.
 * Users usually would not need to specify these explicitly,
 * because the convenience components like PieChart, RadarChart, etc.
 * will provide these defaults.
 * We can't have the defaults in this file because each of those convenience components
 * have their own opinions about what they should be.
 */

/**
 * These are one-time, immutable options that decide the chart's behavior.
 * Users who wish to call CartesianChart may decide to pass these options explicitly,
 * but usually we would expect that they use one of the convenience components like PieChart, RadarChart, etc.
 */

var PolarChart = exports.PolarChart = /*#__PURE__*/(0, _react.forwardRef)(function PolarChart(props, ref) {
  var _polarChartProps$id;
  var polarChartProps = (0, _resolveDefaultProps.resolveDefaultProps)(props.categoricalChartProps, defaultPolarChartProps);
  var layout = polarChartProps.layout,
    otherCategoricalProps = _objectWithoutProperties(polarChartProps, _excluded);
  var chartName = props.chartName,
    defaultTooltipEventType = props.defaultTooltipEventType,
    validateTooltipEventTypes = props.validateTooltipEventTypes,
    tooltipPayloadSearcher = props.tooltipPayloadSearcher;
  var options = {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher,
    eventEmitter: undefined
  };
  return /*#__PURE__*/React.createElement(_RechartsStoreProvider.RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_polarChartProps$id = polarChartProps.id) !== null && _polarChartProps$id !== void 0 ? _polarChartProps$id : chartName
  }, /*#__PURE__*/React.createElement(_chartDataContext.ChartDataContextProvider, {
    chartData: polarChartProps.data
  }), /*#__PURE__*/React.createElement(_ReportMainChartProps.ReportMainChartProps, {
    layout: layout,
    margin: polarChartProps.margin
  }), /*#__PURE__*/React.createElement(_ReportEventSettings.ReportEventSettings, {
    throttleDelay: polarChartProps.throttleDelay,
    throttledEvents: polarChartProps.throttledEvents
  }), /*#__PURE__*/React.createElement(_ReportChartProps.ReportChartProps, {
    baseValue: undefined,
    accessibilityLayer: polarChartProps.accessibilityLayer,
    barCategoryGap: polarChartProps.barCategoryGap,
    maxBarSize: polarChartProps.maxBarSize,
    stackOffset: polarChartProps.stackOffset,
    barGap: polarChartProps.barGap,
    barSize: polarChartProps.barSize,
    syncId: polarChartProps.syncId,
    syncMethod: polarChartProps.syncMethod,
    className: polarChartProps.className,
    reverseStackOrder: polarChartProps.reverseStackOrder
  }), /*#__PURE__*/React.createElement(_ReportPolarOptions.ReportPolarOptions, {
    cx: polarChartProps.cx,
    cy: polarChartProps.cy,
    startAngle: polarChartProps.startAngle,
    endAngle: polarChartProps.endAngle,
    innerRadius: polarChartProps.innerRadius,
    outerRadius: polarChartProps.outerRadius
  }), /*#__PURE__*/React.createElement(_CategoricalChart.CategoricalChart, _extends({}, otherCategoricalProps, {
    ref: ref
  })));
});