import * as React from 'react';
import { ReactElement } from 'react';
import { Props as TrapezoidProps } from '../shape/Trapezoid';
import { ImplicitLabelListType } from '../component/LabelList';
import { ActiveShape, AnimationDuration, EasingInput, CartesianViewBoxRequired, ChartOffsetInternal, Coordinate, DataConsumer, DataKey, DataProvider, LegendType, PresentationAttributesAdaptChildEvent, ShapeAnimationProps, TooltipType, TrapezoidViewBox, CartesianLayout } from '../util/types';
import { TooltipPayload } from '../state/tooltipSlice';
import { Formatter } from '../component/DefaultTooltipContent';
import { AnimationInterpolateFn } from '../animation/AnimatedItems';
import { AnimationMatchByProp } from '../animation/matchBy';
import { GraphicalItemId } from '../state/graphicalItemsSlice';
export type FunnelTrapezoidItem = TrapezoidProps & TrapezoidViewBox & {
    value?: number | string;
    payload?: any;
    tooltipPosition: Coordinate;
    name: string;
    labelViewBox: TrapezoidViewBox;
    parentViewBox: CartesianViewBoxRequired;
    val: number | ReadonlyArray<number>;
    tooltipPayload: TooltipPayload;
};
/**
 * External props, intended for end users to fill in
 */
interface FunnelProps<DataPointType = any, DataValueType = any> extends DataProvider<DataPointType>, Required<DataConsumer<DataPointType, DataValueType>> {
    /**
     * This component is rendered when this graphical item is activated
     * (could be by mouse hover, touch, keyboard, programmatically).
     */
    activeShape?: ActiveShape<FunnelTrapezoidItem, SVGPathElement>;
    /**
     * Specifies when the animation should begin, the unit of this option is ms.
     * @defaultValue 400
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
    animationInterpolateFn?: AnimationInterpolateFn<FunnelTrapezoidItem, CartesianLayout>;
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
     *
     * @since 3.9
     * @see {@link https://recharts.github.io/en-US/guide/animations/ Animations guide}
     */
    animationMatchBy?: AnimationMatchByProp<FunnelTrapezoidItem>;
    className?: string;
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
     * If set false, animation of funnel will be disabled.
     * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     * @defaultValue auto
     */
    isAnimationActive?: boolean | 'auto';
    label?: ImplicitLabelListType;
    /**
     * @defaultValue triangle
     */
    lastShapeType?: 'triangle' | 'rectangle';
    /**
     * The type of icon in legend.  If set to 'none', no legend item will be rendered.
     * @defaultValue rect
     */
    legendType?: LegendType;
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
    nameKey?: DataKey<DataPointType, DataValueType>;
    /**
     * The customized event handler of animation end
     */
    onAnimationEnd?: () => void;
    /**
     * The customized event handler of animation start
     */
    onAnimationStart?: () => void;
    reversed?: boolean;
    /**
     * If set a ReactElement, the shape of funnel can be customized.
     * If set a function, the function will be called to render customized shape.
     * During animations, the function shape also receives `animationElapsedTime`, `isAnimating`, and `isEntrance`.
     * By default, renders a trapezoid.
     */
    shape?: ActiveShape<FunnelTrapezoidItem & ShapeAnimationProps, SVGPathElement>;
    tooltipType?: TooltipType;
    /**
     * Formats the value displayed in the tooltip for this Funnel.
     * When set, takes precedence over the `formatter` prop on the Tooltip component.
     */
    formatter?: Formatter;
    /**
     * The customized event handler of click on the area in this group
     */
    onClick?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousedown on the area in this group
     */
    onMouseDown?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseup on the area in this group
     */
    onMouseUp?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousemove on the area in this group
     */
    onMouseMove?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseover on the area in this group
     */
    onMouseOver?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseout on the area in this group
     */
    onMouseOut?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseenter on the area in this group
     */
    onMouseEnter?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseleave on the area in this group
     */
    onMouseLeave?: (data: FunnelTrapezoidItem, index: number, e: React.MouseEvent<SVGPathElement>) => void;
}
type FunnelSvgProps = Omit<PresentationAttributesAdaptChildEvent<FunnelTrapezoidItem, SVGPathElement>, 'ref'>;
export type Props<DataPointType = any, DataValueType = any> = FunnelSvgProps & FunnelProps<DataPointType, DataValueType>;
type RealFunnelData = unknown;
export declare const defaultFunnelProps: {
    readonly animationBegin: 400;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly animationInterpolateFn: AnimationInterpolateFn<FunnelTrapezoidItem, CartesianLayout>;
    readonly animationMatchBy: "append";
    readonly fill: "#808080";
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly lastShapeType: "triangle";
    readonly legendType: "rect";
    readonly nameKey: "name";
    readonly reversed: false;
    readonly shape: React.FC<TrapezoidProps>;
    readonly stroke: "#fff";
};
export declare function computeFunnelTrapezoids({ dataKey, nameKey, displayedData, tooltipType, lastShapeType, reversed, offset, customWidth, graphicalItemId, }: {
    dataKey: Props['dataKey'];
    nameKey: Props['nameKey'];
    offset: ChartOffsetInternal;
    displayedData: ReadonlyArray<RealFunnelData>;
    tooltipType?: TooltipType;
    lastShapeType?: Props['lastShapeType'];
    reversed?: boolean;
    customWidth: number | string | undefined;
    graphicalItemId: GraphicalItemId;
}): ReadonlyArray<FunnelTrapezoidItem>;
export declare const Funnel: {
    <DataPointType = any, DataValueType = any>(outsideProps: Props<DataPointType, DataValueType>): ReactElement;
    (outsideProps: Props<any, any>): ReactElement;
};
export {};
