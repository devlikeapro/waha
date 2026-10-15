import * as React from 'react';
import { SVGProps } from 'react';
import { AxisId } from '../state/cartesianAxisSlice';
import { ZIndexable } from '../zIndex/ZIndexLayer';
interface PolarGridProps extends ZIndexable {
    /**
     * The x-coordinate of center.
     * When used inside a chart context, this prop is calculated based on the chart's dimensions,
     * and this prop is ignored.
     *
     * This is only used when rendered outside a chart context.
     */
    cx?: number;
    /**
     * The y-coordinate of center.
     * When used inside a chart context, this prop is calculated based on the chart's dimensions,
     * and this prop is ignored.
     *
     * This is only used when rendered outside a chart context.
     */
    cy?: number;
    /**
     * The radius of the inner polar grid.
     * When used inside a chart context, this prop is calculated based on the chart's dimensions,
     * and this prop is ignored.
     *
     * This is only used when rendered outside a chart context.
     */
    innerRadius?: number;
    /**
     * The radius of the outer polar grid.
     * When used inside a chart context, this prop is calculated based on the chart's dimensions,
     * and this prop is ignored.
     *
     * This is only used when rendered outside a chart context.
     */
    outerRadius?: number;
    /**
     * The array of every line grid's angle.
     */
    polarAngles?: ReadonlyArray<number>;
    /**
     * The array of every circle grid's radius.
     */
    polarRadius?: ReadonlyArray<number>;
    /**
     * The type of polar grids.
     * @defaultValue polygon
     */
    gridType?: 'polygon' | 'circle';
    /**
     * @defaultValue true
     */
    radialLines?: boolean;
    /**
     * @defaultValue 0
     */
    angleAxisId?: AxisId;
    /**
     * @defaultValue 0
     */
    radiusAxisId?: AxisId;
    /**
     * Z-Index of this component and its children. The higher the value,
     * the more on top it will be rendered.
     * Components with higher zIndex will appear in front of components with lower zIndex.
     * If undefined or 0, the content is rendered in the default layer without portals.
     *
     * @since 3.4
     * @defaultValue -100
     * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
     */
    zIndex?: number;
    /**
     * The stroke color. If "none", no line will be drawn.
     * @defaultValue #ccc
     */
    stroke?: string;
    /**
     * The width of the stroke.
     * @defaultValue 1
     */
    strokeWidth?: number | string;
    /**
     * The pattern of dashes and gaps used to paint the lines of the grid.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray stroke-dasharray on MDN}
     */
    strokeDasharray?: string | number;
    /**
     * The background color used to fill the space between grid lines.
     * @defaultValue none
     */
    fill?: string;
    /**
     * The opacity of the background used to fill the space between grid lines.
     */
    fillOpacity?: number | string;
}
export type Props = SVGProps<SVGLineElement> & PolarGridProps;
export declare const defaultPolarGridProps: {
    readonly angleAxisId: 0;
    readonly radiusAxisId: 0;
    readonly gridType: "polygon";
    readonly radialLines: true;
    readonly zIndex: -100;
    readonly stroke: "#ccc";
    readonly strokeWidth: 1;
    readonly fill: "none";
};
/**
 * @consumes PolarViewBoxContext
 */
export declare const PolarGrid: {
    (outsideProps: Props): React.JSX.Element | null;
    displayName: string;
};
export {};
