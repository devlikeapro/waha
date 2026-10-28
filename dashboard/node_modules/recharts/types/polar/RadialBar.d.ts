import * as React from 'react';
import { ReactElement } from 'react';
import { Series } from 'victory-vendor/d3-shape';
import { RadialBarSectorProps } from '../util/RadialBarUtils';
import { Props as SectorProps } from '../shape/Sector';
import { ImplicitLabelListType } from '../component/LabelList';
import { BarPositionPosition } from '../util/ChartUtils';
import { ActiveShape, AnimationDuration, EasingInput, DataConsumer, DataKey, LayoutType, LegendType, PolarViewBoxRequired, PresentationAttributesAdaptChildEvent, TickItem, TooltipType, PolarLayout } from '../util/types';
import { TooltipTriggerInfo } from '../context/tooltipContext';
import { Formatter } from '../component/DefaultTooltipContent';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors';
import { ChartData } from '../state/chartDataSlice';
import { AnimationInterpolateFn } from '../animation/AnimatedItems';
import { AnimationMatchByProp } from '../animation/matchBy';
import { AxisId } from '../state/cartesianAxisSlice';
import { ZIndexable } from '../zIndex/ZIndexLayer';
export type RadialBarDataItem = SectorProps & PolarViewBoxRequired & TooltipTriggerInfo & {
    value?: any;
    payload?: any;
    background?: SectorProps;
};
type RadialBarBackground = boolean | (ActiveShape<SectorProps> & ZIndexable);
interface InternalRadialBarProps<DataPointType = any, DataValueType = any> extends DataConsumer<DataPointType, DataValueType>, ZIndexable {
    activeShape?: ActiveShape<RadialBarSectorProps, SVGPathElement>;
    /**
     * @defaultValue 0
     */
    angleAxisId?: AxisId;
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
    animationInterpolateFn?: AnimationInterpolateFn<RadialBarDataItem, PolarLayout>;
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
    animationMatchBy?: AnimationMatchByProp<RadialBarDataItem>;
    /**
     * Renders a background for each bar. Options:
     *  - `false`: no background;
     *  - `true`: renders default background;
     *  - `object`: the props of background rectangle;
     *  - `ReactElement`: a custom background element;
     *  - `function`: a render function of custom background.
     *
     * @defaultValue false
     */
    background?: RadialBarBackground;
    /**
     * The width or height of each bar. If the barSize is not specified, the size of the bar will be calculated by the barCategoryGap, barGap and the quantity of bar groups.
     */
    barSize?: number;
    className?: string;
    /**
     * @defaultValue false
     */
    cornerIsExternal?: boolean;
    /**
     * @defaultValue 0
     */
    cornerRadius?: string | number;
    /**
     * Calculated radial bar sectors
     */
    sectors: ReadonlyArray<RadialBarDataItem>;
    /**
     * @defaultValue false
     */
    forceCornerRadius?: boolean;
    /**
     * @defaultValue false
     */
    hide?: boolean;
    /**
     * If set false, animation of radial bars will be disabled.
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
     */
    label?: ImplicitLabelListType;
    /**
     * The type of icon in legend.  If set to 'none', no legend item will be rendered.
     * @defaultValue rect
     */
    legendType?: LegendType;
    maxBarSize?: number;
    /**
     * @defaultValue 0
     */
    minPointSize?: number;
    /**
     * The customized event handler of animation end
     */
    onAnimationEnd?: () => void;
    /**
     * The customized event handler of animation start
     */
    onAnimationStart?: () => void;
    /**
     * The customized event handler of click in this chart.
     */
    onClick?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mousedown in this chart.
     */
    onMouseDown?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseup in this chart.
     */
    onMouseUp?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mousemove in this chart.
     */
    onMouseMove?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseover in this chart.
     */
    onMouseOver?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseout in this chart.
     */
    onMouseOut?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseenter in this chart.
     */
    onMouseEnter?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseleave in this chart.
     */
    onMouseLeave?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    onTouchStart?: (data: RadialBarDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
    onTouchMove?: (data: RadialBarDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
    onTouchEnd?: (data: RadialBarDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
    /**
     * @defaultValue 0
     */
    radiusAxisId?: AxisId;
    /**
     * If set a ReactElement, the shape of radial bar sectors can be customized.
     * If set a function, the function will be called to render customized shape.
     * During animations, the function shape also receives `animationElapsedTime`, `isAnimating`, and `isEntrance`.
     * By default, renders a sector.
     */
    shape?: ActiveShape<RadialBarSectorProps, SVGPathElement>;
    stackId?: string | number;
    tooltipType?: TooltipType;
    /**
     * Formats the value displayed in the tooltip for this RadialBar.
     * When set, takes precedence over the `formatter` prop on the Tooltip component.
     */
    formatter?: Formatter;
    /**
     * @defaultValue 300
     */
    zIndex?: number;
}
export type RadialBarProps<DataPointType = any, DataValueType = any> = Omit<PresentationAttributesAdaptChildEvent<RadialBarDataItem, SVGElement>, 'ref' | keyof InternalRadialBarProps<DataPointType, DataValueType>> & Omit<InternalRadialBarProps<DataPointType, DataValueType>, 'sectors'>;
export declare const defaultRadialBarProps: {
    readonly angleAxisId: 0;
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly animationMatchBy: "append";
    readonly animationInterpolateFn: AnimationInterpolateFn<RadialBarDataItem, PolarLayout>;
    readonly background: false;
    readonly cornerIsExternal: false;
    readonly cornerRadius: 0;
    readonly forceCornerRadius: false;
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly label: false;
    readonly legendType: "rect";
    readonly minPointSize: 0;
    readonly radiusAxisId: 0;
    readonly shape: React.FC<SectorProps>;
    readonly zIndex: 300;
};
export declare function computeRadialBarDataItems({ displayedData, stackedData, dataStartIndex, stackedDomain, dataKey, baseValue, layout, radiusAxis, radiusAxisTicks, bandSize, pos, angleAxis, minPointSize, cx, cy, angleAxisTicks, cells, startAngle: rootStartAngle, endAngle: rootEndAngle, }: {
    displayedData: ChartData;
    stackedData: Series<Record<number, number>, DataKey<any>> | undefined;
    dataStartIndex: number;
    stackedDomain: ReadonlyArray<unknown> | null;
    dataKey: DataKey<any> | undefined;
    baseValue: number | unknown;
    layout: LayoutType;
    radiusAxis: BaseAxisWithScale;
    radiusAxisTicks: ReadonlyArray<TickItem> | undefined;
    bandSize: number;
    pos: BarPositionPosition;
    angleAxis: BaseAxisWithScale;
    minPointSize: number;
    cx: number;
    cy: number;
    angleAxisTicks: ReadonlyArray<TickItem> | undefined;
    cells: ReadonlyArray<ReactElement> | undefined;
    startAngle: number;
    endAngle: number;
}): ReadonlyArray<RadialBarDataItem>;
/**
 * @consumes PolarChartContext
 * @provides LabelListContext
 * @provides CellReader
 */
export declare function RadialBar<DataPointType = any, DataValueType = any>(outsideProps: RadialBarProps<DataPointType, DataValueType>): React.JSX.Element;
export declare namespace RadialBar {
    var displayName: string;
}
export {};
