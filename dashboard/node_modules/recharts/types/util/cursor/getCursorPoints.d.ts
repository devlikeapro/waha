import { Coordinate, ChartOffsetInternal, PolarCoordinate, CartesianLayout, PolarLayout } from '../types';
import { RadialCursorPoints } from './getRadialCursorPoints';
export declare function getCursorPoints(layout: CartesianLayout | PolarLayout, activeCoordinate: Coordinate | PolarCoordinate, offset: ChartOffsetInternal): [Coordinate, Coordinate] | RadialCursorPoints | undefined;
