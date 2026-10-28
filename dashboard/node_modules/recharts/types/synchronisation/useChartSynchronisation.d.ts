import { TooltipIndex } from '../state/tooltipSlice';
import { Coordinate, TooltipEventType } from '../util/types';
import { TooltipTrigger } from '../chart/types';
import { ActiveLabel } from './types';
/**
 * Will receive synchronisation events from other charts.
 *
 * Reads syncMethod from state and decides how to synchronise the tooltip based on that.
 *
 * @returns void
 */
export declare function useSynchronisedEventsFromOtherCharts(): void;
/**
 * Will send events to other charts.
 * If syncId is undefined, no events will be sent.
 *
 * This ignores the syncMethod, because that is set and computed on the receiving end.
 *
 * Outgoing emissions are suppressed when `isReceivingSynchronisation` is true,
 * which is determined by the presence of `sourceViewBox` in the sync state (not by
 * the tooltip's `active` flag). This matters for charts with sparse data: when an
 * incoming sync label has no matching tick, the tooltip becomes inactive but
 * `sourceViewBox` remains set, so the chart is still considered "receiving" and
 * will not emit a counter-sync event that would cascade-clear other charts' tooltips.
 *
 * @param tooltipEventType from Tooltip
 * @param trigger from Tooltip
 * @param activeCoordinate from state
 * @param activeLabel from state
 * @param activeIndex from state
 * @param isTooltipActive from state
 * @returns void
 */
export declare function useTooltipChartSynchronisation(tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, activeCoordinate: Coordinate | undefined, activeLabel: ActiveLabel, activeIndex: TooltipIndex | undefined, isTooltipActive: boolean): void;
/**
 * Emits brush sync events to other charts when the brush start/end indexes change.
 * If syncId is undefined, no events will be sent.
 */
export declare function useBrushChartSynchronisation(): void;
