"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AreaChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _optionsSlice = require("../state/optionsSlice");
var _CartesianChart = require("./CartesianChart");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var allowedTooltipTypes = ['axis'];

/**
 * @consumes ResponsiveContainerContext
 * @provides CartesianViewBoxContext
 * @provides CartesianChartContext
 */
var AreaChart = exports.AreaChart = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  return /*#__PURE__*/React.createElement(_CartesianChart.CartesianChart, {
    chartName: "AreaChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: _optionsSlice.arrayTooltipSearcher,
    categoricalChartProps: props,
    ref: ref
  });
});