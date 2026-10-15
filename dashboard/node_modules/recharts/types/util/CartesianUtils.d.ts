import { Coordinate, RectangleCoordinate, RectanglePosition, Size } from './types';
export declare const rectWithPoints: ({ x: x1, y: y1 }: Coordinate, { x: x2, y: y2 }: Coordinate) => RectanglePosition;
/**
 * Compute the x, y, width, and height of a box from two reference points.
 * @param  {Object} coords     x1, x2, y1, and y2
 * @return {Object} object
 */
export declare const rectWithCoords: ({ x1, y1, x2, y2 }: RectangleCoordinate) => RectanglePosition;
/** Normalizes the angle so that 0 <= angle < 180.
 * @param {number} angle Angle in degrees.
 * @return {number} the normalized angle with a value of at least 0 and never greater or equal to 180. */
export declare function normalizeAngle(angle: number): number;
/** Calculates the width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 * @param {Object} size Width and height of the text in a horizontal position.
 * @param {number} angle Angle in degrees in which the text is displayed.
 * @return {number} The width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 */
export declare const getAngledRectangleWidth: ({ width, height }: Size, angle?: number | undefined) => number;
