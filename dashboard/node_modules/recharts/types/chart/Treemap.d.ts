import * as React from 'react';
import { ReactNode } from 'react';
import { AnimationDuration, EasingInput, DataConsumer, DataKey, EventThrottlingProps, Percent } from '../util/types';
import { TooltipIndex, TooltipPayloadSearcher } from '../state/tooltipSlice';
/**
 * This is what end users defines as `data` on Treemap.
 */
export interface TreemapDataType {
    children?: ReadonlyArray<TreemapDataType>;
    [key: string]: unknown;
}
/**
 * This is what is returned from `squarify`, the final treemap data structure
 * that gets rendered and is stored in
 */
export interface TreemapNode {
    children: ReadonlyArray<TreemapNode> | null;
    value: number;
    depth: number;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    tooltipIndex: TooltipIndex;
    root?: TreemapNode;
    [k: string]: unknown;
}
export declare const treemapPayloadSearcher: TooltipPayloadSearcher;
export declare const addToTreemapNodeIndex: (indexInChildrenArr: number, activeTooltipIndexSoFar?: TooltipIndex | undefined) => TooltipIndex;
export declare const computeNode: <DataPointType extends TreemapDataType, DataValueType>({ depth, node, index, dataKey, nameKey, nestedActiveTooltipIndex, }: {
    depth: number;
    node: TreemapNode;
    index: number;
    dataKey: DataKey<DataPointType, DataValueType>;
    nameKey: DataKey<DataPointType, DataValueType>;
    nestedActiveTooltipIndex: TooltipIndex | undefined;
}) => TreemapNode;
export type TreemapContentType = ReactNode | ((props: TreemapNode) => React.ReactElement);
export interface Props<DataPointType extends TreemapDataType = TreemapDataType, DataValueType = any> extends DataConsumer<DataPointType, DataValueType>, EventThrottlingProps {
    /**
     * The width of chart container.
     * Can be a number or a percent string like "100%".
     */
    width?: number | Percent;
    /**
     * The height of chart container.
     * Can be a number or a percent string like "100%".
     */
    height?: number | Percent;
    /**
     * The source data. Each element should be an object.
     * The properties of each object represent the values of different data dimensions.
     *
     * Use the `dataKey` prop to specify which properties to use.
     *
     * If the `children` property is present on an element, it will be treated as a nested treemap.
     */
    data?: ReadonlyArray<DataPointType>;
    /**
     * @deprecated unused prop, doesn't do anything, use `key` instead
     */
    animationId?: number;
    style?: React.CSSProperties;
    /**
     * The treemap will try to keep every single rectangle's aspect ratio near the aspectRatio given.
     * @default 1.618033988749895
     */
    aspectRatio?: number;
    /**
     * The inset between a parent node and its child nodes.
     *
     * Insets a parent node's available area before laying out its children.
     * This creates space between a parent boundary and its child nodes.
     * @default 0
     * @since 3.9
     */
    nodeInset?: number;
    /**
     * The gap between the nodes.
     *
     * Adds spacing between sibling nodes at the same depth level.
     * This does not inset children from their parent boundary.
     * @default 0
     * @since 3.9
     */
    nodeGap?: number;
    /**
     * If set to a React element, the option is the customized React element of rendering the content.
     * Use an SVG element or component, such as `<text>` or `<g>`.
     * HTML elements such as `<div>` are not valid inside the chart SVG and may trigger React DOM warnings.
     * If set to a function, the function will be called to render the content.
     */
    content?: TreemapContentType;
    fill?: string;
    stroke?: string;
    className?: string;
    /**
     * Name represents each sector in the tooltip.
     * This allows you to extract the name from the data:
     *
     * - `string`: the name of the field in the data object;
     * - `number`: the index of the field in the data;
     * - `function`: a function that receives the data object and returns the name.
     *
     * @defaultValue 'name'
     */
    nameKey?: DataKey<DataPointType, DataValueType>;
    /**
     * Decides how to extract the value of this Treemap from the data:
     * - `string`: the name of the field in the data object;
     * - `number`: the index of the field in the data;
     * - `function`: a function that receives the data object and returns the value of this Treemap.
     *
     * @defaultValue 'value'
     */
    dataKey?: DataKey<DataPointType, DataValueType>;
    children?: ReactNode;
    /**
     * The type of treemap to render.
     *
     * - 'flat': Renders the entire treemap at once, with all leaf nodes visible.
     * - 'nest': Renders an interactive, nested treemap. Clicking on a parent node will "zoom in" to show its children,
     *   and a breadcrumb navigation will be displayed to allow navigating back up the hierarchy.
     *
     * @default 'flat'
     */
    type?: 'flat' | 'nest';
    colorPanel?: ReadonlyArray<string>;
    nestIndexContent?: React.ReactElement | ((item: TreemapNode, i: number) => ReactNode);
    /**
     * The customized event handler of animation start
     */
    onAnimationStart?: () => void;
    /**
     * The customized event handler of animation end
     */
    onAnimationEnd?: () => void;
    onMouseEnter?: (node: TreemapNode, e: React.MouseEvent<SVGGraphicsElement>) => void;
    onMouseLeave?: (node: TreemapNode, e: React.MouseEvent<SVGGraphicsElement>) => void;
    onClick?: (node: TreemapNode) => void;
    /**
     * If set false, animation of treemap will be disabled.
     * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     * @default 'auto'
     */
    isAnimationActive?: boolean | 'auto';
    isUpdateAnimationActive?: boolean | 'auto';
    /**
     * Specifies when the animation should begin, the unit of this option is ms.
     * @default 0
     */
    animationBegin?: number;
    /**
     * Specifies the duration of animation, the unit of this option is ms.
     * @default 1500
     */
    animationDuration?: AnimationDuration;
    /**
     * The type of easing function.
     * @default 'linear'
     */
    animationEasing?: EasingInput;
    id?: string;
}
export declare const defaultTreeMapProps: {
    readonly throttleDelay: number | "raf";
    readonly throttledEvents: ReadonlyArray<keyof GlobalEventHandlersEventMap> | "all";
    readonly aspectRatio: number;
    readonly nodeInset: 0;
    readonly nodeGap: 0;
    readonly dataKey: "value";
    readonly nameKey: "name";
    readonly type: "flat";
    readonly isAnimationActive: "auto";
    readonly isUpdateAnimationActive: "auto";
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "linear";
};
/**
 * The Treemap chart is used to visualize hierarchical data using nested rectangles.
 *
 * @consumes ResponsiveContainerContext
 * @provides TooltipEntrySettings
 */
export declare function Treemap(outsideProps: Props): React.JSX.Element;
