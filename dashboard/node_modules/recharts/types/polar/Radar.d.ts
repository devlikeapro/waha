import * as React from 'react';
import { MouseEvent, ReactElement, SVGProps } from 'react';
import { ImplicitLabelListType } from '../component/LabelList';
import { ActiveDotType, AnimationDuration, DataConsumer, DataKey, DotType, EasingInput, LegendType, PolarLayout, TooltipType } from '../util/types';
import { AnimationInterpolateFn } from '../animation/AnimatedItems';
import { AnimationMatchByProp } from '../animation/matchBy';
import { RequiresDefaultProps } from '../util/resolveDefaultProps';
import { WithIdRequired } from '../util/useUniqueId';
import { ZIndexable } from '../zIndex/ZIndexLayer';
import { RechartsScale } from '../util/scale/RechartsScale';
export interface RadarPoint {
    x: number;
    y: number;
    cx?: number;
    cy?: number;
    angle: number;
    radius?: number;
    value?: number;
    payload?: any;
    name?: string | number;
}
interface RadarProps<DataPointType = any, DataValueType = any> extends ZIndexable, DataConsumer<DataPointType, DataValueType> {
    /**
     * @defaultValue true
     */
    activeDot?: ActiveDotType;
    /**
     * @defaultValue 0
     */
    angleAxisId?: string | number;
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
    animationInterpolateFn?: AnimationInterpolateFn<RadarPoint, PolarLayout>;
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
     */
    animationMatchBy?: AnimationMatchByProp<RadarPoint>;
    baseLinePoints?: RadarPoint[];
    className?: string;
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
     * @defaultValue false
     */
    hide?: boolean;
    /**
     * If set false, animation of polygon will be disabled.
     * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     * @defaultValue auto
     */
    isAnimationActive?: boolean | 'auto';
    isRange?: boolean;
    /**
     * Renders one label for each point. Options:
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
    /**
     * The customized event handler of animation end
     */
    onAnimationEnd?: () => void;
    /**
     * The customized event handler of animation start
     */
    onAnimationStart?: () => void;
    onMouseEnter?: (props: InternalRadarProps, e: MouseEvent<SVGPolygonElement>) => void;
    onMouseLeave?: (props: InternalRadarProps, e: MouseEvent<SVGPolygonElement>) => void;
    /**
     * @defaultValue 0
     */
    radiusAxisId?: string | number;
    /**
     * If set a ReactElement, the shape of radar can be customized.
     * If set a function, the function will be called to render customized shape.
     */
    shape?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>);
    tooltipType?: TooltipType;
    /**
     * @defaultValue 100
     */
    zIndex?: number;
}
export type RadiusAxisForRadar = {
    scale: RechartsScale;
};
export type AngleAxisForRadar = {
    scale: RechartsScale;
    type: 'number' | 'category';
    dataKey: DataKey<any> | undefined;
    cx: number;
    cy: number;
};
export type Props<DataPointType = any, DataValueType = any> = Omit<SVGProps<SVGGraphicsElement>, 'onMouseEnter' | 'onMouseLeave' | 'points' | 'ref'> & RadarProps<DataPointType, DataValueType>;
export type RadarComposedData = {
    points: RadarPoint[];
    baseLinePoints: RadarPoint[];
    isRange: boolean;
};
export declare function computeRadarPoints({ radiusAxis, angleAxis, displayedData, dataKey, bandSize, }: {
    radiusAxis: RadiusAxisForRadar;
    angleAxis: AngleAxisForRadar;
    displayedData: any[];
    dataKey: RadarProps['dataKey'];
    bandSize: number;
}): RadarComposedData;
export declare const defaultRadarProps: {
    readonly activeDot: true;
    readonly angleAxisId: 0;
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly animationMatchBy: "index";
    readonly animationInterpolateFn: AnimationInterpolateFn<RadarPoint, PolarLayout>;
    readonly dot: false;
    readonly hide: false;
    readonly isAnimationActive: "auto";
    readonly label: false;
    readonly legendType: "rect";
    readonly radiusAxisId: 0;
    readonly zIndex: 100;
};
type PropsWithDefaults = RequiresDefaultProps<Props, typeof defaultRadarProps>;
export type InternalRadarProps = WithIdRequired<PropsWithDefaults> & RadarComposedData;
/**
 * @consumes PolarChartContext
 * @provides LabelListContext
 */
export declare function Radar<DataPointType = any, DataValueType = any>(outsideProps: Props<DataPointType, DataValueType>): React.JSX.Element;
export declare namespace Radar {
    var displayName: string;
}
export {};
