import * as React from 'react';
import { MouseEvent, ReactElement, ReactNode, SVGProps } from 'react';
import { Props as RectangleProps } from '../shape/Rectangle';
import { DataKey, EventThrottlingProps, Margin, Percent, SankeyLink, SankeyNode } from '../util/types';
import { TooltipPayloadSearcher } from '../state/tooltipSlice';
type SankeyVerticalAlign = 'justify' | 'top';
export declare const computeData: ({ data, width, height, iterations, nodeWidth, nodePadding, sort, verticalAlign, align, }: {
    data: SankeyData;
    width: number;
    height: number;
    iterations: number;
    nodeWidth: number;
    nodePadding: number;
    sort: boolean;
    verticalAlign: SankeyVerticalAlign;
    align: "left" | "justify";
}) => {
    nodes: ReadonlyArray<SankeyNode>;
    links: ReadonlyArray<SankeyLink>;
};
export declare const sankeyPayloadSearcher: TooltipPayloadSearcher;
interface LinkDataItem {
    source: number;
    target: number;
    value: number;
}
export interface NodeProps extends Omit<SVGProps<SVGRectElement>, 'height' | 'width'> {
    height: number;
    width: number;
    payload: SankeyNode;
    index: number;
    x: number;
    y: number;
}
export interface LinkProps extends SVGProps<SVGPathElement> {
    sourceX: number;
    targetX: number;
    sourceY: number;
    targetY: number;
    sourceControlX: number;
    targetControlX: number;
    sourceRelativeY: number;
    targetRelativeY: number;
    linkWidth: number;
    index: number;
    payload: Omit<SankeyLink, 'source' | 'target'> & {
        source: SankeyNode;
        target: SankeyNode;
    };
}
export interface SankeyData {
    nodes: any[];
    links: LinkDataItem[];
}
export type SankeyNodeOptions = ReactElement<SVGProps<SVGRectElement>> | ((props: NodeProps) => ReactNode) | RectangleProps;
type SankeyLinkOptions = ReactElement<SVGProps<SVGPathElement>> | ((props: LinkProps) => ReactElement<SVGProps<SVGPathElement>>) | SVGProps<SVGPathElement>;
interface SankeyProps extends EventThrottlingProps {
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
     * dataKey prop in Sankey defines which key in the link objects represents the value of the link _in Tooltip only_.
     *
     * Unlike other charts where dataKey is used to extract values from the data array, in Sankey charts,
     * the value of each link is directly taken from the 'value' property of the link objects.
     *
     * @default 'value'
     */
    dataKey?: DataKey<any>;
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
     * The source data, including the array of nodes, and the relationships, represented by links.
     *
     * Note that Sankey requires a specific data structure.
     * Each node should have a unique index in the nodes array, and each link should reference these nodes by their indices.
     * This is different from other chart types in Recharts, which accept arbitrary data.
     *
     * @example
     * nodes: [
     *   { name: 'Visit' },
     *   { name: 'Direct-Favourite' },
     *   { name: 'Page-Click' },
     *   { name: 'Detail-Favourite' },
     *   { name: 'Lost' },
     * ],
     * links: [
     *   { source: 0, target: 1, value: 3728.3 },
     *   { source: 0, target: 2, value: 354170 },
     *   { source: 2, target: 3, value: 62429 },
     *   { source: 2, target: 4, value: 291741 },
     * ],
     */
    data: SankeyData;
    /**
     * The padding between the nodes
     * @default 10
     */
    nodePadding?: number;
    /**
     * The width of node
     * @default 10
     */
    nodeWidth?: number;
    /**
     * The curvature of width
     * @default 0.5
     */
    linkCurvature?: number;
    /**
     * The number of the iterations between the links
     * @default 32
     */
    iterations?: number;
    /**
     * If set an object, the option is the configuration of nodes.
     * If set a React element, the option is the custom react element of drawing the nodes.
     *
     * @example <Sankey node={MyCustomComponent} />
     * @example <Sankey node={{stroke: #77c878, strokeWidth: 2}} />
     */
    node?: SankeyNodeOptions;
    /**
     * If set an object, the option is the configuration of links.
     * If set a React element, the option is the custom react element of drawing the links.
     *
     * @example <Sankey link={MyCustomComponent} />
     * @example <Sankey link={{ fill: #77c878 }} />
     */
    link?: SankeyLinkOptions;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
    /**
     * Turn on accessibility support for keyboard-only and screen reader users.
     *
     * @defaultValue true
     */
    accessibilityLayer?: boolean;
    title?: string;
    desc?: string;
    /**
     * Empty space around the container.
     *
     * @defaultValue {"top":5,"right":5,"bottom":5,"left":5}
     */
    margin?: Partial<Margin>;
    /**
     * The customized event handler of click on the area in this group
     */
    onClick?: (item: NodeProps | LinkProps, type: SankeyElementType, e: MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseenter on the area in this group
     */
    onMouseEnter?: (item: NodeProps | LinkProps, type: SankeyElementType, e: MouseEvent<SVGGraphicsElement>) => void;
    /**
     * The customized event handler of mouseleave on the area in this group
     */
    onMouseLeave?: (item: NodeProps | LinkProps, type: SankeyElementType, e: MouseEvent<SVGGraphicsElement>) => void;
    /**
     * Whether to sort the nodes on the y axis, or to display them as user-defined.
     * @default true
     */
    sort?: boolean;
    /**
     * Controls the vertical spacing of nodes within a depth. 'justify' distributes nodes evenly and balances link paths, while 'top' positions the group starting from the top edge of the chart.
     * @default 'justify'
     */
    verticalAlign?: SankeyVerticalAlign;
    /**
     * If set to 'justify', the start nodes will be aligned to the left edge of the chart and the end nodes will be aligned to the right edge of the chart. If set to 'left', the start nodes will be aligned to the left edge of the chart.
     * @default 'justify'
     */
    align?: 'left' | 'justify';
}
export type Props = Omit<SVGProps<SVGSVGElement>, keyof SankeyProps> & SankeyProps;
export type SankeyElementType = 'node' | 'link';
export declare const sankeyDefaultProps: {
    readonly throttleDelay: number | "raf";
    readonly throttledEvents: ReadonlyArray<keyof GlobalEventHandlersEventMap> | "all";
    readonly accessibilityLayer: true;
    readonly align: "justify";
    readonly dataKey: "value";
    readonly iterations: 32;
    readonly linkCurvature: 0.5;
    readonly margin: {
        readonly top: 5;
        readonly right: 5;
        readonly bottom: 5;
        readonly left: 5;
    };
    readonly nameKey: "name";
    readonly nodePadding: 10;
    readonly nodeWidth: 10;
    readonly sort: true;
    readonly verticalAlign: "justify";
};
/**
 * Flow diagram in which the width of the arrows is proportional to the flow rate.
 * It is typically used to visualize energy or material or cost transfers between processes.
 *
 * @consumes ResponsiveContainerContext
 * @provides TooltipEntrySettings
 */
export declare function Sankey(outsideProps: Props): React.JSX.Element;
export declare namespace Sankey {
    var displayName: string;
}
export {};
