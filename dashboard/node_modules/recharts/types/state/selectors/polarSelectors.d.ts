import { AppliedChartData, ChartData } from '../chartDataSlice';
import { RechartsRootState } from '../store';
import { AxisId } from '../cartesianAxisSlice';
import { AppliedChartDataWithErrorDomain } from './axisSelectors';
import { PolarGraphicalItemSettings } from '../graphicalItemsSlice';
import { CategoricalDomain, NumberDomain } from '../../util/types';
export type PolarAxisType = 'angleAxis' | 'radiusAxis';
export declare const selectUnfilteredPolarItems: (state: RechartsRootState) => readonly PolarGraphicalItemSettings[];
export declare const selectPolarItemsSettings: (state: RechartsRootState, axisType: PolarAxisType, polarAxisId: AxisId) => ReadonlyArray<PolarGraphicalItemSettings>;
export declare const selectPolarDisplayedData: (state: RechartsRootState, axisType: PolarAxisType, polarAxisId: AxisId) => ChartData;
export declare const selectPolarAppliedValues: (state: RechartsRootState, axisType: PolarAxisType, axisId: AxisId) => AppliedChartData;
export declare const selectAllPolarAppliedNumericalValues: (state: RechartsRootState, axisType: PolarAxisType, axisId: AxisId) => ReadonlyArray<AppliedChartDataWithErrorDomain>;
export declare const selectPolarAxisDomain: (state: RechartsRootState, axisType: PolarAxisType, polarAxisId: AxisId) => NumberDomain | CategoricalDomain | undefined;
export declare const selectPolarNiceTicks: ((state: RechartsRootState, axisType: "radiusAxis" | "angleAxis", polarAxisId: AxisId) => readonly number[] | undefined) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: NumberDomain | CategoricalDomain | undefined, resultFuncArgs_1: import("./axisSelectors").RenderableAxisSettings, resultFuncArgs_2: import("../../util/types").RechartsScaleType | undefined) => readonly number[] | undefined;
    memoizedResultFunc: ((resultFuncArgs_0: NumberDomain | CategoricalDomain | undefined, resultFuncArgs_1: import("./axisSelectors").RenderableAxisSettings, resultFuncArgs_2: import("../../util/types").RechartsScaleType | undefined) => readonly number[] | undefined) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => readonly number[] | undefined;
    dependencies: [(state: RechartsRootState, axisType: PolarAxisType, polarAxisId: AxisId) => NumberDomain | CategoricalDomain | undefined, (state: RechartsRootState, axisType: import("./selectTooltipAxisType").RenderableAxisType, axisId: AxisId) => import("./axisSelectors").RenderableAxisSettings, (state: RechartsRootState, axisType: import("./selectTooltipAxisType").AllAxisTypes, axisId: AxisId) => import("../../util/types").RechartsScaleType | undefined];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import("reselect").weakMapMemoize;
    memoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectPolarAxisDomainIncludingNiceTicks: (state: RechartsRootState, axisType: PolarAxisType, polarAxisId: AxisId) => NumberDomain | CategoricalDomain | undefined;
export declare const selectPolarAxisCheckedDomain: (state: RechartsRootState, axisType: PolarAxisType, polarAxisId: AxisId) => NumberDomain | CategoricalDomain | undefined;
