import * as React from 'react';
import { ReactNode, SVGAttributes } from 'react';
interface LayerProps {
    className?: string;
    children?: ReactNode;
}
export type Props = SVGAttributes<SVGGElement> & LayerProps;
/**
 * Creates an SVG group element to group other SVG elements.
 *
 * Useful if you want to apply transformations or styles to a set of elements
 * without affecting other elements in the SVG.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/g
 */
export declare const Layer: React.ForwardRefExoticComponent<React.SVGAttributes<SVGGElement> & LayerProps & React.RefAttributes<SVGGElement>>;
export {};
