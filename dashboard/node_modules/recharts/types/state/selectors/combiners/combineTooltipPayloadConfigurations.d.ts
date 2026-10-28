import { TooltipIndex, TooltipPayloadConfiguration, TooltipState } from '../../tooltipSlice';
import { TooltipEventType } from '../../../util/types';
import { TooltipTrigger } from '../../../chart/types';
export declare const combineTooltipPayloadConfigurations: (tooltipState: TooltipState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => ReadonlyArray<TooltipPayloadConfiguration>;
