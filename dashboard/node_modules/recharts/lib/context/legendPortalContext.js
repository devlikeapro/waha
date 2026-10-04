"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLegendPortal = exports.LegendPortalContext = void 0;
var _react = require("react");
var LegendPortalContext = exports.LegendPortalContext = /*#__PURE__*/(0, _react.createContext)(null);
var useLegendPortal = () => (0, _react.useContext)(LegendPortalContext);
exports.useLegendPortal = useLegendPortal;