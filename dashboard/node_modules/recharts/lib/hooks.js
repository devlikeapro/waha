"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useYAxisTicks = exports.useYAxisScale = exports.useYAxisInverseTickSnapScale = exports.useYAxisInverseScale = exports.useYAxisInverseDataSnapScale = exports.useYAxisDomain = exports.useYAxis = exports.useXAxisTicks = exports.useXAxisScale = exports.useXAxisInverseTickSnapScale = exports.useXAxisInverseScale = exports.useXAxisInverseDataSnapScale = exports.useXAxisDomain = exports.useXAxis = exports.usePlotArea = exports.useOffset = exports.useIsTooltipActive = exports.useCartesianScale = exports.useActiveTooltipLabel = exports.useActiveTooltipDataPoints = exports.useActiveTooltipCoordinate = void 0;
var _cartesianAxisSlice = require("./state/cartesianAxisSlice");
var _axisSelectors = require("./state/selectors/axisSelectors");
var _hooks = require("./state/hooks");
var _PanoramaContext = require("./context/PanoramaContext");
var _tooltipSelectors = require("./state/selectors/tooltipSelectors");
var _selectChartOffset = require("./state/selectors/selectChartOffset");
var _selectPlotArea = require("./state/selectors/selectPlotArea");
var useXAxis = xAxisId => {
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama));
};
exports.useXAxis = useXAxis;
var useYAxis = yAxisId => {
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama));
};

/**
 * A function that converts data values to pixel coordinates.
 * @param value - The data value to convert (number, string, or category).
 * @param options - Optional configuration for banded scales.
 * @param options.position - Position within a band: 'start', 'middle', or 'end'.
 * @returns The pixel coordinate, or `undefined` if the value is not in the domain.
 */

/**
 * A function that converts pixel coordinates back to data values.
 * @param pixelValue - The pixel coordinate to convert.
 * @returns The closest data value in the domain.
 */
exports.useYAxis = useYAxis;
/**
 * Returns a function to convert data values to pixel coordinates for an {@link XAxis}.
 *
 * This is useful for positioning annotations, custom shapes, or other elements
 * at specific data points on the chart.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @example
 * ```tsx
 * const xScale = useXAxisScale();
 * if (xScale) {
 *   const pixelX = xScale('Page A'); // Returns the pixel x-coordinate for 'Page A'
 * }
 * ```
 *
 * @param xAxisId The `xAxisId` of the XAxis. Defaults to `0` if not provided.
 * @returns A scale function that maps data values to pixel coordinates, or `undefined`.
 * @since 3.8
 */
var useXAxisScale = exports.useXAxisScale = function useXAxisScale() {
  var xAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var scale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'xAxis', xAxisId, isPanorama));
  return scale === null || scale === void 0 ? void 0 : scale.map;
};

/**
 * Returns a function to convert data values to pixel coordinates for a {@link YAxis}.
 *
 * This is useful for positioning annotations, custom shapes, or other elements
 * at specific data points on the chart.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @example
 * ```tsx
 * const yScale = useYAxisScale();
 * if (yScale) {
 *   const pixelY = yScale(1500); // Returns the pixel y-coordinate for value 1500
 * }
 * ```
 *
 * @param yAxisId The `yAxisId` of the YAxis. Defaults to `0` if not provided.
 * @returns A scale function that maps data values to pixel coordinates, or `undefined`.
 * @since 3.8
 */
var useYAxisScale = exports.useYAxisScale = function useYAxisScale() {
  var yAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var scale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'yAxis', yAxisId, isPanorama));
  return scale === null || scale === void 0 ? void 0 : scale.map;
};

/**
 * Returns a function to convert pixel coordinates back to data values for an {@link XAxis}.
 *
 * This is useful for implementing interactions like click-to-add-annotation,
 * drag interactions, or tooltips that need to determine what data point
 * corresponds to a mouse position.
 *
 * For continuous (numerical) scales, returns an interpolated value.
 * For categorical scales, returns the closest category in the domain - which is the same behaviour as {@link useXAxisInverseDataSnapScale}.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @example
 * ```tsx
 * const xInverseScale = useXAxisInverseScale();
 * if (xInverseScale) {
 *   const dataValue = xInverseScale(150); // Returns the data value at pixel x=150
 * }
 * ```
 *
 * @param xAxisId The `xAxisId` of the XAxis. Defaults to `0` if not provided.
 * @returns An inverse scale function that maps pixel coordinates to data values, or `undefined`.
 * @since 3.8
 */
var useXAxisInverseScale = exports.useXAxisInverseScale = function useXAxisInverseScale() {
  var xAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisInverseScale)(state, 'xAxis', xAxisId, isPanorama));
};

/**
 * Returns a function to convert pixel coordinates back to data values for an {@link XAxis},
 * but snapping to the closest data point.
 *
 * This is similar to {@link useXAxisInverseScale}, but instead of returning the exact data value
 * at the pixel position (interpolation), it returns the value of the closest data point.
 *
 * This is useful for implementing interactions where you want to select the closest data point
 * rather than an exact value or a tick.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @param xAxisId The `xAxisId` of the XAxis. Defaults to `0` if not provided.
 * @returns An inverse scale function that maps pixel coordinates to the closest data value, or `undefined`.
 * @since 3.8
 */
var useXAxisInverseDataSnapScale = exports.useXAxisInverseDataSnapScale = function useXAxisInverseDataSnapScale() {
  var xAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisInverseDataSnapScale)(state, 'xAxis', xAxisId, isPanorama));
};

/**
 * Returns a function to convert pixel coordinates back to data values for an {@link XAxis},
 * but snapping to the closest axis tick.
 *
 * This is similar to {@link useXAxisInverseScale}, but instead of returning the exact data value
 * at the pixel position (interpolation), it returns the value of the closest tick.
 *
 * This is useful for implementing interactions where you want to select the closest tick
 * rather than an exact value or a data point.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @param xAxisId The `xAxisId` of the XAxis. Defaults to `0` if not provided.
 * @returns An inverse scale function that maps pixel coordinates to the closest tick value, or `undefined`.
 * @since 3.8
 */
var useXAxisInverseTickSnapScale = exports.useXAxisInverseTickSnapScale = function useXAxisInverseTickSnapScale() {
  var xAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisInverseTickSnapScale)(state, 'xAxis', xAxisId));
};

/**
 * Returns a function to convert pixel coordinates back to data values for a {@link YAxis}.
 *
 * This is useful for implementing interactions like click-to-add-annotation,
 * drag interactions, or tooltips that need to determine what data point
 * corresponds to a mouse position.
 *
 * For continuous (numerical) scales, returns an interpolated value.
 * For categorical scales, returns the closest category in the domain - which is the same behaviour as {@link useYAxisInverseDataSnapScale}.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @example
 * ```tsx
 * const yInverseScale = useYAxisInverseScale();
 * if (yInverseScale) {
 *   const dataValue = yInverseScale(200); // Returns the data value at pixel y=200
 * }
 * ```
 *
 * @param yAxisId The `yAxisId` of the YAxis. Defaults to `0` if not provided.
 * @returns An inverse scale function that maps pixel coordinates to data values, or `undefined`.
 * @since 3.8
 */
var useYAxisInverseScale = exports.useYAxisInverseScale = function useYAxisInverseScale() {
  var yAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisInverseScale)(state, 'yAxis', yAxisId, isPanorama));
};

/**
 * Returns a function to convert pixel coordinates back to data values for a {@link YAxis},
 * but snapping to the closest data point.
 *
 * This is similar to {@link useYAxisInverseScale}, but instead of returning the exact data value
 * at the pixel position (interpolation), it returns the value of the closest data point.
 *
 * This is useful for implementing interactions where you want to select the closest data point
 * rather than an exact value or a tick.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @param yAxisId The `yAxisId` of the YAxis. Defaults to `0` if not provided.
 * @returns An inverse scale function that maps pixel coordinates to the closest data value, or `undefined`.
 * @since 3.8
 */
var useYAxisInverseDataSnapScale = exports.useYAxisInverseDataSnapScale = function useYAxisInverseDataSnapScale() {
  var yAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisInverseDataSnapScale)(state, 'yAxis', yAxisId, isPanorama));
};

/**
 * Returns a function to convert pixel coordinates back to data values for a {@link YAxis},
 * but snapping to the closest axis tick.
 *
 * This is similar to {@link useYAxisInverseScale}, but instead of returning the exact data value
 * at the pixel position (interpolation), it returns the value of the closest tick.
 *
 * This is useful for implementing interactions where you want to select the closest tick
 * rather than an exact value or a data point.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist.
 *
 * @param yAxisId The `yAxisId` of the YAxis. Defaults to `0` if not provided.
 * @returns An inverse scale function that maps pixel coordinates to the closest tick value, or `undefined`.
 * @since 3.8
 */
var useYAxisInverseTickSnapScale = exports.useYAxisInverseTickSnapScale = function useYAxisInverseTickSnapScale() {
  var yAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisInverseTickSnapScale)(state, 'yAxis', yAxisId));
};

/**
 * Returns the ticks of an {@link XAxis}.
 *
 * This hook is useful for accessing the calculated ticks of an XAxis.
 * The ticks are the same as the ones rendered by the XAxis component.
 *
 * @param xAxisId The `xAxisId` of the XAxis. Defaults to `0` if not provided.
 * @returns An array of ticks, or `undefined` if the axis doesn't exist or hasn't been calculated yet.
 * @since 3.8
 */
var useXAxisTicks = exports.useXAxisTicks = function useXAxisTicks() {
  var xAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectRenderedTicksOfAxis)(state, 'xAxis', xAxisId));
};

/**
 * Returns the ticks of a {@link YAxis}.
 *
 * This hook is useful for accessing the calculated ticks of a YAxis.
 * The ticks are the same as the ones rendered by the YAxis component.
 *
 * @param yAxisId The `yAxisId` of the YAxis. Defaults to `0` if not provided.
 * @returns An array of ticks, or `undefined` if the axis doesn't exist or hasn't been calculated yet.
 * @since 3.8
 */
var useYAxisTicks = exports.useYAxisTicks = function useYAxisTicks() {
  var yAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectRenderedTicksOfAxis)(state, 'yAxis', yAxisId));
};

/**
 * Data point with x and y values that can be converted to pixel coordinates.
 * The x and y values should be in the same format as your chart data.
 */

/**
 * Converts a data point (in data coordinates) to pixel coordinates.
 *
 * This hook is useful for positioning annotations, custom shapes, or other elements
 * at specific data points on the chart. It uses the axis scales to convert
 * data values to their corresponding pixel positions within the chart area.
 *
 * This hook must be used within a chart context (inside a {@link LineChart}, {@link BarChart}, etc.).
 * Returns `undefined` if used outside a chart context, or if the axes don't exist, or if the data point
 * cannot be converted (e.g., if the data values are outside the axis domains).
 *
 * This is a convenience hook that combines {@link useXAxisScale} and {@link useYAxisScale} together in a single call.
 *
 * @example
 * ```tsx
 * // Position a marker at data point { x: 'Page C', y: 2500 }
 * const pixelCoords = useCartesianScale({ x: 'Page C', y: 2500 });
 * if (pixelCoords) {
 *   return <circle cx={pixelCoords.x} cy={pixelCoords.y} r={5} fill="red" />;
 * }
 * ```
 *
 * @param dataPoint The data point with x and y values in data coordinates.
 * @param xAxisId The `xAxisId` of the X-axis. Defaults to `0` if not provided.
 * @param yAxisId The `yAxisId` of the Y-axis. Defaults to `0` if not provided.
 * @returns The pixel x,y coordinates, or `undefined` if conversion is not possible.
 * @since 3.8
 */
var useCartesianScale = exports.useCartesianScale = function useCartesianScale(dataPoint) {
  var xAxisId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _cartesianAxisSlice.defaultAxisId;
  var yAxisId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _cartesianAxisSlice.defaultAxisId;
  var xScale = useXAxisScale(xAxisId);
  var yScale = useYAxisScale(yAxisId);
  if (xScale == null || yScale == null) {
    return undefined;
  }
  var pixelX = xScale(dataPoint.x);
  var pixelY = yScale(dataPoint.y);
  if (pixelX == null || pixelY == null) {
    return undefined;
  }
  return {
    x: pixelX,
    y: pixelY
  };
};

/**
 * Returns the active tooltip label. The label is one of the values from the chart data,
 * and is used to display in the tooltip content.
 *
 * Returns undefined if there is no active user interaction or if used outside a chart context
 *
 * @returns ActiveLabel
 * @since 3.0
 */
var useActiveTooltipLabel = () => {
  return (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveLabel);
};

/**
 * Returns the offset of the chart in pixels.
 *
 * Offset defines the blank space between the chart and the plot area.
 * This blank space is occupied by supporting elements like axes, legends, and brushes.
 *
 * The offset includes:
 *
 * - Margins
 * - Width and height of the axes
 * - Width and height of the legend
 * - Brush height
 *
 * If you are interested in the margin alone, use {@link useMargin} instead.
 *
 * The offset is independent of charts position on the page, meaning it does not change as the chart is scrolled or resized.
 *
 * It is also independent of the scale and zoom, meaning that as the user zooms in and out,
 * the numbers will not change as the chart gets visually larger or smaller.
 *
 * This hook must be used within a chart context (inside a `<LineChart>`, `<BarChart>`, etc.).
 * This hook returns `undefined` if used outside a chart context.
 *
 * @returns Offset of the chart in pixels, or undefined if used outside a chart context.
 * @since 3.1
 */
exports.useActiveTooltipLabel = useActiveTooltipLabel;
var useOffset = () => {
  return (0, _hooks.useAppSelector)(_selectChartOffset.selectChartOffset);
};

/**
 * Plot area is the area where the actual chart data is rendered.
 * This means: bars, lines, scatter points, etc.
 *
 * The plot area is calculated based on the chart dimensions and the offset.
 *
 * Plot area `width` and `height` are the dimensions in pixels;
 * `x` and `y` are the coordinates of the top-left corner of the plot area relative to the chart container.
 *
 * They are also independent of the scale and zoom, meaning that as the user zooms in and out,
 * the plot area dimensions will not change as the chart gets visually larger or smaller.
 *
 * This hook must be used within a chart context (inside a `<LineChart>`, `<BarChart>`, etc.).
 * This hook returns `undefined` if used outside a chart context.
 *
 * @returns Plot area of the chart in pixels, or undefined if used outside a chart context.
 * @since 3.1
 */
exports.useOffset = useOffset;
var usePlotArea = () => {
  return (0, _hooks.useAppSelector)(_selectPlotArea.selectPlotArea);
};

/**
 * Returns the currently active data points being displayed in the Tooltip.
 * Active means that it is currently visible; this hook will return `undefined` if there is no current interaction.
 *
 * This follows the `<Tooltip />` props, if the Tooltip element is present in the chart.
 * If there is no `<Tooltip />` then this hook will follow the default Tooltip props.
 *
 * Data point is whatever you pass as an input to the chart using the `data={}` prop.
 *
 * This returns an array because a chart can have multiple graphical items in it (multiple Lines for example)
 * and tooltip with `shared={true}` will display all items at the same time.
 *
 * Returns undefined when used outside a chart context.
 *
 * @returns Data points that are currently visible in a Tooltip
 *
 * @since 3.1
 */
exports.usePlotArea = usePlotArea;
var useActiveTooltipDataPoints = () => {
  return (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipDataPoints);
};

/**
 * Returns the calculated domain of an X-axis.
 *
 * The domain can be numerical: `[min, max]`, or categorical: `['a', 'b', 'c']`.
 *
 * The type of the domain is defined by the `type` prop of the XAxis.
 *
 * The values of the domain are calculated based on the data and the `dataKey` of the axis.
 *
 * If the chart has a Brush, the domain will be filtered to the brushed indexes if the hook is used outside a Brush context,
 * and the full domain will be returned if the hook is used inside a Brush context.
 *
 * @param xAxisId The `xAxisId` of the X-axis. Defaults to `0` if not provided.
 * @returns The domain of the X-axis, or `undefined` if it cannot be calculated or if used outside a chart context.
 * @since 3.2
 */
exports.useActiveTooltipDataPoints = useActiveTooltipDataPoints;
var useXAxisDomain = exports.useXAxisDomain = function useXAxisDomain() {
  var xAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisDomain)(state, 'xAxis', xAxisId, isPanorama));
};

/**
 * Returns the calculated domain of a Y-axis.
 *
 * The domain can be numerical: `[min, max]`, or categorical: `['a', 'b', 'c']`.
 *
 * The type of the domain is defined by the `type` prop of the YAxis.
 *
 * The values of the domain are calculated based on the data and the `dataKey` of the axis.
 *
 * Does not interact with Brushes, as Y-axes do not support brushing.
 *
 * @param yAxisId The `yAxisId` of the Y-axis. Defaults to `0` if not provided.
 * @returns The domain of the Y-axis, or `undefined` if it cannot be calculated or if used outside a chart context.
 * @since 3.2
 */
var useYAxisDomain = exports.useYAxisDomain = function useYAxisDomain() {
  var yAxisId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _cartesianAxisSlice.defaultAxisId;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisDomain)(state, 'yAxis', yAxisId, isPanorama));
};

/**
 * Returns true if the {@link Tooltip} is currently active (visible).
 *
 * Returns false if the Tooltip is not active or if used outside a chart context.
 *
 * Recharts only allows one Tooltip per chart, so this hook does not take any parameters.
 * Weird things may happen if you have multiple Tooltip components in the same chart so please don't do that.
 *
 * @returns {boolean} True if the Tooltip is active, false otherwise.
 * @since 3.7
 */
var useIsTooltipActive = () => {
  var _useAppSelector;
  return (_useAppSelector = (0, _hooks.useAppSelector)(_tooltipSelectors.selectIsTooltipActive)) !== null && _useAppSelector !== void 0 ? _useAppSelector : false;
};

/**
 * Returns the Cartesian `x` + `y` coordinates of the active {@link Tooltip}.
 *
 * Returns undefined if there is no active user interaction or if used outside a chart context.
 *
 * Recharts only allows one Tooltip per chart, so this hook does not take any parameters.
 * Weird things may happen if you have multiple Tooltip components in the same chart so please don't do that.
 *
 * @returns {Coordinate | undefined} The coordinate of the active Tooltip, or undefined.
 * @since 3.7
 */
exports.useIsTooltipActive = useIsTooltipActive;
var useActiveTooltipCoordinate = () => {
  var coordinate = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipCoordinate);
  if (coordinate == null) {
    return undefined;
  }
  return {
    x: coordinate.x,
    y: coordinate.y
  };
};
exports.useActiveTooltipCoordinate = useActiveTooltipCoordinate;