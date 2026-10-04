"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCalculatedXAxisHeight = void 0;
/**
 * Calculates the height of the X-axis based on the tick labels and the axis label.
 * @param params - The parameters object.
 * @param [params.ticks] - An array-like object of tick elements, each with a `getBoundingClientRect` method.
 * @param [params.label] - The axis label element, with a `getBoundingClientRect` method.
 * @param [params.labelGapWithTick=5] - The gap between the label and the tick.
 * @param [params.tickSize=0] - The length of the tick line.
 * @param [params.tickMargin=0] - The margin between the tick line and the tick text.
 * @returns The calculated height of the X-axis.
 */
var getCalculatedXAxisHeight = _ref => {
  var ticks = _ref.ticks,
    label = _ref.label,
    _ref$labelGapWithTick = _ref.labelGapWithTick,
    labelGapWithTick = _ref$labelGapWithTick === void 0 ? 5 : _ref$labelGapWithTick,
    _ref$tickSize = _ref.tickSize,
    tickSize = _ref$tickSize === void 0 ? 0 : _ref$tickSize,
    _ref$tickMargin = _ref.tickMargin,
    tickMargin = _ref$tickMargin === void 0 ? 0 : _ref$tickMargin;
  // find the max height of the tick labels
  var maxTickHeight = 0;
  if (ticks) {
    Array.from(ticks).forEach(tickNode => {
      if (tickNode) {
        var bbox = tickNode.getBoundingClientRect();
        if (bbox.height > maxTickHeight) {
          maxTickHeight = bbox.height;
        }
      }
    });

    // calculate height of the axis label
    var labelHeight = label ? label.getBoundingClientRect().height : 0;
    var tickHeight = tickSize + tickMargin;

    // calculate the updated height of the x-axis
    var updatedXAxisHeight = maxTickHeight + tickHeight + labelHeight + (label ? labelGapWithTick : 0);
    return Math.round(updatedXAxisHeight);
  }
  return 0;
};
exports.getCalculatedXAxisHeight = getCalculatedXAxisHeight;