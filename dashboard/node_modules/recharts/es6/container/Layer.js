var _excluded = ["children", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { clsx } from 'clsx';
import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents';
/**
 * Creates an SVG group element to group other SVG elements.
 *
 * Useful if you want to apply transformations or styles to a set of elements
 * without affecting other elements in the SVG.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/g
 */
export var Layer = /*#__PURE__*/React.forwardRef((props, ref) => {
  var children = props.children,
    className = props.className,
    others = _objectWithoutProperties(props, _excluded);
  var layerClass = clsx('recharts-layer', className);
  return /*#__PURE__*/React.createElement("g", _extends({
    className: layerClass
  }, svgPropertiesAndEvents(others), {
    ref: ref
  }), children);
});