"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _constant = _interopRequireDefault(require("./constant"));
var _point = require("./point");
var _Diagram = _interopRequireWildcard(require("./Diagram"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _default() {
  var x = _point.x,
    y = _point.y,
    extent = null;
  function voronoi(data) {
    return new _Diagram.default(data.map(function (d, i) {
      var s = [Math.round(x(d, i, data) / _Diagram.epsilon) * _Diagram.epsilon, Math.round(y(d, i, data) / _Diagram.epsilon) * _Diagram.epsilon];
      s.index = i;
      s.data = d;
      return s;
    }), extent);
  }
  voronoi.polygons = function (data) {
    return voronoi(data).polygons();
  };
  voronoi.links = function (data) {
    return voronoi(data).links();
  };
  voronoi.triangles = function (data) {
    return voronoi(data).triangles();
  };
  voronoi.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), voronoi) : x;
  };
  voronoi.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), voronoi) : y;
  };
  voronoi.extent = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
  };
  voronoi.size = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
  };
  return voronoi;
}