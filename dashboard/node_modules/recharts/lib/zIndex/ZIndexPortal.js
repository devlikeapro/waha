"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllZIndexPortals = AllZIndexPortals;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _hooks = require("../state/hooks");
var _zIndexSlice = require("../state/zIndexSlice");
var _zIndexSelectors = require("./zIndexSelectors");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ZIndexSvgPortal(_ref) {
  var zIndex = _ref.zIndex,
    isPanorama = _ref.isPanorama;
  var ref = (0, _react.useRef)(null);
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useLayoutEffect)(() => {
    if (ref.current) {
      dispatch((0, _zIndexSlice.registerZIndexPortalElement)({
        zIndex,
        element: ref.current,
        isPanorama
      }));
    }
    return () => {
      dispatch((0, _zIndexSlice.unregisterZIndexPortalElement)({
        zIndex,
        isPanorama
      }));
    };
  }, [dispatch, zIndex, isPanorama]);
  // these g elements should not be tabbable
  return /*#__PURE__*/React.createElement("g", {
    tabIndex: -1,
    ref: ref,
    className: "recharts-zIndex-layer_".concat(zIndex)
  });
}
function AllZIndexPortals(_ref2) {
  var children = _ref2.children,
    isPanorama = _ref2.isPanorama;
  var allRegisteredZIndexes = (0, _hooks.useAppSelector)(_zIndexSelectors.selectAllRegisteredZIndexes);
  if (!allRegisteredZIndexes || allRegisteredZIndexes.length === 0) {
    return children;
  }
  var allNegativeZIndexes = allRegisteredZIndexes.filter(zIndex => zIndex < 0);
  // We exclude zero on purpose - that is the default layer, and it doesn't need a portal.
  var allPositiveZIndexes = allRegisteredZIndexes.filter(zIndex => zIndex > 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, allNegativeZIndexes.map(zIndex => /*#__PURE__*/React.createElement(ZIndexSvgPortal, {
    key: zIndex,
    zIndex: zIndex,
    isPanorama: isPanorama
  })), children, allPositiveZIndexes.map(zIndex => /*#__PURE__*/React.createElement(ZIndexSvgPortal, {
    key: zIndex,
    zIndex: zIndex,
    isPanorama: isPanorama
  })));
}