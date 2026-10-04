import * as React from 'react';
import { Key, ReactElement } from 'react';
import { Series } from 'victory-vendor/d3-shape';
import { Props as RectangleProps, RectRadius } from '../shape/Rectangle';
import { ImplicitLabelListType } from '../component/LabelList';
import { BarPositionPosition, StackId } from '../util/ChartUtils';
import { ActiveShape, AnimationDuration, CartesianLayout, CartesianViewBoxRequired, ChartOffsetInternal, Coordinate, DataConsumer, DataKey, LegendType, PresentationAttributesAdaptChildEvent, ShapeAnimationProps, TickItem, TooltipType } from '../util/types';
import { MinPointSize } from '../util/BarUtils';
import { Formatter } from '../component/DefaultTooltipContent';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors';
import { BarSettings } from '../state/types/BarSettings';
import { AnimationInterpolateFn } from '../animation/AnimatedItems';
import { AnimationMatchByProp } from '../animation/matchBy';
import { EasingInput } from '../animation/easing';
import { ZIndexable } from '../zIndex/ZIndexLayer';
import { AxisId } from '../state/cartesianAxisSlice';
import { ChartData } from '../state/chartDataSlice';
type BarRectangleType = {
    x: number | null;
    y: number | null;
    width: number;
    height: number;
};
export interface BarRectangleItem extends RectangleProps {
    value: number | [number, number];
    /** the coordinate of background rectangle */
    background?: BarRectangleType;
    tooltipPosition: Coordinate;
    readonly payload?: any;
    parentViewBox: CartesianViewBoxRequired;
    x: number;
    y: number;
    width: number;
    height: number;
    /**
     * Chart range coordinate of the baseValue of the first bar in a stack.
     */
    stackedBarStart: number;
    /**
     * Stable pre-filter index within the currently displayed data slice.
     * Used for matching with activeIndex from tooltip and for BarStack clip-path indexing.
     */
    originalDataIndex: number;
}
export type BarShapeProps = BarRectangleItem & ShapeAnimationProps & {
    isActive: boolean;
    index: number;
};
interface BarProps<DataPointType, ValueAxisType> extends DataConsumer<DataPointType, ValueAxisType>, ZIndexable {
    className?: string;
    index?: Key;
    /**
     * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
     *
     * @defaultValue 0
     */
    xAxisId?: AxisId;
    /**
     * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
     *
     * @defaultValue 0
     */
    yAxisId?: AxisId;
    /**
     * When two Bars have the same axisId and same stackId, then the two Bars are stacked in the chart.
     *
     * @see {@link https://recharts.github.io/en-US/examples/StackedBarChart/ Stacked bar chart example}
     * @see {@link https://recharts.github.io/en-US/examples/MixBarChart/ Chart with both stacked and non-stacked bars}
     * @see {@link BarStack}
     */
    stackId?: StackId;
    /**
     * The width or height of each bar. If the barSize is not specified, the size of bar will be calculated by the barCategoryGap, barGap and the quantity of bar groups.
     */
    barSize?: string | number;
    /**
     * The unit of data. This option will be used in tooltip.
     */
    unit?: string | number;
    /**
     * The name of data.
     * This option will be used in tooltip and legend to represent a bar.
     * If no value was set to this option, the value of dataKey will be used alternatively.
     */
    name?: string | number;
    tooltipType?: TooltipType;
    /**
     * Formats the value displayed in the tooltip for this Bar.
     * When set, takes precedence over the `formatter` prop on the Tooltip component.
     */
    formatter?: Formatter;
    /**
     * The type of icon in legend. If set to 'none', no legend item will be rendered.
     *
     * @defaultValue rect
     */
    legendType?: LegendType;
    /**
     * The minimal height of a bar in a horizontal chart, or the minimal width of a bar in a vertical chart.
     *
     * By default, 0 values are not shown.
     * To visualize a 0 (or close to zero) point, set the minimal point size to a pixel value like 3.
     *
     * In stacked bar charts, minPointSize might not be respected for tightly packed values.
     * So we strongly recommend not using this props in stacked BarChart.
     *
     * You may provide a function to conditionally change this prop based on Bar value.
     *
     * @defaultValue 0
     *
     * @see {@link https://recharts.github.io/en-US/examples/BarChartWithMinHeight/ Chart with min bar height}
     */
    minPointSize?: MinPointSize;
    /**
     * The maximum width of bar in a horizontal chart, or maximum height in a vertical chart.
     */
    maxBarSize?: number;
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
     * If set a ReactElement, the shape of bar can be customized.
     * If set a function, the function will be called to render customized shape.
     * During animations, the function shape also receives `animationElapsedTime`, `isAnimating`, and `isEntrance`.
     * By default, renders a rectangle.
     *
     * @see {@link https://recharts.github.io/en-US/examples/CustomShapeBarChart/ Custom shape bar chart example}
     */
    shape?: ActiveShape<BarShapeProps, SVGPathElement>;
    /**
     * The active bar is shown when a user enters a bar chart and this chart has tooltip. Options:
     * - `false`: all bars are passive, nothing happens on mouse events;
     * - `true`: active bar is rendered separately but the default props are the same as others: so mouse events do not change its appearance. className and zIndex are different though;
     * - `object`: the props of active bar;
     * - `function`: the render function of active bar;
     * - `ReactElement`: the active bar element.
     *
     * @defaultValue false
     *
     * @see {@link https://recharts.github.io/en-US/examples/SimpleBarChart/ activeBar example}
     *
     * @example <Bar activeBar={{ fill: 'red' }} />
     * @example <Bar activeBar={CustomActiveBarFn} />
     */
    activeBar?: ActiveShape<BarShapeProps, SVGPathElement>;
    /**
     * Renders a background for each bar. Options:
     *  - `false`: no background;
     *  - `true`: renders default background;
     *  - `object`: the props of background rectangle;
     *  - `ReactElement`: a custom background element;
     *  - `function`: a render function of custom background.
     *
     * @defaultValue false
     *
     * @see {@link https://recharts.github.io/en-US/examples/BarChartHasBackground/ BarChart with background example}
     */
    background?: ActiveShape<BarShapeProps, SVGPathElement> & ZIndexable;
    /**
     * The radius of corners.
     *
     * If you provide a single number, it applies to all four corners.
     * If you provide an array of four numbers, they apply to top-left, top-right, bottom-right, bottom-left corners respectively.
     *
     * @see {@link https://recharts.github.io/en-US/guide/roundedBars/ Guide: Rounded bar corners}
     */
    radius?: RectRadius;
    /**
     * The customized event handler of animation start
     */
    onAnimationStart?: () => void;
    /**
     * The customized event handler of animation end
     */
    onAnimationEnd?: () => void;
    /**
     * If set false, animation of bar will be disabled.
     * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     *
     * @defaultValue auto
     */
    isAnimationActive?: boolean | 'auto';
    /**
     * Specifies when the animation should begin, the unit of this option is ms.
     * @defaultValue 0
     */
    animationBegin?: number;
    /**
     * Specifies the duration of animation, the unit of this option is ms.
     *
     * @defaultValue 400
     */
    animationDuration?: AnimationDuration;
    /**
     * The type of easing function.
     *
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
    animationInterpolateFn?: AnimationInterpolateFn<BarRectangleItem, CartesianLayout>;
    /**
     * Strategy for matching previous items to next items during animation.
     * Determines how Recharts pairs old data points with new data points
     * to create smooth transitions.
     *
     * - `matchAppend` (default): match sequentially by index and treat newly appended items as new
     * - `matchByIndex`: match by array position with proportional stretching
     * - `matchByDataKey('someKey')`: match by a data key from the payload
     * - Custom function `(item, index) => key`: match by the returned key
     *
     * @defaultValue append
     * @see matchByIndex
     * @see matchByDataKey
     * @see matchAppend
     */
    animationMatchBy?: AnimationMatchByProp<BarRectangleItem>;
    /**
     * The unique identifier of this component.
     * Used as an HTML attribute `id`, and also to identify this element internally.
     *
     * If undefined, Recharts will generate a unique ID automatically.
     */
    id?: string;
    /**
     * Renders one label for each bar. Options:
     * - `true`: renders default labels;
     * - `false`: no labels are rendered;
     * - `object`: the props of LabelList component;
     * - `ReactElement`: a custom SVG label element, such as `<text>` or `<g>`.
     *   HTML elements such as `<div>` are not valid inside the chart SVG and may trigger React DOM warnings.
     * - `function`: a render function of custom label.
     *
     * @defaultValue false
     *
     * @example <Bar label />
     * @example <Bar label={{ position: 'top', fontSize: 20 }} />
     * @example <Bar label={CustomizedLabelFn} />
     */
    label?: ImplicitLabelListType;
    /**
     * Z-Index of this component and its children. The higher the value,
     * the more on top it will be rendered.
     * Components with higher zIndex will appear in front of components with lower zIndex.
     * If undefined or 0, the content is rendered in the default layer without portals.
     *
     * @since 3.4
     * @defaultValue 300
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
}
type BarMouseEvent = (data: BarRectangleItem, index: number, event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
interface BarEvents {
    /**
     * The customized event handler of click on the bars in this group
     *
     * @see {@link https://recharts.github.io/en-US/examples/BarChartWithCustomizedEvent/ Chart with customized event example}
     */
    onClick: BarMouseEvent;
    /**
     * The customized event handler of mouseenter on the bars in this group
     */
    onMouseEnter: BarMouseEvent;
    /**
     * The customized event handler of mouseleave on the bars in this group
     */
    onMouseLeave: BarMouseEvent;
    /**
     * The customized event handler of mousemove on the bars in this group
     */
    onMouseMove: BarMouseEvent;
    /**
     * The customized event handler of mousedown on the bars in this group
     */
    onMouseDown: BarMouseEvent;
    /**
     * The customized event handler of mouseup on the bars in this group
     */
    onMouseUp: BarMouseEvent;
    /**
     * The customized event handler of mouseover on the bars in this group
     */
    onMouseOver: BarMouseEvent;
    /**
     * The customized event handler of mouseout on the bars in this group
     */
    onMouseOut: BarMouseEvent;
}
type BarSvgProps = Omit<PresentationAttributesAdaptChildEvent<BarRectangleItem, SVGPathElement>, 'radius' | 'name' | 'ref'>;
export type Props<DataPointType = any, ValueAxisType = any> = Partial<BarEvents> & BarProps<DataPointType, ValueAxisType> & Omit<BarSvgProps, keyof BarEvents>;
export declare const defaultBarProps: {
    readonly activeBar: false;
    readonly animationBegin: 0;
    readonly animationDuration: 400;
    readonly animationEasing: "ease";
    readonly animationInterpolateFn: AnimationInterpolateFn<BarRectangleItem, CartesianLayout>;
    readonly animationMatchBy: "append";
    readonly background: false;
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly label: false;
    readonly legendType: "rect";
    readonly minPointSize: number;
    readonly shape: React.FC<RectangleProps>;
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly zIndex: 300;
};
export declare function computeBarRectangles({ layout, barSettings: { dataKey, minPointSize: minPointSizeProp, hasCustomShape }, pos, bandSize, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, displayedData, offset, cells, parentViewBox, dataStartIndex, }: {
    layout: 'horizontal' | 'vertical';
    barSettings: BarSettings;
    pos: BarPositionPosition;
    bandSize: number;
    xAxis: BaseAxisWithScale;
    yAxis: BaseAxisWithScale;
    xAxisTicks: TickItem[];
    yAxisTicks: TickItem[];
    stackedData: Series<Record<number, number>, DataKey<any>> | undefined;
    offset: ChartOffsetInternal;
    displayedData: ChartData;
    cells: ReadonlyArray<ReactElement> | undefined;
    parentViewBox: CartesianViewBoxRequired;
    dataStartIndex: number;
}): ReadonlyArray<BarRectangleItem> | undefined;
/**
 * @provides ErrorBarContext
 * @provides LabelListContext
 * @provides CellReader
 * @consumes CartesianChartContext
 * @consumes BarStackContext
 */
export declare const Bar: <DataPointType = any, ValueAxisType = any>(props: Props<DataPointType, ValueAxisType>) => ReactElement;
export {};
