/**
 * Calculates the width of the Y-axis based on the tick labels and the axis label.
 * @param params - The parameters object.
 * @param [params.ticks] - An array-like object of tick elements, each with a `getBoundingClientRect` method.
 * @param [params.label] - The axis label element, with a `getBoundingClientRect` method.
 * @param [params.labelGapWithTick=5] - The gap between the label and the tick.
 * @param [params.tickSize=0] - The length of the tick line.
 * @param [params.tickMargin=0] - The margin between the tick line and the tick text.
 * @returns The calculated width of the Y-axis.
 */
export var getCalculatedYAxisWidth = _ref => {
  var ticks = _ref.ticks,
    label = _ref.label,
    _ref$labelGapWithTick = _ref.labelGapWithTick,
    labelGapWithTick = _ref$labelGapWithTick === void 0 ? 5 : _ref$labelGapWithTick,
    _ref$tickSize = _ref.tickSize,
    tickSize = _ref$tickSize === void 0 ? 0 : _ref$tickSize,
    _ref$tickMargin = _ref.tickMargin,
    tickMargin = _ref$tickMargin === void 0 ? 0 : _ref$tickMargin;
  // find the max width of the tick labels
  var maxTickWidth = 0;
  if (ticks) {
    Array.from(ticks).forEach(tickNode => {
      if (tickNode) {
        var bbox = tickNode.getBoundingClientRect();
        if (bbox.width > maxTickWidth) {
          maxTickWidth = bbox.width;
        }
      }
    });

    // calculate width of the axis label
    var labelWidth = label ? label.getBoundingClientRect().width : 0;
    var tickWidth = tickSize + tickMargin;

    // calculate the updated width of the y-axis
    var updatedYAxisWidth = maxTickWidth + tickWidth + labelWidth + (label ? labelGapWithTick : 0);
    return Math.round(updatedYAxisWidth);
  }
  return 0;
};