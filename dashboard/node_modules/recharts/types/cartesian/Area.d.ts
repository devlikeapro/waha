import { ReactElement } from 'react';
import { CurveType, Props as CurveProps } from '../shape/Curve';
import { ImplicitLabelListType } from '../component/LabelList';
import { StackId } from '../util/ChartUtils';
import { ActiveDotType, ActiveShape, AnimationDuration, CartesianLayout, DataConsumer, DataKey, DataProvider, DotType, EasingInput, LegendType, TickItem, TooltipType } from '../util/types';
import { Formatter } from '../component/DefaultTooltipContent';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors';
import { ChartData } from '../state/chartDataSlice';
import { AreaPointItem, ComputedArea } from '../state/selectors/areaSelectors';
import { AnimationInterpolateFn } from '../animation/AnimatedItems';
import { AnimationMatchByProp } from '../animation/matchBy';
import { AreaSettings } from '../state/types/AreaSettings';
import { ZIndexable } from '../zIndex/ZIndexLayer';
import { AxisId } from '../state/cartesianAxisSlice';
import { StackDataPoint } from '../util/stacks/stackTypes';
import { AreaRevealShape, AreaRevealShapeProps } from './AreaRevealShape';
/**
 * @inline
 */
export type BaseValue = number | 'dataMin' | 'dataMax';
/**
 * External props, intended for end users to fill in
 */
interface AreaProps<DataPointType = any, DataValueType = any> extends DataProvider<DataPointType>, Required<DataConsumer<DataPointType, DataValueType>>, ZIndexable {
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
     * @example <Area dataKey="value" activeDot={false} />
     * @example <Area dataKey="value" activeDot={{ stroke: 'red', strokeWidth: 2, r: 10 }} />
     * @example <Area dataKey="value" activeDot={CustomizedActiveDot} />
     *
     * @see {@link https://recharts.github.io/en-US/examples/SimpleLineChart/ A line chart with customized active dot}
     */
    activeDot?: ActiveDotType;
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
     * @defaultValue 'ease'
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
    animationInterpolateFn?: AnimationInterpolateFn<AreaPointItem, CartesianLayout>;
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
    animationMatchBy?: AnimationMatchByProp<AreaPointItem>;
    /**
     * Configures the starting value used to build the internal baseline for non-ranged, non-stacked areas.
     *
     * WARNING despite the name `dataMin`|`dataMax` this actually reads the domain instead, so it should rather be
     * `domainMin`|`domainMax`. This looks like a small detail,
     * but it's actually important because domains are usually extended automatically.
     * For example the default numerical domain starts from 0.
     *
     * - `number`: uses the corresponding axis value as a flat baseline
     * - `dataMin`: uses the minimum of the value-axis domain
     * - `dataMax`: uses the maximum of the value-axis domain
     *
     * Ignored when the area is stacked or when `dataKey` already returns `[min, max]` tuples.
     *
     * Note that the baseValue does not interact with `animationInterpolateFn`;
     * baseValue is always animated by linear interpolation.
     * If you want a custom animation then have your `dataKey` return a tuple of two values instead of a single number
     * which will also render a ranged Area, and that does work with your custom `animationInterpolateFn`.
     */
    baseValue?: BaseValue;
    className?: string;
    /**
     * Whether to connect the area across null points.
     *
     * @defaultValue false
     * @see {@link https://recharts.github.io/en-US/examples/AreaChartConnectNulls/ AreaChart with connectNull true and false}
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
     * @defaultValue false
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
     * If set false, animation of area will be disabled.
     * If set "auto", will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     * @defaultValue 'auto'
     */
    isAnimationActive?: boolean | 'auto';
    /**
     * Renders one label for each data point. Options:
     *
     * - `true`: renders default labels
     * - `false`: no labels are rendered
     * - `object`: the props of LabelList component
     * - `ReactElement`: a custom SVG label element, such as `<text>` or `<g>`.
     *   HTML elements such as `<div>` are not valid inside the chart SVG and may trigger React DOM warnings.
     * - `function`: a render function of custom label
     *
     * @defaultValue false
     */
    label?: ImplicitLabelListType;
    /**
     * The type of icon in legend.
     * If set to 'none', no legend item will be rendered.
     * @defaultValue 'line'
     */
    legendType?: LegendType;
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
    /**
     * If set a ReactElement, the shape of area can be customized.
     * If set a function, the function will be called to render customized shape.
     * By default, renders a filled curve path with a clipPath entrance animation.
     *
     * During animations the shape receives additional props: `animationElapsedTime`, `isAnimating`, and `isEntrance`.
     * When a custom shape is provided, the built-in clipPath entrance animation is skipped.
     *
     * @see AreaRevealShape — the default entrance animation, available for import from recharts
     * @example <Area dataKey="value" shape={CustomizedShapeComponent} />
     * @example <Area dataKey="value" shape={renderShapeFunction} />
     */
    shape?: ActiveShape<AreaRevealShapeProps, SVGPathElement>;
    /**
     * When two Areas have the same axisId and same stackId, then the two Areas are stacked in the chart.
     */
    stackId?: StackId;
    /**
     * The stroke color. If "none", no line will be drawn.
     * @defaultValue '#3182bd'
     */
    stroke?: string;
    /**
     * The width of the stroke
     * @defaultValue 1
     */
    strokeWidth?: string | number;
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
    unit?: string | number;
    /**
     * Formats the value displayed in the tooltip for this Area.
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
     * @defaultValue 100
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
}
export declare const defaultAreaProps: {
    readonly activeDot: true;
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly animationMatchBy: "index";
    readonly animationInterpolateFn: AnimationInterpolateFn<AreaPointItem, CartesianLayout>;
    readonly connectNulls: false;
    readonly dot: false;
    readonly fill: "#3182bd";
    readonly fillOpacity: 0.6;
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly legendType: "line";
    readonly stroke: "#3182bd";
    readonly strokeWidth: 1;
    readonly type: "linear";
    readonly label: false;
    readonly shape: typeof AreaRevealShape;
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly zIndex: 100;
};
/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */
type AreaSvgProps = Omit<CurveProps, 'points' | 'ref' | 'layout' | 'path' | 'pathRef' | 'baseLine' | 'dangerouslySetInnerHTML'>;
export type Props<DataPointType, ValueAxisType> = AreaSvgProps & AreaProps<DataPointType, ValueAxisType>;
export declare const getBaseValue: (layout: "horizontal" | "vertical", chartBaseValue: BaseValue | undefined, itemBaseValue: BaseValue | undefined, xAxis: BaseAxisWithScale, yAxis: BaseAxisWithScale) => number;
export declare function computeArea({ areaSettings: { connectNulls, baseValue: itemBaseValue, dataKey }, stackedData, layout, chartBaseValue, xAxis, yAxis, displayedData, dataStartIndex, xAxisTicks, yAxisTicks, bandSize, stackDataKeys, }: {
    areaSettings: AreaSettings;
    stackedData: ReadonlyArray<StackDataPoint> | undefined;
    layout: 'horizontal' | 'vertical';
    chartBaseValue: BaseValue | undefined;
    xAxis: BaseAxisWithScale;
    yAxis: BaseAxisWithScale;
    displayedData: ChartData;
    dataStartIndex: number;
    xAxisTicks: TickItem[];
    yAxisTicks: TickItem[];
    bandSize: number;
    stackDataKeys?: ReadonlyArray<DataKey<unknown>>;
}): ComputedArea;
/**
 * @provides LabelListContext
 * @consumes CartesianChartContext
 */
export declare const Area: <DataPointType = any, ValueAxisType = any>(props: Props<DataPointType, ValueAxisType>) => ReactElement;
export {};
