import { ChartOffsetInternal, Coordinate, LayoutType, TickItem } from '../../../util/types';
import { TooltipIndex, TooltipPayloadConfiguration } from '../../tooltipSlice';
export declare const combineCoordinateForDefaultIndex: (width: number, height: number, layout: LayoutType, offset: ChartOffsetInternal, tooltipTicks: ReadonlyArray<TickItem> | undefined, defaultIndex: TooltipIndex | undefined, tooltipConfigurations: ReadonlyArray<TooltipPayloadConfiguration>) => Coordinate | undefined;
