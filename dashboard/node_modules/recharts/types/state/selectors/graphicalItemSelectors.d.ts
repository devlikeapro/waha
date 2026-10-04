import { RechartsRootState } from '../store';
import { GraphicalItemId } from '../graphicalItemsSlice';
import { AxisId } from '../cartesianAxisSlice';
export declare function selectXAxisIdFromGraphicalItemId(state: RechartsRootState, id: GraphicalItemId): AxisId;
export declare function selectYAxisIdFromGraphicalItemId(state: RechartsRootState, id: GraphicalItemId): AxisId;
