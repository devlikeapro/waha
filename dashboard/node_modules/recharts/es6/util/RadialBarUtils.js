var _excluded = ["option"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { Sector } from '../shape/Sector';
import { Shape } from './ActiveShapeUtils';
export var defaultRadialBarShape = Sector;
export function parseCornerRadius(cornerRadius) {
  if (typeof cornerRadius === 'string') {
    return parseInt(cornerRadius, 10);
  }
  return cornerRadius;
}
export function RadialBarSector(_ref) {
  var option = _ref.option,
    shapeProps = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(Shape, {
    option: option,
    DefaultShape: defaultRadialBarShape,
    shapeProps: shapeProps
  });
}