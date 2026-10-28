function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { polarToCartesian } from './PolarUtils';
import { mathSign } from './DataUtils';
export var getActiveCartesianCoordinate = (layout, tooltipTicks, activeIndex, pointer) => {
  var entry = tooltipTicks.find(tick => tick && tick.index === activeIndex);
  if (entry) {
    if (layout === 'horizontal') {
      return {
        x: entry.coordinate,
        y: pointer.relativeY
      };
    }
    if (layout === 'vertical') {
      return {
        x: pointer.relativeX,
        y: entry.coordinate
      };
    }
  }
  return {
    x: 0,
    y: 0
  };
};

/**
 * Get the active coordinate in polar coordinate system.
 * Internally we only really use x and y, but this returned object is part of public API
 * (because it goes straight to the tooltip content) so we keep all the other properties
 * for backwards compatibility.
 *
 * @param layout - The polar layout type ('centric' or 'radial').
 * @param tooltipTicks - Array of tick items used for tooltips.
 * @param activeIndex - The index of the active tick.
 * @param rangeObj - The range object containing polar chart properties.
 * @returns The active coordinate object with polar properties.
 */
export var getActivePolarCoordinate = (layout, tooltipTicks, activeIndex, rangeObj) => {
  var entry = tooltipTicks.find(tick => tick && tick.index === activeIndex);
  if (entry) {
    if (layout === 'centric') {
      var _angle = entry.coordinate;
      var _radius = rangeObj.radius;
      return _objectSpread(_objectSpread(_objectSpread({}, rangeObj), polarToCartesian(rangeObj.cx, rangeObj.cy, _radius, _angle)), {}, {
        angle: _angle,
        radius: _radius
      });
    }
    var radius = entry.coordinate;
    var angle = rangeObj.angle;
    return _objectSpread(_objectSpread(_objectSpread({}, rangeObj), polarToCartesian(rangeObj.cx, rangeObj.cy, radius, angle)), {}, {
      angle,
      radius
    });
  }
  return {
    angle: 0,
    clockWise: false,
    cx: 0,
    cy: 0,
    endAngle: 0,
    innerRadius: 0,
    outerRadius: 0,
    radius: 0,
    startAngle: 0,
    x: 0,
    y: 0
  };
};
export function isInCartesianRange(pointer, offset) {
  var x = pointer.relativeX,
    y = pointer.relativeY;
  return x >= offset.left && x <= offset.left + offset.width && y >= offset.top && y <= offset.top + offset.height;
}
export var calculateActiveTickIndex = (coordinate, ticks, unsortedTicks, axisType, range) => {
  var _ticks$length;
  var len = (_ticks$length = ticks === null || ticks === void 0 ? void 0 : ticks.length) !== null && _ticks$length !== void 0 ? _ticks$length : 0;

  // if there are 1 or fewer ticks or if there is no coordinate then the active tick is at index 0
  if (len <= 1 || coordinate == null) {
    return 0;
  }
  if (axisType === 'angleAxis' && range != null && Math.abs(Math.abs(range[1] - range[0]) - 360) <= 1e-6) {
    // ticks are distributed in a circle
    var span = range[1] - range[0];
    /*
     * Tick coordinates can be shifted outside of the range (e.g. by the band offset
     * that tooltip ticks receive), so both the coordinate and the intervals live
     * modulo the full circle. Testing the coordinate shifted by a whole turn in both
     * directions closes the wrap-around gap where no interval matched
     * and the active index came back as -1.
     * https://github.com/recharts/recharts/issues/5099
     */
    var isInside = (lowerLimit, upperLimit, inclusiveLower) => [coordinate, coordinate + span, coordinate - span].some(c => (inclusiveLower ? c >= lowerLimit : c > lowerLimit) && c <= upperLimit);
    for (var i = 0; i < len; i++) {
      var _unsortedTicks, _unsortedTicks2, _unsortedTicks$i, _unsortedTicks$, _unsortedTicks3;
      var before = i > 0 ? (_unsortedTicks = unsortedTicks[i - 1]) === null || _unsortedTicks === void 0 ? void 0 : _unsortedTicks.coordinate : (_unsortedTicks2 = unsortedTicks[len - 1]) === null || _unsortedTicks2 === void 0 ? void 0 : _unsortedTicks2.coordinate;
      var cur = (_unsortedTicks$i = unsortedTicks[i]) === null || _unsortedTicks$i === void 0 ? void 0 : _unsortedTicks$i.coordinate;
      var after = i >= len - 1 ? (_unsortedTicks$ = unsortedTicks[0]) === null || _unsortedTicks$ === void 0 ? void 0 : _unsortedTicks$.coordinate : (_unsortedTicks3 = unsortedTicks[i + 1]) === null || _unsortedTicks3 === void 0 ? void 0 : _unsortedTicks3.coordinate;
      var sameDirectionCoord = void 0;
      if (before == null || cur == null || after == null) {
        continue;
      }
      if (mathSign(cur - before) !== mathSign(after - cur)) {
        var diffInterval = [];
        if (mathSign(after - cur) === mathSign(range[1] - range[0])) {
          sameDirectionCoord = after;
          var curInRange = cur + range[1] - range[0];
          diffInterval[0] = Math.min(curInRange, (curInRange + before) / 2);
          diffInterval[1] = Math.max(curInRange, (curInRange + before) / 2);
        } else {
          sameDirectionCoord = before;
          var afterInRange = after + range[1] - range[0];
          diffInterval[0] = Math.min(cur, (afterInRange + cur) / 2);
          diffInterval[1] = Math.max(cur, (afterInRange + cur) / 2);
        }
        var sameInterval = [Math.min(cur, (sameDirectionCoord + cur) / 2), Math.max(cur, (sameDirectionCoord + cur) / 2)];
        if (isInside(sameInterval[0], sameInterval[1], false) || isInside(diffInterval[0], diffInterval[1], true)) {
          var _unsortedTicks$i2;
          return (_unsortedTicks$i2 = unsortedTicks[i]) === null || _unsortedTicks$i2 === void 0 ? void 0 : _unsortedTicks$i2.index;
        }
      } else {
        var minValue = Math.min(before, after);
        var maxValue = Math.max(before, after);
        if (isInside((minValue + cur) / 2, (maxValue + cur) / 2, false)) {
          var _unsortedTicks$i3;
          return (_unsortedTicks$i3 = unsortedTicks[i]) === null || _unsortedTicks$i3 === void 0 ? void 0 : _unsortedTicks$i3.index;
        }
      }
    }
  } else if (ticks) {
    // ticks are distributed in a single direction
    for (var _i = 0; _i < len; _i++) {
      var curr = ticks[_i];
      if (curr == null) {
        continue;
      }
      var next = ticks[_i + 1];
      var prev = ticks[_i - 1];
      if (_i === 0 && next != null && coordinate <= (curr.coordinate + next.coordinate) / 2) {
        return curr.index;
      }
      if (_i === len - 1 && prev != null && coordinate > (curr.coordinate + prev.coordinate) / 2) {
        return curr.index;
      }
      if (_i > 0 && _i < len - 1 && prev != null && next != null && coordinate > (curr.coordinate + prev.coordinate) / 2 && coordinate <= (curr.coordinate + next.coordinate) / 2) {
        return curr.index;
      }
    }
  }
  return -1;
};