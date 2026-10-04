"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegisterGraphicalItemId = void 0;
exports.useGraphicalItemId = useGraphicalItemId;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _useUniqueId = require("../util/useUniqueId");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var GraphicalItemIdContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var RegisterGraphicalItemId = _ref => {
  var id = _ref.id,
    type = _ref.type,
    children = _ref.children;
  var resolvedId = (0, _useUniqueId.useUniqueId)("recharts-".concat(type), id);
  return /*#__PURE__*/React.createElement(GraphicalItemIdContext.Provider, {
    value: resolvedId
  }, children(resolvedId));
};
exports.RegisterGraphicalItemId = RegisterGraphicalItemId;
function useGraphicalItemId() {
  return (0, _react.useContext)(GraphicalItemIdContext);
}