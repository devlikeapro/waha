import { AxisType, CartesianLayout, ChartOffsetInternal, RelativePointer, Coordinate, PolarCoordinate, PolarLayout, RangeObj, TickItem } from './types';
import { AxisRange } from '../state/selectors/axisSelectors';
export declare const getActiveCartesianCoordinate: (layout: CartesianLayout, tooltipTicks: readonly TickItem[], activeIndex: number | undefined, pointer: RelativePointer) => Coordinate;
/**
 * Get the active coordinate in polar coordinate system.
 * Internally we only really use x and y, but this returned object is part of public API
 * (because it goes straight to the tooltip content) so we keep all the other properties
 * for backwards compatibility.
 *
 * @param layout - The polar layout type ('centric' or 'radial').
 * @param tooltipTicks - Array of tick items used for tooltips.
 * @param activeIndex - The index of the active tick.
 * @param rangeObj - The range object containing polar chart properties.
 * @returns The active coordinate object with polar properties.
 */
export declare const getActivePolarCoordinate: (layout: PolarLayout, tooltipTicks: readonly TickItem[], activeIndex: number | undefined, rangeObj: RangeObj) => PolarCoordinate;
export declare function isInCartesianRange(pointer: RelativePointer, offset: ChartOffsetInternal): boolean;
export declare const calculateActiveTickIndex: (
/**
 * For different layouts, `coordinate` is different:
 * In horizontal layout, this is expected to be the `x` coordinate
 * vertical -> y
 * centric -> angle
 * radial -> radius
 */
coordinate: number | undefined, ticks: ReadonlyArray<TickItem> | undefined, unsortedTicks: ReadonlyArray<TickItem>, axisType: AxisType | undefined, range: AxisRange | undefined) => number | undefined;
