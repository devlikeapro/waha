"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bisect = bisect;
exports.createCategoricalInverse = createCategoricalInverse;
/**
 * Binary search to find the index where x would fit in array a.
 * Works for arrays that are sorted both ascending and descending.
 *
 * Unlike d3.bisect, this implementation handles both ascending and descending arrays.
 *
 * @param haystack Sorted array of numbers
 * @param needle Number to find the insertion index for
 * @returns Index where x would fit in array a
 */
function bisect(haystack, needle) {
  var lo = 0;
  var hi = haystack.length;
  var ascending = haystack[0] < haystack[haystack.length - 1];
  while (lo < hi) {
    var mid = Math.floor((lo + hi) / 2);
    if (ascending ? haystack[mid] < needle : haystack[mid] > needle) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

/**
 * Computes an inverse scale function for categorical/ordinal scales.
 * Uses bisect to find the closest domain value for a given pixel coordinate.
 */
function createCategoricalInverse(scale, allDataPointsOnAxis) {
  if (!scale) {
    return undefined;
  }
  var domain = allDataPointsOnAxis !== null && allDataPointsOnAxis !== void 0 ? allDataPointsOnAxis : scale.domain();
  // Build an array of pixel positions for each domain value
  // @ts-expect-error we're attempting to scale unknown without having guarantee that it is a Domain type
  var pixelPositions = domain.map(d => {
    var _scale;
    return (_scale = scale(d)) !== null && _scale !== void 0 ? _scale : 0;
  });
  var range = scale.range();
  if (domain.length === 0 || range.length < 2) {
    return undefined;
  }
  return pixelValue => {
    var _pixelPositions, _pixelPositions$index;
    // Find the closest domain value using bisect
    var index = bisect(pixelPositions, pixelValue);

    // Clamp to valid range
    if (index <= 0) {
      return domain[0];
    }
    if (index >= domain.length) {
      return domain[domain.length - 1];
    }

    // Check which neighbor is closer
    var leftPixel = (_pixelPositions = pixelPositions[index - 1]) !== null && _pixelPositions !== void 0 ? _pixelPositions : 0;
    var rightPixel = (_pixelPositions$index = pixelPositions[index]) !== null && _pixelPositions$index !== void 0 ? _pixelPositions$index : 0;
    if (Math.abs(pixelValue - leftPixel) <= Math.abs(pixelValue - rightPixel)) {
      return domain[index - 1];
    }
    return domain[index];
  };
}