var _excluded = ["component"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @fileOverview Customized
 */
import * as React from 'react';
import { isValidElement, cloneElement, createElement } from 'react';
import { Layer } from '../container/Layer';
import { warn } from '../util/LogUtils';
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
export function Customized(_ref) {
  var component = _ref.component,
    props = _objectWithoutProperties(_ref, _excluded);
  var child;
  if (/*#__PURE__*/isValidElement(component)) {
    child = /*#__PURE__*/cloneElement(component, props);
  } else if (typeof component === 'function') {
    // @ts-expect-error TS cannot verify that C is FunctionComponent<P> here
    child = /*#__PURE__*/createElement(component, props);
  } else {
    warn(false, "Customized's props `component` must be React.element or Function, but got %s.", typeof component);
  }
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-customized-wrapper"
  }, child);
}
Customized.displayName = 'Customized';