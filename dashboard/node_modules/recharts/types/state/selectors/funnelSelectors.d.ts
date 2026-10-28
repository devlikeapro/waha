import { ReactElement } from 'react';
import { FunnelTrapezoidItem } from '../../cartesian/Funnel';
import { ChartData } from '../chartDataSlice';
import { RechartsRootState } from '../store';
import { DataKey, TooltipType } from '../../util/types';
import { GraphicalItemId } from '../graphicalItemsSlice';
export type ResolvedFunnelSettings = {
    dataKey: DataKey<any>;
    data: ChartData | undefined;
    nameKey: DataKey<any>;
    tooltipType?: TooltipType;
    lastShapeType?: 'triangle' | 'rectangle';
    reversed?: boolean;
    customWidth?: string | number;
    cells: ReadonlyArray<ReactElement>;
    presentationProps: Record<string, any> | null;
    id: GraphicalItemId;
};
export declare const selectFunnelTrapezoids: (state: RechartsRootState, funnelSettings: ResolvedFunnelSettings) => ReadonlyArray<FunnelTrapezoidItem>;
