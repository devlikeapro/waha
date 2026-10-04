"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZAxis = ZAxis;
exports.zAxisDefaultProps = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _cartesianAxisSlice = require("../state/cartesianAxisSlice");
var _hooks = require("../state/hooks");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function SetZAxisSettings(settings) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var prevSettingsRef = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(() => {
    if (prevSettingsRef.current === null) {
      dispatch((0, _cartesianAxisSlice.addZAxis)(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch((0, _cartesianAxisSlice.replaceZAxis)({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch((0, _cartesianAxisSlice.removeZAxis)(prevSettingsRef.current));
        prevSettingsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
var zAxisDefaultProps = exports.zAxisDefaultProps = {
  zAxisId: 0,
  range: _axisSelectors.implicitZAxis.range,
  scale: _axisSelectors.implicitZAxis.scale,
  type: _axisSelectors.implicitZAxis.type
};

/**
 * Virtual axis, does not render anything itself. Has no ticks, grid lines, or labels.
 * Useful for dynamically setting Scatter point size, based on data.
 *
 * @consumes CartesianViewBoxContext
 */
function ZAxis(outsideProps) {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, zAxisDefaultProps);
  return /*#__PURE__*/React.createElement(SetZAxisSettings, {
    domain: props.domain,
    id: props.zAxisId,
    dataKey: props.dataKey,
    name: props.name,
    unit: props.unit,
    range: props.range,
    scale: props.scale,
    type: props.type,
    allowDuplicatedCategory: _axisSelectors.implicitZAxis.allowDuplicatedCategory,
    allowDataOverflow: _axisSelectors.implicitZAxis.allowDataOverflow,
    reversed: _axisSelectors.implicitZAxis.reversed,
    includeHidden: _axisSelectors.implicitZAxis.includeHidden
  });
}
ZAxis.displayName = 'ZAxis';