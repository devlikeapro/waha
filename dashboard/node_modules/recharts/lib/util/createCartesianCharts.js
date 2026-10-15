"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHorizontalChart = createHorizontalChart;
exports.createVerticalChart = createVerticalChart;
var React = _interopRequireWildcard(require("react"));
var _AreaChart = require("../chart/AreaChart");
var _BarChart = require("../chart/BarChart");
var _LineChart = require("../chart/LineChart");
var _ComposedChart = require("../chart/ComposedChart");
var _ScatterChart = require("../chart/ScatterChart");
var _FunnelChart = require("../chart/FunnelChart");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var createCartesianCharts = layout => ({
  AreaChart: props => /*#__PURE__*/React.createElement(_AreaChart.AreaChart, _extends({}, props, {
    layout: layout
  })),
  BarChart: props => /*#__PURE__*/React.createElement(_BarChart.BarChart, _extends({}, props, {
    layout: layout
  })),
  LineChart: props => /*#__PURE__*/React.createElement(_LineChart.LineChart, _extends({}, props, {
    layout: layout
  })),
  ComposedChart: props => /*#__PURE__*/React.createElement(_ComposedChart.ComposedChart, _extends({}, props, {
    layout: layout
  })),
  ScatterChart: props => /*#__PURE__*/React.createElement(_ScatterChart.ScatterChart, _extends({}, props, {
    layout: layout
  }))
});
/**
 * Creates a typed context for horizontal Cartesian charts.
 *
 * **Motivation:**
 * Recharts components fall back to `any` by default. While explicit typing using Generics (e.g. `<Area<MyDataType, number>>`)
 * works per-component, it becomes tedious and error-prone across an entire chart.
 *
 * This Chart Helper allows you to perfectly align your data properties and ensure all your charts, axes, and lines work in harmony.
 * Once you define the helper with your generic requirements, all returned components strictly enforce your data structure,
 * catching `dataKey` typos and shape errors early.
 *
 * **Layout Binding:**
 * Curries the chart definition to statically bind the `layout="horizontal"` property at the component level.
 * By stripping `layout` from the configuration options of generated wrapper components, developers avoid accidentally
 * overriding chart alignments. Evaluates `TComponents` generics at compile-time to reject strictly vertical components
 * natively (`Funnel`, `FunnelChart`) from being passed.
 *
 * @example
 * ```tsx
 * // 1. Lock in the Generics: Data = MyData, X-Axis = string, Y-Axis = number
 * const TypedCharts = createHorizontalChart<MyData, string, number>()({
 *   AreaChart,
 *   Area,
 *   XAxis,
 *   YAxis,
 * });
 * // 2. TypedCharts.AreaChart is now strictly horizontal.
 * // 3. TypedCharts.Area strictly expects string/number keys matching MyData.
 * ```
 *
 * @since 3.8
 * @see {@link https://recharts.github.io/en-US/guide/typescript/ Guide: Strong typing for Recharts components}
 */
function createHorizontalChart() {
  return function withComponents(components) {
    return _objectSpread(_objectSpread({}, createCartesianCharts('horizontal')), components);
  };
}

/**
 * Creates a typed context for vertical Cartesian charts.
 *
 * **Motivation:**
 * Recharts components fall back to `any` by default. While explicit typing using Generics (e.g. `<Area<MyDataType, number>>`)
 * works per-component, it becomes tedious and error-prone across an entire chart.
 *
 * This Chart Helper allows you to perfectly align your data properties and ensure all your charts, axes, and lines work in harmony.
 * Once you define the helper with your generic requirements, all returned components strictly enforce your data structure,
 * catching `dataKey` typos and shape errors early.
 *
 * **Layout Binding:**
 * Curries the chart definition to statically bind the `layout="vertical"` property at the component level.
 * By stripping `layout` from the configuration options of generated wrapper components, developers avoid accidentally
 * overriding chart alignments. Natively supports strictly vertical components like `Funnel` and `FunnelChart`.
 *
 * @example
 * ```tsx
 * // 1. Lock in the Generics: Data = MyData, X-Axis = number, Y-Axis = string
 * const TypedCharts = createVerticalChart<MyData, number, string>()({
 *   BarChart,
 *   Bar,
 *   Funnel,
 *   XAxis,
 *   YAxis,
 * });
 * // 2. TypedCharts.BarChart is now strictly vertical.
 * // 3. `Funnel` evaluates safely inside vertical contexts exclusively and enforces MyData limits.
 * ```
 *
 * @since 3.8
 * @see {@link https://recharts.github.io/en-US/guide/typescript/ Guide: Strong typing for Recharts components}
 */
function createVerticalChart() {
  return function withComponents(components) {
    return _objectSpread(_objectSpread({}, createCartesianCharts('vertical')), {}, {
      FunnelChart: props => /*#__PURE__*/React.createElement(_FunnelChart.FunnelChart, _extends({}, props, {
        layout: "vertical"
      }))
    }, components);
  };
}