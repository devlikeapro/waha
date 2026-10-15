"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Shape = Shape;
exports.getPropsFromShapeOption = getPropsFromShapeOption;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _Layer = require("../container/Layer");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * This is an abstraction for rendering a user defined prop for a customized shape in several forms.
 *
 * <Shape /> is the root and will handle taking in:
 *  - an object of svg properties
 *  - a boolean
 *  - a render prop(inline function that returns jsx)
 *  - a React element
 *
 * The concrete default shape is supplied by the caller so this helper does not
 * import unrelated shapes and accidentally couple bundles together.
 */

function mergeShapeProps(option, props) {
  return _objectSpread(_objectSpread({}, props), option);
}
function getPropsFromShapeOption(option) {
  if (/*#__PURE__*/(0, _react.isValidElement)(option)) {
    return option.props;
  }
  return option;
}
function renderWithShapeElement(option, props) {
  return /*#__PURE__*/(0, _react.cloneElement)(option, mergeShapeProps(getPropsFromShapeOption(option), props));
}
function getShapeIndex(shapeProps) {
  if (!('index' in shapeProps)) {
    return undefined;
  }
  var index = shapeProps.index;
  return typeof index === 'number' || typeof index === 'string' ? index : undefined;
}
function isActiveShape(shapeProps) {
  return 'isActive' in shapeProps && shapeProps.isActive === true;
}

/**
 * Renders the user-provided active shape option while keeping each runtime branch aligned with its TypeScript type.
 *
 * The `option` prop supports four shapes:
 * - React element: clone it and let its own props override the injected ones
 * - function: call it with the forwarded props and optional index
 * - plain object: merge it into the default shape props
 * - boolean / undefined: ignore it and render the default shape with the forwarded props
 */
function Shape(_ref) {
  var option = _ref.option,
    DefaultShape = _ref.DefaultShape,
    shapeProps = _ref.shapeProps,
    _ref$activeClassName = _ref.activeClassName,
    activeClassName = _ref$activeClassName === void 0 ? 'recharts-active-shape' : _ref$activeClassName,
    _ref$inActiveClassNam = _ref.inActiveClassName,
    inActiveClassName = _ref$inActiveClassNam === void 0 ? 'recharts-shape' : _ref$inActiveClassNam;
  var index = getShapeIndex(shapeProps);
  var shape;
  if (/*#__PURE__*/(0, _react.isValidElement)(option)) {
    shape = renderWithShapeElement(option, shapeProps);
  } else if (option === DefaultShape) {
    shape = /*#__PURE__*/React.createElement(DefaultShape, shapeProps);
  } else if (typeof option === 'function') {
    shape = option(shapeProps, index);
  } else if (typeof option === 'object') {
    shape = /*#__PURE__*/React.createElement(DefaultShape, mergeShapeProps(option, shapeProps));
  } else {
    shape = /*#__PURE__*/React.createElement(DefaultShape, shapeProps);
  }
  if (isActiveShape(shapeProps)) {
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: activeClassName
    }, shape);
  }
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: inActiveClassName
  }, shape);
}