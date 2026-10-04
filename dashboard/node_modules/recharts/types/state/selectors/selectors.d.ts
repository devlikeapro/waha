import { RechartsRootState } from '../store';
import { ActiveTooltipProps, TooltipIndex, TooltipInteractionState, TooltipPayload, TooltipPayloadConfiguration } from '../tooltipSlice';
import { AxisType, CartesianLayout, ChartOffsetInternal, RelativePointer, Coordinate, DataKey, PolarLayout, PolarViewBoxRequired, TickItem, TooltipEventType } from '../../util/types';
import { TooltipTrigger } from '../../chart/types';
import { AxisRange } from './axisSelectors';
export declare const useChartName: () => string | undefined;
export declare const selectOrderedTooltipTicks: ((state: RechartsRootState) => TickItem[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: readonly TickItem[] | undefined) => TickItem[];
    memoizedResultFunc: ((resultFuncArgs_0: readonly TickItem[] | undefined) => TickItem[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => TickItem[];
    dependencies: [(state: RechartsRootState) => ReadonlyArray<TickItem> | undefined];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectTooltipInteractionState: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => TooltipInteractionState;
export declare const selectActiveIndex: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => TooltipIndex | null;
export declare const selectTooltipDataKey: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger) => DataKey<any> | undefined;
export declare const selectTooltipPayloadConfigurations: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => ReadonlyArray<TooltipPayloadConfiguration>;
export declare const selectCoordinateForDefaultIndex: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => Coordinate | undefined;
export declare const selectActiveCoordinate: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => Coordinate | undefined;
export declare const selectActiveLabel: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => string | number | undefined;
export declare const selectTooltipPayload: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => TooltipPayload | undefined;
export declare const selectIsTooltipActive: (state: RechartsRootState, tooltipEventType: TooltipEventType | undefined, trigger: TooltipTrigger, defaultIndex: TooltipIndex | undefined) => {
    isActive: boolean;
    activeIndex: TooltipIndex | null;
};
export declare const combineActiveProps: (chartEvent: RelativePointer | undefined, layout: CartesianLayout | PolarLayout | undefined, polarViewBox: PolarViewBoxRequired | undefined, tooltipAxisType: AxisType | undefined, tooltipAxisRange: AxisRange | undefined, tooltipTicks: ReadonlyArray<TickItem> | undefined, orderedTooltipTicks: ReadonlyArray<TickItem> | undefined, offset: ChartOffsetInternal) => ActiveTooltipProps | undefined;
