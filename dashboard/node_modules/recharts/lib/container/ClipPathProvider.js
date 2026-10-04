"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClipPathId = exports.ClipPathProvider = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _DataUtils = require("../util/DataUtils");
var _hooks = require("../hooks");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var ClipPathIdContext = /*#__PURE__*/(0, _react.createContext)(undefined);

/**
 * Generates a unique clip path ID for use in SVG elements,
 * and puts it in a context provider.
 *
 * To read the clip path ID, use the `useClipPathId` hook,
 * or render `<ClipPath>` component which will automatically use the ID from this context.
 *
 * @param props children - React children to be wrapped by the provider
 * @returns React Context Provider
 */
var ClipPathProvider = _ref => {
  var children = _ref.children;
  var _useState = (0, _react.useState)("".concat((0, _DataUtils.uniqueId)('recharts'), "-clip")),
    _useState2 = _slicedToArray(_useState, 1),
    clipPathId = _useState2[0];
  var plotArea = (0, _hooks.usePlotArea)();
  if (plotArea == null) {
    return null;
  }
  var x = plotArea.x,
    y = plotArea.y,
    width = plotArea.width,
    height = plotArea.height;
  return /*#__PURE__*/React.createElement(ClipPathIdContext.Provider, {
    value: clipPathId
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: clipPathId
  }, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y,
    height: height,
    width: width
  }))), children);
};
exports.ClipPathProvider = ClipPathProvider;
var useClipPathId = () => {
  return (0, _react.useContext)(ClipPathIdContext);
};
exports.useClipPathId = useClipPathId;