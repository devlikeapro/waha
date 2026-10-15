/**
 * @fileOverview Rectangle
 */
import * as React from 'react';
import { SVGProps } from 'react';
import { AnimationDuration, EasingInput } from '../util/types';
interface TrapezoidProps {
    className?: string;
    /**
     * The x-coordinate of top left point of the trapezoid.
     * @default 0
     */
    x?: number;
    /**
     * The y-coordinate of top left point of the trapezoid.
     * @default 0
     */
    y?: number;
    /**
     * Width of the upper horizontal side of the trapezoid in pixels.
     * @default 0
     */
    upperWidth?: number;
    /**
     * Width of the lower horizontal side of the trapezoid in pixels.
     * @default 0
     */
    lowerWidth?: number;
    /**
     * Height of the trapezoid in pixels.
     * @default 0
     */
    height?: number;
    /**
     * If set to true, trapezoid will update and render with a gradual fade-in animation from left to right.
     * @default false
     */
    isUpdateAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: AnimationDuration;
    animationEasing?: EasingInput;
    /**
     * The customized event handler of click on the trapezoid
     */
    onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousedown on the trapezoid
     */
    onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseup on the trapezoid
     */
    onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousemove on the trapezoid
     */
    onMouseMove?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseover on the trapezoid
     */
    onMouseOver?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseout on the trapezoid
     */
    onMouseOut?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseenter on the trapezoid
     */
    onMouseEnter?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseleave on the trapezoid
     */
    onMouseLeave?: (e: React.MouseEvent<SVGPathElement>) => void;
}
export type Props = SVGProps<SVGPathElement> & TrapezoidProps;
export declare const defaultTrapezoidProps: {
    readonly x: 0;
    readonly y: 0;
    readonly upperWidth: 0;
    readonly lowerWidth: 0;
    readonly height: 0;
    readonly isUpdateAnimationActive: false;
    readonly animationBegin: 0;
    readonly animationDuration: 1500;
    readonly animationEasing: "ease";
};
export declare const Trapezoid: React.FC<Props>;
export {};
