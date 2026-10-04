"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RechartsStoreProvider = RechartsStoreProvider;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _reactRedux = require("react-redux");
var _store = require("./store");
var _PanoramaContext = require("../context/PanoramaContext");
var _RechartsReduxContext = require("./RechartsReduxContext");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function RechartsStoreProvider(_ref) {
  var preloadedState = _ref.preloadedState,
    children = _ref.children,
    reduxStoreName = _ref.reduxStoreName;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  /*
   * Why the ref? Redux official documentation recommends to use store as a singleton,
   * and reuse that everywhere: https://redux-toolkit.js.org/api/configureStore#basic-example
   *
   * Which is correct! Except that is considering deploying Redux in an app.
   * Recharts as a library supports multiple charts on the same page.
   * And each of these charts needs its own store independent of others!
   *
   * The alternative is to have everything in the store keyed by the chart id.
   * Which would make working with everything a little bit more painful because we need the chart id everywhere.
   */
  var storeRef = (0, _react.useRef)(null);

  /*
   * Panorama means that this chart is not its own chart, it's only a "preview"
   * being rendered as a child of Brush.
   * In such case, it should not have a store on its own - it should implicitly inherit
   * whatever data is in the "parent" or "root" chart.
   * Which here is represented by not having a Provider at all. All selectors will use the root store by default.
   */
  if (isPanorama) {
    return children;
  }
  if (storeRef.current == null) {
    storeRef.current = (0, _store.createRechartsStore)(preloadedState, reduxStoreName);
  }

  // @ts-expect-error React-Redux types demand that the context internal value is not null, but we have that as default.
  var nonNullContext = _RechartsReduxContext.RechartsReduxContext;
  return /*#__PURE__*/React.createElement(_reactRedux.Provider, {
    context: nonNullContext,
    store: storeRef.current
  }, children);
}