"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isoSpecifier = exports.default = void 0;
var _defaultLocale = require("./defaultLocale.js");
var isoSpecifier = exports.isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
function formatIsoNative(date) {
  return date.toISOString();
}
var formatIso = Date.prototype.toISOString ? formatIsoNative : (0, _defaultLocale.utcFormat)(isoSpecifier);
var _default = exports.default = formatIso;