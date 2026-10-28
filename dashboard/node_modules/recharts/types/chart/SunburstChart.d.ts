import * as React from 'react';
import { CSSProperties } from 'react';
import { Props as TextProps } from '../component/Text';
import { TooltipIndex, TooltipPayloadSearcher } from '../state/tooltipSlice';
import { DataKey, EventThrottlingProps, Percent } from '../util/types';
export interface SunburstData {
    [key: string]: any;
    name: string;
    value?: number;
    fill?: string;
    tooltipIndex?: TooltipIndex;
    children?: SunburstData[];
}
export interface SunburstChartProps extends EventThrottlingProps {
    className?: string;
    /**
     * The source data. Each element should be an object.
     * The properties of each object represent the values of different data dimensions.
     *
     * Use the `dataKey` prop to specify which properties to use.
     *
     * @example data={[{ name: 'a', value: 12, fill: '#8884d8' }, { name: 'b', value: 5, fill: '#83a6ed' }]}
     */
    data: SunburstData;
    /**
     * The width of chart container.
     * Can be a number or a percent string like "100%".
     *
     * @see {@link https://recharts.github.io/en-US/guide/sizes/ Chart sizing guide}
     */
    width?: number | Percent;
    /**
     * The height of chart container.
     * Can be a number or a percent string like "100%".
     *
     * @see {@link https://recharts.github.io/en-US/guide/sizes/ Chart sizing guide}
     */
    height?: number | Percent;
    /**
     * If true, then it will listen to container size changes and adapt the SVG chart accordingly.
     * If false, then it renders the chart at the specified width and height and will stay that way
     * even if the container size changes.
     *
     * This is similar to ResponsiveContainer but without the need for an extra wrapper component.
     * The `responsive` prop also uses standard CSS sizing rules, instead of custom resolution logic (like ResponsiveContainer does).
     * @default false
     */
    responsive?: boolean;
    /**
     * Distance between sectors.
     *
     * @defaultValue 2
     */
    padding?: number;
    /**
     * Decides how to extract value from the data.
     *
     * @defaultValue value
     */
    dataKey?: string;
    /**
     * Name represents each sector in the tooltip.
     * This allows you to extract the name from the data:
     *
     * - `string`: the name of the field in the data object;
     * - `number`: the index of the field in the data;
     * - `function`: a function that receives the data object and returns the name.
     *
     * @defaultValue name
     */
    nameKey?: DataKey<any>;
    /**
     * Padding between each hierarchical level.
     */
    ringPadding?: number;
    /**
     * The radius of the inner circle at the center of the chart.
     *
     * @defaultValue 50
     */
    innerRadius?: number;
    /**
     * Outermost edge of the chart.
     * Defaults to the max possible radius for a circle inscribed in the chart container
     */
    outerRadius?: number;
    /**
     * The x-coordinate of center in pixels.
     * If undefined, it will be set to half of the chart width.
     */
    cx?: number;
    /**
     * The y-coordinate of center in pixels.
     * If undefined, it will be set to half of the chart height.
     */
    cy?: number;
    /** Angle in degrees from which the chart should start. */
    startAngle?: number;
    /** Angle, in degrees, at which the chart should end. */
    endAngle?: number;
    children?: React.ReactNode;
    fill?: string;
    stroke?: string;
    /**
     * An object with svg text options to control the appearance of the chart labels.
     */
    textOptions?: TextProps;
    onMouseEnter?: (node: SunburstData, e: React.MouseEvent) => void;
    onMouseLeave?: (node: SunburstData, e: React.MouseEvent) => void;
    onClick?: (node: SunburstData) => void;
    style?: CSSProperties;
    id?: string;
}
export declare const payloadSearcher: TooltipPayloadSearcher;
export declare const defaultSunburstChartProps: {
    readonly throttleDelay: number | "raf";
    readonly throttledEvents: ReadonlyArray<keyof GlobalEventHandlersEventMap> | "all";
    readonly padding: 2;
    readonly dataKey: "value";
    readonly nameKey: "name";
    readonly ringPadding: 2;
    readonly innerRadius: 50;
    readonly fill: "#333";
    readonly stroke: "#FFF";
    readonly textOptions: {
        fontWeight: string;
        paintOrder: string;
        fontSize: string;
        stroke: string;
        fill: string;
        pointerEvents: string;
    };
    readonly startAngle: 0;
    readonly endAngle: 360;
    readonly responsive: false;
};
/**
 * The sunburst is a hierarchical chart, similar to a {@link Treemap}, plotted in polar coordinates.
 * Sunburst charts effectively convey the hierarchical relationships and proportions within each level.
 * It is easy to see all the middle layers in the hierarchy, which might get lost in other visualizations.
 * For some datasets, the radial layout may be more visually appealing and intuitive than a traditional {@link Treemap}.
 *
 * @consumes ResponsiveContainerContext
 * @provides TooltipEntrySettings
 */
export declare const SunburstChart: (outsideProps: SunburstChartProps) => React.JSX.Element;
