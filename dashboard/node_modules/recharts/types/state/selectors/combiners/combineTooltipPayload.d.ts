import { TooltipIndex, TooltipPayload, TooltipPayloadConfiguration, TooltipPayloadSearcher } from '../../tooltipSlice';
import { ChartDataState } from '../../chartDataSlice';
import { DataKey, TooltipEventType } from '../../../util/types';
import { ActiveLabel } from '../../../synchronisation/types';
export declare const combineTooltipPayload: (tooltipPayloadConfigurations: ReadonlyArray<TooltipPayloadConfiguration>, activeIndex: TooltipIndex, chartDataState: ChartDataState, tooltipAxisDataKey: DataKey<any> | undefined, activeLabel: ActiveLabel, tooltipPayloadSearcher: TooltipPayloadSearcher | undefined, tooltipEventType: TooltipEventType | undefined) => TooltipPayload | undefined;
