/**
 * @fileOverview Cross
 */
import * as React from 'react';
import { SVGProps } from 'react';
interface CrossProps {
    /**
     * The x-coordinate of the vertical line of the cross in pixels.
     */
    x?: number;
    /**
     * The y-coordinate of the horizontal line of the cross in pixels.
     */
    y?: number;
    /**
     * Width of the cross in pixels.
     */
    width?: number;
    /**
     * Height of the cross in pixels.
     */
    height?: number;
    /**
     * The y-coordinate of the top left point in the boundary box of the cross.
     */
    top?: number;
    /**
     * The x-coordinate of the top left point in the boundary box of the cross.
     */
    left?: number;
    className?: number;
}
export type Props = SVGProps<SVGPathElement> & CrossProps;
export declare const Cross: React.FC<Props>;
export {};
