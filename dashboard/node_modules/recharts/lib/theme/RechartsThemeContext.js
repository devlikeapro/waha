"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRechartsTheme = exports.RechartsThemeProvider = void 0;
var _react = require("react");
var _legacyTheme = require("./legacyTheme");
var RechartsThemeContext = /*#__PURE__*/(0, _react.createContext)(_legacyTheme.legacyTheme);

/**
 * Applies the provided theme to all charts in the children tree.
 *
 * @experimental
 */
var RechartsThemeProvider = exports.RechartsThemeProvider = RechartsThemeContext.Provider;

/**
 * Reads the currently active theme in the children tree.
 *
 * @experimental
 */
var useRechartsTheme = () => (0, _react.useContext)(RechartsThemeContext);
exports.useRechartsTheme = useRechartsTheme;