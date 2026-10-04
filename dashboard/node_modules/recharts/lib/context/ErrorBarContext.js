"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportErrorBarSettings = ReportErrorBarSettings;
exports.SetErrorBarContext = SetErrorBarContext;
exports.useErrorBarContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _errorBarSlice = require("../state/errorBarSlice");
var _hooks = require("../state/hooks");
var _RegisterGraphicalItemId = require("./RegisterGraphicalItemId");
var _excluded = ["children"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var initialContextState = {
  data: [],
  xAxisId: 'xAxis-0',
  yAxisId: 'yAxis-0',
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
};
var ErrorBarContext = /*#__PURE__*/(0, _react.createContext)(initialContextState);
function SetErrorBarContext(props) {
  var children = props.children,
    rest = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(ErrorBarContext.Provider, {
    value: rest
  }, children);
}
var useErrorBarContext = () => (0, _react.useContext)(ErrorBarContext);
exports.useErrorBarContext = useErrorBarContext;
function ReportErrorBarSettings(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var graphicalItemId = (0, _RegisterGraphicalItemId.useGraphicalItemId)();
  var prevPropsRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (graphicalItemId == null) {
      // ErrorBar outside a graphical item context does not do anything.
      return;
    }
    if (prevPropsRef.current === null) {
      dispatch((0, _errorBarSlice.addErrorBar)({
        itemId: graphicalItemId,
        errorBar: props
      }));
    } else if (prevPropsRef.current !== props) {
      dispatch((0, _errorBarSlice.replaceErrorBar)({
        itemId: graphicalItemId,
        prev: prevPropsRef.current,
        next: props
      }));
    }
    prevPropsRef.current = props;
  }, [dispatch, graphicalItemId, props]);
  (0, _react.useEffect)(() => {
    return () => {
      if (prevPropsRef.current != null && graphicalItemId != null) {
        dispatch((0, _errorBarSlice.removeErrorBar)({
          itemId: graphicalItemId,
          errorBar: prevPropsRef.current
        }));
        prevPropsRef.current = null;
      }
    };
  }, [dispatch, graphicalItemId]);
  return null;
}