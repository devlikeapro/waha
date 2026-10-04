import { ChartOffsetInternal, RelativePointer, Coordinate, PolarViewBoxRequired, RangeObj } from './types';
export declare const RADIAN: number;
export declare const degreeToRadian: (angle: number) => number;
export declare const radianToDegree: (angleInRadian: number) => number;
export declare const polarToCartesian: (cx: number, cy: number, radius: number, angle: number) => Coordinate;
export declare const getMaxRadius: (width: number, height: number, offset?: ChartOffsetInternal) => number;
export declare const inRangeOfSector: ({ relativeX: x, relativeY: y }: RelativePointer, viewBox: PolarViewBoxRequired) => RangeObj | null;
