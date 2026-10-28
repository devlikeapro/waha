import { ReactElement } from 'react';
import { CurveType, Props as CurveProps } from '../shape/Curve';
import { LineDrawShape, LineDrawShapeProps } from './LineDrawShape';
import { ImplicitLabelListType } from '../component/LabelList';
import { ActiveDotType, ActiveShape, AnimationDuration, CartesianLayout, DataConsumer, DataProvider, DotType, EasingInput, LegendType, TickItem, TooltipType } from '../util/types';
import { Formatter } from '../component/DefaultTooltipContent';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors';
import { AxisId } from '../state/cartesianAxisSlice';
import { AnimationInterpolateFn } from '../animation/AnimatedItems';
import { AnimationMatchByProp } from '../animation/matchBy';
import { ZIndexable } from '../zIndex/ZIndexLayer';
import { ChartData } from '../state/chartDataSlice';
export interface LinePointItem {
    readonly value: number;
    readonly payload?: any;
    /**
     * Line coordinates can have gaps in them. We have `connectNulls` prop that allows to connect those gaps anyway.
     * What it means is that some points can have `null` x or y coordinates.
     */
    x: number | null;
    y: number | null;
}
/**
 * External props, intended for end users to fill in
 */
interface LineProps<DataPointType = any, DataValueType = any> extends DataProvider<DataPointType>, DataConsumer<DataPointType, DataValueType>, ZIndexable {
    /**
     * The active dot is rendered on the closest data point when user interacts with the chart. Options:
     *
     * - `false`: dots do not change on user activity; both active and inactive dots follow the `dot` prop (see below)
     * - `true`: renders the active dot with default settings
     * - `object`: the props of the active dot. This will be merged with the internal calculated props of the active dot
     * - `ReactElement`: the custom active dot element
     * - `function`: a render function of the custom active dot
     *
     * @defaultValue true
     * @example <Line dataKey="value" activeDot={false} />
     * @example <Line dataKey="value" activeDot={{ stroke: 'red', strokeWidth: 2, r: 10 }} />
     * @example <Line dataKey="value" activeDot={CustomizedActiveDot} />
     *
     * @see {@link https://recharts.github.io/en-US/examples/SimpleLineChart/ A line chart with customized active dot}
     */
    activeDot?: ActiveDotType;
    /**
     * @defaultValue true
     */
    animateNewValues?: boolean;
    /**
     * Specifies when the animation should begin, the unit of this option is ms.
     * @defaultValue 0
     */
    animationBegin?: number;
    /**
     * Specifies the duration of animation, the unit of this option is ms.
     * @defaultValue 1500
     */
    animationDuration?: AnimationDuration;
    /**
     * The type of easing function.
     * @defaultValue ease
     */
    animationEasing?: EasingInput;
    /**
     * Custom animation function for interpolating data items.
     * When provided, this replaces the default animation interpolation.
     *
     * @param prevItems The items from the previous animation frame, or null on first render
     * @param nextItems The target items to animate towards
     * @param animationElapsedTime A normalized time value (0 = start, 1 = end)
     * @returns The interpolated items at time animationElapsedTime
     *
     * @since 3.9
     * @see {@link https://recharts.github.io/en-US/guide/animations/ Animations guide}
     */
    animationInterpolateFn?: AnimationInterpolateFn<LinePointItem, CartesianLayout>;
    /**
     * Strategy for matching previous items to next items during animation.
     * Determines how Recharts pairs old data points with new data points
     * to create smooth transitions.
     *
     * - `matchByIndex` (default): match by array position with proportional stretching
     * - `matchAppend`: match sequentially by index and treat newly appended items as new
     * - `matchByDataKey('someKey')`: match by a data key from the payload
     * - Custom function `(item, index) => key`: match by the returned key
     *
     * @defaultValue index
     * @see matchByIndex
     * @see matchByDataKey
     * @see matchAppend
     *
     * @since 3.9
     * @see {@link https://recharts.github.io/en-US/guide/animations/ Animations guide}
     */
    animationMatchBy?: AnimationMatchByProp<LinePointItem>;
    className?: string;
    /**
     * Whether to connect the line across null points.
     * @defaultValue false
     *
     * @see {@link https://recharts.github.io/en-US/examples/LineChartConnectNulls/ LineChart with connectNull true and false}
     */
    connectNulls?: boolean;
    /**
     * Renders a circle element at each data point. Options:
     *
     * - `false`: no dots are drawn;
     * - `true`: renders the dots with default settings;
     * - `object`: the props of the dot. This will be merged with the internal calculated props of each dot;
     * - `ReactElement`: the custom dot element;
     * - `function`: a render function of the custom dot.
     *
     * @defaultValue true
     *
     * @example <Line dataKey="value" dot={false} />
     * @example <Line dataKey="value" dot={{ stroke: 'red', strokeWidth: 2 }} />
     * @example <Line dataKey="value" dot={CustomizedDot} />
     *
     * @see {@link https://recharts.github.io/en-US/examples/CustomizedDotLineChart/ A line chart with customized dot}
     */
    dot?: DotType;
    /**
     * Hides the whole graphical element when true.
     *
     * Hiding an element is different from removing it from the chart:
     * Hidden graphical elements are still visible in Legend,
     * and can be included in axis domain calculations,
     * depending on `includeHidden` props of your XAxis/YAxis.
     *
     * @defaultValue false
     */
    hide?: boolean;
    /**
     * Unique identifier of this component.
     * Used as an HTML attribute `id`, and also to identify this element internally.
     *
     * If undefined, Recharts will generate a unique ID automatically.
     */
    id?: string;
    /**
     * If set false, animation of line will be disabled.
     * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     * @defaultValue auto
     */
    isAnimationActive?: boolean | 'auto';
    /**
     * Renders one label for each data point. Options:
     * - `true`: renders default labels;
     * - `false`: no labels are rendered;
     * - `object`: the props of LabelList component;
     * - `ReactElement`: a custom SVG label element, such as `<text>` or `<g>`.
     *   HTML elements such as `<div>` are not valid inside the chart SVG and may trigger React DOM warnings.
     * - `function`: a render function of custom label.
     *
     * @defaultValue false
     * @example <Line dataKey="value" label />
     * @example <Line dataKey="value" label={{ fill: 'red', fontSize: 20 }} />
     * @example <Line dataKey="value" label={CustomizedLabel} />
     *
     * @see {@link https://recharts.github.io/en-US/examples/CustomizedLabelLineChart/ A line chart with customized label}
     */
    label?: ImplicitLabelListType;
    /**
     * The type of icon in legend.
     * If set to 'none', no legend item will be rendered.
     * @defaultValue line
     */
    legendType?: LegendType;
    /**
     * If set a ReactElement, the shape of line can be customized.
     * If set a function, the function will be called to render customized shape.
     *
     * During animations the shape receives additional props: `animationElapsedTime`, `isAnimating`, and `isEntrance`.
     * When a custom shape is provided, the built-in stroke-dasharray entrance animation is skipped.
     *
     * @example <Line dataKey="value" shape={CustomizedShapeComponent} />
     * @example <Line dataKey="value" shape={renderShapeFunction} />
     */
    shape?: ActiveShape<LineDrawShapeProps, SVGPathElement>;
    /**
     * The name of data.
     * This option will be used in tooltip and legend to represent this graphical item.
     * If no value was set to this option, the value of dataKey will be used alternatively.
     */
    name?: string | number;
    /**
     * The customized event handler of animation end
     */
    onAnimationEnd?: () => void;
    /**
     * The customized event handler of animation start
     */
    onAnimationStart?: () => void;
    tooltipType?: TooltipType;
    /**
     * The interpolation type of curve. Allows custom interpolation function.
     *
     * @defaultValue linear
     * @link https://d3js.org/d3-shape/curve
     * @see {@link https://recharts.github.io/en-US/examples/CardinalAreaChart/ An AreaChart which has two area with different interpolation.}
     */
    type?: CurveType;
    /**
     * The unit of data. This option will be used in tooltip.
     */
    unit?: string | number | null;
    /**
     * Formats the value displayed in the tooltip for this Line.
     * When set, takes precedence over the `formatter` prop on the Tooltip component.
     */
    formatter?: Formatter;
    /**
     * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
     * @defaultValue 0
     */
    xAxisId?: AxisId;
    /**
     * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
     * @defaultValue 0
     */
    yAxisId?: AxisId;
    /**
     * Z-Index of this component and its children. The higher the value,
     * the more on top it will be rendered.
     * Components with higher zIndex will appear in front of components with lower zIndex.
     * If undefined or 0, the content is rendered in the default layer without portals.
     *
     * @since 3.4
     * @defaultValue 400
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
    /**
     * The stroke color. If `"none"`, no line will be drawn.
     *
     * @defaultValue #3182bd
     */
    stroke?: string;
    /**
     * The width of the stroke
     *
     * @defaultValue 1
     */
    strokeWidth?: string | number;
    /**
     * The pattern of dashes and gaps used to paint the line
     *
     * @example <Line strokeDasharray="4" />
     * @example <Line strokeDasharray="4 1" />
     * @example <Line strokeDasharray="4 1 2" />
     */
    strokeDasharray?: string | number;
}
export declare const defaultLineProps: {
    readonly activeDot: true;
    readonly animateNewValues: true;
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly animationInterpolateFn: AnimationInterpolateFn<LinePointItem, CartesianLayout>;
    readonly animationMatchBy: "index";
    readonly connectNulls: false;
    readonly dot: true;
    readonly fill: "#fff";
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly label: false;
    readonly legendType: "line";
    readonly shape: typeof LineDrawShape;
    readonly stroke: "#3182bd";
    readonly strokeWidth: 1;
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly zIndex: 400;
    readonly type: "linear";
};
/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */
type LineSvgProps = Omit<CurveProps, 'points' | 'pathRef' | 'ref' | 'layout' | 'baseLine'>;
export type Props<DataPointType = any, ValueAxisType = any> = LineSvgProps & LineProps<DataPointType, ValueAxisType>;
export declare function computeLinePoints({ layout, xAxis, yAxis, xAxisTicks, yAxisTicks, dataKey, bandSize, displayedData, }: {
    layout: CartesianLayout;
    xAxis: BaseAxisWithScale;
    yAxis: BaseAxisWithScale;
    xAxisTicks: TickItem[];
    yAxisTicks: TickItem[];
    dataKey: Props['dataKey'];
    bandSize: number;
    displayedData: ChartData;
}): ReadonlyArray<LinePointItem>;
/**
 * @provides LabelListContext
 * @provides ErrorBarContext
 * @consumes CartesianChartContext
 */
export declare const Line: {
    <DataPointType = any, ValueAxisType = any>(props: Props<DataPointType, ValueAxisType>): ReactElement;
    (props: Props<any, any>): ReactElement;
};
export {};
