"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useViewBox = exports.usePolarChartLayout = exports.useOffsetInternal = exports.useMargin = exports.useIsInChartContext = exports.useChartWidth = exports.useChartLayout = exports.useChartHeight = exports.useCartesianChartLayout = exports.selectPolarChartLayout = exports.selectChartLayout = exports.ReportChartSize = exports.ReportChartMargin = void 0;
var _react = require("react");
var _hooks = require("../state/hooks");
var _layoutSlice = require("../state/layoutSlice");
var _selectChartOffsetInternal = require("../state/selectors/selectChartOffsetInternal");
var _containerSelectors = require("../state/selectors/containerSelectors");
var _PanoramaContext = require("./PanoramaContext");
var _brushSelectors = require("../state/selectors/brushSelectors");
var _ResponsiveContainer = require("../component/ResponsiveContainer");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var useViewBox = () => {
  var _useAppSelector;
  var panorama = (0, _PanoramaContext.useIsPanorama)();
  var rootViewBox = (0, _hooks.useAppSelector)(_selectChartOffsetInternal.selectChartViewBox);
  var brushDimensions = (0, _hooks.useAppSelector)(_brushSelectors.selectBrushDimensions);
  var brushPadding = (_useAppSelector = (0, _hooks.useAppSelector)(_brushSelectors.selectBrushSettings)) === null || _useAppSelector === void 0 ? void 0 : _useAppSelector.padding;
  if (!panorama || !brushDimensions || !brushPadding) {
    return rootViewBox;
  }
  return {
    width: brushDimensions.width - brushPadding.left - brushPadding.right,
    height: brushDimensions.height - brushPadding.top - brushPadding.bottom,
    x: brushPadding.left,
    y: brushPadding.top
  };
};
exports.useViewBox = useViewBox;
var manyComponentsThrowErrorsIfOffsetIsUndefined = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0
};
/**
 * For internal use only. If you want this information, `import { useOffset } from 'recharts'` instead.
 *
 * Returns the offset of the chart in pixels.
 *
 * @returns {ChartOffsetInternal} The offset of the chart in pixels, or a default value if not in a chart context.
 */
var useOffsetInternal = () => {
  var _useAppSelector2;
  return (_useAppSelector2 = (0, _hooks.useAppSelector)(_selectChartOffsetInternal.selectChartOffsetInternal)) !== null && _useAppSelector2 !== void 0 ? _useAppSelector2 : manyComponentsThrowErrorsIfOffsetIsUndefined;
};

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
exports.useOffsetInternal = useOffsetInternal;
var useChartWidth = () => {
  return (0, _hooks.useAppSelector)(_containerSelectors.selectChartWidth);
};

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
exports.useChartWidth = useChartWidth;
var useChartHeight = () => {
  return (0, _hooks.useAppSelector)(_containerSelectors.selectChartHeight);
};

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
exports.useChartHeight = useChartHeight;
var useMargin = () => {
  return (0, _hooks.useAppSelector)(state => state.layout.margin);
};
exports.useMargin = useMargin;
var selectChartLayout = state => state.layout.layoutType;

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
exports.selectChartLayout = selectChartLayout;
var useChartLayout = () => (0, _hooks.useAppSelector)(selectChartLayout);

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
exports.useChartLayout = useChartLayout;
var useCartesianChartLayout = () => {
  var layout = useChartLayout();
  if (layout === 'horizontal' || layout === 'vertical') {
    return layout;
  }
  return undefined;
};
exports.useCartesianChartLayout = useCartesianChartLayout;
var selectPolarChartLayout = state => {
  var layout = state.layout.layoutType;
  if (layout === 'centric' || layout === 'radial') {
    return layout;
  }
  return undefined;
};

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
exports.selectPolarChartLayout = selectPolarChartLayout;
var usePolarChartLayout = () => {
  return (0, _hooks.useAppSelector)(selectPolarChartLayout);
};

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
exports.usePolarChartLayout = usePolarChartLayout;
var useIsInChartContext = () => {
  /*
   * All charts provide a layout type in the chart context.
   * If we have a layout type, we are in a chart context.
   */
  var layout = useChartLayout();
  return layout !== undefined;
};
exports.useIsInChartContext = useIsInChartContext;
var ReportChartSize = props => {
  var dispatch = (0, _hooks.useAppDispatch)();

  /*
   * Skip dispatching properties in panorama chart for two reasons:
   * 1. The root chart should be deciding on these properties, and
   * 2. Brush reads these properties from redux store, and so they must remain stable
   *      to avoid circular dependency and infinite re-rendering.
   */
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var widthFromProps = props.width,
    heightFromProps = props.height;
  var responsiveContainerCalculations = (0, _ResponsiveContainer.useResponsiveContainerContext)();
  var width = widthFromProps;
  var height = heightFromProps;
  if (responsiveContainerCalculations) {
    /*
     * In case we receive width and height from ResponsiveContainer,
     * we will always prefer those.
     * Only in case ResponsiveContainer does not provide width or height,
     * we will fall back to the explicitly provided width and height.
     *
     * This to me feels backwards - we should allow override by the more specific props on individual charts, right?
     * But this is 3.x behaviour, so let's keep it for backwards compatibility.
     *
     * We can change this in 4.x if we want to.
     */
    width = responsiveContainerCalculations.width > 0 ? responsiveContainerCalculations.width : widthFromProps;
    height = responsiveContainerCalculations.height > 0 ? responsiveContainerCalculations.height : heightFromProps;
  }
  (0, _react.useEffect)(() => {
    if (!isPanorama && (0, _isWellBehavedNumber.isPositiveNumber)(width) && (0, _isWellBehavedNumber.isPositiveNumber)(height)) {
      dispatch((0, _layoutSlice.setChartSize)({
        width,
        height
      }));
    }
  }, [dispatch, isPanorama, width, height]);
  return null;
};
exports.ReportChartSize = ReportChartSize;
var ReportChartMargin = _ref => {
  var margin = _ref.margin;
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _layoutSlice.setMargin)(margin));
  }, [dispatch, margin]);
  return null;
};
exports.ReportChartMargin = ReportChartMargin;