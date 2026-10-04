import { NullableCoordinate } from '../../util/types';
import { RechartsRootState } from '../store';
import { StackDataPoint } from '../../util/stacks/stackTypes';
import { GraphicalItemId } from '../graphicalItemsSlice';
export interface AreaPointItem extends NullableCoordinate {
    x: number | null;
    y: number | null;
    value?: ReadonlyArray<unknown>;
    payload?: any;
}
export type ComputedArea = {
    points: ReadonlyArray<AreaPointItem>;
    baseLine: number | ReadonlyArray<AreaPointItem>;
    isRange: boolean;
};
export declare const selectGraphicalItemStackedData: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => ReadonlyArray<StackDataPoint> | undefined;
export declare const selectArea: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => ComputedArea | undefined;
