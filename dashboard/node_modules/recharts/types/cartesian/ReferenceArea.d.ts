import * as React from 'react';
import { ReactElement } from 'react';
import { ImplicitLabelType } from '../component/Label';
import { Overflowable } from '../util/IfOverflow';
import { Props as RectangleProps } from '../shape/Rectangle';
import { SVGPropsAndEvents } from '../util/svgPropertiesAndEvents';
import { ZIndexable } from '../zIndex/ZIndexLayer';
type ReferenceCoordinateValue = number | string;
interface ReferenceAreaProps<XValueType extends ReferenceCoordinateValue = any, YValueType extends ReferenceCoordinateValue = any> extends Overflowable, ZIndexable {
    /**
     * Starting X-coordinate of the area.
     * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
     * ReferenceArea will internally calculate the correct pixel position.
     *
     * If undefined then the area will extend to the left edge of the chart plot area.
     *
     * @example <ReferenceArea x1="Monday" x2="Friday" />
     * @example <ReferenceArea x1={10} x2={50} />
     * @example <ReferenceArea x1="Page C" />
     */
    x1?: XValueType;
    /**
     * Ending X-coordinate of the area.
     * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
     * ReferenceArea will internally calculate the correct pixel position.
     *
     * If undefined then the area will extend to the right edge of the chart plot area.
     *
     * @example <ReferenceArea x1="Monday" x2="Friday" />
     * @example <ReferenceArea x1={10} x2={50} />
     * @example <ReferenceArea x2="Page C" />
     */
    x2?: XValueType;
    /**
     * Starting Y-coordinate of the area.
     * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
     * ReferenceArea will internally calculate the correct pixel position.
     *
     * If undefined then the area will extend to the top edge of the chart plot area.
     *
     * @example <ReferenceArea y1={100} y2={500} />
     * @example <ReferenceArea y1="low" y2="high" />
     * @example <ReferenceArea y1={200} />
     */
    y1?: YValueType;
    /**
     * Ending Y-coordinate of the area.
     * This value is using your chart's domain, so you will provide a data value instead of a pixel value.
     * ReferenceArea will internally calculate the correct pixel position.
     *
     * If undefined then the area will extend to the bottom edge of the chart plot area.
     *
     * @example <ReferenceArea y1={100} y2={500} />
     * @example <ReferenceArea y1="low" y2="high" />
     * @example <ReferenceArea y2={400} />
     */
    y2?: YValueType;
    className?: number | string;
    /**
     * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
     * @defaultValue 0
     */
    yAxisId?: number | string;
    /**
     * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
     * @defaultValue 0
     */
    xAxisId?: number | string;
    /**
     * If set a ReactElement, the shape of the reference area can be customized.
     * If set a function, the function will be called to render customized shape.
     */
    shape?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>);
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
     *
     * @see {@link https://recharts.github.io/en-US/examples/LineChartWithReferenceLines/ Reference elements with a label}
     */
    label?: ImplicitLabelType;
    /**
     * Z-Index of this component and its children. The higher the value,
     * the more on top it will be rendered.
     * Components with higher zIndex will appear in front of components with lower zIndex.
     * If undefined or 0, the content is rendered in the default layer without portals.
     *
     * @since 3.4
     * @defaultValue 100
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
    children?: React.ReactNode;
}
export type Props<XValueType extends ReferenceCoordinateValue = any, YValueType extends ReferenceCoordinateValue = any> = Omit<SVGPropsAndEvents<RectangleProps>, 'width' | 'height' | 'x' | 'y'> & ReferenceAreaProps<XValueType, YValueType>;
export declare const referenceAreaDefaultProps: {
    readonly ifOverflow: "discard";
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly radius: 0;
    readonly fill: "#ccc";
    readonly label: false;
    readonly fillOpacity: 0.5;
    readonly stroke: "none";
    readonly strokeWidth: 1;
    readonly zIndex: 100;
};
/**
 * Draws a rectangular area on the chart to highlight a specific range.
 *
 * This component, unlike {@link Rectangle} or {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/rect rect}, is aware of the cartesian coordinate system,
 * so you specify the area by using data coordinates instead of pixels.
 *
 * ReferenceArea will calculate the pixels based on the provided data coordinates.
 *
 * If you prefer to render rectangles using pixels rather than data coordinates,
 * consider using the {@link Rectangle} component instead.
 *
 * @provides CartesianLabelContext
 * @consumes CartesianChartContext
 */
export declare function ReferenceArea<XValueType extends ReferenceCoordinateValue = any, YValueType extends ReferenceCoordinateValue = any>(outsideProps: Props<XValueType, YValueType>): React.JSX.Element;
export declare namespace ReferenceArea {
    var displayName: string;
}
export {};
