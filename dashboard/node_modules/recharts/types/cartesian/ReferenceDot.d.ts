import * as React from 'react';
import { ReactElement } from 'react';
import { Props as DotProps } from '../shape/Dot';
import { ImplicitLabelType } from '../component/Label';
import { Overflowable } from '../util/IfOverflow';
import { ZIndexable } from '../zIndex/ZIndexLayer';
type ReferenceCoordinateValue = number | string;
interface ReferenceDotProps<XValueType extends ReferenceCoordinateValue = any, YValueType extends ReferenceCoordinateValue = any> extends Overflowable, ZIndexable {
    /**
     * The radius of the dot in pixels.
     *
     * @defaultValue 10
     */
    r?: number;
    /**
     * The x-coordinate of the center of the dot.
     *
     * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
     * ReferenceDot will internally calculate the correct pixel position.
     *
     * @example <ReferenceDot x="January" y="2026" />
     */
    x?: XValueType;
    /**
     * The y-coordinate of the center of the dot.
     *
     * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
     * ReferenceDot will internally calculate the correct pixel position.
     *
     * @example <ReferenceDot x="January" y="2026" />
     */
    y?: YValueType;
    className?: number | string;
    /**
     * The id of y-axis which is corresponding to the data.
     * Required when there are multiple YAxes.
     *
     * @defaultValue 0
     */
    yAxisId?: number | string;
    /**
     * The id of x-axis which is corresponding to the data.
     * Required when there are multiple XAxes.
     *
     * @defaultValue 0
     */
    xAxisId?: number | string;
    /**
     * If set a ReactElement, the shape of dot can be customized.
     * If set a function, the function will be called to render customized shape.
     */
    shape?: ReactElement<SVGElement> | ((props: DotProps) => ReactElement<SVGElement>);
    /**
     * Renders a single label.
     *
     * - `false`: no labels are rendered
     * - `string` | `number`: the content of the label
     * - `object`: the props of LabelList component
     * - `ReactElement`: a custom SVG label element, such as `<text>` or `<g>`.
     *   HTML elements such as `<div>` are not valid inside the chart SVG and may trigger React DOM warnings.
     * - `function`: a render function of custom label
     *
     * @defaultValue false
     */
    label?: ImplicitLabelType;
    /**
     * Z-Index of this component and its children. The higher the value,
     * the more on top it will be rendered.
     * Components with higher zIndex will appear in front of components with lower zIndex.
     * If undefined or 0, the content is rendered in the default layer without portals.
     *
     * @since 3.4
     * @defaultValue 600
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
    /**
     * The customized event handler of click in this chart.
     */
    onClick?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
    /**
     * The customized event handler of mousedown in this chart.
     */
    onMouseDown?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
    /**
     * The customized event handler of mouseup in this chart.
     */
    onMouseUp?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
    /**
     * The customized event handler of mouseover in this chart.
     */
    onMouseOver?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
    /**
     * The customized event handler of mouseout in this chart.
     */
    onMouseOut?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
    /**
     * The customized event handler of mouseenter in this chart.
     */
    onMouseEnter?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
    /**
     * The customized event handler of mousemove in this chart.
     */
    onMouseMove?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
    /**
     * The customized event handler of mouseleave in this chart.
     */
    onMouseLeave?: (dotProps: DotProps, e: React.MouseEvent<SVGCircleElement>) => void;
}
export type Props<XValueType extends ReferenceCoordinateValue = any, YValueType extends ReferenceCoordinateValue = any> = Omit<DotProps, 'cx' | 'cy' | 'clipDot' | 'dangerouslySetInnerHTML'> & ReferenceDotProps<XValueType, YValueType>;
export declare const referenceDotDefaultProps: {
    readonly ifOverflow: "discard";
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly r: 10;
    readonly label: false;
    readonly fill: "#fff";
    readonly stroke: "#ccc";
    readonly fillOpacity: 1;
    readonly strokeWidth: 1;
    readonly zIndex: 600;
};
/**
 * Draws a circle on the chart to highlight a specific point.
 *
 * This component, unlike {@link Dot} or {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/circle circle}, is aware of the cartesian coordinate system,
 * so you specify its center by using data coordinates instead of pixels.
 *
 * ReferenceDot will calculate the pixels based on the provided data coordinates.
 *
 * If you prefer to render dots using pixels rather than data coordinates,
 * consider using the {@link Dot} component instead.
 *
 * @provides CartesianLabelContext
 * @consumes CartesianChartContext
 */
export declare function ReferenceDot<XValueType extends ReferenceCoordinateValue = any, YValueType extends ReferenceCoordinateValue = any>(outsideProps: Props<XValueType, YValueType>): React.JSX.Element;
export declare namespace ReferenceDot {
    var displayName: string;
}
export {};
