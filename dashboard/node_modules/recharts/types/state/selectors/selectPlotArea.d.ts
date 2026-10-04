export declare const selectPlotArea: ((state: import("../store").RechartsRootState) => {
    x: number;
    y: number;
    width: number;
    height: number;
} | undefined) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("../..").ChartOffset, resultFuncArgs_1: number, resultFuncArgs_2: number) => {
        x: number;
        y: number;
        width: number;
        height: number;
    } | undefined;
    memoizedResultFunc: ((resultFuncArgs_0: import("../..").ChartOffset, resultFuncArgs_1: number, resultFuncArgs_2: number) => {
        x: number;
        y: number;
        width: number;
        height: number;
    } | undefined) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => {
        x: number;
        y: number;
        width: number;
        height: number;
    } | undefined;
    dependencies: [((state: import("../store").RechartsRootState) => import("../..").ChartOffset) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    } & {
        resultFunc: (resultFuncArgs_0: import("../../util/types").ChartOffsetInternal) => import("../..").ChartOffset;
        memoizedResultFunc: ((resultFuncArgs_0: import("../../util/types").ChartOffsetInternal) => import("../..").ChartOffset) & {
            clearCache: () => void;
            resultsCount: () => number;
            resetResultsCount: () => void;
        };
        lastResult: () => import("../..").ChartOffset;
        dependencies: [(state: import("../store").RechartsRootState) => import("../../util/types").ChartOffsetInternal];
        recomputations: () => number;
        resetRecomputations: () => void;
        dependencyRecomputations: () => number;
        resetDependencyRecomputations: () => void;
    } & {
        argsMemoize: typeof import("reselect").weakMapMemoize;
        memoize: typeof import("reselect").weakMapMemoize;
    }, (state: import("../store").RechartsRootState) => number, (state: import("../store").RechartsRootState) => number];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
