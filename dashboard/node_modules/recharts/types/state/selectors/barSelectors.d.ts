import { ReactElement } from 'react';
import { Series } from 'victory-vendor/d3-shape';
import { RechartsRootState } from '../store';
import { BarPositionPosition, StackId } from '../../util/ChartUtils';
import { DataKey } from '../../util/types';
import { BarRectangleItem } from '../../cartesian/Bar';
import { StackDataPoint, StackSeriesIdentifier } from '../../util/stacks/stackTypes';
import { BarSettings } from '../types/BarSettings';
import { GraphicalItemId } from '../graphicalItemsSlice';
import { BarCategory } from './combiners/combineBarSizeList';
export declare const selectMaxBarSize: (_state: RechartsRootState, id: GraphicalItemId) => number | undefined;
export declare const selectAllVisibleBars: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => ReadonlyArray<BarSettings>;
export type SizeList = ReadonlyArray<BarCategory>;
export declare const selectBarCartesianAxisSize: (state: RechartsRootState, id: GraphicalItemId) => number | undefined;
export declare const selectBarSizeList: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => SizeList;
export declare const selectBarBandSize: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => number;
export declare const selectAxisBandSize: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => number | undefined;
export type BarWithPosition = {
    stackId: StackId | undefined;
    /**
     * List of dataKeys of items stacked at this position.
     * All of these Bars are either sharing the same stackId,
     * or this is an array with one Bar because it has no stackId defined.
     *
     * This structure limits us to having one dataKey only once per stack which I think is reasonable.
     * People who want to have the same data twice can duplicate their data to have two distinct dataKeys.
     */
    dataKeys: ReadonlyArray<DataKey<any>>;
    /**
     * Position of this stack in absolute pixels measured from the start of the chart
     */
    position: BarPositionPosition;
};
export declare const selectAllBarPositions: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => ReadonlyArray<BarWithPosition> | undefined;
export declare const selectBarPosition: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => BarPositionPosition | undefined;
export declare const selectStackedDataOfItem: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean) => Series<StackDataPoint, StackSeriesIdentifier> | undefined;
export declare const selectBarRectangles: (state: RechartsRootState, id: GraphicalItemId, isPanorama: boolean, cells: ReadonlyArray<ReactElement> | undefined) => ReadonlyArray<BarRectangleItem> | undefined;
