/**
 * @fileOverview Rectangle
 */
import * as React from 'react';
import { SVGProps } from 'react';
import { AnimationDuration } from '../util/types';
import { EasingInput } from '../animation/easing';
/**
 * @inline
 */
export type RectRadius = number | [number, number, number, number];
interface RectangleProps {
    className?: string;
    /**
     * The x-coordinate of top left point of the rectangle.
     * @defaultValue 0
     */
    x?: number;
    /**
     * The y-coordinate of top left point of the rectangle.
     * @defaultValue 0
     */
    y?: number;
    /**
     * Width of the rectangle in pixels.
     * @defaultValue 0
     */
    width?: number;
    /**
     * Height of the rectangle in pixels.
     * @defaultValue 0
     */
    height?: number;
    /**
     * The radius of corners.
     *
     * If you provide a single number, it applies to all four corners.
     * If you provide an array of four numbers, they apply to top-left, top-right, bottom-right, bottom-left corners respectively.
     *
     * @see {@link https://recharts.github.io/en-US/guide/roundedBars/ Guide: Rounded bar corners}
     *
     * @defaultValue 0
     */
    radius?: RectRadius;
    /**
     * @defaultValue false
     */
    isAnimationActive?: boolean;
    /**
     * @defaultValue false
     */
    isUpdateAnimationActive?: boolean;
    /**
     * @defaultValue 0
     */
    animationBegin?: number;
    /**
     * @defaultValue 1500
     */
    animationDuration?: AnimationDuration;
    /**
     * @defaultValue ease
     */
    animationEasing?: EasingInput;
    /**
     * The customized event handler of click on the rectangle
     */
    onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousedown on the rectangle
     */
    onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseup on the rectangle
     */
    onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousemove on the rectangle
     */
    onMouseMove?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseover on the rectangle
     */
    onMouseOver?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseout on the rectangle
     */
    onMouseOut?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseenter on the rectangle
     */
    onMouseEnter?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseleave on the rectangle
     */
    onMouseLeave?: (e: React.MouseEvent<SVGPathElement>) => void;
}
export type Props = Omit<SVGProps<SVGPathElement>, 'radius'> & RectangleProps;
export declare const defaultRectangleProps: {
    readonly x: 0;
    readonly y: 0;
    readonly width: 0;
    readonly height: 0;
    readonly radius: 0;
    readonly isAnimationActive: false;
    readonly isUpdateAnimationActive: false;
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
};
/**
 * Renders a rectangle element. Unlike the {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/rect rect SVG element}, this component supports rounded corners
 * and animation.
 *
 * This component accepts X and Y coordinates in pixels.
 * If you need to position the rectangle based on your chart's data,
 * consider using the {@link ReferenceArea} component instead.
 *
 * @param rectangleProps
 * @constructor
 */
export declare const Rectangle: React.FC<Props>;
export {};
