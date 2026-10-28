import * as React from 'react';
import { ActiveShape, DataKey, ShapeAnimationProps } from './types';
import { Props as RectangleProps } from '../shape/Rectangle';
import { BarShapeProps } from '../cartesian/Bar';
export declare const defaultBarShape: React.FC<RectangleProps>;
export type BarRectangleProps = BarShapeProps & {
    option: ActiveShape<BarShapeProps, SVGPathElement>;
    onMouseEnter?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    onMouseLeave?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    onClick?: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    dataKey: DataKey<any> | undefined;
} & ShapeAnimationProps & Omit<RectangleProps, 'onAnimationStart' | 'onAnimationEnd'>;
export declare function BarRectangle({ option, ...shapeProps }: BarRectangleProps): React.JSX.Element;
export type MinPointSize = number | ((value: number | undefined | null, index: number) => number);
/**
 * Safely gets minPointSize from the minPointSize prop if it is a function
 * @param minPointSize minPointSize as passed to the Bar component
 * @param defaultValue default minPointSize
 * @returns minPointSize
 */
export declare const minPointSizeCallback: (minPointSize: MinPointSize, defaultValue?: number) => (value: unknown, index: number) => number;
