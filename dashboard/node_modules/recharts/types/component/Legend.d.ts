import * as React from 'react';
import { CSSProperties } from 'react';
import { CartesianPosition } from '../cartesian/getCartesianPosition';
import { ContentType, LegendPayload, Props as DefaultLegendContentProps, VerticalAlignmentType } from './DefaultLegendContent';
import { CartesianLayout } from '../util/types';
import { UniqueOption } from '../util/payload/getUniqPayload';
import { ElementOffset } from '../util/useElementOffset';
export type LegendItemSorter = 'value' | 'dataKey' | ((item: LegendPayload) => number | string);
export type Props = Omit<DefaultLegendContentProps, 'payload' | 'ref' | 'verticalAlign' | 'layout'> & {
    /**
     * Renders the content of the legend.
     *
     * This should return HTML elements, not SVG elements.
     *
     * - If not set, the {@link DefaultLegendContent} component is used.
     * - If set to a React element, this element will be cloned and extra props will be passed in.
     * - If set to a function, the function will be called and should return HTML elements.
     *
     * @example <Legend content={CustomizedLegend} />
     * @example <Legend content={renderLegend} />
     */
    content?: ContentType;
    /**
     * The layout of legend items inside the legend container.
     *
     * When `auto` then the layout is decided based on the `position` prop:
     * - in `left`|`right` positions, the layout is vertical
     * - otherwise horizontal
     * - if position is undefined, also horizontal
     *
     * `auto` value is new since 3.10
     *
     * @defaultValue auto
     */
    layout?: CartesianLayout | 'auto';
    /**
     * CSS styles to be applied to the wrapper `div` element.
     */
    wrapperStyle?: CSSProperties;
    /**
     * Width of the legend.
     * Accept CSS style string values like `100%` or `fit-content`, or number values like `400`.
     */
    width?: number | string;
    /**
     * Height of the legend.
     * Accept CSS style string values like `100%` or `fit-content`, or number values like `400`.
     */
    height?: number | string;
    payloadUniqBy?: UniqueOption<LegendPayload>;
    onBBoxUpdate?: (box: ElementOffset | null) => void;
    /**
     * If portal is defined, then Legend will use this element as a target
     * for rendering using React Portal.
     *
     * If this is undefined then Legend renders inside the recharts-wrapper element.
     *
     * @see {@link https://react.dev/reference/react-dom/createPortal}
     */
    portal?: HTMLElement | null;
    /**
     * Sorts Legend items. Defaults to `value` which means it will sort alphabetically
     * by the label.
     *
     * If `null` is provided then the payload is not sorted. Be aware that without sort,
     * the order of items may change between renders!
     *
     * @defaultValue value
     */
    itemSorter?: LegendItemSorter | null;
    /**
     * @deprecated use `position` instead which has more options, is more flexible and has more intuitive default styles.
     *
     * @description The alignment of the whole Legend container:
     *
     * - `bottom`: shows the Legend below chart, and chart height reduces automatically to make space for it.
     * - `top`: shows the Legend above chart, and chart height reduces automatically.
     * - `middle`:  shows the Legend in the middle of chart, covering other content, and chart height remains unchanged.
     * The exact behavior changes depending on `align` prop.
     *
     * @defaultValue bottom
     * @see {@link https://recharts.github.io/examples/LegendPosition/ Legend position playground}
     */
    verticalAlign?: VerticalAlignmentType;
    /**
     * The position of the legend relative to the chart.
     * If this is defined, it overrides `align` and `verticalAlign`.
     *
     * @since 3.10
     */
    position?: CartesianPosition;
    /**
     * The offset to the specified `position`. Direction of the offset depends on the position.
     *
     * @since 3.10
     */
    offset?: number;
};
export declare const legendDefaultProps: {
    readonly align: "center";
    readonly iconSize: 14;
    readonly inactiveColor: "#ccc";
    readonly itemSorter: "value";
    readonly labelStyle: {};
    readonly layout: "auto";
    readonly verticalAlign: "bottom";
    readonly offset: 0;
};
/**
 * @consumes CartesianChartContext
 * @consumes PolarChartContext
 */
declare function LegendImpl(outsideProps: Props): React.ReactPortal | null;
export declare const Legend: React.MemoExoticComponent<typeof LegendImpl>;
export {};
