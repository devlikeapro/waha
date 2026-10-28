import * as React from 'react';
import { SVGProps } from 'react';
interface SectorProps {
    className?: string;
    /**
     * The x-coordinate of center.
     * @default 0
     */
    cx?: number;
    /**
     * The y-coordinate of center.
     * @default 0
     */
    cy?: number;
    /**
     * The inner radius of the sector.
     * @default 0
     */
    innerRadius?: number;
    /**
     * The outer radius of the sector.
     * @default 0
     */
    outerRadius?: number;
    /**
     * The start angle of the sector.
     * @default 0
     */
    startAngle?: number;
    /**
     * The end angle of the sector.
     * @default 0
     */
    endAngle?: number;
    /**
     * The radius of corners.
     * @default 0
     */
    cornerRadius?: number;
    /**
     * Whether force to render round corner when the angle of sector is very small
     * @default false
     */
    forceCornerRadius?: boolean;
    cornerIsExternal?: boolean;
    /**
     * The customized event handler of click on the sector
     */
    onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousedown on the sector
     */
    onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseup on the sector
     */
    onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mousemove on the sector
     */
    onMouseMove?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseover on the sector
     */
    onMouseOver?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseout on the sector
     */
    onMouseOut?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseenter on the sector
     */
    onMouseEnter?: (e: React.MouseEvent<SVGPathElement>) => void;
    /**
     * The customized event handler of mouseleave on the sector
     */
    onMouseLeave?: (e: React.MouseEvent<SVGPathElement>) => void;
}
/**
 * SVG cx, cy are `string | number | undefined`, but internally we use `number` so let's
 * override the types here.
 */
export type Props = Omit<SVGProps<SVGPathElement>, 'cx' | 'cy' | 'dangerouslySetInnerHTML'> & Partial<SectorProps>;
export declare const defaultSectorProps: {
    readonly cx: 0;
    readonly cy: 0;
    readonly innerRadius: 0;
    readonly outerRadius: 0;
    readonly startAngle: 0;
    readonly endAngle: 0;
    readonly cornerRadius: 0;
    readonly forceCornerRadius: false;
    readonly cornerIsExternal: false;
};
export declare const Sector: React.FC<Props>;
export {};
