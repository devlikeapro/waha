import * as React from 'react';
import { CSSProperties, ReactElement, ReactNode } from 'react';
import { NameType, Props as DefaultTooltipContentProps, TooltipItemSorter, ValueType } from './DefaultTooltipContent';
import { UniqueOption } from '../util/payload/getUniqPayload';
import { AllowInDimension, AnimationDuration, EasingInput, Coordinate } from '../util/types';
import { CursorDefinition } from './Cursor';
import { TooltipTrigger } from '../chart/types';
import { TooltipIndex, TooltipPayload, TooltipPayloadEntry } from '../state/tooltipSlice';
import { AxisId } from '../state/cartesianAxisSlice';
export type ContentType<TValue extends ValueType = ValueType, TName extends NameType = NameType> = ReactElement | ((props: TooltipContentProps<TValue, TName>) => ReactNode);
export type TooltipContentProps<TValue extends ValueType = ValueType, TName extends NameType = NameType> = TooltipProps<TValue, TName> & {
    label?: string | number;
    payload: TooltipPayload;
    coordinate: Coordinate | undefined;
    active: boolean;
    accessibilityLayer: boolean;
    activeIndex: TooltipIndex | undefined;
};
type PropertiesReadFromContext = 'viewBox' | 'active' | 'payload' | 'coordinate' | 'label' | 'accessibilityLayer';
export type TooltipProps<TValue extends ValueType = ValueType, TName extends NameType = NameType> = Omit<DefaultTooltipContentProps<TValue, TName>, PropertiesReadFromContext> & {
    /**
     * If true, then Tooltip is always displayed, once an activeIndex is set by mouse over, or programmatically.
     * If false, then Tooltip is never displayed.
     * If undefined, Recharts will control when the Tooltip displays. This includes mouse and keyboard controls.
     */
    active?: boolean;
    /**
     * This option allows the tooltip to extend beyond the viewBox of the chart itself.
     * @defaultValue {"x":false,"y":false}
     */
    allowEscapeViewBox?: AllowInDimension;
    /**
     * Specifies the duration of animation, the unit of this option is ms.
     * @defaultValue 400
     */
    animationDuration?: AnimationDuration;
    /**
     * The type of easing function.
     * @defaultValue ease
     */
    animationEasing?: EasingInput;
    /**
     * Tooltip always attaches itself to the "Tooltip" axis. Which axis is it? Depends on the layout:
     * - horizontal layout -> X axis
     * - vertical layout -> Y axis
     * - radial layout -> radial axis
     * - centric layout -> angle axis
     *
     * Tooltip will use the default axis for the layout, unless you specify an axisId.
     *
     * @defaultValue 0
     */
    axisId?: AxisId;
    /**
     * Renders the content of the tooltip.
     *
     * This should return HTML elements, not SVG elements.
     *
     * - If not set, the {@link DefaultTooltipContent} component is used.
     * - If set to a React element, this element will be cloned and extra props will be passed in.
     * - If set to a function, the function will be called and should return HTML elements.
     *
     * @see {@link https://recharts.github.io/en-US/examples/CustomContentOfTooltip/ Example with custom content}
     */
    content?: ContentType<TValue, TName>;
    /**
     * CSS styles to be applied to the wrapper `div` element.
     * @defaultValue {}
     */
    contentStyle?: CSSProperties;
    /**
     * If set false, no cursor will be drawn when tooltip is active.
     * If set a object, the option is the configuration of cursor.
     * If set a React element, the option is the custom react element of drawing cursor.
     * @defaultValue true
     */
    cursor?: CursorDefinition;
    defaultIndex?: number | TooltipIndex;
    /**
     * When an item of the payload has value null or undefined, this item won't be displayed.
     * @defaultValue true
     */
    filterNull?: boolean;
    /**
     * Function to customize the value in the tooltip.
     * If you return an array, the first entry will be the formatted "value", and the second entry will be the formatted "name"
     */
    formatter?: (value: TValue, name: TName, item: TooltipPayloadEntry, index: number, payload: TooltipPayload) => ReactNode | [ReactNode, ReactNode];
    /**
     * If true, the tooltip will display information about hidden series.
     * Defaults to false.
     * Interacting with the hide property of Area, Bar, Line, Scatter.
     *
     * @defaultValue false
     */
    includeHidden?: boolean | undefined;
    /**
     * If set false, animation of tooltip will be disabled.
     * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
     * @defaultValue auto
     */
    isAnimationActive?: boolean | 'auto';
    /**
     * Sorts tooltip items.
     * Defaults to 'name' which means it sorts alphabetically by graphical item `name` property.
     * @defaultValue name
     */
    itemSorter?: TooltipItemSorter;
    /**
     * Style of individual items inside the tooltip, a `<li>` element.
     * These show the data label (name, or dataKey) and value.
     *
     * If a chart has multiple graphical items then the Tooltip renders multiple item
     * and each of them gets this itemStyle applied.
     *
     * @defaultValue {}
     */
    itemStyle?: CSSProperties;
    /**
     * The formatter function of label in tooltip.
     */
    labelFormatter?: (label: ReactNode, payload: TooltipPayload) => ReactNode;
    /**
     * "Label" is the tooltip title.
     * Renders once on the top of tooltip and shows categorical axis value.
     *
     * Even if there are multiple graphical items in the chart, only one label gets rendered.
     *
     * Note that "Label" in tooltip is the header, which is different from {@link Legend}
     * where "labelStyle" are the individual items.
     *
     * @defaultValue {}
     */
    labelStyle?: CSSProperties;
    /**
     * The offset size between the position of tooltip and the mouse cursor position.
     * When a number is provided, the same offset is applied to both x and y axes.
     *
     * When a Coordinate object is provided, you can specify different offsets for each axis (x and y as numbers)
     * @defaultValue 10
     */
    offset?: number | Coordinate;
    payloadUniqBy?: UniqueOption<TooltipPayloadEntry>;
    /**
     * If portal is defined, then Tooltip will use this element as a target
     * for rendering using React Portal: https://react.dev/reference/react-dom/createPortal
     *
     * If this is undefined then Tooltip renders inside the recharts-wrapper element.
     */
    portal?: HTMLElement | null;
    /**
     * If this field is set, the tooltip will be displayed at the specified position
     * regardless of the mouse position.
     *
     * You can set a single field (x or y) and let the other field be calculated automatically based
     * on the mouse position.
     */
    position?: Partial<Coordinate>;
    /**
     * @defaultValue {"x":false,"y":false}
     */
    reverseDirection?: AllowInDimension;
    /**
     * The separator between name and value.
     * @defaultValue ' : '
     */
    separator?: string;
    /**
     * Defines whether the tooltip is reacting to the current data point,
     * or to all data points at the current axis coordinate.
     *
     * - `true`: tooltip will appear on top of all bars on an axis tick.
     * - `false`: tooltip will appear on individual bars.
     *
     * Different chart types allow different modes, and have different defaults.
     *
     * @see {@link https://github.com/recharts/recharts/wiki/Tooltip-event-type-and-shared-prop Tooltip event type and shared prop wiki page}
     */
    shared?: boolean;
    /**
     * If `hover` then the Tooltip shows on mouse enter and hides on mouse leave.
     *
     * If `click` then the Tooltip shows after clicking and stays active.
     *
     * @defaultValue hover
     */
    trigger?: TooltipTrigger;
    /**
     * @defaultValue false
     */
    useTranslate3d?: boolean;
    /**
     * CSS styles to be applied to the wrapper `div` element.
     */
    wrapperStyle?: CSSProperties;
};
export declare const defaultTooltipProps: {
    readonly allowEscapeViewBox: {
        readonly x: false;
        readonly y: false;
    };
    readonly animationDuration: 400;
    readonly animationEasing: "ease";
    readonly axisId: 0;
    readonly contentStyle: {};
    readonly cursor: true;
    readonly filterNull: true;
    readonly includeHidden: false;
    readonly isAnimationActive: "auto";
    readonly itemSorter: "name";
    readonly itemStyle: {};
    readonly labelStyle: {};
    readonly offset: 10;
    readonly reverseDirection: {
        readonly x: false;
        readonly y: false;
    };
    readonly separator: " : ";
    readonly trigger: "hover";
    readonly useTranslate3d: false;
    readonly wrapperStyle: {};
};
/**
 * The Tooltip component displays a floating box with data values when hovering over or clicking on chart elements.
 *
 * It can be configured to show information for individual data points or for all points at a specific axis coordinate.
 * The appearance and content of the tooltip can be customized via props.
 *
 * @see {@link https://github.com/recharts/recharts/wiki/Tooltip-event-type-and-shared-prop Tooltip event type and shared prop wiki page}
 * @see {@link https://recharts.github.io/en-US/guide/activeIndex/ Active index replacement when migrating from Recharts v2 to v3}
 *
 * @consumes CartesianChartContext
 * @consumes PolarChartContext
 * @consumes TooltipEntrySettings
 */
export declare function Tooltip(outsideProps: TooltipProps<ValueType, NameType>): React.JSX.Element | null;
export {};
