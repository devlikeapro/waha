"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Customized = Customized;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _Layer = require("../container/Layer");
var _LogUtils = require("../util/LogUtils");
var _excluded = ["component"];
/**
 * @fileOverview Customized
 */
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * Customized component used to be necessary to render custom elements in Recharts 2.x.
 * Starting from Recharts 3.x, all charts are able to render arbitrary elements anywhere,
 * and Customized is no longer needed.
 *
 * @example Before: `<Customized component={<MyCustomComponent />} />`
 * @example After: `<MyCustomComponent />`
 *
 * @deprecated Just render your components directly. Will be removed in 4.0
 */
function Customized(_ref) {
  var component = _ref.component,
    props = _objectWithoutProperties(_ref, _excluded);
  var child;
  if (/*#__PURE__*/(0, _react.isValidElement)(component)) {
    child = /*#__PURE__*/(0, _react.cloneElement)(component, props);
  } else if (typeof component === 'function') {
    // @ts-expect-error TS cannot verify that C is FunctionComponent<P> here
    child = /*#__PURE__*/(0, _react.createElement)(component, props);
  } else {
    (0, _LogUtils.warn)(false, "Customized's props `component` must be React.element or Function, but got %s.", typeof component);
  }
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: "recharts-customized-wrapper"
  }, child);
}
Customized.displayName = 'Customized';