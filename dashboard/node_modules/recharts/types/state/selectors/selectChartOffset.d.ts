import { ChartOffsetInternal } from '../../util/types';
import { ChartOffset } from '../../types';
export declare const selectChartOffset: ((state: import("../store").RechartsRootState) => ChartOffset) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: ChartOffsetInternal) => ChartOffset;
    memoizedResultFunc: ((resultFuncArgs_0: ChartOffsetInternal) => ChartOffset) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => ChartOffset;
    dependencies: [(state: import("../store").RechartsRootState) => ChartOffsetInternal];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
