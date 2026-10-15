"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTicks = getTicks;
var _DataUtils = require("../util/DataUtils");
var _DOMUtils = require("../util/DOMUtils");
var _Global = require("../util/Global");
var _TickUtils = require("../util/TickUtils");
var _getEquidistantTicks = require("./getEquidistantTicks");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap) {
  var result = (ticks || []).slice();
  var len = result.length;
  var start = boundaries.start;
  var end = boundaries.end;
  var _loop = function _loop(i) {
    var initialEntry = result[i];
    if (initialEntry == null) {
      return 1; // continue
    }
    var entry = initialEntry;
    var size;
    var getSize = () => {
      if (size === undefined) {
        size = getTickSize(initialEntry, i);
      }
      return size;
    };
    if (i === len - 1) {
      var gap = sign * (entry.coordinate + sign * getSize() / 2 - end);
      result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
        tickCoord: gap > 0 ? entry.coordinate - gap * sign : entry.coordinate
      });
    } else {
      result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
        tickCoord: entry.coordinate
      });
    }
    if (entry.tickCoord != null) {
      var isShow = (0, _TickUtils.isVisible)(sign, entry.tickCoord, getSize, start, end);
      if (isShow) {
        end = entry.tickCoord - sign * (getSize() / 2 + minTickGap);
        result[i] = _objectSpread(_objectSpread({}, entry), {}, {
          isShow: true
        });
      }
    }
  };
  for (var i = len - 1; i >= 0; i--) {
    if (_loop(i)) continue;
  }
  return result;
}
function getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, preserveEnd) {
  // This method is mutating the array so clone is indeed necessary here
  var result = (ticks || []).slice();
  var len = result.length;
  var start = boundaries.start,
    end = boundaries.end;
  if (preserveEnd) {
    // Try to guarantee the tail to be displayed
    var tail = ticks[len - 1];
    if (tail != null) {
      var tailSize = getTickSize(tail, len - 1);
      var tailGap = sign * (tail.coordinate + sign * tailSize / 2 - end);
      result[len - 1] = tail = _objectSpread(_objectSpread({}, tail), {}, {
        tickCoord: tailGap > 0 ? tail.coordinate - tailGap * sign : tail.coordinate
      });
      if (tail.tickCoord != null) {
        var isTailShow = (0, _TickUtils.isVisible)(sign, tail.tickCoord, () => tailSize, start, end);
        if (isTailShow) {
          end = tail.tickCoord - sign * (tailSize / 2 + minTickGap);
          result[len - 1] = _objectSpread(_objectSpread({}, tail), {}, {
            isShow: true
          });
        }
      }
    }
  }
  var count = preserveEnd ? len - 1 : len;
  var _loop2 = function _loop2(i) {
    var initialEntry = result[i];
    if (initialEntry == null) {
      return 1; // continue
    }
    var entry = initialEntry;
    var size;
    var getSize = () => {
      if (size === undefined) {
        size = getTickSize(initialEntry, i);
      }
      return size;
    };
    if (i === 0) {
      var gap = sign * (entry.coordinate - sign * getSize() / 2 - start);
      result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
        tickCoord: gap < 0 ? entry.coordinate - gap * sign : entry.coordinate
      });
    } else {
      result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
        tickCoord: entry.coordinate
      });
    }
    if (entry.tickCoord != null) {
      var isShow = (0, _TickUtils.isVisible)(sign, entry.tickCoord, getSize, start, end);
      if (isShow) {
        start = entry.tickCoord + sign * (getSize() / 2 + minTickGap);
        result[i] = _objectSpread(_objectSpread({}, entry), {}, {
          isShow: true
        });
      }
    }
  };
  for (var i = 0; i < count; i++) {
    if (_loop2(i)) continue;
  }
  return result;
}
function getTicks(props, fontSize, letterSpacing) {
  var tick = props.tick,
    ticks = props.ticks,
    viewBox = props.viewBox,
    minTickGap = props.minTickGap,
    orientation = props.orientation,
    interval = props.interval,
    tickFormatter = props.tickFormatter,
    unit = props.unit,
    angle = props.angle;
  if (!ticks || !ticks.length || !tick) {
    return [];
  }
  if ((0, _DataUtils.isNumber)(interval) || _Global.Global.isSsr) {
    var _getNumberIntervalTic;
    return (_getNumberIntervalTic = (0, _TickUtils.getNumberIntervalTicks)(ticks, (0, _DataUtils.isNumber)(interval) ? interval : 0)) !== null && _getNumberIntervalTic !== void 0 ? _getNumberIntervalTic : [];
  }
  var candidates = [];
  var sizeKey = orientation === 'top' || orientation === 'bottom' ? 'width' : 'height';
  var unitSize = unit && sizeKey === 'width' ? (0, _DOMUtils.getStringSize)(unit, {
    fontSize,
    letterSpacing
  }) : {
    width: 0,
    height: 0
  };
  var getTickSize = (content, index) => {
    var value = typeof tickFormatter === 'function' ? tickFormatter(content.value, index) : content.value;
    // Recharts only supports angles when sizeKey === 'width'
    return sizeKey === 'width' ? (0, _TickUtils.getAngledTickWidth)((0, _DOMUtils.getStringSize)(value, {
      fontSize,
      letterSpacing
    }), unitSize, angle) : (0, _DOMUtils.getStringSize)(value, {
      fontSize,
      letterSpacing
    })[sizeKey];
  };
  var tick0 = ticks[0];
  var tick1 = ticks[1];
  var sign = ticks.length >= 2 && tick0 != null && tick1 != null ? (0, _DataUtils.mathSign)(tick1.coordinate - tick0.coordinate) : 1;
  var boundaries = (0, _TickUtils.getTickBoundaries)(viewBox, sign, sizeKey);
  if (interval === 'equidistantPreserveStart') {
    return (0, _getEquidistantTicks.getEquidistantTicks)(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  if (interval === 'equidistantPreserveEnd') {
    return (0, _getEquidistantTicks.getEquidistantPreserveEndTicks)(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  if (interval === 'preserveStart' || interval === 'preserveStartEnd') {
    candidates = getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, interval === 'preserveStartEnd');
  } else {
    candidates = getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  return candidates.filter(entry => entry.isShow);
}