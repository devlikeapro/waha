import * as React from 'react';
import { ReactElement, SVGProps } from 'react';
import { ChartOffsetInternal } from '../util/types';
import { AxisPropsNeededForTicksGenerator } from '../util/ChartUtils';
import { GetTicksInput } from './getTicks';
import { AxisId } from '../state/cartesianAxisSlice';
import { ZIndexable } from '../zIndex/ZIndexLayer';
/**
 * The <CartesianGrid horizontal
 */
export type GridLineTypeFunctionProps = Omit<LineItemProps, 'key'> & {
    key: LineItemProps['key'] | undefined;
    offset: ChartOffsetInternal;
};
export type AxisPropsForCartesianGridTicksGeneration = AxisPropsNeededForTicksGenerator & Omit<GetTicksInput, 'ticks' | 'viewBox'>;
type GridLineType = SVGProps<SVGLineElement> | ReactElement<SVGElement> | ((props: GridLineTypeFunctionProps) => ReactElement<SVGElement>) | boolean;
export type HorizontalCoordinatesGenerator = (props: {
    yAxis: AxisPropsForCartesianGridTicksGeneration | undefined;
    width: number;
    height: number;
    offset: ChartOffsetInternal;
}, syncWithTicks: boolean) => number[];
export type VerticalCoordinatesGenerator = (props: {
    xAxis: AxisPropsForCartesianGridTicksGeneration | undefined;
    width: number;
    height: number;
    offset: ChartOffsetInternal;
}, syncWithTicks: boolean) => number[];
interface CartesianGridProps extends ZIndexable {
    /**
     * The width of grid. If undefined, covers the full width of the chart plot area.
     */
    width?: number;
    /**
     * The height of grid. If undefined, covers the full height of the chart plot area.
     */
    height?: number;
    /**
     * A function that generates the y-coordinates of all horizontal lines.
     *
     * @see {@link https://codesandbox.io/p/sandbox/cartesian-grid-with-coordinate-generators-my38cg?file=%2Fsrc%2FApp.tsx Cartesian grid with coordinate generators}
     */
    horizontalCoordinatesGenerator?: HorizontalCoordinatesGenerator;
    /**
     * A function that generates the x-coordinates of all vertical lines.
     *
     * @see {@link https://codesandbox.io/p/sandbox/cartesian-grid-with-coordinate-generators-my38cg?file=%2Fsrc%2FApp.tsx Cartesian grid with coordinate generators}
     */
    verticalCoordinatesGenerator?: VerticalCoordinatesGenerator;
    /**
     * The x-coordinate of grid.
     * If left undefined, it will be computed from the chart's offset and margins.
     */
    x?: number;
    /**
     * The y-coordinate of grid.
     * If left undefined, it will be computed from the chart's offset and margins.
     */
    y?: number;
    /**
     * If set false, no horizontal grid lines will be drawn.
     *
     * @defaultValue true
     */
    horizontal?: GridLineType;
    /**
     * If set false, no vertical grid lines will be drawn.
     *
     * @defaultValue true
     */
    vertical?: GridLineType;
    /**
     * Array of coordinates in pixels where to draw horizontal grid lines.
     * Has priority over syncWithTicks and horizontalValues.
     *
     * @defaultValue []
     */
    horizontalPoints?: number[];
    /**
     * Array of coordinates in pixels where to draw vertical grid lines.
     * Has priority over syncWithTicks and verticalValues.
     *
     * @defaultValue []
     */
    verticalPoints?: number[];
    /**
     * The background color used to fill the space between grid lines
     *
     * @example <CartesianGrid fill="red" />
     * @example <CartesianGrid fill="#ccc" />
     */
    fill?: string;
    /**
     * The opacity of the background used to fill the space between grid lines
     *
     * @example <CartesianGrid fill="red" fillOpacity={0.6} />
     */
    fillOpacity?: number | string;
    /**
     * Defines background color of stripes.
     *
     * The values from this array will be passed in as the `fill` property in a `rect` SVG element.
     * For possible values see: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill#rect
     *
     * In case there are more stripes than colors, the colors will start from beginning.
     * So for example: verticalFill['yellow', 'black'] produces a pattern of yellow|black|yellow|black
     *
     * If this is undefined, or an empty array, then there is no background fill.
     * Note: Grid lines will be rendered above these background stripes.
     *
     * @defaultValue []
     */
    verticalFill?: string[];
    /**
     * Defines background color of stripes.
     *
     * The values from this array will be passed in as the `fill` property in a `rect` SVG element.
     * For possible values see: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill#rect
     *
     * In case there are more stripes than colors, the colors will start from beginning.
     * So for example: horizontalFill['yellow', 'black'] produces a pattern of yellow|black|yellow|black
     *
     * If this is undefined, or an empty array, then there is no background fill.
     * Note: Grid lines will be rendered above these background stripes.
     *
     * @defaultValue []
     */
    horizontalFill?: string[];
    /**
     * If true, only the lines that correspond to the axes ticks values will be drawn.
     * If false, extra lines could be added for each axis (at min and max coordinates), if there will not such ticks.
     * horizontalPoints, verticalPoints, horizontalValues, verticalValues have priority over syncWithTicks.
     *
     * @defaultValue false
     */
    syncWithTicks?: boolean;
    /**
     * Array of values, where horizontal lines will be drawn. Numbers or strings, in dependence on axis type.
     * Has priority over syncWithTicks but not over horizontalPoints.
     */
    horizontalValues?: number[] | string[];
    /**
     * Array of values, where vertical lines will be drawn. Numbers or strings, in dependence on axis type.
     * Has priority over syncWithTicks but not over verticalPoints.
     */
    verticalValues?: number[] | string[];
    /**
     * The pattern of dashes and gaps used to paint the lines of the grid
     *
     * @example <CartesianGrid strokeDasharray="3 3" />
     * @example <CartesianGrid strokeDasharray={[5, 5, 1, 5]} />
     * @example <CartesianGrid strokeDasharray="5 5 1 5" />
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray stroke-dasharray on MDN}
     */
    strokeDasharray?: string | number | ReadonlyArray<number>;
    /**
     * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
     * @defaultValue 0
     */
    xAxisId?: AxisId;
    /**
     * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
     * @defaultValue 0
     */
    yAxisId?: AxisId;
    /**
     * @defaultValue -100
     */
    zIndex?: number;
}
type AcceptedSvgProps = Omit<SVGProps<SVGLineElement>, 'offset' | 'strokeDasharray'>;
export type Props = AcceptedSvgProps & CartesianGridProps;
type LineItemProps = Props & {
    offset: ChartOffsetInternal;
    xAxis: undefined | AxisPropsForCartesianGridTicksGeneration;
    yAxis: undefined | AxisPropsForCartesianGridTicksGeneration;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    key: string;
    index: number;
};
export declare const defaultCartesianGridProps: {
    readonly horizontal: true;
    readonly vertical: true;
    readonly horizontalPoints: [];
    readonly verticalPoints: [];
    readonly verticalFill: [];
    readonly horizontalFill: [];
    readonly xAxisId: 0;
    readonly yAxisId: 0;
    readonly syncWithTicks: false;
    readonly zIndex: -100;
};
/**
 * Renders background grid with lines and fill colors in a Cartesian chart.
 *
 * @consumes CartesianChartContext
 */
export declare function CartesianGrid(props: Props): React.JSX.Element | null;
export declare namespace CartesianGrid {
    var displayName: string;
}
export {};
