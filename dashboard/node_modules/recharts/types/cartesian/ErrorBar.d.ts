/**
 * @fileOverview Render a group of error bar
 */
import * as React from 'react';
import { SVGProps } from 'react';
import { EasingInput, DataKey } from '../util/types';
import { BarRectangleItem } from './Bar';
import { LinePointItem } from './Line';
import { ScatterPointItem } from './Scatter';
import { ZIndexable } from '../zIndex/ZIndexLayer';
export interface ErrorBarDataItem {
    x: number | undefined;
    y: number | undefined;
    value: number;
    errorVal?: number[] | number;
}
/**
 * So usually the direction is decided by the chart layout.
 * Horizontal layout means error bars are vertical means direction=y
 * Vertical layout means error bars are horizontal means direction=x
 *
 * Except! In Scatter chart, error bars can go both ways.
 *
 * So this property is only ever used in Scatter chart, and ignored elsewhere.
 */
export type ErrorBarDirection = 'x' | 'y';
export type ErrorBarDataPointFormatter<T extends BarRectangleItem | LinePointItem | ScatterPointItem> = (entry: T, dataKey: DataKey<T, number[] | number>, direction: ErrorBarDirection) => ErrorBarDataItem;
/**
 * External ErrorBar props, visible for users of the library
 */
interface ErrorBarProps<DataPointType = any, DataValueType = any> extends ZIndexable {
    /**
     * Decides how to extract the value of this ErrorBar from the data:
     * - `string`: the name of the field in the data object;
     * - `number`: the index of the field in the data;
     * - `function`: a function that receives the data object and returns the value of this ErrorBar.
     *
     * The error values can be a single value for symmetric error bars;
     * or an array of a lower and upper error value for asymmetric error bars.
     */
    dataKey: DataKey<DataPointType, DataValueType>;
    /**
     * Width of the error bar ends (the serifs) in pixels.
     * This is not the total width of the error bar, but just the width of the little lines at the ends.
     *
     * The total width of the error bar is determined by the data value plus/minus the error value.
     *
     * @defaultValue 5
     */
    width?: number;
    /**
     * Direction of the error bar. Usually determined by chart layout, except in Scatter chart.
     * In Scatter chart, "x" means horizontal error bars, "y" means vertical error bars.
     */
    direction?: ErrorBarDirection;
    /**
     * @defaultValue true
     */
    isAnimationActive?: boolean;
    /**
     * @defaultValue 0
     */
    animationBegin?: number;
    /**
     * @defaultValue 400
     */
    animationDuration?: number;
    /**
     * @defaultValue ease-in-out
     */
    animationEasing?: EasingInput;
    /**
     * The width of the stroke
     */
    strokeWidth?: number | string;
    /**
     * The stroke color. If "none", no line will be drawn.
     *
     * @defaultValue black
     */
    stroke?: string;
    /**
     * @defaultValue 400
     */
    zIndex?: number;
}
export type Props = SVGProps<SVGLineElement> & ErrorBarProps;
export declare const errorBarDefaultProps: {
    readonly stroke: "black";
    readonly strokeWidth: 1.5;
    readonly width: 5;
    readonly offset: 0;
    readonly isAnimationActive: true;
    readonly animationBegin: 0;
    readonly animationDuration: 400;
    readonly animationEasing: "ease-in-out";
    readonly zIndex: 400;
};
/**
 * ErrorBar renders whiskers to represent error margins on a chart.
 *
 * It must be a child of a graphical element.
 *
 * ErrorBar expects data in one of the following forms:
 * - Symmetric error bars: a single error value representing both lower and upper bounds.
 * - Asymmetric error bars: an array of two values representing lower and upper bounds separately. First value is the lower bound, second value is the upper bound.
 *
 * The values provided are relative to the main data value.
 * For example, if the main data value is 10 and the error value is 2,
 * the error bar will extend from 8 to 12 for symmetric error bars.
 *
 * In other words, what ErrorBar will render is:
 * - For symmetric error bars: [value - errorVal, value + errorVal]
 * - For asymmetric error bars: [value - errorVal[0], value + errorVal[1]]
 *
 * In stacked or ranged Bar charts, ErrorBar will use the higher data value
 * as the reference point for calculating the error bar positions.
 *
 * @consumes ErrorBarContext
 */
export declare function ErrorBar(outsideProps: Props): React.JSX.Element;
export declare namespace ErrorBar {
    var displayName: string;
}
export {};
