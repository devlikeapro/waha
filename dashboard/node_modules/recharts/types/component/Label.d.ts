import * as React from 'react';
import { ReactElement, ReactNode, SVGProps } from 'react';
import { RenderableText, TextAnchor, TextVerticalAnchor } from './Text';
import { DataKey, PolarViewBoxRequired, TrapezoidViewBox, ViewBox } from '../util/types';
import { ZIndexable } from '../zIndex/ZIndexLayer';
import { CartesianLabelPosition } from '../cartesian/getCartesianPosition';
/**
 * @inline
 */
export type LabelContentType = ReactElement | ((props: Props) => RenderableText | ReactElement);
type PolarLabelPosition = 'insideStart' | 'insideEnd' | 'end';
/**
 * @inline
 */
export type LabelPosition = CartesianLabelPosition | PolarLabelPosition;
/**
 * @inline
 */
export type LabelFormatter = (label: RenderableText) => RenderableText;
interface LabelProps extends ZIndexable {
    /**
     * The box of viewing area. Used for positioning.
     * If undefined, viewBox will be calculated based on surrounding context.
     */
    viewBox?: ViewBox;
    parentViewBox?: ViewBox;
    /**
     * Function to customize how content is serialized before rendering.
     *
     * This should return a renderable text - something that the {@link Text} component can render.
     * Typically, a string or number.
     * Custom components are not supported here - use the `content` prop instead.
     */
    formatter?: LabelFormatter;
    /**
     * The value of label can be set as children or as the `value` prop
     *
     * @example <Label value="foo" />
     */
    value?: RenderableText;
    /**
     * The offset to the specified "position". Direction of the offset depends on the position.
     *
     * @defaultValue 5
     */
    offset?: number;
    /**
     * The position of label relative to the view box.
     *
     * @defaultValue middle
     */
    position?: LabelPosition;
    /**
     * The value of label can be set as children or as the `value` prop
     *
     * @example <Label>foo</Label>
     */
    children?: RenderableText;
    className?: string;
    /**
     * If set a React element, the option is the custom React element of rendering label.
     * Use an SVG element or component, such as `<text>` or `<g>`.
     * HTML elements such as `<div>` are not valid inside the chart SVG and may trigger React DOM warnings.
     * If set a function, the function will be called to render label content.
     *
     * @example <Label content={CustomizedLabel} />
     * @example
     * const renderCustomLabel = (props) => <text {...props}>Custom Label</text>;
     * <Label content={renderCustomLabel} />
     */
    content?: LabelContentType;
    /**
     * @defaultValue false
     */
    textBreakAll?: boolean;
    /**
     * Text rotation angle in degrees.
     * Positive values rotate clockwise, negative values rotate counterclockwise.
     *
     * @defaultValue 0
     */
    angle?: number;
    index?: number;
    labelRef?: React.RefObject<SVGTextElement> | null;
    /**
     * Z-Index of this component and its children. The higher the value,
     * the more on top it will be rendered.
     * Components with higher zIndex will appear in front of components with lower zIndex.
     * If undefined or 0, the content is rendered in the default layer without portals.
     *
     * @since 3.4
     * @defaultValue 2000
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
    /**
     * Unique identifier of this component.
     * Used as an HTML attribute `id`.
     */
    id?: string;
}
export type Props = Omit<SVGProps<SVGTextElement>, 'viewBox'> & LabelProps;
export type ImplicitLabelType = boolean | string | number | ReactElement<SVGElement> | ((props: any) => RenderableText | ReactElement) | (Props & {
    dataKey?: DataKey<any>;
});
export declare const CartesianLabelContextProvider: ({ x, y, upperWidth, lowerWidth, width, height, children, }: TrapezoidViewBox & {
    children: ReactNode;
}) => React.JSX.Element;
export declare const PolarLabelContextProvider: ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise, children, }: PolarViewBoxRequired & {
    children: ReactNode;
}) => React.JSX.Element;
export declare const usePolarLabelContext: () => PolarViewBoxRequired | undefined;
export declare const isLabelContentAFunction: (content: unknown) => content is (props: Props) => React.ReactNode;
export type LabelPositionAttributes = {
    x: number;
    y: number;
    textAnchor: TextAnchor;
    verticalAnchor: TextVerticalAnchor;
    width?: number;
    height?: number;
};
export declare const defaultLabelProps: {
    readonly angle: 0;
    readonly offset: 5;
    readonly zIndex: 2000;
    readonly position: "middle";
    readonly textBreakAll: false;
};
/**
 * @consumes CartesianViewBoxContext
 * @consumes PolarViewBoxContext
 * @consumes CartesianLabelContext
 * @consumes PolarLabelContext
 */
export declare function Label(outerProps: Props): React.JSX.Element | null;
export declare namespace Label {
    var displayName: string;
}
export declare function CartesianLabelFromLabelProp({ label, labelRef, }: {
    label: ImplicitLabelType | undefined;
    labelRef?: React.RefObject<SVGTextElement> | null;
}): React.JSX.Element | null;
export declare function PolarLabelFromLabelProp({ label }: {
    label: ImplicitLabelType | undefined;
}): React.JSX.Element | null;
export {};
