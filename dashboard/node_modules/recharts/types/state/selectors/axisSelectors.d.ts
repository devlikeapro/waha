import { AxisDomain, CartesianTickItem, CategoricalDomain, Coordinate, RechartsScaleType, DataKey, LayoutType, NumberDomain, Size, StackOffsetType, TickItem } from '../../util/types';
import { AxisId, BaseCartesianAxis, XAxisOrientation, XAxisSettings, YAxisOrientation, YAxisSettings, ZAxisSettings } from '../cartesianAxisSlice';
import { RechartsRootState } from '../store';
import { AppliedChartData, ChartData, ChartDataState } from '../chartDataSlice';
import { BaseCartesianGraphicalItemSettings, BasePolarGraphicalItemSettings, CartesianGraphicalItemSettings, GraphicalItemSettings } from '../graphicalItemsSlice';
import { ReferenceAreaSettings, ReferenceDotSettings, ReferenceElementSettings, ReferenceLineSettings } from '../referenceElementsSlice';
import { AxisPropsForCartesianGridTicksGeneration } from '../../cartesian/CartesianGrid';
import { AngleAxisSettings, RadiusAxisSettings } from '../polarAxisSlice';
import { AllStackGroups } from '../../util/stacks/stackTypes';
import { DisplayedStackedData } from './combiners/combineDisplayedStackedData';
import { DefinitelyStackedGraphicalItem } from '../types/StackedGraphicalItem';
import { ErrorBarsSettings, ErrorBarsState } from '../errorBarSlice';
import { AllAxisTypes, RenderableAxisType } from './selectTooltipAxisType';
import { RechartsScale } from '../../util/scale/RechartsScale';
import { InverseScaleFunction } from '../../hooks';
export declare const defaultNumericDomain: AxisDomain;
export type RenderableAxisSettings = XAxisSettings | YAxisSettings | AngleAxisSettings | RadiusAxisSettings;
export type AllAxisSettings = XAxisSettings | YAxisSettings | ZAxisSettings | AngleAxisSettings | RadiusAxisSettings;
/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
export declare const implicitXAxis: XAxisSettings;
export declare const selectXAxisSettingsNoDefaults: (state: RechartsRootState, axisId: AxisId) => XAxisSettings | undefined;
export declare const selectXAxisSettings: (state: RechartsRootState, axisId: AxisId) => XAxisSettings;
/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
export declare const implicitYAxis: YAxisSettings;
export declare const selectYAxisSettingsNoDefaults: (state: RechartsRootState, axisId: AxisId) => YAxisSettings | undefined;
export declare const selectYAxisSettings: (state: RechartsRootState, axisId: AxisId) => YAxisSettings;
export declare const implicitZAxis: ZAxisSettings;
export declare const selectZAxisSettings: (state: RechartsRootState, axisId: AxisId) => ZAxisSettings;
export declare const selectBaseAxis: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => AllAxisSettings;
/**
 * Selects either an X or Y axis. Doesn't work with Z axis - for that, instead use selectBaseAxis.
 * @param state Root state
 * @param axisType xAxis | yAxis
 * @param axisId xAxisId | yAxisId
 * @returns axis settings object
 */
export declare const selectRenderableAxisSettings: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId) => RenderableAxisSettings;
/**
 * @param state RechartsRootState
 * @return boolean true if there is at least one Bar or RadialBar
 */
export declare const selectHasBar: (state: RechartsRootState) => boolean;
/**
 * Filters CartesianGraphicalItemSettings by the relevant axis ID
 * @param axisType 'xAxis' | 'yAxis' | 'zAxis' | 'radiusAxis' | 'angleAxis'
 * @param axisId from props, defaults to 0
 *
 * @returns Predicate function that return true for CartesianGraphicalItemSettings that are relevant to the specified axis
 */
export declare function itemAxisPredicate(axisType: AllAxisTypes, axisId: AxisId): (item: BaseCartesianGraphicalItemSettings | BasePolarGraphicalItemSettings) => boolean;
export declare const selectUnfilteredCartesianItems: (state: RechartsRootState) => ReadonlyArray<CartesianGraphicalItemSettings>;
export declare const combineGraphicalItemsSettings: <T extends GraphicalItemSettings>(graphicalItems: ReadonlyArray<T>, axisSettings: BaseCartesianAxis, axisPredicate: (item: T) => boolean) => T[];
export declare const selectCartesianItemsSettings: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => ReadonlyArray<CartesianGraphicalItemSettings>;
export declare const selectStackedCartesianItemsSettings: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => ReadonlyArray<DefinitelyStackedGraphicalItem>;
export declare const filterGraphicalNotStackedItems: (cartesianItems: ReadonlyArray<GraphicalItemSettings>) => ReadonlyArray<GraphicalItemSettings>;
export declare const combineGraphicalItemsData: (cartesianItems: ReadonlyArray<GraphicalItemSettings>) => unknown[];
/**
 * Returns true if at least one graphical item does not define its own `data` prop
 * and therefore relies on the chart-level data.
 * This is used to decide whether to merge chart-level data into the axis domain calculation.
 */
export declare const selectAnyCartesianItemsUsesChartData: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => boolean;
/**
 * This is a "cheap" selector - it returns the data but doesn't iterate them, so it is not sensitive on the array length.
 * Also does not apply dataKey yet.
 * @param state RechartsRootState
 * @returns data defined on the chart graphical items, such as Line or Scatter or Pie, and filtered with appropriate dataKey
 */
export declare const selectCartesianGraphicalItemsData: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => ChartData;
export declare const combineDisplayedData: (graphicalItemsData: ChartData, { chartData, dataStartIndex, dataEndIndex }: ChartDataState) => ChartData;
/**
 * This selector will return all data there is in the chart: graphical items, chart root, all together.
 * Useful for figuring out an axis domain (because that needs to know of everything),
 * not useful for rendering individual graphical elements (because they need to know which data is theirs and which is not).
 *
 * This function will discard the original indexes, so it is also not useful for anything that depends on ordering.
 */
export declare const selectDisplayedData: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => ChartData;
export declare const combineAppliedValues: (data: ChartData, axisSettings: BaseCartesianAxis, items: ReadonlyArray<GraphicalItemSettings>) => AppliedChartData;
/**
 * Computes applied values from graphical items data plus, when needed, chart-level data.
 *
 * When at least one graphical item has no own `data` (it relies on chart root data) AND the axis has a `dataKey`,
 * AND there are other items that do have their own data (meaning `displayedData` only contains graphical items data,
 * not chart root data), we also include chart root data values so the axis domain covers all categories,
 * including those only present in the chart root data but not in any graphical item's own data.
 *
 * Values from chart root data that don't match the axis dataKey (undefined) are excluded.
 */
export declare const combineAllAppliedValues: (displayedData: ChartData, axisSettings: BaseCartesianAxis, items: ReadonlyArray<GraphicalItemSettings>, { chartData, dataStartIndex, dataEndIndex }: ChartDataState, anyItemUsesChartData: boolean, graphicalItemsData: ChartData) => AppliedChartData;
/**
 * This selector will return all values with the appropriate dataKey applied on them.
 * Which dataKey is appropriate depends on where it is defined.
 *
 * This is an expensive selector - it will iterate all data and compute their value using the provided dataKey.
 */
export declare const selectAllAppliedValues: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => AppliedChartData;
export declare const selectSortedDataPoints: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => ReadonlyArray<unknown> | undefined;
export declare function isErrorBarRelevantForAxisType(axisType: AllAxisTypes, errorBar: ErrorBarsSettings): boolean;
export type AppliedChartDataWithErrorDomain = {
    /**
     * This is the value after the dataKey has been applied. Presumably a number? But no guarantees.
     */
    value: unknown;
    /**
     * This is the error domain, if any, for the current value.
     * This may be either x or y direction, whatever is applicable.
     * Assumption is that we're looking at this data from the point of view of a single axis,
     * and that axis dictates the relevant direction.
     */
    errorDomain: ReadonlyArray<number> | undefined;
};
/**
 * @param entry One item in the 'data' array. Could be anything really - this is defined externally. This is the raw, before dataKey application
 * @param appliedValue This is the result of applying the 'main' dataKey on the `entry`.
 * @param relevantErrorBars Error bars that are relevant for the current axis and layout and all that.
 * @return either undefined or an array of ErrorValue
 */
export declare function getErrorDomainByDataKey(entry: unknown, appliedValue: unknown, relevantErrorBars: ReadonlyArray<ErrorBarsSettings> | undefined): ReadonlyArray<number>;
export declare const selectTooltipAxis: (state: RechartsRootState) => RenderableAxisSettings;
export declare const selectTooltipAxisDataKey: (state: RechartsRootState) => DataKey<any> | undefined;
export declare const selectDisplayedStackedData: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => DisplayedStackedData;
export declare const combineStackGroups: (displayedData: DisplayedStackedData, items: ReadonlyArray<DefinitelyStackedGraphicalItem>, stackOffsetType: StackOffsetType, reverseStackOrder: boolean) => AllStackGroups;
/**
 * Stack groups are groups of graphical items that stack on each other.
 * Stack is a function of axis type (X, Y), axis ID, and stack ID.
 * Graphical items that do not have a stack ID are not going to be present in stack groups.
 */
export declare const selectStackGroups: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => AllStackGroups | undefined;
export declare const combineDomainOfStackGroups: (stackGroups: AllStackGroups | undefined, { dataStartIndex, dataEndIndex }: ChartDataState, axisType: AllAxisTypes, domainFromUserPreference: NumberDomain | undefined) => NumberDomain | undefined;
export declare const getDomainDefinition: (axisSettings: AllAxisSettings) => AxisDomain;
export declare const selectDomainDefinition: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => AxisDomain;
/**
 * Under certain circumstances, we can determine the domain without looking at the data at all.
 * This is the case when the domain is explicitly specified as numbers, or when it is specified
 * as 'auto' or 'dataMin'/'dataMax' and data overflow is not allowed.
 *
 * In that case, this function will return the domain, otherwise it returns undefined.
 *
 * This is an optimization to avoid unnecessary data processing.
 * @param state
 * @param axisType
 * @param axisId
 * @param isPanorama
 */
export declare const selectDomainFromUserPreference: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => NumberDomain | undefined;
export declare const selectDomainOfStackGroups: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => NumberDomain | undefined;
export declare const selectAllErrorBarSettings: (state: RechartsRootState) => ErrorBarsState;
export declare const mergeDomains: (...domains: ReadonlyArray<ReadonlyArray<number> | undefined>) => NumberDomain | undefined;
export declare const combineDomainOfAllAppliedNumericalValuesIncludingErrorValues: (displayedData: ChartData, axisSettings: BaseCartesianAxis, items: ReadonlyArray<GraphicalItemSettings>, errorBars: ErrorBarsState, axisType: AllAxisTypes, chartDataSlice?: ChartData) => NumberDomain | undefined;
export declare const selectReferenceDots: (state: RechartsRootState) => ReadonlyArray<ReferenceDotSettings>;
export declare const filterReferenceElements: <T extends ReferenceElementSettings>(elements: ReadonlyArray<T>, axisType: AllAxisTypes, axisId: AxisId) => ReadonlyArray<T>;
export declare const selectReferenceDotsByAxis: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => ReadonlyArray<ReferenceDotSettings>;
export declare const selectReferenceAreas: (state: RechartsRootState) => ReadonlyArray<ReferenceAreaSettings>;
export declare const selectReferenceAreasByAxis: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => ReadonlyArray<ReferenceAreaSettings>;
export declare const selectReferenceLines: (state: RechartsRootState) => ReadonlyArray<ReferenceLineSettings>;
export declare const selectReferenceLinesByAxis: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => ReadonlyArray<ReferenceLineSettings>;
export declare const combineDotsDomain: (dots: ReadonlyArray<ReferenceDotSettings> | undefined, axisType: RenderableAxisType) => NumberDomain | undefined;
export declare const combineAreasDomain: (areas: ReadonlyArray<ReferenceAreaSettings> | undefined, axisType: RenderableAxisType) => NumberDomain | undefined;
export declare const combineLinesDomain: (lines: ReadonlyArray<ReferenceLineSettings> | undefined, axisType: RenderableAxisType) => NumberDomain | undefined;
export declare const combineNumericalDomain: (axisSettings: BaseCartesianAxis, domainDefinition: AxisDomain | undefined, domainFromUserPreference: NumberDomain | undefined, domainOfStackGroups: NumberDomain | undefined, dataAndErrorBarsDomain: NumberDomain | undefined, referenceElementsDomain: NumberDomain | undefined, layout: LayoutType, axisType: AllAxisTypes, numericTicksDomain?: NumberDomain | undefined) => NumberDomain | undefined;
/**
 * https://github.com/recharts/recharts/issues/7362
 * Derives the [min, max] extent of an axis's explicit numeric `ticks`. Used by
 * {@link combineNumericalDomain} as a last-resort domain when a non-literal domain
 * cannot be resolved without data. Returns undefined for non-number axes, or when
 * no numeric ticks were supplied.
 */
export declare const combineNumericTicksDomain: (axisSettings: AllAxisSettings) => NumberDomain | undefined;
export declare const selectNumericTicksDomain: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => NumberDomain | undefined;
export declare const selectNumericalDomain: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => NumberDomain | undefined;
export declare const combineAxisDomain: (axisSettings: BaseCartesianAxis, layout: LayoutType, displayedData: ChartData | undefined, allAppliedValues: AppliedChartData, stackOffsetType: StackOffsetType, axisType: AllAxisTypes, numericalDomain: NumberDomain | undefined) => NumberDomain | CategoricalDomain | undefined;
export declare const selectAxisDomain: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => NumberDomain | CategoricalDomain | undefined;
export declare const selectRealScaleType: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => RechartsScaleType | undefined;
export declare const combineNiceTicks: (axisDomain: NumberDomain | CategoricalDomain | undefined, axisSettings: RenderableAxisSettings, realScaleType: string | undefined) => ReadonlyArray<number> | undefined;
export declare const selectNiceTicks: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => ReadonlyArray<number> | undefined;
export declare const combineAxisDomainWithNiceTicks: (axisSettings: BaseCartesianAxis, domain: NumberDomain | CategoricalDomain | undefined, niceTicks: ReadonlyArray<number> | undefined, axisType: RenderableAxisType) => NumberDomain | CategoricalDomain | undefined;
export declare const selectAxisDomainIncludingNiceTicks: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => NumberDomain | CategoricalDomain | undefined;
/**
 * Returns the smallest gap, between two numbers in the data, as a ratio of the whole range (max - min).
 * Ignores domain provided by user and only considers domain from data.
 *
 * The result is a number between 0 and 1.
 */
export declare const selectSmallestDistanceBetweenValues: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => number | undefined;
export declare const selectCalculatedXAxisPadding: (state: RechartsRootState, axisId: AxisId, isPanorama: boolean) => number;
export declare const selectCalculatedYAxisPadding: (state: RechartsRootState, axisId: AxisId, isPanorama: boolean) => number;
export declare const selectXAxisRange: (state: RechartsRootState, axisId: AxisId, isPanorama: boolean) => AxisRange | undefined;
export type AxisRange = readonly [number, number];
export declare const selectYAxisRange: (state: RechartsRootState, axisId: AxisId, isPanorama: boolean) => AxisRange | undefined;
export declare const selectAxisRange: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => AxisRange | undefined;
export declare const selectAxisRangeWithReverse: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => AxisRange | undefined;
export declare const selectCheckedAxisDomain: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => NumberDomain | CategoricalDomain | undefined;
export declare const combineCategoricalDomain: (layout: LayoutType, appliedValues: AppliedChartData, axis: RenderableAxisSettings, axisType: RenderableAxisType) => ReadonlyArray<unknown> | undefined;
export declare const selectCategoricalDomain: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => ReadonlyArray<unknown> | undefined;
export declare const selectAxisScale: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => RechartsScale | undefined;
export declare const selectAxisInverseScale: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => InverseScaleFunction | undefined;
export declare const selectAxisInverseDataSnapScale: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => InverseScaleFunction | undefined;
export declare const selectErrorBarsSettings: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId) => ReadonlyArray<ErrorBarsSettings>;
export declare const selectXAxisSize: (state: RechartsRootState, xAxisId: AxisId) => Size;
type AxisOffsetSteps = Record<AxisId, number>;
export declare const selectAllXAxesOffsetSteps: (state: RechartsRootState, orientation: XAxisOrientation, mirror: boolean) => AxisOffsetSteps;
export declare const selectAllYAxesOffsetSteps: (state: RechartsRootState, orientation: YAxisOrientation, mirror: boolean) => AxisOffsetSteps;
export declare const selectXAxisPosition: (state: RechartsRootState, axisId: AxisId) => Coordinate | undefined;
export declare const selectYAxisPosition: (state: RechartsRootState, axisId: AxisId) => Coordinate | undefined;
export declare const selectYAxisSize: (state: RechartsRootState, yAxisId: AxisId) => Size;
export declare const selectCartesianAxisSize: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId) => number | undefined;
export declare const combineDuplicateDomain: (chartLayout: LayoutType, appliedValues: AppliedChartData, axis: BaseCartesianAxis, axisType: AllAxisTypes) => ReadonlyArray<unknown> | undefined;
export declare const selectDuplicateDomain: (state: RechartsRootState, axisType: AllAxisTypes, axisId: AxisId, isPanorama: boolean) => ReadonlyArray<unknown> | undefined;
export declare const selectAxisPropsNeededForCartesianGridTicksGenerator: (state: RechartsRootState, axisType: 'xAxis' | 'yAxis', axisId: AxisId, isPanorama: boolean) => AxisPropsForCartesianGridTicksGeneration | undefined;
/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
export declare const combineAxisTicks: (layout: LayoutType, axis: RenderableAxisSettings, realScaleType: RechartsScaleType | undefined, scale: RechartsScale | undefined, niceTicks: ReadonlyArray<number> | undefined, axisRange: AxisRange | undefined, duplicateDomain: ReadonlyArray<unknown> | undefined, categoricalDomain: ReadonlyArray<unknown> | undefined, axisType: RenderableAxisType) => ReadonlyArray<TickItem> | undefined;
export declare const selectTicksOfAxis: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => ReadonlyArray<CartesianTickItem> | undefined;
/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
export declare const combineGraphicalItemTicks: (layout: LayoutType, axis: RenderableAxisSettings, scale: RechartsScale | undefined, axisRange: AxisRange | undefined, duplicateDomain: ReadonlyArray<unknown> | undefined, categoricalDomain: ReadonlyArray<unknown> | undefined, axisType: RenderableAxisType) => TickItem[] | undefined;
export declare const selectTicksOfGraphicalItem: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => TickItem[] | undefined;
/**
 * This is the internal representation of an axis along with its scale function.
 * Here we have already computed the scale function for the axis,
 * and replaced the union type of scale (string | function) with just the function type.
 */
export type BaseAxisWithScale = Omit<BaseCartesianAxis, 'scale'> & {
    scale: RechartsScale;
};
export declare const selectAxisWithScale: (state: RechartsRootState, axisType: RenderableAxisType, axisId: AxisId, isPanorama: boolean) => BaseAxisWithScale | undefined;
export type ZAxisWithScale = Omit<ZAxisSettings, 'scale'> & {
    scale: RechartsScale;
};
export declare const selectZAxisWithScale: (state: RechartsRootState, _axisType: 'zAxis', axisId: AxisId, isPanorama: false) => ZAxisWithScale | undefined;
/**
 * We are also going to need to implement polar chart directions if we want to support keyboard controls for those.
 */
export type AxisDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
export declare const selectChartDirection: (state: RechartsRootState) => AxisDirection | undefined;
export declare const selectRenderedTicksOfAxis: (state: RechartsRootState, axisType: 'xAxis' | 'yAxis', axisId: AxisId) => ReadonlyArray<TickItem> | undefined;
export declare const selectAxisInverseTickSnapScale: (state: RechartsRootState, axisType: 'xAxis' | 'yAxis', axisId: AxisId) => InverseScaleFunction | undefined;
export {};
