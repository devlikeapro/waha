import * as React from 'react';
import { ReactElement, ReactNode, SVGProps } from 'react';
import { ActiveShape, AnimationDuration, ChartOffsetInternal, Coordinate, DataConsumer, DataKey, DataProvider, EasingInput, GeometrySector, LegendType, PolarLayout, PresentationAttributesAdaptChildEvent, ShapeAnimationProps, TooltipType } from '../util/types';
import { TooltipTriggerInfo } from '../context/tooltipContext';
import { Formatter } from '../component/DefaultTooltipContent';
import { DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME, DATA_ITEM_INDEX_ATTRIBUTE_NAME } from '../util/Constants';
import { AnimationInterpolateFn } from '../animation/AnimatedItems';
import { AnimationMatchByProp } from '../animation/matchBy';
import { PiePresentationProps, PieSettings } from '../state/types/PieSettings';
import { SVGPropsNoEvents } from '../util/svgPropertiesNoEvents';
import { Props as LabelListProps } from '../component/LabelList';
import { GraphicalItemId } from '../state/graphicalItemsSlice';
import { ZIndexable } from '../zIndex/ZIndexLayer';
import { ChartData } from '../state/chartDataSlice';
interface PieDef {
    /**
     * The x-coordinate of center. If set a percentage, the final value is obtained by multiplying the percentage of container width.
     */
    cx?: number | string;
    /**
     * The y-coordinate of center. If set a percentage, the final value is obtained by multiplying the percentage of container height.
     */
    cy?: number | string;
    /**
     * Angle in degrees from which the chart should start.
     */
    startAngle?: number;
    /**
     * Angle, in degrees, at which the chart should end.
     */
    endAngle?: number;
    /**
     * The angle between two sectors.
     *
     * @example <Pie paddingAngle={5} />
     * @example https://recharts.github.io/examples/PieChartWithPaddingAngle
     */
    paddingAngle?: number;
    /**
     * The inner radius of the sectors.
     * If set a percentage, the final value is obtained by multiplying the percentage of maxRadius which is calculated by the width, height, cx, cy.
     */
    innerRadius?: number | string;
    /**
     * The outer radius of the sectors.
     * If set a percentage, the final value is obtained by multiplying the percentage of maxRadius which is calculated by the width, height, cx, cy.
     * Function should return a string percentage or number.
     */
    outerRadius?: number | string | ((dataPoint: any) => number | string);
    cornerRadius?: number | string;
}
type PieLabelLine = ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>) | SVGProps<SVGPathElement> | boolean;
interface PieLabelExtraProps {
    stroke: string;
    index: number;
    textAnchor: string;
}
export type PieLabelRenderProps = Omit<SVGPropsNoEvents<PieSvgAttributes>, 'offset'> & Omit<PieSectorDataItem, 'offset'> & PieLabelExtraProps & Coordinate;
export type LabelListPropsWithPosition = LabelListProps & {
    position: LabelListProps['position'];
};
/**
 * The `label` prop in Pie accepts a variety of alternatives.
 */
export type PieLabel = boolean | LabelListPropsWithPosition | Partial<PieLabelRenderProps> | ((props: PieLabelRenderProps) => ReactNode | ReactElement<SVGElement>) | ReactElement<SVGElement>;
export type PieSectorData = GeometrySector & TooltipTriggerInfo & {
    dataKey?: DataKey<any>;
    midAngle?: number;
    middleRadius?: number;
    name?: string | number;
    paddingAngle?: number;
    payload?: any;
    percent?: number;
    value: number;
};
/**
 * We spread the data object into the sector data item,
 * so we can't really know what is going to be inside.
 *
 * This type represents our best effort, but it all depends on the input data
 * and what is inside of it.
 *
 * https://github.com/recharts/recharts/issues/6380
 * https://github.com/recharts/recharts/discussions/6375
 */
export type PieSectorDataItem = PiePresentationProps & PieCoordinate & PieSectorData & {
    cornerRadius: number | undefined;
};
export type PieSectorShapeProps = PieSectorDataItem & ShapeAnimationProps & {
    [DATA_ITEM_INDEX_ATTRIBUTE_NAME]: number;
    [DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: GraphicalItemId;
    isActive: boolean;
    index: number;
} & SVGProps<SVGPathElement>;
export type PieShape = ActiveShape<PieSectorShapeProps, SVGPathElement>;
interface PieEvents {
    /**
     * The customized event handler of click on the sectors in this group.
     */
    onClick?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mousedown on the sectors in this group.
     */
    onMouseDown?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseup on the sectors in this group.
     */
    onMouseUp?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mousemove on the sectors in this group.
     */
    onMouseMove?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseover on the sectors in this group.
     */
    onMouseOver?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseout on the sectors in this group.
     */
    onMouseOut?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseenter on the sectors in this group.
     */
    onMouseEnter?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseleave on the sectors in this group.
     */
    onMouseLeave?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
    onTouchStart?: (data: PieSectorDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
    onTouchMove?: (data: PieSectorDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
    onTouchEnd?: (data: PieSectorDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
}
interface PieProps<DataPointType = any, DataValueType = any> extends DataProvider<DataPointType>, DataConsumer<DataPointType, DataValueType>, PieDef, PieEvents, ZIndexable {
    /**
     * This component is rendered when this graphical item is activated
     * (could be by mouse hover, touch, keyboard, programmatically).
     *
     * @deprecated Use the `shape` prop to create each sector. `isActive` designates the "active" shape.
     * @example <Pie activeShape={<CustomActiveShape />} />
     * @example https://recharts.github.io/examples/CustomActiveShapePieChart
     */
    activeShape?: ActiveShape<PieSectorDataItem>;
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
    animationInterpolateFn?: AnimationInterpolateFn<PieSectorDataItem, PolarLayout>;
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
    animationMatchBy?: AnimationMatchByProp<PieSectorDataItem>;
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
    id?: string;
    /**
     * The shape of inactive sector.
     * @deprecated Use the `shape` prop to modify each sector.
     */
    inactiveShape?: ActiveShape<PieSectorDataItem>;
    /**
     * If set false, animation will be disabled.
     * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     * @defaultValue auto
     */
    isAnimationActive?: boolean | 'auto';
    /**
     * Renders one label for each pie sector. Options:
     * - `true`: renders default labels;
     * - `false`: no labels are rendered;
     * - `object` that has `position` prop: the props of LabelList component;
     * - `object` that does not have `position` prop: the props of a custom Pie label (similar to Label with position "outside"); this variant supports `labelLine`
     * - `ReactElement`: a custom SVG label element, such as `<text>` or `<g>`.
     *   HTML elements such as `<div>` are not valid inside the chart SVG and may trigger React DOM warnings.
     * - `function`: a render function of custom label.
     *
     * Also see the `labelLine` prop that draws a line connecting each label to the corresponding sector.
     *
     * @defaultValue false
     * @example <Pie label={<CustomizedLabel />} />
     * @example https://recharts.github.io/examples/PieChartWithCustomizedLabel
     */
    label?: PieLabel;
    /**
     * If false set, label lines will not be drawn. If true set, label lines will be drawn which have the props calculated internally.
     * If object set, label lines will be drawn which have the props merged by the internal calculated props and the option.
     * If ReactElement set, the option can be the custom label line element.
     * If set a function, the function will be called to render customized label line.
     * @defaultValue true
     * @example <Pie labelLine={<CustomizedLabelLine />} />
     * @example https://recharts.github.io/examples/PieChartWithCustomizedLabel
     */
    labelLine?: PieLabelLine;
    /**
     * The type of icon in legend. If set to 'none', no legend item will be rendered.
     * @defaultValue rect
     */
    legendType?: LegendType;
    /** the max radius of pie */
    maxRadius?: number;
    /**
     * The minimum angle of each unzero data.
     * @defaultValue 0
     */
    minAngle?: number;
    /**
     * Name represents each sector in the tooltip, and legend.
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
     * The customized event handler of animation end.
     */
    onAnimationEnd?: () => void;
    /**
     * The customized event handler of animation start.
     */
    onAnimationStart?: () => void;
    /**
     * The tabindex of wrapper surrounding the cells.
     * @defaultValue 0
     */
    rootTabIndex?: number;
    /**
     * The custom shape of a Pie Sector.
     * Can also be used to render active sector by checking isActive.
     * During animations, the function shape also receives `animationElapsedTime`, `isAnimating`, and `isEntrance`.
     * If undefined, renders {@link Sector} shape.
     */
    shape?: PieShape;
    tooltipType?: TooltipType;
    /**
     * Formats the value displayed in the tooltip for this Pie.
     * When set, takes precedence over the `formatter` prop on the Tooltip component.
     */
    formatter?: Formatter;
    /**
     * @defaultValue 100
     */
    zIndex?: number;
}
type PieSvgAttributes = Omit<PresentationAttributesAdaptChildEvent<any, SVGElement>, 'ref' | keyof PieEvents>;
export type Props<DataPointType = any, DataValueType = any> = PieSvgAttributes & PieProps<DataPointType, DataValueType>;
export type PieCoordinate = {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    maxRadius: number;
};
export declare function computePieSectors({ pieSettings, displayedData, cells, offset, }: {
    pieSettings: PieSettings;
    displayedData: ChartData;
    cells: ReadonlyArray<ReactElement> | undefined;
    offset: ChartOffsetInternal;
}): ReadonlyArray<PieSectorDataItem> | undefined;
export declare const defaultPieProps: {
    readonly animationBegin: 400;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
    readonly animationInterpolateFn: AnimationInterpolateFn<PieSectorDataItem, PolarLayout>;
    readonly animationMatchBy: "append";
    readonly cx: "50%";
    readonly cy: "50%";
    readonly dataKey: "value";
    readonly endAngle: 360;
    readonly fill: "#808080";
    readonly hide: false;
    readonly innerRadius: 0;
    readonly isAnimationActive: "auto";
    readonly label: false;
    readonly labelLine: true;
    readonly legendType: "rect";
    readonly minAngle: 0;
    readonly nameKey: "name";
    readonly outerRadius: "80%";
    readonly paddingAngle: 0;
    readonly rootTabIndex: 0;
    readonly shape: React.FC<import("..").SectorProps>;
    readonly startAngle: 0;
    readonly stroke: "#fff";
    readonly zIndex: 100;
};
export declare const Pie: {
    <DataPointType = any, DataValueType = any>(outsideProps: Props<DataPointType, DataValueType>): ReactElement;
    (outsideProps: Props<any, any>): ReactElement;
};
export {};
