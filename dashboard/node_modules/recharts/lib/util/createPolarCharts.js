"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCentricChart = createCentricChart;
exports.createRadialChart = createRadialChart;
var React = _interopRequireWildcard(require("react"));
var _RadialBarChart = require("../chart/RadialBarChart");
var _RadarChart = require("../chart/RadarChart");
var _PieChart = require("../chart/PieChart");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Creates a typed context for centric Polar charts.
 *
 * **Motivation:**
 * Recharts components fall back to `any` by default. While explicit typing using Generics works per-component,
 * it becomes tedious and error-prone across an entire chart.
 *
 * This Chart Helper allows you to perfectly align your data properties and ensure all your charts and axes work in harmony.
 * Once you define the helper with your generic requirements, all returned components strictly enforce your data structure,
 * catching `dataKey` typos and shape errors early.
 *
 * **Layout Binding:**
 * Curries chart definitions to strictly bind `layout="centric"` prop behavior statically onto components.
 * By wrapping the chart implementations, it completely masks the `layout` prop on initialization to prevent regressions.
 * Evaluates `TComponents` generics at compile-time to reject radial-only elements natively (`RadialBar`, `Pie`, etc.)
 *
 * @example
 * ```tsx
 * // 1. Lock in the Generics: Data = MyData
 * const TypedCentric = createCentricChart<MyData, string, number>()({
 *   RadarChart,
 *   Radar,
 * });
 * // 2. `layout` is permanently bound to "centric".
 * // 3. Passing `Pie` or `RadialBar` into the components map will explicitly trigger a TS error.
 * ```
 *
 * @since 3.8
 * @see {@link https://recharts.github.io/en-US/guide/typescript/ Guide: Strong typing for Recharts components}
 */
function createCentricChart() {
  return function withComponents(components) {
    return _objectSpread({
      RadarChart: props => /*#__PURE__*/React.createElement(_RadarChart.RadarChart, _extends({}, props, {
        layout: "centric"
      }))
    }, components);
  };
}

/**
 * Creates a typed context for radial Polar charts.
 *
 * **Motivation:**
 * Recharts components fall back to `any` by default. While explicit typing using Generics works per-component,
 * it becomes tedious and error-prone across an entire chart.
 *
 * This Chart Helper allows you to perfectly align your data properties and ensure all your charts and layers work in harmony.
 * Once you define the helper with your generic requirements, all returned components strictly enforce your data structure,
 * catching `dataKey` typos and shape errors early.
 *
 * **Layout Binding:**
 * Curries chart definitions to strictly bind `layout="radial"` prop behavior statically onto components.
 * By wrapping the chart implementations, it completely masks the `layout` prop on initialization to prevent runtime faults.
 * Evaluates `TComponents` generics at compile-time to reject centric-only elements natively (`Radar`, `RadarChart`, etc.)
 *
 * @example
 * ```tsx
 * // 1. Lock in the Generics: Data = MyData
 * const TypedRadial = createRadialChart<MyData, string, number>()({
 *   RadialBarChart,
 *   RadialBar,
 * });
 * // 2. `layout` is permanently bound to "radial".
 * // 3. Passing `Radar` or `RadarChart` into the components map will explicitly trigger a TS error.
 * ```
 *
 * @since 3.8
 * @see {@link https://recharts.github.io/en-US/guide/typescript/ Guide: Strong typing for Recharts components}
 */
function createRadialChart() {
  return function withComponents(components) {
    return _objectSpread({
      RadialBarChart: props => /*#__PURE__*/React.createElement(_RadialBarChart.RadialBarChart, _extends({}, props, {
        layout: "radial"
      })),
      PieChart: props => /*#__PURE__*/React.createElement(_PieChart.PieChart, _extends({}, props, {
        layout: "radial"
      }))
    }, components);
  };
}