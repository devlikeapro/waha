import { polarToCartesian } from '../PolarUtils';
import { isPolarCoordinate } from '../types';
import { getRadialCursorPoints } from './getRadialCursorPoints';
export function getCursorPoints(layout, activeCoordinate, offset) {
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
  if (isPolarCoordinate(activeCoordinate)) {
    if (layout === 'centric') {
      var cx = activeCoordinate.cx,
        cy = activeCoordinate.cy,
        innerRadius = activeCoordinate.innerRadius,
        outerRadius = activeCoordinate.outerRadius,
        angle = activeCoordinate.angle;
      var innerPoint = polarToCartesian(cx, cy, innerRadius, angle);
      var outerPoint = polarToCartesian(cx, cy, outerRadius, angle);
      return [{
        x: innerPoint.x,
        y: innerPoint.y
      }, {
        x: outerPoint.x,
        y: outerPoint.y
      }];
    }
    return getRadialCursorPoints(activeCoordinate);
  }
  return undefined;
}