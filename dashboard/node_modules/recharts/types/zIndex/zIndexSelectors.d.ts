import { RechartsRootState } from '../state/store';
/**
 * Given a zIndex, returns the corresponding portal element reference.
 * If no zIndex is provided or if the zIndex is not registered, returns undefined.
 *
 * It also returns undefined in case the z-index portal has not been rendered yet.
 */
export declare const selectZIndexPortalElement: (state: RechartsRootState, zIndex: number | undefined, isPanorama: boolean) => Element | undefined;
export declare const selectAllRegisteredZIndexes: ((state: RechartsRootState) => number[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: Record<number, {
        element: Element | undefined;
        panoramaElement: Element | undefined;
        consumers: number;
    }>) => number[];
    memoizedResultFunc: ((resultFuncArgs_0: Record<number, {
        element: Element | undefined;
        panoramaElement: Element | undefined;
        consumers: number;
    }>) => number[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => number[];
    dependencies: [(state: RechartsRootState) => Record<number, {
        element: Element | undefined;
        panoramaElement: Element | undefined;
        consumers: number;
    }>];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
