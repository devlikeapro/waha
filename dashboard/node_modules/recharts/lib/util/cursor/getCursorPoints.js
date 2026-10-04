"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCursorPoints = getCursorPoints;
var _PolarUtils = require("../PolarUtils");
var _types = require("../types");
var _getRadialCursorPoints = require("./getRadialCursorPoints");
function getCursorPoints(layout, activeCoordinate, offset) {
  if (layout === 'horizontal') {
    return [{
      x: activeCoordinate.x,
      y: offset.top
    }, {
      x: activeCoordinate.x,
      y: offset.top + offset.height
    }];
  }
  if (layout === 'vertical') {
    return [{
      x: offset.left,
      y: activeCoordinate.y
    }, {
      x: offset.left + offset.width,
      y: activeCoordinate.y
    }];
  }
  if ((0, _types.isPolarCoordinate)(activeCoordinate)) {
    if (layout === 'centric') {
      var cx = activeCoordinate.cx,
        cy = activeCoordinate.cy,
        innerRadius = activeCoordinate.innerRadius,
        outerRadius = activeCoordinate.outerRadius,
        angle = activeCoordinate.angle;
      var innerPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, innerRadius, angle);
      var outerPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, angle);
      return [{
        x: innerPoint.x,
        y: innerPoint.y
      }, {
        x: outerPoint.x,
        y: outerPoint.y
      }];
    }
    return (0, _getRadialCursorPoints.getRadialCursorPoints)(activeCoordinate);
  }
  return undefined;
}