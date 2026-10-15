import { RechartsRootState } from '../store';
import { ActiveTooltipProps } from '../tooltipSlice';
import { RelativePointer } from '../../util/types';
export declare const selectActivePropsFromChartPointer: (state: RechartsRootState, chartPointer: RelativePointer) => ActiveTooltipProps | undefined;
