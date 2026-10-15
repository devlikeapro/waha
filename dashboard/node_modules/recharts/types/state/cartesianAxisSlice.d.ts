import { AxisDomain, AxisInterval, AxisTick, DataKey, EvaluatedAxisDomainType, ScaleType, TickProp } from '../util/types';
import { TickFormatter } from '../cartesian/CartesianAxis';
import type { AxisRange } from './selectors/axisSelectors';
import { CustomScaleDefinition } from '../util/scale/CustomScaleDefinition';
/**
 * @inline
 */
export type AxisId = string | number;
export declare const defaultAxisId: AxisId;
export type XAxisPadding = {
    left?: number;
    right?: number;
} | 'gap' | 'no-gap';
export type YAxisPadding = {
    top?: number;
    bottom?: number;
} | 'gap' | 'no-gap';
export type XAxisOrientation = 'top' | 'bottom';
export type YAxisOrientation = 'left' | 'right';
/**
 * Properties shared in X, Y, and Z axes.
 * User defined axis settings, coming from props.
 */
export type BaseCartesianAxis = {
    id: AxisId;
    scale: ScaleType | CustomScaleDefinition | CustomScaleDefinition<string> | CustomScaleDefinition<number> | CustomScaleDefinition<Date>;
    /**
     * Before creating this object, evaluate the domain type based on the chart layout so that we have the 'auto' resolved.
     */
    type: EvaluatedAxisDomainType;
    /**
     * The axis functionality is severely restricted without a dataKey
     * - but there is still something left, and the prop is optional
     * so this can also be undefined even in real charts.
     * There are no defaults.
     */
    dataKey: DataKey<any> | undefined;
    unit: string | undefined;
    name: string | undefined;
    allowDuplicatedCategory: boolean;
    allowDataOverflow: boolean;
    reversed: boolean;
    includeHidden: boolean;
    domain: AxisDomain | undefined;
};
/**
 * Controls how Recharts calculates "nice" tick values for numerical axes.
 *
 * - `'none'`: Recharts does not apply any tick-rounding algorithm; tick positions are
 *   determined entirely by d3, evenly spaced but not rounded to human-friendly numbers.
 *   There is no domain-extension logic applied in this mode.
 *
 * - `'auto'` *(default)*: Recharts automatically decides whether and how to apply tick
 *   niceties based on the domain definition. When the domain contains an `'auto'` keyword,
 *   Recharts uses the `'adaptive'` algorithm and may extend the domain slightly to
 *   produce clean tick labels. Otherwise, it applies the same algorithm while keeping
 *   ticks within the fixed domain. This mirrors the default behavior from Recharts v2.
 *
 * - `'adaptive'`: Always applies the space-efficient algorithm (`getAdaptiveStep`),
 *   which fills the available range as densely as possible while still rounding steps
 *   to reasonable numbers (e.g. 10, 20, 25). May produce less "round-looking" labels
 *   than `'snap125'`, but wastes less space. The domain-extension logic still applies
 *   when the domain contains an `'auto'` keyword.
 *
 * - `'snap125'`: Always applies the round-numbers algorithm (`getSnap125Step`), which
 *   snaps step sizes to values from the set {1, 2, 2.5, 5} × 10ⁿ. Produces very
 *   human-friendly labels (e.g. 0, 5, 10, 15, 20) but may leave blank space at the
 *   edges of the chart. The domain-extension logic still applies when the domain
 *   contains an `'auto'` keyword.
 *
 * @see {@link https://recharts.github.io/guide/axisTicks/}
 * @inline
 */
export type NiceTicksAlgorithm = 'none' | 'auto' | 'adaptive' | 'snap125';
export type TicksSettings = {
    allowDecimals: boolean;
    /**
     * We pass the suggested number of ticks to d3 https://d3js.org/d3-scale/linear#linear_ticks
     * This number is a suggestion. d3 tries to accommodate it, but it might return more or less ticks than requested:
     * > The specified count is only a hint; the scale may return more or fewer values depending on the domain.
     *
     * If undefined, then d3 decides the number of ticks on its own. The default in d3 is 10,
     * but it can vary based on the domain size and other factors.
     */
    tickCount: number | undefined;
    /**
     * Ticks can be any type when the axis is the type of category
     * Ticks must be numbers when the axis is the type of number
     */
    ticks: ReadonlyArray<AxisTick> | undefined;
    tick: TickProp<any>;
    /**
     * Controls how Recharts calculates "nice" tick values for this axis.
     * See {@link NiceTicksAlgorithm} for a full description of each option.
     *
     * @defaultValue 'auto'
     */
    niceTicks: NiceTicksAlgorithm;
};
/**
 * These are the external props, visible for users as they set them using our public API.
 * There is all sorts of internal computed things based on these, but they will come through selectors.
 *
 * Properties shared between X and Y axes
 */
export type CartesianAxisSettings = BaseCartesianAxis & TicksSettings & {
    interval: AxisInterval;
    mirror: boolean;
    minTickGap: number;
    angle: number;
    hide: boolean;
    tickFormatter: TickFormatter | undefined;
};
export type XAxisHeight = number | 'auto';
export type XAxisSettings = CartesianAxisSettings & {
    padding: XAxisPadding;
    height: XAxisHeight;
    orientation: XAxisOrientation;
    heightHistory?: number[];
};
export type YAxisWidth = number | 'auto';
export type YAxisSettings = CartesianAxisSettings & {
    padding: YAxisPadding;
    width: YAxisWidth;
    orientation: YAxisOrientation;
    widthHistory?: number[];
};
/**
 * Z axis is special because it's never displayed. It controls the size of Scatter dots,
 * but it never displays ticks anywhere.
 */
export type ZAxisSettings = BaseCartesianAxis & {
    range: AxisRange;
};
type AxisMapState = {
    xAxis: Record<AxisId, XAxisSettings>;
    yAxis: Record<AxisId, YAxisSettings>;
    zAxis: Record<AxisId, ZAxisSettings>;
};
export declare const addXAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: XAxisSettings], XAxisSettings, "cartesianAxis/addXAxis", never, unknown>, replaceXAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: {
    prev: XAxisSettings;
    next: XAxisSettings;
}], {
    prev: XAxisSettings;
    next: XAxisSettings;
}, "cartesianAxis/replaceXAxis", never, unknown>, removeXAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: XAxisSettings], XAxisSettings, "cartesianAxis/removeXAxis", never, unknown>, addYAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: YAxisSettings], YAxisSettings, "cartesianAxis/addYAxis", never, unknown>, replaceYAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: {
    prev: YAxisSettings;
    next: YAxisSettings;
}], {
    prev: YAxisSettings;
    next: YAxisSettings;
}, "cartesianAxis/replaceYAxis", never, unknown>, removeYAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: YAxisSettings], YAxisSettings, "cartesianAxis/removeYAxis", never, unknown>, addZAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: ZAxisSettings], ZAxisSettings, "cartesianAxis/addZAxis", never, unknown>, replaceZAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: {
    prev: ZAxisSettings;
    next: ZAxisSettings;
}], {
    prev: ZAxisSettings;
    next: ZAxisSettings;
}, "cartesianAxis/replaceZAxis", never, unknown>, removeZAxis: import("@reduxjs/toolkit").ActionCreatorWithPreparedPayload<[payload: ZAxisSettings], ZAxisSettings, "cartesianAxis/removeZAxis", never, unknown>, updateYAxisWidth: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: AxisId;
    width: number;
}, "cartesianAxis/updateYAxisWidth">, updateXAxisHeight: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: AxisId;
    height: number;
}, "cartesianAxis/updateXAxisHeight">;
export declare const cartesianAxisReducer: import("redux").Reducer<AxisMapState>;
export {};
