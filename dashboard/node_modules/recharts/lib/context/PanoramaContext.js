"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIsPanorama = exports.PanoramaContextProvider = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var PanoramaContext = /*#__PURE__*/(0, _react.createContext)(null);
var useIsPanorama = () => (0, _react.useContext)(PanoramaContext) != null;
exports.useIsPanorama = useIsPanorama;
var PanoramaContextProvider = _ref => {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement(PanoramaContext.Provider, {
    value: true
  }, children);
};
exports.PanoramaContextProvider = PanoramaContextProvider;