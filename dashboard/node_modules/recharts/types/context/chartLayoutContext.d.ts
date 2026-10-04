import { CartesianLayout, CartesianViewBoxRequired, ChartOffsetInternal, LayoutType, Margin, Percent, PolarLayout } from '../util/types';
import { RechartsRootState } from '../state/store';
export declare const useViewBox: () => CartesianViewBoxRequired | undefined;
/**
 * For internal use only. If you want this information, `import { useOffset } from 'recharts'` instead.
 *
 * Returns the offset of the chart in pixels.
 *
 * @returns {ChartOffsetInternal} The offset of the chart in pixels, or a default value if not in a chart context.
 */
export declare const useOffsetInternal: () => ChartOffsetInternal;
/**
 * Returns the width of the chart in pixels.
 *
 * If you are using chart with hardcoded `width` prop, then the width returned will be the same
 * as the `width` prop on the main chart element.
 *
 * If you are using a chart with a `ResponsiveContainer`, the width will be the size of the chart
 * as the ResponsiveContainer has decided it would be.
 *
 * If the chart has any axes or legend, the `width` will be the size of the chart
 * including the axes and legend. Meaning: adding axes and legend will not change the width.
 *
 * The dimensions do not scale, meaning as user zoom in and out, the width number will not change
 * as the chart gets visually larger or smaller.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {number | undefined} The width of the chart in pixels, or `undefined` if not in a chart context.
 */
export declare const useChartWidth: () => number | undefined;
/**
 * Returns the height of the chart in pixels.
 *
 * If you are using chart with hardcoded `height` props, then the height returned will be the same
 * as the `height` prop on the main chart element.
 *
 * If you are using a chart with a `ResponsiveContainer`, the height will be the size of the chart
 * as the ResponsiveContainer has decided it would be.
 *
 * If the chart has any axes or legend, the `height` will be the size of the chart
 * including the axes and legend. Meaning: adding axes and legend will not change the height.
 *
 * The dimensions do not scale, meaning as user zoom in and out, the height number will not change
 * as the chart gets visually larger or smaller.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {number | undefined} The height of the chart in pixels, or `undefined` if not in a chart context.
 */
export declare const useChartHeight: () => number | undefined;
/**
 * Margin is the empty space around the chart. Excludes axes and legend and brushes and the like.
 * This is declared by the user in the chart props.
 * If you are interested in the space occupied by axes, legend, or brushes,
 * use {@link useOffset} instead, which also includes calculated widths and heights of axes and legends.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {Margin | undefined} The margin of the chart in pixels, or `undefined` if not in a chart context.
 */
export declare const useMargin: () => Margin | undefined;
export declare const selectChartLayout: (state: RechartsRootState) => LayoutType;
/**
 * Returns the chart layout as configured by the chart.
 *
 * Cartesian charts use `horizontal` or `vertical`.
 * Polar charts use `centric` or `radial`.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @deprecated this hook mixes cartesian and polar layouts together; prefer to use {@link useCartesianChartLayout} and {@link usePolarChartLayout} instead, which give you better type safety.
 *
 * @returns {LayoutType | undefined} The chart layout, or `undefined` if not in a chart context.
 *
 * @since 3.9
 */
export declare const useChartLayout: () => LayoutType | undefined;
/**
 * Returns the chart layout only for Cartesian charts.
 *
 * Returns `horizontal` or `vertical` for Cartesian charts.
 * Returns `undefined` for non-Cartesian charts or outside chart context.
 *
 * @since 3.9
 *
 * @returns {CartesianLayout | undefined} The Cartesian chart layout, or `undefined`.
 */
export declare const useCartesianChartLayout: () => CartesianLayout | undefined;
export declare const selectPolarChartLayout: (state: RechartsRootState) => PolarLayout | undefined;
/**
 * Returns the chart layout only for Polar charts.
 *
 * Returns `centric` or `radial` for Polar charts.
 * Returns `undefined` for non-Polar charts or outside chart context.
 *
 * @returns {PolarLayout | undefined} The Polar chart layout, or `undefined`.
 *
 * @since 3.9
 */
export declare const usePolarChartLayout: () => PolarLayout | undefined;
/**
 * Returns true if the component is rendered inside a chart context.
 * Some components may be used both inside and outside of charts,
 * and this hook allows them to determine if they are in a chart context or not.
 *
 * Other selectors may return undefined when used outside a chart context,
 * or undefined when inside a chart, but without relevant data.
 * This hook provides a more explicit way to check for chart context.
 *
 * @returns {boolean} True if in chart context, false otherwise.
 */
export declare const useIsInChartContext: () => boolean;
export declare const ReportChartSize: (props: {
    width: number | Percent | undefined;
    height: number | Percent | undefined;
}) => null;
export declare const ReportChartMargin: ({ margin }: {
    margin: Partial<Margin>;
}) => null;
