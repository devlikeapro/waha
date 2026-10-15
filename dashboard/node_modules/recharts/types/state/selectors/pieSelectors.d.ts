import { ReactElement } from 'react';
import { PieSectorDataItem } from '../../polar/Pie';
import { RechartsRootState } from '../store';
import { ChartData } from '../chartDataSlice';
import type { LegendPayload } from '../../component/DefaultLegendContent';
import { GraphicalItemId } from '../graphicalItemsSlice';
export declare const selectDisplayedData: (state: RechartsRootState, id: GraphicalItemId, cells: ReadonlyArray<ReactElement> | undefined) => ChartData | undefined;
export declare const selectPieLegend: (state: RechartsRootState, id: GraphicalItemId, cells: ReadonlyArray<ReactElement> | undefined) => ReadonlyArray<LegendPayload> | undefined;
export declare const selectPieSectors: (state: RechartsRootState, id: GraphicalItemId, cells: ReadonlyArray<ReactElement> | undefined) => ReadonlyArray<PieSectorDataItem> | undefined;
