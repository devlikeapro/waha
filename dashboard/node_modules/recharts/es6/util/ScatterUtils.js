var _excluded = ["option"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { Symbols } from '../shape/Symbols';
import { Shape } from './ActiveShapeUtils';
import { DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME } from './Constants';
function renderSymbols(props) {
  return /*#__PURE__*/React.createElement(Symbols, props);
}
export function ScatterSymbol(_ref) {
  var option = _ref.option,
    props = _objectWithoutProperties(_ref, _excluded);
  if (typeof option === 'string') {
    return /*#__PURE__*/React.createElement(Shape, {
      option: /*#__PURE__*/React.createElement(Symbols, _extends({
        type: option
      }, props)),
      DefaultShape: renderSymbols,
      shapeProps: props
    });
  }
  return /*#__PURE__*/React.createElement(Shape, {
    option: option,
    DefaultShape: renderSymbols,
    shapeProps: props
  });
}