/**
 * @fileOverview Polygon
 */
import * as React from 'react';
import { SVGProps } from 'react';
import { Coordinate } from '../util/types';
interface PolygonProps {
    className?: string;
    /**
     * The coordinates of all the vertexes of the polygon, like an array of objects with x and y coordinates.
     */
    points?: ReadonlyArray<Coordinate>;
    baseLinePoints?: ReadonlyArray<Coordinate>;
    connectNulls?: boolean;
    /**
     * The customized event handler of click on the polygon
     */
    onClick?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    /**
     * The customized event handler of mousedown on the polygon
     */
    onMouseDown?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    /**
     * The customized event handler of mouseup on the polygon
     */
    onMouseUp?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    /**
     * The customized event handler of mousemove on the polygon
     */
    onMouseMove?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    /**
     * The customized event handler of mouseover on the polygon
     */
    onMouseOver?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    /**
     * The customized event handler of mouseout on the polygon
     */
    onMouseOut?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    /**
     * The customized event handler of mouseenter on the polygon
     */
    onMouseEnter?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
    /**
     * The customized event handler of mouseleave on the polygon
     */
    onMouseLeave?: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
}
export type Props = Omit<SVGProps<SVGPolygonElement>, 'points'> & PolygonProps;
export declare const Polygon: React.FC<Props>;
export {};
