import * as React from 'react';
import { CartesianChartProps, Margin, TooltipEventType } from '../util/types';
import { TooltipPayloadSearcher } from '../state/tooltipSlice';
export declare const defaultCartesianChartProps: {
    readonly throttleDelay: number | "raf";
    readonly throttledEvents: ReadonlyArray<keyof GlobalEventHandlersEventMap> | "all";
    readonly accessibilityLayer: true;
    readonly barCategoryGap: "10%";
    readonly barGap: 4;
    readonly layout: "horizontal";
    readonly margin: Margin;
    readonly responsive: false;
    readonly reverseStackOrder: false;
    readonly stackOffset: "none";
    readonly syncMethod: "index";
};
/**
 * These are one-time, immutable options that decide the chart's behavior.
 * Users who wish to call CartesianChart may decide to pass these options explicitly,
 * but usually we would expect that they use one of the convenience components like BarChart, LineChart, etc.
 */
export type CartesianChartOptions = {
    chartName: string;
    defaultTooltipEventType: TooltipEventType;
    validateTooltipEventTypes: ReadonlyArray<TooltipEventType>;
    tooltipPayloadSearcher: TooltipPayloadSearcher;
    categoricalChartProps: CartesianChartProps;
};
export declare const CartesianChart: React.ForwardRefExoticComponent<CartesianChartOptions & React.RefAttributes<SVGSVGElement>>;
