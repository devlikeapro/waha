"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphicalItemClipPath = GraphicalItemClipPath;
exports.useNeedsClip = useNeedsClip;
var React = _interopRequireWildcard(require("react"));
var _hooks = require("../state/hooks");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _hooks2 = require("../hooks");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function useNeedsClip(xAxisId, yAxisId) {
  var _xAxis$allowDataOverf, _yAxis$allowDataOverf;
  var xAxis = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisSettings)(state, xAxisId));
  var yAxis = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectYAxisSettings)(state, yAxisId));
  var needClipX = (_xAxis$allowDataOverf = xAxis === null || xAxis === void 0 ? void 0 : xAxis.allowDataOverflow) !== null && _xAxis$allowDataOverf !== void 0 ? _xAxis$allowDataOverf : _axisSelectors.implicitXAxis.allowDataOverflow;
  var needClipY = (_yAxis$allowDataOverf = yAxis === null || yAxis === void 0 ? void 0 : yAxis.allowDataOverflow) !== null && _yAxis$allowDataOverf !== void 0 ? _yAxis$allowDataOverf : _axisSelectors.implicitYAxis.allowDataOverflow;
  var needClip = needClipX || needClipY;
  return {
    needClip,
    needClipX,
    needClipY
  };
}
function GraphicalItemClipPath(_ref) {
  var xAxisId = _ref.xAxisId,
    yAxisId = _ref.yAxisId,
    clipPathId = _ref.clipPathId;
  var plotArea = (0, _hooks2.usePlotArea)();
  var _useNeedsClip = useNeedsClip(xAxisId, yAxisId),
    needClipX = _useNeedsClip.needClipX,
    needClipY = _useNeedsClip.needClipY,
    needClip = _useNeedsClip.needClip;
  var xAxisRange = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisRange)(state, xAxisId, false));
  var yAxisRange = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectYAxisRange)(state, yAxisId, false));
  if (!needClip || !plotArea) {
    return null;
  }
  var x = plotArea.x,
    y = plotArea.y,
    width = plotArea.width,
    height = plotArea.height;
  var clipX = needClipX && xAxisRange ? Math.min(xAxisRange[0], xAxisRange[1]) : x - width / 2;
  var clipY = needClipY && yAxisRange ? Math.min(yAxisRange[0], yAxisRange[1]) : y - height / 2;
  var clipWidth = needClipX && xAxisRange ? Math.abs(xAxisRange[1] - xAxisRange[0]) : width * 2;
  var clipHeight = needClipY && yAxisRange ? Math.abs(yAxisRange[1] - yAxisRange[0]) : height * 2;
  return /*#__PURE__*/React.createElement("clipPath", {
    id: "clipPath-".concat(clipPathId)
  }, /*#__PURE__*/React.createElement("rect", {
    x: clipX,
    y: clipY,
    width: clipWidth,
    height: clipHeight
  }));
}