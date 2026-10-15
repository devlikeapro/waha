import * as React from 'react';
import { forwardRef } from 'react';
import { arrayTooltipSearcher } from '../state/optionsSlice';
import { CartesianChart } from './CartesianChart';
var allowedTooltipTypes = ['item'];

/**
 * @consumes ResponsiveContainerContext
 * @provides CartesianViewBoxContext
 * @provides CartesianChartContext
 */
export var ScatterChart = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(CartesianChart, {
    chartName: "ScatterChart",
    defaultTooltipEventType: "item",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: props,
    ref: ref
  });
});