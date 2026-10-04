import * as React from 'react';
import { CartesianChartProps } from '../util/types';
/**
 * @consumes ResponsiveContainerContext
 * @provides CartesianViewBoxContext
 * @provides CartesianChartContext
 */
export declare const ScatterChart: <DataPointType = any>(props: CartesianChartProps<DataPointType> & {
    ref?: React.Ref<SVGSVGElement>;
}) => React.ReactElement;
