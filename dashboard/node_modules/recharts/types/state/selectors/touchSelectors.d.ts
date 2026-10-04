import { RechartsRootState } from '../store';
import { TooltipIndex } from '../tooltipSlice';
import { Coordinate } from '../../util/types';
import { GraphicalItemId } from '../graphicalItemsSlice';
export declare const selectTooltipCoordinate: (state: RechartsRootState, tooltipIndex: TooltipIndex, graphicalItemId: GraphicalItemId) => Coordinate | undefined;
