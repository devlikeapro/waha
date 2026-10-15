/**
 * This is internal representation of scale used in Recharts.
 * Users will provide CustomScaleDefinition or a string, which we will parse into RechartsScale.
 * Most importantly, RechartsScale is fully immutable - there are no setters that mutate the scale in place.
 * This is important for React integration - if the scale changes, we want to trigger re-renders.
 * Mutating the scale in place would not trigger re-renders, leading to stale UI.
 */

/**
 * Position within a band for banded scales.
 * In scales that are not banded, this parameter is ignored.
 *
 * @inline
 */

export function rechartsScaleFactory(d3Scale) {
  if (d3Scale == null) {
    return undefined;
  }
  var ticksFn = d3Scale.ticks;
  var bandwidthFn = d3Scale.bandwidth;
  var d3Range = d3Scale.range();
  var range = [Math.min(...d3Range), Math.max(...d3Range)];
  return {
    domain: () => d3Scale.domain(),
    range: function (_range) {
      function range() {
        return _range.apply(this, arguments);
      }
      range.toString = function () {
        return _range.toString();
      };
      return range;
    }(() => range),
    rangeMin: () => range[0],
    rangeMax: () => range[1],
    isInRange(value) {
      var first = range[0];
      var last = range[1];
      return first <= last ? value >= first && value <= last : value >= last && value <= first;
    },
    bandwidth: bandwidthFn ? () => bandwidthFn.call(d3Scale) : undefined,
    ticks: ticksFn ? count => ticksFn.call(d3Scale, count) : undefined,
    map: (input, options) => {
      var baseValue = d3Scale(input);
      if (baseValue == null) {
        return undefined;
      }
      if (d3Scale.bandwidth && options !== null && options !== void 0 && options.position) {
        var bandWidth = d3Scale.bandwidth();
        switch (options.position) {
          case 'middle':
            baseValue += bandWidth / 2;
            break;
          case 'end':
            baseValue += bandWidth;
            break;
          default:
            // 'start' requires no adjustment
            break;
        }
      }
      return baseValue;
    }
  };
}