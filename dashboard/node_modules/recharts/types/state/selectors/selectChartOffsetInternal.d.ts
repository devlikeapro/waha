import { ChartOffsetInternal } from '../../util/types';
import { RechartsRootState } from '../store';
export declare const selectBrushHeight: (state: RechartsRootState) => number;
export declare function selectLeftAxesOffset(state: RechartsRootState): number;
export declare function selectRightAxesOffset(state: RechartsRootState): number;
export declare function selectTopAxesOffset(state: RechartsRootState): number;
export declare function selectBottomAxesOffset(state: RechartsRootState): number;
/**
 * For internal use only.
 *
 * @param root state
 * @return ChartOffsetInternal
 */
export declare const selectChartOffsetInternal: (state: RechartsRootState) => ChartOffsetInternal;
export declare const selectChartViewBox: ((state: RechartsRootState) => Required<import("../..").CartesianViewBox>) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: ChartOffsetInternal) => Required<import("../..").CartesianViewBox>;
    memoizedResultFunc: ((resultFuncArgs_0: ChartOffsetInternal) => Required<import("../..").CartesianViewBox>) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => Required<import("../..").CartesianViewBox>;
    dependencies: [(state: RechartsRootState) => ChartOffsetInternal];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectAxisViewBox: ((state: RechartsRootState) => Required<import("../..").CartesianViewBox>) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: number, resultFuncArgs_1: number) => Required<import("../..").CartesianViewBox>;
    memoizedResultFunc: ((resultFuncArgs_0: number, resultFuncArgs_1: number) => Required<import("../..").CartesianViewBox>) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => Required<import("../..").CartesianViewBox>;
    dependencies: [(state: RechartsRootState) => number, (state: RechartsRootState) => number];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
