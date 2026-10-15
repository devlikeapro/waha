function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { forwardRef } from 'react';
import { RechartsStoreProvider } from '../state/RechartsStoreProvider';
import { ChartDataContextProvider } from '../context/chartDataContext';
import { ReportMainChartProps } from '../state/ReportMainChartProps';
import { ReportChartProps } from '../state/ReportChartProps';
import { ReportEventSettings } from '../state/ReportEventSettings';
import { CategoricalChart } from './CategoricalChart';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { initialEventSettingsState } from '../state/eventSettingsSlice';
var defaultMargin = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
};
export var defaultCartesianChartProps = _objectSpread({
  accessibilityLayer: true,
  barCategoryGap: '10%',
  barGap: 4,
  layout: 'horizontal',
  margin: defaultMargin,
  responsive: false,
  reverseStackOrder: false,
  stackOffset: 'none',
  syncMethod: 'index'
}, initialEventSettingsState);

/**
 * These are one-time, immutable options that decide the chart's behavior.
 * Users who wish to call CartesianChart may decide to pass these options explicitly,
 * but usually we would expect that they use one of the convenience components like BarChart, LineChart, etc.
 */

export var CartesianChart = /*#__PURE__*/forwardRef(function CartesianChart(props, ref) {
  var _categoricalChartProp;
  var rootChartProps = resolveDefaultProps(props.categoricalChartProps, defaultCartesianChartProps);
  var chartName = props.chartName,
    defaultTooltipEventType = props.defaultTooltipEventType,
    validateTooltipEventTypes = props.validateTooltipEventTypes,
    tooltipPayloadSearcher = props.tooltipPayloadSearcher,
    categoricalChartProps = props.categoricalChartProps;
  var options = {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher,
    eventEmitter: undefined
  };
  return /*#__PURE__*/React.createElement(RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_categoricalChartProp = categoricalChartProps.id) !== null && _categoricalChartProp !== void 0 ? _categoricalChartProp : chartName
  }, /*#__PURE__*/React.createElement(ChartDataContextProvider, {
    chartData: categoricalChartProps.data
  }), /*#__PURE__*/React.createElement(ReportMainChartProps, {
    layout: rootChartProps.layout,
    margin: rootChartProps.margin
  }), /*#__PURE__*/React.createElement(ReportEventSettings, {
    throttleDelay: rootChartProps.throttleDelay,
    throttledEvents: rootChartProps.throttledEvents
  }), /*#__PURE__*/React.createElement(ReportChartProps, {
    baseValue: rootChartProps.baseValue,
    accessibilityLayer: rootChartProps.accessibilityLayer,
    barCategoryGap: rootChartProps.barCategoryGap,
    maxBarSize: rootChartProps.maxBarSize,
    stackOffset: rootChartProps.stackOffset,
    barGap: rootChartProps.barGap,
    barSize: rootChartProps.barSize,
    syncId: rootChartProps.syncId,
    syncMethod: rootChartProps.syncMethod,
    className: rootChartProps.className,
    reverseStackOrder: rootChartProps.reverseStackOrder
  }), /*#__PURE__*/React.createElement(CategoricalChart, _extends({}, rootChartProps, {
    ref: ref
  })));
});