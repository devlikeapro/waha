import { TooltipIndex, TooltipInteractionState } from '../../tooltipSlice';
import { ChartData } from '../../chartDataSlice';
import { DataKey, CategoricalDomain, NumberDomain } from '../../../util/types';
export declare const combineActiveTooltipIndex: (tooltipInteraction: TooltipInteractionState | undefined, chartData: ChartData, axisDataKey?: DataKey<unknown>, domain?: NumberDomain | CategoricalDomain) => TooltipIndex | null;
