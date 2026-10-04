import { RechartsRootState } from '../store';
import { AxisRange } from './axisSelectors';
import { CategoricalDomain, Coordinate, RechartsScaleType, DataKey, NumberDomain, TickItem } from '../../util/types';
import { ChartData } from '../chartDataSlice';
import { CartesianGraphicalItemSettings, GraphicalItemSettings, PolarGraphicalItemSettings } from '../graphicalItemsSlice';
import { TooltipIndex, TooltipPayload } from '../tooltipSlice';
import { ActiveLabel } from '../../synchronisation/types';
import { RechartsScale } from '../../util/scale/RechartsScale';
export declare const selectTooltipAxisRealScaleType: (state: RechartsRootState) => RechartsScaleType | undefined;
export declare const selectAllUnfilteredGraphicalItems: (state: RechartsRootState) => ReadonlyArray<CartesianGraphicalItemSettings | PolarGraphicalItemSettings>;
export declare const selectAllGraphicalItemsSettings: (state: RechartsRootState) => ReadonlyArray<GraphicalItemSettings>;
export declare const selectTooltipGraphicalItemsData: ((state: RechartsRootState) => unknown[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: readonly GraphicalItemSettings[]) => unknown[];
    memoizedResultFunc: ((resultFuncArgs_0: readonly GraphicalItemSettings[]) => unknown[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => unknown[];
    dependencies: [(state: RechartsRootState) => ReadonlyArray<GraphicalItemSettings>];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
/**
 * Data for tooltip always use the data with indexes set by a Brush,
 * and never accept the isPanorama flag:
 * because Tooltip never displays inside the panorama anyway
 * so we don't need to worry what would happen there.
 */
export declare const selectTooltipDisplayedData: (state: RechartsRootState) => ChartData;
export declare const selectTooltipAxisDomain: (state: RechartsRootState) => NumberDomain | CategoricalDomain | undefined;
export declare const selectTooltipAxisDomainIncludingNiceTicks: (state: RechartsRootState) => NumberDomain | CategoricalDomain | undefined;
export declare const selectTooltipAxisRangeWithReverse: (state: RechartsRootState) => AxisRange | undefined;
export declare const selectTooltipAxisScale: (state: RechartsRootState) => RechartsScale | undefined;
export declare const selectTooltipCategoricalDomain: (state: RechartsRootState) => ReadonlyArray<unknown> | undefined;
/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
export declare const selectTooltipAxisTicks: (state: RechartsRootState) => ReadonlyArray<TickItem> | undefined;
export declare const selectActiveTooltipIndex: (state: RechartsRootState) => TooltipIndex | null;
export declare const selectActiveLabel: (state: RechartsRootState) => ActiveLabel;
export declare const selectActiveTooltipDataKey: (state: RechartsRootState) => DataKey<any> | undefined;
export declare const selectActiveTooltipGraphicalItemId: (state: RechartsRootState) => string | undefined;
export declare const selectActiveTooltipCoordinate: (state: RechartsRootState) => Coordinate | undefined;
export declare const selectIsTooltipActive: (state: RechartsRootState) => boolean;
export declare const selectActiveTooltipPayload: (state: RechartsRootState) => TooltipPayload | undefined;
export declare const selectActiveTooltipDataPoints: ((state: RechartsRootState) => any[] | undefined) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: TooltipPayload | undefined) => any[] | undefined;
    memoizedResultFunc: ((resultFuncArgs_0: TooltipPayload | undefined) => any[] | undefined) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => any[] | undefined;
    dependencies: [(state: RechartsRootState) => TooltipPayload | undefined];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
