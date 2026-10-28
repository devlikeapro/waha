import type { RechartsRootState } from '../store';
import type { NormalizedStackId } from '../../util/ChartUtils';
import type { BarSettings } from '../types/BarSettings';
export declare const selectAllBarsInStack: (state: RechartsRootState, stackId: NormalizedStackId, isPanorama: boolean) => ReadonlyArray<BarSettings>;
export type BarStackItem = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Takes two rectangles and returns a new rectangle that encompasses both.
 * It takes the minimum x and y, and the maximum width and height.
 * It handles overlapping rectangles, and rectangles with a gap between them.
 * @param rect1
 * @param rect2
 */
export declare const expandRectangle: (rect1: BarStackItem | undefined, rect2: BarStackItem | undefined) => BarStackItem | undefined;
export declare const selectStackRects: (state: RechartsRootState, stackId: NormalizedStackId, isPanorama: boolean) => ReadonlyArray<BarStackItem | undefined>;
