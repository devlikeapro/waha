import { LinePointItem } from '../../cartesian/Line';
import { RechartsRootState } from '../store';
import { AxisId } from '../cartesianAxisSlice';
import { GraphicalItemId } from '../graphicalItemsSlice';
export declare const selectLinePoints: (state: RechartsRootState, xAxisId: AxisId, yAxisId: AxisId, isPanorama: boolean, id: GraphicalItemId) => ReadonlyArray<LinePointItem> | undefined;
