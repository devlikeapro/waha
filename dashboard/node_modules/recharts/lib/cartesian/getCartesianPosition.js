"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCartesianPosition = void 0;
exports.isOutsidePosition = isOutsidePosition;
var _DataUtils = require("../util/DataUtils");
var _cartesianViewBoxToTrapezoid = require("./cartesianViewBoxToTrapezoid");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * This type mixes together all the possible label positions for both cartesian and polar coordinates.
 * It is used in some places where the 2.x API allowed both types of charts mixed together.
 * If applicable, prefer to use {@link CalculatedCartesianPosition} instead.
 */

/**
 * @inline
 */

/**
 * Calculates the position and alignment for a generic element in a Cartesian coordinate system.
 *
 * @param options - The options including viewBox, position, and offset.
 * @returns The calculated x, y, alignment and size.
 */
var getCartesianPosition = options => {
  var viewBox = options.viewBox,
    position = options.position,
    _options$offset = options.offset,
    offset = _options$offset === void 0 ? 0 : _options$offset,
    parentViewBoxFromOptions = options.parentViewBox,
    clamp = options.clamp;
  var _cartesianViewBoxToTr = (0, _cartesianViewBoxToTrapezoid.cartesianViewBoxToTrapezoid)(viewBox),
    x = _cartesianViewBoxToTr.x,
    y = _cartesianViewBoxToTr.y,
    height = _cartesianViewBoxToTr.height,
    upperWidth = _cartesianViewBoxToTr.upperWidth,
    lowerWidth = _cartesianViewBoxToTr.lowerWidth;

  // Funnel.tsx provides a viewBox where `x` is the top-left of the trapezoid shape.
  var upperX = x;
  // The trapezoid is centered, so we can calculate the other corners from the top-left.
  var lowerX = x + (upperWidth - lowerWidth) / 2;
  // middleX is the x-coordinate of the left edge at the vertical midpoint of the trapezoid.
  var middleX = (upperX + lowerX) / 2;
  // The width of the trapezoid at its vertical midpoint.
  var midHeightWidth = (upperWidth + lowerWidth) / 2;
  // The center x-coordinate is constant for the entire height of the trapezoid.
  var centerX = upperX + upperWidth / 2;

  // Define vertical offsets and position inverts based on the value being positive or negative.
  // This allows labels to be positioned correctly for bars with negative height.
  var verticalSign = height >= 0 ? 1 : -1;
  var verticalOffset = verticalSign * offset;
  var verticalEnd = verticalSign > 0 ? 'end' : 'start';
  var verticalStart = verticalSign > 0 ? 'start' : 'end';

  // Define horizontal offsets and position inverts based on the value being positive or negative.
  // This allows labels to be positioned correctly for bars with negative width.
  var horizontalSign = upperWidth >= 0 ? 1 : -1;
  var horizontalOffset = horizontalSign * offset;
  var horizontalEnd = horizontalSign > 0 ? 'end' : 'start';
  var horizontalStart = horizontalSign > 0 ? 'start' : 'end';

  // We assume parentViewBox is generic if provided.
  // The user has asserted that parentViewBox will be CartesianViewBoxRequired if present.
  var parentViewBox = parentViewBoxFromOptions;
  if (position === 'top') {
    var result = {
      x: upperX + upperWidth / 2,
      y: y - verticalOffset,
      horizontalAnchor: 'middle',
      verticalAnchor: verticalEnd
    };
    if (clamp && parentViewBox) {
      result.height = Math.max(y - parentViewBox.y, 0);
      result.width = upperWidth;
    }
    return result;
  }
  if (position === 'bottom') {
    var _result = {
      x: lowerX + lowerWidth / 2,
      y: y + height + verticalOffset,
      horizontalAnchor: 'middle',
      verticalAnchor: verticalStart
    };
    if (clamp && parentViewBox) {
      _result.height = Math.max(parentViewBox.y + parentViewBox.height - (y + height), 0);
      _result.width = lowerWidth;
    }
    return _result;
  }
  if (position === 'left') {
    var _result2 = {
      x: middleX - horizontalOffset,
      y: y + height / 2,
      horizontalAnchor: horizontalEnd,
      verticalAnchor: 'middle'
    };
    if (clamp && parentViewBox) {
      _result2.width = Math.max(_result2.x - parentViewBox.x, 0);
      _result2.height = height;
    }
    return _result2;
  }
  if (position === 'right') {
    var _result3 = {
      x: middleX + midHeightWidth + horizontalOffset,
      y: y + height / 2,
      horizontalAnchor: horizontalStart,
      verticalAnchor: 'middle'
    };
    if (clamp && parentViewBox) {
      _result3.width = Math.max(parentViewBox.x + parentViewBox.width - _result3.x, 0);
      _result3.height = height;
    }
    return _result3;
  }
  var sizeAttrs = clamp && parentViewBox ? {
    width: midHeightWidth,
    height
  } : {};
  if (position === 'insideLeft') {
    return _objectSpread({
      x: middleX + horizontalOffset,
      y: y + height / 2,
      horizontalAnchor: horizontalStart,
      verticalAnchor: 'middle'
    }, sizeAttrs);
  }
  if (position === 'insideRight') {
    return _objectSpread({
      x: middleX + midHeightWidth - horizontalOffset,
      y: y + height / 2,
      horizontalAnchor: horizontalEnd,
      verticalAnchor: 'middle'
    }, sizeAttrs);
  }
  if (position === 'insideTop') {
    return _objectSpread({
      x: upperX + upperWidth / 2,
      y: y + verticalOffset,
      horizontalAnchor: 'middle',
      verticalAnchor: verticalStart
    }, sizeAttrs);
  }
  if (position === 'insideBottom') {
    return _objectSpread({
      x: lowerX + lowerWidth / 2,
      y: y + height - verticalOffset,
      horizontalAnchor: 'middle',
      verticalAnchor: verticalEnd
    }, sizeAttrs);
  }
  if (position === 'insideTopLeft') {
    return _objectSpread({
      x: upperX + horizontalOffset,
      y: y + verticalOffset,
      horizontalAnchor: horizontalStart,
      verticalAnchor: verticalStart
    }, sizeAttrs);
  }
  if (position === 'insideTopRight') {
    return _objectSpread({
      x: upperX + upperWidth - horizontalOffset,
      y: y + verticalOffset,
      horizontalAnchor: horizontalEnd,
      verticalAnchor: verticalStart
    }, sizeAttrs);
  }
  if (position === 'insideBottomLeft') {
    return _objectSpread({
      x: lowerX + horizontalOffset,
      y: y + height - verticalOffset,
      horizontalAnchor: horizontalStart,
      verticalAnchor: verticalEnd
    }, sizeAttrs);
  }
  if (position === 'insideBottomRight') {
    return _objectSpread({
      x: lowerX + lowerWidth - horizontalOffset,
      y: y + height - verticalOffset,
      horizontalAnchor: horizontalEnd,
      verticalAnchor: verticalEnd
    }, sizeAttrs);
  }
  if (!!position && typeof position === 'object' && ((0, _DataUtils.isNumber)(position.x) || (0, _DataUtils.isPercent)(position.x)) && ((0, _DataUtils.isNumber)(position.y) || (0, _DataUtils.isPercent)(position.y))) {
    // TODO: This is not quite right. The width of the trapezoid changes with y.
    // A percentage-based x should be relative to the width at that y.
    // For now, we use the mid-height width as a reasonable approximation.
    return _objectSpread({
      x: x + (0, _DataUtils.getPercentValue)(position.x, midHeightWidth),
      y: y + (0, _DataUtils.getPercentValue)(position.y, height),
      horizontalAnchor: 'end',
      verticalAnchor: 'end'
    }, sizeAttrs);
  }
  return _objectSpread({
    x: centerX,
    y: y + height / 2,
    horizontalAnchor: 'middle',
    verticalAnchor: 'middle'
  }, sizeAttrs);
};
exports.getCartesianPosition = getCartesianPosition;
var absolutePositions = ['top', 'left', 'right', 'bottom'];
function isOutsidePosition(position) {
  if (position == null) {
    return false;
  }
  if (typeof position === 'object') {
    return true;
  }
  return absolutePositions.includes(position);
}