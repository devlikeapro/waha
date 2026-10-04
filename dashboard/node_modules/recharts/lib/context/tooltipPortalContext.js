"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTooltipPortal = exports.TooltipPortalContext = void 0;
var _react = require("react");
var TooltipPortalContext = exports.TooltipPortalContext = /*#__PURE__*/(0, _react.createContext)(null);
var useTooltipPortal = () => (0, _react.useContext)(TooltipPortalContext);
exports.useTooltipPortal = useTooltipPortal;