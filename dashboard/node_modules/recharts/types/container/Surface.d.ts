import * as React from 'react';
import { ReactNode, CSSProperties, SVGProps } from 'react';
import { CartesianViewBox } from '../util/types';
interface SurfaceProps {
    width: number | string;
    height: number | string;
    viewBox?: CartesianViewBox;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    title?: string;
    desc?: string;
}
export type Props = Omit<SVGProps<SVGSVGElement>, 'viewBox'> & SurfaceProps;
/**
 * Renders an SVG element.
 *
 * All charts already include a Surface component, so you would not normally use this directly.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg
 */
export declare const Surface: React.ForwardRefExoticComponent<Omit<Props, "ref"> & React.RefAttributes<SVGSVGElement>>;
export {};
