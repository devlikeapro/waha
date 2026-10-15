import * as React from 'react';
import { PolarChartProps } from '../util/types';
export declare const defaultRadarChartProps: {
    readonly layout: "centric";
    readonly startAngle: 90;
    readonly endAngle: -270;
    readonly throttleDelay: number | "raf";
    readonly throttledEvents: ReadonlyArray<keyof GlobalEventHandlersEventMap> | "all";
    readonly accessibilityLayer: true;
    readonly stackOffset: "none";
    readonly barCategoryGap: "10%";
    readonly barGap: 4;
    readonly margin: import("..").Margin;
    readonly reverseStackOrder: false;
    readonly syncMethod: "index";
    readonly responsive: false;
    readonly cx: "50%";
    readonly cy: "50%";
    readonly innerRadius: 0;
    readonly outerRadius: "80%";
};
/**
 * @consumes ResponsiveContainerContext
 * @provides PolarViewBoxContext
 * @provides PolarChartContext
 */
export declare const RadarChart: <DataPointType = any>(props: PolarChartProps<DataPointType> & {
    ref?: React.Ref<SVGSVGElement>;
}) => React.ReactElement;
