import { ReactElement } from 'react';
import { ScatterPointItem } from '../../cartesian/Scatter';
import { RechartsRootState } from '../store';
import { AxisId } from '../cartesianAxisSlice';
import { GraphicalItemId } from '../graphicalItemsSlice';
export declare const selectScatterPoints: (state: RechartsRootState, xAxisId: AxisId, yAxisId: AxisId, zAxisId: AxisId, id: GraphicalItemId, cells: ReadonlyArray<ReactElement> | undefined, isPanorama: boolean) => ReadonlyArray<ScatterPointItem> | undefined;
