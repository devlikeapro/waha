import { RelativePointer, MousePointer, TouchPointer } from './types';
/**
 * Computes relative element coordinates from mouse or touch event.
 *
 * The output coordinates are relative to the top-left corner of the active element (= currentTarget),
 * where the top-left corner is (0, 0).
 * Moving right, the x-coordinate increases, and moving down, the y-coordinate increases.
 *
 * The coordinates are rounded to the nearest integer and account for CSS transform scale.
 * So element that's scaled will return the same coordinates as element that's not scaled.
 *
 * In other words: you zoom in or out, numbers stay the same.
 *
 * This function works with both HTML elements and SVG elements.
 *
 * It works with both Mouse and Touch events.
 * For Touch events, it returns an array of coordinates, one for each touch point.
 * For Mouse events, it returns a single coordinate object.
 *
 * @example
 * ```tsx
 * // In an HTML element event handler. Legend passes the native event as the 3rd argument.
 * <Legend onMouseMove={(_data, _i, e) => {
 *   // These coordinates are relative to the top-left corner of the Legend element
 *   const { relativeX, relativeY } = getRelativeCoordinate(e);
 *   console.log(`Mouse at Legend position: (${relativeX}, ${relativeY})`);
 * }}>
 * ```
 *
 * @example
 * ```tsx
 * // In an SVG element event handler. Area is an SVG element, and passes the event as second argument.
 * <Area onMouseMove={(_, e) => {
 *   const { relativeX, relativeY } = getRelativeCoordinate(e);
 *   console.log(`Mouse at Area position: (${relativeX}, ${relativeY})`);
 *   // Here you can call usePlotArea to convert to chart coordinates
 * }}>
 * ```
 *
 * @example
 * ```tsx
 * // In a chart root touch handler. Chart root passes the event as second argument.
 * <LineChart onTouchMove={(_, e) => {
 *   const touchPoints = getRelativeCoordinate(e);
 *   touchPoints.forEach(({ relativeX, relativeY }, index) => {
 *     console.log(`Touch point ${index} at LineChart position: (${relativeX}, ${relativeY})`);
 *   });
 * }}>
 * ```
 *
 * @since 3.8
 * @param event The mouse or touch event from React event handlers (works with both HTML and SVG elements)
 * @returns Coordinates relative to the top-left corner of the element. Single object for Mouse events, array of objects for Touch events.
 */
export declare function getRelativeCoordinate(event: MousePointer): RelativePointer;
export declare function getRelativeCoordinate(event: TouchPointer): Array<RelativePointer>;
