"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEquidistantPreserveEndTicks = getEquidistantPreserveEndTicks;
exports.getEquidistantTicks = getEquidistantTicks;
var _TickUtils = require("../util/TickUtils");
var _getEveryNth = require("../util/getEveryNth");
function getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
  // If the ticks are readonly, then the slice might not be necessary
  var result = (ticks || []).slice();
  var initialStart = boundaries.start,
    end = boundaries.end;
  var index = 0;
  // Premature optimisation idea 1: Estimate a lower bound, and start from there.
  // For now, start from every tick
  var stepsize = 1;
  var start = initialStart;
  var _loop = function _loop() {
      // Given stepsize, evaluate whether every stepsize-th tick can be shown.
      // If it can not, then increase the stepsize by 1, and try again.

      var entry = ticks === null || ticks === void 0 ? void 0 : ticks[index];

      // Break condition - If we have evaluated all the ticks, then we are done.
      if (entry === undefined) {
        return {
          v: (0, _getEveryNth.getEveryNth)(ticks, stepsize)
        };
      }

      // Check if the element collides with the next element
      var i = index;
      var size;
      var getSize = () => {
        if (size === undefined) {
          size = getTickSize(entry, i);
        }
        return size;
      };
      var tickCoord = entry.coordinate;
      // We will always show the first tick.
      var isShow = index === 0 || (0, _TickUtils.isVisible)(sign, tickCoord, getSize, start, end);
      if (!isShow) {
        // Start all over with a larger stepsize
        index = 0;
        start = initialStart;
        stepsize += 1;
      }
      if (isShow) {
        // If it can be shown, update the start
        start = tickCoord + sign * (getSize() / 2 + minTickGap);
        index += stepsize;
      }
    },
    _ret;
  while (stepsize <= result.length) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
  return [];
}
function getEquidistantPreserveEndTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
  // If the ticks are readonly, then the slice might not be necessary
  // Reworked logic for getEquidistantPreserveEndTicks
  var result = (ticks || []).slice();
  var len = result.length;
  if (len === 0) {
    return [];
  }
  var initialStart = boundaries.start,
    end = boundaries.end;

  // Start with stepsize = 1 (every tick) up to the maximum possible stepsize (len)
  for (var stepsize = 1; stepsize <= len; stepsize++) {
    // 1. Calculate the offset so the last tick (index len - 1) is always included in the sequence.
    var offset = (len - 1) % stepsize;
    var start = initialStart; // `start` tracks the coordinate of the last successfully drawn tick + gap
    var ok = true;

    // 2. Iterate through the end-anchored sequence: offset, offset + stepsize, ..., len - 1
    var _loop2 = function _loop2() {
        var entry = ticks[index];
        if (entry == null) {
          return 0; // continue
        }
        var i = index;
        var size;

        // Use a function to get size, as in the original code
        var getSize = () => {
          if (size === undefined) {
            size = getTickSize(entry, i);
          }
          return size;
        };
        var tickCoord = entry.coordinate;

        // 3. Apply visibility logic (including the first tick special case)
        // The reviewer says *not* to unconditionally bypass checks for the last tick.
        var isShow = index === offset || (0, _TickUtils.isVisible)(sign, tickCoord, getSize, start, end);
        if (!isShow) {
          // If any tick in this end-anchored sequence fails visibility/collision,
          // reject this stepsize and move to the next iteration (larger stepsize).
          ok = false;
          return 1; // break
        }

        // 4. If showable, update the 'start' coordinate for the next collision check
        if (isShow) {
          start = tickCoord + sign * (getSize() / 2 + minTickGap);
        }
      },
      _ret2;
    for (var index = offset; index < len; index += stepsize) {
      _ret2 = _loop2();
      if (_ret2 === 0) continue;
      if (_ret2 === 1) break;
    }

    // 5. If the entire sequence for this stepsize passed the visibility check, return the result
    if (ok) {
      // Build the final result array explicitly using the validated stepsize and offset.
      var finalTicks = [];
      for (var _index = offset; _index < len; _index += stepsize) {
        var tick = ticks[_index];
        if (tick != null) {
          finalTicks.push(tick);
        }
      }
      return finalTicks;
    }
  }

  // If no stepsize works (this shouldn't happen unless minTickGap is huge), return an empty array.
  return [];
}